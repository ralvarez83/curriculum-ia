import { test, expect } from '@playwright/test';
import es from '../../src/i18n/es.json' with { type: 'json' };
import en from '../../src/i18n/en.json' with { type: 'json' };

/**
 * Que los dos diccionarios tengan la misma forma no puede depender de que
 * TypeScript se queje por casualidad: si se añade una clave sólo en uno, el
 * idioma que falte se rompe en silencio. Aquí se compara la estructura, no el
 * contenido, que por definición es distinto.
 */
function rutasDeClaves(valor: unknown, prefijo = ''): string[] {
  if (Array.isArray(valor)) {
    // En las listas importa la forma de sus elementos, no cuántos hay: una
    // persona puede tener más experiencias en un idioma que en otro.
    return valor.length > 0 ? rutasDeClaves(valor[0], `${prefijo}[]`) : [prefijo];
  }

  if (valor !== null && typeof valor === 'object') {
    return Object.entries(valor as Record<string, unknown>)
      .flatMap(([clave, v]) => rutasDeClaves(v, prefijo ? `${prefijo}.${clave}` : clave))
      .sort();
  }

  return [prefijo];
}

test.describe('diccionarios de idioma', () => {
  test('es y en tienen exactamente las mismas claves', () => {
    const enEs = rutasDeClaves(es);
    const enEn = rutasDeClaves(en);

    const soloEnEs = enEs.filter((k) => !enEn.includes(k));
    const soloEnEn = enEn.filter((k) => !enEs.includes(k));

    expect(soloEnEs, 'claves que sólo están en es.json').toEqual([]);
    expect(soloEnEn, 'claves que sólo están en en.json').toEqual([]);
  });

  test('ningún texto se ha quedado sin traducir', () => {
    const vacios: string[] = [];

    function recorrer(valor: unknown, ruta: string) {
      if (typeof valor === 'string') {
        if (valor.trim() === '') vacios.push(ruta);
        return;
      }
      if (Array.isArray(valor)) {
        valor.forEach((v, i) => recorrer(v, `${ruta}[${i}]`));
        return;
      }
      if (valor !== null && typeof valor === 'object') {
        for (const [clave, v] of Object.entries(valor as Record<string, unknown>)) {
          recorrer(v, ruta ? `${ruta}.${clave}` : clave);
        }
      }
    }

    // La empresa puede ir vacía a propósito en "Experiencias anteriores".
    const permitidos = /^experience\[\d+\]\.company$/;

    recorrer(es, '');
    recorrer(en, '');

    expect(vacios.filter((r) => !permitidos.test(r))).toEqual([]);
  });
});
