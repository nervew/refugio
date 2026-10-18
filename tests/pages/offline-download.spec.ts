import { test } from '@playwright/test';
import { checkOfflineDownload } from '../helpers/offline-download';
test('GitHub Pages: comprobar y reparar descarga dentro de /refugio/', async ({ page }) => {
  await checkOfflineDownload(page, '/refugio');
});
