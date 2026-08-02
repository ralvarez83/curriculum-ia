import { test, expect } from '@playwright/test';
import es from '../../src/i18n/es.json' with { type: 'json' };
import en from '../../src/i18n/en.json' with { type: 'json' };

const STORAGE_KEY = 'cv-preferred-locale';

/**
 * Cada idioma tiene su URL propia (mejora sobre la versión React, donde el
 * idioma era estado interno y no se podía enlazar ni indexar).
 */
test.describe('idiomas y rutas', () => {
  test('la raíz sirve español y /en/ sirve inglés', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page).toHaveTitle(es.meta.title);

    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(en.meta.title);
  });

  test('el selector lleva de un idioma al otro', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-language-toggle]').click();
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.locator('[data-language-toggle]').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('recuerda el idioma elegido al volver', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-language-toggle]').click();
    await expect(page).toHaveURL(/\/en\/?$/);

    expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE_KEY)).toBe('en');

    // Volver a la raíz debe redirigir al idioma memorizado.
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('sin preferencia guardada, la raíz se queda en español', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('metadatos de idioma alternativos y canónico', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://rubenalvarezgonzalez.eu/',
    );
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
      'href',
      'https://rubenalvarezgonzalez.eu/en/',
    );
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
  });

  test('el enlace de proyecto específico de cada idioma es el correcto', async ({ page }) => {
    // Auto-Evaluaciones se sirve en un subdominio distinto por idioma.
    await page.goto('/');
    await expect(
      page.locator('a[href="https://datos-auto-evaluacion.rubenalvarezgonzalez.eu"]'),
    ).toHaveCount(1);

    await page.goto('/en/');
    await expect(
      page.locator('a[href="https://self-assessment-data.rubenalvarezgonzalez.eu"]'),
    ).toHaveCount(1);
  });
});
