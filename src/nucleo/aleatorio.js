/**
 * @file Gerador de números aleatórios com semente.
 *
 * Toda a aleatoriedade das regras passa por aqui. Com a mesma semente, a mesma
 * partida se repete, o que permite reproduzir erros e comparar oponentes em simulação.
 */

/**
 * Sorteia um número em [0, 1) e avança a semente guardada no objeto (algoritmo mulberry32).
 * @param {{semente: number}} estado Qualquer objeto com o campo `semente` (normalmente a mão em jogo).
 * @returns {number}
 */
export function sortear(estado) {
  let t = (estado.semente = (estado.semente + 0x6d2b79f5) | 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Sorteia um inteiro em [0, n).
 * @param {{semente: number}} estado
 * @param {number} n
 */
export function sortearInteiro(estado, n) {
  return Math.floor(sortear(estado) * n);
}

/**
 * Embaralha a lista no lugar (Fisher-Yates) e a devolve.
 * @template T
 * @param {T[]} lista
 * @param {{semente: number}} estado
 * @returns {T[]}
 */
export function embaralhar(lista, estado) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = sortearInteiro(estado, i + 1);
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

/** Cria uma semente nova a partir do relógio, para partidas não reproduzíveis. */
export function sementeNova() {
  return (Date.now() ^ Math.floor(Math.random() * 1e9)) | 0;
}
