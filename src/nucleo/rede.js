/**
 * @file Arquitetura da rede neural montada na mesa.
 *
 * Camada 0 é a entrada (3 neurônios), 1 a 5 são ocultas (5 cada) e 6 é a saída (4).
 * Cada jogador recebe `TAMANHO_MAO` cartas; o que sobra vai para o limbo.
 */

/** Neurônios por camada, da entrada à saída. */
export const TAMANHOS_CAMADAS = [3, 5, 5, 5, 5, 5, 4];

/** Quantidade de camadas (7). */
export const TOTAL_CAMADAS = TAMANHOS_CAMADAS.length;

/** Índice da camada de saída (6). */
export const CAMADA_SAIDA = TOTAL_CAMADAS - 1;

/** Cartas na mão de cada jogador no início. */
export const TAMANHO_MAO = 5;

/** Diz se a camada é oculta (só nelas valem as ações com cartas). */
export function ehOculta(camada) {
  return camada > 0 && camada < CAMADA_SAIDA;
}

/** Nome da camada para a interface: 'Entrada', 'Oculta 3', 'Saída'. */
export function nomeCamada(camada) {
  if (camada === 0) return 'Entrada';
  if (camada === CAMADA_SAIDA) return 'Saída';
  return 'Oculta ' + camada;
}
