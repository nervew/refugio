import { defineConfig } from '@playwright/test';
import common from './playwright.config';
export default defineConfig({
  ...common,
  testDir: './tests/pages',
  use: { ...common.use, baseURL: 'http://127.0.0.1:4175/refugio/' },
  webServer: {
    command: 'node scripts/serve.mjs',
    url: 'http://127.0.0.1:4175/refugio/',
    env: { BASE_PATH: '/refugio/', PORT: '4175' },
    reuseExistingServer: false,
  },
});
