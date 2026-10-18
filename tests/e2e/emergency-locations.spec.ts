import { test } from '@playwright/test';
import { checkEmergencyLocations } from '../helpers/emergency-locations';
test('directorio: ciudades, países y fuentes sin cruces de cobertura', async ({ page }) => {
  await checkEmergencyLocations(page);
});
