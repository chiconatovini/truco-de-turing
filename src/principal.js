/**
 * @file Ponto de entrada do jogo: prepara o texto nítido, carrega as opções e cria o Phaser.Game
 * com as três cenas (Carregamento → Menu → Mesa).
 *
 * O Phaser vem do CDN como variável global `Phaser` (ver index.html).
 */
import { MUNDO, RESOLUCAO, FORCAR_CANVAS } from './configuracao.js';
import { Aplicacao } from './aplicacao.js';
import { prepararTextoNitido } from './cenas/recursos.js';
import { CenaCarregamento } from './cenas/CenaCarregamento.js';
import { CenaMenu } from './cenas/CenaMenu.js';
import { CenaMesa } from './cenas/mesa/CenaMesa.js';

prepararTextoNitido();
Aplicacao.iniciar();
Aplicacao.jogo = new Phaser.Game({
  type: FORCAR_CANVAS ? Phaser.CANVAS : Phaser.AUTO,
  parent: 'jogo',
  width: Math.round(MUNDO.largura * RESOLUCAO),
  height: Math.round(MUNDO.altura * RESOLUCAO),
  backgroundColor: '#06180f',
  scale: { mode: Phaser.Scale.EXPAND, autoCenter: Phaser.Scale.CENTER_BOTH },
  render: { antialias: true, roundPixels: false },
  /* cliques nos painéis HTML não vazam para o canvas */
  input: { windowEvents: false },
  scene: [CenaCarregamento, CenaMenu, CenaMesa],
});

/* acesso para testes automatizados e depuração no console */
globalThis.__TRUCO_DE_TURING__ = Aplicacao;
