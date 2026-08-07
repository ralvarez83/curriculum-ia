import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Audita el sitio ya construido y falla si alguna categoría baja del umbral.
 * Hasta ahora Lighthouse se pasaba a mano, así que nada impedía que una
 * regresión de rendimiento o accesibilidad llegase a producción.
 */

const PUERTO = 4322;
const BASE = `http://127.0.0.1:${PUERTO}`;
const RUTAS = ['/', '/en/'];

const MINIMOS = {
  performance: 100,
  accessibility: 100,
  'best-practices': 100,
  seo: 100,
};

const salida = mkdtempSync(join(tmpdir(), 'lh-'));

const servidor = spawn(
  'npm',
  ['run', 'preview', '--', '--port', String(PUERTO), '--host', '127.0.0.1'],
  { stdio: 'ignore' },
);

async function esperarServidor() {
  for (let intento = 0; intento < 60; intento++) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch {
      /* todavía no escucha */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`El servidor no respondió en ${BASE}`);
}

function auditar(ruta) {
  const informe = join(salida, `${ruta.replace(/\W/g, '_') || 'raiz'}.json`);

  execFileSync(
    'npx',
    [
      'lighthouse',
      BASE + ruta,
      '--quiet',
      '--output=json',
      `--output-path=${informe}`,
      '--preset=desktop',
      '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );

  const { categories } = JSON.parse(readFileSync(informe, 'utf8'));
  return Object.fromEntries(
    Object.entries(categories).map(([id, c]) => [id, Math.round(c.score * 100)]),
  );
}

let fallos = 0;

try {
  await esperarServidor();

  function porDebajo(puntuaciones) {
    return Object.entries(MINIMOS).filter(
      ([categoria, minimo]) =>
        puntuaciones[categoria] !== undefined && puntuaciones[categoria] < minimo,
    );
  }

  for (const ruta of RUTAS) {
    let puntuaciones = auditar(ruta);

    // La primera ruta que se audita paga el arranque en frío: el servidor
    // acaba de levantarse y ninguna hoja de estilos, fuente o imagen está en
    // caché, mientras que la siguiente ya las encuentra calientes. En una
    // máquina holgada no se nota, pero en un runner cargado esa diferencia ha
    // bastado para tumbar el rendimiento de "/" mientras "/en/", con los mismos
    // recursos, sacaba 100 en la misma ejecución. Antes de dar por fallada una
    // ruta se repite la medición una vez: si el problema era el frío, la
    // segunda pasada lo confirma; si es una regresión real, vuelve a fallar.
    if (porDebajo(puntuaciones).length > 0) {
      console.error(`  … ${ruta} por debajo del umbral, repitiendo la medición`);
      puntuaciones = auditar(ruta);
    }

    const resumen = Object.entries(puntuaciones)
      .map(([id, valor]) => `${id} ${valor}`)
      .join('  ');
    console.log(`${ruta.padEnd(6)} ${resumen}`);

    for (const [categoria, minimo] of porDebajo(puntuaciones)) {
      console.error(`  ✗ ${ruta} · ${categoria}: ${puntuaciones[categoria]} (mínimo ${minimo})`);
      fallos++;
    }
  }
} finally {
  servidor.kill();
}

if (fallos > 0) {
  console.error(`\n${fallos} categoría(s) por debajo del umbral.`);
  process.exit(1);
}

console.log('\nTodas las categorías cumplen el umbral.');
