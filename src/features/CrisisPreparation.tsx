import { SafeLink } from '../app/context';
import { crisisSkills } from '../content/crisis-document';

export function CrisisPreparation() {
  return (
    <section className="panel section-space" aria-labelledby="prepare-crisis-plan">
      <h2 id="prepare-crisis-plan">Preparar mi plan de crisis emocional</h2>
      <p>
        Lo completo con mis propias experiencias, en calma y a mi ritmo. No necesito saber DBT: es
        el nombre de una terapia de la que se adaptan algunas de estas habilidades. Puedo dejar
        espacios pendientes.
      </p>
      <ol>
        <li>
          <h3>Vulnerabilidades</h3>
          <p>
            ¿Qué me hace más sensible al malestar? Por ejemplo, dormir poco, hambre, estar enfermo o
            demasiados estímulos.
          </p>
          <SafeLink to="/plan/vulnerabilities">Escribir mis vulnerabilidades</SafeLink>
        </li>
        <li>
          <h3>Eventos desencadenantes</h3>
          <p>¿Qué situaciones suelen ocurrir antes de que mis emociones me sobrepasen?</p>
          <SafeLink to="/plan/triggers">Escribir mis eventos desencadenantes</SafeLink>
        </li>
        <li>
          <h3>Habilidades para manejar la crisis emocional</h3>
          <p>
            Elijo acciones seguras que me sirvan a mí. Dentro de cada guía, «Guardar notas para esta
            guía» permite escribir cómo la usaré; esas notas pueden acompañar mi plan descargado.
          </p>
          <ul>
            {crisisSkills.map((skill) => (
              <li key={skill.id}>
                <SafeLink to={`/skills/${skill.id}`}>{skill.title}</SafeLink>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <h3>Número de un amigo o persona de confianza</h3>
          <p>Puedo acordar con esa persona cuándo y cómo pedirle compañía.</p>
          <SafeLink to="/support">Añadir una persona de confianza</SafeLink>
        </li>
        <li>
          <h3>Número de terapeuta o profesional, si tengo</h3>
          <p>
            Guardo su número y el horario acordado. Si no tengo terapeuta, puedo dejarlo pendiente.
          </p>
          <SafeLink to="/support">Añadir un contacto profesional</SafeLink>
        </li>
        <li>
          <h3>Líneas de emergencia y orientación emocional</h3>
          <p>
            Elijo el lugar desde donde llamaré. En Bogotá, Medellín y Cali puedo consultar 106 y
            123; para otros lugares, reviso las líneas disponibles.
          </p>
          <SafeLink to="/emergency">Elegir mis líneas locales</SafeLink>
        </li>
      </ol>
      <SafeLink to="/backup" className="button secondary">
        Preparar mi plan para descargar o imprimir
      </SafeLink>
    </section>
  );
}
