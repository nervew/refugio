import { useCallback, useEffect, useState } from 'react';
import { vault } from '../security/vault';
let registration: ServiceWorkerRegistration | undefined;
type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
let prompt: InstallPrompt | undefined;
export interface OfflineReport {
  ready: boolean;
  total: number;
  missing: number;
  unavailable?: boolean;
}
type WorkerReply = Partial<OfflineReport> & { allowed?: boolean };
export function askWorker(worker: ServiceWorker, type: string): Promise<WorkerReply> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timeout = setTimeout(
      () => {
        channel.port1.close();
        reject(new Error('WORKER_TIMEOUT'));
      },
      type === 'REPAIR_CACHE' ? 15000 : 5000,
    );
    channel.port1.onmessage = (event) => {
      clearTimeout(timeout);
      channel.port1.close();
      resolve(event.data);
    };
    worker.postMessage({ type }, [channel.port2]);
  });
}
export async function startPWA() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    prompt = event as InstallPrompt;
    window.dispatchEvent(new Event('pwa-change'));
  });
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  let controlled = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (controlled) {
      vault.lock();
      window.location.reload();
    }
    controlled = true;
    window.dispatchEvent(new Event('pwa-change'));
  });
  try {
    registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL,
    });
    registration.addEventListener('updatefound', () => {
      registration?.installing?.addEventListener('statechange', () =>
        window.dispatchEvent(new Event('pwa-change')),
      );
    });
    await navigator.serviceWorker.ready;
    window.dispatchEvent(new Event('pwa-change'));
  } catch {
    window.dispatchEvent(new Event('pwa-change'));
  }
}
export function usePWA() {
  const [ready, setReady] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const refresh = useCallback(async (repair = false): Promise<OfflineReport> => {
    const worker = navigator.serviceWorker?.controller ?? registration?.active;
    let report: OfflineReport = { ready: false, total: 0, missing: 0, unavailable: true };
    try {
      if (worker) {
        const reply = await askWorker(worker, repair ? 'REPAIR_CACHE' : 'CHECK_CACHE');
        report = {
          ready: reply.ready === true,
          total: reply.total ?? 0,
          missing: reply.missing ?? 0,
        };
      }
    } catch {
      // No respuesta no equivale a descarga incompleta ni a descarga confirmada.
    }
    setReady(report.ready);
    return report;
  }, []);
  useEffect(() => {
    const handler = () => {
      setOnline(navigator.onLine);
      setWaiting(Boolean(registration?.waiting));
      setCanInstall(Boolean(prompt));
      void refresh();
    };
    handler();
    const interval = setInterval(handler, 30_000);
    for (const event of ['online', 'offline', 'focus', 'pwa-change'])
      window.addEventListener(event, handler);
    return () => {
      clearInterval(interval);
      for (const event of ['online', 'offline', 'focus', 'pwa-change'])
        window.removeEventListener(event, handler);
    };
  }, [refresh]);
  return { ready, waiting, online, canInstall, refresh };
}
export async function installPWA() {
  if (!prompt) return false;
  await prompt.prompt();
  await prompt.userChoice;
  prompt = undefined;
  window.dispatchEvent(new Event('pwa-change'));
  return true;
}
export async function updatePWA() {
  if (!registration?.waiting) return false;
  try {
    const result = await askWorker(registration.waiting, 'REQUEST_ACTIVATION');
    return result.allowed === true;
  } catch {
    return false;
  }
}
