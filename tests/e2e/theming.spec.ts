import { test, expect, type Page } from '@playwright/test';

const KEY = 'cv-theme';

/** Tokens que deben cambiar de valor entre claro y oscuro. */
const TOKENS = ['--color-background', '--color-surface', '--color-text', '--color-primary'];

function leerTokens(page: Page) {
  return page.evaluate((tokens) => {
    const s = getComputedStyle(document.documentElement);
    return Object.fromEntries(tokens.map((t) => [t, s.getPropertyValue(t).trim()]));
  }, TOKENS);
}

test.describe('tema claro y oscuro', () => {
  test('sigue la preferencia del navegador cuando no se ha elegido', async ({ browser }) => {
    for (const scheme of ['light', 'dark'] as const) {
      const ctx = await browser.newContext({ colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      await ctx.close();
    }
  });

  test('el botón cambia el tema y la elección manda sobre el navegador', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/');

    const claro = await leerTokens(page);
    await page.locator('[data-theme-toggle]').click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const oscuro = await leerTokens(page);
    for (const token of TOKENS) {
      expect(oscuro[token], `${token} debería cambiar al pasar a oscuro`).not.toBe(claro[token]);
    }

    // Recargar con el navegador en claro: la elección guardada tiene prioridad.
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe('dark');

    await ctx.close();
  });

  test('el icono ofrece siempre el tema contrario', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/');

    // En claro se ofrece pasar a oscuro: se ve la luna.
    await expect(page.locator('[data-theme-icon="dark"]')).toBeVisible();
    await expect(page.locator('[data-theme-icon="light"]')).toBeHidden();

    await page.locator('[data-theme-toggle]').click();

    await expect(page.locator('[data-theme-icon="light"]')).toBeVisible();
    await expect(page.locator('[data-theme-icon="dark"]')).toBeHidden();

    await ctx.close();
  });

  test('el botón se anuncia con el tema al que lleva', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/');

    const boton = page.locator('[data-theme-toggle]');
    await expect(boton).toHaveAttribute('aria-label', 'Cambiar a tema oscuro');
    await boton.click();
    await expect(boton).toHaveAttribute('aria-label', 'Cambiar a tema claro');

    await ctx.close();
  });

  /**
   * El bloque de tokens oscuros está escrito dos veces en globals.css —una para
   * la elección explícita y otra para la media query— porque CSS no permite
   * compartirlo. Esta prueba impide que se separen: sin JavaScript sólo actúa
   * la media query, así que ambos caminos tienen que dar lo mismo.
   */
  test('con y sin JavaScript el modo oscuro da los mismos valores', async ({ browser }) => {
    const conJs = await browser.newContext({ colorScheme: 'dark' });
    const p1 = await conJs.newPage();
    await p1.goto('/');
    await expect(p1.locator('html')).toHaveAttribute('data-theme', 'dark');
    const viaScript = await leerTokens(p1);
    await conJs.close();

    const sinJs = await browser.newContext({ colorScheme: 'dark', javaScriptEnabled: false });
    const p2 = await sinJs.newPage();
    await p2.goto('/');
    const viaMediaQuery = await p2.evaluate((tokens) => {
      const s = getComputedStyle(document.documentElement);
      return Object.fromEntries(tokens.map((t) => [t, s.getPropertyValue(t).trim()]));
    }, TOKENS);
    await sinJs.close();

    expect(viaMediaQuery).toEqual(viaScript);
  });

  for (const tema of ['light', 'dark'] as const) {
    test(`el tema "${tema}" mantiene el layout y define todos los tokens`, async ({ page }) => {
      await page.goto('/');
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), tema);

      await expect(page.locator('.cv-container')).toBeVisible();

      const desborda = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(desborda, `el tema ${tema} provoca scroll horizontal`).toBe(false);

      const tokens = await leerTokens(page);
      for (const [nombre, valor] of Object.entries(tokens)) {
        expect(valor, `${nombre} sin valor en el tema ${tema}`).not.toBe('');
      }
    });
  }
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
    await expect(page.locator('[data-theme-toggle]')).toBeHidden();
    await expect(page.locator('.print-only').first()).toBeVisible();
    await expect(page.locator('.screen-only').first()).toBeHidden();
    await expect(
      page.locator('.print-only').filter({ hasText: 'https://ownautocare.com' }).first(),
    ).toBeVisible();
  });
});
