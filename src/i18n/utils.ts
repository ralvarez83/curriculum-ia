import es from './es.json';
import en from './en.json';

const translations = { es, en } as const;

export type Locale = keyof typeof translations;
export type Translation = (typeof translations)['es'];

/** Nivel de idioma: clave estable, la etiqueta visible sale de `languageLevels`. */
export type LanguageLevel = keyof Translation['languageLevels'];

export const LOCALES = Object.keys(translations) as Locale[];
export const DEFAULT_LOCALE: Locale = 'es';

export function getTranslations(locale: Locale): Translation {
  return translations[locale];
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split('/');
  return segment === 'en' ? 'en' : DEFAULT_LOCALE;
}

/**
 * Ruta equivalente en el otro idioma. El idioma por defecto (es) vive en la
 * raíz sin prefijo; el resto bajo `/<locale>/`.
 */
export function getAlternateUrl(url: URL, targetLocale: Locale): string {
  const pathname = url.pathname;
  if (targetLocale === DEFAULT_LOCALE) {
    return pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  }
  if (pathname.startsWith('/en/') || pathname === '/en') return pathname;
  return `/en${pathname}`;
}
