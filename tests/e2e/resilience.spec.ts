import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';
const phrase = 'sol montañas bosque palabras de prueba';
async function create(page: Page) {
  await page.goto('/#/unlock');
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByLabel('Repite la frase secreta').fill(phrase);
  await page.getByLabel('Confirmo que tengo 18 años o más.').check();
  await page.getByLabel(/Entiendo que este plan puede contener/).check();
  await page.getByRole('button', { name: 'Crear mi plan' }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
}
test('T001/010: teclado, reordenar, conservar borrador al cancelar navegación y preferencias', async ({
  page,
}) => {
  await create(page);
  await page.goto('/#/plan/safetySteps');
  await page.getByRole('button', { name: 'Escribir mi primera nota' }).click();
  await page.getByLabel('Mis pasos para un momento difícil · nota 1').fill('Primero de prueba');
  await page.getByRole('button', { name: 'Agregar otra nota' }).click();
  await page.getByLabel('Mis pasos para un momento difícil · nota 2').fill('Segundo de prueba');
  await page.getByRole('button', { name: 'Subir nota 2', exact: true }).click();
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('link', { name: 'Guías', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Mis pasos para un momento difícil', exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('Mis pasos para un momento difícil · nota 1')).toHaveValue(
    'Segundo de prueba',
  );
  await page.getByRole('button', { name: 'Guardar y volver al inicio' }).click();
  await expect(page.getByRole('status')).toContainText('Guardado');
  await page.goto('/#/crisis');
  await expect(page.getByRole('heading', { name: 'Segundo de prueba', exact: true })).toBeVisible();
  await page.goto('/#/skills/pros-contras');
  await page.getByRole('button', { name: 'Guardar notas para esta guía' }).click();
  await page
    .getByLabel('Mis recordatorios', { exact: true })
    .fill('Una acción de prueba\nOtra idea');
  await page.getByLabel('Ventajas de una alternativa segura').fill('Puedo esperar para decidir');
  await page.getByLabel('Mis notas no reemplazan las precauciones de la guía.').check();
  await page.getByRole('button', { name: 'Guardar mis notas' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(
    page.getByRole('complementary').getByText('Puedo esperar para decidir', { exact: true }),
  ).toBeVisible();
});
test('T015/017: bloqueo y cambios coordinados entre pestañas; sin envío de contenido por red', async ({
  page,
  context,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET') requests.push(request.url());
  });
  await create(page);
  const other = await context.newPage();
  await other.goto('/#/unlock');
  await other.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await other.getByRole('button', { name: 'Desbloquear mi plan', exact: true }).click();
  await expect(other.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
  await other.goto('/#/plan/earlySignals');
  await other.getByRole('button', { name: 'Escribir mi primera nota' }).click();
  await other
    .getByLabel('Cuando me cuesta manejar mis emociones · nota 1')
    .fill('Borrador de otra pestaña');
  await page.goto('/#/plan/earlySignals');
  await page.getByRole('button', { name: 'Escribir mi primera nota' }).click();
  await page.getByLabel('Cuando me cuesta manejar mis emociones · nota 1').fill('Guardado ganador');
  await page.getByRole('button', { name: 'Guardar y volver al inicio' }).click();
  await expect(page.getByRole('status')).toContainText('Guardado');
  await other.getByRole('button', { name: 'Guardar y volver al inicio' }).click();
  await expect(other.getByRole('alert')).toContainText('Hay cambios guardados');
  await expect(other.getByLabel('Cuando me cuesta manejar mis emociones · nota 1')).toHaveValue(
    'Borrador de otra pestaña',
  );
  await page.getByRole('button', { name: 'Bloquear', exact: true }).click();
  await expect(
    other.getByRole('heading', { name: 'Desbloquear mi plan', exact: true }),
  ).toBeVisible();
  await expect(other.locator('textarea')).toHaveCount(0);
  expect(requests).toEqual([]);
});
test('T009/010: impresión solo explícita y sin contactos ni diario por defecto', async ({
  page,
}) => {
  await create(page);
  await page.goto('/#/backup');
  await expect(page.locator('#print-plan')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Preparar vista de impresión' })).toBeDisabled();
  await page.getByLabel(/Entiendo que la impresión y el PDF/).check();
  await page.getByRole('button', { name: 'Preparar vista de impresión' }).click();
  await expect(page.locator('#print-plan')).toBeVisible();
  await expect(page.getByLabel(/Incluir contactos personales/)).not.toBeChecked();
  await expect(page.locator('#print-plan')).not.toContainText('Mis contactos');
  await page.emulateMedia({ media: 'print' });
  expect(await page.locator('#print-plan').isVisible()).toBe(true);
  await page.emulateMedia({ media: 'screen' });
});
test('T014: formularios privados, diálogo y letra ampliada accesibles', async ({ page }) => {
  await create(page);
  for (const path of ['/#/plan', '/#/plan/vulnerabilities', '/#/reflections', '/#/backup']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  }
  await page.goto('/#/support');
  await page.getByRole('button', { name: 'Agregar contacto' }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole('button', { name: 'Cerrar diálogo' }).click();
  await page.goto('/#/settings');
  await page.getByRole('combobox', { name: 'Tamaño de texto', exact: true }).selectOption('large');
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'large');
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('T007/011: precache parcial y actualización bloqueada por crisis en otra pestaña', async ({
  page,
  context,
}) => {
  await page.goto('/#/settings');
  await expect(page.getByText('Guías disponibles sin conexión', { exact: true })).toBeVisible({
    timeout: 20000,
  });
  const deleted = await page.evaluate(async () => {
    for (const name of await caches.keys()) {
      const cache = await caches.open(name);
      for (const key of await cache.keys())
        if (key.url.includes('icon-192.png')) {
          await cache.delete(key);
          return true;
        }
    }
    return false;
  });
  expect(deleted).toBe(true);
  await page.getByRole('button', { name: 'Comprobar descarga offline' }).click();
  await expect(page.getByText('Descarga offline sin confirmar', { exact: true })).toBeVisible();
  const crisis = await context.newPage();
  await crisis.goto('/#/crisis');
  await expect(crisis.getByRole('heading', { name: 'Solo el siguiente paso.' })).toBeVisible();
  await crisis.getByRole('link', { name: 'Hacer una pausa antes de actuar' }).click();
  await expect(
    crisis.getByRole('heading', { name: 'Hacer una pausa antes de actuar', exact: true }),
  ).toBeVisible();
  const original = await readFile('dist/sw.js', 'utf8');
  try {
    await writeFile(
      'dist/sw.js',
      original + '\n// actualización sintética para T011 ' + Date.now(),
    );
    await page.evaluate(async () => {
      await (await navigator.serviceWorker.getRegistration())!.update();
    });
    await expect
      .poll(
        () =>
          page.evaluate(async () =>
            Boolean((await navigator.serviceWorker.getRegistration())?.waiting),
          ),
        { timeout: 15000 },
      )
      .toBe(true);
    const allowed = await page.evaluate(async () => {
      const waiting = (await navigator.serviceWorker.getRegistration())!.waiting!;
      return await new Promise<boolean>((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => resolve(event.data.allowed);
        waiting.postMessage({ type: 'REQUEST_ACTIVATION' }, [channel.port2]);
      });
    });
    expect(allowed).toBe(false);
    await expect(
      crisis.getByRole('heading', { name: 'Hacer una pausa antes de actuar', exact: true }),
    ).toBeVisible();
    await crisis.close();
    await page.getByRole('button', { name: 'Comprobar descarga offline' }).click();
    await expect(page.getByRole('button', { name: 'Actualizar ahora' })).toBeVisible();
    await page.getByRole('button', { name: 'Actualizar ahora' }).click();
    await expect(
      page.getByRole('heading', { name: 'Ajustes y privacidad', exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Guías disponibles sin conexión', { exact: true })).toBeVisible();
  } finally {
    await writeFile('dist/sw.js', original);
  }
});
