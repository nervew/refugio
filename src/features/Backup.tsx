import { useState } from 'react';
import { Download, Upload, Printer } from 'lucide-react';
import { PageTitle, TextField, Check } from '../app/components';
import { SafeLink, useAction, useVault } from '../app/context';
import { vault } from '../security/vault';
import { download } from '../platform/files';
import { LocalError } from '../domain/errors';
import { planFields, type PlanField } from '../domain/model';
export function Backup() {
  const session = useVault();
  const { data } = session;
  const [file, setFile] = useState<File | null>(null);
  const [secret, setSecret] = useState('');
  const [destination, setDestination] = useState('');
  const [repeat, setRepeat] = useState('');
  const [inspection, setInspection] = useState<Awaited<ReturnType<typeof vault.inspect>> | null>(
    null,
  );
  const [confirmed, setConfirmed] = useState(false);
  const [adult, setAdult] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [printAck, setPrintAck] = useState(false);
  const [includeContacts, setIncludeContacts] = useState(false);
  const [sections, setSections] = useState<PlanField[]>(['safetySteps']);
  const { run, busy } = useAction();
  function cancel() {
    vault.cancelInspection();
    setInspection(null);
    setFile(null);
    setSecret('');
    setDestination('');
    setRepeat('');
    setConfirmed(false);
  }
  return (
    <>
      <PageTitle
        eyebrow="Conserva lo que preparaste"
        description="Tu plan vive en este navegador. Una copia cifrada y su frase permiten restaurarlo si pierdes el dispositivo o su almacenamiento."
      >
        Copias y recuperación
      </PageTitle>
      <div className="two-columns">
        <section className="panel">
          <Download size={26} aria-hidden="true" />
          <h2>Descargar una copia cifrada</h2>
          <p>
            Incluye todo tu plan, contactos, notas de guías y reflexiones. Se abre con la frase que
            tenía tu plan al descargarla.
          </p>
          {data ? (
            <button
              className="button primary"
              disabled={busy}
              onClick={() =>
                void run(
                  async () => download(await vault.exportEncrypted()),
                  'Descarga iniciada. Comprueba que el archivo se guardó; conserva también su frase.',
                )
              }
            >
              Descargar copia cifrada
            </button>
          ) : (
            <SafeLink to="/unlock" className="button secondary">
              Desbloquear para descargar
            </SafeLink>
          )}
          <p className="subtle">
            Cambiar tu frase no cambia las copias anteriores. No subimos este archivo a un servidor.
          </p>
        </section>
        <section className="panel">
          <Upload size={26} aria-hidden="true" />
          <h2>Restaurar una copia</h2>
          <p>
            La restauración sustituye todos los datos locales; no los combina. Puedes descargar
            antes una copia del plan actual.
          </p>
          <form
            className="form-stack"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!file) return;
              const phrase = secret;
              setSecret('');
              await run(
                async () => setInspection(await vault.inspect(file, phrase)),
                'Copia validada. Revisa el resumen antes de sustituir datos.',
              );
            }}
          >
            <label className="field">
              Archivo de Refugio
              <input
                type="file"
                accept=".refugio,application/octet-stream"
                onChange={(e) => {
                  vault.cancelInspection();
                  setInspection(null);
                  setFile(e.target.files?.[0] ?? null);
                }}
              />
            </label>
            <TextField
              label="Frase de esta copia"
              type="password"
              required
              value={secret}
              onChange={setSecret}
              maxLength={4096}
            />
            <button className="button secondary" disabled={!file || busy}>
              Validar copia sin sustituir datos
            </button>
          </form>
        </section>
      </div>
      {inspection && (
        <section className="panel section-space">
          <h2>Tu copia está lista para revisar</h2>
          <p>
            {inspection.sections} secciones con contenido · {inspection.contacts} contactos ·{' '}
            {inspection.reflections} reflexiones.
          </p>
          <p>
            Esta preparación expira a los cinco minutos o al bloquear. Si tienes un plan existente,
            debes abrirlo antes de sustituirlo.
          </p>
          <form
            className="form-stack"
            onSubmit={async (e) => {
              e.preventDefault();
              const phrase = destination;
              setDestination('');
              setRepeat('');
              const confirmation = repeat;
              if (
                await run(async () => {
                  if (!data && phrase.normalize('NFC') !== confirmation.normalize('NFC'))
                    throw new LocalError('INVALID_INPUT');
                  await vault.replace(
                    inspection.token,
                    phrase,
                    confirmed && (Boolean(data) || adult),
                  );
                }, 'Copia restaurada. Tu plan está abierto.')
              )
                cancel();
            }}
          >
            <TextField
              label={
                data ? 'Frase actual del plan de destino' : 'Frase para guardar el plan restaurado'
              }
              type="password"
              value={destination}
              onChange={setDestination}
              required
              maxLength={4096}
              help={
                data
                  ? 'Puede ser diferente de la frase de la copia.'
                  : 'Mínimo 16 caracteres; no se puede recuperar desde un servidor.'
              }
            />
            {!data && (
              <>
                <TextField
                  label="Repite la frase de destino"
                  type="password"
                  value={repeat}
                  onChange={setRepeat}
                  required
                  maxLength={4096}
                />
                <Check checked={adult} onChange={setAdult} required>
                  Tengo 18 años o más y entiendo que guardaré información sensible en este
                  navegador. Usaré datos ficticios en esta evaluación.
                </Check>
              </>
            )}
            <Check checked={confirmed} onChange={setConfirmed} required>
              Entiendo que todos los datos actuales se sustituirán. Las copias descargadas no se
              borrarán.
            </Check>
            <div className="button-row">
              <button className="button primary" disabled={busy || session.status === 'locked'}>
                Sustituir datos locales
              </button>
              <button type="button" onClick={cancel}>
                Cancelar restauración
              </button>
              {session.status === 'locked' && (
                <SafeLink to="/unlock">Desbloquear el plan actual primero</SafeLink>
              )}
            </div>
          </form>
        </section>
      )}
      <section className="panel section-space">
        <Printer size={26} aria-hidden="true" />
        <h2>Un plan a mano, también en papel</h2>
        <p>
          Este plan contiene información privada. Otras personas podrían ver el papel o el PDF.
          Elige qué incluir. Las reflexiones nunca se incluyen.
        </p>
        {data ? (
          <>
            <div className="choice-grid">
              {Object.entries(planFields).map(([key, [label]]) => (
                <Check
                  key={key}
                  checked={sections.includes(key as PlanField)}
                  onChange={(on) =>
                    setSections(
                      on ? [...sections, key as PlanField] : sections.filter((f) => f !== key),
                    )
                  }
                >
                  {label}
                </Check>
              ))}
            </div>
            <Check checked={includeContacts} onChange={setIncludeContacts}>
              Incluir contactos personales (desmarcado por defecto).
            </Check>
            <Check checked={printAck} onChange={setPrintAck}>
              Entiendo que la impresión y el PDF quedan fuera de la protección del cifrado.
            </Check>
            <button
              className="button secondary"
              disabled={!printAck}
              onClick={() => setPrinting(true)}
            >
              Preparar vista de impresión
            </button>
            {printing && (
              <>
                <div className="print-preview" id="print-plan">
                  <h2>Refugio · Mi plan personal</h2>
                  {sections.map((field) => (
                    <section key={field}>
                      <h3>{planFields[field][0]}</h3>
                      {data.plan[field].length ? (
                        <ol>
                          {data.plan[field].map((item) => (
                            <li key={item.id}>{item.text}</li>
                          ))}
                        </ol>
                      ) : (
                        <p>Sin notas guardadas.</p>
                      )}
                    </section>
                  ))}
                  {includeContacts && (
                    <section>
                      <h3>Mis contactos</h3>
                      {data.contacts.map((c) => (
                        <p key={c.id}>
                          {c.displayName} · {c.channels[0].value}
                        </p>
                      ))}
                    </section>
                  )}
                  <p>Este plan no sustituye atención profesional ni emergencias.</p>
                </div>
                <div className="button-row">
                  <button
                    className="button primary"
                    onClick={() => {
                      if (vault.getSnapshot().data && printAck) window.print();
                    }}
                  >
                    Abrir diálogo de impresión
                  </button>
                  <button onClick={() => setPrinting(false)}>Cerrar vista legible</button>
                </div>
                <p className="subtle">
                  El PDF del sistema depende del navegador. Refugio no puede borrar tus impresiones
                  ni archivos descargados.
                </p>
              </>
            )}
          </>
        ) : (
          <SafeLink to="/unlock">Desbloquear para preparar impresión</SafeLink>
        )}
      </section>
    </>
  );
}
