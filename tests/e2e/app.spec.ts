import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const phrase = 'bosque luna de prueba y montaña';
async function create(page: Page) {
  await page.goto('/#/unlock');
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByLabel('Repite la frase secreta').fill(phrase);
  await page.getByLabel('Confirmo que tengo 18 años o más.').check();
  await page.getByLabel(/Entiendo que este plan puede contener/).check();
  await page.getByRole('button', { name: 'Crear mi plan' }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
}
async function unlock(page: Page) {
  await page.goto('/#/unlock');
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByRole('button', { name: 'Desbloquear mi plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
}
test('T003/006: crisis en una acción, seis guías y ausencia de números pendientes', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: 'Necesito apoyo ahora', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Solo el siguiente paso.' })).toBeVisible();
  await page.getByRole('link', { name: 'Hacer una pausa antes de actuar' }).click();
  await page.getByRole('button', { name: 'Empezar paso a paso' }).click();
  await expect(
    page.getByRole('heading', { name: 'Pausa la acción un momento, si estás a salvo.' }),
  ).toBeVisible();
  await page.goto('/#/skills');
  await expect(page.locator('.skill-card')).toHaveCount(6);
  await page.goto('/#/emergency');
  await page.getByRole('combobox', { name: 'Ciudad o región', exact: true }).selectOption('CO-ANT');
  await expect(
    page.getByRole('heading', { name: 'Aún no hay una línea verificada para esta región' }),
  ).toBeVisible();
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('T001/005/008/015: editar, persistir, contactar y bloquear sin datos legibles', async ({
  page,
}) => {
  await create(page);
  await page.getByRole('link', { name: /Cuando me cuesta manejar mis emociones/ }).click();
  await page.getByRole('button', { name: 'Escribir mi primera nota' }).click();
  await page
    .getByLabel('Cuando me cuesta manejar mis emociones · nota 1')
    .fill('CANARIO PRIVADO DE PRUEBA');
  await page.getByRole('button', { name: 'Guardar y volver al inicio' }).click();
  await expect(page.getByRole('status')).toContainText('Guardado en este dispositivo');
  await expect(page).toHaveURL(/\/#\/$/);
  await page.goto('/#/support');
  await page.getByRole('button', { name: 'Agregar contacto' }).click();
  await page.getByLabel('Nombre o alias').fill('Ana de prueba');
  await page.getByLabel('Teléfono', { exact: true }).fill('+57 300 000 0000');
  await page.getByRole('button', { name: 'Guardar contacto y volver al inicio' }).click();
  await expect(page).toHaveURL(/\/#\/$/);
  await expect(page.getByRole('status')).toContainText('Guardado en este dispositivo');
  await page.goto('/#/support');
  await expect(page.getByRole('heading', { name: 'Ana de prueba' })).toBeVisible();
  await page.getByRole('button', { name: 'Elegir principal' }).click();
  await expect(page.getByRole('status')).toContainText('Guardado');
  await page.goto('/#/crisis');
  await expect(
    page.getByRole('link', { name: 'Llamar a Ana de prueba', exact: true }),
  ).toHaveAttribute('href', 'tel:+573000000000');
  await page.getByRole('button', { name: 'Bloquear', exact: true }).click();
  await expect(page.getByText('Ana de prueba', { exact: true })).toHaveCount(0);
  const storage = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('refugio');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const records = await new Promise<unknown>((resolve, reject) => {
      const req = db.transaction('vault').objectStore('vault').getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return JSON.stringify(records);
  });
  expect(storage).not.toContain('CANARIO');
  expect(storage).not.toContain('Ana de prueba');
  expect(storage).not.toContain('300 000');
  await page.reload();
  await unlock(page);
  await page.goto('/#/plan/earlySignals');
  await expect(page.getByLabel('Cuando me cuesta manejar mis emociones · nota 1')).toHaveValue(
    'CANARIO PRIVADO DE PRUEBA',
  );
});
test('T004: reflexión voluntaria guarda intensidades ausentes sin diagnóstico', async ({
  page,
}) => {
  await create(page);
  await page.goto('/#/reflections');
  await page.getByRole('button', { name: 'Nueva reflexión' }).click();
  await page.getByLabel('Lo que quiero recordar (opcional)').fill('Pedir compañía fue útil.');
  await page.getByRole('button', { name: 'Guardar reflexión y volver al inicio' }).click();
  await expect(page).toHaveURL(/\/#\/$/);
  await expect(page.getByRole('status')).toContainText('Guardado en este dispositivo');
  await page.goto('/#/reflections');
  await expect(page.getByText('Pedir compañía fue útil.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ver y editar reflexión' }).click();
  await expect(page.getByLabel('Malestar antes de lo que probé (opcional)')).toHaveValue('');
  await expect(page.getByLabel('Malestar después de lo que probé (opcional)')).toHaveValue('');
});
test('T009/012: descargar, borrar y restaurar con confirmación', async ({ page }, testInfo) => {
  await create(page);
  await page.goto('/#/plan/safetySteps');
  await page.getByRole('button', { name: 'Escribir mi primera nota' }).click();
  await page.getByLabel('Mis pasos para un momento difícil · nota 1').fill('Mi paso de prueba');
  await page.getByRole('button', { name: 'Guardar y volver al inicio' }).click();
  await page.goto('/#/backup');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar copia cifrada' }).click();
  const downloaded = await downloadEvent;
  const path = testInfo.outputPath('backup.refugio');
  await downloaded.saveAs(path);
  await page.goto('/#/settings');
  await page.getByLabel(/Entiendo que puedo perder mis datos/).check();
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Borrar mis datos locales' }).click();
  await expect(page.getByRole('status')).toContainText('Datos locales eliminados');
  await page.goto('/#/backup');
  await page.getByLabel('Archivo de Refugio').setInputFiles(path);
  await page.getByLabel('Frase de esta copia').fill(phrase);
  await page.getByRole('button', { name: 'Validar copia sin sustituir datos' }).click();
  await expect(
    page.getByRole('heading', { name: 'Tu copia está lista para revisar' }),
  ).toBeVisible();
  await page.getByLabel('Frase para guardar el plan restaurado', { exact: true }).fill(phrase);
  await page.getByLabel('Repite la frase de destino').fill(phrase);
  await page.getByLabel(/Tengo 18 años o más y entiendo/).check();
  await page.getByLabel(/Entiendo que todos los datos actuales/).check();
  await page.getByRole('button', { name: 'Sustituir datos locales' }).click();
  await expect(page.getByRole('status')).toContainText('Copia restaurada');
  await page.goto('/#/crisis');
  await expect(page.getByRole('heading', { name: 'Mi paso de prueba' })).toBeVisible();
});
test('T007: PWA reinicia offline con guías y plan previamente guardado', async ({
  page,
  context,
}) => {
  await create(page);
  await page.goto('/#/settings');
  await expect(page.getByText('Guías disponibles sin conexión', { exact: true })).toBeVisible({
    timeout: 20000,
  });
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('banner').getByRole('link', { name: 'Abrir mi plan', exact: true }).click();
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByRole('button', { name: 'Desbloquear mi plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
  await page.goto('/#/skills');
  await expect(page.locator('.skill-card')).toHaveCount(6);
  await page.goto('/#/crisis');
  await expect(page.getByRole('heading', { name: 'Solo el siguiente paso.' })).toBeVisible();
});
test('T010/014: claro/oscuro, estados públicos y privados sin fallos axe AA', async ({ page }) => {
  await page.goto('/');
  for (const path of ['/', '/#/crisis', '/#/skills/tip', '/#/emergency', '/#/unlock']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  }
  await create(page);
  await page.goto('/#/settings');
  await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const dark = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(dark.violations).toEqual([]);
});
test('T014: móvil 320px sin desbordamiento y movimiento reducido', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/', '/#/crisis', '/#/skills', '/#/emergency', '/#/settings', '/#/backup']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('Bogotá: fuentes oficiales, números visibles y cobertura explícita', async ({ page }) => {
  await page.goto('/#/emergency');
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
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
  await expect(
    page.getByText(/Verificación documental; no se realizó una llamada de prueba/),
  ).toHaveCount(2);
  await expect(page.getByText(/Servicio gratuito, las 24 horas/)).toBeVisible();
  await page.getByRole('combobox', { name: 'Ciudad o región', exact: true }).selectOption('CO-CUN');
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Aún no hay una línea verificada para esta región' }),
  ).toBeVisible();
});

test('ubicación cifrada: conserva país y ciudad al reabrir sin revelarlos con el plan bloqueado', async ({
  page,
}) => {
  await create(page);
  await page.goto('/#/emergency');
  await page.getByRole('combobox', { name: 'País', exact: true }).selectOption('DE');
  await page
    .getByRole('combobox', { name: 'Ciudad o región', exact: true })
    .selectOption('DE-HE-FRA');
  await page.getByRole('button', { name: 'Guardar ubicación en mi plan' }).click();
  await expect(page.getByRole('status')).toContainText('Ubicación guardada');
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'País', exact: true })).toHaveValue('CO');
  await expect(page.getByRole('combobox', { name: 'Ciudad o región', exact: true })).toHaveValue(
    '',
  );
  await unlock(page);
  await page.goto('/#/emergency');
  await expect(page.getByRole('combobox', { name: 'País', exact: true })).toHaveValue('DE');
  await expect(page.getByRole('combobox', { name: 'Ciudad o región', exact: true })).toHaveValue(
    'DE-HE-FRA',
  );
});
