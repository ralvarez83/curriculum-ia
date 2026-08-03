# Sistema de diseño

Todo el aspecto del CV sale de un puñado de *tokens* definidos en
`src/styles/globals.css`. **Los componentes no contienen ni un color ni una
medida literal**: usan clases de Tailwind que apuntan a estos tokens
(`bg-primary`, `text-text-muted`, `rounded-lg`…). La consecuencia práctica es
que se puede recambiar por completo la apariencia sin abrir un solo `.astro`.

## Cómo funciona

Los tokens se declaran en el bloque `@theme` de Tailwind 4, que hace dos cosas
a la vez: publica cada token como propiedad personalizada de CSS en `:root` y
genera las clases de utilidad correspondientes. Como las utilidades referencian
la variable (`background-color: var(--color-primary)`) en lugar de copiar su
valor, basta con redefinir la variable bajo otro selector para que toda la
página cambie.

Eso es exactamente lo que hace una variante de tema:

```css
@theme {
  --color-primary: #22c55e;   /* tema por defecto */
}

[data-theme='serious'] {
  --color-primary: #3498db;   /* solo se redefine lo que cambia */
}
```

El tema activo se elige con el atributo `data-theme` del `<html>`, en
`src/layouts/Layout.astro`.

## Tokens disponibles

### La idea: terminal en lo oscuro, IDE claro en lo claro

La cabecera es un bloque oscuro y ahí el verde de fósforo funciona: da 6,44:1 y
se lee como un terminal.

En los bloques claros ese mismo verde no vale. Sobre blanco baja a 2,28:1: no
cumple contraste y, sobre todo, se lava y deja de parecer neón. Por eso la zona
clara usa la paleta de sintaxis de **VS Code Light+**, que es lo que se ve en un
editor con tema claro y donde todos los colores pasan de 4,5:1 sobre blanco:

| Elemento de sintaxis | Hex | Sobre blanco |
| --- | --- | --- |
| Comentario (verde) | `#008000` | 5,14:1 |
| Número | `#098658` | 4,60:1 |
| Cadena (rojo) | `#a31515` | 7,85:1 |
| Palabra clave (azul) | `#0000ff` | 8,59:1 |
| Función (marrón) | `#795e26` | 6,10:1 |
| Tipo (teal) | `#267f99` | 4,59:1 |
| Constante (azul) | `#0070c1` | 5,14:1 |

El guiño, entonces, no está en repetir un color: está en que cada bloque use la
paleta que le corresponde según su fondo.

### Superficies

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-background` | `#f3f4f6` | `#f5f5f5` | Fondo de la página |
| `--color-surface` | `#ffffff` | `#ffffff` | Tarjeta principal del CV |
| `--color-surface-muted` | `#f3f4f6` | `#fafafa` | Paneles interiores |

### Cabecera

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-header-bg` | `#1f2937` | `#2c3e50` | Fondo de la cabecera |
| `--color-header-text` | `#ffffff` | `#ffffff` | Texto sobre la cabecera |

### Marca

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-primary` | `#008000` | `#2471a3` | Marca sobre superficie clara |
| `--color-primary-hover` | `#006400` | `#1a5f8a` | *Hover* de lo anterior |
| `--color-primary-contrast` | `#ffffff` | `#ffffff` | Texto sobre el relleno de marca |
| `--color-primary-on-dark` | `#22c55e` | `#5dade2` | Marca dentro de la cabecera |
| `--color-link` | `#0070c1` | `#1a5f8a` | Enlaces dentro del contenido |

El verde de comentario da 5,14:1 sobre la tarjeta blanca; el de fósforo da
6,44:1 sobre la cabecera. Ningún valor único cumpliría en los dos sitios.

### Texto

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-text` | `#1f2937` | `#333333` | Texto principal y titulares |
| `--color-text-secondary` | `#374151` | `#4a4a4a` | Cuerpo de las tarjetas |
| `--color-text-muted` | `#4b5563` | `#6b6b6b` | Subtítulos, descripciones |

### Bordes

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-border` | `#008000` | `#e0e0e0` | Borde del contenedor del CV |
| `--color-divider` | `#e5e7eb` | `#e0e0e0` | Separadores |

### Etiquetas y acciones

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-tag-bg` | `#e5e7eb` | `#34495e` | Fondo de las etiquetas de habilidades |
| `--color-tag-text` | `#374151` | `#ffffff` | Texto de las etiquetas |
| `--color-action-source` | `#795e26` | `#34495e` | Botón "Source" de los proyectos |
| `--color-action-docker` | `#0070c1` | `#2471a3` | Botón "Docker" de los proyectos |

Cada botón tiene además su `--color-action-*-hover`.

En friki los rellenos usan el marrón de función y el azul de constante de la
misma paleta de sintaxis, con texto blanco encima: 6,10:1 y 5,14:1.

### Niveles de idioma

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-level-basic` | `#4d9bd4` | Distintivo de nivel básico |
| `--color-level-intermediate` | `#4da64d` | Nivel intermedio |
| `--color-level-advanced` | `#a89672` | Nivel avanzado |
| `--color-level-native` | `#cc7e7e` | Nivel nativo |

Son los mismos colores de sintaxis aclarados hacia el blanco hasta pasar de
4,5:1 con el texto oscuro encima.

El color depende del nivel, no del idioma: al añadir un idioma nuevo se pinta
solo.

### Tipografía, formas y medidas

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--font-base` | Monoespaciada del sistema | Lato / sans del sistema | Tipografía de toda la página |
| `--radius-sm` | `4px` | `3px` | Elementos pequeños |
| `--radius-md` | `8px` | `3px` | Botones |
| `--radius-lg` | `12px` | `3px` | Tarjetas y contenedor |
| `--radius-full` | `9999px` | `9999px` | Avatar y etiquetas |
| `--shadow-card` | Sombra difusa | Sombra plana | Contenedor del CV |
| `--container-cv` | `72rem` | `50rem` | Ancho máximo del documento |
| `--transition-fast` | `150ms ease-in-out` | *(igual)* | Hovers |

## Añadir un tema nuevo

1. Añade un bloque en `src/styles/globals.css` con el nombre del tema:

   ```css
   [data-theme='nocturno'] {
     --color-background: #0f172a;
     --color-surface: #1e293b;
     --color-text: #f8fafc;
     --color-primary: #60a5fa;
     /* solo hace falta redefinir lo que cambie respecto al tema por defecto */
   }
   ```

2. Actívalo en `src/layouts/Layout.astro`:

   ```astro
   <html lang={locale} data-theme="nocturno">
   ```

3. Añádelo a la lista de `THEMES` en `tests/e2e/theming.spec.ts` para que las
   pruebas verifiquen que no rompe la maquetación.

No hay que tocar ningún componente.

## Reglas

- **Nunca** pongas un color o una medida literal en un componente. Si necesitas
  un valor que no existe, crea el token.
- Los tokens llevan nombre semántico (`--color-header-bg`), no descriptivo
  (`--color-gris-oscuro`): así un tema puede cambiar el valor sin que el nombre
  mienta.
- Una variante de tema solo redefine lo que cambia. Todo lo que no aparezca en
  su bloque se hereda del tema por defecto.
