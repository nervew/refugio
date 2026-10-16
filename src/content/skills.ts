import type { SkillId } from '../domain/model';
export interface Skill {
  id: SkillId;
  title: string;
  short: string;
  goal: string;
  when: string;
  precautions: string[];
  steps: string[];
  example: string;
  reviewStatus: 'pending';
  contentVersion: '1';
}
const review = { reviewStatus: 'pending', contentVersion: '1' } as const;
export const skills: Skill[] = [
  {
    ...review,
    id: 'stop',
    title: 'STOP',
    short: 'Una pausa antes de actuar',
    goal: 'Crear un espacio entre un impulso y tu siguiente acción.',
    when: 'Cuando notas urgencia por responder o decidir.',
    precautions: [
      'Una pausa no debe retrasar atención urgente ni mantenerte en un lugar peligroso.',
      'Puedes mantener los ojos abiertos y elegir una opción sin concentrarte en tu cuerpo.',
    ],
    steps: [
      'Pausa la acción un momento, si estás a salvo.',
      'Toma un poco de distancia. Puedes quedarte quieto o apartarte.',
      'Observa una cosa que ocurre dentro y otra a tu alrededor.',
      'Elige un siguiente paso que te cuide ahora.',
    ],
    example:
      'Antes de enviar un mensaje impulsivo, deja el teléfono, mira el entorno y elige pedir un poco de tiempo.',
  },
  {
    ...review,
    id: 'pros-contras',
    title: 'Pros y contras',
    short: 'Recordar tus alternativas',
    goal: 'Recordar las consecuencias de seguir un impulso y de elegir una alternativa segura.',
    when: 'Sobre todo en preparación. En un momento difícil, puedes leer una tarjeta que ya preparaste.',
    precautions: [
      'No uses una balanza para decidir si pedir ayuda urgente.',
      'No necesitas detallar conductas peligrosas. Si pensar en opciones aumenta tu malestar, cambia de habilidad o pide apoyo.',
    ],
    steps: [
      'Nombra la decisión sin entrar en detalles.',
      'Lee lo que te puede ayudar a corto y a largo plazo.',
      'Lee lo que podría dificultarte las cosas.',
      'Elige una alternativa de cuidado para este momento.',
    ],
    example:
      'Compara responder inmediatamente a una discusión con dejar la respuesta pendiente y hablar después.',
  },
  {
    ...review,
    id: 'tip',
    title: 'TIP',
    short: 'Una alternativa corporal suave',
    goal: 'Acompañar la activación con una alternativa conservadora. Esta guía no representa todos los procedimientos de TIP.',
    when: 'Si quieres una práctica suave y no necesitas atención urgente.',
    precautions: [
      'Las técnicas de temperatura, ejercicio y cambios respiratorios pueden no ser adecuadas, especialmente con condiciones cardiovasculares, respiratorias, desmayos, embarazo, lesiones o restricciones médicas. Esta lista no es exhaustiva.',
      'Esta versión no guía hielo, inmersión facial, frío extremo, ejercicio intenso, hiperventilación ni retenciones respiratorias.',
      'Dolor torácico, dificultad respiratoria importante o desmayo requieren atención humana, no una práctica guiada.',
      'Puedes elegir una opción visual sin enfocarte en el cuerpo y detenerte si te incomoda.',
    ],
    steps: [
      'Si te resulta cómodo, nota el apoyo del asiento o del suelo. También puedes limitarte a mirar a tu alrededor.',
      'Mira un objeto y describe su color.',
      'Deja que tu respiración siga un ritmo cómodo, sin forzarla. Puedes omitir este paso.',
      'Afloja una zona del cuerpo si te resulta agradable. Puedes omitirlo.',
      'Comprueba si prefieres continuar, cambiar o pedir apoyo.',
    ],
    example:
      'Sentado, observa un color cercano. Si te resulta cómodo, nota el respaldo y suelta suavemente los hombros.',
  },
  {
    ...review,
    id: 'aceptas',
    title: 'ACEPTAS',
    short: 'Dar un descanso a la atención',
    goal: 'Atravesar un pico de malestar con una actividad breve y segura.',
    when: 'Cuando abordar el problema ahora no ayuda o no es posible.',
    precautions: [
      'No uses la distracción para ignorar peligro o una necesidad médica.',
      'Evita sustancias, gastos, actividades compulsivas o sensaciones dolorosas. No necesitas comparar tu sufrimiento con el de otras personas.',
      'El nombre y su traducción varían por región; esta es una adaptación descriptiva en revisión.',
    ],
    steps: [
      'Elige una actividad segura que ya conozcas.',
      'Dedícale un rato breve. Puedes detenerte.',
      'Vuelve a comprobar qué necesitas.',
      'Elige apoyo, otra pausa o un siguiente paso.',
    ],
    example:
      'Ordena tres objetos, escucha una canción conocida o cuenta formas que ves a tu alrededor.',
  },
  {
    ...review,
    id: 'cinco-sentidos',
    title: 'Cálmate con los cinco sentidos',
    short: 'Buscar una sensación amable',
    goal: 'Encontrar un estímulo cotidiano reconfortante o neutral.',
    when: 'Si quieres apoyo sensorial y puedes elegir qué sentido utilizar.',
    precautions: [
      'No necesitas usar todos los sentidos. Evita estímulos que te incomoden, alergias, aromas fuertes o sonidos altos.',
      'No se recomienda ingerir sustancias ni buscar sensaciones dolorosas. Comer o beber nunca es obligatorio.',
    ],
    steps: [
      'Elige un sentido que te resulte cómodo.',
      'Busca una sensación suave o neutral.',
      'Pon atención unos instantes, si te ayuda.',
      'Cambia o detén la práctica cuando quieras.',
    ],
    example:
      'Mira un color agradable, escucha un sonido suave o el silencio, o toca una textura cómoda. Puedes omitir cualquier sentido.',
  },
  {
    ...review,
    id: 'salvara',
    title: 'SALVARA',
    short: 'Hacer este momento más llevadero',
    goal: 'Encontrar una pequeña acción de significado, calma o autocuidado.',
    when: 'Si quieres una pausa y una guía breve sin resolver todo el problema.',
    precautions: [
      'La imaginación, relajación o espiritualidad pueden incomodar. Son opciones libres, nunca obligaciones.',
      'No necesitas buscar un propósito al sufrimiento ni tolerar una situación peligrosa.',
      'SALVARA es un nombre regional solicitado; no se afirma una expansión literal del acrónimo. Adaptación en revisión.',
    ],
    steps: [
      'Elige algo que haga este minuto un poco más llevadero.',
      'Prueba una frase amable, mira un lugar real que te tranquilice o atiende una tarea sencilla.',
      'Permítete una pausa breve, si estás a salvo.',
      'Decide si necesitas compañía o un siguiente paso.',
    ],
    example:
      '«Solo necesito ocuparme de este paso», mientras observas una ventana. Puedes elegir una opción sin imágenes mentales ni espiritualidad.',
  },
];
export const getSkill = (id: string) => skills.find((skill) => skill.id === id);
