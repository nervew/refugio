import { test, expect } from '@playwright/test';
test('GitHub Pages: recursos, manifiesto y SW respetan /refugio/', async ({ page }) => {
  const errors: string[] = [];
  const missing: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) missing.push(response.url());
  });
  await page.goto('/refugio/');
  await page.getByRole('link', { name: 'Necesito apoyo ahora', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Solo el siguiente paso.' })).toBeVisible();
  await expect(page).toHaveURL(/\/refugio\/#\/crisis$/);
  await page.goto('/refugio/#/settings');
  await expect(page.getByText('Guías disponibles sin conexión', { exact: true })).toBeVisible({
    timeout: 20000,
  });
  const scope = await page.evaluate(
    async () => (await navigator.serviceWorker.getRegistration())?.scope,
  );
  expect(scope).toBe('http://127.0.0.1:4175/refugio/');
  const manifest = await page.request.get('/refugio/manifest.webmanifest');
  const data = await manifest.json();
  expect(data.start_url).toBe('/refugio/');
  expect(data.scope).toBe('/refugio/');
  expect(data.icons.every((icon: { src: string }) => icon.src.startsWith('/refugio/'))).toBe(true);
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(1);
  expect(errors).toEqual([]);
  expect(missing).toEqual([]);
});
test('GitHub Pages: plan cifrado y reinicio offline en subruta', async ({ page, context }) => {
  const phrase = 'bosque faro luna prueba de subruta';
  await page.goto('/refugio/#/unlock');
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByLabel('Repite la frase secreta').fill(phrase);
  await page.getByLabel('Confirmo que tengo 18 años o más.').check();
  await page.getByLabel(/Entiendo que este plan puede contener/).check();
  await page.getByRole('button', { name: 'Crear mi plan cifrado' }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
  await page.goto('/refugio/#/plan/safetySteps');
  await page.getByRole('button', { name: 'Agregar nota' }).click();
  await page.getByLabel('Mis próximos pasos · nota 1').fill('Paso de prueba para Pages');
  await page.getByRole('button', { name: 'Guardar esta sección' }).click();
  await expect(page.getByRole('status')).toContainText('Guardado');
  await page.goto('/refugio/#/settings');
  await expect(page.getByText('Guías disponibles sin conexión', { exact: true })).toBeVisible({
    timeout: 20000,
  });
  const names = await page.evaluate(async () => (await indexedDB.databases()).map((db) => db.name));
  expect(names).toContain('refugio:/refugio/');
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('link', { name: 'Mi espacio', exact: true }).click();
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByRole('button', { name: 'Desbloquear mi plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
  await page.goto('/refugio/#/crisis');
  await expect(
    page.getByRole('heading', { name: 'Paso de prueba para Pages', exact: true }),
  ).toBeVisible();
});
