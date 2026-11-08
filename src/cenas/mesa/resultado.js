/**
 * @file Parte da CenaMesa: fim da mão. Marca os tentos, registra conquistas e mostra a tela de
 * resultado com a soma detalhada de cada rede.
 */
import { rotuloCarta } from '../../nucleo/cartas.js';
import { pontuarRede } from '../../nucleo/pontuacao.js';
import { marcarTentos, novaPartida, proximaMao } from '../../nucleo/truco.js';
import { GRADUACOES } from '../../conteudo/conquistas.js';
import { provocar } from '../../conteudo/textos.js';
import { Som } from '../../interface/som.js';
import { abrirPainel, escaparHtml } from '../../interface/paineis.js';
import { medalhaHtml } from '../../interface/telas/conquistas.js';
import { COR_JOGADOR_CSS, NOME_SITUACAO } from './layout.js';

export const metodosDoResultado = {
  /**
   * Encerra a mão.
   * @param {{vencedor: number, pontos: number} | null} corrida Resultado de alguém ter corrido do
   *   truco, ou null quando a mão foi jogada até o fim.
   */
  encerrarMao(corrida) {
    if (this.encerrada) return;
    this.encerrada = true;
    this.ocupada = true;
    const mao = this.mao, partida = this.partida;
    const completa = !corrida;
    const vencedor = completa ? mao.resultado.vencedor : corrida.vencedor;
    const valorDaMao = completa ? partida.valor : corrida.pontos;
    const ganho = marcarTentos(partida, vencedor, completa ? null : corrida.pontos);
    this.redesenhar();
    const humanoVenceu = mao.jogadores[vencedor].tipo === 'humano';
    if (this.doisHumanos) Som.vitoria();
    else {
      if (humanoVenceu) Som.vitoria(); else Som.derrota();
      this.falar(provocar(humanoVenceu ? 'perdeu' : 'venceu'));
    }
    const novas = this.doisHumanos ? [] : this.app.registrarMao({
      mao, eu: 0, venceu: vencedor === 0, completa, partida,
      venceuPartida: partida.encerrada && partida.vencedor === 0, valorDaMao,
      oponenteCorreu: this.oponenteCorreu, opcoes: this.opcoes,
    });
    this.oponenteCorreu = false;
    this.time.delayedCall(completa ? 1100 : 300, () => this.mostrarResultado(vencedor, ganho, completa, novas));
  },

  /** HTML com a soma detalhada da rede do jogador `j`. */
  htmlDaRede(j) {
    const mao = this.mao, pontuacao = pontuarRede(mao, j), jogador = mao.jogadores[j];
    const travada = jogador.situacao === 'construindo' && mao.resultado && mao.resultado.travados[j];
    let termos = pontuacao.neuronios.map((n) =>
      '<span class="termo">' + escaparHtml(rotuloCarta(n.carta)) + (n.pilha > 1 ? '×' + n.pilha : '') + ' = ' + n.pontos +
      (n.notas.length ? ' <small>(' + escaparHtml(n.notas.join(', ')) + ')</small>' : '') + '</span>').join('');
    termos += pontuacao.combos.map((c) => '<span class="termo ' + (c.quantidade >= 4 ? 'ruim' : 'combo') + '">' + escaparHtml(c.rotulo) + '</span>').join('');
    return '<div class="rede j' + j + '"><div class="situacao">' + escaparHtml(travada ? 'travada' : NOME_SITUACAO[jogador.situacao]) + '</div>' +
      '<h3 style="margin:2px 0 6px;color:' + COR_JOGADOR_CSS[j] + '">' + escaparHtml(jogador.nome) + '</h3>' +
      '<div class="total">' + pontuacao.total + '</div><div class="termos">' + (termos || '<span class="termo">rede vazia</span>') + '</div>' +
      '<small>dropouts ' + jogador.dropouts + ' · mão ' + jogador.mao.length + '</small></div>';
  },

  /** Tela de resultado: vencedor, critério, redes, placar de tentos e conquistas novas. */
  mostrarResultado(vencedor, ganho, completa, novas) {
    const mao = this.mao, partida = this.partida;
    const nome = mao.jogadores[vencedor].nome;
    const titulo = this.doisHumanos ? nome + ' vence a mão' : vencedor === 0 ? 'Você venceu a mão!' : nome + ' venceu a mão';
    const motivo = completa ? 'Critério: ' + mao.resultado.motivo + '.' : mao.jogadores[1 - vencedor].nome + ' correu do truco.';
    let html = '<div class="folha"><h2>' + escaparHtml(titulo) + '</h2><p>' + escaparHtml(motivo) + '</p>';
    if (completa) html += '<div class="resultado-grade">' + this.htmlDaRede(0) + this.htmlDaRede(1) + '</div>';
    if (partida.alvo > 1) {
      html += '<div class="tentos">+' + ganho + (ganho === 1 ? ' tento' : ' tentos') + ' para ' + escaparHtml(nome) +
        ' · placar <span class="grande">' + partida.tentos[0] + ' × ' + partida.tentos[1] + '</span> (até ' + partida.alvo + ')</div>';
      if (partida.encerrada) html += '<p><b>' + escaparHtml(mao.jogadores[partida.vencedor].nome) + ' venceu a partida!</b></p>';
    }
    if (novas.length) {
      html += '<h3>Conquistas desbloqueadas</h3><div class="desbloqueios">' + novas.map((c) => {
        const graduacao = GRADUACOES[c.graduacao];
        return '<div class="desbloqueio">' + medalhaHtml(c, true) + '<div><span class="selo" style="background:' + graduacao.cor + ';color:#24140a">' +
          graduacao.nome + '</span> ' + escaparHtml(c.nome) + '<br><small>' + escaparHtml(c.descricao) + '</small></div></div>';
      }).join('') + '</div>';
    }
    const partidaAcabou = partida.encerrada || partida.alvo <= 1;
    html += '<div class="linha fim" style="margin-top:16px"><button class="botao discreto" id="r-menu">Menu</button>' +
      '<button class="botao vinho" id="r-proxima">' + (partidaAcabou ? 'Nova partida' : 'Próxima mão') + '</button></div></div>';
    const painel = abrirPainel(html);
    painel.elemento.querySelector('#r-menu').addEventListener('click', () => { painel.fechar(); this.app.irParaMenu(); });
    painel.elemento.querySelector('#r-proxima').addEventListener('click', () => {
      painel.fechar();
      if (partidaAcabou) this.partida = novaPartida(this.opcoes.alvo);
      else proximaMao(this.partida);
      this.iniciarMao();
    });
  },
};
