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

### La idea: un terminal tiene dos caras

Los temas de terminal (Solarized, Gruvbox, One) se distribuyen siempre en
variante clara y oscura, y **cada una trae su propio juego de acentos**, porque
ningún acento se comporta igual sobre los dos fondos. El tema `friki` hace lo
mismo: el cuerpo del documento usa la paleta clara y la cabecera la oscura, con
los valores de [Gruvbox](https://github.com/morhetz/gruvbox) — *faded* para lo
claro, *bright* para lo oscuro.

Por eso el guiño al terminal no depende de un verde concreto: depende de que
cada superficie use los colores que ese tema usaría ahí.

### Superficies

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-background` | `#ebdbb2` | `#f5f5f5` | Fondo de la página |
| `--color-surface` | `#fbf1c7` | `#ffffff` | Tarjeta principal del CV |
| `--color-surface-muted` | `#ebdbb2` | `#fafafa` | Paneles interiores |

### Cabecera

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-header-bg` | `#282828` | `#2c3e50` | Fondo de la cabecera |
| `--color-header-text` | `#ebdbb2` | `#ffffff` | Texto sobre la cabecera |

### Marca

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-primary` | `#79740e` | `#2471a3` | Marca sobre superficie clara |
| `--color-primary-hover` | `#5f5b0b` | `#1a5f8a` | *Hover* de lo anterior |
| `--color-primary-contrast` | `#ffffff` | `#ffffff` | Texto sobre el relleno de marca |
| `--color-primary-on-dark` | `#b8bb26` | `#5dade2` | Marca dentro de la cabecera |
| `--color-link` | `#076678` | `#1a5f8a` | Enlaces dentro del contenido |

El verde cambia de tono según el fondo, igual que en el tema original: `#79740e`
da 4,86:1 sobre la tarjeta clara y `#b8bb26` da 7,14:1 sobre la cabecera. Ningún
valor único cumpliría en los dos sitios.

### Texto

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-text` | `#3c3836` | `#333333` | Texto principal y titulares |
| `--color-text-secondary` | `#504945` | `#4a4a4a` | Cuerpo de las tarjetas |
| `--color-text-muted` | `#665c54` | `#6b6b6b` | Subtítulos, descripciones |

### Bordes

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-border` | `#79740e` | `#e0e0e0` | Borde del contenedor del CV |
| `--color-divider` | `#d5c4a1` | `#e0e0e0` | Separadores |

### Etiquetas y acciones

| Token | friki | serious | Uso |
| --- | --- | --- | --- |
| `--color-tag-bg` | `#d5c4a1` | `#34495e` | Fondo de las etiquetas de habilidades |
| `--color-tag-text` | `#3c3836` | `#ffffff` | Texto de las etiquetas |
| `--color-action-source` | `#af3a03` | `#34495e` | Botón "Source" de los proyectos |
| `--color-action-docker` | `#076678` | `#2471a3` | Botón "Docker" de los proyectos |

Cada botón tiene además su `--color-action-*-hover`.

En friki los rellenos usan naranja y azul de la paleta clara de Gruvbox, con
texto blanco encima: 6,12:1 y 6,60:1.

### Niveles de idioma

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-level-basic` | `#8eb0a1` | Distintivo de nivel básico |
| `--color-level-intermediate` | `#aca93d` | Nivel intermedio |
| `--color-level-advanced` | `#d79921` | Nivel avanzado |
| `--color-level-native` | `#e6957a` | Nivel nativo |

Son los acentos neutros de Gruvbox aclarados hacia el fondo hasta pasar de
4,5:1 con el texto oscuro encima. Los "bright" de la paleta oscura no valen
aquí: el rojo `#fb4934` se queda en 3,37:1 sobre superficie clara.

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
