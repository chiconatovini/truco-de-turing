/**
 * @file As três estratégias de jogo, uma por nível de dificuldade.
 *
 *  - aleatória (Zé do Ruído): sorteia qualquer jogada válida;
 *  - gulosa (Gradiente Guloso): avalia cada jogada um turno à frente pelo valor esperado;
 *  - Monte Carlo (Mestre Monte Carlo): simula partidas inteiras para cada jogada e escolhe a que mais venceu.
 */
import { jogadasLegais, aplicarJogada, copiarMao } from '../partida.js';
import {
  determinizar, avaliar, agruparEquivalentes, concretizar, simularAteOFim, pontosEsperadosPorCamada,
} from './comum.js';

/** Estratégia aleatória: prefere ativar neurônios (70%) para a mão andar. */
export function jogadaAleatoria(mao, j) {
  const jogadas = jogadasLegais(mao, j);
  const ativacoes = jogadas.filter((x) => x.tipo === 'ativar');
  if (ativacoes.length && Math.random() < 0.7) return ativacoes[Math.floor(Math.random() * ativacoes.length)];
  return jogadas[Math.floor(Math.random() * jogadas.length)];
}

/**
 * Estratégia gulosa: aplica cada jogada numa cópia e escolhe a de melhor avaliação.
 * Ativações de neurônios desconhecidos são testadas com 8 sorteios do que pode estar embaixo.
 */
export function jogadaGulosa(mao, j) {
  const esperado = pontosEsperadosPorCamada(mao, j);
  const jogadas = agruparEquivalentes(mao, jogadasLegais(mao, j, { comDropout: true }));
  let melhor = null, notaMelhor = -Infinity;
  for (const jogada of jogadas) {
    const amostras = jogada.tipo === 'ativar' && jogada.alternativas ? 8 : 1;
    let soma = 0;
    for (let i = 0; i < amostras; i++) {
      const copia = amostras > 1 ? determinizar(mao, j) : copiarMao(mao);
      aplicarJogada(copia, concretizar(jogada));
      soma += avaliar(copia, j, esperado);
    }
    let nota = soma / amostras + Math.random() * 0.3;
    if (jogada.tipo === 'dropout') nota -= 1.5; /* evita gastar cartas em dropouts marginais */
    if (nota > notaMelhor) { notaMelhor = nota; melhor = jogada; }
  }
  return concretizar(melhor);
}

/**
 * Estratégia de Monte Carlo: para cada jogada, sorteia o que está escondido, joga até o fim e conta
 * vitórias. Repete até gastar o tempo `orcamentoMs`. A jogada escolhida leva `simulacao` com a taxa
 * de vitória e o total de partidas simuladas, que a interface mostra.
 */
export function jogadaMonteCarlo(mao, j, orcamentoMs = 380) {
  const jogadas = agruparEquivalentes(mao, jogadasLegais(mao, j, { comDropout: true }));
  if (jogadas.length === 1) return concretizar(jogadas[0]);
  const placar = jogadas.map(() => ({ vitorias: 0, partidas: 0, saldo: 0 }));
  const inicio = Date.now();
  let rodadas = 0;
  while ((Date.now() - inicio < orcamentoMs || rodadas < 6) && rodadas < 400) {
    jogadas.forEach((jogada, i) => {
      const copia = determinizar(mao, j);
      aplicarJogada(copia, concretizar(jogada));
      simularAteOFim(copia);
      const p = placar[i];
      p.partidas++;
      if (copia.resultado) {
        if (copia.resultado.vencedor === j) p.vitorias++;
        p.saldo += copia.resultado.somas[j] - copia.resultado.somas[1 - j];
      }
    });
    rodadas++;
  }
  let melhor = 0, notaMelhor = -Infinity;
  placar.forEach((p, i) => {
    let nota = p.vitorias / p.partidas + 0.002 * (p.saldo / p.partidas);
    if (jogadas[i].tipo === 'dropout') nota -= 0.02;
    if (nota > notaMelhor) { notaMelhor = nota; melhor = i; }
  });
  const escolhida = concretizar(jogadas[melhor]);
  escolhida.simulacao = { taxaDeVitoria: placar[melhor].vitorias / placar[melhor].partidas, partidas: rodadas * jogadas.length };
  return escolhida;
}
