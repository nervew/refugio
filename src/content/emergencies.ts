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
export const emergencyResources: EmergencyResource[] = [];
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
