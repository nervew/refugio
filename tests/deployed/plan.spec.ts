import { test, expect } from '@playwright/test';
import { recoverLegacyPlan } from '../helpers/legacy-plan';
test('sitio público: crear, guardar y reabrir un plan ficticio', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('/refugio/');
  expect(response?.status()).toBe(200);
  await page.getByRole('banner').getByRole('link', { name: 'Abrir mi plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Crea tu plan personal' })).toBeVisible();
  const phrase = 'bosque luna faro prueba pública ficticia';
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByLabel('Repite la frase secreta').fill(phrase);
  await page.getByLabel('Confirmo que tengo 18 años o más.').check();
  await page.getByLabel(/Entiendo que este plan puede contener/).check();
  await page.getByRole('button', { name: 'Crear mi plan' }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
  await page.goto('/refugio/#/plan/safetySteps');
  await page.getByRole('button', { name: 'Escribir mi primera nota' }).click();
  await page
    .getByLabel('Mis pasos para un momento difícil · nota 1')
    .fill('Prueba sintética del sitio publicado');
  await page.getByRole('button', { name: 'Guardar y volver al inicio' }).click();
  await expect(page).toHaveURL('https://nervew.github.io/refugio/#/');
  await expect(page.getByRole('status')).toContainText('Guardado');
  await page.reload();
  await page.getByRole('banner').getByRole('link', { name: 'Abrir mi plan', exact: true }).click();
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByRole('button', { name: 'Desbloquear mi plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
  await page.goto('/refugio/#/plan/safetySteps');
  await expect(page.getByLabel('Mis pasos para un momento difícil · nota 1')).toHaveValue(
    'Prueba sintética del sitio publicado',
  );
  expect(errors).toEqual([]);
});

test('sitio público: Bogotá muestra líneas oficiales y sus límites', async ({ page }, testInfo) => {
  await page.goto('/refugio/');
  await testInfo.attach('inicio-publicado', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
  await page.goto('/refugio/#/emergency');
  await page.getByRole('combobox', { name: 'Ciudad o región', exact: true }).selectOption('CO-DC');
  await expect(page.getByRole('link', { name: 'Llamar al 123', exact: true })).toHaveAttribute(
    'href',
    'tel:123',
  );
  await expect(page.getByRole('link', { name: 'Llamar al 106', exact: true })).toHaveAttribute(
    'href',
    'tel:106',
  );
  await expect(
    page.getByRole('link', { name: 'Consultar fuente oficial de la línea 106' }),
  ).toHaveAttribute('href', 'https://www.saludcapital.gov.co/Paginas2/llamanos_Linea106.aspx');
  await page.getByRole('combobox', { name: 'Ciudad o región', exact: true }).selectOption('CO-CUN');
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
});

test('sitio público: recupera un plan cifrado con el formato defectuoso anterior', async ({
  page,
}) => {
  await recoverLegacyPlan(page, '/refugio');
});
