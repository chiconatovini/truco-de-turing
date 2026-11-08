/**
 * @file Geometria da mesa e utilitários de texto que se ajusta ao espaço.
 *
 * Tudo em coordenadas do mundo (1280x720). Painel esquerdo: inspeção, pilhas e dica.
 * Centro: as sete camadas da rede e as mãos. Painel direito: placar, truco, curva e ações.
 */
import { TAMANHOS_CAMADAS } from '../../nucleo/rede.js';
import { CORES, CORES_CSS, TAMANHO_CARTA } from '../../configuracao.js';

/** Painel esquerdo (inspeção, pilhas e dica). */
export const PAINEL_ESQ = { x: 8, y: 8, l: 244, a: 704 };
/** Painel direito (placar, curva, registro e ações). */
export const PAINEL_DIR = { x: 962, y: 8, l: 310, a: 704 };

/**
 * Posições verticais dentro do painel esquerdo, de cima para baixo.
 * `pilha` é o tamanho das cartas do limbo e do cemitério.
 */
export const ESQ = {
  titulo: 26, inspecao: 182, nota: 326, divisoria1: 378,
  pilhas: 442, pilha: { l: 66, a: 92 }, rotulosPilha: 498, terreno: 518, divisoria2: 566, dica: 578, botoes: 684,
};

/**
 * Posições verticais dentro do painel direito. Os blocos de placar ficam empilhados a partir de
 * `blocos`, cada um com altura `alturaBloco`; o botão de truco fica logo acima das ações.
 */
export const DIR = {
  tituloMao: 28, subtitulo: 49, blocos: 64, alturaBloco: 102, passoBloco: 108, avatar: 58,
  rotuloCurva: 292, curva: 304, alturaCurva: 64, registro: 380, alturaRegistro: 132, truco: 543,
};

/** Distância vertical entre neurônios e centro vertical do tabuleiro. */
const ESPACO_LINHA = 95, CENTRO_TABULEIRO = 334;

/** X do centro da coluna da camada. */
export const colunaX = (camada) => 318 + camada * 97;
/** Y do centro do neurônio `posicao` na camada. */
export const linhaY = (camada, posicao) => CENTRO_TABULEIRO + (posicao - (TAMANHOS_CAMADAS[camada] - 1) / 2) * ESPACO_LINHA;

/** Cor de cada jogador, em número (Phaser) e em texto (CSS). */
export const COR_JOGADOR = [CORES.j0, CORES.j1];
export const COR_JOGADOR_CSS = [CORES_CSS.j0, CORES_CSS.j1];

/** Cor do contorno que destaca cada tipo de alvo. */
export const COR_DO_ALVO = { ativar: 0xf6dc8f, tunagem: 0x7fe08a, overfit: 0xffa24a, earlystop: 0xff4d5e, stackoverflow: 0xff4dd2, dropout: 0x6fe7ff };

/** Texto da situação de cada rede. */
export const NOME_SITUACAO = { construindo: 'em construção', concluida: 'chegou à saída', earlystop: 'early stop', overflow: 'stack overflow' };

/** Ajusta a imagem de um neurônio ao tamanho da carta da mesa e guarda a escala-base (para animar o giro). */
export function ajustarCartaDaMesa(imagem) {
  imagem.setDisplaySize(TAMANHO_CARTA.mesaL, TAMANHO_CARTA.mesaA);
  imagem.escalaBaseX = imagem.scaleX;
  return imagem;
}

/**
 * Texto de uma linha que encolhe até caber em `larguraMax`; se ainda não couber, corta com "…".
 * Não refaz o cálculo se nada mudou.
 */
export function ajustarLinha(texto, conteudo, tamanho, larguraMax, minimo) {
  const chave = conteudo + '|' + tamanho + '|' + larguraMax;
  if (texto.ajusteAtual === chave) return texto;
  texto.ajusteAtual = chave;
  texto.setText(conteudo);
  let t = tamanho;
  texto.setFontSize(t);
  while (texto.width > larguraMax && t > minimo) { t -= 0.5; texto.setFontSize(t); }
  if (texto.width > larguraMax) {
    let corte = conteudo;
    while (corte.length > 1 && texto.width > larguraMax) { corte = corte.slice(0, -1); texto.setText(corte.trimEnd() + '…'); }
  }
  return texto;
}

/** Bloco de texto com quebra de linha que encolhe até caber na altura. */
export function ajustarBloco(texto, conteudo, tamanho, larguraMax, alturaMax, minimo) {
  const chave = conteudo + '|' + tamanho + '|' + larguraMax + '|' + alturaMax;
  if (texto.ajusteAtual === chave) return texto;
  texto.ajusteAtual = chave;
  let t = tamanho;
  texto.setWordWrapWidth(larguraMax);
  texto.setFontSize(t);
  texto.setText(conteudo);
  while (texto.height > alturaMax && t > minimo) { t -= 0.5; texto.setFontSize(t); }
  return texto;
}
