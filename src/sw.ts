/// <reference lib="webworker" />
import { cacheNames, clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  createHandlerBoundToURL,
  getCacheKeyForURL,
  type PrecacheEntry,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: (string | PrecacheEntry)[] };
const basePath = new URL('./', self.location.href).pathname;
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);
registerRoute(new NavigationRoute(createHandlerBoundToURL(`${basePath}index.html`)));
clientsClaim();
async function safeToUpdate(client: Client): Promise<boolean> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timeout = setTimeout(() => {
      channel.port1.close();
      resolve(false);
    }, 2000);
    channel.port1.onmessage = (e) => {
      clearTimeout(timeout);
      channel.port1.close();
      resolve(e.data?.allowed === true);
    };
    client.postMessage({ type: 'CAN_UPDATE' }, [channel.port2]);
  });
}
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CHECK_CACHE' || event.data?.type === 'REPAIR_CACHE')
    event.waitUntil(
      (async () => {
        const cache = await caches.open(cacheNames.precache);
        const keys = [
          ...new Set(
            manifest.map((entry) =>
              getCacheKeyForURL(typeof entry === 'string' ? entry : entry.url),
            ),
          ),
        ];
        const checks = await Promise.all(
          keys.map(async (key) => {
            if (!key) return false;
            if (await cache.match(key)) return true;
            if (event.data.type !== 'REPAIR_CACHE') return false;
            try {
              const response = await fetch(key, {
                cache: 'reload',
                credentials: 'same-origin',
                signal: AbortSignal.timeout(8000),
              });
              if (!response.ok || response.redirected) return false;
              await cache.put(key, response);
              return true;
            } catch {
              return false;
            }
          }),
        );
        event.ports[0]?.postMessage({
          ready: checks.length > 0 && checks.every(Boolean),
          total: checks.length,
          missing: checks.filter((present) => !present).length,
        });
      })(),
    );
  if (event.data?.type === 'REQUEST_ACTIVATION')
    event.waitUntil(
      (async () => {
        const clients = (
          await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        ).filter((client) => new URL(client.url).pathname.startsWith(basePath));
        const allowed =
          clients.length > 0 && (await Promise.all(clients.map(safeToUpdate))).every(Boolean);
        event.ports[0]?.postMessage({ allowed });
        if (allowed) await self.skipWaiting();
        else clients.forEach((client) => client.postMessage({ type: 'UPDATE_CANCELLED' }));
      })(),
    );
});
// No se eliminan cachés de otros builds: pueden seguir sirviendo a pestañas anteriores.
// La actualización natural solo ocurre al cerrar todos los clientes; activación anticipada exige unanimidad.
