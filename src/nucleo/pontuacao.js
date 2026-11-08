/**
 * @file Soma da rede de um jogador (o "forward pass" do jogo).
 *
 * Regras da especificação:
 *  - 2 a 10 valem o número, Ás 11, figuras 0;
 *  - figuras iguais em camadas vizinhas: par +10, trio +20; quadra zera a rede (vanishing gradient);
 *  - tunagem soma a carta empilhada; em figura, +10 por carta empilhada.
 *
 * Leitura adotada para o exemplo do enunciado ("8-K-K-3" com tunagem num K = 41): as cartas de figura
 * empilhadas contam para o combo. K(2 cartas) + K(1) = três Reis vizinhos = trio (20) + tunagem (10),
 * logo 8 + 20 + 10 + 3 = 41.
 */
import { ehFigura, PLURAL_FIGURA } from './cartas.js';
import { BARALHOS, pontosDaCarta } from './baralhos.js';

/**
 * @typedef {object} NeuronioPontuado
 * @property {object} neuronio  O neurônio da mesa.
 * @property {number} camada    Posição no caminho (0 = entrada).
 * @property {object} carta     Carta de cima da pilha.
 * @property {number} pilha     Quantas cartas estão empilhadas.
 * @property {boolean} figura
 * @property {number} pontos    Pontos depois de terreno e baralho.
 * @property {string[]} notas   Explicações exibidas na interface ("tunagem +10").
 */

/**
 * @typedef {object} Pontuacao
 * @property {number} total
 * @property {NeuronioPontuado[]} neuronios
 * @property {{de:number, ate:number, valor:string, quantidade:number, pontos:number, rotulo:string}[]} combos
 * @property {boolean} vanishing  Verdadeiro se uma quadra zerou a rede.
 */

/**
 * Pontos de cada neurônio do caminho, com efeitos de tunagem e terreno.
 * @param {object} mao Estado da mão (ver partida.js).
 * @param {number} j Índice do jogador.
 */
function pontuarNeuronios(mao, j) {
  const jogador = mao.jogadores[j];
  /* Redes finalizadas congelam rodada e vento no momento em que pararam */
  const momento = jogador.congelada || { rodada: mao.rodada, vento: mao.vento };
  const { baralho, terreno } = mao.config;
  return jogador.caminho.map((id, camada) => {
    const neuronio = mao.neuronios[id];
    const carta = neuronio.cartas[0];
    const pilha = neuronio.cartas.length;
    const figura = ehFigura(carta);
    const notas = [];
    let pontos = 0;
    if (figura) {
      pontos = 10 * (pilha - 1);
      if (pilha > 1) notas.push('tunagem +' + pontos);
    } else {
      for (const c of neuronio.cartas) pontos += pontosDaCarta(c, baralho);
      if (pilha > 1) notas.push('tunado x' + pilha);
    }
    if (terreno === 'montanha' && pontos > 0) {
      const novo = Math.max(0, pontos - camada);
      if (novo !== pontos) notas.push('montanha -' + (pontos - novo));
      pontos = novo;
    } else if (terreno === 'pantano' && pilha === 1 && pontos > 0) {
      const afundou = Math.max(0, momento.rodada - neuronio.rodadaRevelada);
      const novo = Math.max(0, pontos - afundou);
      if (novo !== pontos) notas.push('afundou -' + (pontos - novo));
      pontos = novo;
    } else if (terreno === 'oceano' && carta.naipe === momento.vento && pontos > 0) {
      notas.push('vento x2');
      pontos *= 2;
    }
    return { neuronio, camada, carta, pilha, figura, pontos, notas };
  });
}

/** Baralho da fraternidade: dobra neurônios com vizinho do mesmo naipe. */
function aplicarFraternidade(neuronios) {
  neuronios.forEach((n, i) => {
    const anterior = neuronios[i - 1];
    const proximo = neuronios[i + 1];
    if ((anterior && anterior.carta.naipe === n.carta.naipe) || (proximo && proximo.carta.naipe === n.carta.naipe)) {
      if (n.pontos > 0) { n.pontos *= 2; n.notas.push('fraternidade x2'); }
    }
  });
}

/** Encontra sequências de figuras iguais em camadas vizinhas e calcula o bônus de cada uma. */
function encontrarCombos(neuronios) {
  const combos = [];
  let vanishing = false;
  let k = 0;
  while (k < neuronios.length) {
    const inicio = k;
    if (neuronios[k].figura) {
      while (k + 1 < neuronios.length && neuronios[k + 1].figura && neuronios[k + 1].carta.valor === neuronios[inicio].carta.valor) k++;
    }
    if (k > inicio) {
      let quantidade = 0;
      for (let i = inicio; i <= k; i++) quantidade += neuronios[i].pilha;
      const valor = neuronios[inicio].carta.valor;
      if (quantidade >= 4) {
        vanishing = true;
        combos.push({ de: inicio, ate: k, valor, quantidade, pontos: 0, rotulo: 'Quadra de ' + PLURAL_FIGURA[valor] + ': vanishing gradient' });
      } else {
        const pontos = 10 * (quantidade - 1);
        combos.push({ de: inicio, ate: k, valor, quantidade, pontos, rotulo: (quantidade === 2 ? 'Par' : 'Trio') + ' de ' + PLURAL_FIGURA[valor] + ' +' + pontos });
      }
    }
    k++;
  }
  return { combos, vanishing };
}

/**
 * Calcula a soma da rede do jogador `j`.
 * @param {object} mao Estado da mão.
 * @param {number} j Índice do jogador.
 * @returns {Pontuacao}
 */
export function pontuarRede(mao, j) {
  const neuronios = pontuarNeuronios(mao, j);
  if (BARALHOS[mao.config.baralho].fraternidade) aplicarFraternidade(neuronios);
  const { combos, vanishing } = encontrarCombos(neuronios);
  let total = 0;
  for (const n of neuronios) total += n.pontos;
  for (const c of combos) total += c.pontos;
  if (vanishing) total = 0;
  return { total, neuronios, combos, vanishing };
}

/** Média de pontos de um conjunto de cartas (usada pelos oponentes para estimar camadas futuras). */
export function mediaDePontos(mao, cartas) {
  if (!cartas.length) return 0;
  let soma = 0;
  for (const c of cartas) soma += pontosDaCarta(c, mao.config.baralho);
  return soma / cartas.length;
}
