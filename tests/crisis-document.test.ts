import { describe, expect, it } from 'vitest';
import { newVault, listItems } from '../src/domain/model';
import {
  buildCrisisDocument,
  documentText,
  type DocumentOptions,
} from '../src/content/crisis-document';
const options: DocumentOptions = {
  fields: ['vulnerabilities', 'triggers'],
  includeSkills: true,
  includeContacts: false,
  region: 'CO-DC',
};
describe('plan de crisis legible', () => {
  it('personaliza las seis secciones sin inventar respuestas ni incluir diario o contactos por defecto', () => {
    const data = newVault();
    data.plan.vulnerabilities = listItems('Dormir poco (ficticio)');
    data.plan.triggers = listItems('Una discusión ficticia');
    data.skillPreferences = [
      {
        skillId: 'stop',
        personalSteps: ['Mi pausa personal ficticia'],
        helpfulExamples: [],
        updatedAt: data.updatedAt,
      },
    ];
    data.contacts = [
      {
        id: crypto.randomUUID(),
        displayName: 'Contacto reservado',
        role: 'personal',
        channels: [{ type: 'tel', value: '+573000000000' }],
        order: 0,
        updatedAt: data.updatedAt,
      },
    ];
    const doc = buildCrisisDocument(data, options);
    expect(doc.sections).toHaveLength(6);
    const text = documentText(doc);
    for (const included of [
      'Dormir poco (ficticio)',
      'Una discusión ficticia',
      'Mi pausa personal ficticia',
      'Línea 106',
      'Línea 123',
      'TIP',
      'Precauciones:',
      'Cálmate con los 5 sentidos',
      'Mi respuesta:',
    ])
      expect(text).toContain(included);
    expect(text).not.toContain('Contacto reservado');
    expect(text).not.toContain('+573000000000');
    expect(text).not.toContain('Reflexiones');
    expect(text).toContain('no guía hielo');
    expect(text).not.toContain('dejar exhausto');
  });
  it('incluye contactos personales y profesionales solo cuando se eligen, conservando teléfonos y horarios', () => {
    const data = newVault();
    data.contacts = (['personal', 'professional'] as const).map((role, order) => ({
      id: crypto.randomUUID(),
      displayName: `Contacto ${role}`,
      role,
      channels: [{ type: 'tel', value: '+573000000000' }],
      availabilityText: 'Horario ficticio',
      order,
      updatedAt: data.updatedAt,
    }));
    const doc = buildCrisisDocument(data, { ...options, includeContacts: true });
    expect(doc.sections[3].paragraphs.join()).toContain('Contacto personal');
    expect(doc.sections[3].paragraphs.join()).not.toContain('Contacto professional');
    expect(doc.sections[4].paragraphs.join()).toContain('Contacto professional');
    expect(doc.sections[4].paragraphs.join()).toContain('Horario ficticio');
  });
  it('respeta omisiones y el lugar elegido: no exporta 106/123 como líneas de Alemania', () => {
    const data = newVault();
    data.plan.vulnerabilities = listItems('No exportar esta nota');
    const doc = buildCrisisDocument(data, {
      ...options,
      fields: [],
      includeSkills: false,
      region: 'DE-HE-FRA',
    });
    const text = documentText(doc);
    expect(text).not.toContain('No exportar esta nota');
    expect(text).not.toContain('Pausa la acción');
    const resources = doc.sections[5].paragraphs.join();
    expect(resources).toContain('116123');
    expect(resources).toContain('112');
    expect(resources).not.toContain('Línea 106');
    expect(resources).not.toContain('Línea 123');
    expect(resources).toContain('telefonseelsorge.de');
  });
  it('deja pendientes identificados si no hay ubicación ni contenido', () => {
    const doc = buildCrisisDocument(newVault(), { ...options, region: '' });
    expect(doc.sections[0].paragraphs.join()).toContain('Mi respuesta:');
    expect(doc.sections[5].paragraphs.join()).toContain('Aún no he elegido');
    expect(doc.sections[5].paragraphs.join()).not.toContain('Línea 106 ·');
  });
});
