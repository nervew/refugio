import { test, expect } from '@playwright/test';

test('sitio público: entender el propósito y consultar ayuda sin registrarse', async ({ page }) => {
  await page.goto('/refugio/');
  await expect(
    page.getByText(/Guías y recordatorios para momentos en que tus emociones te sobrepasan/),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Necesito apoyo ahora', exact: true }).click();
  await expect(page.getByText(/No hay una persona respondiendo aquí/)).toBeVisible();
  await expect(page.getByText(/Tu plan está bloqueado/)).toHaveCount(0);
  await page.getByRole('link', { name: 'Hacer una pausa antes de actuar', exact: true }).click();
  await page.getByRole('button', { name: 'Empezar paso a paso' }).click();
  await expect(
    page.getByRole('heading', { name: 'Pausa la acción un momento, si estás a salvo.' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Líneas y urgencias', exact: true }).click();
  await page.getByRole('combobox', { name: 'Ciudad o región', exact: true }).selectOption('CO-DC');
  await expect(page.getByRole('link', { name: 'Llamar al 106', exact: true })).toHaveAttribute(
    'href',
    'tel:106',
  );
  await page.goto('/refugio/#/unlock');
  await expect(page.getByRole('heading', { name: 'Crea tu plan personal' })).toBeVisible();
  await expect(page.getByText(/No necesitas registrarte/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Frase olvidada y opciones' })).toHaveCount(0);
});
