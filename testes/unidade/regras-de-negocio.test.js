/**
 * @file Testes de aceitação das regras de negócio (especificação do tema 4, FPO 2026/2).
 *
 * Cada teste tem um identificador RN-xx, o mesmo usado na planilha
 * `relatorios/validacao/testes-regras-de-negocio.xlsx`, e um comentário com:
 *   Cenário:  a situação montada na mesa;
 *   Regra:    o que o enunciado (ou a leitura adotada no README) determina;
 *   Esperado: o resultado verificado.
 *
 * Quando o enunciado deixa margem, o teste fixa a leitura adotada no README ("Leitura adotada")
 * para que qualquer mudança de interpretação apareça como teste vermelho, de propósito.
 *
 * Rodar: npm run testar   (ou: node --test testes/unidade/regras-de-negocio.test.js)
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  novaMao, aplicarJogada, jogadasLegais, fronteira, alvosDeEmpilhamento, podeEmpilhar, valorParaTransfer,
} from '../../src/nucleo/partida.js';
import { pontuarRede } from '../../src/nucleo/pontuacao.js';
import { novaPartida, pedirTruco, responderTruco, podeTrucar, marcarTentos, ehMaoDeOnze } from '../../src/nucleo/truco.js';
import { TAMANHOS_CAMADAS } from '../../src/nucleo/rede.js';
import { JOGADORES, maoNova, redeCom } from '../apoio/estados.js';

/* ======================================================================== auxiliares */

const NAIPES = ['E', 'C', 'P', 'O'];
let proximoId = 0;

/** Carta com id único: carta('K', 'O') = Rei de Ouros. */
const carta = (valor, naipe = 'E') => ({ id: 'RN' + valor + naipe + '#' + (proximoId++), valor, naipe });

/** Soma da rede do jogador 0 montada camada a camada; cada camada é 'K' ou 'K+K' (carta + tunagens). */
function soma(...camadas) {
  const pilhas = camadas.map((c) => c.split('+').map((valor, i) => [valor, NAIPES[i % 4]]));
  return pontuarRede(redeCom(pilhas), 0).total;
}

/** Quem está na vez ativa o primeiro neurônio livre; sem neurônio livre, passa. */
function jogarUmaVez(mao) {
  const j = mao.vez;
  const ativacao = jogadasLegais(mao, j).find((x) => x.tipo === 'ativar');
  aplicarJogada(mao, ativacao || { tipo: 'passar', jogador: j });
}

/** Faz `n` ativações alternadas a partir de uma mão nova (início por sorteio). */
function maoAvancada(n, opcoes = {}) {
  const mao = maoNova(opcoes);
  for (let i = 0; i < n; i++) jogarUmaVez(mao);
  return mao;
}

/** Encerra a mão com as duas redes vazias (soma 0 x 0), para decidir só pelos desempates. */
function desempate(mao0, mao1, { dropouts = [0, 0], primeiro = 0 } = {}) {
  const mao = maoNova();
  mao.jogadores.forEach((j, i) => { j.situacao = 'concluida'; j.caminho = []; j.dropouts = dropouts[i]; });
  mao.jogadores[0].mao = mao0;
  mao.jogadores[1].mao = mao1;
  mao.primeiro = primeiro;
  aplicarJogada(mao, { tipo: 'passar', jogador: mao.vez });
  return mao.resultado;
}

/** Mão de quatro cartas iguais à carta de cima do neurônio, mais uma qualquer. */
const iguaisA = (neuronio, quantas) => Array.from({ length: quantas }, (_, i) => carta(neuronio.cartas[0].valor, NAIPES[i % 4]));

/* ======================================================================== preparação */

