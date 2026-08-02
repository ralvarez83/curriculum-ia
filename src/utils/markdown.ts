import { marked } from 'marked';

/**
 * Los textos del CV llevan Markdown en línea (**negrita**, *cursiva*, enlaces).
 * Se convierten a HTML durante el build: el navegador no descarga ningún
 * parser, a diferencia del `react-markdown` que usaba la versión anterior.
 *
 * El contenido es propio y estático (vive en `src/i18n/*.json`), no entra
 * texto de terceros, por eso el HTML resultante se inserta con `set:html`.
 */

/** Para textos de una sola línea: no envuelve el resultado en `<p>`. */
export function renderInlineMarkdown(source: string): string {
  return marked.parseInline(source, { async: false });
}

/** Para textos de varios párrafos. */
export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false });
}
