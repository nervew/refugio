import { useState } from 'react';
import { ArrowRight, Phone, MessageCircle, HeartHandshake } from 'lucide-react';
import { SafeLink, useVault } from '../app/context';
import { HelpBar, Dialog } from '../app/components';
import { getSkill } from '../content/skills';
import { phoneDestination } from '../domain/actions';
import { MessageComposer } from './Support';
export function Crisis() {
  const { data } = useVault();
  const [index, setIndex] = useState(0);
  const [messageOpen, setMessageOpen] = useState(false);
  const prepared = [...(data?.plan.safetySteps ?? [])].sort((a, b) => a.order - b.order);
  const current = prepared[Math.min(index, Math.max(0, prepared.length - 1))];
  const skill = getSkill(data?.plan.prioritySkillIds[0] ?? 'stop')!;
  const ordered = [...(data?.contacts ?? [])].sort((a, b) => {
    const ai = data!.plan.priorityContactIds.indexOf(a.id);
    const bi = data!.plan.priorityContactIds.indexOf(b.id);
    return (ai < 0 ? 1000 + a.order : ai) - (bi < 0 ? 1000 + b.order : bi);
  });
  const primary = ordered[0];
  const alternate = ordered.find((c) => c.id === primary?.alternateContactId) ?? ordered[1];
  return (
    <section className="crisis-page">
      <div className="crisis-top">
        <span className="eyebrow">
          <HeartHandshake size={19} aria-hidden="true" /> Estoy aquí, un paso a la vez
        </span>
        <SafeLink to="/">Salir del modo crisis</SafeLink>
      </div>
      <h1 tabIndex={-1}>Solo el siguiente paso.</h1>
      <p className="lede">No tienes que resolver todo en este momento.</p>
      <div className="crisis-layout">
        <section className="crisis-step">
          <span className="step-orb" aria-hidden="true">
            {prepared.length ? Math.min(index + 1, prepared.length) : '1'}
          </span>
          <p className="eyebrow">
            {current
              ? `Tu plan · paso ${Math.min(index + 1, prepared.length)} de ${prepared.length}`
              : 'Puedes empezar aquí'}
          </p>
          <h2>{current ? current.text : 'Haz una pausa. Puedes seguir un paso a la vez.'}</h2>
          {!current && (
            <p>
              Mira a tu alrededor y encuentra una cosa que puedas observar. Si te resulta incómodo,
              puedes elegir otra opción o pedir compañía.
            </p>
          )}
          <div className="button-row">
            {current && index > 0 && (
              <button className="button secondary" onClick={() => setIndex(index - 1)}>
                Anterior
              </button>
            )}
            {current && index < prepared.length - 1 ? (
              <button className="button primary" onClick={() => setIndex(index + 1)}>
                Mi siguiente paso <ArrowRight size={19} aria-hidden="true" />
              </button>
            ) : (
              <SafeLink className="button primary" to={`/skills/${skill.id}?from=crisis`}>
                {current ? 'Seguir con una habilidad' : `Probar ${skill.title}`}{' '}
                <ArrowRight size={19} aria-hidden="true" />
              </SafeLink>
            )}
            <SafeLink to="/skills" className="text-button">
              Elegir otra habilidad
            </SafeLink>
          </div>
          {!data && (
            <p className="muted">
              Tu plan personal está cerrado. <SafeLink to="/unlock">Puedes desbloquearlo</SafeLink>{' '}
              o continuar con estos pasos.
            </p>
          )}
          {data && prepared.length === 0 && (
            <p className="subtle">Puedes usar esta guía aunque tu plan esté incompleto.</p>
          )}
        </section>
        <aside className="crisis-support">
          <p className="eyebrow">Compañía a mano</p>
          <h2>No tienes que hacerlo a solas.</h2>
          {primary ? (
            <>
              <p className="contact-name">{primary.displayName}</p>
              <p>{primary.channels[0].value}</p>
              <a
                className="button primary"
                href={phoneDestination(primary.channels[0].value, 'tel')}
              >
                <Phone size={18} aria-hidden="true" /> Llamar a {primary.displayName}
              </a>
              <button className="text-button" onClick={() => setMessageOpen(true)}>
                <MessageCircle size={18} aria-hidden="true" /> Preparar mensaje
              </button>
              {alternate && (
                <div className="alternate-contact">
                  <p>Si no responde, puedes probar con</p>
                  <a href={phoneDestination(alternate.channels[0].value, 'tel')}>
                    {alternate.displayName} · {alternate.channels[0].value}
                  </a>
                </div>
              )}
            </>
          ) : (
            <>
              <p>
                Puedes pedir a alguien cercano que te acompañe.{' '}
                {data
                  ? 'Tu red de apoyo todavía está vacía.'
                  : 'Abre tu plan para ver los contactos que preparaste.'}
              </p>
              <SafeLink to="/support" className="button secondary">
                Ver mi red de apoyo
              </SafeLink>
            </>
          )}
        </aside>
      </div>
      <div className="danger-note">
        <h2>Si hay peligro inmediato</h2>
        <p>
          Busca ayuda presencial en un servicio de urgencias o pide a alguien cercano que te
          acompañe. Refugio no llama ni avisa a nadie por sí solo.
        </p>
        <SafeLink to="/emergency">
          Abrir recursos de emergencia <ArrowRight size={17} aria-hidden="true" />
        </SafeLink>
      </div>
      <HelpBar />
      {data && primary && messageOpen && (
        <Dialog title="Pedir compañía" onClose={() => setMessageOpen(false)}>
          <MessageComposer contact={primary} onClose={() => setMessageOpen(false)} />
        </Dialog>
      )}
    </section>
  );
}
