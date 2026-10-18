import { describe, it, expect } from 'vitest';
import { newVault, validatePayload, listItems } from '../src/domain/model';
import { newId, now, removeContact, phoneDestination, saveContact } from '../src/domain/actions';
import { skills } from '../src/content/skills';
import {
  applicableResources,
  reviewOverdue,
  emergencyResources,
  type EmergencyResource,
} from '../src/content/emergencies';
describe('T-001/002/004/005/006: reglas de dominio', () => {
  it('admite plan parcial y separa vulnerabilidad y desencadenante', () => {
    const data = newVault();
    data.plan.vulnerabilities = listItems('Dormí poco');
    data.plan.triggers = listItems('Una discusión');
    expect(validatePayload(data).plan.triggers[0].text).toBe('Una discusión');
    expect(data.plan.vulnerabilities[0].text).toBe('Dormí poco');
  });
  it('rechaza referencias rotas, IDs duplicados y más de tres pasos iniciales', () => {
    const data = newVault();
    data.plan.priorityContactIds = [newId()];
    expect(() => validatePayload(data)).toThrow();
    data.plan.priorityContactIds = [];
    data.plan.safetySteps = listItems('a\nb\nc\nd');
    expect(() => validatePayload(data)).toThrow();
    data.plan.safetySteps = [];
    data.plan.earlySignals = [{ id: data.plan.id, text: 'x', order: 0 }];
    expect(() => validatePayload(data)).toThrow();
  });
  it('rechaza campos desconocidos y versiones futuras', () => {
    expect(() => validatePayload({ ...newVault(), unknown: true })).toThrow();
    expect(() => validatePayload({ ...newVault(), schemaVersion: 2 })).toThrow(
      'UNSUPPORTED_VERSION',
    );
  });
  it('limpia referencias de un contacto eliminado de forma coherente', () => {
    const data = newVault();
    const id = newId();
    saveContact(data, {
      id,
      displayName: 'Persona ficticia',
      channels: [{ type: 'tel', value: '+57 300 000 0000' }],
      role: 'professional',
      order: 0,
      updatedAt: now(),
    });
    data.plan.priorityContactIds = [id];
    data.plan.personalEmergencyContactIds = [id];
    removeContact(data, id);
    expect(data.contacts).toEqual([]);
    expect(data.plan.priorityContactIds).toEqual([]);
    expect(data.plan.professionalContactIds).toEqual([]);
    expect(validatePayload(data)).toBeDefined();
  });
  it('construye solo tel/sms válidos y escapa el cuerpo', () => {
    expect(phoneDestination('+57 (300) 000-0000', 'tel')).toBe('tel:+573000000000');
    expect(phoneDestination('3000000000', 'sms', 'Hola & compañía')).toContain(
      'body=Hola%20%26%20compa%C3%B1%C3%ADa',
    );
    expect(() => phoneDestination('javascript:alert(1)', 'tel')).toThrow();
  });
  it('mantiene las seis fichas sin aprobación clínica inventada', () => {
    expect(skills).toHaveLength(6);
    expect(new Set(skills.map((s) => s.id)).size).toBe(6);
    for (const skill of skills) {
      expect(skill.reviewStatus).toBe('pending');
      expect(skill.precautions.length).toBeGreaterThan(0);
      expect(skill.steps.length).toBeGreaterThan(0);
    }
    expect(skills.find((s) => s.id === 'tip')!.precautions.join(' ')).toContain('cardiovasculares');
  });
  it('separa ciudades y países sin ampliar la cobertura a departamentos', () => {
    for (const [country, code, phones] of [
      ['CO', 'CO-ANT-MDE', ['123', '106']],
      ['CO', 'CO-VAC-CLO', ['123', '106']],
      ['DE', 'DE-HE-FRA', ['112', '116123']],
      ['NL', 'NL-NH-AMS', ['112', '0880767000']],
    ] as const) {
      expect(applicableResources(country, code).map((r) => r.phone)).toEqual(phones);
      expect(applicableResources('OTHER', code)).toEqual([]);
      const data = newVault();
      data.profile.country = country;
      data.profile.regionCode = code;
      expect(validatePayload(data).profile.country).toBe(country);
    }
    expect(applicableResources('CO', 'CO-VAC')).toEqual([]);
    expect(applicableResources('CO', 'DE-HE-FRA')).toEqual([]);
    expect(applicableResources('DE', '')).toEqual([]);
  });
  it('no distribuye números pendientes; filtra país, cobertura y retirados', () => {
    expect(applicableResources('CO', 'CO-DC').map((r) => r.phone)).toEqual(['123', '106']);
    expect(applicableResources('CO', 'CO-ANT')).toEqual([]);
    expect(applicableResources('OTHER', 'CO-DC')).toEqual([]);
    expect(applicableResources('CO', '')).toEqual([]);
    expect(
      emergencyResources.every(
        (r) => r.officialSourceUrl.startsWith('https://') && r.sourceName.length > 0,
      ),
    ).toBe(true);
    const resource: EmergencyResource = {
      id: 'fixture',
      country: 'CO',
      regionCodes: ['CO-DC'],
      coverageText: 'Solo fixture sintético',
      serviceName: 'Fixture',
      sourceName: 'Fixture sintético',
      phone: '999',
      availabilityText: 'Ejemplo',
      officialSourceUrl: 'https://example.gov.test',
      verifiedAt: '2026-01-01T00:00:00.000Z',
      reviewDueAt: '2026-04-01T00:00:00.000Z',
      verificationStatus: 'verified',
      reviewerRole: 'Revisor de prueba',
    };
    expect(applicableResources('CO', 'CO-DC', [resource])).toHaveLength(1);
    expect(applicableResources('CO', 'CO-ANT', [resource])).toEqual([]);
    expect(
      applicableResources('CO', 'CO-DC', [
        { ...resource, verificationStatus: 'pending' },
        { ...resource, verificationStatus: 'retired' },
      ]),
    ).toEqual([]);
    expect(reviewOverdue(resource, Date.parse('2026-05-01'))).toBe(true);
    expect(applicableResources('CO', 'CO-DC', [resource])).toHaveLength(1);
  });
});
