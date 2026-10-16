import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { vault } from '../security/vault';
import { isCrisisContext } from './crisis-context';
import { messages, result } from '../domain/errors';
import { useLocation, Link, useBlocker, type LinkProps } from 'react-router-dom';
interface AppState {
  updatePending: boolean;
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
  notice: { text: string; error: boolean } | null;
  notify: (text: string, error?: boolean) => void;
}
const Context = createContext<AppState | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [dirty, setDirty] = useState(false);
  const [updatePending, setUpdatePending] = useState(false);
  const [notice, setNotice] = useState<AppState['notice']>(null);
  const location = useLocation();
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (dirty || updatePending) &&
      (currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search),
  );
  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (updatePending) {
        blocker.reset();
        return;
      }
      if (window.confirm('Tienes cambios sin guardar. ¿Salir y descartarlos?')) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker, updatePending]);
  const session = useSyncExternalStore(vault.subscribe, vault.getSnapshot);
  useEffect(() => {
    setNotice(
      location.state?.saved === true
        ? { text: 'Guardado en este dispositivo.', error: false }
        : null,
    );
    const title = document.querySelector<HTMLElement>('main h1');
    title?.focus();
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const canUpdate = (event: MessageEvent) => {
      if (event.data?.type === 'CAN_UPDATE') {
        const allowed =
          !isCrisisContext(location) &&
          !dirty &&
          !session.busy &&
          document.visibilityState === 'visible';
        if (allowed) {
          setUpdatePending(true);
          timeout = setTimeout(() => setUpdatePending(false), 8000);
        }
        event.ports[0]?.postMessage({ allowed });
      }
      if (event.data?.type === 'UPDATE_CANCELLED') setUpdatePending(false);
    };
    navigator.serviceWorker?.addEventListener('message', canUpdate);
    return () => {
      if (timeout) clearTimeout(timeout);
      navigator.serviceWorker?.removeEventListener('message', canUpdate);
    };
  }, [location.pathname, location.search, dirty, session.busy]);
  return (
    <Context.Provider
      value={{
        updatePending,
        dirty,
        setDirty,
        notice,
        notify: (text, error = false) => setNotice({ text, error }),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('AppProvider required');
  return value;
}
export function useVault() {
  return useSyncExternalStore(vault.subscribe, vault.getSnapshot);
}
export function useDraftState<T>(initial: T) {
  const [draft, setDraft] = useState(initial);
  const [changed, setChanged] = useState(false);
  const { setDirty } = useApp();
  useEffect(() => {
    setDirty(changed);
    return () => setDirty(false);
  }, [changed, setDirty]);
  return {
    draft,
    setDraft: (value: T) => {
      setDraft(value);
      setChanged(true);
    },
    changed,
    clean: () => {
      setChanged(false);
      setDirty(false);
    },
  };
}
export function useAction() {
  const { notify } = useApp();
  const [busy, setBusy] = useState(false);
  return {
    busy,
    run: async (action: () => Promise<void>, success = 'Guardado en este dispositivo.') => {
      setBusy(true);
      try {
        const outcome = await result(action);
        if (!outcome.ok) {
          notify(messages[outcome.error.code], true);
          return false;
        }
        if (success) notify(success);
        return true;
      } finally {
        setBusy(false);
      }
    },
  };
}
export function SafeLink(props: LinkProps) {
  const location = useLocation();
  let to = props.to;
  if (
    isCrisisContext(location) &&
    typeof to === 'string' &&
    /^\/(skills|support|emergency)(\/|\?|$)/.test(to)
  ) {
    const [path, search = ''] = to.split('?');
    const query = new URLSearchParams(search);
    query.set('from', 'crisis');
    to = `${path}?${query}`;
  }
  return <Link {...props} to={to} />;
}
