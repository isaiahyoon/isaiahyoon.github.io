import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.pw.spec.mjs',
  fullyParallel: true,
  reporter: 'list'
});
