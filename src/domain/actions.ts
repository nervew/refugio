import { LocalError } from './errors';
import {
  phoneSchema,
  type VaultPayload,
  type Contact,
  type Reflection,
  type SkillPreference,
} from './model';
export function saveContact(draft: VaultPayload, contact: Contact) {
  const index = draft.contacts.findIndex((c) => c.id === contact.id);
  if (index === -1) draft.contacts.push(contact);
  else draft.contacts[index] = contact;
  draft.contacts
    .sort((a, b) => a.order - b.order)
    .forEach((c, index) => {
      c.order = index;
    });
  draft.plan.professionalContactIds = draft.contacts
    .filter((c) => c.role === 'professional')
    .map((c) => c.id);
}
export function removeContact(draft: VaultPayload, id: string) {
  draft.contacts = draft.contacts.filter((c) => c.id !== id);
  draft.contacts
    .sort((a, b) => a.order - b.order)
    .forEach((c, index) => {
      c.order = index;
    });
  for (const key of [
    'priorityContactIds',
    'professionalContactIds',
    'personalEmergencyContactIds',
  ] as const)
    draft.plan[key] = draft.plan[key].filter((ref) => ref !== id);
  draft.contacts.forEach((c) => {
    if (c.alternateContactId === id) delete c.alternateContactId;
  });
}
export function saveReflection(draft: VaultPayload, reflection: Reflection) {
  const index = draft.reflections.findIndex((r) => r.id === reflection.id);
  if (index < 0) draft.reflections.push(reflection);
  else draft.reflections[index] = reflection;
}
export function savePreference(draft: VaultPayload, pref: SkillPreference) {
  const index = draft.skillPreferences.findIndex((p) => p.skillId === pref.skillId);
  if (index < 0) draft.skillPreferences.push(pref);
  else draft.skillPreferences[index] = pref;
}
export function phoneDestination(value: string, type: 'tel' | 'sms', message = ''): string {
  if (!phoneSchema.safeParse(value).success) throw new LocalError('INVALID_INPUT');
  const phone = value.replace(/[ ()-]/g, '');
  return `${type}:${phone}${type === 'sms' && message ? `?body=${encodeURIComponent(message)}` : ''}`;
}
export const now = () => new Date().toISOString();
export const newId = () => crypto.randomUUID();