describe('Preparação da mesa', () => {
  it('RN-01 mesa 3-5-5-5-5-5-4 virada, 5 cartas na mão de cada jogador e 10 no limbo (52 no total)', () => {
    // Cenário: mão nova com o baralho clássico.
    // Regra: 32 neurônios virados para baixo e sem dono; 5 cartas para cada jogador; 10 no limbo.
    const mao = maoNova();
    assert.deepEqual(mao.camadas.map((c) => c.length), TAMANHOS_CAMADAS);
    const neuronios = mao.camadas.flat();
    assert.equal(neuronios.length, 32);
    assert.ok(neuronios.every((n) => !n.revelado && n.dono === -1 && n.cartas.length === 1));
    assert.deepEqual(mao.jogadores.map((j) => j.mao.length), [5, 5]);
    assert.equal(mao.limbo.length, 10);
    const ids = [...neuronios.map((n) => n.cartas[0].id), ...mao.jogadores.flatMap((j) => j.mao.map((c) => c.id)), ...mao.limbo.map((c) => c.id)];
    assert.equal(new Set(ids).size, 52);
  });
});

describe('Quem começa', () => {
  it('RN-02 opção (a): cada um revela uma carta, a maior começa e as cartas vão para o cemitério', () => {
    // Cenário: início "revela e descarta"; jogador 0 revela Ás, jogador 1 revela Rei.
    // Esperado: jogador 0 começa; cada um fica com 4 cartas; 2 cartas no cemitério.
    const mao = novaMao({ semente: 3, inicio: 'revela-descarta', jogadores: JOGADORES });
    mao.jogadores[0].mao[0] = carta('A', 'O');
    mao.jogadores[1].mao[0] = carta('K', 'E');
    for (const j of [0, 1]) aplicarJogada(mao, { tipo: 'inicio', jogador: j, carta: mao.jogadores[j].mao[0].id });
    assert.equal(mao.vez, 0);
    assert.deepEqual(mao.jogadores.map((j) => j.mao.length), [4, 4]);
    assert.equal(mao.cemiterio.length, 2);
  });

  it('RN-03 opção (b): a maior começa e as cartas reveladas voltam para a mão', () => {
    // Cenário: início "revela e volta"; jogador 0 revela Rei de Copas, jogador 1 revela Rei de Espadas.
    // Regra: valores iguais desempatam pelo naipe (♠ > ♥ > ♣ > ♦).
    // Esperado: jogador 1 começa; os dois continuam com 5 cartas; cemitério vazio.
    const mao = novaMao({ semente: 3, inicio: 'revela-volta', jogadores: JOGADORES });
    mao.jogadores[0].mao[0] = carta('K', 'C');
    mao.jogadores[1].mao[0] = carta('K', 'E');
    for (const j of [0, 1]) aplicarJogada(mao, { tipo: 'inicio', jogador: j, carta: mao.jogadores[j].mao[0].id });
    assert.equal(mao.vez, 1);
    assert.deepEqual(mao.jogadores.map((j) => j.mao.length), [5, 5]);
    assert.equal(mao.cemiterio.length, 0);
  });

  it('RN-04 opção (c): par ou ímpar sorteia quem começa e a mão já está em jogo', () => {
    const mao = maoNova();
    assert.equal(mao.fase, 'jogo');
    assert.ok([0, 1].includes(mao.vez));
  });

  it('RN-05 força das cartas para começar: Ás > K > Q > J > 10 … 2', () => {
    // Cenário: jogador 0 revela Rei de Ouros, jogador 1 revela Dez de Espadas.
    // Esperado: o Rei vence, mesmo com naipe mais fraco (o naipe só desempata valores iguais).
    const mao = novaMao({ semente: 3, inicio: 'revela-volta', jogadores: JOGADORES });
    mao.jogadores[0].mao[0] = carta('K', 'O');
    mao.jogadores[1].mao[0] = carta('10', 'E');
    for (const j of [0, 1]) aplicarJogada(mao, { tipo: 'inicio', jogador: j, carta: mao.jogadores[j].mao[0].id });
    assert.equal(mao.vez, 0);
  });
});

/* ======================================================================== construção da rede */

