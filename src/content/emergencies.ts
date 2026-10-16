export interface EmergencyResource {
  id: string;
  country: string;
  regionCodes: string[];
  coverageText: string;
  serviceName: string;
  phone: string;
  availabilityText: string;
  officialSourceUrl: string;
  verifiedAt: string;
  reviewDueAt: string;
  verificationStatus: 'pending' | 'verified' | 'retired';
  reviewerRole: string;
}
// No se distribuye un teléfono sin evidencia oficial. No inferir cobertura nacional.
export const emergencyResources: EmergencyResource[] = [
  {
    id: 'co-dc-123',
    country: 'CO',
    regionCodes: ['CO-DC'],
    coverageText: 'Bogotá D. C. · Peligro inmediato y emergencias de salud o seguridad.',
    serviceName: 'Línea 123 · Emergencias',
    phone: '123',
    availabilityText:
      'Atención las 24 horas, todos los días. Marca desde teléfono fijo o celular en Bogotá.',
    officialSourceUrl: 'https://www.saludcapital.gov.co/Paginas2/Linea_123.aspx',
    verifiedAt: '2026-10-16T12:00:00.000Z',
    reviewDueAt: '2027-01-14T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
  {
    id: 'co-dc-106',
    country: 'CO',
    regionCodes: ['CO-DC'],
    coverageText:
      'Bogotá D. C. · Escucha, apoyo y orientación emocional, también ante ideas de suicidio. No sustituye la respuesta de emergencias del 123.',
    serviceName: 'Línea 106 · Escucha y orientación',
    phone: '106',
    availabilityText:
      'Servicio gratuito, las 24 horas, todos los días, desde teléfono fijo o celular en Bogotá.',
    officialSourceUrl: 'https://www.saludcapital.gov.co/Paginas2/llamanos_Linea106.aspx',
    verifiedAt: '2026-10-16T12:00:00.000Z',
    reviewDueAt: '2027-01-14T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
];
export const regions = [
  ['CO-DC', 'Bogotá D. C.'],
  ['CO-ANT', 'Antioquia'],
  ['CO-VAC', 'Valle del Cauca'],
  ['CO-ATL', 'Atlántico'],
  ['CO-CUN', 'Cundinamarca'],
  ['CO-OTHER', 'Otra región de Colombia'],
] as const;
export function applicableResources(
  country: string,
  region: string,
  resources = emergencyResources,
): EmergencyResource[] {
  return resources.filter(
    (r) =>
      r.verificationStatus === 'verified' &&
      r.country === country &&
      (r.regionCodes.includes(region) || r.regionCodes.includes('ALL')) &&
      /^https:\/\//.test(r.officialSourceUrl) &&
      /^\+?[0-9]{3,15}$/.test(r.phone) &&
      Number.isFinite(Date.parse(r.verifiedAt)) &&
      Number.isFinite(Date.parse(r.reviewDueAt)) &&
      r.reviewerRole.length > 0,
  );
}
export const reviewOverdue = (r: EmergencyResource, now = Date.now()) =>
  now > Math.min(Date.parse(r.reviewDueAt), Date.parse(r.verifiedAt) + 90 * 86400000) ||
  now < Date.parse(r.verifiedAt);
