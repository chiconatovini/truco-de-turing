/**
 * @file Testes de unidade do truco (truco.js) e dos oponentes (oponentes/comum.js,
 * estrategias.js e index.js).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ESCADA_TRUCO, GRITO_TRUCO, novaPartida, proximoValor, ehMaoDeOnze, podeTrucar, pedirTruco, responderTruco, marcarTentos, proximaMao,
} from '../../src/nucleo/truco.js';
import {
  cartasOcultas, determinizar, pontosEsperadosPorCamada, avaliar, agruparEquivalentes, concretizar, simularAteOFim, chanceDeVitoria,
} from '../../src/nucleo/oponentes/comum.js';
import { jogadaAleatoria, jogadaGulosa, jogadaMonteCarlo } from '../../src/nucleo/oponentes/estrategias.js';
import { OPONENTES, escolherJogada, querTrucar, responderAoTruco } from '../../src/nucleo/oponentes/index.js';
import { novaMao, jogadasLegais, copiarMao } from '../../src/nucleo/partida.js';
import { maoNova, maoJogada, maoAteOFim } from '../apoio/estados.js';

/** Confere que a jogada é uma das legais (comparando os campos essenciais). */
function ehLegal(mao, j, jogada) {
  const chave = (x) => [x.tipo, x.neuronio || '', (x.cartas || []).join(), x.n || '', (x.pagamento || []).join(), x.carta || ''].join('|');
  return jogadasLegais(mao, j, { comDropout: true }).map(chave).includes(chave(jogada));
}

describe('truco.js', () => {
  it('escada 1-3-6-9-12 e gritos', () => {
    assert.deepEqual(ESCADA_TRUCO, [1, 3, 6, 9, 12]);
    assert.equal(GRITO_TRUCO[3], 'TRUCO!');
    assert.equal(proximoValor(1), 3);
    assert.equal(proximoValor(12), null);
    assert.equal(proximoValor(7), null);
  });
  it('novaPartida e proximaMao zeram o valor e o pedido', () => {
    const p = novaPartida(12);
    assert.deepEqual(p.tentos, [0, 0]);
    p.valor = 6; p.aumentadoPor = 0; p.pedido = { por: 0, para: 9 };
    proximaMao(p);
    assert.equal(p.numeroMao, 1);
    assert.equal(p.valor, 1);
    assert.equal(p.pedido, null);
  });
  it('podeTrucar: não em mão única, não com pedido aberto, não quem aumentou por último, não na mão de onze', () => {
    assert.equal(podeTrucar(novaPartida(1), 0), false);
    const p = novaPartida(12);
    assert.ok(podeTrucar(p, 0));
    assert.ok(pedirTruco(p, 0));
    assert.equal(pedirTruco(p, 1), false);
    responderTruco(p, 1, 'aceitar');
    assert.equal(podeTrucar(p, 0), false);
    assert.equal(podeTrucar(p, 1), true);
    p.valor = 12; p.aumentadoPor = -1;
    assert.equal(podeTrucar(p, 1), false);
  });
  it('responderTruco: aceitar sobe o valor; aumentar devolve o pedido; correr entrega o valor atual', () => {
    const p = novaPartida(12);
    assert.equal(responderTruco(p, 1, 'aceitar'), null); /* sem pedido */
    pedirTruco(p, 0);
    assert.deepEqual(responderTruco(p, 1, 'aumentar'), { maoEncerrada: false });
    assert.equal(p.valor, 3);
    assert.deepEqual(p.pedido, { por: 1, para: 6 });
    assert.deepEqual(responderTruco(p, 0, 'correr'), { maoEncerrada: true, vencedor: 1, pontos: 3 });
  });
  it('marcarTentos, fim da partida e mão de onze', () => {
    const p = novaPartida(12);
    assert.equal(marcarTentos(p, 1, 11), 11);
    assert.ok(ehMaoDeOnze(p));
    assert.equal(marcarTentos(p, 1, null), 1);
    assert.ok(p.encerrada);
    assert.equal(p.vencedor, 1);
    assert.equal(p.tentos[1], 12);
  });
});

