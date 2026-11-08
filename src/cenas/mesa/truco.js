/**
 * @file Parte da CenaMesa: o truco. Pedir, anunciar com grito na tela, perguntar a resposta
 * (ao humano numa caixa, ao oponente pelo seu perfil) e aplicar aceitar, correr ou aumentar.
 */
import { podeTrucar, pedirTruco, responderTruco, proximoValor, GRITO_TRUCO } from '../../nucleo/truco.js';
import { responderAoTruco } from '../../nucleo/oponentes/index.js';
import { provocar } from '../../conteudo/textos.js';
import { Som } from '../../interface/som.js';
import { confirmar, escaparHtml } from '../../interface/paineis.js';
import { COR_JOGADOR_CSS } from './layout.js';

export const metodosDoTruco = {
  /** Botão TRUCO! do jogador humano. */
  pedirTrucoHumano() {
    if (!this.ehVezDoHumano() || !podeTrucar(this.partida, this.quemVe)) return;
    this.anunciarTruco(this.quemVe);
  },

  /** Registra o pedido de `j`, grita na tela e pergunta a resposta ao outro jogador. */
  anunciarTruco(j) {
    pedirTruco(this.partida, j);
    Som.truco();
    this.avisarVerbete('truco');
    this.faixa(GRITO_TRUCO[this.partida.pedido.para], COR_JOGADOR_CSS[j], 72);
    if (this.mao.jogadores[j].tipo === 'oponente') this.falar(provocar('truco'));
    this.ocupada = true;
    this.redesenhar();
    this.time.delayedCall(900, () => this.pedirResposta());
  },

  /** Pergunta a resposta a quem recebeu o pedido. */
  pedirResposta() {
    const partida = this.partida, pedido = partida.pedido;
    const quem = 1 - pedido.por;
    const jogador = this.mao.jogadores[quem];
    const podeAumentar = proximoValor(pedido.para) != null;
    if (jogador.tipo === 'oponente') {
      const resposta = responderAoTruco(this.mao, quem, jogador.oponente, pedido.para, podeAumentar);
      this.falar(provocar(resposta));
      return this.aplicarResposta(quem, resposta);
    }
    const quemPediu = this.mao.jogadores[pedido.por].nome;
    const botoes = [
      { rotulo: 'Correr', classe: 'discreto', acao: () => this.aplicarResposta(quem, 'correr') },
      { rotulo: 'Desce! (vale ' + pedido.para + ')', classe: 'vinho', acao: () => this.aplicarResposta(quem, 'aceitar') },
    ];
    if (podeAumentar) botoes.push({ rotulo: 'Pedir ' + GRITO_TRUCO[proximoValor(pedido.para)], acao: () => this.aplicarResposta(quem, 'aumentar') });
    confirmar(GRITO_TRUCO[pedido.para],
      escaparHtml((this.doisHumanos ? jogador.nome + ', responda. ' : '') + 'Se aceitar, a mão vale ' + pedido.para + ' tentos. Se correr, ' + quemPediu + ' leva ' + partida.valor + ' agora.'),
      botoes, { grito: true, topo: '<div class="quem">' + escaparHtml(quemPediu) + ' pediu</div>' });
  },

  /**
   * Aplica a resposta de `quem`.
   * @param {'aceitar'|'correr'|'aumentar'} resposta
   */
  aplicarResposta(quem, resposta) {
    const resultado = responderTruco(this.partida, quem, resposta);
    if (resposta === 'correr') {
      this.faixa(this.mao.jogadores[quem].nome + ' correu!', '#efe3c6', 40);
      if (this.mao.jogadores[quem].tipo === 'oponente') this.oponenteCorreu = true;
      this.time.delayedCall(900, () => this.encerrarMao(resultado));
      return;
    }
    if (resposta === 'aumentar') {
      Som.truco();
      this.faixa(GRITO_TRUCO[this.partida.pedido.para], COR_JOGADOR_CSS[quem], 72);
      this.redesenhar();
      this.time.delayedCall(900, () => this.pedirResposta());
      return;
    }
    this.textoFlutuante(610, 300, 'Aceito: mão vale ' + this.partida.valor, '#f6dc8f', 26);
    this.redesenhar();
    this.time.delayedCall(600, () => { this.ocupada = false; this.avancar(); });
  },
};
