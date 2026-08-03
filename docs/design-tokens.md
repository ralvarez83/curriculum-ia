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

Eso es exactamente lo que hace el modo oscuro:

```css
@theme {
  --color-primary: #0070c1;   /* claro */
}

:root[data-theme='dark'] {
  --color-primary: #22c55e;   /* solo se redefine lo que cambia */
}
```

## Claro y oscuro

El tema sale de tres fuentes, por orden de prioridad:

1. Lo que el usuario haya elegido con el botón, guardado en `localStorage`.
2. La preferencia del navegador (`prefers-color-scheme`).
3. Claro, como último recurso.

Un script en línea dentro de `<head>` resuelve las dos primeras y escribe
`data-theme` antes de pintar, así que la página no parpadea. Sin JavaScript ese
script no corre, y de ahí que los tokens oscuros estén también bajo una media
query: el bloque aparece dos veces en `globals.css` porque CSS no permite
compartir declaraciones entre un selector y una media query. Una prueba de
`tests/e2e/theming.spec.ts` carga la página con JavaScript desactivado y
compara los valores resueltos, de modo que los dos bloques no puedan separarse
sin que falle el CI.

## Tokens disponibles

### La idea: terminal en lo oscuro, IDE claro en lo claro

La cabecera es un bloque oscuro y ahí el verde de fósforo funciona: da 6,44:1 y
se lee como un terminal.

Los bloques claros **no llevan verde, y es deliberado**. En un tema claro de IDE
el verde existe, pero es el color de los comentarios: lo que el editor atenúa
por ser secundario. Usarlo para iconos, bordes y botones —el papel de marca—
contradice esa semántica. Para lo prominente esos temas usan azul, morado y
teal, y de ahí sale la paleta de esta zona, tomada de **VS Code Light+**
(`light_vs.json` y `light_plus.json`):

| Elemento de sintaxis | Hex | Sobre blanco | Uso aquí |
| --- | --- | --- | --- |
| Tipo (teal) | `#267f99` | 4,59:1 | Marca: iconos, bordes, botón View |
| Palabra clave (azul) | `#0451a5` | 7,71:1 | Enlaces |
| Función (marrón) | `#795e26` | 6,10:1 | Botón Source |
| Constante (azul) | `#0070c1` | 5,14:1 | Botón Docker |
| Cadena (rojo) | `#a31515` | 7,85:1 | Distintivo de nivel nativo |
| Comentario (verde) | `#008000` | 5,14:1 | *Sin usar: es el color de lo atenuado* |

El guiño no está en repetir un color por toda la página, sino en que cada bloque
use la paleta que le corresponde: terminal donde el fondo es oscuro, editor
claro donde es claro.

### Superficies

| Token | claro | oscuro | Uso |
| --- | --- | --- | --- |
| `--color-background` | `#f3f4f6` | `#0d1117` | Fondo de la página |
| `--color-surface` | `#ffffff` | `#161b22` | Tarjeta principal del CV |
| `--color-surface-muted` | `#f3f4f6` | `#0d1117` | Paneles interiores |

### Cabecera

En claro la cabecera destaca por ser **más oscura** que su entorno. En oscuro lo
equivalente no es volverla clara —un bloque claro grande deslumbra, que es justo
lo que el modo oscuro evita— sino que destaque por ser **más clara que el resto**,
siguiendo la convención de elevación: lo que está por encima se aclara.

| Token | claro | oscuro | Uso |
| --- | --- | --- | --- |
| `--color-header-bg` | `#1f2937` | `#2d333b` | Fondo de la cabecera |
| `--color-header-text` | `#ffffff` | `#f0f6fc` | Texto sobre la cabecera |

### Marca

| Token | claro | oscuro | Uso |
| --- | --- | --- | --- |
| `--color-primary` | `#267f99` | `#22c55e` | Marca sobre superficie clara |
| `--color-primary-hover` | `#1d6376` | `#4ade80` | *Hover* de lo anterior |
| `--color-primary-contrast` | `#ffffff` | `#0d1117` | Texto sobre el relleno de marca |
| `--color-primary-on-dark` | `#22c55e` | `#22c55e` | Marca dentro de la cabecera |
| `--color-link` | `#0451a5` | `#58a6ff` | Enlaces dentro del contenido |