describe('Construção da rede', () => {
  it('RN-06 um neurônio por camada, só na próxima camada, e cada neurônio tem um único dono', () => {
    // Cenário: o primeiro jogador ativa um neurônio da entrada.
    // Esperado: o rival não pode ativar o mesmo neurônio nem pular para a Oculta 2; pode ativar outro da entrada.
    const mao = maoNova();
    const p = mao.vez;
    aplicarJogada(mao, { tipo: 'ativar', jogador: p, neuronio: 'C0N0' });
    const q = mao.vez;
    assert.notEqual(q, p);
    assert.throws(() => aplicarJogada(mao, { tipo: 'ativar', jogador: q, neuronio: 'C0N0' }));
    assert.throws(() => aplicarJogada(mao, { tipo: 'ativar', jogador: q, neuronio: 'C2N0' }));
    aplicarJogada(mao, { tipo: 'ativar', jogador: q, neuronio: 'C0N1' });
    assert.equal(mao.neuronios.C0N0.dono, p);
    assert.equal(mao.neuronios.C0N1.dono, q);
    assert.ok(mao.neuronios.C0N0.revelado);
  });

  it('RN-07 ao chegar à camada de saída a rede está concluída, com 7 neurônios', () => {
    // Cenário: os dois jogadores só ativam neurônios até o fim.
    // Esperado: as duas redes concluídas, cada uma com um neurônio por camada, e a mão encerrada.
    const mao = maoNova();
    for (let i = 0; i < 40 && mao.fase === 'jogo'; i++) jogarUmaVez(mao);
    assert.equal(mao.fase, 'fim');
    for (const j of mao.jogadores) {
      assert.equal(j.situacao, 'concluida');
      assert.deepEqual(j.caminho.map((id) => mao.neuronios[id].camada), [0, 1, 2, 3, 4, 5, 6]);
    }
  });
});

/* ======================================================================== pontuação */

describe('Pontuação (baralho clássico)', () => {
  it('RN-08 números valem o valor, Ás vale 11 e figura isolada vale 0', () => {
    // Cenário: rede Ás - 5 - Rei.  Esperado: 11 + 5 + 0 = 16.
    assert.equal(soma('A', '5', 'K'), 16);
  });

  it('RN-09 par de figuras iguais em camadas vizinhas vale 10 no total', () => {
    // Cenário: rede 2 - K - K - 2.  Esperado: 2 + 10 (par) + 2 = 14.
    assert.equal(soma('2', 'K', 'K', '2'), 14);
  });

  it('RN-10 trio de figuras iguais vizinhas vale 20', () => {
    // Cenário: rede 2 - K - K - K - 2.  Esperado: 2 + 20 (trio) + 2 = 24.
    assert.equal(soma('2', 'K', 'K', 'K', '2'), 24);
  });

  it('RN-11 figuras iguais não vizinhas, ou vizinhas e diferentes, não pontuam', () => {
    // Cenários: 2 - K - 5 - K - 2 (Reis separados) e 2 - K - Q - 2 (figuras diferentes).
    assert.equal(soma('2', 'K', '5', 'K', '2'), 9);
    assert.equal(soma('2', 'K', 'Q', '2'), 4);
  });

  it('RN-12 quadra de figuras iguais vizinhas zera a rede inteira (vanishing gradient)', () => {
    // Cenário: rede 2 - K - K - K - K - 2.  Esperado: 0.
    assert.equal(soma('2', 'K', 'K', 'K', 'K', '2'), 0);
    assert.equal(pontuarRede(redeCom([[['2', 'E']], [['K', 'E']], [['K', 'C']], [['K', 'P']], [['K', 'O']]]), 0).vanishing, true);
  });

  it('RN-13 exemplo do enunciado: 8-K-K-3 vale 21; com tunagem num K vale 41', () => {
    // Regra (leitura adotada): figuras empilhadas contam para o combo.
    // Com tunagem: K(2 cartas) + K = três Reis vizinhos = trio (20) + tunagem (10): 8 + 20 + 10 + 3 = 41.
    assert.equal(soma('8', 'K', 'K', '3'), 21);
    assert.equal(soma('8', 'K+K', 'K', '3'), 41);
  });

  it('RN-14 tunar os dois Reis de um par forma quadra e zera a rede', () => {
    // Cenário: 2 - K+K - K+K - 2 (leitura adotada: empilhadas contam).  Esperado: 0.
    assert.equal(soma('2', 'K+K', 'K+K', '2'), 0);
  });

  it('RN-15 tunagem numérica soma o valor da carta empilhada; em figura isolada soma 10', () => {
    // Cenários: 2 - 6+6 - 2 = 16;  2 - K+K - 2 = 14 (Rei isolado tunado).
    assert.equal(soma('2', '6+6', '2'), 16);
    assert.equal(soma('2', 'K+K', '2'), 14);
  });
});

