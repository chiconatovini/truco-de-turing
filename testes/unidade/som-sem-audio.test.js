/**
 * @file Navegador sem WebAudio: o som e a música ficam em silêncio, sem erros.
 */
import { it } from 'node:test';
import assert from 'node:assert/strict';
import { instalarNavegadorFalso } from '../apoio/ambiente.js';

instalarNavegadorFalso();
globalThis.AudioContext = undefined;
window.AudioContext = undefined;
const { Som, contextoDeAudio } = await import('../../src/interface/som.js');
const { Musica } = await import('../../src/interface/musica.js');

it('sem WebAudio: efeitos e música não tocam e não quebram', () => {
  assert.equal(contextoDeAudio(), null);
  assert.doesNotThrow(() => { Som.golpe(); Som.explosao(); Som.truco(3); Som.fanfarra(); });
  Musica.tocar('oceano');
  assert.equal(Musica.tocando(), false);
});
