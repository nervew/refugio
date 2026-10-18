import { useState } from 'react';
import { Phone, MapPin } from 'lucide-react';
import { applicableResources, regions, reviewOverdue } from '../content/emergencies';
import { PageTitle } from '../app/components';
import { SafeLink, useAction, useVault } from '../app/context';
import { vault } from '../security/vault';
import { phoneDestination } from '../domain/actions';
export function Emergency() {
  const { data } = useVault();
  const [country, setCountry] = useState<string>(data?.profile.country ?? 'CO');
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
          <MapPin size={22} aria-hidden="true" /> ¿Dónde necesitas atención?
        </h2>
        <p>
          Elige el lugar donde necesitas atención para consultar las líneas disponibles y su
          cobertura. Refugio no detecta tu ubicación.
        </p>
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
              <option value="DE">Alemania</option>
              <option value="NL">Países Bajos</option>
              <option value="OTHER">Otro país</option>
            </select>
          </label>
          <label className="field">
            Ciudad o región
            <select
              disabled={country === 'OTHER'}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">Seleccionar ciudad o región</option>
              {regions
                .filter(([code]) => code.startsWith(`${country}-`))
                .map(([code, label]) => (
                  <option value={code} key={code}>
                    {label}
                  </option>
                ))}
            </select>
          </label>
        </div>
        {data && (country === 'CO' || country === 'DE' || country === 'NL') ? (
          <button
            className="button secondary"
            disabled={busy}
            onClick={() =>
              void run(
                () =>
                  vault.change((d) => {
                    d.profile.country = country;
                    d.profile.regionCode = region || undefined;
                  }),
                'Ubicación guardada dentro de tu plan cifrado.',
              )
            }
          >
            Guardar ubicación en mi plan
          </button>
        ) : (
          <p className="subtle">
            Esta selección es temporal y no revela tu región guardada si tu plan está bloqueado.
          </p>
        )}
      </section>
      {!region && country !== 'OTHER' && (
        <p className="notice section-space">
          Selecciona tu ciudad o región para ver sus líneas de apoyo. Elige el lugar desde donde vas
          a llamar.
        </p>
      )}
      {resources.length ? (
        resources.map((resource) => (
          <article className="panel section-space emergency-resource" key={resource.id}>
            <h2>{resource.serviceName}</h2>
            <p>{resource.coverageText}</p>
            <p>{resource.availabilityText}</p>
            <p className="subtle">Fuente: {resource.sourceName}.</p>
            <p className="subtle">
              Consultada el{' '}
              {new Date(resource.verifiedAt).toLocaleDateString('es-CO', {
                timeZone: 'UTC',
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
      ) : region || country === 'OTHER' ? (
        <section className="empty-state section-space">
          <h2>Aún no hay una línea verificada para esta región</h2>
          <p>
            No queremos indicarte un número cuya cobertura no esté confirmada. Si hay peligro
            inmediato, busca ayuda presencial en un servicio de urgencias o pide compañía cercana.
          </p>
          <SafeLink to="/support" className="button primary">
            Ver mis contactos
          </SafeLink>
          <SafeLink to="/crisis" className="button secondary">
            Ver una guía para este momento
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