/* ======================================================================== ações com cartas */

describe('Ações com cartas da mão', () => {
  it('RN-16 entrada e saída são imunes: só a fronteira em camada oculta aceita cartas', () => {
    // Cenário: os dois jogadores só ativaram a entrada.  Esperado: nenhum alvo para empilhar.
    const mao = maoAvancada(2);
    assert.deepEqual(alvosDeEmpilhamento(mao), []);
    // Depois de avançarem para a Oculta 1, só as duas fronteiras são alvos.
    jogarUmaVez(mao); jogarUmaVez(mao);
    const alvos = alvosDeEmpilhamento(mao);
    assert.equal(alvos.length, 2);
    assert.ok(alvos.every((n) => n.camada === 1 && n === fronteira(mao, n.dono)));
  });

  it('RN-17 empilhar exige carta de mesmo valor; o naipe não importa', () => {
    // Cenário: fronteira do rival na Oculta 1; jogador da vez com uma carta de mesmo valor (outro naipe) e uma diferente.
    const mao = maoAvancada(4);
    const p = mao.vez, q = 1 - p, alvo = fronteira(mao, q);
    const outroNaipe = NAIPES.find((n) => n !== alvo.cartas[0].naipe);
    const igual = carta(alvo.cartas[0].valor, outroNaipe);
    const diferente = carta(alvo.cartas[0].valor === '2' ? '3' : '2');
    mao.jogadores[p].mao = [igual, diferente];
    assert.equal(podeEmpilhar(mao, p, alvo.id, [igual.id]), true);
    assert.equal(podeEmpilhar(mao, p, alvo.id, [diferente.id]), false);
  });

  it('RN-18 overfit: 1 carta no último neurônio do rival manda o neurônio ao cemitério e a rede dele recua', () => {
    const mao = maoAvancada(4);
    const p = mao.vez, q = 1 - p, alvo = fronteira(mao, q);
    mao.jogadores[p].mao = iguaisA(alvo, 1);
    aplicarJogada(mao, { tipo: 'empilhar', jogador: p, neuronio: alvo.id, cartas: [mao.jogadores[p].mao[0].id] });
    assert.equal(alvo.removido, true);
    assert.equal(mao.jogadores[q].caminho.length, 1); // voltou para a entrada
    assert.equal(mao.jogadores[q].situacao, 'construindo'); // continua jogando
    assert.equal(mao.cemiterio.length, 2); // neurônio + carta usada
  });

  it('RN-19 early stop: pilha de 3 cartas finaliza a rede do rival sem esse neurônio', () => {
    const mao = maoAvancada(4);
    const p = mao.vez, q = 1 - p, alvo = fronteira(mao, q);
    const entrada = mao.neuronios[mao.jogadores[q].caminho[0]];
    mao.jogadores[p].mao = iguaisA(alvo, 2);
    aplicarJogada(mao, { tipo: 'empilhar', jogador: p, neuronio: alvo.id, cartas: mao.jogadores[p].mao.map((c) => c.id) });
    assert.equal(mao.jogadores[q].situacao, 'earlystop');
    assert.equal(mao.jogadores[q].caminho.length, 1);
    assert.equal(pontuarRede(mao, q).total, pontuarRede(redeCom([[[entrada.cartas[0].valor, entrada.cartas[0].naipe]]]), 0).total);
  });

  it('RN-20 neurônio já tunado (2 cartas) sofre early stop com uma única carta do rival', () => {
    // Cenário: o jogador da vez tuna a própria fronteira; na vez seguinte o rival joga 1 carta igual nela.
    const mao = maoAvancada(4);
    const p = mao.vez, q = 1 - p, propria = fronteira(mao, p);
    mao.jogadores[p].mao = iguaisA(propria, 1);
    aplicarJogada(mao, { tipo: 'empilhar', jogador: p, neuronio: propria.id, cartas: [mao.jogadores[p].mao[0].id] });
    assert.equal(propria.cartas.length, 2); // tunagem
    mao.jogadores[q].mao = [carta(propria.cartas[0].valor, 'O')];
    aplicarJogada(mao, { tipo: 'empilhar', jogador: q, neuronio: propria.id, cartas: [mao.jogadores[q].mao[0].id] });
    assert.equal(mao.jogadores[p].situacao, 'earlystop');
  });

  it('RN-21 stack overflow: pilha de 4 finaliza a rede do rival e ele perde toda a mão', () => {
    const mao = maoAvancada(4);
    const p = mao.vez, q = 1 - p, alvo = fronteira(mao, q);
    const maoDoRival = mao.jogadores[q].mao.length;
    mao.jogadores[p].mao = iguaisA(alvo, 3);
    aplicarJogada(mao, { tipo: 'empilhar', jogador: p, neuronio: alvo.id, cartas: mao.jogadores[p].mao.map((c) => c.id) });
    assert.equal(mao.jogadores[q].situacao, 'overflow');
    assert.equal(mao.jogadores[q].mao.length, 0);
    assert.equal(mao.cemiterio.length, 4 + maoDoRival);
  });

  it('RN-22 auto early stop e auto stack overflow: empilhar 2 ou 3 cartas na própria fronteira encerra a própria rede', () => {
    for (const [quantas, situacao] of [[2, 'earlystop'], [3, 'overflow']]) {
      const mao = maoAvancada(4);
      const p = mao.vez, propria = fronteira(mao, p);
      mao.jogadores[p].mao = iguaisA(propria, quantas);
      aplicarJogada(mao, { tipo: 'empilhar', jogador: p, neuronio: propria.id, cartas: mao.jogadores[p].mao.map((c) => c.id) });
      assert.equal(mao.jogadores[p].situacao, situacao);
      assert.equal(mao.jogadores[p].estatisticas.autoParadas, 1);
    }
  });

  it('RN-23 rede finalizada não pode mais ser atacada', () => {
    // Cenário: o rival sofreu early stop.  Esperado: nenhum neurônio dele entre os alvos.
    const mao = maoAvancada(4);
    const p = mao.vez, q = 1 - p, alvo = fronteira(mao, q);
    mao.jogadores[p].mao = iguaisA(alvo, 2);
    aplicarJogada(mao, { tipo: 'empilhar', jogador: p, neuronio: alvo.id, cartas: mao.jogadores[p].mao.map((c) => c.id) });
    assert.ok(alvosDeEmpilhamento(mao).every((n) => n.dono !== q));
  });
});

