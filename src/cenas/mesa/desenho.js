/**
 * @file Parte da CenaMesa: desenhar o estado da mão na tela. Neurônios, mãos, placar, curva de
 * treino, dica do turno, alvos destacados e as conexões animadas entre os neurônios de cada rede.
 *
 * Nada aqui muda as regras; só lê `this.mao` e `this.partida`.
 */
import { TAMANHO_CARTA } from '../../configuracao.js';
import { rotuloCarta, NAIPE } from '../../nucleo/cartas.js';
import { BARALHOS } from '../../nucleo/baralhos.js';
import { TERRENOS } from '../../nucleo/terrenos.js';
import { ehOculta, nomeCamada } from '../../nucleo/rede.js';
import { pontuarRede } from '../../nucleo/pontuacao.js';
import {
  alvosDeAtivacao, alvosDeEmpilhamento, podeEmpilhar, efeitoDoEmpilhamento,
  camadasDesfaziveis, valorParaTransfer, podePassar, fronteira,
} from '../../nucleo/partida.js';
import { podeTrucar, proximoValor, ehMaoDeOnze, GRITO_TRUCO } from '../../nucleo/truco.js';
import { OPONENTES } from '../../nucleo/oponentes/index.js';
import { texturaDaCartaNaMao, texturaDaCartaNaMesa, texturaDeInspecao } from '../recursos.js';
import {
  PAINEL_ESQ, PAINEL_DIR, ESQ, DIR, colunaX, linhaY, COR_JOGADOR, COR_JOGADOR_CSS, COR_DO_ALVO, NOME_SITUACAO,
  ajustarCartaDaMesa, ajustarLinha, ajustarBloco,
} from './layout.js';

