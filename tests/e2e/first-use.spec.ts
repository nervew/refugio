import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('primer uso: guía y líneas de atención accesibles sin crear un plan', async ({ page }) => {
  await page.goto('/#/unlock');
  await expect(page.getByRole('heading', { name: 'Crea tu plan personal' })).toBeVisible();
  await expect(page.getByText(/No necesitas registrarte/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Frase olvidada y opciones' })).toHaveCount(0);
  const help = page.getByRole('link', { name: 'Necesito apoyo ahora', exact: true });
  expect((await help.boundingBox())!.y).toBeLessThan(
    (await page.getByLabel('Frase secreta', { exact: true }).boundingBox())!.y,
  );
  await help.click();
  await expect(page.getByRole('heading', { name: 'Solo el siguiente paso.' })).toBeVisible();
  await expect(page.getByText(/No hay una persona respondiendo aquí/)).toBeVisible();
  await expect(page.getByText(/Tu plan está bloqueado/)).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Crear mi plan', exact: true })).toHaveCount(1);
  await page.getByRole('link', { name: 'Hacer una pausa antes de actuar', exact: true }).click();
  await page.getByRole('button', { name: 'Empezar paso a paso' }).click();
  await expect(
    page.getByRole('heading', { name: 'Pausa la acción un momento, si estás a salvo.' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Líneas y urgencias', exact: true }).click();
  await page.getByRole('combobox', { name: 'Ciudad o región', exact: true }).selectOption('CO-DC');
  await expect(page.getByRole('link', { name: 'Llamar al 123', exact: true })).toHaveAttribute(
    'href',
    'tel:123',
  );
  await expect(page.getByLabel('Frase secreta', { exact: true })).toHaveCount(0);
});

test('plan: primer paso enfocado, guardado y acceso distinto cuando está bloqueado', async ({
  page,
}) => {
  await page.goto('/#/unlock');
  const phrase = 'frase de prueba para el primer recorrido';
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByLabel('Repite la frase secreta').fill(phrase);
  await page.getByLabel('Confirmo que tengo 18 años o más.').check();
  await page.getByLabel(/Entiendo que este plan puede contener/).check();
  await page.getByRole('button', { name: 'Crear mi plan', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Puedes empezar con una sola idea' }),
  ).toBeVisible();
  await expect(page.locator('.step-number')).toHaveCount(0);
  await page.getByRole('link', { name: 'Escribir un paso para recordar' }).click();
  await page.getByRole('button', { name: 'Escribir mi primera nota' }).click();
  const note = page.getByLabel('Mis pasos para un momento difícil · nota 1');
  await expect(note).toBeFocused();
  await note.fill('Recordatorio ficticio del primer recorrido');
  await page.getByRole('button', { name: 'Guardar y volver al inicio' }).click();
  await expect(page).toHaveURL(/\/#\/$/);
  await page.getByRole('button', { name: 'Bloquear', exact: true }).click();
  await expect(page.locator('.feature-card').filter({ hasText: 'Mi plan personal' })).toContainText(
    'Desbloquear mi plan',
  );
  await expect(
    page.locator('.feature-card').filter({ hasText: 'Mi plan personal' }),
  ).not.toContainText('Crear mi plan');
  await page.goto('/#/skills/stop');
  await page.getByRole('link', { name: 'Desbloquear mi plan para ver mis notas' }).click();
  await page.getByLabel('Frase secreta', { exact: true }).fill(phrase);
  await page.getByRole('button', { name: 'Desbloquear mi plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
  await page.goto('/#/plan/safetySteps');
  await expect(page.getByLabel('Mis pasos para un momento difícil · nota 1')).toHaveValue(
    'Recordatorio ficticio del primer recorrido',
  );
});

test('móvil: lenguaje claro, letra ampliada y ayuda sin desbordamientos', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#/settings');
  await page.getByRole('combobox', { name: 'Tamaño de texto', exact: true }).selectOption('large');
  for (const path of ['/#/unlock', '/#/skills', '/#/crisis']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-text-size', 'large');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
  for (const link of await page.locator('.help-bar a').all()) {
    const box = (await link.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(48);
  }
});
