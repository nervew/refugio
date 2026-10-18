import { test, expect } from '@playwright/test';
import { checkCrisisPlanExport } from '../helpers/crisis-plan-export';
test('plan de seis secciones: personalizar, seleccionar, descargar y ocultar al bloquear', async ({
  page,
}, testInfo) => {
  await checkCrisisPlanExport(page);
  await page.goto('/#/unlock');
  await page
    .getByLabel('Frase secreta', { exact: true })
    .fill('prueba ficticia plan personal bosque luna');
  await page.getByRole('button', { name: 'Desbloquear mi plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
  await page.goto('/#/backup');
  await expect(page.getByRole('button', { name: 'Preparar vista de impresión' })).toBeDisabled();
  await expect(page.locator('#print-plan')).toHaveCount(0);
  await page.getByLabel(/Entiendo que la impresión y el PDF/).check();
  await page.getByLabel('Lugar de las líneas que incluiré').selectOption('CO-DC');
  await page.getByRole('button', { name: 'Preparar vista de impresión' }).click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('banner')).toBeHidden();
  const pdf = await page.pdf({
    path: testInfo.outputPath('plan-de-crisis.pdf'),
    format: 'A4',
    printBackground: false,
  });
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
});
