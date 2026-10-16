import { z } from 'zod';
import { LocalError } from './errors';

export const skillIds = [
  'stop',
  'pros-contras',
  'tip',
  'aceptas',
  'cinco-sentidos',
  'salvara',
] as const;
export type SkillId = (typeof skillIds)[number];
export const planFields = {
  frequentEmotions: ['Emociones frecuentes', 'Por ejemplo: miedo, tristeza, rabia.'],
  earlySignals: ['Señales tempranas', '¿Qué notas cuando empieza a ser difícil?'],
  vulnerabilities: ['Vulnerabilidades', 'Condiciones previas: dormir poco, hambre, cansancio.'],
  triggers: ['Desencadenantes', 'Acontecimientos: una discusión, un mensaje, un recuerdo.'],
  thoughts: [
    'Pensamientos asociados',
    'Palabras o imágenes que aparecen. No son hechos por sí mismas.',
  ],
  bodySensations: ['Sensaciones corporales', 'Por ejemplo: tensión en los hombros.'],
  impulses: ['Impulsos', 'Lo que sientes ganas de hacer, aunque no lo hagas.'],
  helpfulStrategies: [
    'Estrategias que ayudan',
    'Acciones seguras y conocidas que quieres recordar.',
  ],
  unhelpfulStrategies: [
    'Estrategias que empeoran',
    'Lo que prefieres evitar durante un momento difícil.',
  ],
  safetySteps: [
    'Mis próximos pasos',
    'Hasta tres instrucciones breves, en el orden que prefieras.',
  ],
} as const;
export type PlanField = keyof typeof planFields;
const text = (max = 500) =>
  z
    .string()
    .refine((s) => [...s].length <= max, `Máximo ${max} caracteres`)
    .refine((s) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(s), 'Texto no válido');
const id = z.uuid();
const date = z.iso.datetime();
const ids = z
  .array(id)
  .max(100)
  .refine((a) => new Set(a).size === a.length);
const texts = z.array(text()).max(50);
const skillList = z
  .array(z.enum(skillIds))
  .max(6)
  .refine((a) => new Set(a).size === a.length);
const itemSchema = z.strictObject({ id, text: text(), order: z.number().int().min(0).max(50) });
const items = (max = 50) =>
  z
    .array(itemSchema)
    .max(max)
    .refine((a) => new Set(a.map((i) => i.order)).size === a.length);
export const phoneSchema = z
  .string()
  .max(32)
  .regex(/^\+?[0-9][0-9 ()-]{2,31}$/);
const contactSchema = z.strictObject({
  id,
  displayName: text(100).refine((s) => s.trim().length > 0),
  role: z.enum(['personal', 'professional']),
  channels: z
    .array(z.strictObject({ type: z.enum(['tel', 'sms']), value: phoneSchema }))
    .min(1)
    .max(4),
  availabilityText: text().optional(),
  supportMessage: text(1000).optional(),
  alternateContactId: id.optional(),
  order: z.number().int().min(0).max(100),
  updatedAt: date,
});
const planSchema = z.strictObject({
  id,
  version: z.literal(1),
  updatedAt: date,
  frequentEmotions: items(),
  earlySignals: items(),
  vulnerabilities: items(),
  triggers: items(),
  thoughts: items(),
  bodySensations: items(),
  impulses: items(),
  helpfulStrategies: items(),
  unhelpfulStrategies: items(),
  safetySteps: items(3),
  prioritySkillIds: skillList,
  priorityContactIds: ids,
  professionalContactIds: ids,
  personalEmergencyContactIds: ids,
  emergencyResourceIds: z.array(z.string().regex(/^[a-z0-9-]{1,80}$/)).max(50),
});
const preferenceSchema = z
  .strictObject({
    skillId: z.enum(skillIds),
    personalSteps: z.array(text()).max(20),
    helpfulExamples: z.array(text()).max(20),
    avoidNotes: text().optional(),
    updatedAt: date,
    prosConsCard: z
      .strictObject({
        impulsePros: text().optional(),
        impulseCons: text().optional(),
        alternativePros: text().optional(),
        alternativeCons: text().optional(),
        summary: text().optional(),
      })
      .optional(),
  })
  .refine((p) => !p.prosConsCard || p.skillId === 'pros-contras');
