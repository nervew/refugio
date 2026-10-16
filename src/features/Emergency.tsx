import { useState } from 'react';
import { Phone, MapPin } from 'lucide-react';
import { applicableResources, regions, reviewOverdue } from '../content/emergencies';
import { PageTitle } from '../app/components';
import { SafeLink, useAction, useVault } from '../app/context';
import { vault } from '../security/vault';
import { phoneDestination } from '../domain/actions';
export function Emergency() {
  const { data } = useVault();
  const [country, setCountry] = useState('CO');
  const [region, setRegion] = useState(data?.profile.regionCode ?? '');
  const { run, busy } = useAction();
  const resources = applicableResources(country, region);
  return (
    <>
      <PageTitle
        eyebrow="Ayuda humana"
        description="Si hay peligro inmediato, busca ayuda presencial en un servicio de urgencias o pide a alguien cercano que te acompañe."
      >
        Emergencias y atención
      </PageTitle>
      <section className="panel">
        <h2>
          <MapPin size={22} aria-hidden="true" /> Recursos para tu región
        </h2>
        <p>Elige dónde estás ahora. Refugio no usa tu ubicación automática.</p>
        <div className="two-columns">
          <label className="field">
            País
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setRegion('');
              }}
            >
              <option value="CO">Colombia</option>
              <option value="OTHER">Otro país</option>
            </select>
          </label>
          <label className="field">
            Región
            <select
              disabled={country !== 'CO'}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">Seleccionar región</option>
              {regions.map(([code, label]) => (
                <option value={code} key={code}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {data && country === 'CO' ? (
          <button
            className="button secondary"
            disabled={busy}
            onClick={() =>
              void run(
                () =>
                  vault.change((d) => {
                    d.profile.regionCode = region || undefined;
                  }),
                'Región guardada dentro de tu plan cifrado.',
              )
            }
          >
            Guardar región en mi plan
          </button>
        ) : (
          <p className="subtle">
            Esta selección es temporal y no revela tu región guardada si tu plan está bloqueado.
          </p>
        )}
      </section>
      {!region && country === 'CO' && (
        <p className="notice section-space">
          Selecciona tu región para ver sus líneas de apoyo. Si estás en Bogotá, elige Bogotá D. C.
        </p>
      )}
      {resources.length ? (
        resources.map((resource) => (
          <article className="panel section-space emergency-resource" key={resource.id}>
            <h2>{resource.serviceName}</h2>
            <p>{resource.coverageText}</p>
            <p>{resource.availabilityText}</p>
            <p className="subtle">Fuente: Secretaría Distrital de Salud de Bogotá.</p>
            <p className="subtle">
              Consultada el{' '}
              {new Date(resource.verifiedAt).toLocaleDateString('es-CO', {
                timeZone: 'America/Bogota',
              })}
              . Verificación documental; no se realizó una llamada de prueba.
            </p>
            {reviewOverdue(resource) && (
              <p className="notice-copy">
                Puede haber cambiado. La revisión de esta información está pendiente.
              </p>
            )}
            <a className="button primary" href={`tel:${resource.phone}`}>
              <Phone size={18} aria-hidden="true" /> Llamar al {resource.phone}
            </a>
            <a href={resource.officialSourceUrl} target="_blank" rel="noopener noreferrer">
              Consultar fuente oficial de la línea {resource.phone}
            </a>
          </article>
        ))
      ) : region || country !== 'CO' ? (
        <section className="empty-state section-space">
          <h2>Aún no hay una línea verificada para esta región</h2>
          <p>
            No queremos indicarte un número cuya cobertura no esté confirmada. Si hay peligro
            inmediato, busca ayuda presencial en un servicio de urgencias o pide compañía cercana.
          </p>
          <SafeLink to="/support" className="button primary">
            Ver mi red de apoyo
          </SafeLink>
          <SafeLink to="/crisis" className="button secondary">
            Volver al siguiente paso
          </SafeLink>
        </section>
      ) : null}
      {data && data.plan.personalEmergencyContactIds.length > 0 && (
        <section className="panel section-space">
          <h2>Recursos que añadiste a tu plan</h2>
          <p>No tienen verificación oficial de Refugio.</p>
          {data.contacts
            .filter((c) => data.plan.personalEmergencyContactIds.includes(c.id))
            .map((c) => (
              <div key={c.id}>
                <h3>{c.displayName}</h3>
                <a className="button secondary" href={phoneDestination(c.channels[0].value, 'tel')}>
                  Llamar a {c.channels[0].value}
                </a>
              </div>
            ))}
        </section>
      )}
      <p className="subtle">
        Refugio no monitorea tu estado ni inicia llamadas. Abrir el marcador no garantiza cobertura
        ni respuesta.
      </p>
    </>
  );
}
