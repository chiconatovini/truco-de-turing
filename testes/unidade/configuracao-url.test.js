/**
 * @file Configuração forçada pela URL: `?res=` limita a resolução e `?renderer=canvas` força o
 * renderizador Canvas.
 */
import { it } from 'node:test';
import assert from 'node:assert/strict';
import { instalarNavegadorFalso } from '../apoio/ambiente.js';

instalarNavegadorFalso({ url: 'http://localhost/?res=9&renderer=canvas' });
const c = await import('../../src/configuracao.js');

it('?res= é limitado a 3 e ?renderer=canvas força o Canvas', () => {
  assert.equal(c.RESOLUCAO, 3);
  assert.equal(c.FORCAR_CANVAS, true);
});
