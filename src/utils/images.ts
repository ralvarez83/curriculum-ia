import type { ImageMetadata } from 'astro';

/**
 * Las imágenes viven en `src/assets/` para que Astro las procese durante el
 * build (las reescala y las sirve en WebP). Los diccionarios de `src/i18n/` y
 * el resto de datos las siguen nombrando por su ruta original, así que aquí se
 * resuelve ese nombre al módulo importado.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

const byFilename = new Map<string, ImageMetadata>(
  Object.entries(modules).map(([path, module]) => [path.split('/').pop()!, module.default]),
);

export function getImageAsset(reference: string): ImageMetadata {
  const filename = reference.split('/').pop();
  const image = filename ? byFilename.get(filename) : undefined;

  if (!image) {
    // Mejor romper el build que publicar la página con una imagen rota.
    throw new Error(
      `No se encuentra "${reference}" en src/assets/. ` +
        `Disponibles: ${[...byFilename.keys()].join(', ')}`,
    );
  }

  return image;
}
