/**
 * @file Parte da CenaMesa: respostas a toques e cliques do jogador. Passar o cursor nos
 * neurônios, clicar neles, selecionar cartas da mão, dropout, transfer, passar a vez e voltar ao menu.
 *
 * Modos de seleção (`this.modo`): 'livre' (padrão), 'inicio' (escolher a carta que decide quem
 * começa), 'dropout' (escolher até onde desfazer) e 'pagarDropout' (escolher as cartas que pagam).
 */
import { rotuloCarta } from '../../nucleo/cartas.js';
import { nomeCamada } from '../../nucleo/rede.js';
import { valorParaTransfer, podePassar } from '../../nucleo/partida.js';
import { Som } from '../../interface/som.js';
import { confirmar, abrirPainel } from '../../interface/paineis.js';
import { abrirRegras } from '../../interface/telas/regras.js';
import { abrirGrimorio } from '../../interface/telas/grimorio.js';
import { texturaDeInspecao } from '../recursos.js';
import { colunaX, linhaY } from './layout.js';

export const metodosDeEntrada = {
  /** Cursor sobre um neurônio: mostra a carta na inspeção e explica o efeito de clicar. */
  aoPassarNoNeuronio(id, entrando) {
    const mao = this.mao, n = mao.neuronios[id], baralho = mao.config.baralho;
    if (!entrando) { this.dicaDoCursor = null; this.mostrarDica(this.textoComDicaDeJogo()); return; }
    if (n.removido) return;
    if (n.revelado) {
      const dono = n.dono >= 0 ? mao.jogadores[n.dono].nome : '';
      const pontuado = n.dono >= 0 ? this.pontuacoes[n.dono].neuronios.find((x) => x.neuronio.id === id) : null;
      this.inspecionar(texturaDeInspecao(this, n.cartas[0], baralho), 'Neurônio de ' + dono +
        (pontuado ? ': vale ' + pontuado.pontos + (pontuado.notas.length ? ' (' + pontuado.notas.join(', ') + ')' : '') : '') +
        (n.cartas.length > 1 ? ' · ' + n.cartas.length + ' cartas empilhadas' : ''));
    } else if (n.conhecido) {
      this.inspecionar(texturaDeInspecao(this, n.cartas[0], baralho), 'Neurônio conhecido: ' + rotuloCarta(n.cartas[0]) + '.');
    } else {
      this.inspecionar(this.verso('inspecao'), nomeCamada(n.camada, mao.camadas.length) + ': neurônio desconhecido.');
    }
    const alvo = this.alvos[id];
    if (!alvo) return;
    const vitima = n.dono >= 0 ? mao.jogadores[n.dono].nome : '';
    const carta = rotuloCarta(n.cartas[0]);
    const explicacao = {
      ativar: 'Ativar este neurônio na sua rede.',
      tunagem: 'Tunagem: empilha ' + this.selecao.length + ' carta(s) em ' + carta + ' e soma à sua rede. Em figura, a carta entra na sequência de figuras iguais.',
      overfit: 'Overfit: ' + carta + ' de ' + vitima + ' vai para o cemitério e a rede recua uma camada.',
      earlystop: alvo.proprio ? 'Early stop na própria rede: ela congela agora e ' + carta + ' some. Tem certeza?' : 'Early stop: a rede de ' + vitima + ' é finalizada agora, sem ' + carta + '.',
      stackoverflow: alvo.proprio ? 'Stack overflow na própria rede: você perde a rede e a mão. Desk rejection garantida.' : 'Stack overflow: ' + vitima + ' perde a rede aqui e todas as cartas da mão.',
      dropout: 'Dropout de ' + alvo.n + ' camada(s), custando ' + alvo.n + ' carta(s) da mão. Os neurônios desfeitos vão para o cemitério.',
    }[alvo.tipo];
    this.dicaDoCursor = explicacao;
    this.mostrarDica(explicacao);
  },

  /** Clique num neurônio: ativa, empilha as cartas selecionadas ou escolhe o alcance do dropout. */
  aoClicarNoNeuronio(id) {
    if (!this.ehVezDoHumano()) return;
    const alvo = this.alvos[id];
    if (!alvo) {
      const n = this.mao.neuronios[id];
      if (this.selecao.length) this.textoFlutuante(colunaX(n.camada), linhaY(n.camada, n.posicao), 'não encaixa', '#ffb3a8', 16);
      return;
    }
    this.dicaDoCursor = null;
    const eu = this.quemVe;
    if (alvo.tipo === 'ativar') return this.executarJogada({ tipo: 'ativar', jogador: eu, neuronio: id });
    if (alvo.tipo === 'dropout') {
      this.modo = 'pagarDropout';
      this.camadasDropout = alvo.n;
      this.selecao = [];
      this.redesenhar();
      return;
    }
    this.executarJogada({ tipo: 'empilhar', jogador: eu, neuronio: id, cartas: this.selecao.slice() });
  },

  /** Clique numa carta da mão: escolhe a carta de início, paga o dropout ou monta a seleção. */
  aoClicarNaCarta(idCarta) {
    const mao = this.mao, eu = this.quemVe;
    if (mao.fase === 'inicio' && this.modo === 'inicio') {
      this.modo = 'livre';
      Som.colocarCarta();
      this.executarJogada({ tipo: 'inicio', jogador: eu, carta: idCarta });
      return;
    }
    if (!this.ehVezDoHumano()) return;
    Som.selecionar();
    const i = this.selecao.indexOf(idCarta);
    if (this.modo === 'pagarDropout') {
      if (i >= 0) this.selecao.splice(i, 1);
      else if (this.selecao.length < this.camadasDropout) this.selecao.push(idCarta);
      if (this.selecao.length === this.camadasDropout) {
        this.executarJogada({ tipo: 'dropout', jogador: eu, n: this.camadasDropout, pagamento: this.selecao.slice() });
        return;
      }
      this.redesenhar();
      return;
    }
    if (this.modo === 'dropout') this.modo = 'livre';
    const carta = mao.jogadores[eu].mao.find((c) => c.id === idCarta);
    if (i >= 0) this.selecao.splice(i, 1);
    else {
      /* só cartas do mesmo valor podem ser empilhadas juntas */
      const valor = this.valorSelecionado();
      if (valor && valor !== carta.valor) this.selecao = [];
      this.selecao.push(idCarta);
    }
    this.redesenhar();
  },

  /** Esc: limpa a seleção e sai do modo de dropout. */
  cancelarSelecao() {
    if (!this.selecao.length && this.modo === 'livre') return;
    this.selecao = [];
    if (this.modo !== 'inicio') this.modo = 'livre';
    this.redesenhar();
  },

  /** Botão Dropout: entra ou sai do modo de escolher o alcance. */
  alternarDropout() {
    this.modo = this.modo === 'dropout' || this.modo === 'pagarDropout' ? 'livre' : 'dropout';
    this.selecao = [];
    this.redesenhar();
  },

  /** Botão Transfer: troca as quatro cartas iguais da mão. */
  fazerTransfer() {
    const eu = this.quemVe, valor = valorParaTransfer(this.mao, eu);
    if (!valor) return;
    const cartas = this.mao.jogadores[eu].mao.filter((c) => c.valor === valor).slice(0, 4).map((c) => c.id);
    this.executarJogada({ tipo: 'transfer', jogador: eu, cartas });
  },

  /** Botão Passar a vez. */
  passarAVez() {
    if (this.ehVezDoHumano() && podePassar(this.mao, this.quemVe)) this.executarJogada({ tipo: 'passar', jogador: this.quemVe });
  },

  /** Botão Menu: confirma antes de abandonar a partida. */
  /**
   * Botão REGRAS da mesa: como jogar, Grimório e a chave das dicas, numa janela só.
   */
  abrirRegrasDaMesa() {
    const dicas = this.app.dicasLigadas;
    const painel = abrirPainel(
      '<div class="folha estreita janela-da-mesa"><h2>Regras</h2>' +
      '<p>Consulte as regras, os conceitos de redes neurais do Grimório ou ligue as dicas durante a partida.</p>' +
      '<div class="grade-de-botoes">' +
      '<button class="botao" data-opcao="regras">Como jogar</button>' +
      '<button class="botao" data-opcao="grimorio">Grimório</button>' +
      '<button class="botao ' + (dicas ? 'discreto' : 'vinho') + '" data-opcao="dicas" data-chave="dicas">' + (dicas ? 'Desligar dicas' : 'Ativar dicas') + '</button>' +
      '<button class="botao discreto" data-fechar>Voltar ao jogo</button>' +
      '</div></div>', { fechaAoClicarFora: true });
    const acoes = {
      regras: () => abrirRegras(null),
      grimorio: () => abrirGrimorio(this.app),
      dicas: () => this.alternarDicas(),
    };
    painel.elemento.querySelectorAll('[data-opcao]').forEach((b) => b.addEventListener('click', () => {
      painel.fechar();
      acoes[b.dataset.opcao]();
    }));
    return painel;
  },

  /**
   * Botão MENU da mesa: som e música (a janela fica aberta para ligar e desligar), voltar ao jogo
   * ou abandonar a partida.
   */
  abrirMenuDaMesa() {
    const painel = abrirPainel(
      '<div class="folha estreita janela-da-mesa"><h2>Menu</h2>' +
      '<div class="grade-de-botoes">' +
      '<button class="botao" data-chave="som"></button>' +
      '<button class="botao" data-chave="musica"></button>' +
      '<button class="botao discreto" data-fechar>Voltar ao jogo</button>' +
      '<button class="botao vinho" data-opcao="sair">Sair da partida</button>' +
      '</div></div>', { fechaAoClicarFora: true });
    const q = (seletor) => painel.elemento.querySelector(seletor);
    q('[data-chave="som"]').addEventListener('click', () => { this.app.alternarSom(); this.atualizarChaves(); });
    q('[data-chave="musica"]').addEventListener('click', () => { this.app.alternarMusica(this.opcoes.terreno); this.atualizarChaves(); });
    q('[data-opcao="sair"]').addEventListener('click', () => { painel.fechar(); this.perguntarSeVoltaAoMenu(); });
    this.atualizarChaves();
    return painel;
  },

  perguntarSeVoltaAoMenu() {
    confirmar('Abandonar a partida?', 'O placar de tentos desta partida será perdido. Conquistas já desbloqueadas ficam salvas.', [
      { rotulo: 'Continuar jogando', classe: 'discreto' },
      { rotulo: 'Voltar ao menu', classe: 'vinho', acao: () => this.app.irParaMenu() },
    ]);
  },
};
