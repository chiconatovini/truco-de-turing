/**
 * @file Testes de unidade da pontuação (pontuacao.js): valores, tunagem, combos de figuras,
 * vanishing gradient, terrenos e baralho Fraternidade.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { pontuarRede, mediaDePontos } from '../../src/nucleo/pontuacao.js';
import { redeCom } from '../apoio/estados.js';

describe('pontuarRede', () => {
  it('rede vazia vale 0', () => {
    const mao = redeCom([]);
    assert.deepEqual(pontuarRede(mao, 0), { total: 0, neuronios: [], combos: [], vanishing: false });
  });
  it('exemplo do enunciado: 8-K-K-3 com tunagem num K soma 41 (trio + tunagem)', () => {
    const p = pontuarRede(redeCom([[['8', 'O']], [['K', 'E'], ['K', 'C']], [['K', 'P']], [['3', 'O']]]), 0);
    assert.equal(p.total, 41);
    assert.equal(p.combos[0].quantidade, 3);
    assert.match(p.combos[0].rotulo, /Trio/);
  });
  it('par de figuras vizinhas vale +10', () => {
    const p = pontuarRede(redeCom([[['Q', 'O']], [['Q', 'E']], [['2', 'C']]]), 0);
    assert.equal(p.total, 12);
    assert.match(p.combos[0].rotulo, /Par/);
  });
  it('quatro Reis vizinhos (contando os empilhados) zeram a rede: vanishing gradient', () => {
    const p = pontuarRede(redeCom([[['8', 'O']], [['K', 'E'], ['K', 'C']], [['K', 'P']], [['K', 'O']]]), 0);
    assert.equal(p.total, 0);
    assert.ok(p.vanishing);
  });
  it('tunagem numérica soma todas as cartas da pilha', () => {
    const p = pontuarRede(redeCom([[['5', 'O']], [['7', 'E'], ['7', 'C']]]), 0);
    assert.equal(p.total, 19);
    assert.ok(p.neuronios[1].notas.some((n) => /tunado/.test(n)));
  });
  it('montanha: cada camada tira 1 ponto', () => {
    const p = pontuarRede(redeCom([[['5', 'O']], [['5', 'E']], [['5', 'C']]], { terreno: 'montanha' }), 0);
    assert.equal(p.total, 5 + 4 + 3);
  });
  it('pântano: neurônio sem tunagem afunda 1 por rodada', () => {
    const mao = redeCom([[['9', 'O']]], { terreno: 'pantano' });
    mao.rodada = 4;
    assert.equal(pontuarRede(mao, 0).total, 6);
    mao.jogadores[0].congelada = { rodada: 2, vento: null }; /* rede finalizada congela */
    assert.equal(pontuarRede(mao, 0).total, 8);
  });
  it('oceano: naipe do vento vale dobro', () => {
    const mao = redeCom([[['6', 'O']], [['6', 'E']]], { terreno: 'oceano' });
    mao.vento = 'O';
    assert.equal(pontuarRede(mao, 0).total, 18);
  });
  it('fraternidade: vizinhos do mesmo naipe valem dobro', () => {
    const p = pontuarRede(redeCom([[['3', 'O']], [['4', 'O']], [['5', 'E']]], { baralho: 'fraternidade' }), 0);
    assert.equal(p.total, 6 + 8 + 5);
  });
});

describe('mediaDePontos', () => {
  it('média dos pontos de uma lista de cartas (0 para lista vazia)', () => {
    const mao = redeCom([]);
    assert.equal(mediaDePontos(mao, [{ valor: '2', naipe: 'O' }, { valor: '4', naipe: 'E' }]), 3);
    assert.equal(mediaDePontos(mao, []), 0);
  });
});
