# CV Web Creado con IA

Este proyecto es una página web que presenta mi Curriculum Vitae, creada casi
enteramente utilizando Inteligencia Artificial. El objetivo es demostrar el
potencial de la IA como herramienta de apoyo en el desarrollo web y la creación
de contenido.

## 🌐 [Ver CV Web](https://rubenalvarezgonzalez.eu/)

## 🚀 Características

- Sitio estático: sin JavaScript de framework en el navegador
- Diseño moderno y responsivo, con estilos de impresión
- Español e inglés, cada uno con su propia URL indexable
- Sistema de diseño por *tokens*: cambiar el aspecto no obliga a tocar componentes
- Sección de proyectos con imágenes y enlaces
- Contenido en Markdown, renderizado durante el build
- Tipado con TypeScript y verificado con pruebas end-to-end

## 🛠️ Tecnologías

- [Astro](https://astro.build/) — generación estática
- [Tailwind CSS 4](https://tailwindcss.com/) — utilidades sobre tokens propios
- TypeScript
- [Playwright](https://playwright.dev/) — pruebas end-to-end y de regresión visual
- Desplegado en [Netlify](https://www.netlify.com/)

## 📦 Puesta en marcha

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:4321
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve el resultado de `build` en local |
| `npm run check` | Comprueba tipos y plantillas Astro |
| `npm test` | Pruebas end-to-end (compila y arranca el sitio solo) |
| `npm run test:ui` | Las mismas pruebas en modo interactivo |

Las pruebas necesitan los navegadores de Playwright (`npx playwright install`
la primera vez). En entornos que ya traen Chromium se puede evitar la descarga
con `CHROMIUM_PATH=/ruta/al/chrome npm test`.

## ✏️ Editar el contenido

Todo el texto del CV vive en `src/i18n/es.json` y `src/i18n/en.json`. No hay
que tocar código para actualizarlo: añade un puesto, un proyecto o una
habilidad en ambos ficheros y se refleja al compilar. Las pruebas recorren esos
diccionarios, así que verifican solas el contenido nuevo.

Los datos de contacto están en `src/data/contact.ts`, aparte porque no se
traducen.

Los textos admiten Markdown en línea (`**negrita**`, `*cursiva*`, enlaces), que
se convierte a HTML durante el build.

### Imágenes

Van en `src/assets/` (las de proyectos, en `src/assets/projects/`), no en
`public/`. Astro las procesa durante el build: las convierte a WebP, genera
varios tamaños y sirve el que corresponda a cada pantalla.

En los diccionarios se siguen nombrando por su fichero, como
`"image": "/cloud-monitor.png"`; basta con dejar el archivo en
`src/assets/projects/` con ese nombre. Si no aparece, el build falla en vez de
publicar una imagen rota.

En `public/` solo queda el favicon, porque debe servirse tal cual y sin
renombrar.

## 🌍 Añadir un idioma

1. Crea `src/i18n/<código>.json` copiando la estructura de `es.json`.
2. Regístralo en `src/i18n/utils.ts`, en el objeto `translations`.
3. Añade la ruta: `src/pages/<código>/index.astro`, igual que `src/pages/en/index.astro`.
4. Añade el idioma a `locales` en `astro.config.mjs`.

El español vive en la raíz (`/`) y el resto de idiomas bajo su prefijo
(`/en/`). El selector recuerda la elección en `localStorage`.

## 🎨 Cambiar el aspecto

El color, la tipografía, los radios y las sombras salen de los tokens de
`src/styles/globals.css`. Hay dos variantes de tema listas (`friki`, la de por
defecto, y `serious`), que se eligen con el atributo `data-theme` del `<html>`
en `src/layouts/Layout.astro`.

Ver [`docs/design-tokens.md`](docs/design-tokens.md) para la lista completa de
tokens y cómo crear un tema nuevo.

## 🚀 Despliegue

Netlify compila y publica automáticamente en cada push. La configuración está
en `netlify.toml`; no hay certificados que renovar a mano.

## 📖 Documentación

- [`docs/design-tokens.md`](docs/design-tokens.md) — sistema de diseño
- [`docs/migracion-astro.md`](docs/migracion-astro.md) — cómo y por qué se migró desde React/Vite

## 🤖 Proceso de desarrollo con IA

El proyecto se desarrolló principalmente a través de prompts a sistemas de IA:
conversión inicial de un documento Word a estructura web, refinamiento del
diseño, división en componentes, soporte multiidioma, paso del contenido a
Markdown, migración a TypeScript y, por último, migración de React a Astro con
un sistema de diseño basado en tokens.

## 📄 Licencia

Ver el archivo [`LICENSE`](LICENSE).

---

Creado con ❤️ y 🤖 por [Rubén Álvarez](https://github.com/ralvarez83)
