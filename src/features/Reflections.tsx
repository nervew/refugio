import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { PageTitle, PrivateGate, EmptyState, TextField } from '../app/components';
import { useAction, useDraftState, useVault } from '../app/context';
import { vault } from '../security/vault';
import { type Reflection, splitLines } from '../domain/model';
import { newId, now, saveReflection } from '../domain/actions';
import { skills, getSkill } from '../content/skills';
const empty = (): Reflection => ({
  id: newId(),
  createdAt: now(),
  updatedAt: now(),
  vulnerabilities: [],
  emotions: [],
  thoughts: [],
  bodySensations: [],
  impulses: [],
  skillIds: [],
});
export function Reflections() {
  return (
    <PrivateGate>
      <ReflectionList />
    </PrivateGate>
  );
}
function ReflectionList() {
  const { data } = useVault();
  const [query] = useSearchParams();
  const [editing, setEditing] = useState<Reflection | null>(() => {
    const skill = getSkill(query.get('skill') ?? '');
    return skill ? { ...empty(), skillIds: [skill.id] } : null;
  });
  const [page, setPage] = useState(0);
  const { run, busy } = useAction();
  if (!data) return null;
  if (editing)
    return <ReflectionEditor key={editing.id} initial={editing} onClose={() => setEditing(null)} />;
  const all = [...data.reflections].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const list = all.slice(page * 20, (page + 1) * 20);
  return (
    <>
      <PageTitle
        eyebrow="Cuando tengas espacio"
        description="Un lugar para recordar qué pasó y qué te ayudó. No hay respuestas correctas; escribir es siempre opcional."
      >
        Mi registro y reflexión
      </PageTitle>
      <div className="section-heading">
        <p>{all.length} experiencias guardadas</p>
        <button
          className="button primary"
          disabled={all.length >= 200}
          onClick={() => setEditing(empty())}
        >
          <Plus size={18} aria-hidden="true" /> Nueva reflexión
        </button>
      </div>
      {!all.length && (
        <EmptyState title="Puedes volver cuando quieras">
          <p>No necesitas registrar cada crisis. Este espacio está aquí cuando te resulte útil.</p>
        </EmptyState>
      )}
      <div className="reflection-list">
        {list.map((item) => (
          <article className="panel" key={item.id}>
            <p className="eyebrow">
              {new Date(item.occurredAt ?? item.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h2>{item.situation || 'Una experiencia que quiero recordar'}</h2>
            {item.learning && <p>{item.learning}</p>}
            <div className="tag-row">
              {item.skillIds.map((id) => (
                <span className="tag" key={id}>
                  {getSkill(id)?.title}
                </span>
              ))}
            </div>
            <div className="button-row">
              <button className="button secondary" onClick={() => setEditing(item)}>
                Ver y editar reflexión
              </button>
              <button
                className="text-button danger-text"
                disabled={busy}
                onClick={async () => {
                  if (
                    window.confirm(
                      '¿Eliminar esta reflexión? No habrá una papelera para recuperarla.',
                    )
                  )
                    await run(
                      () =>
                        vault.change((d) => {
                          d.reflections = d.reflections.filter((r) => r.id !== item.id);
                        }),
                      'Reflexión eliminada.',
                    );
                }}
              >
                Eliminar reflexión
              </button>
            </div>
          </article>
        ))}
      </div>
      {all.length > 20 && (
        <nav className="button-row" aria-label="Páginas del registro">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            Anterior
          </button>
          <span>Página {page + 1}</span>
          <button disabled={(page + 1) * 20 >= all.length} onClick={() => setPage(page + 1)}>
            Siguiente
          </button>
        </nav>
      )}
    </>
  );
}
function ReflectionEditor({ initial, onClose }: { initial: Reflection; onClose: () => void }) {
  const { draft, setDraft, clean, changed } = useDraftState(structuredClone(initial));
  const { run, busy } = useAction();
  const patch = (p: Partial<Reflection>) => setDraft({ ...draft, ...p });
  const labels = {
    vulnerabilities: 'Vulnerabilidades presentes',
    emotions: 'Emociones',
    thoughts: 'Pensamientos',
    bodySensations: 'Sensaciones corporales',
    impulses: 'Impulsos',
  } as const;
  return (
    <section className="narrow">
      <button
        className="text-button"
        onClick={() => {
          if (!changed || window.confirm('¿Salir sin guardar esta reflexión?')) {
            clean();
            onClose();
          }
        }}
      >
        <ArrowLeft size={18} aria-hidden="true" /> Volver al registro
      </button>
      <PageTitle
        eyebrow="Sin prisa, sin juicio"
        description="Puedes omitir cualquier campo. La intensidad no representa riesgo ni un diagnóstico."
      >
        Mi reflexión
      </PageTitle>
      <form
        className="panel form-stack"
        onSubmit={async (e) => {
          e.preventDefault();
          const reflection = {
            ...draft,
            ...Object.fromEntries(
              Object.keys(labels).map((key) => [
                key,
                splitLines(draft[key as keyof typeof labels].join('\n')),
              ]),
            ),
            updatedAt: now(),
          };
          if (await run(() => vault.change((d) => saveReflection(d, reflection)))) {
            clean();
            onClose();
          }
        }}
      >
        <TextField
          label="Situación (opcional)"
          multiline
          maxLength={4000}
          value={draft.situation ?? ''}
          onChange={(situation) => patch({ situation })}
        />
        <label className="field">
          Cuándo ocurrió (opcional)
          <input
            type="datetime-local"
            defaultValue={
              draft.occurredAt
                ? new Date(
                    new Date(draft.occurredAt).getTime() -
                      new Date(draft.occurredAt).getTimezoneOffset() * 60000,
                  )
                    .toISOString()
                    .slice(0, 16)
                : ''
            }
            onChange={(e) =>
              patch({
                occurredAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              })
            }
          />
        </label>
        {Object.entries(labels).map(([key, label]) => (
          <TextField
            key={key}
            label={label}
            multiline
            maxLength={25000}
            value={draft[key as keyof typeof labels].join('\n')}
            onChange={(value) => patch({ [key]: value.split('\n') })}
            help="Una idea por línea, hasta 50; máximo 500 caracteres por idea."
          />
        ))}
        <TextField
          label="Desencadenante"
          multiline
          value={draft.trigger ?? ''}
          onChange={(trigger) => patch({ trigger })}
          help="El acontecimiento que precedió al cambio; se distingue de las condiciones previas."
        />
        <fieldset>
          <legend>Habilidades que elegí (opcional)</legend>
          <div className="choice-grid">
            {skills.map((skill) => (
              <label className="check" key={skill.id}>
                <input
                  type="checkbox"
                  checked={draft.skillIds.includes(skill.id)}
                  onChange={(e) =>
                    patch({
                      skillIds: e.target.checked
                        ? [...draft.skillIds, skill.id]
                        : draft.skillIds.filter((id) => id !== skill.id),
                    })
                  }
                />
                <span>{skill.title}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="two-columns">
          {(['intensityBefore', 'intensityAfter'] as const).map((key) => (
            <label className="field" key={key}>
              Intensidad {key === 'intensityBefore' ? 'antes' : 'después'}
              <select
                value={draft[key] ?? ''}
                onChange={(e) =>
                  patch({ [key]: e.target.value === '' ? undefined : Number(e.target.value) })
                }
              >
                <option value="">Prefiero omitir / no sé</option>
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                    {i === 0
                      ? ' · sin intensidad percibida'
                      : i === 10
                        ? ' · máxima intensidad que percibo'
                        : ''}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <TextField
          label="Resultados (opcional)"
          multiline
          maxLength={4000}
          value={draft.outcome ?? ''}
          onChange={(outcome) => patch({ outcome })}
          help="No me ayudó también es una respuesta válida."
        />
        <TextField
          label="Lo que quiero recordar (opcional)"
          multiline
          maxLength={4000}
          value={draft.learning ?? ''}
          onChange={(learning) => patch({ learning })}
        />
        <button className="button primary" disabled={busy}>
          {busy ? 'Guardando…' : 'Guardar mi reflexión'}
        </button>
      </form>
    </section>
  );
}
