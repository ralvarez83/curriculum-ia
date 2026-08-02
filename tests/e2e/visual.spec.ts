import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

const PAGES = [
  { locale: 'es', path: '/' },
  { locale: 'en', path: '/en/' },
] as const;

/**
 * Red de seguridad visual: cualquier cambio de tokens, contenido o maquetación
 * que altere el resultado hace fallar la comparación. Si el cambio es
 * intencionado, regenerar con `npx playwright test --update-snapshots`.
 *
 * Van etiquetadas con @visual y quedan fuera de la integración continua: el
 * dibujado de fuentes cambia de un entorno a otro, así que compararlas contra
 * capturas hechas en otra máquina daría falsos negativos. Se ejecutan en local
 * (`npm test`), donde sí sirven de red de seguridad.
 */
for (const { locale, path } of PAGES) {
  for (const vp of VIEWPORTS) {
    test(`aspecto ${vp.name} [${locale}]`, { tag: '@visual' }, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(path, { waitUntil: 'networkidle' });

      await expect(page).toHaveScreenshot(`${vp.name}-${locale}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}
