/**
 * @file Parte da CenaMesa: elementos fixos da tela (molduras dos painéis, colunas das camadas),
 * botões e criação de todos os textos e imagens dos painéis.
 *
 * Os métodos daqui são copiados para CenaMesa.prototype; `this` é a cena.
 */
import { FONTES, RESOLUCAO, CORES, TAMANHO_CARTA } from '../../configuracao.js';
import { TOTAL_CAMADAS, CAMADA_SAIDA, TAMANHOS_CAMADAS, nomeCamada } from '../../nucleo/rede.js';
import { TERRENOS } from '../../nucleo/terrenos.js';
import { desenharBotao, MARGEM_BOTAO } from '../../arte/botoes.js';
import { Som } from '../../interface/som.js';
import { abrirRegras } from '../../interface/telas/regras.js';
import { abrirGrimorio } from '../../interface/telas/grimorio.js';
import { texturaDeInspecao } from '../recursos.js';
import { PAINEL_ESQ, PAINEL_DIR, ESQ, DIR, colunaX, linhaY, ajustarLinha } from './layout.js';

/** Cor do rótulo de cada variante de botão. */
const COR_ROTULO = { ouro: '#2a1606', vinho: '#fff0e0', pedra: '#f6ecd6' };

export const metodosDoCenario = {
  /** Molduras dos painéis laterais, divisórias e colunas das camadas com seus nomes. */
  desenharCenarioFixo() {
    const g = this.add.graphics().setDepth(0);
    for (const p of [PAINEL_ESQ, PAINEL_DIR]) {
      g.fillStyle(0x000000, 0.35); g.fillRoundedRect(p.x + 2, p.y + 4, p.l, p.a, 12);
      g.fillStyle(0x07150e, 0.82); g.fillRoundedRect(p.x, p.y, p.l, p.a, 12);
      g.lineStyle(1.5, CORES.ouro, 0.55); g.strokeRoundedRect(p.x, p.y, p.l, p.a, 12);
      g.lineStyle(1, CORES.ouro, 0.18); g.strokeRoundedRect(p.x + 4, p.y + 4, p.l - 8, p.a - 8, 9);
    }
    g.lineStyle(1, CORES.ouro, 0.25);
    for (const y of [ESQ.divisoria1, ESQ.divisoria2]) g.lineBetween(PAINEL_ESQ.x + 18, y, PAINEL_ESQ.x + PAINEL_ESQ.l - 18, y);
    for (let c = 0; c < TOTAL_CAMADAS; c++) {
      const imune = c === 0 || c === CAMADA_SAIDA;
      const topo = linhaY(c, 0) - 52, base = linhaY(c, TAMANHOS_CAMADAS[c] - 1) + 52;
      g.fillStyle(imune ? 0x2a1a08 : 0x000000, imune ? 0.35 : 0.18);
      g.fillRoundedRect(colunaX(c) - 42, topo, 84, base - topo, 10);
      if (imune) { g.lineStyle(1.5, 0xe8a7b8, 0.5); g.strokeRoundedRect(colunaX(c) - 42, topo, 84, base - topo, 10); }
      const rotulo = this.add.text(colunaX(c), 86, nomeCamada(c).toUpperCase(), { fontFamily: FONTES.titulo, fontStyle: '700', fontSize: '13px', color: imune ? '#f3c3cf' : '#e8d6a8', letterSpacing: 1 }).setOrigin(0.5).setDepth(1);
      ajustarLinha(rotulo, rotulo.text, 13, 90, 10);
      if (imune) this.add.text(colunaX(c), topo - 11, 'imune a ações', { fontFamily: FONTES.texto, fontStyle: 'italic', fontSize: '11.5px', color: '#f3c3cf' }).setOrigin(0.5).setDepth(1);
    }
    this.add.text(PAINEL_ESQ.x + PAINEL_ESQ.l / 2, ESQ.titulo, 'INSPEÇÃO', { fontFamily: FONTES.titulo, fontStyle: '700', fontSize: '12px', color: '#e8d6a8', letterSpacing: 2 }).setOrigin(0.5).setDepth(7);
  },

  /**
   * Cria um botão com textura própria e rótulo que se ajusta à largura.
   * O objeto devolvido ganha `definirRotulo(texto)` e `habilitar(sim)`.
   *
   * Com `opcoes.dica`, o botão mostra uma dica flutuante (modo "dicas" ligado): ao passar o mouse,
   * ou, no celular, ao segurar o botão apertado. Soltar depois de segurar não executa a ação,
   * para que dê para ler a dica sem jogar sem querer. A ação roda ao soltar o toque/clique.
   * @param {{variante?: 'ouro'|'vinho'|'pedra', tamanho?: number, dica?: string}} [opcoes]
   */
  criarBotao(x, y, l, a, rotulo, acao, opcoes = {}) {
    const variante = opcoes.variante || 'ouro';
    const textura = (estado) => {
      const chave = 'botao:' + variante + ':' + l + 'x' + a + ':' + estado;
      if (!this.textures.exists(chave)) this.textures.addCanvas(chave, desenharBotao(l, a, Math.min(RESOLUCAO, 2.5), variante, estado));
      return chave;
    };
    const botao = this.add.container(x, y).setDepth(8);
    const fundo = this.add.image(0, 0, textura('normal')).setDisplaySize(l + MARGEM_BOTAO * 2, a + MARGEM_BOTAO * 2);
    const tamanho = opcoes.tamanho || 14;
    const texto = this.add.text(0, -0.5, rotulo, { fontFamily: FONTES.titulo, fontStyle: '700', fontSize: tamanho + 'px', color: COR_ROTULO[variante], align: 'center' }).setOrigin(0.5);
    botao.add([fundo, texto]);
    botao.setSize(l, a);
    botao.setInteractive({ useHandCursor: true });
    botao.habilitado = true;
    const pintar = (estado) => fundo.setTexture(textura(estado)).setDisplaySize(l + MARGEM_BOTAO * 2, a + MARGEM_BOTAO * 2);
    const temDica = () => opcoes.dica && this.app.dicasLigadas;
    const mostrarDica = () => this.mostrarDicaDoBotao(opcoes.dica, x, y, l, a);
    let segurando = null, segurou = false;
    botao.on('pointerover', (ponteiro) => {
      if (botao.habilitado) pintar('foco');
      if (temDica() && !ponteiro.wasTouch) mostrarDica();
    });
    botao.on('pointerout', () => {
      pintar(botao.habilitado ? 'normal' : 'inativo');
      clearTimeout(segurando);
      if (!segurou) this.esconderDicaDoBotao();
    });
    botao.on('pointerdown', () => {
      segurou = false;
      clearTimeout(segurando);
      if (temDica()) segurando = setTimeout(() => { segurou = true; mostrarDica(); }, 450);
    });
    botao.on('pointerup', () => {
      clearTimeout(segurando);
      if (segurou) { segurou = false; setTimeout(() => this.esconderDicaDoBotao(), 2200); return; }
      if (botao.habilitado) { Som.selecionar(); acao(); }
    });
    botao.definirRotulo = (s) => { ajustarLinha(texto, s, tamanho, l - 18, 9); return botao; };
    botao.habilitar = (sim) => {
      if (botao.habilitado === sim) return botao;
      botao.habilitado = sim;
      pintar(sim ? 'normal' : 'inativo');
      texto.setColor(sim ? COR_ROTULO[variante] : variante === 'vinho' ? '#a77a7a' : '#8c7f63');
      return botao;
    };
    botao.definirRotulo(rotulo);
    return botao;
  },

  /** Cria os textos, imagens e botões dos painéis. Ficam em `this.painel`. */
  criarPaineis() {
    const p = (this.painel = {});
    this.criarPainelEsquerdo(p);
    this.criarPlacar(p);
    this.criarBotoesDeAcao(p);
    this.atualizarBotaoSom();
    this.atualizarChaves();
  },

  /** Atalho para criar texto na fonte do corpo, já na profundidade dos painéis. */
  criarTexto(x, y, s, estilo) {
    return this.add.text(x, y, s, { fontFamily: FONTES.texto, fontSize: '13px', color: '#efe3c6', ...(estilo || {}) }).setDepth(7);
  },

  /** Painel esquerdo: inspeção, limbo e cemitério (como pilhas), terreno e dica do turno. */
  criarPainelEsquerdo(p) {
    const titulo = { fontFamily: FONTES.titulo, fontStyle: '700' };
    const cx = PAINEL_ESQ.x + PAINEL_ESQ.l / 2;
    p.inspecao = this.add.image(cx, ESQ.inspecao, 'terreno-' + this.opcoes.terreno).setDisplaySize(TAMANHO_CARTA.inspecaoL, TAMANHO_CARTA.inspecaoA).setDepth(7);
    p.notaInspecao = this.criarTexto(cx, ESQ.nota, '', { fontStyle: 'italic', fontSize: '12px', color: '#d6c8a6', align: 'center', wordWrap: { width: PAINEL_ESQ.l - 30 }, lineSpacing: 0 }).setOrigin(0.5, 0);

    /* limbo e cemitério: cada um é uma pilha desenhada em `atualizarPilha` (desenho.js) */
    const rotuloPilha = { ...titulo, fontSize: '11px', color: '#e8d6a8', letterSpacing: 1 };
    const criarPilha = (x) => ({
      x, y: ESQ.pilhas,
      camadas: this.add.graphics().setDepth(7),
      carta: this.add.image(x, ESQ.pilhas, this.verso('mesa')).setDisplaySize(ESQ.pilha.l, ESQ.pilha.a).setDepth(8).setInteractive(),
      contador: this.criarTexto(x + ESQ.pilha.l / 2 - 2, ESQ.pilhas + ESQ.pilha.a / 2 - 2, '', {
        fontStyle: '800', fontSize: '12px', color: '#24170c', backgroundColor: '#f6dc8f', padding: { x: 5, y: 1 },
      }).setOrigin(0.5).setDepth(9),
      rotulo: this.criarTexto(x, ESQ.rotulosPilha, '', rotuloPilha).setOrigin(0.5, 0),
    });
    p.limbo = criarPilha(PAINEL_ESQ.x + 64);
    p.cemiterio = criarPilha(PAINEL_ESQ.x + PAINEL_ESQ.l - 64);
    p.limbo.carta.on('pointerover', () => this.inspecionar(this.verso('inspecao'),
      'Limbo: ' + (this.mao ? this.mao.limbo.length : 0) + ' carta(s) queimadas no início (ruído). Só voltam por transfer learning.'));
    p.cemiterio.carta.on('pointerover', () => {
      const ultima = this.mao?.cemiterio[this.mao.cemiterio.length - 1];
      this.inspecionar(ultima ? texturaDeInspecao(this, ultima, this.mao.config.baralho) : this.verso('inspecao'),
        'Cemitério: ' + (this.mao ? this.mao.cemiterio.length : 0) + ' carta(s) fora de jogo. Mostrando a do topo.');
    });

    p.textoTerreno = this.criarTexto(cx, ESQ.terreno, '', { fontSize: '12px', align: 'center', color: '#d6c8a6', wordWrap: { width: PAINEL_ESQ.l - 30 } }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    p.textoTerreno.on('pointerover', () => {
      const t = TERRENOS[this.opcoes.terreno];
      this.inspecionar('terreno-' + this.opcoes.terreno, t.nome + ': ' + t.resumo);
    });
    p.dica = this.criarTexto(PAINEL_ESQ.x + 14, ESQ.dica, '', { fontSize: '13.5px', color: '#efe3c6', wordWrap: { width: PAINEL_ESQ.l - 28 }, lineSpacing: 1 });

    /* chaves de dicas e música, no rodapé do painel esquerdo */
    const lb = (PAINEL_ESQ.l - 28 - 8) / 2, pedra = { tamanho: 12, variante: 'pedra' };
    p.botaoDicas = this.criarBotao(PAINEL_ESQ.x + 14 + lb / 2, ESQ.botoes, lb, 32, 'Ativar dicas', () => this.alternarDicas(), pedra);
    p.botaoMusica = this.criarBotao(PAINEL_ESQ.x + PAINEL_ESQ.l - 14 - lb / 2, ESQ.botoes, lb, 32, 'Música', () => {
      this.app.alternarMusica(this.opcoes.terreno);
      this.atualizarChaves();
    }, pedra);

    /* balão de fala do oponente (aponta para o avatar dele no placar) */
    p.balao = this.add.container(800, 40).setDepth(30).setVisible(false);
    p.fundoBalao = this.add.graphics();
    p.textoBalao = this.add.text(0, 0, '', { fontFamily: FONTES.texto, fontStyle: 'italic', fontSize: '15px', color: '#24170c', wordWrap: { width: 230 }, align: 'center' }).setOrigin(0.5);
    p.balao.add([p.fundoBalao, p.textoBalao]);
  },

  /**
   * Placar (painel direito): título da mão e um bloco por jogador com avatar, nome, nível,
   * situação, detalhes, tentos e soma da rede. O bloco de cima é o adversário de quem está vendo.
   */
  criarPlacar(p) {
    const titulo = { fontFamily: FONTES.titulo, fontStyle: '700' };
    const rx = PAINEL_DIR.x + 12, rl = PAINEL_DIR.l - 24, rc = PAINEL_DIR.x + PAINEL_DIR.l / 2;
    p.tituloMao = this.criarTexto(rc, DIR.tituloMao, '', { ...titulo, fontSize: '16px', color: '#f6dc8f', letterSpacing: 1 }).setOrigin(0.5);
    p.subtitulo = this.criarTexto(rc, DIR.subtitulo, '', { fontStyle: 'italic', fontSize: '12.5px', color: '#cdbf9e' }).setOrigin(0.5);
    p.blocos = [0, 1].map((i) => {
      const y = DIR.blocos + i * DIR.passoBloco;
      const b = { x: rx, y, l: rl, a: DIR.alturaBloco };
      const tx = rx + 14 + DIR.avatar + 10; /* início dos textos, depois do avatar */
      b.textoX = tx;
      b.grafico = this.add.graphics().setDepth(6);
      b.avatar = this.add.image(rx + 14 + DIR.avatar / 2, y + 44, 'avatar-p1').setDisplaySize(DIR.avatar, DIR.avatar).setDepth(7);
      b.selo = this.criarTexto(b.avatar.x, y + 86, 'NA VEZ', { ...titulo, fontSize: '10px', color: '#0d0a08', padding: { x: 6, y: 2 }, letterSpacing: 1 }).setOrigin(0.5).setDepth(8);
      b.nome = this.criarTexto(tx, y + 16, '', { ...titulo, fontSize: '15px' }).setOrigin(0, 0.5);
      b.nivel = this.criarTexto(tx, y + 34, '', { fontStyle: 'italic', fontSize: '12px', color: '#cdbf9e' }).setOrigin(0, 0.5);
      b.situacao = this.criarTexto(tx, y + 56, '', { ...titulo, fontSize: '9.5px', color: '#e0cc9a', letterSpacing: 0.8 }).setOrigin(0, 0.5);
      b.detalhe = this.criarTexto(tx, y + 72, '', { fontSize: '12px', color: '#cdbf9e' }).setOrigin(0, 0.5);
      b.tentos = this.criarTexto(tx + 12 * 9 + 4, y + 89, '', { fontSize: '11px', color: '#cdbf9e' }).setOrigin(0, 0.5);
      b.rotuloSoma = this.criarTexto(rx + rl - 12, y + 13, 'SOMA', { ...titulo, fontSize: '8.5px', color: '#9a8c6c', letterSpacing: 1 }).setOrigin(1, 0.5);
      b.soma = this.criarTexto(rx + rl - 12, y + 37, '0', { fontFamily: FONTES.titulo, fontStyle: '900', fontSize: '34px' }).setOrigin(1, 0.5);
      return b;
    });
    p.rotuloCurva = this.criarTexto(rx, DIR.rotuloCurva, 'CURVA DE TREINO', { ...titulo, fontSize: '10px', color: '#e0cc9a', letterSpacing: 1 }).setOrigin(0, 0.5);
    p.subCurva = this.criarTexto(rx + rl, DIR.rotuloCurva, 'soma da rede por turno', { fontStyle: 'italic', fontSize: '11px', color: '#9a8c6c' }).setOrigin(1, 0.5);
    p.maximoCurva = this.criarTexto(rx + 6, DIR.curva + 8, '', { fontSize: '10px', color: '#9a8c6c' }).setOrigin(0, 0.5);
    p.registro = this.criarTexto(rx, DIR.registro, '', { fontSize: '12px', color: '#dccfb2', wordWrap: { width: rl }, lineSpacing: 2 });
  },

  /** Botão de truco (logo acima das ações) e botões de ação e de sistema. */
  criarBotoesDeAcao(p) {
    const rx = PAINEL_DIR.x + 12, rl = PAINEL_DIR.l - 24, rc = PAINEL_DIR.x + PAINEL_DIR.l / 2;
    p.truco = this.criarBotao(rc, DIR.truco, rl, 44, 'TRUCO!', () => this.pedirTrucoHumano(), { variante: 'vinho', tamanho: 20, dica: 'truco' });
    const bl = (rl - 8) / 2, c1 = rx + bl / 2, c2 = rx + rl - bl / 2;
    p.botaoDropout = this.criarBotao(c1, 596, bl, 36, 'Dropout', () => this.alternarDropout(), { dica: 'dropout' });
    p.botaoTransfer = this.criarBotao(c2, 596, bl, 36, 'Transfer', () => this.fazerTransfer(), { dica: 'transfer' });
    p.botaoPassar = this.criarBotao(c1, 638, bl, 36, 'Passar a vez', () => this.passarAVez(), { dica: 'passar' });
    p.botaoRegras = this.criarBotao(c2, 638, bl, 36, 'Regras', () => abrirRegras(null));
    const larguraPequena = (rl - 12) / 3;
    const pedra = { tamanho: 12, variante: 'pedra' };
    p.botaoGrimorio = this.criarBotao(rx + larguraPequena / 2, 680, larguraPequena, 32, 'Grimório', () => abrirGrimorio(this.app), pedra);
    p.botaoSom = this.criarBotao(rc, 680, larguraPequena, 32, 'Som', () => { this.app.alternarSom(); this.atualizarBotaoSom(); }, pedra);
    p.botaoMenu = this.criarBotao(rx + rl - larguraPequena / 2, 680, larguraPequena, 32, 'Menu', () => this.perguntarSeVoltaAoMenu(), pedra);
  },

  /** Rótulo do botão de som conforme a preferência. */
  atualizarBotaoSom() {
    this.painel.botaoSom.definirRotulo(Som.estaMudo() ? 'Som: não' : 'Som: sim');
  },

  /** Rótulos das chaves de dicas e de música. */
  atualizarChaves() {
    this.painel.botaoDicas.definirRotulo(this.app.dicasLigadas ? 'Dicas ligadas' : 'Ativar dicas');
    this.painel.botaoMusica.definirRotulo(this.app.progresso.musica ? 'Música: sim' : 'Música: não');
  },
};
