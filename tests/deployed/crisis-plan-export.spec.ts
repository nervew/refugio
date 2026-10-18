import { test } from '@playwright/test';
import { checkCrisisPlanExport } from '../helpers/crisis-plan-export';
test('sitio público: plan de seis secciones con notas personales, contactos opcionales y descarga', async ({
  page,
}) => {
  await checkCrisisPlanExport(page, '/refugio');
});