export const metodosDeDesenho = {
  /** Mostra uma textura na inspeção, com uma nota explicativa embaixo. */
  inspecionar(textura, nota) {
    this.painel.inspecao.setTexture(textura).setDisplaySize(TAMANHO_CARTA.inspecaoL, TAMANHO_CARTA.inspecaoA);
    ajustarBloco(this.painel.notaInspecao, nota || '', 12, PAINEL_ESQ.l - 30, 40, 9.5);
  },

  /** Mostra a dica do turno no rodapé do painel esquerdo. */
  mostrarDica(texto) {
    ajustarBloco(this.painel.dica, texto, 14, PAINEL_ESQ.l - 28, ESQ.botoes - 22 - ESQ.dica, 10);
  },

  /** Redesenha tudo a partir do estado: pontuações, alvos, neurônios, mãos e painéis. */
  redesenhar() {
    const mao = this.mao, baralho = mao.config.baralho;
    this.pontuacoes = mao.jogadores.map((_, j) => pontuarRede(mao, j));
    this.calcularAlvos();
    this.camadaVazios.clear();
    for (const camada of mao.camadas) {
      for (const n of camada) {
        const v = this.visuais[n.id];
        if (n.removido) {
          v.imagem.setVisible(false); v.pilha.setVisible(false); v.memoria.setVisible(false);
          this.camadaVazios.lineStyle(1.5, 0xd9b260, 0.28);
          this.camadaVazios.strokeRoundedRect(v.imagem.x - 31, v.imagem.y - 43, 62, 87, 6);
          continue;
        }
        v.imagem.setVisible(true);
        if (n.revelado) {
          ajustarCartaDaMesa(v.imagem.setTexture(texturaDaCartaNaMesa(this, n.cartas[0], baralho)));
          v.memoria.setVisible(false);
        } else {
          ajustarCartaDaMesa(v.imagem.setTexture(this.verso('mesa')));
          v.memoria.setVisible(n.conhecido).setText(n.conhecido ? 'lembra: ' + rotuloCarta(n.cartas[0]) : '');
        }
        v.pilha.setVisible(n.cartas.length > 1).setText('×' + n.cartas.length);
      }
    }
    this.desenharMaos();
    this.atualizarPaineis();
  },

  /** Desenha a mão do jogador de baixo (aberta) e a do de cima (versos). */
  desenharMaos() {
    const mao = this.mao, baralho = mao.config.baralho;
    for (const c of this.cartasDaMao) c.destroy();
    for (const c of this.cartasDoAdversario) c.destroy();
    this.cartasDaMao = []; this.cartasDoAdversario = [];
    const debaixo = this.jogadorDeBaixo();
    const aberta = this.quemVe >= 0;
    const cartas = mao.jogadores[debaixo].mao;
    const espaco = Math.min(104, 640 / Math.max(1, cartas.length));
    cartas.forEach((carta, i) => {
      const x = 610 + (i - (cartas.length - 1) / 2) * espaco;
      const y = this.selecao.includes(carta.id) ? 632 : 652;
      const imagem = this.add.image(x, y, aberta ? texturaDaCartaNaMao(this, carta, baralho) : this.verso('mao'))
        .setDisplaySize(TAMANHO_CARTA.maoL, TAMANHO_CARTA.maoA).setDepth(10 + i);
      imagem.yBase = y;
      imagem.idCarta = carta.id;
      if (aberta) {
        imagem.setInteractive({ useHandCursor: true });
        imagem.on('pointerover', () => { imagem.y = imagem.yBase - 8; this.inspecionar(texturaDeInspecao(this, carta, baralho), this.notaDaCartaDaMao(carta)); });
        imagem.on('pointerout', () => { imagem.y = imagem.yBase; });
        imagem.on('pointerdown', () => this.aoClicarNaCarta(carta.id));
      }
      this.cartasDaMao.push(imagem);
    });
    const qtd = mao.jogadores[this.jogadorDeCima()].mao.length;
    for (let i = 0; i < qtd; i++) {
      this.cartasDoAdversario.push(this.add.image(560 + (i - (qtd - 1) / 2) * 34, 40, this.verso('mesa'))
        .setDisplaySize(41, 57).setDepth(7).setAngle((i - (qtd - 1) / 2) * 4));
    }
    this.camadaSelecao.clear();
    for (const imagem of this.cartasDaMao) {
      if (!this.selecao.includes(imagem.idCarta)) continue;
      this.camadaSelecao.lineStyle(4, this.modo === 'pagarDropout' ? COR_DO_ALVO.dropout : 0xf6dc8f, 1);
      this.camadaSelecao.strokeRoundedRect(imagem.x - 50, imagem.y - 69, 100, 138, 10);
    }
  },

  /** Nota da inspeção para uma carta da mão: onde ela pode ser usada agora. */
  notaDaCartaDaMao(carta) {
    const eu = this.quemVe;
    const alvos = alvosDeEmpilhamento(this.mao).filter((n) => n.cartas[0].valor === carta.valor);
    if (!alvos.length) return 'Sem alvo para esta carta agora. Guarde para tunar, atacar ou pagar dropouts.';
    return 'Clique para selecionar. Mesma figura de: ' + alvos.map((n) => rotuloCarta(n.cartas[0]) + (n.dono === eu ? ' (sua)' : ' (adversário)')).join(', ') + '.';
  },

  /** Atualiza os textos e botões dos painéis. */
  atualizarPaineis() {
    const mao = this.mao, p = this.painel, partida = this.partida;
    const cima = this.jogadorDeCima(), baixo = this.jogadorDeBaixo();
    ajustarLinha(p.tituloMao, 'MÃO ' + (partida.numeroMao + 1) + ' · VALE ' + partida.valor + (partida.valor === 1 ? ' TENTO' : ' TENTOS'), 16, PAINEL_DIR.l - 28, 11);
    ajustarLinha(p.subtitulo, partida.alvo <= 1 ? 'Mão única, sem truco' : ehMaoDeOnze(partida) ? 'Mão de onze: ninguém pode trucar' : 'Partida até ' + partida.alvo + ' tentos', 12.5, PAINEL_DIR.l - 28, 10);
    [cima, baixo].forEach((j, i) => this.atualizarBlocoDoJogador(p.blocos[i], j));
    const baralho = mao.config.baralho;
    this.atualizarPilha(p.limbo, 'LIMBO', mao.limbo.length, null);
    const topo = mao.cemiterio[mao.cemiterio.length - 1];
    this.atualizarPilha(p.cemiterio, 'CEMITÉRIO', mao.cemiterio.length, topo ? texturaDaCartaNaMesa(this, topo, baralho) : null);
    const extra = [];
    if (mao.config.terreno !== 'neutro') extra.push('Rodada ' + mao.rodada);
    if (mao.config.terreno === 'oceano' && mao.vento) extra.push('vento: ' + NAIPE[mao.vento].nome + ' vale dobro');
    ajustarBloco(p.textoTerreno, TERRENOS[mao.config.terreno].nome + ' · baralho ' + BARALHOS[mao.config.baralho].nome + (extra.length ? '\n' + extra.join(' · ') : ''), 12, PAINEL_ESQ.l - 30, 34, 9);
    this.atualizarBotoes();
    this.atualizarRegistro();
    this.desenharCurva();
    this.mostrarDica(this.dicaDoCursor || this.textoComDicaDeJogo());
  },

  /** Dica do turno e, com as dicas ligadas, o título da dica de jogo atual. */
  textoComDicaDeJogo() {
    const dica = this.textoDaDicaDeJogo();
    return this.textoDaDica() + (dica ? '\n' + dica : '');
  },

  /**
   * Desenha uma pilha (limbo ou cemitério): a carta do topo (ou o verso), bordas de cartas
   * empilhadas por baixo quando há mais de uma, o contador e o rótulo.
   * @param {string|null} texturaDoTopo Carta virada para cima; null mostra o verso.
   */
  atualizarPilha(pilha, nome, quantidade, texturaDoTopo) {
    const { l, a } = ESQ.pilha, g = pilha.camadas;
    const camadas = Math.min(4, Math.max(0, quantidade - 1)); /* bordas visíveis por baixo do topo */
    const desvio = 3; /* deslocamento de cada carta da pilha, para cima e para a direita */
    g.clear();
    if (quantidade === 0) {
      /* lugar vazio: só o contorno tracejado da carta */
      g.lineStyle(1.5, 0xd9b260, 0.35); g.strokeRoundedRect(pilha.x - l / 2, pilha.y - a / 2, l, a, 6);
    }
    for (let k = camadas; k >= 1; k--) {
      const x = pilha.x - l / 2 + k * desvio, y = pilha.y - a / 2 - k * desvio;
      g.fillStyle(0x0b0907, 1); g.fillRoundedRect(x, y, l, a, 6);
      g.fillStyle(0xe9dcbc, 1); g.fillRoundedRect(x + 1.5, y + 1.5, l - 3, a - 3, 5);
      g.lineStyle(1, 0x7a6a4c, 0.8); g.strokeRoundedRect(x + 1.5, y + 1.5, l - 3, a - 3, 5);
    }
    pilha.carta.setTexture(texturaDoTopo || this.verso('mesa')).setDisplaySize(l, a).setVisible(quantidade > 0);
    pilha.contador.setVisible(quantidade > 1).setText('\u00d7' + quantidade);
    ajustarLinha(pilha.rotulo, nome, 11, 110, 8);
  },

  /** Bloco de placar de um jogador: avatar, nome, nível, situação, detalhes, tentos e soma. */
  atualizarBlocoDoJogador(b, j) {
    const mao = this.mao, jogador = mao.jogadores[j], partida = this.partida;
    const naVez = this.estaNaVez(j);
    const g = b.grafico, cor = COR_JOGADOR[j];
    g.clear();
    g.fillStyle(naVez ? 0x12261b : 0x000000, naVez ? 0.95 : 0.3); g.fillRoundedRect(b.x, b.y, b.l, b.a, 8);
    g.fillStyle(cor, 1); g.fillRoundedRect(b.x, b.y, naVez ? 8 : 5, b.a, { tl: 8, bl: 8, tr: 0, br: 0 });
    g.lineStyle(naVez ? 2.5 : 1, naVez ? cor : 0xd9b260, naVez ? 1 : 0.22); g.strokeRoundedRect(b.x, b.y, b.l, b.a, 8);
    /* avatar: aceso e com aro na cor do jogador quando é a vez dele; apagado quando não é */
    b.avatar.setTexture(this.avatarDe(j)).setDisplaySize(DIR.avatar, DIR.avatar).setAlpha(naVez ? 1 : 0.55);
    if (naVez) { g.lineStyle(3, cor, 1); g.strokeCircle(b.avatar.x, b.avatar.y, DIR.avatar / 2 + 3); }
    b.selo.setVisible(naVez).setBackgroundColor(COR_JOGADOR_CSS[j]).setText(j === this.quemVe ? 'SUA VEZ' : 'NA VEZ');
    /* nome e nível vão até a coluna da soma (canto superior direito); as linhas de baixo usam a largura toda */
    const larguraAteSoma = b.x + b.l - 12 - 62 - b.textoX, larguraTexto = b.x + b.l - 12 - b.textoX;
    ajustarLinha(b.nome.setColor(COR_JOGADOR_CSS[j]), jogador.nome, 15, larguraAteSoma, 10);
    /* linha de nível: perfil do oponente; `notaDoOponente` ("pensando…", simulação) tem prioridade */
    const perfil = OPONENTES[jogador.oponente];
    const nivel = perfil ? (this.notaDoOponente || perfil.nivel + ' \u00b7 ' + perfil.metodo) : (this.doisHumanos ? 'Jogador humano' : 'Você joga com o azul');
    ajustarLinha(b.nivel, nivel, 12, larguraAteSoma, 9);
    const travada = jogador.situacao === 'construindo' && mao.fase === 'jogo' && alvosDeAtivacao(mao, j).length === 0;
    ajustarLinha(b.situacao, ((travada ? 'travada' : NOME_SITUACAO[jogador.situacao]) + ' \u00b7 camada ' + Math.max(0, jogador.caminho.length - 1) + '/6').toUpperCase(), 9.5, larguraTexto, 7.5);
    ajustarLinha(b.detalhe, 'Mão ' + jogador.mao.length + ' \u00b7 Dropouts ' + jogador.dropouts + (jogador.transferUsado ? ' \u00b7 TL usado' : ''), 12, larguraTexto, 9);
    if (partida.alvo > 1) {
      /* tentos como grãos de feijão do truco */
      for (let k = 0; k < Math.min(12, partida.alvo); k++) {
        const px = b.textoX + 4 + k * 9, py = b.y + 89;
        if (k < partida.tentos[j]) { g.fillStyle(cor, 1); g.fillCircle(px, py, 3.2); g.lineStyle(1, 0xffffff, 0.5); g.strokeCircle(px, py, 3.2); }
        else { g.lineStyle(1, 0xd9b260, 0.45); g.strokeCircle(px, py, 2.8); }
      }
      b.tentos.setVisible(true);
      ajustarLinha(b.tentos, partida.tentos[j] + (partida.tentos[j] === 1 ? ' tento' : ' tentos'), 11, 70, 8.5);
    } else b.tentos.setVisible(false);
    const pontuacao = this.pontuacoes[j];
    ajustarLinha(b.soma.setColor(pontuacao.vanishing ? '#ff7b88' : '#f6ecd6'), String(pontuacao.total), 34, 60, 18);
  },

  /** O jogador `j` está na vez (e a mão está em andamento)? */
  estaNaVez(j) {
    return this.mao.fase === 'jogo' && this.mao.vez === j && !this.encerrada;
  },

  /** Brilho pulsante em volta do bloco de placar de quem está na vez (desenhado a cada quadro). */
  desenharDestaqueDaVez(tempo) {
    const g = this.camadaVez;
    g.clear();
    const indice = [this.jogadorDeCima(), this.jogadorDeBaixo()].findIndex((j) => this.estaNaVez(j));
    if (indice < 0) return;
    const b = this.painel.blocos[indice], cor = COR_JOGADOR[this.mao.vez];
    const pulso = 0.5 + 0.5 * Math.sin(tempo / 260);
    for (let k = 1; k <= 3; k++) {
      g.lineStyle(2, cor, (0.38 - k * 0.1) * (0.5 + pulso));
      g.strokeRoundedRect(b.x - k * 2.5, b.y - k * 2.5, b.l + k * 5, b.a + k * 5, 8 + k * 2);
    }
    g.lineStyle(2, cor, 0.35 + 0.5 * pulso);
    g.strokeCircle(b.avatar.x, b.avatar.y, DIR.avatar / 2 + 6 + pulso * 3);
  },

  /** Habilita os botões conforme o que o jogador pode fazer agora. */
  atualizarBotoes() {
    const p = this.painel, mao = this.mao, eu = this.quemVe, partida = this.partida;
    const minhaVez = this.ehVezDoHumano();
    p.botaoDropout.habilitar(minhaVez && camadasDesfaziveis(mao, eu) > 0 && mao.jogadores[eu].mao.length > 0);
    p.botaoDropout.definirRotulo(this.modo === 'dropout' || this.modo === 'pagarDropout' ? 'Cancelar' : 'Dropout');
    p.botaoTransfer.habilitar(minhaVez && !!valorParaTransfer(mao, eu));
    p.botaoPassar.habilitar(minhaVez && podePassar(mao, eu));
    p.truco.habilitar(minhaVez && podeTrucar(partida, eu));
    const proximo = proximoValor(partida.valor);
    p.truco.definirRotulo(partida.alvo <= 1 ? 'SEM TRUCO' : ehMaoDeOnze(partida) ? 'MÃO DE ONZE' : proximo ? GRITO_TRUCO[proximo] : 'VALE TUDO');
  },

  /** Registro de jogadas: as linhas mais recentes que couberem. */
  atualizarRegistro() {
    const registro = this.painel.registro;
    const linhas = this.mao.registro.slice(-10);
    registro.setFontSize(12).setWordWrapWidth(PAINEL_DIR.l - 24);
    registro.setText(linhas.join('\n'));
    while (linhas.length > 1 && registro.height > DIR.alturaRegistro) { linhas.shift(); registro.setText(linhas.join('\n')); }
  },

  /** Curva de treino: soma de cada rede a cada turno. */
  desenharCurva() {
    const g = this.camadaCurva, historico = this.mao.historico;
    g.clear();
    const x0 = PAINEL_DIR.x + 12, l = PAINEL_DIR.l - 24, topo = DIR.curva, a = DIR.alturaCurva;
    g.fillStyle(0x000000, 0.3); g.fillRoundedRect(x0, topo, l, a, 6);
    g.lineStyle(1, 0xd9b260, 0.2); g.strokeRoundedRect(x0, topo, l, a, 6);
    let maximo = 40;
    for (const linha of historico) for (const v of linha) maximo = Math.max(maximo, v);
    maximo = Math.ceil(maximo / 20) * 20;
    this.painel.maximoCurva.setText(maximo + ' pts');
    const ix = x0 + 8, il = l - 16, base = topo + a - 8, ia = a - 20;
    g.lineStyle(1, 0xd9b260, 0.15);
    for (const f of [0.5, 1]) g.lineBetween(ix, base - ia * f, ix + il, base - ia * f);
    const pontos = Math.max(2, historico.length);
    for (const j of [0, 1]) {
      g.lineStyle(2.5, COR_JOGADOR[j], 1);
      g.beginPath();
      historico.forEach((linha, i) => {
        const x = ix + (i / (pontos - 1)) * il, y = base - (linha[j] / maximo) * ia;
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      });
      g.strokePath();
      const ultimo = historico[historico.length - 1];
      if (ultimo) { g.fillStyle(COR_JOGADOR[j], 1); g.fillCircle(ix + ((historico.length - 1) / (pontos - 1)) * il, base - (ultimo[j] / maximo) * ia, 3.5); }
    }
  },

  /** Texto de ajuda do momento, conforme a fase e o modo de seleção. */
  textoDaDica() {
    const mao = this.mao, eu = this.quemVe;
    if (this.encerrada) return 'Fim da mão.';
    if (this.partida.pedido) return 'Truco na mesa! Aguardando resposta.';
    if (mao.fase === 'inicio') {
      if (this.modo === 'inicio') return mao.config.inicio === 'revela-descarta'
        ? 'Escolha uma carta da mão para revelar. A mais alta começa. Ela vai para o cemitério.'
        : 'Escolha uma carta da mão para revelar. A mais alta começa. Ela volta para a sua mão.';
      return 'Decidindo quem começa…';
    }
    const daVez = mao.jogadores[mao.vez];
    if (!this.ehVezDoHumano()) return daVez.tipo === 'oponente' ? daVez.nome + ' está pensando…' : mao.vez === eu ? 'Sua vez.' : 'Vez de ' + daVez.nome + '.';
    if (this.modo === 'dropout') return 'Dropout: clique no neurônio oculto da sua rede até onde quer desfazer. Cada camada custa 1 carta da mão. Esc cancela.';
    if (this.modo === 'pagarDropout') return 'Escolha ' + this.camadasDropout + ' carta(s) da mão para pagar o dropout (' + this.selecao.length + '/' + this.camadasDropout + '). Esc cancela.';
    if (this.selecao.length) {
      const valor = this.valorSelecionado();
      return Object.keys(this.alvos).length
        ? 'Clique num neurônio destacado para usar ' + this.selecao.length + ' carta(s) ' + valor + '. Verde é tunagem; laranja e vermelho atacam.'
        : 'Nenhum neurônio aceita ' + valor + ' agora. Ações só valem no último neurônio oculto de uma rede, com a mesma figura.';
    }
    const jogador = mao.jogadores[eu];
    if (jogador.situacao !== 'construindo') return 'Sua rede está finalizada. Ainda dá para atacar a fronteira do adversário com cartas da mão, ou passar a vez.';
    if (!alvosDeAtivacao(mao, eu).length) return 'Não há neurônio livre na camada ' + nomeCamada(jogador.caminho.length) + '. Faça dropout para recuar ou passe a vez.';
    return 'Sua vez: ative um neurônio da camada ' + nomeCamada(jogador.caminho.length) + ' (dourado) ou selecione cartas da mão para uma ação.';
  },

  /** Valor (A, 2…K) das cartas selecionadas na mão. */
  valorSelecionado() {
    const carta = this.mao.jogadores[this.quemVe].mao.find((c) => c.id === this.selecao[0]);
    return carta ? carta.valor : '';
  },

  /** Calcula quais neurônios podem ser clicados agora e com que efeito (em `this.alvos`). */
  calcularAlvos() {
    const mao = this.mao, eu = this.quemVe;
    this.alvos = {};
    if (mao.fase !== 'jogo' || !this.ehVezDoHumano()) return;
    if (this.modo === 'dropout') {
      const jogador = mao.jogadores[eu];
      jogador.caminho.forEach((id, i) => {
        if (i >= 1 && ehOculta(mao.neuronios[id].camada)) {
          const n = jogador.caminho.length - i;
          if (n <= jogador.mao.length) this.alvos[id] = { tipo: 'dropout', n };
        }
      });
      return;
    }
    if (this.modo === 'pagarDropout') return;
    if (this.selecao.length) {
      for (const n of alvosDeEmpilhamento(mao)) {
        if (!podeEmpilhar(mao, eu, n.id, this.selecao)) continue;
        const efeito = efeitoDoEmpilhamento(mao, eu, n, this.selecao.length);
        this.alvos[n.id] = { tipo: efeito.tipo, proprio: efeito.proprio };
      }
      return;
    }
    for (const n of alvosDeAtivacao(mao, eu)) this.alvos[n.id] = { tipo: 'ativar' };
  },

  /**
   * Desenho contínuo (a cada quadro): contorno e conexões de cada rede, com espessura proporcional
   * ao valor, pulsos de "sinal" percorrendo as ligações e o contorno pulsante dos alvos.
   */
  desenharConexoesEAlvos(tempo) {
    const mao = this.mao, g = this.camadaConexoes;
    g.clear();
    mao.jogadores.forEach((jogador, j) => {
      const pontuacao = this.pontuacoes?.[j];
      for (let i = 0; i < jogador.caminho.length; i++) {
        const a = mao.neuronios[jogador.caminho[i]];
        const ax = colunaX(a.camada), ay = linhaY(a.camada, a.posicao);
        g.lineStyle(3, COR_JOGADOR[j], 0.95); g.strokeRoundedRect(ax - 33, ay - 45, 66, 91, 7);
        if (i === jogador.caminho.length - 1) continue;
        const b = mao.neuronios[jogador.caminho[i + 1]];
        const bx = colunaX(b.camada), by = linhaY(b.camada, b.posicao);
        const pontos = pontuacao?.neuronios[i + 1] ? pontuacao.neuronios[i + 1].pontos : 2;
        const espessura = 1.5 + Math.min(9, pontos * 0.5);
        g.lineStyle(espessura, COR_JOGADOR[j], 0.55);
        g.lineBetween(ax + 31, ay, bx - 31, by);
        for (let k = 0; k < 2; k++) {
          const t = (tempo / 1100 + k * 0.5 + i * 0.13) % 1;
          g.fillStyle(0xffffff, 0.85);
          g.fillCircle(ax + 31 + (bx - ax - 62) * t, ay + (by - ay) * t, 2 + espessura * 0.15);
        }
      }
    });
    /* leque de candidatos, como no TensorFlow Playground */
    if (this.ehVezDoHumano() && !this.selecao.length && this.modo === 'livre') {
      const f = fronteira(mao, this.quemVe);
      if (f) {
        for (const id of Object.keys(this.alvos)) {
          const n = mao.neuronios[id];
          g.lineStyle(1, COR_JOGADOR[this.quemVe], 0.25);
          g.lineBetween(colunaX(f.camada) + 31, linhaY(f.camada, f.posicao), colunaX(n.camada) - 31, linhaY(n.camada, n.posicao));
        }
      }
    }
    const d = this.camadaDestaques;
    d.clear();
    const pulso = 0.55 + 0.45 * Math.sin(tempo / 180);
    if (this.modo === 'inicio') {
      for (const imagem of this.cartasDaMao) { d.lineStyle(3, 0xf6dc8f, pulso); d.strokeRoundedRect(imagem.x - 50, imagem.y - 69, 100, 138, 10); }
    }
    for (const [id, alvo] of Object.entries(this.alvos || {})) {
      const n = mao.neuronios[id];
      d.lineStyle(alvo.tipo === 'ativar' ? 2.5 : 4, COR_DO_ALVO[alvo.tipo], pulso);
      d.strokeRoundedRect(colunaX(n.camada) - 36, linhaY(n.camada, n.posicao) - 48, 72, 97, 9);
    }
  },
};
