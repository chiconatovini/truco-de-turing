/**
 * @file Medidas-base das cartas, cores por naipe e fontes usadas na arte.
 */

/** Tamanho-base da carta completa (mão e inspeção), em unidades de desenho. */
export const CARTA_L = 240, CARTA_A = 336;
/** Tamanho-base da carta da mesa (neurônio). */
export const MINI_L = 120, MINI_A = 168;
/** Cor de tinta dos textos sobre pergaminho. */
export const TINTA = '#1d140b';
/** Fontes com os símbolos ♠♥♣♦ desenhados de forma consistente. */
export const FONTE_SIMBOLOS = '"Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2", "DejaVu Sans", Arial, sans-serif';

/**
 * Paleta de cada naipe: tons da moldura (clara, media, escura), gema de custo, brilho dos
 * cenários, barra de título (titulo, tituloEscuro), céu do cenário (3 tons) e tinta clara.
 */
export const PALETA_NAIPE = {
  E: { clara: '#d7e2ee', media: '#7f95ad', escura: '#1f2c3b', gema: '#4f86c9', brilho: '#cfe6ff', titulo: '#e3eaf2', tituloEscuro: '#a9b8c9', ceu: ['#0d1626', '#2b4466', '#8fa9c6'], tinta: '#dfeeff' },
  C: { clara: '#f6b4a4', media: '#b2353a', escura: '#3a0b10', gema: '#d42a3c', brilho: '#ffd59a', titulo: '#f4e0d8', tituloEscuro: '#d0a596', ceu: ['#1d0508', '#5e1418', '#c2533d'], tinta: '#ffe3d6' },
  P: { clara: '#bfe0a8', media: '#4f8a52', escura: '#112a17', gema: '#3a9e55', brilho: '#eaffb8', titulo: '#e0ecd6', tituloEscuro: '#a8bf98', ceu: ['#081a10', '#24502f', '#9cc178'], tinta: '#efffe0' },
  O: { clara: '#fff0b8', media: '#cf9a2e', escura: '#4a3008', gema: '#e4a92c', brilho: '#fff4c2', titulo: '#f8ecd2', tituloEscuro: '#d8be8a', ceu: ['#2a1206', '#9a4a14', '#f4bf5c'], tinta: '#fff6dc' },
};
