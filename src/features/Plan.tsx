import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { PageTitle, PrivateGate, PrivacyNote } from '../app/components';
import { SafeLink, useAction, useDraftState, useVault } from '../app/context';
import { planFields, type PlanField, type PlanItem } from '../domain/model';
import { newId, now } from '../domain/actions';
import { vault } from '../security/vault';
import { useReturnHomeAfterSave } from '../app/save-navigation';
import { skills } from '../content/skills';
const planGroups: { id: string; title: string; fields: PlanField[] }[] = [
  {
    id: 'help',
    title: 'Lo que me ayuda',
    fields: ['safetySteps', 'helpfulStrategies', 'unhelpfulStrategies'],
  },
  {
    id: 'notice',
    title: 'Lo que noto',
    fields: [
      'earlySignals',
      'frequentEmotions',
      'thoughts',
      'bodySensations',
      'impulses',
      'vulnerabilities',
      'triggers',
    ],
  },
];
export function Plan() {
  return (
    <PrivateGate>
      <PlanOverview />
    </PrivateGate>
  );
}
function PlanOverview() {
  const { data } = useVault();
  if (!data) return null;
  return (
    <>
      <PageTitle
        eyebrow="Preparar en calma"
        description="Tu lista de recordatorios, pasos y contactos para consultar cuando tus emociones se sientan difíciles de manejar. Todo es opcional."
      >
        Mi plan personal
      </PageTitle>
      <div className="section-heading">
        <p className="muted">
          <LockKeyhole size={16} aria-hidden="true" /> Solo visible con tu plan abierto
        </p>
        <SafeLink className="button secondary" to="/crisis">
          Ver mis pasos para un momento difícil <ArrowRight size={18} aria-hidden="true" />
        </SafeLink>
      </div>
      <section className="panel" aria-labelledby="plan-start">
        <h2 id="plan-start">Puedes empezar con una sola idea</h2>
        <p>
          Escribe un paso que quieras recordar o añade un contacto. Puedes dejar el resto vacío y
          volver cuando quieras.
        </p>
        <div className="button-row">
          <SafeLink to="/plan/safetySteps" className="button primary">
            Escribir un paso para recordar
          </SafeLink>
          <SafeLink to="/support" className="button secondary">
            Añadir un contacto
          </SafeLink>
        </div>
      </section>
      {planGroups.map((group) => (
        <section className="section-space" key={group.id} aria-labelledby={`plan-${group.id}`}>
          <h2 id={`plan-${group.id}`}>{group.title}</h2>
          <div className="plan-grid">
            {group.fields.map((key) => {
              const [label, help] = planFields[key];
              const count = data.plan[key].length;
              return (
                <SafeLink to={`/plan/${key}`} className="plan-card" key={key}>
                  <div>
                    <h3>{label}</h3>
                    <p>{help}</p>
                    <span className="tag">
                      {count
                        ? `${count} ${count === 1 ? 'nota guardada' : 'notas guardadas'}`
                        : 'Opcional · puedes dejarlo vacío'}
                    </span>
                  </div>
                  <ArrowRight size={19} aria-hidden="true" />
                </SafeLink>
              );
            })}
          </div>
        </section>
      ))}
      <section className="section-space" aria-labelledby="plan-people">
        <h2 id="plan-people">A quién puedo acudir</h2>
        <div className="plan-grid">
          <SafeLink to="/support" className="plan-card">
            <div>
              <h3>Mis contactos</h3>
              <p>
                Personas de confianza y profesionales, si ya recibes atención. Puedes añadirlos
                cuando quieras.
              </p>
            </div>
            <ArrowRight aria-hidden="true" />
          </SafeLink>
          <SafeLink to="/emergency" className="plan-card">
            <div>
              <h3>Líneas de atención y urgencias</h3>
              <p>
                Consulta los recursos disponibles donde estás. No necesitas crear un plan para
                verlos.
              </p>
            </div>
            <ArrowRight aria-hidden="true" />
          </SafeLink>
        </div>
      </section>
      <FavoriteSkills />
      <PrivacyNote />
    </>
  );
}
function FavoriteSkills() {
  const returnHome = useReturnHomeAfterSave();
  const { data } = useVault();
  const { run, busy } = useAction();
  const { draft, setDraft, clean } = useDraftState(data!.plan.prioritySkillIds);
  return (
    <form
      className="panel section-space"
      onSubmit={async (e) => {
        e.preventDefault();
        if (
          await run(() =>
            vault.change((d) => {
              d.plan.prioritySkillIds = draft;
              d.plan.updatedAt = now();
            }),
          )
        ) {
          clean();
          returnHome();
        }
      }}
    >
      <h2>Guías que quiero tener a mano</h2>
      <p>
        Marca tus preferidas. La primera elegida será tu guía inicial si no preparaste pasos
        propios.
      </p>
      <div className="choice-grid">
        {skills.map((s) => (
          <label className="check" key={s.id}>
            <input
              type="checkbox"
              checked={draft.includes(s.id)}
              onChange={(e) =>
                setDraft(e.target.checked ? [...draft, s.id] : draft.filter((id) => id !== s.id))
              }
            />
            <span>
              {s.title}
              {draft[0] === s.id ? ' · primera opción' : ''}
            </span>
          </label>
        ))}
      </div>
      <button className="button primary" disabled={busy}>
        Guardar preferencias y volver al inicio
      </button>
    </form>
  );
}
export function PlanSection() {
  const { field = '' } = useParams();
  return (
    <PrivateGate>
      {field in planFields ? (
        <SectionEditor key={field} field={field as PlanField} />
      ) : (
        <>
          <PageTitle>Sección no disponible</PageTitle>
          <SafeLink to="/plan">Volver a mi plan</SafeLink>
        </>
      )}
    </PrivateGate>
  );
}
function SectionEditor({ field }: { field: PlanField }) {
  const returnHome = useReturnHomeAfterSave();
  const [focusNote, setFocusNote] = useState<string | null>(null);
  useEffect(() => {
    if (focusNote) document.getElementById(`note-${focusNote}`)?.focus();
  }, [focusNote]);
  const { data } = useVault();
  const { busy, run } = useAction();
  const { draft, setDraft, clean, changed } = useDraftState<PlanItem[]>(
    structuredClone(data!.plan[field]),
  );
  const [label, help] = planFields[field];
  const max = field === 'safetySteps' ? 3 : 50;
  function move(index: number, direction: number) {
    const list = [...draft];
    [list[index], list[index + direction]] = [list[index + direction], list[index]];
    setDraft(list);
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const items = draft
      .filter((i) => i.text.trim())
      .map((i, order) => ({ ...i, text: i.text.trim(), order }));
    if (
      await run(() =>
        vault.change((d) => {
          d.plan[field] = items;
          d.plan.updatedAt = now();
        }),
      )
    ) {
      setDraft(items);
      clean();
      returnHome();
    }
  }
  return (
    <section className="narrow">
      <SafeLink to="/plan" className="back-link">
        ← Mi plan personal
      </SafeLink>
      <PageTitle eyebrow="Una cosa a la vez" description={help}>
        {label}
      </PageTitle>
      <form onSubmit={save} className="form-stack">
        <p className="muted">
          Todo es opcional. Una idea breve por nota, máximo 500 caracteres.{' '}
          {field === 'safetySteps' &&
            'Estos pasos aparecerán primero al consultar tu guía para un momento difícil.'}
        </p>
        {draft.length === 0 && (
          <p className="muted">Todavía no has añadido notas. Puedes empezar con una sola idea.</p>
        )}
        {draft.map((item, index) => (
          <div className="panel editable-note" key={item.id}>
            <label htmlFor={`note-${item.id}`}>
              {label} · nota {index + 1}
            </label>
            <textarea
              id={`note-${item.id}`}
              value={item.text}
              maxLength={500}
              rows={3}
              onChange={(e) =>
                setDraft(draft.map((i) => (i.id === item.id ? { ...i, text: e.target.value } : i)))
              }
            />
            <div className="button-row">
              <button
                type="button"
                disabled={index === 0}
                className="icon-button"
                aria-label={`Subir nota ${index + 1}`}
                onClick={() => move(index, -1)}
              >
                <ArrowUp size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={index === draft.length - 1}
                className="icon-button"
                aria-label={`Bajar nota ${index + 1}`}
                onClick={() => move(index, 1)}
              >
                <ArrowDown size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => setDraft(draft.filter((i) => i.id !== item.id))}
              >
                <Trash2 size={17} aria-hidden="true" /> Quitar nota {index + 1}
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="button secondary"
          disabled={draft.length >= max}
          onClick={() => {
            const id = newId();
            setDraft([...draft, { id, text: '', order: draft.length }]);
            setFocusNote(id);
          }}
        >
          <Plus size={18} aria-hidden="true" />{' '}
          {draft.length ? 'Agregar otra nota' : 'Escribir mi primera nota'}
        </button>
        {draft.length >= max && <p>Límite: {max} notas. No se borrarán notas automáticamente.</p>}
        <div className="save-row">
          <button className="button primary" disabled={busy}>
            {busy ? 'Guardando…' : 'Guardar y volver al inicio'}
          </button>
          <span className="muted">
            {changed
              ? 'Cambios sin guardar'
              : draft.length
                ? 'Cambios guardados'
                : 'Aún no has añadido notas'}
          </span>
        </div>
      </form>
      <PrivacyNote />
    </section>
  );
}
