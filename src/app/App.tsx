import { Component, useEffect, type ReactNode } from 'react';
import { createHashRouter, RouterProvider, Routes, Route, useLocation } from 'react-router-dom';
import { Leaf, LockKeyhole, ArrowUpRight, WifiOff, Settings2 } from 'lucide-react';
import { isCrisisContext } from './crisis-context';
import { AppProvider, SafeLink, useApp, useVault } from './context';
import { PageTitle } from './components';
import { Home, Welcome } from '../features/Home';
import { Plan, PlanSection } from '../features/Plan';
import { Support } from '../features/Support';
import { Skills, SkillDetail } from '../features/Skills';
import { Crisis } from '../features/Crisis';
import { Emergency } from '../features/Emergency';
import { Reflections } from '../features/Reflections';
import { Settings, Privacy } from '../features/Settings';
import { Backup } from '../features/Backup';
import { Unlock } from '../features/Unlock';
import { vault } from '../security/vault';
import { useAppearance } from '../platform/appearance';
import { usePWA } from '../platform/pwa';
function Layout() {
  const location = useLocation();
  const session = useVault();
  const { notice, dirty, updatePending } = useApp();
  const appearance = useAppearance();
  const pwa = usePWA();
  const crisis = isCrisisContext(location);
  useEffect(() => {
    const disconnect = vault.connect();
    void vault.init();
    const activity = () => vault.activity();
    const visibility = () => vault.visibility(document.hidden);
    const focus = () => {
      vault.visibility(document.hidden);
      void vault.checkFocus().catch(() => vault.lock());
    };
    document.addEventListener('pointerdown', activity);
    document.addEventListener('keydown', activity);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('focus', focus);
    const timer = setInterval(() => vault.tick(), 1000);
    return () => {
      disconnect();
      clearInterval(timer);
      document.removeEventListener('pointerdown', activity);
      document.removeEventListener('keydown', activity);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('focus', focus);
    };
  }, []);
  return (
    <>
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Ir al contenido
      </a>
      <div
        className={session.hidden ? 'app-shell obscured' : 'app-shell'}
        inert={session.hidden || updatePending}
        aria-hidden={session.hidden || updatePending || undefined}
      >
        <header className="site-header">
          <div className="header-inner">
            <SafeLink className="brand" to="/" aria-label="Refugio, inicio">
              <span className="brand-mark">
                <Leaf size={24} aria-hidden="true" />
              </span>
              <span>
                refugio<span className="brand-dot">.</span>
              </span>
            </SafeLink>
            <nav aria-label="Navegación principal" className="main-nav">
              <SafeLink
                className={location.pathname.startsWith('/plan') ? 'active' : ''}
                to="/plan"
              >
                Mi plan
              </SafeLink>
              <SafeLink
                className={location.pathname.startsWith('/skills') ? 'active' : ''}
                to="/skills"
              >
                Habilidades
              </SafeLink>
              <SafeLink
                className={location.pathname.startsWith('/support') ? 'active' : ''}
                to="/support"
              >
                Mi apoyo
              </SafeLink>
            </nav>
            <div className="header-actions">
              {session.data ? (
                <button
                  className="text-button lock-button"
                  onClick={() => {
                    if (!dirty || window.confirm('¿Bloquear y descartar cambios sin guardar?'))
                      vault.lock();
                  }}
                >
                  <LockKeyhole size={17} aria-hidden="true" />
                  <span>Bloquear</span>
                </button>
              ) : (
                <SafeLink className="text-button lock-button" to="/unlock">
                  <LockKeyhole size={17} aria-hidden="true" />
                  <span>Mi espacio</span>
                </SafeLink>
              )}
              <SafeLink to="/settings" className="icon-button" aria-label="Ajustes y privacidad">
                <Settings2 size={21} aria-hidden="true" />
              </SafeLink>
            </div>
          </div>
        </header>
        {!pwa.online && (
          <div className="connection-banner" role="status">
            <WifiOff size={17} aria-hidden="true" /> Sin conexión. Puedes seguir usando lo
            descargado y guardado.
          </div>
        )}
        {session.warning && (
          <div className="session-banner" role="status">
            Tu plan se bloqueará pronto por inactividad.{' '}
            <button onClick={() => vault.activity()}>Seguir aquí</button>
          </div>
        )}
        {session.conflicted && session.data && (
          <div className="session-banner" role="status">
            Hay cambios guardados en otra pestaña. Conserva tus notas sin guardar; bloquea y vuelve
            a abrir tu plan para revisar la última versión.
          </div>
        )}
        <main
          id="main"
          tabIndex={-1}
          className={crisis ? 'main-content crisis-main' : 'main-content'}
        >
          {notice && (
            <div
              className={notice.error ? 'global-notice error' : 'global-notice'}
              role={notice.error ? 'alert' : 'status'}
            >
              {notice.text}
            </div>
          )}
          <div key={session.status === 'unlocked' ? session.data!.vaultId : 'public'}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/plan/:field" element={<PlanSection />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/skills/:skillId" element={<SkillDetail key={location.pathname} />} />
              <Route path="/support" element={<Support />} />
              <Route path="/crisis" element={<Crisis />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/reflections" element={<Reflections />} />
              <Route path="/settings" element={<Settings appearance={appearance} />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/backup" element={<Backup />} />
              <Route path="/unlock" element={<Unlock />} />
              <Route
                path="*"
                element={
                  <>
                    <PageTitle>Volvamos a un lugar conocido</PageTitle>
                    <SafeLink to="/">Ir al inicio</SafeLink>
                    <SafeLink to="/crisis">Necesito apoyo ahora</SafeLink>
                  </>
                }
              />
            </Routes>
          </div>
        </main>
        <footer className="site-footer">
          <div>
            <span className="footer-brand">refugio.</span>
            <p>Un paso a la vez también es avanzar.</p>
          </div>
          <div className="footer-links">
            <SafeLink to="/privacy">Privacidad y límites</SafeLink>
            <SafeLink to="/welcome">Acerca de Refugio</SafeLink>
            <SafeLink to="/emergency">
              Buscar ayuda <ArrowUpRight size={15} aria-hidden="true" />
            </SafeLink>
          </div>
          <p className="evaluation">
            Versión de evaluación · usa datos ficticios. No sustituye atención profesional ni
            emergencias.
          </p>
        </footer>
      </div>
      {updatePending && (
        <div className="privacy-shield" role="status">
          <p>Preparando una actualización segura…</p>
        </div>
      )}
      {session.hidden && (
        <div className="privacy-shield" role="status">
          <Leaf size={36} aria-hidden="true" />
          <p>Tu espacio personal está protegido mientras no lo miras.</p>
        </div>
      )}
    </>
  );
}
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    vault.lock();
  }
  render() {
    return this.state.failed ? (
      <main className="main-content">
        <h1>Podemos volver a empezar</h1>
        <p>
          La vista no pudo abrirse. Tus datos guardados no se han borrado. Intenta recargar para
          volver al apoyo público.
        </p>
        <button onClick={() => window.location.reload()}>Recargar Refugio</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
const router = createHashRouter([
  {
    path: '*',
    element: (
      <AppProvider>
        <Layout />
      </AppProvider>
    ),
  },
]);
export function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