/* ======================================================================== dropout e transfer learning */

describe('Dropout (GatoNet) e transfer learning', () => {
  it('RN-24 dropout custa uma carta por camada desfeita, não gasta o turno e conta no desempate', () => {
    // Cenário: jogador da vez com 3 camadas (entrada, Oculta 1, Oculta 2) desfaz as 2 ocultas.
    const mao = maoAvancada(6);
    const p = mao.vez, jogador = mao.jogadores[p];
    const pagamento = jogador.mao.slice(0, 2).map((c) => c.id);
    aplicarJogada(mao, { tipo: 'dropout', jogador: p, n: 2, pagamento });
    assert.equal(mao.vez, p);
    assert.equal(jogador.caminho.length, 1);
    assert.equal(jogador.mao.length, 3);
    assert.equal(jogador.dropouts, 2);
    assert.equal(mao.cemiterio.length, 2);
  });

  it('RN-25 o neurônio desfeito volta virado e livre, com valor conhecido; as tunagens vão ao cemitério', () => {
    // Leitura adotada: "reverter" = desvirar a carta e devolvê-la à mesa sem dono.
    // Cenário: o jogador tuna a própria Oculta 1, o rival joga, e o jogador desfaz essa camada.
    const mao = maoAvancada(4);
    const p = mao.vez, neuronio = fronteira(mao, p);
    mao.jogadores[p].mao = [...iguaisA(neuronio, 1), carta('2', 'O'), carta('3', 'O')];
    const tunagem = mao.jogadores[p].mao[0];
    aplicarJogada(mao, { tipo: 'empilhar', jogador: p, neuronio: neuronio.id, cartas: [tunagem.id] });
    jogarUmaVez(mao);
    aplicarJogada(mao, { tipo: 'dropout', jogador: p, n: 1, pagamento: [mao.jogadores[p].mao[0].id] });
    assert.equal(neuronio.removido, false);
    assert.equal(neuronio.revelado, false);
    assert.equal(neuronio.dono, -1);
    assert.equal(neuronio.conhecido, true);
    assert.equal(neuronio.cartas.length, 1);
    assert.ok(mao.cemiterio.some((c) => c.id === tunagem.id));
  });

  it('RN-26 dropout não desfaz a camada de entrada', () => {
    const mao = maoAvancada(6);
    const p = mao.vez, jogador = mao.jogadores[p];
    const pagamento = jogador.mao.slice(0, 3).map((c) => c.id);
    assert.throws(() => aplicarJogada(mao, { tipo: 'dropout', jogador: p, n: 3, pagamento }));
  });

  it('RN-27 transfer learning: quadra na mão troca por cartas do limbo, uma vez por mão, e gasta o turno', () => {
    // Leitura adotada: transfer learning consome o turno.
    const mao = maoNova();
    const p = mao.vez, jogador = mao.jogadores[p];
    jogador.mao = [carta('7', 'E'), carta('7', 'C'), carta('7', 'P'), carta('7', 'O'), carta('2', 'E')];
    const jogada = jogadasLegais(mao, p).find((x) => x.tipo === 'transfer');
    assert.ok(jogada);
    aplicarJogada(mao, jogada);
    assert.notEqual(mao.vez, p);
    assert.equal(jogador.mao.length, 5);
    assert.equal(mao.limbo.length, 6);
    jogador.mao = [carta('9', 'E'), carta('9', 'C'), carta('9', 'P'), carta('9', 'O')];
    assert.equal(valorParaTransfer(mao, p), null); // segunda vez na mesma mão: não pode
  });

  it('RN-28 sem quadra na mão não há transfer learning', () => {
    const mao = maoNova();
    mao.jogadores[mao.vez].mao = [carta('7', 'E'), carta('7', 'C'), carta('7', 'P'), carta('2', 'O')];
    assert.ok(!jogadasLegais(mao, mao.vez).some((x) => x.tipo === 'transfer'));
  });
});

