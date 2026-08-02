# Migración de React/Vite a Astro

Registro de la migración del CV desde la SPA de React + Vite + Docker al sitio
estático en Astro desplegado en Netlify.

## Por qué

El CV es contenido estático: no tenía estado más allá de un conmutador de
idioma. La SPA enviaba al navegador **283,92 kB de JavaScript** (89,22 kB
comprimido) para pintar texto que nunca cambia, y el despliegue exigía mantener
a mano contenedores Docker, Nginx y la renovación de certificados TLS.

| | Antes (React + Vite) | Después (Astro) |
| --- | --- | --- |
| JavaScript servido | 283,92 kB | Sin *bundle* de framework; solo un `<script>` en línea para recordar el idioma |
| CSS | 13,93 kB | 16 kB (incluye los dos temas) |
| URLs | Una sola (`/`), idioma en estado interno | `/` (es) y `/en/`, indexables |
| Despliegue | Docker + Nginx + TLS manual | Build estático en Netlify |

## Verificación de paridad

Antes de borrar nada se capturó una baseline del sitio React original (commit
`710265a`) con Playwright: capturas a página completa en ES y EN sobre tres
anchos (375, 768 y 1440 px) y volcado de todos los textos visibles, enlaces,
imágenes y encabezados.

El resultado del contraste contra la versión migrada fue:

- **Enlaces perdidos: 0.** Los diez enlaces externos siguen presentes, incluido
  el de Auto-Evaluaciones, que apunta a un subdominio distinto en cada idioma
  (`datos-auto-evaluacion.` / `self-assessment-data.`), diferencia que era
  intencionada en el original.
- **Imágenes rotas: 0.** Las cuatro imágenes cargan en ambos idiomas.
- **Sin errores de consola ni peticiones fallidas.**
- Las únicas diferencias de texto son las correcciones que se listan abajo.

## Defectos del original corregidos

La migración no es una copia literal: se arreglaron estos fallos que arrastraba
la versión React. Son las únicas desviaciones de la paridad 1:1.

1. **`<html lang>` no cambiaba de idioma.** Se quedaba en `es` incluso en la
   versión inglesa, con el consiguiente perjuicio para accesibilidad y SEO.
2. **`<title>` no se traducía.** Ahora cada idioma tiene título y descripción
   propios.
3. **Encabezado "Idiomas" duplicado y sin traducir.** El componente incrustaba
   un `<h3>Idiomas</h3>` en español dentro de una sección que ya tenía su
   propio título traducido: en inglés se leía "Languages" seguido de "Idiomas".
4. **Niveles de idioma sin traducir.** En la versión inglesa se mostraba
   "Nativo" e "Intermedio", y el idioma "Inglés" aparecía en español. Ahora el
   nivel es una clave (`native`, `intermediate`…) y la etiqueta visible sale
   del diccionario de cada idioma.
5. **Habilidad duplicada.** `xUnit` figuraba dos veces en la lista.
6. **Separador suelto.** El bloque "Experiencias anteriores" no tiene empresa,
   así que el subtítulo empezaba por `" | "`.
7. **`photo.jpg` sin barra inicial.** Resolvía por ruta relativa y se habría
   roto en `/en/`.

## Red de seguridad

La suite de `tests/e2e/` se queda en el repositorio de forma permanente: cubre
contenido en ambos idiomas, enlaces, rutas de idioma y su persistencia, temas,
estilos de impresión y regresión visual en los tres anchos. Cualquier cambio
futuro de contenido o de tema que rompa algo se detecta ahí.

## Pendiente

`nginx/nginx-reverse.conf` se retiró de este repositorio, pero contenía la
configuración del *reverse proxy* de los otros servicios del servidor
(`adguard`, `movie-info`, `datos-auto-evaluacion`). Sigue recuperable en el
historial, en el commit `e42ed50`, por si hace falta al migrar esos servicios.

El historial de git todavía contiene una clave privada TLS que se subió por
error en el commit `f75ff90` (`path/to/key.pem/_cert.pem`, retirada del árbol
de trabajo en esta migración). El certificado asociado ya está caducado, pero
limpiar el historial sigue pendiente.
