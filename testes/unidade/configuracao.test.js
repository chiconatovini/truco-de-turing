/**
 * @file Configuração numa tela comum (1280×720, densidade de pixels 2): resolução, densidades e
 * tamanhos das cartas.
 */
import { it } from 'node:test';
import assert from 'node:assert/strict';
import { instalarNavegadorFalso } from '../apoio/ambiente.js';

instalarNavegadorFalso({ largura: 1280, altura: 720 });
const c = await import('../../src/configuracao.js');

it('resolução pela tela × densidade, densidades das texturas e sem forçar Canvas', () => {
  assert.equal(c.RESOLUCAO, 2);
  assert.deepEqual(c.MUNDO, { largura: 1280, altura: 720 });
  assert.equal(c.DENSIDADE.inspecao, 1.9);
  assert.ok(c.TAMANHO_CARTA.maoL > c.TAMANHO_CARTA.mesaL);
  assert.equal(c.FORCAR_CANVAS, false);
  assert.ok(c.CORES.j0 && c.CORES_CSS.j1 && c.FONTES.titulo);
});