/* ======================================================================== passar e fim da mão */

describe('Passar a vez e fim da mão', () => {
  it('RN-29 com neurônio livre para ativar não é permitido passar', () => {
    const mao = maoNova();
    assert.throws(() => aplicarJogada(mao, { tipo: 'passar', jogador: mao.vez }));
  });

  it('RN-30 rede concluída pode passar mesmo tendo um ataque possível', () => {
    // Leitura adotada: "passar só quando não há neurônio livre para ativar".
    // Observação: outra leitura (só pode passar quem sofreu early stop do rival) está em consulta ao professor.
    const mao = maoAvancada(4);
    const p = mao.vez, q = 1 - p, alvo = fronteira(mao, q);
    mao.jogadores[p].situacao = 'concluida';
    mao.jogadores[p].mao = iguaisA(alvo, 1);
    const tipos = jogadasLegais(mao, p).map((x) => x.tipo);
    assert.ok(tipos.includes('empilhar'));
    assert.ok(tipos.includes('passar'));
    aplicarJogada(mao, { tipo: 'passar', jogador: p });
    assert.equal(mao.vez, q);
  });

  it('RN-31 rede travada (sem neurônio livre na próxima camada) continua aberta e conta a soma parcial', () => {
    // Cenário: um jogador concluiu; a próxima camada do outro ficou sem neurônio livre.
    // Esperado: o travado ainda pode ser atacado; dois passes seguidos encerram a mão.
    const mao = maoAvancada(6);
    const p = mao.vez, q = 1 - p;
    mao.jogadores[p].situacao = 'concluida';
    for (const n of mao.camadas[3]) if (n.dono === -1) n.removido = true;
    aplicarJogada(mao, { tipo: 'passar', jogador: p });
    assert.equal(mao.jogadores[q].situacao, 'construindo');
    assert.ok(alvosDeEmpilhamento(mao).includes(fronteira(mao, q)));
    const parcial = pontuarRede(mao, q).total;
    aplicarJogada(mao, { tipo: 'passar', jogador: q });
    assert.equal(mao.fase, 'fim');
    assert.equal(mao.resultado.travados[q], true);
    assert.equal(mao.resultado.somas[q], parcial);
  });
});

