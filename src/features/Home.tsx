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
import { planAccess } from '../app/plan-access';
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
            Guías y recordatorios para momentos en que tus emociones te sobrepasan o te cuesta
            decidir qué hacer. Puedes consultar una guía ahora o preparar tu plan para después.
          </p>
          <SafeLink to="/crisis" className="button primary crisis-button">
            <HeartHandshake size={22} aria-hidden="true" /> Necesito apoyo ahora{' '}
            <ArrowRight size={22} aria-hidden="true" />
          </SafeLink>
          <p className="subtle">Abre una guía de la app, sin crear un plan ni escribir tu frase.</p>
          <SafeLink to="/emergency">Ver líneas de atención y emergencias</SafeLink>
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
            <p>Recordatorios, pasos y contactos que preparas para consultar después.</p>
            <span className="card-link">
              {planAccess(session.status).label} <ArrowRight size={18} aria-hidden="true" />
            </span>
          </SafeLink>
          <SafeLink to="/skills" className="feature-card">
            <span className="card-icon">
              <Leaf aria-hidden="true" />
            </span>
            <h3>Guías paso a paso</h3>
            <p>Puedes probar una guía y cambiar cuando quieras.</p>
            <span className="card-link">
              Ver guías <ArrowRight size={18} aria-hidden="true" />
            </span>
          </SafeLink>
          <SafeLink to="/support" className="feature-card">
            <span className="card-icon">
              <UsersRound aria-hidden="true" />
            </span>
            <h3>Mis contactos</h3>
            <p>Tu lista de personas a quienes podrías llamar o escribir.</p>
            <span className="card-link">
              Ver mis contactos <ArrowRight size={18} aria-hidden="true" />
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
        en este navegador.
      </p>
    </>
  );
}
export function Welcome() {
  const session = useVault();
  return (
    <section className="narrow">
      <PageTitle
        eyebrow="Bienvenido a Refugio"
        description="Guías y recordatorios para momentos en que tus emociones te sobrepasan o te cuesta decidir qué hacer."
      >
        Un paso a la vez
      </PageTitle>
      <div className="panel prose">
        <h2>Tu plan, a tu manera</h2>
        <p>
          Puedes consultar una guía ahora o preparar tu plan para después. No necesitas registrarte.
          Tu plan se guarda en este navegador y se abre con tu frase secreta.
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
          <SafeLink to="/plan" className="button primary">
            {planAccess(session.status).label}
          </SafeLink>
          <SafeLink to="/skills" className="button secondary">
            Ver guías paso a paso
          </SafeLink>
          <SafeLink to="/crisis">Necesito apoyo ahora</SafeLink>
          <SafeLink to="/emergency">Ver líneas de atención y emergencias</SafeLink>
        </div>
      </div>
    </section>
  );
}
