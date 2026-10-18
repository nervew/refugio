import { planFields, type PlanField, type SkillId, type VaultPayload } from '../domain/model';
import { applicableResources, regions, reviewOverdue } from './emergencies';
import { getSkill } from './skills';

export const crisisSkills: { id: SkillId; title: string; prompt: string }[] = [
  {
    id: 'stop',
    title: 'STOP · Hacer una pausa antes de actuar',
    prompt: '¿Qué haré para pausar y elegir mi siguiente acción?',
  },
  {
    id: 'tip',
    title: 'TIP · Adaptación corporal suave',
    prompt: '¿Qué opción suave y conocida me resulta cómoda? ¿Qué debo evitar por mi salud?',
  },
  {
    id: 'pros-contras',
    title: 'Tolerancia al malestar · Recordar mis alternativas',
    prompt: '¿Qué me ayuda a atravesar este momento sin empeorarlo?',
  },
  {
    id: 'aceptas',
    title: 'Habilidades de distracción',
    prompt: '¿Qué actividad segura puedo hacer durante un rato breve?',
  },
  {
    id: 'salvara',
    title: 'Mejora el momento',
    prompt: '¿Qué pequeña acción de calma, significado o autocuidado elegiré?',
  },
  {
    id: 'cinco-sentidos',
    title: 'Cálmate con los 5 sentidos · Elegir una sensación cómoda',
    prompt:
      '¿Qué puedo mirar, escuchar o tocar que me resulte agradable o neutral? No necesito usar todos los sentidos.',
  },
];
export interface DocumentSection {
  title: string;
  paragraphs: string[];
  children?: DocumentSection[];
}
export interface CrisisDocument {
  title: string;
  intro: string[];
  sections: DocumentSection[];
}
export interface DocumentOptions {
  fields: PlanField[];
  includeSkills: boolean;
  includeContacts: boolean;
  region: string;
}
export function buildCrisisDocument(data: VaultPayload, options: DocumentOptions): CrisisDocument {
  const notes = (field: PlanField) =>
    options.fields.includes(field)
      ? [...data.plan[field]].sort((a, b) => a.order - b.order).map((item) => item.text)
      : [];
  const fieldSection = (field: PlanField, title: string, explanation: string): DocumentSection => ({
    title,
    paragraphs: [
      explanation,
      ...(notes(field).length
        ? notes(field)
        : [
            options.fields.includes(field)
              ? 'Mi respuesta: ____________________ (puedo completarla después).'
              : 'Notas personales omitidas por mi elección.',
          ]),
    ],
  });
  const contactSection = (role: 'personal' | 'professional', title: string): DocumentSection => {
    const selected = options.includeContacts
      ? data.contacts.filter((c) => c.role === role).sort((a, b) => a.order - b.order)
      : [];
    return {
      title,
      paragraphs: selected.length
        ? selected.map((c) =>
            [
              c.displayName,
              ...c.channels.map(
                (channel) => `${channel.type === 'tel' ? 'Teléfono' : 'SMS'}: ${channel.value}`,
              ),
              c.availabilityText
                ? `Disponibilidad: ${c.availabilityText}`
                : 'Disponibilidad: por acordar.',
            ].join('\n'),
          )
        : [
            options.includeContacts
              ? 'Aún no he guardado un contacto de este tipo.'
              : 'Datos de contactos omitidos por mi elección.',
            role === 'personal'
              ? 'Persona de confianza: ____________________\nNúmero: ____________________\nSi no responde, puedo acudir a: ____________________'
              : 'Terapeuta o profesional, si tengo: ____________________\nNúmero y horario acordado: ____________________\nNo necesito estar en terapia para preparar este plan.',
          ],
    };
  };
  const country = options.region.split('-')[0];
  const resources = applicableResources(country, options.region);
  const place = regions.find(([code]) => code === options.region)?.[1];
  const sections: DocumentSection[] = [
    fieldSection(
      'vulnerabilities',
      '1. Vulnerabilidades',
      'Factores que pueden hacerme más sensible al malestar: dormir poco, estar enfermo, hambre o demasiados estímulos. Identifico los míos sin juzgarme.',
    ),
    fieldSection(
      'triggers',
      '2. Eventos desencadenantes',
      'Situaciones que pueden preceder a un aumento de mi malestar emocional: por ejemplo, una discusión, un mensaje o un recuerdo. Escribo lo que reconozco en mi experiencia.',
    ),
    {
      title: '3. Habilidades para manejar la crisis emocional',
      paragraphs: [
        'Una crisis emocional es un momento en que lo que siento me sobrepasa y me cuesta decidir qué hacer. No necesito un diagnóstico para preparar este plan. Elijo acciones seguras, conocidas y adaptadas a mis necesidades.',
      ],
      children: options.includeSkills
        ? crisisSkills.map(({ id, title, prompt }) => {
            const skill = getSkill(id)!;
            const pref = data.skillPreferences.find((p) => p.skillId === id);
            const personal = [...(pref?.personalSteps ?? []), ...(pref?.helpfulExamples ?? [])];
            return {
              title,
              paragraphs: [
                skill.goal,
                'Guía de apoyo:\n' + skill.steps.map((step, i) => `${i + 1}. ${step}`).join('\n'),
                'Mi forma de usarla:\n' +
                  (personal.length
                    ? personal.join('\n')
                    : prompt + '\nMi respuesta: ____________________'),
                ...(pref?.avoidNotes ? [`Prefiero evitar: ${pref.avoidNotes}`] : []),
                ...(pref?.prosConsCard?.summary
                  ? [`Mi recordatorio final: ${pref.prosConsCard.summary}`]
                  : []),
                'Precauciones:\n' + skill.precautions.join('\n'),
              ],
            };
          })
        : [
            {
              title: 'Guías y notas omitidas por mi elección',
              paragraphs: ['Mis habilidades para este momento: ____________________'],
            },
          ],
    },
    contactSection('personal', '4. Número de un amigo o persona de confianza'),
    contactSection('professional', '5. Número de terapeuta o profesional'),
    {
      title: '6. Líneas de emergencia y orientación emocional',
      paragraphs: resources.length
        ? [
            `Lugar desde donde llamaré: ${place}. Los números cortos corresponden al lugar seleccionado.`,
            ...resources.map(
              (r) =>
                `${r.serviceName}: ${r.phone}\n${r.coverageText}\n${r.availabilityText}\nFuente: ${r.sourceName}\n${r.officialSourceUrl}\nConsulta documental: ${r.verifiedAt.slice(0, 10)}; sin llamada de prueba.${reviewOverdue(r) ? '\nRevisión pendiente: esta información puede haber cambiado.' : ''}`,
            ),
          ]
        : [
            'Aún no he elegido un lugar con líneas verificadas. No se asignan los números 106 y 123 a otros países ni se supone cobertura fuera de las ciudades verificadas.\nLugar donde estaré: ____________________\nEmergencias: ____________________\nOrientación emocional: ____________________',
            'Si hay peligro inmediato, busco atención presencial en urgencias o pido a alguien cercano que me acompañe.',
          ],
    },
  ];
  for (const field of options.fields.filter(
    (field) => field !== 'vulnerabilities' && field !== 'triggers',
  )) {
    sections.push({
      title: planFields[field][0],
      paragraphs: notes(field).length
        ? notes(field)
        : ['Sin notas guardadas. Puedo completarlo después.'],
    });
  }
  return {
    title: 'Mi plan de crisis emocional',
    intro: [
      'Plan individual y personalizado. Lo preparo en calma, con mis propias palabras y experiencias. Puedo dejar apartados pendientes y revisarlos con una persona de confianza o un profesional.',
      'Documento privado sin cifrar. No sustituye atención profesional ni emergencias. Refugio no llama ni avisa a nadie automáticamente.',
      'Guías adaptadas en revisión profesional; la sección TIP es parcial y no incluye frío extremo ni ejercicio intenso.',
    ],
    sections,
  };
}
export function documentText(document: CrisisDocument): string {
  const render = (section: DocumentSection): string =>
    [section.title, ...section.paragraphs, ...(section.children ?? []).map(render)].join('\n\n');
  return [document.title, ...document.intro, ...document.sections.map(render)].join('\n\n') + '\n';
}
