import { useParams } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { PageTitle, PrivateGate, PrivacyNote } from '../app/components';
import { SafeLink, useAction, useDraftState, useVault } from '../app/context';
import { planFields, type PlanField, type PlanItem } from '../domain/model';
import { newId, now } from '../domain/actions';
import { vault } from '../security/vault';
import { skills } from '../content/skills';
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
        description="No tienes que completar todo. Guarda lo que quieras recordar; puedes volver cuando tengas más espacio."
      >
        Mi plan personal
      </PageTitle>
      <div className="section-heading">
        <p className="muted">
          <LockKeyhole size={16} aria-hidden="true" /> Solo visible con tu plan abierto
        </p>
        <SafeLink className="button secondary" to="/crisis">
          Consultar en modo crisis <ArrowRight size={18} aria-hidden="true" />
        </SafeLink>
      </div>
      <div className="plan-grid">
        {Object.entries(planFields).map(([key, [label, help]], index) => {
          const count = data.plan[key as PlanField].length;
          return (
            <SafeLink to={`/plan/${key}`} className="plan-card" key={key}>
              <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{label}</h2>
                <p>{help}</p>
                <span className="tag">
                  {count
                    ? `${count} ${count === 1 ? 'nota guardada' : 'notas guardadas'}`
                    : 'Puedes dejarlo vacío'}
                </span>
              </div>
              <ArrowRight size={19} aria-hidden="true" />
            </SafeLink>
          );
        })}
        <SafeLink to="/support" className="plan-card">
          <span className="step-number">11</span>
          <div>
            <h2>Red de apoyo</h2>
            <p>Personas cercanas y contactos alternativos.</p>
          </div>
          <ArrowRight aria-hidden="true" />
        </SafeLink>
        <SafeLink to="/support" className="plan-card">
          <span className="step-number">12</span>
          <div>
            <h2>Contactos profesionales</h2>
            <p>Tu profesional tratante y cómo acudir a él.</p>
          </div>
          <ArrowRight aria-hidden="true" />
        </SafeLink>
        <SafeLink to="/emergency" className="plan-card">
          <span className="step-number">13</span>
          <div>
            <h2>Recursos de emergencia</h2>
            <p>Ayuda por país y región; recursos personales separados.</p>
          </div>
          <ArrowRight aria-hidden="true" />
        </SafeLink>
      </div>
      <FavoriteSkills />
      <PrivacyNote />
    </>
  );
}
function FavoriteSkills() {
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
        )
          clean();
      }}
    >
      <h2>Habilidades que quiero tener a mano</h2>
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
        Guardar preferencias
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
          {field === 'safetySteps' && 'Estos pasos aparecerán primero en modo crisis.'}
        </p>
        {draft.length === 0 && (
          <p className="empty-note">Todavía no hay notas. Puedes empezar con una sola idea.</p>
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
          onClick={() => setDraft([...draft, { id: newId(), text: '', order: draft.length }])}
        >
          <Plus size={18} aria-hidden="true" /> Agregar nota
        </button>
        {draft.length >= max && <p>Límite: {max} notas. No se borrarán notas automáticamente.</p>}
        <div className="save-row">
          <button className="button primary" disabled={busy}>
            {busy ? 'Guardando…' : 'Guardar esta sección'}
          </button>
          <span className="muted">{changed ? 'Cambios sin guardar' : 'Sección guardada'}</span>
        </div>
      </form>
      <PrivacyNote />
    </section>
  );
}
