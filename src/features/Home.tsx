import {
  ArrowRight,
  BookOpen,
  Leaf,
  NotebookPen,
  ShieldCheck,
  UsersRound,
  HeartHandshake,
} from 'lucide-react';
import { SafeLink, useVault } from '../app/context';
import { PageTitle } from '../app/components';
export function Home() {
  const session = useVault();
  return (
    <>
      <div className="home-grid">
        <section className="home-intro">
          <p className="eyebrow">
            <span className="small-leaf">
              <Leaf size={16} aria-hidden="true" />
            </span>{' '}
            Un espacio para volver a ti
          </p>
          <h1 tabIndex={-1}>
            No tienes que resolver
            <br className="desktop-break" /> todo <em>ahora.</em>
          </h1>
          <p className="lede">
            Un paso pequeño también cuenta. Aquí puedes encontrar tus herramientas, tu plan y las
            personas que te acompañan.
          </p>
          <SafeLink to="/crisis" className="button primary crisis-button">
            <HeartHandshake size={22} aria-hidden="true" /> Necesito apoyo ahora{' '}
            <ArrowRight size={22} aria-hidden="true" />
          </SafeLink>
          <p className="subtle">Sin preguntas. A tu ritmo. Un paso a la vez.</p>
        </section>
        <div className="refuge-art" aria-hidden="true">
          <div className="art-sun" />
          <div className="art-arch">
            <div className="art-hill hill-back" />
            <div className="art-hill hill-front" />
            <div className="art-path" />
          </div>
          <Leaf className="art-leaf" />
          <p>Hay espacio para una pausa.</p>
        </div>
      </div>
      <section aria-labelledby="home-tools" className="home-tools">
        <div className="section-heading">
          <h2 id="home-tools">Lo que puede acompañarte</h2>
          <span>Para ahora o para después</span>
        </div>
        <div className="card-grid">
          <SafeLink to="/plan" className="feature-card">
            <span className="card-icon">
              <BookOpen aria-hidden="true" />
            </span>
            <h3>Mi plan personal</h3>
            <p>Lo que te ayuda, preparado por ti para cuando lo necesites.</p>
            <span className="card-link">
              {session.data ? 'Abrir mi plan' : 'Preparar mi plan'}{' '}
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </SafeLink>
          <SafeLink to="/skills" className="feature-card">
            <span className="card-icon">
              <Leaf aria-hidden="true" />
            </span>
            <h3>Mis herramientas</h3>
            <p>Seis habilidades para atravesar un momento difícil.</p>
            <span className="card-link">
              Explorar habilidades <ArrowRight size={18} aria-hidden="true" />
            </span>
          </SafeLink>
          <SafeLink to="/support" className="feature-card">
            <span className="card-icon">
              <UsersRound aria-hidden="true" />
            </span>
            <h3>Mi red de apoyo</h3>
            <p>Personas y profesionales a quienes puedes acudir.</p>
            <span className="card-link">
              Encontrar compañía <ArrowRight size={18} aria-hidden="true" />
            </span>
          </SafeLink>
        </div>
      </section>
      <div className="gentle-strip">
        <NotebookPen aria-hidden="true" />
        <div>
          <h2>Cuando tengas un poco más de espacio</h2>
          <p>Puedes escribir lo que pasó y lo que quieres recordar.</p>
        </div>
        <SafeLink to="/reflections" className="button secondary">
          Reflexionar <ArrowRight size={18} aria-hidden="true" />
        </SafeLink>
      </div>
      <p className="privacy-note home-privacy">
        <ShieldCheck size={18} aria-hidden="true" /> Sin cuenta. Tu plan personal se guarda cifrado
        en este dispositivo.
      </p>
    </>
  );
}
export function Welcome() {
  return (
    <section className="narrow">
      <PageTitle
        eyebrow="Bienvenido a Refugio"
        description="Un espacio para preparar tus herramientas en calma y consultarlas cuando se vuelve difícil."
      >
        Un paso a la vez
      </PageTitle>
      <div className="panel prose">
        <h2>Tu plan, a tu manera</h2>
        <p>
          Puedes explorar las guías sin registro. Para preparar tu plan personal, crearás una frase
          secreta que protege tus datos en este navegador.
        </p>
        <p>
          El navegador puede borrar almacenamiento. Conserva una copia cifrada y su frase; no
          podemos recuperarla por ti.
        </p>
        <p>
          Refugio no sustituye atención profesional ni servicios de emergencia. No monitorea tu
          estado ni avisa a nadie por sí solo.
        </p>
        <p>
          Versión de evaluación: el contenido sigue pendiente de revisión profesional. Usa datos
          ficticios.
        </p>
        <div className="button-row">
          <SafeLink to="/unlock" className="button primary">
            Preparar mi plan
          </SafeLink>
          <SafeLink to="/skills" className="button secondary">
            Explorar habilidades
          </SafeLink>
          <SafeLink to="/crisis">Necesito apoyo ahora</SafeLink>
        </div>
      </div>
    </section>
  );
}
