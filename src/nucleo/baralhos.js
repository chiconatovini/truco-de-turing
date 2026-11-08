/**
 * @file Baralhos com efeitos (seção "Extensões" da especificação) e valor em pontos das cartas.
 */
import { NAIPES, NOME_VALOR, NAIPE, baralhoPadrao, ehFigura } from './cartas.js';

/**
 * Cada baralho tem: `nome`, `resumo` (texto do menu), `montar()` que gera as 52 cartas e,
 * opcionalmente, um efeito:
 *  - `pontosFixos`: pontos especiais por id de carta (manilhas do truco);
 *  - `manilhas`: nome especial de cartas;
 *  - `fraternidade`: vizinhos do mesmo naipe valem dobro;
 *  - `trocaMao`: a mão muda aleatoriamente após cada ação (Power BI).
 */
export const BARALHOS = {
  classico: {
    nome: 'Clássico',
    resumo: 'Baralho padrão de 52 cartas, sem coringas.',
    montar: baralhoPadrao,
  },
  truco: {
    nome: 'Truco',
    resumo: 'Manilhas mandam: Zap (4♣) vale 12, Copas (7♥) vale 9, Espadilha (A♠) vale 13 e Pica-fumo (7♦) vale 10.',
    montar: baralhoPadrao,
    pontosFixos: { '4P': 12, '7C': 9, AE: 13, '7O': 10 },
    manilhas: { '4P': 'Zap', '7C': 'Copas', AE: 'Espadilha', '7O': 'Pica-fumo' },
  },
  fraternidade: {
    nome: 'Fraternidade',
    resumo: 'Neurônios vizinhos do mesmo naipe valem o dobro.',
    montar: baralhoPadrao,
    fraternidade: true,
  },
  yinyang: {
    nome: 'Yin-yang',
    resumo: 'Só existem 2 e Ás. Tunagens, overfits e stack overflows a todo momento.',
    montar() {
      const cartas = [];
      for (let i = 0; i < 52; i++) {
        const valor = i % 2 ? 'A' : '2';
        const naipe = NAIPES[Math.floor(i / 2) % 4];
        cartas.push({ id: valor + naipe + '#' + i, valor, naipe });
      }
      return cartas;
    },
  },
  powerbi: {
    nome: 'Power BI',
    resumo: 'Depois de cada ação com a mão, as cartas que sobraram mudam aleatoriamente.',
    montar: baralhoPadrao,
    trocaMao: true,
  },
};

/**
 * Pontos de uma carta isolada: 2 a 10 pelo número, Ás 11, figuras 0, manilhas pelo baralho.
 * @param {{valor: string, naipe: string}} carta
 * @param {string} baralho Chave de BARALHOS.
 */
export function pontosDaCarta(carta, baralho) {
  const fixos = BARALHOS[baralho]?.pontosFixos;
  const chave = carta.valor + carta.naipe;
  if (fixos && fixos[chave] != null) return fixos[chave];
  if (carta.valor === 'A') return 11;
  if (ehFigura(carta)) return 0;
  return parseInt(carta.valor, 10);
}

/** Nome por extenso da carta, ou o nome da manilha ("Zap"). */
export function nomeDaCarta(carta, baralho) {
  const manilha = BARALHOS[baralho]?.manilhas?.[carta.valor + carta.naipe];
  if (manilha) return manilha;
  return NOME_VALOR[carta.valor] + ' de ' + NAIPE[carta.naipe].nome;
}

/** Nome da manilha, se a carta for uma no baralho escolhido. */
export function manilhaDaCarta(carta, baralho) {
  return BARALHOS[baralho]?.manilhas?.[carta.valor + carta.naipe] || null;
}
