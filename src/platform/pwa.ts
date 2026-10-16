import { useEffect, useState } from 'react';
import { vault } from '../security/vault';
let registration: ServiceWorkerRegistration | undefined;
type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
let prompt: InstallPrompt | undefined;
export function askWorker(worker: ServiceWorker, type: string): Promise<Record<string, boolean>> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timeout = setTimeout(() => {
      channel.port1.close();
      reject(new Error('WORKER_TIMEOUT'));
    }, 5000);
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
  useEffect(() => {
    let disposed = false;
    const check = async () => {
      setOnline(navigator.onLine);
      setWaiting(Boolean(registration?.waiting));
      setCanInstall(Boolean(prompt));
      const worker = registration?.active;
      try {
        const result = worker ? await askWorker(worker, 'CHECK_CACHE') : { ready: false };
        if (!disposed) setReady(result.ready === true);
      } catch {
        if (!disposed) setReady(false);
      }
    };
    const handler = () => void check();
    handler();
    const interval = setInterval(handler, 30_000);
    for (const event of ['online', 'offline', 'focus', 'pwa-change'])
      window.addEventListener(event, handler);
    return () => {
      disposed = true;
      clearInterval(interval);
      for (const event of ['online', 'offline', 'focus', 'pwa-change'])
        window.removeEventListener(event, handler);
    };
  }, []);
  return {
    ready,
    waiting,
    online,
    canInstall,
    refresh: () => setTimeout(() => window.dispatchEvent(new Event('pwa-change')), 0),
  };
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
    return result.allowed;
  } catch {
    return false;
  }
}
