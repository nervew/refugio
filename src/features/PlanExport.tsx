import { useState } from 'react';
import { Printer } from 'lucide-react';
import { Check } from '../app/components';
import { SafeLink, useVault } from '../app/context';
import { planFields, type PlanField, type VaultPayload } from '../domain/model';
import {
  buildCrisisDocument,
  documentText,
  type DocumentSection,
} from '../content/crisis-document';
import { regions } from '../content/emergencies';
import { download } from '../platform/files';
import { vault } from '../security/vault';
import './plan-export.css';

function PrintedSection({
  section,
  nested = false,
}: {
  section: DocumentSection;
  nested?: boolean;
}) {
  return (
    <section>
      {nested ? <h4>{section.title}</h4> : <h3>{section.title}</h3>}
      {section.paragraphs.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
      {section.children?.map((child) => (
        <PrintedSection key={child.title} section={child} nested />
      ))}
    </section>
  );
}
export function PlanExport() {
  const { data } = useVault();
  return data ? (
    <UnlockedPlanExport data={data} />
  ) : (
    <section className="panel section-space">
      <h2>Mi plan de crisis para descargar o imprimir</h2>
      <SafeLink to="/unlock">Desbloquear para preparar impresión</SafeLink>
    </section>
  );
}
function UnlockedPlanExport({ data }: { data: VaultPayload }) {
  const [printing, setPrinting] = useState(false);
  const [printAck, setPrintAck] = useState(false);
  const [includeContacts, setIncludeContacts] = useState(false);
  const [includeSkills, setIncludeSkills] = useState(true);
  const [sections, setSections] = useState<PlanField[]>([
    'vulnerabilities',
    'triggers',
    'safetySteps',
  ]);
  const [region, setRegion] = useState(data?.profile.regionCode ?? '');
  const document = data
    ? buildCrisisDocument(data, { fields: sections, includeContacts, includeSkills, region })
    : null;
  function invalidate() {
    setPrinting(false);
  }
  return (
    <section className="panel section-space">
      <Printer size={26} aria-hidden="true" />
      <h2>Mi plan de crisis para descargar o imprimir</h2>
      <p>
        El formato incluye vulnerabilidades, eventos desencadenantes, habilidades, una persona de
        confianza, un terapeuta si tienes y líneas de emergencia. Se completa con lo que guardaste;
        los espacios pendientes quedan señalados.
      </p>
      <p>
        Este plan contiene información privada. Otras personas podrían ver el papel, el texto o el
        PDF. Elige qué incluir. Las reflexiones nunca se incluyen. La copia cifrada de arriba es la
        que permite restaurar Refugio.
      </p>
      {data && document ? (
        <>
          <p>Notas de mi plan que quiero incluir:</p>
          <div className="choice-grid">
            {Object.entries(planFields).map(([key, [label]]) => (
              <Check
                key={key}
                checked={sections.includes(key as PlanField)}
                onChange={(on) => {
                  invalidate();
                  setSections(
                    on ? [...sections, key as PlanField] : sections.filter((f) => f !== key),
                  );
                }}
              >
                {label}
              </Check>
            ))}
          </div>
          <Check
            checked={includeSkills}
            onChange={(on) => {
              invalidate();
              setIncludeSkills(on);
            }}
          >
            Incluir las seis guías, sus precauciones y mis notas personales de habilidades.
          </Check>
          <Check
            checked={includeContacts}
            onChange={(on) => {
              invalidate();
              setIncludeContacts(on);
            }}
          >
            Incluir contactos personales y profesionales (desmarcado por defecto).
          </Check>
          <label className="field">
            Lugar de las líneas que incluiré
            <select
              value={region}
              onChange={(e) => {
                invalidate();
                setRegion(e.target.value);
              }}
            >
              <option value="">Elegir lugar; no se presupone Bogotá</option>
              {regions.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <p className="subtle">
            Elige el lugar desde donde llamarás. Esta selección solo afecta al documento. En Bogotá,
            Medellín y Cali se incluyen 106 y 123; en otros lugares, sus líneas verificadas.
          </p>
          <Check
            checked={printAck}
            onChange={(on) => {
              invalidate();
              setPrintAck(on);
            }}
          >
            Entiendo que la impresión y el PDF quedan fuera de la protección del cifrado. El texto
            descargado también queda sin cifrar.
          </Check>
          <button
            className="button secondary"
            disabled={!printAck}
            onClick={() => setPrinting(true)}
          >
            Preparar vista de impresión
          </button>
          {printing && printAck && (
            <>
              <div className="print-preview" id="print-plan">
                <h2>{document.title}</h2>
                {document.intro.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                {document.sections.map((section) => (
                  <PrintedSection key={section.title} section={section} />
                ))}
              </div>
              <div className="button-row">
                <button
                  className="button primary"
                  onClick={() => {
                    if (vault.getSnapshot().data && printAck) window.print();
                  }}
                >
                  Guardar como PDF o imprimir
                </button>
                <button
                  className="button secondary"
                  onClick={() => {
                    if (vault.getSnapshot().data && printAck)
                      download(
                        new Blob([documentText(document)], { type: 'text/plain;charset=utf-8' }),
                        'refugio-mi-plan-de-crisis.txt',
                      );
                  }}
                >
                  Descargar plan en texto
                </button>
                <button onClick={() => setPrinting(false)}>Cerrar vista legible</button>
              </div>
              <p className="subtle">
                Para descargar un PDF, elige «Guardar como PDF» en el diálogo del navegador o en las
                opciones de compartir del sistema. Refugio no puede borrar tus impresiones ni
                archivos descargados.
              </p>
            </>
          )}
        </>
      ) : (
        <SafeLink to="/unlock">Desbloquear para preparar impresión</SafeLink>
      )}
    </section>
  );
}