describe('oponentes/comum.js', () => {
  it('cartasOcultas: neurônios virados, mão do outro e limbo', () => {
    const mao = maoNova();
    const ocultas = cartasOcultas(mao, 0);
    assert.equal(ocultas.length, 32 + 5 + 10);
    assert.ok(!ocultas.some((c) => mao.jogadores[0].mao.includes(c)));
  });
  it('determinizar: mantém o que j vê e redistribui o resto', () => {
    const mao = maoJogada(5), j = mao.vez, copia = determinizar(mao, j);
    assert.deepEqual(copia.jogadores[j].mao, mao.jogadores[j].mao);
    for (const id of mao.jogadores[0].caminho) assert.deepEqual(copia.neuronios[id].cartas, mao.neuronios[id].cartas);
    assert.equal(copia.simulacao, true);
  });
  it('pontosEsperadosPorCamada: um número positivo', () => {
    const e = pontosEsperadosPorCamada(maoNova(), 0);
    assert.ok(e > 0 && e < 14);
  });
  it('avaliar: ±1000 no fim, vantagem projetada durante a mão', () => {
    const fim = maoAteOFim();
    const v = fim.resultado.vencedor;
    assert.ok(avaliar(fim, v, 5) >= 1000);
    assert.ok(avaliar(fim, 1 - v, 5) <= -1000);
    assert.equal(typeof avaliar(maoNova(), 0, 5), 'number');
  });
  it('agruparEquivalentes e concretizar: ativações desconhecidas da mesma camada viram uma jogada com alternativas', () => {
    const mao = maoNova(), j = mao.vez;
    const grupos = agruparEquivalentes(mao, jogadasLegais(mao, j));
    const ativar = grupos.find((x) => x.tipo === 'ativar');
    assert.equal(ativar.alternativas.length, 3);
    const concreta = concretizar(ativar);
    assert.ok(ativar.alternativas.includes(concreta.neuronio));
    assert.equal(concreta.alternativas, undefined);
    assert.deepEqual(concretizar({ tipo: 'passar', jogador: 0 }), { tipo: 'passar', jogador: 0 });
  });
  it('simularAteOFim e chanceDeVitoria', () => {
    const copia = copiarMao(maoNova());
    simularAteOFim(copia);
    assert.equal(copia.fase, 'fim');
    const c = chanceDeVitoria(maoJogada(6), 0, 10);
    assert.ok(c >= 0 && c <= 1);
    assert.equal(chanceDeVitoria(novaMao({ semente: 1, jogadores: [{ nome: 'a' }, { nome: 'b' }] }), 0, 5), 0.5);
    const fim = maoAteOFim();
    assert.equal(chanceDeVitoria(fim, fim.resultado.vencedor, 5), 1);
  });
});

describe('oponentes/estrategias.js', () => {
  it('jogadaAleatoria, jogadaGulosa e jogadaMonteCarlo devolvem jogadas legais', () => {
    for (let passos = 0; passos < 12; passos += 3) {
      const mao = maoJogada(passos), j = mao.vez;
      if (mao.fase !== 'jogo') continue;
      assert.ok(ehLegal(mao, j, jogadaAleatoria(mao, j)), 'aleatória');
      assert.ok(ehLegal(mao, j, jogadaGulosa(mao, j)), 'gulosa');
      const mc = jogadaMonteCarlo(mao, j, 30);
      if (mc.simulacao) { assert.ok(mc.simulacao.partidas > 0 && mc.simulacao.taxaDeVitoria >= 0); delete mc.simulacao; }
      assert.ok(ehLegal(mao, j, mc), 'Monte Carlo');
    }
  });
  it('Monte Carlo com uma jogada só devolve direto', () => {
    const mao = maoNova(), j = mao.vez;
    mao.camadas[0].forEach((n) => { n.dono = 9; });
    assert.equal(jogadaMonteCarlo(mao, j, 10).tipo, 'passar');
  });
});

describe('oponentes/index.js', () => {
  it('três perfis com nome, nível, método, avatar e estilo', () => {
    assert.deepEqual(Object.keys(OPONENTES), ['aleatorio', 'guloso', 'montecarlo']);
    for (const o of Object.values(OPONENTES)) assert.ok(o.nome && o.nivel && o.metodo && o.avatar && o.estilo);
  });
  it('escolherJogada: carta de início por perfil e jogada por estratégia', () => {
    for (const inicio of ['revela-volta', 'revela-descarta']) {
      const mao = novaMao({ semente: 3, inicio, jogadores: [{ nome: 'a' }, { nome: 'b', tipo: 'oponente', oponente: 'guloso' }] });
      const x = escolherJogada(mao, 1);
      assert.equal(x.tipo, 'inicio');
      assert.ok(mao.jogadores[1].mao.some((c) => c.id === x.carta));
    }
    for (const perfil of ['aleatorio', 'guloso', 'montecarlo']) {
      const mao = maoNova({ jogadores: [{ nome: 'a', tipo: 'oponente', oponente: perfil }, { nome: 'b', tipo: 'oponente', oponente: perfil }] });
      assert.ok(ehLegal(mao, mao.vez, (({ simulacao, ...x }) => x)(escolherJogada(mao, mao.vez, 20))));
    }
  });
  it('querTrucar e responderAoTruco: respostas válidas para cada perfil', (t) => {
    const mao = maoJogada(8);
    assert.equal(querTrucar(novaMao({ semente: 1, jogadores: [{ nome: 'a' }, { nome: 'b' }] }), 0, 'guloso'), false);
    for (const aleatorio of [0.01, 0.5, 0.99]) {
      t.mock.method(Math, 'random', () => aleatorio);
      for (const perfil of ['aleatorio', 'guloso', 'montecarlo']) {
        assert.equal(typeof querTrucar(mao, 0, perfil), 'boolean');
        for (const pode of [true, false]) assert.ok(['aceitar', 'correr', 'aumentar'].includes(responderAoTruco(mao, 0, perfil, 3, pode)));
      }
      t.mock.restoreAll();
    }
  });
});
