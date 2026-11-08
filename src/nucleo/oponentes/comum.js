/**
 * @file Ferramentas compartilhadas pelos oponentes: o que eles não veem, determinização,
 * avaliação de posições e simulação rápida até o fim da mão.
 */
import { embaralhar } from '../aleatorio.js';
import { ehFigura } from '../cartas.js';
import { pontosDaCarta } from '../baralhos.js';
import { TOTAL_CAMADAS } from '../rede.js';
import { pontuarRede, mediaDePontos } from '../pontuacao.js';
import { copiarMao, jogadasLegais, aplicarJogada, alvosDeAtivacao, efeitoDoEmpilhamento } from '../partida.js';

/** Valor estimado, em pontos, de cada carta guardada na mão. */
const VALOR_DE_CARTA_NA_MAO = 2.5;

/** Cartas que o jogador `j` não consegue ver: neurônios virados, mão do adversário e limbo. */
export function cartasOcultas(mao, j) {
  let ocultas = [];
  for (const camada of mao.camadas) for (const n of camada) if (!n.removido && !n.revelado && !n.conhecido) ocultas.push(n.cartas[0]);
  mao.jogadores.forEach((jogador, i) => { if (i !== j) ocultas = ocultas.concat(jogador.mao); });
  return ocultas.concat(mao.limbo);
}

/**
 * Determinização: copia a mão e sorteia uma distribuição plausível para tudo o que `j` não vê.
 * É assim que os oponentes "imaginam" as cartas escondidas antes de simular.
 */
export function determinizar(mao, j) {
  const copia = copiarMao(mao);
  copia.semente = (Math.random() * 2147483647) | 0;
  const sorteadas = embaralhar(cartasOcultas(copia, j).slice(), copia);
  let k = 0;
  for (const camada of copia.camadas) for (const n of camada) if (!n.removido && !n.revelado && !n.conhecido) n.cartas[0] = sorteadas[k++];
  copia.jogadores.forEach((jogador, i) => { if (i !== j) jogador.mao = jogador.mao.map(() => sorteadas[k++]); });
  copia.limbo = copia.limbo.map(() => sorteadas[k++]);
  return copia;
}

/** Pontos esperados por camada ainda não revelada, do ponto de vista de `j`. */
export function pontosEsperadosPorCamada(mao, j) {
  return mediaDePontos(mao, cartasOcultas(mao, j));
}

/** Projeção da soma final do jogador `i`: soma atual + camadas que faltam + cartas na mão. */
function projecao(mao, i, esperado) {
  const jogador = mao.jogadores[i];
  let soma = pontuarRede(mao, i).total;
  if (jogador.situacao === 'construindo') {
    const faltam = TOTAL_CAMADAS - jogador.caminho.length;
    const podeSeguir = alvosDeAtivacao(mao, i).length > 0;
    soma += faltam * esperado * (podeSeguir ? 0.85 : 0.35);
  }
  return soma + jogador.mao.length * VALOR_DE_CARTA_NA_MAO;
}

/** Nota de uma posição para `j`: vantagem projetada sobre o melhor adversário (ou ±1000 no fim). */
export function avaliar(mao, j, esperado) {
  if (mao.fase === 'fim') {
    const r = mao.resultado;
    const melhorOutro = Math.max(...r.somas.filter((_, i) => i !== j));
    return (r.vencedor === j ? 1000 : -1000) + (r.somas[j] - melhorOutro);
  }
  const minha = projecao(mao, j, esperado);
  let melhor = -Infinity;
  mao.jogadores.forEach((_, i) => { if (i !== j) melhor = Math.max(melhor, projecao(mao, i, esperado)); });
  return minha - melhor;
}

/**
 * Agrupa ativações de neurônios desconhecidos da mesma camada: para quem joga, são equivalentes.
 * Cada grupo vira uma jogada com a lista `alternativas`.
 */
export function agruparEquivalentes(mao, jogadas) {
  const grupos = {};
  const saida = [];
  for (let jogada of jogadas) {
    if (jogada.tipo === 'ativar') {
      const n = mao.neuronios[jogada.neuronio];
      if (!n.conhecido) {
        const chave = 'camada' + n.camada;
        if (grupos[chave]) { grupos[chave].alternativas.push(jogada.neuronio); continue; }
        jogada = { ...jogada, alternativas: [jogada.neuronio] };
        grupos[chave] = jogada;
      }
    }
    saida.push(jogada);
  }
  return saida;
}

/** Escolhe um neurônio ao acaso entre as alternativas e devolve uma jogada aplicável. */
export function concretizar(jogada) {
  const { alternativas, ...limpa } = jogada;
  if (alternativas && alternativas.length) limpa.neuronio = alternativas[Math.floor(Math.random() * alternativas.length)];
  return limpa;
}

/** Política rápida usada nas simulações: ataques fortes, tunagens boas e ativações razoáveis. */
function jogadaRapida(mao, j) {
  const jogadas = jogadasLegais(mao, j);
  if (jogadas.length === 1) return jogadas[0];
  if (Math.random() < 0.12) return jogadas[Math.floor(Math.random() * jogadas.length)];
  let melhor = null, prioridade = 0;
  for (const jogada of jogadas) {
    if (jogada.tipo !== 'empilhar') continue;
    const alvo = mao.neuronios[jogada.neuronio];
    const efeito = efeitoDoEmpilhamento(mao, j, alvo, jogada.cartas.length);
    const pontos = pontosDaCarta(alvo.cartas[0], mao.config.baralho);
    let p = 0;
    if (!efeito.proprio) {
      if (efeito.tipo === 'stackoverflow') p = 9;
      else if (efeito.tipo === 'earlystop') p = 8;
      else if (efeito.tipo === 'overfit' && pontos >= 7) p = 5;
    } else if (efeito.tipo === 'tunagem' && (pontos >= 6 || ehFigura(alvo.cartas[0]))) p = 4;
    if (p > prioridade) { prioridade = p; melhor = jogada; }
  }
  if (melhor && Math.random() < 0.75) return melhor;
  const ativacoes = jogadas.filter((x) => x.tipo === 'ativar');
  if (ativacoes.length) {
    const boasConhecidas = ativacoes.filter((x) => {
      const n = mao.neuronios[x.neuronio];
      return n.conhecido && pontosDaCarta(n.cartas[0], mao.config.baralho) >= 7;
    });
    if (boasConhecidas.length) return boasConhecidas[0];
    const desconhecidas = ativacoes.filter((x) => !mao.neuronios[x.neuronio].conhecido);
    const lista = desconhecidas.length ? desconhecidas : ativacoes;
    return lista[Math.floor(Math.random() * lista.length)];
  }
  return jogadas[jogadas.length - 1];
}

/** Joga a mão até o fim com a política rápida (um "rollout"). */
export function simularAteOFim(mao) {
  let limite = 0;
  while (mao.fase === 'jogo' && limite++ < 200) aplicarJogada(mao, jogadaRapida(mao, mao.vez));
  return mao;
}

/** Estima a chance de `j` vencer a mão simulando `n` finais possíveis. */
export function chanceDeVitoria(mao, j, n) {
  if (mao.fase === 'fim') return mao.resultado.vencedor === j ? 1 : 0;
  if (mao.fase === 'inicio') return 0.5;
  let vitorias = 0;
  for (let i = 0; i < n; i++) {
    const copia = determinizar(mao, j);
    simularAteOFim(copia);
    if (copia.resultado && copia.resultado.vencedor === j) vitorias++;
  }
  return vitorias / n;
}
