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

  for (const ruta of RUTAS) {
    const puntuaciones = auditar(ruta);
    const resumen = Object.entries(puntuaciones)
      .map(([id, valor]) => `${id} ${valor}`)
      .join('  ');
    console.log(`${ruta.padEnd(6)} ${resumen}`);

    for (const [categoria, minimo] of Object.entries(MINIMOS)) {
      const valor = puntuaciones[categoria];
      if (valor === undefined) continue;
      if (valor < minimo) {
        console.error(`  ✗ ${ruta} · ${categoria}: ${valor} (mínimo ${minimo})`);
        fallos++;
      }
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
