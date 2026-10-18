import { test } from '@playwright/test';
import { checkOfflineDownload } from '../helpers/offline-download';
test('sitio público: comprobar, reparar y reabrir las guías sin conexión', async ({ page }) => {
  await checkOfflineDownload(page, '/refugio');
});
