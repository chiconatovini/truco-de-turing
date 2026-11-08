/**
 * @file Testes das regras do núcleo (sem navegador). Uso: node ferramentas/testar.js
 */
import assert from 'node:assert/strict';
import { novaMao, aplicarJogada, jogadasLegais, efeitoDoEmpilhamento } from '../src/nucleo/partida.js';
import { pontuarRede } from '../src/nucleo/pontuacao.js';
import { pontosDaCarta } from '../src/nucleo/baralhos.js';
import { novaPartida, pedirTruco, responderTruco, marcarTentos, podeTrucar, ehMaoDeOnze } from '../src/nucleo/truco.js';

let aprovados = 0;
/** Roda um teste e mostra o resultado. */
function teste(nome, corpo) {
  corpo();
  aprovados++;
  console.log('ok  ', nome);
}

/** Monta uma mão e força o caminho do jogador 0 com as cartas dadas (uma lista por camada). */
function redeCom(pilhas, opcoes = {}) {
  const mao = novaMao({ semente: 1, inicio: 'sorteio', ...opcoes, jogadores: [{ nome: 'A' }, { nome: 'B' }] });
  mao.jogadores[0].caminho = pilhas.map((cartas, camada) => {
    const n = mao.camadas[camada][0];
    n.cartas = cartas.map(([valor, naipe]) => ({ id: valor + naipe, valor, naipe }));
    n.revelado = true; n.dono = 0;
    return n.id;
  });
  return mao;
}

teste('exemplo do enunciado: 8-K-K-3 com tunagem num K soma 41', () => {
  const mao = redeCom([[['8', 'O']], [['K', 'E'], ['K', 'C']], [['K', 'P']], [['3', 'O']]]);
  const p = pontuarRede(mao, 0);
  assert.equal(p.total, 41);
  assert.equal(p.combos[0].quantidade, 3);
});

teste('quatro Reis vizinhos (contando empilhados) zeram a rede', () => {
  const mao = redeCom([[['8', 'O']], [['K', 'E'], ['K', 'C']], [['K', 'P']], [['K', 'O']]]);
  const p = pontuarRede(mao, 0);
  assert.equal(p.total, 0);
  assert.ok(p.vanishing);
});

teste('valores das cartas: Ás 11, figuras 0, Zap 12 no baralho de truco', () => {
  assert.equal(pontosDaCarta({ valor: 'A', naipe: 'C' }, 'classico'), 11);
  assert.equal(pontosDaCarta({ valor: 'Q', naipe: 'C' }, 'classico'), 0);
  assert.equal(pontosDaCarta({ valor: '4', naipe: 'P' }, 'truco'), 12);
});

teste('efeito do empilhamento pelo tamanho final da pilha', () => {
  const mao = redeCom([[['8', 'O']], [['5', 'E']]]);
  const n = mao.neuronios[mao.jogadores[0].caminho[1]];
  assert.equal(efeitoDoEmpilhamento(mao, 0, n, 1).tipo, 'tunagem');
  assert.equal(efeitoDoEmpilhamento(mao, 1, n, 1).tipo, 'overfit');
  assert.equal(efeitoDoEmpilhamento(mao, 1, n, 2).tipo, 'earlystop');
  assert.equal(efeitoDoEmpilhamento(mao, 1, n, 3).tipo, 'stackoverflow');
});

teste('dropout não gasta o turno', () => {
  const mao = novaMao({ semente: 3, inicio: 'sorteio', jogadores: [{ nome: 'A' }, { nome: 'B' }] });
  for (let i = 0; i < 4; i++) {
    const j = mao.vez;
    aplicarJogada(mao, jogadasLegais(mao, j).find((x) => x.tipo === 'ativar'));
  }
  const j = mao.vez;
  const pagamento = [mao.jogadores[j].mao[0].id];
  aplicarJogada(mao, { tipo: 'dropout', jogador: j, n: 1, pagamento });
  assert.equal(mao.vez, j);
  assert.equal(mao.jogadores[j].dropouts, 1);
});

teste('truco: pedir, aumentar, correr e mão de onze', () => {
  const partida = novaPartida(12);
  assert.ok(pedirTruco(partida, 0));
  responderTruco(partida, 1, 'aumentar');
  assert.equal(partida.valor, 3);
  assert.deepEqual(partida.pedido, { por: 1, para: 6 });
  const r = responderTruco(partida, 0, 'correr');
  assert.equal(r.vencedor, 1);
  assert.equal(r.pontos, 3);
  marcarTentos(partida, 1, 11);
  assert.ok(ehMaoDeOnze(partida));
  assert.equal(podeTrucar(partida, 0), false);
});

console.log(`\n${aprovados} testes aprovados.`);
