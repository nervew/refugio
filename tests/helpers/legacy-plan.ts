import { readFileSync } from 'node:fs';
import { expect, type Page } from '@playwright/test';
const fixture = JSON.parse(
  readFileSync(new URL('../fixtures/optional-field-v1.json', import.meta.url), 'utf8'),
);
export async function recoverLegacyPlan(page: Page, base = '') {
  await page.goto(`${base}/#/unlock`);
  await expect(page.getByRole('heading', { name: 'Crea tu plan personal' })).toBeVisible();
  await page.evaluate(
    async ({ envelope, name }) => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(name);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      try {
        await new Promise<void>((resolve, reject) => {
          const transaction = db.transaction('vault', 'readwrite');
          transaction.objectStore('vault').put({ id: 'primary', envelope, storageRevision: 0 });
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
          transaction.onabort = () => reject(transaction.error);
        });
      } finally {
        db.close();
      }
    },
    { envelope: fixture.envelope, name: base ? `refugio:${base}/` : 'refugio' },
  );
  await page.reload();
  await page.getByLabel('Frase secreta', { exact: true }).fill(fixture.phrase);
  await page.getByRole('button', { name: 'Desbloquear mi plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mi plan personal', exact: true })).toBeVisible();
  await page.goto(`${base}/#/plan/safetySteps`);
  await expect(page.getByLabel('Mis pasos para un momento difícil · nota 1')).toHaveValue(
    'Nota sintética recuperada del formato anterior',
  );
}
