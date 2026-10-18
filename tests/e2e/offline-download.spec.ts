import { test } from '@playwright/test';
import { checkOfflineDownload } from '../helpers/offline-download';
test('descarga offline: resultado visible, detección de falta, reparación y reapertura sin red', async ({
  page,
}) => {
  await checkOfflineDownload(page);
});
