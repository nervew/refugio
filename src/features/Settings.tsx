import { useState } from 'react';
import { Download, LockKeyhole, Settings2, ShieldCheck } from 'lucide-react';
import { PageTitle, TextField, Check } from '../app/components';
import { SafeLink, useAction, useApp, useVault } from '../app/context';
import { vault } from '../security/vault';
import { usePWA, installPWA, updatePWA } from '../platform/pwa';
import { writePreference, type Appearance } from '../platform/appearance';
import { LocalError } from '../domain/errors';
export function Settings({ appearance }: { appearance: Appearance }) {
  const { data } = useVault();
  const { dirty } = useApp();
  const pwa = usePWA();
  const { run, busy } = useAction();
  const [oldSecret, setOldSecret] = useState('');
  const [secret, setSecret] = useState('');
  const [repeat, setRepeat] = useState('');
  const [deleteAck, setDeleteAck] = useState(false);
  const [checkingOffline, setCheckingOffline] = useState(false);
  const [offlineResult, setOfflineResult] = useState('');
  const [canRepair, setCanRepair] = useState(false);
  async function checkOffline(repair = false) {
    setCheckingOffline(true);
    setOfflineResult(
      repair ? 'Descargando los archivos que faltan…' : 'Comprobando archivos guardados…',
    );
    try {
      const result = await pwa.refresh(repair);
      setCanRepair(!result.ready && !result.unavailable);
      setOfflineResult(
        result.unavailable
          ? 'No pudimos comprobar la descarga. Abre Refugio con conexión, espera unos segundos y vuelve a intentarlo. Este navegador puede limitar el almacenamiento sin conexión.'
          : result.ready
            ? `Comprobación terminada: ${result.total ? `${result.total} de ${result.total} archivos disponibles en este navegador.` : 'El navegador confirma los archivos guardados.'} Puedes abrir las guías sin conexión. Esto no comprueba llamadas ni sitios externos.`
            : `Descarga incompleta: faltan ${result.missing} de ${result.total} archivos. Con conexión puedes volver a descargar lo que falta.`,
      );
    } finally {
      setCheckingOffline(false);
    }
  }
  const [storage, setStorage] = useState('Todavía no solicitado');
  async function preference(key: 'theme' | 'textSize' | 'reducedMotionOverride', value: string) {
    await run(async () => {
      await writePreference(key, value);
      window.dispatchEvent(new Event('appearance-change'));
    }, 'Preferencia guardada.');
  }
  return (
    <>
      <PageTitle
        eyebrow="Tu espacio, tus decisiones"
        description="La información personal se guarda cifrada en este navegador. Las guías están disponibles sin abrir tu plan."
      >
        Ajustes y privacidad
      </PageTitle>
      <div className="settings-grid">
        <section className="panel">
          <Settings2 size={25} aria-hidden="true" />
          <h2>Como te resulte cómodo</h2>
          <label className="field">
            Tema
            <select
              value={appearance.theme}
              onChange={(e) => void preference('theme', e.target.value)}
            >
              <option value="system">Según mi dispositivo</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </label>
          <label className="field">
            Tamaño de texto
            <select
              value={appearance.textSize}
              onChange={(e) => void preference('textSize', e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="large">Ampliado</option>
            </select>
          </label>
          <label className="field">
            Movimiento
            <select
              value={appearance.reducedMotion}
              onChange={(e) => void preference('reducedMotionOverride', e.target.value)}
            >
              <option value="system">Según mi dispositivo</option>
              <option value="reduce">Reducir movimiento</option>
            </select>
          </label>
        </section>
        <section className="panel">
          <ShieldCheck size={25} aria-hidden="true" />
          <h2>En este dispositivo</h2>
          <p>
            <strong>
              {pwa.ready ? 'Guías disponibles sin conexión' : 'Descarga offline sin confirmar'}
            </strong>
          </p>
          <p>
            {pwa.online
              ? 'El navegador indica conexión. Esto no garantiza acceso a todos los servicios.'
              : 'Sin conexión. Puedes usar lo que ya se descargó y guardó.'}
          </p>
          <p>
            La descarga inicial requiere red. El navegador puede borrar datos, incluso con la app
            instalada. Usa copias cifradas.
          </p>
          <button
            className="button secondary"
            disabled={checkingOffline}
            onClick={() => void checkOffline()}
          >
            {checkingOffline ? 'Comprobando descarga…' : 'Comprobar descarga offline'}
          </button>
          {offlineResult && (
            <p role="status" aria-live="polite" aria-label="Resultado de la descarga">
              {offlineResult}
            </p>
          )}
          {canRepair && (
            <button
              className="button secondary"
              disabled={checkingOffline || !pwa.online}
              onClick={() => void checkOffline(true)}
            >
              Descargar los archivos que faltan
            </button>
          )}
          <p>Persistencia: {storage}</p>
          <button
            onClick={() =>
              void run(async () => {
                const granted = await navigator.storage?.persist?.();
                setStorage(
                  granted
                    ? 'Concedida por el navegador; no sustituye una copia'
                    : 'No concedida o no disponible; puedes seguir usando la app',
                );
              }, '')
            }
          >
            Solicitar conservación del almacenamiento
          </button>
        </section>
        <section className="panel">
          <Download size={25} aria-hidden="true" />
          <h2>Más a mano</h2>
          {pwa.canInstall && (
            <button
              className="button primary"
              onClick={() =>
                void run(async () => {
                  await installPWA();
                }, 'Revisa la opción elegida en tu navegador.')
              }
            >
              Instalar Refugio
            </button>
          )}
          <p>
            En iPhone o iPad: abre Refugio en Safari, pulsa Compartir y elige «Añadir a pantalla de
            inicio». Puede que debas abrir el menú de opciones.
          </p>
          <p>
            En Android: busca «Instalar aplicación» o «Añadir a pantalla de inicio» en el menú de
            Chrome. Instalar es opcional.
          </p>
          {pwa.waiting ? (
            <>
              <p>
                Hay una nueva versión. Antes de actualizar, guarda tus cambios y vuelve al inicio en
                todas las pestañas de Refugio.
              </p>
              <button
                className="button secondary"
                disabled={dirty || busy}
                onClick={() =>
                  void run(async () => {
                    if (!(await updatePWA())) throw new LocalError('CONFLICT');
                  }, 'Actualización autorizada. Se abrirá la nueva versión.')
                }
              >
                Actualizar ahora
              </button>
            </>
          ) : (
            <p>Versión 0.1.0 · No hay actualización pendiente detectada.</p>
          )}
        </section>
        <section className="panel">
          <LockKeyhole size={25} aria-hidden="true" />
          <h2>Control de tu plan</h2>
          <SafeLink to="/backup" className="button primary">
            Copias, restauración e impresión
          </SafeLink>
          {data ? (
            <button
              className="button secondary"
              onClick={() => {
                if (!dirty || window.confirm('¿Bloquear y descartar cambios sin guardar?'))
                  vault.lock();
              }}
            >
              Bloquear mi plan
            </button>
          ) : (
            <SafeLink to="/unlock" className="button secondary">
              Abrir mi plan
            </SafeLink>
          )}
          <p>
            La sesión se bloquea tras cinco minutos sin actividad o cinco minutos en segundo plano.
            Una frase perdida no se puede recuperar.
          </p>
          <SafeLink to="/emergency">Elegir mi región de recursos</SafeLink>
        </section>
      </div>
      {data && (
        <section className="panel section-space narrow">
          <h2>Cambiar frase secreta</h2>
          <p>
            Las copias antiguas conservarán la frase anterior. Descarga una nueva copia después del
            cambio.
          </p>
          <form
            className="form-stack"
            onSubmit={async (e) => {
              e.preventDefault();
              const previous = oldSecret;
              const next = secret;
              const confirmation = repeat;
              setOldSecret('');
              setSecret('');
              setRepeat('');
              await run(async () => {
                if (next.normalize('NFC') !== confirmation.normalize('NFC'))
                  throw new LocalError('INVALID_INPUT');
                await vault.changeSecret(previous, next);
              }, 'Frase cambiada. Descarga una copia nueva; las copias anteriores usan su frase anterior.');
            }}
          >
            <TextField
              label="Frase actual"
              type="password"
              value={oldSecret}
              onChange={setOldSecret}
              required
              maxLength={4096}
            />
            <TextField
              label="Nueva frase"
              type="password"
              value={secret}
              onChange={setSecret}
              help="Mínimo 16 caracteres. Puedes usar espacios y pegar desde tu gestor."
              required
              maxLength={4096}
            />
            <TextField
              label="Repite la nueva frase"
              type="password"
              value={repeat}
              onChange={setRepeat}
              required
              maxLength={4096}
            />
            <button className="button primary" disabled={busy}>
              Cambiar frase
            </button>
          </form>
        </section>
      )}
      <section className="panel section-space delete-panel">
        <h2>Borrar datos de este navegador</h2>
        <p>
          Elimina el plan, contactos, reflexiones y preferencias locales. No borra copias
          descargadas, papel, PDF, capturas ni mensajes de otras apps. El borrado no es forense. Las
          guías públicas se conservan.
        </p>
        <Check checked={deleteAck} onChange={setDeleteAck}>
          Entiendo que puedo perder mis datos si no tengo una copia cifrada y su frase.
        </Check>
        <button
          className="button danger"
          disabled={!deleteAck || busy}
          onClick={async () => {
            if (
              window.confirm(
                '¿Borrar ahora todos los datos personales y preferencias de Refugio en este navegador? Esta acción no tiene papelera.',
              )
            ) {
              await run(
                () => vault.deleteAll(true),
                'Datos locales eliminados. Las copias externas permanecen bajo tu control.',
              );
              window.dispatchEvent(new Event('appearance-change'));
              setDeleteAck(false);
            }
          }}
        >
          Borrar mis datos locales
        </button>
      </section>
      <div className="notice section-space">
        <p>
          <strong>Versión de evaluación.</strong> Usa datos ficticios. Las revisiones clínica,
          jurídica, de seguridad independiente y las pruebas en dispositivos físicos siguen
          pendientes. <SafeLink to="/privacy">Leer límites y privacidad</SafeLink>.
        </p>
      </div>
    </>
  );
}
export function Privacy() {
  return (
    <section className="narrow">
      <PageTitle eyebrow="Para decidir con claridad">Privacidad y límites</PageTitle>
      <div className="panel prose">
        <h2>Tu plan permanece local</h2>
        <p>
          No hay cuenta, sincronización, publicidad ni analítica. Plan, contactos y reflexiones se
          cifran en este navegador; la clave solo vive en la memoria de una sesión abierta.
        </p>
        <p>
          El alojamiento recibe las solicitudes técnicas de la web, como IP y navegador. Abrir
          sitios externos, llamar, compartir o enviar SMS implica comunicaciones con servicios
          ajenos a Refugio.
        </p>
        <h2>Lo que debes conservar</h2>
        <p>
          El navegador puede borrar sus datos. Una copia cifrada junto con su frase permite
          restaurar. Sin la frase no hay recuperación por correo ni soporte. Cambiar la frase no
          modifica copias anteriores.
        </p>
        <h2>Dispositivos compartidos</h2>
        <p>
          Bloquea tu dispositivo y tu plan cuando termines. El cifrado no protege una sesión abierta
          frente a código malicioso, extensiones, capturas o un sistema comprometido. No podemos
          garantizar la eliminación física de memoria ni miniaturas del sistema.
        </p>
        <h2>Apoyo, sin diagnóstico</h2>
        <p>
          Refugio no diagnostica, evalúa automáticamente riesgos ni monitorea tu estado. No llama ni
          avisa a nadie por sí solo. Las guías no sustituyen atención profesional ni emergencias.
        </p>
        <h2>Evaluación y próximos requisitos</h2>
        <p>
          Esta compilación es para evaluar con datos ficticios. El contenido clínico y su adaptación
          regional, la normativa colombiana de datos sensibles, el responsable y canal de derechos y
          la cobertura de recursos de emergencia requieren revisión antes de un piloto público. Este
          aviso provisional no declara cumplimiento legal.
        </p>
        <SafeLink to="/crisis" className="button primary">
          Abrir una guía sin crear un plan
        </SafeLink>
      </div>
    </section>
  );
}