const reflectionSchema = z.strictObject({
  id,
  occurredAt: date.optional(),
  situation: text(4000).optional(),
  vulnerabilities: texts,
  trigger: text().optional(),
  emotions: texts,
  thoughts: texts,
  bodySensations: texts,
  impulses: texts,
  skillIds: skillList,
  intensityBefore: z.number().int().min(0).max(10).optional(),
  intensityAfter: z.number().int().min(0).max(10).optional(),
  outcome: text(4000).optional(),
  learning: text(4000).optional(),
  createdAt: date,
  updatedAt: date,
});
export const vaultSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    vaultId: id,
    revision: z.number().int().min(0),
    createdAt: date,
    updatedAt: date,
    profile: z.strictObject({
      locale: z.literal('es-CO'),
      country: z.literal('CO'),
      regionCode: z
        .string()
        .regex(/^[A-Z0-9-]{1,30}$/)
        .optional(),
      adultConfirmedAt: date,
      privacyNoticeVersion: z.literal('1'),
      sensitiveDataAcknowledgedAt: date,
    }),
    plan: planSchema,
    contacts: z.array(contactSchema).max(100),
    skillPreferences: z.array(preferenceSchema).max(6),
    reflections: z.array(reflectionSchema).max(200),
  })
  .superRefine((v, ctx) => {
    const fail = () =>
      ctx.addIssue({ code: 'custom', message: 'Referencias o identificadores no válidos.' });
    const all = [
      v.vaultId,
      v.plan.id,
      ...v.contacts.map((c) => c.id),
      ...v.reflections.map((c) => c.id),
      ...Object.keys(planFields).flatMap((k) => v.plan[k as PlanField].map((i) => i.id)),
    ];
    if (
      new Set(all).size !== all.length ||
      new Set(v.skillPreferences.map((p) => p.skillId)).size !== v.skillPreferences.length
    )
      fail();
    const contactIds = new Set(v.contacts.map((c) => c.id));
    for (const ref of [
      ...v.plan.priorityContactIds,
      ...v.plan.professionalContactIds,
      ...v.plan.personalEmergencyContactIds,
    ])
      if (!contactIds.has(ref)) fail();
    for (const c of v.contacts)
      if (
        c.alternateContactId &&
        (!contactIds.has(c.alternateContactId) || c.alternateContactId === c.id)
      )
        fail();
  });
export type VaultPayload = z.infer<typeof vaultSchema>;
export type Contact = VaultPayload['contacts'][number];
export type Reflection = VaultPayload['reflections'][number];
export type SkillPreference = VaultPayload['skillPreferences'][number];
export type PlanItem = z.infer<typeof itemSchema>;
export const MAX_PAYLOAD = 2 * 1024 * 1024;
export const MAX_FILE = 8 * 1024 * 1024;
export function validatePayload(input: unknown): VaultPayload {
  if (input && typeof input === 'object' && 'schemaVersion' in input && input.schemaVersion !== 1)
    throw new LocalError('UNSUPPORTED_VERSION');
  const parsed = vaultSchema.safeParse(input);
  if (!parsed.success) throw new LocalError('INVALID_INPUT');
  if (new TextEncoder().encode(JSON.stringify(parsed.data)).length > MAX_PAYLOAD)
    throw new LocalError('LIMIT_REACHED');
  return parsed.data;
}
export function newVault(): VaultPayload {
  const now = new Date().toISOString();
  const plan = Object.fromEntries(Object.keys(planFields).map((k) => [k, []]));
  return validatePayload({
    schemaVersion: 1,
    vaultId: crypto.randomUUID(),
    revision: 0,
    createdAt: now,
    updatedAt: now,
    profile: {
      locale: 'es-CO',
      country: 'CO',
      adultConfirmedAt: now,
      privacyNoticeVersion: '1',
      sensitiveDataAcknowledgedAt: now,
    },
    plan: {
      ...plan,
      id: crypto.randomUUID(),
      version: 1,
      updatedAt: now,
      prioritySkillIds: [],
      priorityContactIds: [],
      professionalContactIds: [],
      personalEmergencyContactIds: [],
      emergencyResourceIds: [],
    },
    contacts: [],
    skillPreferences: [],
    reflections: [],
  });
}
export function listItems(lines: string): PlanItem[] {
  return lines
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((value, order) => ({ id: crypto.randomUUID(), text: value, order }));
}
export const lines = (items: PlanItem[]) =>
  [...items]
    .sort((a, b) => a.order - b.order)
    .map((i) => i.text)
    .join('\n');
export const splitLines = (value: string) =>
  value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
