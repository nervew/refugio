import { expect, type Page } from '@playwright/test';
export async function checkCrisisPlanExport(page: Page, basePath = '') {
  const phrase = 'prueba ficticia plan personal bosque luna';
  await page.goto(`${basePath}/#/unlock`);
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByLabel('Repite la frase secreta').fill(phrase);
  await page.getByLabel('Confirmo que tengo 18 años o más.').check();
  await page.getByLabel(/Entiendo que este plan puede contener/).check();
  await page.getByRole('button', { name: 'Crear mi plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Preparar mi plan de crisis emocional', exact: true }),
  ).toBeVisible();
  for (const [field, label, text] of [
    ['vulnerabilities', 'Cómo estaba antes', 'Dormí poco · ejemplo ficticio'],
    ['triggers', 'Qué pasó justo antes', 'Discusión ficticia de prueba'],
  ]) {
    await page.goto(`${basePath}/#/plan/${field}`);
    await page.getByRole('button', { name: 'Escribir mi primera nota' }).click();
    await page.getByLabel(`${label} · nota 1`).fill(text);
    await page.getByRole('button', { name: 'Guardar y volver al inicio' }).click();
    await expect(page.getByRole('status')).toContainText('Guardado');
  }
  await page.goto(`${basePath}/#/skills/stop`);
  await page.getByRole('button', { name: 'Guardar notas para esta guía' }).click();
  await page.getByLabel('Mis recordatorios', { exact: true }).fill('Mi pausa personal ficticia');
  await page.getByLabel('Mis notas no reemplazan las precauciones de la guía.').check();
  await page.getByRole('button', { name: 'Guardar mis notas', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  for (const [role, name] of [
    ['personal', 'Amistad ficticia'],
    ['professional', 'Profesional ficticio'],
  ]) {
    await page.goto(`${basePath}/#/support`);
    await page.getByRole('button', { name: 'Agregar contacto', exact: true }).click();
    await page.getByLabel('Nombre o alias').fill(name);
    await page.getByLabel('Tipo de contacto').selectOption(role);
    await page.getByLabel('Teléfono', { exact: true }).fill('+573000000000');
    await page.getByRole('button', { name: 'Guardar contacto y volver al inicio' }).click();
    await expect(page.getByRole('status')).toContainText('Guardado');
  }
  await page.goto(`${basePath}/#/backup`);
  const preview = page.locator('#print-plan');
  const prepare = page.getByRole('button', { name: 'Preparar vista de impresión' });
  await expect(prepare).toBeDisabled();
  await page.getByLabel(/Entiendo que la impresión y el PDF/).check();
  await page.getByLabel('Lugar de las líneas que incluiré').selectOption('CO-DC');
  await prepare.click();
  await expect(preview).toContainText('Dormí poco · ejemplo ficticio');
  await expect(preview).toContainText('Discusión ficticia de prueba');
  await expect(preview).toContainText('Mi pausa personal ficticia');
  await expect(preview).toContainText('6. Líneas de emergencia');
  await expect(preview).toContainText('Línea 106');
  await expect(preview).toContainText('Línea 123');
  await expect(preview).not.toContainText('Amistad ficticia');
  await expect(preview).not.toContainText('Profesional ficticio');
  await page.getByLabel(/Incluir contactos personales/).check();
  await expect(preview).toHaveCount(0);
  await prepare.click();
  await expect(preview).toContainText('Amistad ficticia');
  await expect(preview).toContainText('Profesional ficticio');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar plan en texto', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('refugio-mi-plan-de-crisis.txt');
  await page.getByLabel('Lugar de las líneas que incluiré').selectOption('DE-HE-FRA');
  await prepare.click();
  const emergency = preview.locator('section').filter({
    has: page.getByRole('heading', {
      name: '6. Líneas de emergencia y orientación emocional',
      exact: true,
    }),
  });
  await expect(emergency).toContainText('116123');
  await expect(emergency).not.toContainText('Línea 106');
  await page.emulateMedia({ media: 'print' });
  await expect(preview).toBeVisible();
  await page.emulateMedia({ media: 'screen' });
  await page.getByRole('button', { name: 'Bloquear', exact: true }).click();
  await expect(preview).toHaveCount(0);
}
