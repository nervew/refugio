export interface EmergencyResource {
  id: string;
  country: string;
  regionCodes: string[];
  coverageText: string;
  serviceName: string;
  phone: string;
  availabilityText: string;
  sourceName: string;
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
    sourceName: 'Secretaría Distrital de Salud de Bogotá',
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
    sourceName: 'Secretaría Distrital de Salud de Bogotá',
    officialSourceUrl: 'https://www.saludcapital.gov.co/Paginas2/llamanos_Linea106.aspx',
    verifiedAt: '2026-10-16T12:00:00.000Z',
    reviewDueAt: '2027-01-14T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
  {
    id: 'co-mde-123',
    country: 'CO',
    regionCodes: ['CO-ANT-MDE'],
    coverageText: 'Medellín, Colombia · Emergencias médicas y de seguridad.',
    serviceName: 'Línea 123 · Emergencias',
    phone: '123',
    availabilityText: 'Atención las 24 horas, todos los días. Marca desde Medellín.',
    sourceName: 'Alcaldía de Medellín · SIES-M',
    officialSourceUrl: 'https://www.medellin.gov.co/es/secretaria-seguridad/siesm/',
    verifiedAt: '2026-10-18T00:00:00.000Z',
    reviewDueAt: '2027-01-16T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
  {
    id: 'co-mde-106',
    country: 'CO',
    regionCodes: ['CO-ANT-MDE'],
    coverageText:
      'Medellín, Colombia · Orientación psicológica para habitantes del Distrito. No sustituye al 123 ante peligro inmediato.',
    serviceName: 'Línea Amiga 106 · Orientación emocional',
    phone: '106',
    availabilityText: 'Atención gratuita las 24 horas, todos los días. Marca desde Medellín.',
    sourceName: 'Secretaría de Salud de Medellín',
    officialSourceUrl: 'https://www.medellin.gov.co/es/secretaria-de-salud/linea-amiga/',
    verifiedAt: '2026-10-18T00:00:00.000Z',
    reviewDueAt: '2027-01-16T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
  {
    id: 'co-clo-123',
    country: 'CO',
    regionCodes: ['CO-VAC-CLO'],
    coverageText: 'Cali, Colombia · Emergencias y activación de atención urgente en salud mental.',
    serviceName: 'Línea 123 · Emergencias',
    phone: '123',
    availabilityText: 'Para emergencias en Cali. La fuente consultada no especifica el horario.',
    sourceName: 'Alcaldía de Santiago de Cali · Secretaría de Salud Pública',
    officialSourceUrl:
      'https://www.cali.gov.co/boletines/publicaciones/192266/para-prevenir-riesgos-en-salud-mental-el-gobierno-de-alejandro-eder-promueve-el-codigo-dorado/',
    verifiedAt: '2026-10-18T00:00:00.000Z',
    reviewDueAt: '2027-01-16T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
  {
    id: 'co-clo-106',
    country: 'CO',
    regionCodes: ['CO-VAC-CLO'],
    coverageText:
      'Cali, Colombia · Orientación y primeros auxilios psicológicos por profesionales de salud mental. No sustituye al 123 ante peligro inmediato.',
    serviceName: 'Línea 106 · Orientación emocional',
    phone: '106',
    availabilityText: 'Atención las 24 horas, todos los días. Marca desde Cali.',
    sourceName: 'Alcaldía de Santiago de Cali · Secretaría de Salud Pública',
    officialSourceUrl:
      'https://www.cali.gov.co/boletines/publicaciones/192156/alcaldia-de-cali-prioriza-la-salud-mental-calenos-tienen-a-disposicion-la-linea-106-para-teleorientacion/',
    verifiedAt: '2026-10-18T00:00:00.000Z',
    reviewDueAt: '2027-01-16T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
  {
    id: 'de-fra-112',
    country: 'DE',
    regionCodes: ['DE-HE-FRA'],
    coverageText:
      'Frankfurt am Main, Alemania · Bomberos y urgencias médicas. El 112 conecta con los servicios del lugar desde donde llamas.',
    serviceName: '112 · Emergencias médicas y bomberos',
    phone: '112',
    availabilityText: 'Llamada gratuita desde Alemania para emergencias.',
    sourceName: 'Feuerwehr Frankfurt am Main · Bomberos de Frankfurt',
    officialSourceUrl: 'https://www.feuerwehr-frankfurt.de/ihre-sicherheit/notruf',
    verifiedAt: '2026-10-18T00:00:00.000Z',
    reviewDueAt: '2027-01-16T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
  {
    id: 'de-fra-listening',
    country: 'DE',
    regionCodes: ['DE-HE-FRA'],
    coverageText:
      'Servicio nacional de Alemania, disponible en Frankfurt am Main · Escucha para hablar de preocupaciones o malestar emocional. No envía ambulancias.',
    serviceName: 'TelefonSeelsorge · Escucha emocional',
    phone: '116123',
    availabilityText:
      'Gratuito, día y noche. Atención en alemán; no se garantiza atención en español. Marca desde Alemania.',
    sourceName: 'TelefonSeelsorge Deutschland · Entidad operadora',
    officialSourceUrl: 'https://www.telefonseelsorge.de/telefon/',
    verifiedAt: '2026-10-18T00:00:00.000Z',
    reviewDueAt: '2027-01-16T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
  {
    id: 'nl-ams-112',
    country: 'NL',
    regionCodes: ['NL-NH-AMS'],
    coverageText:
      'Servicio nacional de Países Bajos, disponible en Ámsterdam · Peligro inmediato, ambulancia, policía o bomberos. Conecta con los servicios del lugar desde donde llamas.',
    serviceName: '112 · Emergencias',
    phone: '112',
    availabilityText:
      'Para emergencias en Países Bajos. Indica qué sucede, dónde estás y qué ayuda necesitas.',
    sourceName: 'Gobierno de Países Bajos · Government.nl',
    officialSourceUrl:
      'https://www.government.nl/documents/question-and-answer/emergency-number-112/when-can-i-call-112',
    verifiedAt: '2026-10-18T00:00:00.000Z',
    reviewDueAt: '2027-01-16T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
  {
    id: 'nl-ams-listening',
    country: 'NL',
    regionCodes: ['NL-NH-AMS'],
    coverageText:
      'Servicio nacional de Países Bajos, disponible en Ámsterdam · Conversación confidencial cuando necesitas que alguien te escuche. No sustituye al 112 ante peligro inmediato.',
    serviceName: 'De Luisterlijn · Escucha emocional',
    phone: '0880767000',
    availabilityText:
      'Día y noche, todo el año. Se aplican las tarifas habituales de tu operador. Atención en neerlandés. Marca desde Países Bajos; no se ha confirmado atención en español.',
    sourceName: 'De Luisterlijn · Entidad operadora',
    officialSourceUrl: 'https://www.deluisterlijn.nl/over-de-luisterlijn/veelgestelde-vragen/',
    verifiedAt: '2026-10-18T00:00:00.000Z',
    reviewDueAt: '2027-01-16T12:00:00.000Z',
    verificationStatus: 'verified',
    reviewerRole: 'Verificación documental automatizada de fuente oficial; sin llamada de prueba',
  },
];
export const regions = [
  ['CO-DC', 'Bogotá, Colombia'],
  ['CO-ANT-MDE', 'Medellín, Colombia'],
  ['CO-VAC-CLO', 'Cali, Colombia'],
  ['DE-HE-FRA', 'Frankfurt am Main, Alemania'],
  ['NL-NH-AMS', 'Ámsterdam, Países Bajos'],
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
  if (!region) return [];
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
