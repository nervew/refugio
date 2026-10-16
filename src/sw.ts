/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
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
  if (event.data?.type === 'CHECK_CACHE')
    event.waitUntil(
      (async () => {
        const checks = await Promise.all(
          manifest.map(async (entry) => {
            const key = getCacheKeyForURL(typeof entry === 'string' ? entry : entry.url);
            return Boolean(key && (await caches.match(key)));
          }),
        );
        event.ports[0]?.postMessage({ ready: checks.length > 0 && checks.every(Boolean) });
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
