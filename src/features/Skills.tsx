import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, Leaf, Pause, Bookmark } from 'lucide-react';
import { skills, getSkill } from '../content/skills';
import { PageTitle, HelpBar, TextField, Dialog, Check } from '../app/components';
import { SafeLink, useAction, useDraftState, useVault } from '../app/context';
import { type SkillPreference, splitLines } from '../domain/model';
import { now, savePreference } from '../domain/actions';
import { vault } from '../security/vault';
const guideProgress = new Map<string, { step: number; paused: boolean }>();
export function Skills() {
  return (
    <>
      <PageTitle
        eyebrow="Tus herramientas"
        description="No hay una forma correcta de sentirte. Prueba lo que te resulte cómodo; puedes cambiar de opción cuando quieras."
      >
        Un recurso para este momento
      </PageTitle>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <SafeLink to={`/skills/${skill.id}`} className="skill-card" key={skill.id}>
            <span className="skill-symbol" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Leaf size={23} aria-hidden="true" />
            <h2>{skill.title}</h2>
            <p>{skill.short}</p>
            <span className="card-link">
              Explorar <ArrowRight size={18} aria-hidden="true" />
            </span>
          </SafeLink>
        ))}
      </div>
      <p className="subtle">
        Contenido de evaluación en revisión profesional. Las guías no sustituyen terapia ni atención
        urgente.
      </p>
    </>
  );
}
export function SkillDetail() {
  const { skillId = '' } = useParams();
  const skill = getSkill(skillId);
  const [query] = useSearchParams();
  const { data } = useVault();
  const [step, setStep] = useState(() => guideProgress.get(skillId)?.step ?? -1);
  const [editing, setEditing] = useState(false);
  const [paused, setPaused] = useState(() => guideProgress.get(skillId)?.paused ?? false);
  useEffect(() => {
    guideProgress.set(skillId, { step, paused });
  }, [skillId, step, paused]);
  if (!skill)
    return (
      <>
        <PageTitle>Habilidad no disponible</PageTitle>
        <SafeLink to="/skills">Volver a habilidades</SafeLink>
      </>
    );
  const pref = data?.skillPreferences.find((p) => p.skillId === skill.id);
  const personal = pref?.personalSteps ?? [];
  return (
    <section className="guide-page">
      <SafeLink to={query.get('from') === 'crisis' ? '/crisis' : '/skills'} className="back-link">
        ← {query.get('from') === 'crisis' ? 'Mi siguiente paso' : 'Habilidades'}
      </SafeLink>
      <PageTitle eyebrow="A tu ritmo" description={skill.goal}>
        {skill.title}
      </PageTitle>
      <div className="guide-columns">
        <section className="panel guide-card">
          {step < 0 ? (
            <>
              <span className="eyebrow">Antes de empezar</span>
              <h2>Elige lo que te resulte cómodo</h2>
              <p>{skill.when}</p>
              <div className="precautions">
                <h3>Para cuidarte</h3>
                <ul>
                  {skill.precautions.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <button className="button primary" onClick={() => setStep(0)}>
                Empezar paso a paso <ArrowRight size={18} aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow">
                {paused ? 'En pausa' : `Paso ${step + 1} de ${skill.steps.length}`}
              </p>
              <progress
                value={step + 1}
                max={skill.steps.length}
                aria-label="Progreso de la guía"
              />
              <h2 className="guide-instruction">
                {paused ? 'Puedes quedarte aquí el tiempo que necesites.' : skill.steps[step]}
              </h2>
              <p className="muted">No hay prisa. Puedes omitir cualquier paso.</p>
              <div className="button-row">
                <button
                  className="button secondary"
                  onClick={() => {
                    setPaused(false);
                    setStep(step - 1);
                  }}
                >
                  {step === 0 ? 'Ver precauciones' : 'Anterior'}
                </button>
                {step < skill.steps.length - 1 ? (
                  <button
                    className="button primary"
                    onClick={() => {
                      setPaused(false);
                      setStep(step + 1);
                    }}
                  >
                    Siguiente <ArrowRight size={18} aria-hidden="true" />
                  </button>
                ) : (
                  <SafeLink to="/skills" className="button primary">
                    Elegir otra herramienta
                  </SafeLink>
                )}
                <button className="text-button" onClick={() => setPaused(!paused)}>
                  <Pause size={17} aria-hidden="true" />
                  {paused ? 'Continuar' : 'Hacer una pausa'}
                </button>
              </div>
              {step === skill.steps.length - 1 && (
                <div className="section-space">
                  <h3>No necesitas sentirte diferente para terminar</h3>
                  <p>
                    Puedes cambiar de opción o buscar compañía. Si quieres, registra después cómo te
                    fue.
                  </p>
                  <SafeLink to={`/reflections?skill=${skill.id}`}>
                    Registrar cómo me fue (opcional)
                  </SafeLink>
                </div>
              )}
              <details className="section-space">
                <summary>Volver a leer las precauciones</summary>
                <ul>
                  {skill.precautions.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </details>
            </>
          )}
        </section>
        <aside className="side-note">
          <Leaf size={26} aria-hidden="true" />
          <h2>Una idea para probar</h2>
          <p>{skill.example}</p>
          {pref && (
            <>
              <h3>Lo que preparaste</h3>
              {personal.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {pref.helpfulExamples.map((p, i) => (
                <p key={`example-${i}`}>{p}</p>
              ))}
              {pref.avoidNotes && <p>Prefiero evitar: {pref.avoidNotes}</p>}
              {pref.prosConsCard && (
                <dl className="pros-cons">
                  {Object.entries({
                    impulsePros: 'Ventajas de actuar por impulso',
                    impulseCons: 'Desventajas de actuar por impulso',
                    alternativePros: 'Ventajas de una alternativa',
                    alternativeCons: 'Desventajas de una alternativa',
                    summary: 'Lo que quiero recordar',
                  }).map(([key, label]) => (
                    <div key={key}>
                      <dt>{label}</dt>
                      <dd>
                        {pref.prosConsCard?.[
                          key as keyof NonNullable<SkillPreference['prosConsCard']>
                        ] || 'Sin nota'}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          )}
          {data && query.get('from') !== 'crisis' ? (
            <button className="text-button" onClick={() => setEditing(true)}>
              <Bookmark size={17} aria-hidden="true" /> Preparar mis preferencias
            </button>
          ) : query.get('from') === 'crisis' ? (
            <p className="subtle">Puedes preparar tus preferencias después, con calma.</p>
          ) : (
            <SafeLink to="/unlock">Abrir mi personalización</SafeLink>
          )}
          <p className="subtle">Contenido en revisión profesional.</p>
        </aside>
      </div>
      <HelpBar />
      {editing && data && (
        <Dialog title="Lo que me ayuda" onClose={() => setEditing(false)}>
          <PreferenceEditor
            initial={
              pref ?? {
                skillId: skill.id,
                personalSteps: [],
                helpfulExamples: [],
                updatedAt: now(),
              }
            }
            onClose={() => setEditing(false)}
          />
        </Dialog>
      )}
    </section>
  );
}
function PreferenceEditor({ initial, onClose }: { initial: SkillPreference; onClose: () => void }) {
  const { draft, setDraft, clean, changed } = useDraftState(structuredClone(initial));
  const { run, busy } = useAction();
  const [ack, setAck] = useState(false);
  return (
    <form
      className="form-stack"
      onSubmit={async (e) => {
        e.preventDefault();
        if (
          await run(() =>
            vault.change((d) =>
              savePreference(d, {
                ...draft,
                personalSteps: splitLines(draft.personalSteps.join('\n')),
                helpfulExamples: splitLines(draft.helpfulExamples.join('\n')),
                updatedAt: now(),
              }),
            ),
          )
        ) {
          clean();
          onClose();
        }
      }}
    >
      <p>
        Estas notas personales acompañan la guía; las precauciones siempre se conservan. Prepara
        acciones seguras y conocidas.
      </p>
      <TextField
        label="Mis recordatorios"
        value={draft.personalSteps.join('\n')}
        multiline
        maxLength={10000}
        help="Un recordatorio por línea, hasta 20. Cada uno admite 500 caracteres."
        onChange={(v) => setDraft({ ...draft, personalSteps: v.split('\n') })}
      />
      <TextField
        label="Ejemplos que me ayudan"
        value={draft.helpfulExamples.join('\n')}
        multiline
        maxLength={10000}
        onChange={(v) => setDraft({ ...draft, helpfulExamples: v.split('\n') })}
      />
      <TextField
        label="Prefiero evitar"
        value={draft.avoidNotes ?? ''}
        onChange={(v) => setDraft({ ...draft, avoidNotes: v })}
      />
      {draft.skillId === 'pros-contras' && (
        <fieldset>
          <legend>Mi tarjeta de pros y contras</legend>
          {Object.entries({
            impulsePros: 'Ventajas de actuar por impulso',
            impulseCons: 'Desventajas de actuar por impulso',
            alternativePros: 'Ventajas de una alternativa segura',
            alternativeCons: 'Desventajas de una alternativa',
            summary: 'Mi recordatorio final',
          }).map(([key, label]) => (
            <TextField
              key={key}
              label={label}
              multiline
              value={
                draft.prosConsCard?.[key as keyof NonNullable<SkillPreference['prosConsCard']>] ??
                ''
              }
              onChange={(value) =>
                setDraft({ ...draft, prosConsCard: { ...draft.prosConsCard, [key]: value } })
              }
            />
          ))}
        </fieldset>
      )}
      <Check checked={ack} onChange={setAck}>
        Mis notas no reemplazan las precauciones de la guía.
      </Check>
      <div className="button-row">
        <button className="button primary" disabled={busy || !ack}>
          Guardar mis preferencias
        </button>
        <button
          type="button"
          onClick={() => {
            if (!changed || window.confirm('¿Descartar tus cambios?')) {
              clean();
              onClose();
            }
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
