/**
 * @file Cena da mesa: onde a partida acontece.
 *
 * A classe é pequena de propósito. Os métodos ficam em arquivos separados por assunto e são
 * copiados para o protótipo no fim deste arquivo:
 *
 * | Arquivo       | Assunto                                                            |
 * |---------------|--------------------------------------------------------------------|
 * | cenario.js    | molduras fixas, botões e criação dos textos dos painéis            |
 * | desenho.js    | desenhar o estado: neurônios, mãos, placar, curva, dica, alvos      |
 * | entrada.js    | cliques e toques do jogador                                        |
 * | turnos.js     | fluxo da mão: iniciar, executar jogada, vez de cada jogador         |
 * | truco.js      | pedir, anunciar e responder truco                                  |
 * | efeitos.js    | animações dos eventos, faíscas, faixas, balão e avisos do Grimório  |
 * | resultado.js  | fim da mão, tentos, conquistas e tela de resultado                  |
 *
 * Estado principal da cena:
 * - `this.partida`: placar de tentos e truco (nucleo/truco.js);
 * - `this.mao`: estado da mão atual (nucleo/partida.js);
 * - `this.quemVe`: índice do jogador que está olhando a tela (-1 enquanto o aparelho troca de mãos);
 * - `this.modo`, `this.selecao`, `this.alvos`: o que o jogador está escolhendo;
 * - `this.ocupada`: verdadeiro durante animações e a vez do oponente (bloqueia cliques);
 * - `this.encerrada`: a mão acabou.
 */
import { Aplicacao } from '../../aplicacao.js';
import { novaPartida } from '../../nucleo/truco.js';
import { abrirRegras } from '../../interface/telas/regras.js';
import { ajustarCamera, colocarFundo } from '../recursos.js';
import { metodosDoCenario } from './cenario.js';
import { metodosDeDesenho } from './desenho.js';
import { metodosDeEntrada } from './entrada.js';
import { metodosDeTurnos } from './turnos.js';
import { metodosDoTruco } from './truco.js';
import { metodosDeEfeitos } from './efeitos.js';
import { metodosDoResultado } from './resultado.js';

export class CenaMesa extends Phaser.Scene {
  constructor() { super('Mesa'); }

  /** Monta a mesa e começa a primeira mão (depois das regras, na primeira visita). */
  create() {
    this.app = Aplicacao;
    this.opcoes = { ...this.app.opcoes };
    this.doisHumanos = this.opcoes.oponente === 'doisHumanos';
    this.partida = novaPartida(this.opcoes.alvo);
    this.mao = null;

    ajustarCamera(this);
    colocarFundo(this, this.opcoes.terreno);
    this.desenharCenarioFixo();
    /* camadas de desenho, da mais funda para a mais alta */
    this.camadaVazios = this.add.graphics().setDepth(1);
    this.camadaConexoes = this.add.graphics().setDepth(2);
    this.camadaDestaques = this.add.graphics().setDepth(5);
    this.camadaCurva = this.add.graphics().setDepth(6);
    this.camadaVez = this.add.graphics().setDepth(6);
    this.camadaSelecao = this.add.graphics().setDepth(11);
    this.criarPaineis();

    this.input.keyboard?.on('keydown-ESC', () => this.cancelarSelecao());
    this.events.once('shutdown', () => { this.encerrada = true; });
    const comecar = () => this.iniciarMao();
    if (!this.app.progresso.tutorialVisto) abrirRegras(this.app, comecar);
    else comecar();
  }

  /** A cada quadro: conexões animadas, contornos pulsantes e o destaque de quem está na vez. */
  update(tempo) {
    if (!this.mao) return;
    this.desenharConexoesEAlvos(tempo);
    this.desenharDestaqueDaVez(tempo);
  }
}

Object.assign(CenaMesa.prototype,
  metodosDoCenario, metodosDeDesenho, metodosDeEntrada, metodosDeTurnos,
  metodosDoTruco, metodosDeEfeitos, metodosDoResultado);