/* ======================================================================== desempates */

describe('Desempates (soma igual)', () => {
  it('RN-32 1º critério: menos dropouts', () => {
    const r = desempate([carta('5', 'O')], [carta('5', 'E')], { dropouts: [1, 0] });
    assert.equal(r.vencedor, 1);
    assert.match(r.motivo, /dropouts/);
  });

  it('RN-33 2º critério: maior soma das N melhores cartas da mão (N = tamanho da menor mão)', () => {
    // Cenário: mãos [10, 2] e [9, 9].  Esperado: 12 x 18, vence o jogador 1.
    const r = desempate([carta('10', 'O'), carta('2', 'P')], [carta('9', 'E'), carta('9', 'C')]);
    assert.equal(r.vencedor, 1);
    assert.match(r.motivo, /melhores cartas/);
  });

  it('RN-34 quem ficou sem cartas na mão perde para quem tem pelo menos uma', () => {
    const r = desempate([], [carta('2', 'O')]);
    assert.equal(r.vencedor, 1);
    assert.match(r.motivo, /sem cartas/);
  });

  it('RN-35 3º critério: carta mais alta da mão, comparada pelos pontos e depois pela força', () => {
    // Leitura adotada: "carta mais alta" = mais pontos (figura vale 0), depois a força (K > Q > J), depois o naipe.
    // Cenário A: [K♦, 3♥] x [3♠, J♠]: somas 3 x 3; carta mais alta 3♥ x 3♠, decide o naipe: vence o jogador 1.
    const a = desempate([carta('K', 'O'), carta('3', 'C')], [carta('3', 'E'), carta('J', 'E')]);
    assert.equal(a.vencedor, 1);
    assert.match(a.motivo, /carta mais alta/);
    // Cenário B: [K♦] x [J♠]: pontos 0 x 0; vence a força do Rei.
    const b = desempate([carta('K', 'O')], [carta('J', 'E')]);
    assert.equal(b.vencedor, 0);
  });

  it('RN-36 último critério: vence quem jogou primeiro', () => {
    // Cenário: mãos idênticas (5♠ x 5♠); o jogador 1 começou a mão.
    const r = desempate([carta('5', 'E')], [carta('5', 'E')], { primeiro: 1 });
    assert.equal(r.vencedor, 1);
    assert.match(r.motivo, /primeiro/);
  });
});

/* ======================================================================== truco */

