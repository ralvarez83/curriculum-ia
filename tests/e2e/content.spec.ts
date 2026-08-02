import { test, expect, type Page, type Locator } from '@playwright/test';
import es from '../../src/i18n/es.json' with { type: 'json' };
import en from '../../src/i18n/en.json' with { type: 'json' };

/** Tarjetas de una sección concreta, en el orden en que se renderizan. */
function sectionCards(page: Page, sectionTitle: string): Locator {
  return page
    .locator('section.cv-section')
    .filter({ has: page.getByRole('heading', { name: sectionTitle, exact: true }) })
    .locator('article');
}

const LOCALES = [
  { locale: 'es', path: '/', t: es },
  { locale: 'en', path: '/en/', t: en },
] as const;

/**
 * El contenido del CV vive en `src/i18n/*.json`: estas pruebas comprueban que
 * todo lo que hay en los diccionarios llega realmente a la página, en ambos
 * idiomas. Si se añade un puesto o un proyecto, se verifica solo.
 */
for (const { locale, path, t } of LOCALES) {
  test.describe(`contenido [${locale}]`, () => {
    test('cabecera: nombre, puesto, foto y contacto', async ({ page }) => {
      await page.goto(path);

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.name);
      await expect(page.getByRole('heading', { level: 2 })).toHaveText(t.title);

      const photo = page.locator('header img');
      const photoStem = t.photo.split('/').pop()!.replace(/\.[^.]+$/, '');
      await expect(photo).toHaveAttribute('src', new RegExp(photoStem));
      await expect(photo).toHaveAttribute('alt', t.name);

      await expect(page.getByRole('link', { name: 'rubenag83@gmail.com' })).toHaveAttribute(
        'href',
        'mailto:rubenag83@gmail.com',
      );
      await expect(page.getByText('Madrid, España')).toBeVisible();
    });

    test('todas las secciones aparecen una sola vez', async ({ page }) => {
      await page.goto(path);

      for (const title of Object.values(t.sections)) {
        await expect(
          page.getByRole('heading', { name: title, exact: true }),
          `la sección "${title}" debe aparecer exactamente una vez`,
        ).toHaveCount(1);
      }
    });

    test('perfil, habilidades e idiomas', async ({ page }) => {
      await page.goto(path);

      // El Markdown se renderiza en build: debe haber <strong>, no asteriscos.
      const profile = page.locator('.md').first();
      await expect(profile).not.toContainText('**');
      await expect(profile.locator('strong').first()).toBeVisible();

      for (const skill of t.skills) {
        await expect(page.getByRole('listitem').filter({ hasText: skill }).first()).toBeVisible();
      }

      for (const { name, level } of t.languages) {
        const label = t.languageLevels[level as keyof typeof t.languageLevels];
        const row = page.getByRole('listitem').filter({ hasText: name }).first();
        await expect(row).toContainText(label);
      }
    });

    test('experiencia y educación completas', async ({ page }) => {
      await page.goto(path);

      // Se compara por posición: hay puestos con el mismo título en empresas
      // distintas ("Co-Fundador – CTO"), así que filtrar por texto no basta.
      const experience = sectionCards(page, t.sections.experience);
      await expect(experience).toHaveCount(t.experience.length);

      for (const [i, job] of t.experience.entries()) {
        const card = experience.nth(i);
        await expect(card).toContainText(job.title);
        await expect(card).toContainText(job.period);
        if (job.company) await expect(card).toContainText(job.company);
      }

      const education = sectionCards(page, t.sections.education);
      await expect(education).toHaveCount(t.education.length);

      for (const [i, edu] of t.education.entries()) {
        const card = education.nth(i);
        await expect(card).toContainText(edu.degree);
        await expect(card).toContainText(edu.institution);
        await expect(card).toContainText(edu.period);
      }
    });

    test('proyectos con sus enlaces e imágenes', async ({ page }) => {
      await page.goto(path);

      const projects = sectionCards(page, t.sections.projects);
      await expect(projects).toHaveCount(t.projects.length);

      for (const [i, project] of t.projects.entries()) {
        const card = projects.nth(i);
        await expect(card).toContainText(project.title);

        // Astro procesa las imágenes y les cambia el nombre con un hash, así
        // que se comprueba que la tarjeta lleva la imagen que le toca por el
        // nombre del fichero de origen, no por la ruta literal.
        const stem = project.image.split('/').pop()!.replace(/\.[^.]+$/, '');
        await expect(card.locator('img')).toHaveAttribute('src', new RegExp(stem));

        for (const href of [project.projectLink, project.sourceLink, project.dockerLink]) {
          if (!href) continue;
          await expect(
            card.locator(`a[href="${href}"]`),
            `falta el enlace ${href} en el proyecto ${project.title}`,
          ).toHaveCount(1);
        }
      }
    });

    test('todas las imágenes cargan sin necesidad de hacer scroll', async ({ page }) => {
      // Deliberadamente sin scroll: con loading="lazy" WebKit se dejaba las
      // imágenes de proyecto sin pedir hasta que había scroll o resize, y se
      // veían en blanco de forma intermitente. Si alguien vuelve a diferirlas,
      // esta prueba lo detecta.
      await page.goto(path, { waitUntil: 'load' });

      await expect
        .poll(
          () =>
            page.evaluate(() =>
              [...document.querySelectorAll('img')]
                .filter((img) => !img.complete || img.naturalWidth === 0)
                .map((img) => img.getAttribute('src')),
            ),
          { message: 'hay imágenes que no llegan a cargar sin scroll' },
        )
        .toEqual([]);

      // Y que ninguna quede con dimensión cero por un fallo de maquetación.
      const anchos = await page.evaluate(() =>
        [...document.querySelectorAll('img')].map((i) => i.getBoundingClientRect().width),
      );
      expect(anchos.every((w) => w > 0)).toBe(true);
    });

    test('sin errores de consola ni recursos caídos', async ({ page }) => {
      const consoleErrors: string[] = [];
      const failed: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('requestfailed', (req) => failed.push(`${req.url()} — ${req.failure()?.errorText}`));
      page.on('response', (res) => {
        if (res.status() >= 400) failed.push(`HTTP ${res.status()} ${res.url()}`);
      });

      await page.goto(path, { waitUntil: 'networkidle' });

      expect(consoleErrors).toEqual([]);
      expect(failed).toEqual([]);
    });
  });
}