Se elige el teal de tipos como dominante y no el azul: el azul es el color más
genérico de la web y además ya tiene su papel natural en los enlaces, así que
usarlo para las dos cosas los haría competir. El teal da 4,59:1 sobre la tarjeta
blanca —cumple, aunque sin holgura— y el verde de fósforo da 6,44:1 sobre la
cabecera. Son paletas distintas a propósito, no dos versiones del mismo color.

En modo oscuro esa tensión desaparece: con todo el documento sobre fondo
oscuro, el verde de fósforo pasa a ser la marca de toda la página (7,59:1 sobre
la tarjeta) y el CV entero se lee como un terminal.

### Texto

| Token | claro | oscuro | Uso |
| --- | --- | --- | --- |
| `--color-text` | `#1f2937` | `#e6edf3` | Texto principal y titulares |
| `--color-text-secondary` | `#374151` | `#c9d1d9` | Cuerpo de las tarjetas |
| `--color-text-muted` | `#4b5563` | `#8b949e` | Subtítulos, descripciones |

### Bordes

| Token | claro | oscuro | Uso |
| --- | --- | --- | --- |
| `--color-border` | `#267f99` | `#22c55e` | Borde del contenedor del CV |
| `--color-divider` | `#e5e7eb` | `#30363d` | Separadores |

### Etiquetas y acciones

| Token | claro | oscuro | Uso |
| --- | --- | --- | --- |
| `--color-tag-bg` | `#e5e7eb` | `#21262d` | Fondo de las etiquetas de habilidades |
| `--color-tag-text` | `#374151` | `#c9d1d9` | Texto de las etiquetas |
| `--color-action-source` | `#795e26` | `#d29922` | Botón "Source" de los proyectos |
| `--color-action-docker` | `#0070c1` | `#39c5cf` | Botón "Docker" de los proyectos |

Cada botón tiene además su `--color-action-*-hover`.

En claro los rellenos usan el marrón de función y el azul de constante de la
misma paleta de sintaxis, con texto blanco encima: 6,10:1 y 5,14:1.

### Niveles de idioma

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-level-basic` | `#5c9fb3` | Distintivo de nivel básico |
| `--color-level-intermediate` | `#4d9bd4` | Nivel intermedio |
| `--color-level-advanced` | `#a89672` | Nivel avanzado |
| `--color-level-native` | `#cc7e7e` | Nivel nativo |

Son los mismos colores de sintaxis aclarados hacia el blanco hasta pasar de
4,5:1 con el texto oscuro encima.

El color depende del nivel, no del idioma: al añadir un idioma nuevo se pinta
solo.

### Tipografía, formas y medidas

| Token | claro | oscuro | Uso |
| --- | --- | --- | --- |
| `--font-base` | Monoespaciada del sistema | *(igual)* | Tipografía de toda la página |
| `--radius-sm` | `4px` | *(igual)* | Elementos pequeños |
| `--radius-md` | `8px` | *(igual)* | Botones |
| `--radius-lg` | `12px` | *(igual)* | Tarjetas y contenedor |
| `--radius-full` | `9999px` | *(igual)* | Avatar y etiquetas |
| `--shadow-card` | Sombra difusa | *(igual)* | Contenedor del CV |
| `--container-cv` | `72rem` | *(igual)* | Ancho máximo del documento |
| `--transition-fast` | `150ms ease-in-out` | *(igual)* | Hovers |

## Retocar un tema

Cambiar el aspecto es cambiar valores en `globals.css`: el bloque `@theme` para
el claro y `:root[data-theme='dark']` —más su gemelo dentro de la media query—
para el oscuro. No hay que tocar ningún componente.

Al ajustar un color conviene comprobar el contraste que le corresponda: 4,5:1 si
va texto encima o es un enlace, 3:1 si es un elemento no textual que comunica
algo. Bordes e iconos meramente decorativos quedan fuera de ese criterio.

## Reglas

- **Nunca** pongas un color o una medida literal en un componente. Si necesitas
  un valor que no existe, crea el token.
- Los tokens llevan nombre semántico (`--color-header-bg`), no descriptivo
  (`--color-gris-oscuro`): así un tema puede cambiar el valor sin que el nombre
  mienta.
- Una variante de tema solo redefine lo que cambia. Todo lo que no aparezca en
  su bloque se hereda del tema por defecto.