describe('Camada de truco (partida até 12 tentos)', () => {
  it('RN-37 escada TRUCO (3) → SEIS (6) → NOVE (9) → DOZE (12); correr entrega o valor atual', () => {
    const partida = novaPartida(12);
    assert.equal(pedirTruco(partida, 0), true);
    responderTruco(partida, 1, 'aceitar');
    assert.equal(partida.valor, 3);
    pedirTruco(partida, 1);
    responderTruco(partida, 0, 'aumentar'); // aceita o 6 e pede 9
    assert.equal(partida.valor, 6);
    assert.deepEqual(partida.pedido, { por: 0, para: 9 });
    assert.deepEqual(responderTruco(partida, 1, 'correr'), { maoEncerrada: true, vencedor: 0, pontos: 6 });
  });

  it('RN-38 quem aumentou por último não pede de novo; mão única e mão de onze não têm truco', () => {
    const partida = novaPartida(12);
    pedirTruco(partida, 0);
    responderTruco(partida, 1, 'aceitar');
    assert.equal(podeTrucar(partida, 0), false);
    assert.equal(podeTrucar(partida, 1), true);
    assert.equal(podeTrucar(novaPartida(1), 0), false);
    const onze = novaPartida(12);
    onze.tentos = [11, 4];
    assert.equal(ehMaoDeOnze(onze), true);
    assert.equal(podeTrucar(onze, 0) || podeTrucar(onze, 1), false);
  });

  it('RN-39 a partida termina quando alguém chega a 12 tentos', () => {
    const partida = novaPartida(12);
    partida.tentos = [10, 0];
    marcarTentos(partida, 0, 3);
    assert.equal(partida.tentos[0], 12);
    assert.equal(partida.encerrada, true);
    assert.equal(partida.vencedor, 0);
  });
});

/* ======================================================================== invariantes */

describe('Invariantes em partidas aleatórias', () => {
  it('RN-40 em 200 mãos aleatórias (4 baralhos x 4 terrenos x 3 inícios) nenhuma carta some ou duplica, os donos batem com as redes e toda mão termina', () => {
    // Power BI fica de fora da contagem de cartas porque cria cartas novas por regra.
    const baralhos = ['classico', 'truco', 'fraternidade', 'yinyang'];
    const terrenos = ['neutro', 'montanha', 'pantano', 'oceano'];
    const inicios = ['revela-volta', 'revela-descarta', 'sorteio'];
    let estado = 2026;
    const sortear = (n) => { estado = (estado * 1103515245 + 12345) & 0x7fffffff; return estado % n; };
    for (let g = 0; g < 200; g++) {
      const mao = novaMao({
        semente: 500 + g, jogadores: JOGADORES,
        baralho: baralhos[g % 4], terreno: terrenos[Math.floor(g / 4) % 4], inicio: inicios[g % 3],
      });
      let jogadas = 0;
      while (mao.fase !== 'fim' && jogadas < 500) {
        if (mao.fase === 'inicio') {
          for (const j of [0, 1]) if (!mao.jogadores[j].cartaInicial) aplicarJogada(mao, { tipo: 'inicio', jogador: j, carta: mao.jogadores[j].mao[0].id });
          continue;
        }
        const legais = jogadasLegais(mao, mao.vez, { comDropout: true });
        aplicarJogada(mao, legais[sortear(legais.length)]);
        jogadas++;
        const ids = [
          ...mao.camadas.flat().flatMap((n) => n.cartas.map((c) => c.id)),
          ...mao.jogadores.flatMap((j) => j.mao.map((c) => c.id)),
          ...mao.limbo.map((c) => c.id), ...mao.cemiterio.map((c) => c.id),
        ];
        assert.equal(ids.length, 52, `mão ${g}, jogada ${jogadas}: ${ids.length} cartas`);
        assert.equal(new Set(ids).size, 52, `mão ${g}, jogada ${jogadas}: carta duplicada`);
        mao.jogadores.forEach((jogador, j) => {
          for (const id of jogador.caminho) assert.equal(mao.neuronios[id].dono, j, `mão ${g}: dono incoerente`);
        });
      }
      assert.equal(mao.fase, 'fim', `mão ${g} não terminou`);
    }
  });
});
