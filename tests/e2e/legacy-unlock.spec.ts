import { test } from '@playwright/test';
import { recoverLegacyPlan } from '../helpers/legacy-plan';
test('abre un plan guardado por la versión anterior con un campo opcional vacío', async ({
  page,
}) => {
  await recoverLegacyPlan(page);
});
