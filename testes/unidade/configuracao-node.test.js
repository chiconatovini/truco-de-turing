/**
 * @file Configuração fora do navegador (sem location nem screen): usa os valores padrão.
 */
import { it } from 'node:test';
import assert from 'node:assert/strict';

globalThis.screen = {};
const c = await import('../../src/configuracao.js');

it('fora do navegador: resolução 1 e Canvas não forçado', () => {
  assert.equal(c.RESOLUCAO, 1);
  assert.equal(c.FORCAR_CANVAS, false);
});
