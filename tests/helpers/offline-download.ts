import { expect, type Page } from '@playwright/test';
export async function checkOfflineDownload(page: Page, basePath = '') {
  await page.goto(`${basePath}/#/settings`);
  await expect(page.getByText('Guías disponibles sin conexión', { exact: true })).toBeVisible({
    timeout: 25000,
  });
  const check = page.getByRole('button', { name: 'Comprobar descarga offline', exact: true });
  const result = page.getByRole('status', { name: 'Resultado de la descarga' });
  await check.click();
  await expect(result).toContainText('Comprobación terminada:');
  expect(
    await page.evaluate(async () => {
      for (const name of await caches.keys()) {
        const cache = await caches.open(name);
        for (const key of await cache.keys())
          if (key.url.includes('icon-192.png')) return cache.delete(key);
      }
      return false;
    }),
  ).toBe(true);
  await check.click();
  await expect(result).toContainText('Descarga incompleta: faltan 1');
  await page.context().setOffline(true);
  const repair = page.getByRole('button', { name: 'Descargar los archivos que faltan' });
  await expect(repair).toBeDisabled();
  await page.context().setOffline(false);
  await expect(repair).toBeEnabled();
  await repair.click();
  await expect(result).toContainText('Comprobación terminada:');
  await expect(repair).toHaveCount(0);
  await page.context().setOffline(true);
  await page.goto(`${basePath}/#/skills/stop`);
  await expect(
    page.getByRole('heading', { name: 'Hacer una pausa antes de actuar', exact: true }),
  ).toBeVisible();
  await page.goto(`${basePath}/#/settings`);
  await check.click();
  await expect(result).toContainText('Comprobación terminada:');
  await page.context().setOffline(false);
}
