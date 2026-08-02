import { test, expect } from '@playwright/test';

const THEMES = ['friki', 'serious'] as const;

/**
 * El aspecto se controla solo con tokens: cambiar `data-theme` en <html> debe
 * repintar la página sin romper la maquetación ni tocar ningún componente.
 * Ver docs/design-tokens.md.
 */
test.describe('sistema de temas', () => {
  test('el tema por defecto es friki', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'friki');
  });

  for (const theme of THEMES) {
    test(`el tema "${theme}" se aplica y mantiene el layout`, async ({ page }) => {
      await page.goto('/');
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

      const container = page.locator('.cv-container');
      await expect(container).toBeVisible();

      // Sin desbordamiento horizontal.
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows, `el tema ${theme} provoca scroll horizontal`).toBe(false);

      // Los tokens de color deben tener valor resuelto.
      const tokens = await page.evaluate(() => {
        const s = getComputedStyle(document.documentElement);
        return {
          background: s.getPropertyValue('--color-background').trim(),
          primary: s.getPropertyValue('--color-primary').trim(),
          headerBg: s.getPropertyValue('--color-header-bg').trim(),
          text: s.getPropertyValue('--color-text').trim(),
        };
      });
      for (const [name, value] of Object.entries(tokens)) {
        expect(value, `el token ${name} no está definido en el tema ${theme}`).not.toBe('');
      }
    });
  }

  test('los temas producen paletas distintas', async ({ page }) => {
    await page.goto('/');

    const readPrimary = () =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
      );

    const friki = await readPrimary();
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'serious'));
    const serious = await readPrimary();

    expect(friki).not.toBe(serious);
  });
});

/**
 * El CV está pensado para imprimirse: los botones no sirven en papel, así que
 * se ocultan y en su lugar se imprimen las URLs.
 */
test.describe('impresión', () => {
  test('en papel se ocultan los controles y se muestran las URLs', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('[data-language-toggle]')).toBeHidden();
    await expect(page.locator('.print-only').first()).toBeVisible();
    await expect(page.locator('.screen-only').first()).toBeHidden();
    await expect(
      page.locator('.print-only').filter({ hasText: 'https://movie-info' }).first(),
    ).toBeVisible();
  });
});
