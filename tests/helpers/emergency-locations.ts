import { expect, type Page } from '@playwright/test';

export async function checkEmergencyLocations(page: Page, basePath = '') {
  await page.goto(`${basePath}/#/emergency`);
  const country = page.getByRole('combobox', { name: 'País', exact: true });
  const city = page.getByRole('combobox', { name: 'Ciudad o región', exact: true });
  for (const [nation, code, name, phone, source] of [
    ['CO', 'CO-ANT-MDE', 'Medellín, Colombia', '106', 'medellin.gov.co'],
    ['CO', 'CO-VAC-CLO', 'Cali, Colombia', '106', 'cali.gov.co'],
    ['DE', 'DE-HE-FRA', 'Frankfurt am Main, Alemania', '116123', 'telefonseelsorge.de'],
    ['NL', 'NL-NH-AMS', 'Ámsterdam, Países Bajos', '0880767000', 'deluisterlijn.nl'],
  ]) {
    await country.selectOption(nation);
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    await expect(city.getByRole('option', { name, exact: true })).toHaveCount(1);
    await city.selectOption(code);
    await expect(
      page.getByRole('link', { name: `Llamar al ${phone}`, exact: true }),
    ).toHaveAttribute('href', `tel:${phone}`);
    await expect(
      page.getByRole('link', { name: `Consultar fuente oficial de la línea ${phone}` }),
    ).toHaveAttribute('href', new RegExp(source.replaceAll('.', '\\.')));
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(2);
    if (nation !== 'CO')
      await expect(page.getByText('Fuente: Secretaría Distrital de Salud de Bogotá.')).toHaveCount(
        0,
      );
  }
}
