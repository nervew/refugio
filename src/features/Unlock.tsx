import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { PageTitle, Check, TextField } from '../app/components';
import { SafeLink, useAction, useVault } from '../app/context';
import { vault } from '../security/vault';
import { LocalError } from '../domain/errors';
export function Unlock({ embedded = false }: { embedded?: boolean }) {
  const session = useVault();
  const creating = session.status === 'absent';
  const navigate = useNavigate();
  const [secret, setSecret] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [show, setShow] = useState(false);
  const [adult, setAdult] = useState(false);
  const [ack, setAck] = useState(false);
  const { busy, run } = useAction();
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = secret;
    setSecret('');
    setConfirmation('');
    const confirmed = confirmation;
    const ok = await run(
      async () => {
        if (creating) {
          if (value.normalize('NFC') !== confirmed.normalize('NFC'))
            throw new LocalError('INVALID_INPUT');
          await vault.create(value, adult && ack);
        } else await vault.unlock(value);
      },
      creating
        ? 'Tu espacio personal está preparado. Descarga una copia cifrada desde Ajustes.'
        : 'Tu plan está abierto en este dispositivo.',
    );
    if (ok && !embedded) navigate('/plan');
  }
  return (
    <section className="narrow">
      <PageTitle
        eyebrow="Tu espacio personal"
        description={
          creating
            ? 'Elige una frase que puedas recordar. No necesitas crear una cuenta.'
            : 'Puedes seguir usando las guías sin abrir tus datos.'
        }
      >
        {creating ? 'Prepara tu refugio' : 'Abre tu plan'}
      </PageTitle>
      {session.status === 'loading' ? (
        <p role="status">Comprobando almacenamiento…</p>
      ) : session.status === 'unavailable' ? (
        <div className="notice">
          <p>
            No se puede acceder al almacenamiento. Usa un navegador compatible; la ayuda pública
            sigue disponible.
          </p>
          <button onClick={() => void vault.init()}>Volver a intentar</button>
        </div>
      ) : session.status === 'unlocked' ? (
        <p>
          Tu plan ya está abierto. <SafeLink to="/plan">Ir a mi plan</SafeLink>
        </p>
      ) : (
        <form onSubmit={submit} className="panel form-stack">
          <LockKeyhole size={30} className="muted" aria-hidden="true" />
          <TextField
            label="Frase secreta"
            type={show ? 'text' : 'password'}
            value={secret}
            onChange={setSecret}
            required
            maxLength={4096}
            help={
              creating
                ? 'Mínimo 16 caracteres. Recomendamos varias palabras aleatorias. Puedes pegarla desde tu gestor de contraseñas.'
                : 'Introduce la frase con la que guardaste tu plan.'
            }
          />
          {creating && (
            <TextField
              label="Repite la frase secreta"
              type={show ? 'text' : 'password'}
              value={confirmation}
              onChange={setConfirmation}
              required
              maxLength={4096}
            />
          )}
          <Check checked={show} onChange={setShow}>
            Mostrar frase mientras completo este formulario
          </Check>
          {creating && (
            <>
              <p className="notice-copy">
                Guarda tu frase en un lugar seguro. Si la pierdes, no podremos recuperar tu plan.
                Descarga una copia cifrada y conserva también su frase.
              </p>
              <Check checked={adult} onChange={setAdult} required>
                Confirmo que tengo 18 años o más.
              </Check>
              <Check checked={ack} onChange={setAck} required>
                Entiendo que este plan puede contener información sensible, que se guarda en este
                navegador y que puede perderse sin una copia. Esta versión es de evaluación; usaré
                datos ficticios.
              </Check>
              <SafeLink to="/privacy">Leer privacidad y límites</SafeLink>
            </>
          )}
          <button className="button primary" disabled={busy || session.busy}>
            {busy
              ? 'Abriendo tu espacio…'
              : creating
                ? 'Crear mi plan cifrado'
                : 'Desbloquear mi plan'}
          </button>
        </form>
      )}
      <div className="button-row">
        <SafeLink to="/crisis" className="button secondary">
          Seguir con apoyo público
        </SafeLink>
        <SafeLink to="/backup">Restaurar una copia</SafeLink>
        <SafeLink to="/settings">Frase olvidada y opciones</SafeLink>
      </div>
    </section>
  );
}
