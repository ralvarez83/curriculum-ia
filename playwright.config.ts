import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const HOST = '127.0.0.1';
const baseURL = `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  // El sistema operativo va en la ruta: las capturas dependen de cómo dibuje
  // las fuentes cada entorno, así que cada plataforma guarda su propio juego.
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  expect: {
    // Tolerancia mínima: el antialiasing varía ligeramente entre entornos.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Escape para entornos que ya traen Chromium y no pueden descargarlo
        // (contenedores CI restringidos): CHROMIUM_PATH=/ruta/al/chrome.
        ...(process.env.CHROMIUM_PATH
          ? { launchOptions: { executablePath: process.env.CHROMIUM_PATH } }
          : {}),
      },
    },
  ],

  // Se prueba el artefacto real que se despliega, no el servidor de desarrollo.
  // El host se fija de forma explícita: por defecto Astro escucha en
  // "localhost", que en los runners de CI resuelve antes a ::1, y entonces las
  // peticiones a 127.0.0.1 no encuentran a nadie al otro lado.
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --host ${HOST}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
