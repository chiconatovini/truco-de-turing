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
import { PAINEL_ESQ, PAINEL_DIR, colunaX, linhaY, ajustarLinha } from './layout.js';

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
    for (const y of [440, 568]) g.lineBetween(PAINEL_ESQ.x + 18, y, PAINEL_ESQ.x + PAINEL_ESQ.l - 18, y);
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
    this.add.text(PAINEL_ESQ.x + PAINEL_ESQ.l / 2, 98, 'INSPEÇÃO', { fontFamily: FONTES.titulo, fontStyle: '700', fontSize: '12px', color: '#e8d6a8', letterSpacing: 2 }).setOrigin(0.5).setDepth(7);
  },

  /**
   * Cria um botão com textura própria e rótulo que se ajusta à largura.
   * O objeto devolvido ganha `definirRotulo(texto)` e `habilitar(sim)`.
   * @param {{variante?: 'ouro'|'vinho'|'pedra', tamanho?: number}} [opcoes]
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
    botao.on('pointerover', () => { if (botao.habilitado) pintar('foco'); });
    botao.on('pointerout', () => pintar(botao.habilitado ? 'normal' : 'inativo'));
    botao.on('pointerdown', () => { if (botao.habilitado) { Som.selecionar(); acao(); } });
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
    const texto = (x, y, s, estilo) => this.add.text(x, y, s, { fontFamily: FONTES.texto, fontSize: '13px', color: '#efe3c6', ...(estilo || {}) }).setDepth(7);
    const titulo = { fontFamily: FONTES.titulo, fontStyle: '700' };
    const p = (this.painel = {});

    /* oponente (topo esquerdo) e balão de fala */
    p.avatarOponente = this.add.image(44, 40, 'avatar-gradiente').setDisplaySize(64, 64).setDepth(7);
    p.nomeOponente = texto(84, 23, '', { ...titulo, fontSize: '18px', color: '#f6dc8f' }).setOrigin(0, 0.5);
    p.nivelOponente = texto(84, 50, '', { fontStyle: 'italic', fontSize: '13px', color: '#cdbf9e' }).setOrigin(0, 0.5);
    p.balao = this.add.container(700, 40).setDepth(30).setVisible(false);
    p.fundoBalao = this.add.graphics();
    p.textoBalao = this.add.text(0, 0, '', { fontFamily: FONTES.texto, fontStyle: 'italic', fontSize: '15px', color: '#24170c', wordWrap: { width: 230 }, align: 'center' }).setOrigin(0.5);
    p.balao.add([p.fundoBalao, p.textoBalao]);

    /* inspeção e pilhas (painel esquerdo) */
    const cx = PAINEL_ESQ.x + PAINEL_ESQ.l / 2;
    p.inspecao = this.add.image(cx, 250, 'terreno-' + this.opcoes.terreno).setDisplaySize(TAMANHO_CARTA.inspecaoL, TAMANHO_CARTA.inspecaoA).setDepth(7);
    p.notaInspecao = texto(cx, 394, '', { fontStyle: 'italic', fontSize: '12px', color: '#d6c8a6', align: 'center', wordWrap: { width: PAINEL_ESQ.l - 30 }, lineSpacing: 0 }).setOrigin(0.5, 0);
    const rotuloPilha = { ...titulo, fontSize: '10.5px', color: '#e8d6a8', letterSpacing: 1 };
    p.limbo = this.add.image(PAINEL_ESQ.x + 70, 474, this.verso('mesa')).setDisplaySize(42, 59).setDepth(7).setInteractive();
    p.textoLimbo = texto(PAINEL_ESQ.x + 70, 509, '', rotuloPilha).setOrigin(0.5, 0);
    p.cemiterio = this.add.image(PAINEL_ESQ.x + PAINEL_ESQ.l - 70, 474, this.verso('mesa')).setDisplaySize(42, 59).setDepth(7).setInteractive();
    p.textoCemiterio = texto(PAINEL_ESQ.x + PAINEL_ESQ.l - 70, 509, '', rotuloPilha).setOrigin(0.5, 0);
    p.limbo.on('pointerover', () => this.inspecionar(this.verso('inspecao'), 'Limbo: cartas queimadas no início (ruído). Só voltam por transfer learning.'));
    p.cemiterio.on('pointerover', () => {
      const ultima = this.mao?.cemiterio[this.mao.cemiterio.length - 1];
      this.inspecionar(ultima ? texturaDeInspecao(this, ultima, this.mao.config.baralho) : this.verso('inspecao'),
        'Cemitério: ' + (this.mao ? this.mao.cemiterio.length : 0) + ' carta(s) fora de jogo. Mostrando a última.');
    });
    p.textoTerreno = texto(cx, 528, '', { fontSize: '12px', align: 'center', color: '#d6c8a6', wordWrap: { width: PAINEL_ESQ.l - 30 } }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    p.textoTerreno.on('pointerover', () => {
      const t = TERRENOS[this.opcoes.terreno];
      this.inspecionar('terreno-' + this.opcoes.terreno, t.nome + ': ' + t.resumo);
    });

    /* jogador de baixo e dica do turno */
    p.meuAvatar = this.add.image(PAINEL_ESQ.x + 26, 592, 'avatar-p1').setDisplaySize(36, 36).setDepth(7);
    p.meuNome = texto(PAINEL_ESQ.x + 52, 592, '', { ...titulo, fontSize: '15px', color: '#bfe2fa' }).setOrigin(0, 0.5);
    p.dica = texto(PAINEL_ESQ.x + 14, 616, '', { fontSize: '13.5px', color: '#efe3c6', wordWrap: { width: PAINEL_ESQ.l - 28 }, lineSpacing: 1 });

    /* placar (painel direito) */
    const rx = PAINEL_DIR.x + 12, rl = PAINEL_DIR.l - 24, rc = PAINEL_DIR.x + PAINEL_DIR.l / 2;
    p.tituloMao = texto(rc, 28, '', { ...titulo, fontSize: '16px', color: '#f6dc8f', letterSpacing: 1 }).setOrigin(0.5);
    p.subtitulo = texto(rc, 50, '', { fontStyle: 'italic', fontSize: '12.5px', color: '#cdbf9e' }).setOrigin(0.5);
    p.blocos = [0, 1].map((i) => {
      const y = 66 + i * 86;
      const b = { x: rx, y, l: rl, a: 80 };
      b.grafico = this.add.graphics().setDepth(6);
      b.nome = texto(rx + 16, y + 15, '', { ...titulo, fontSize: '15px' }).setOrigin(0, 0.5);
      b.situacao = texto(rx + 16, y + 34, '', { ...titulo, fontSize: '9.5px', color: '#e0cc9a', letterSpacing: 0.8 }).setOrigin(0, 0.5);
      b.detalhe = texto(rx + 16, y + 51, '', { fontSize: '12px', color: '#cdbf9e' }).setOrigin(0, 0.5);
      b.tentos = texto(rx + 16 + 12 * 10 + 4, y + 67, '', { fontSize: '11px', color: '#cdbf9e' }).setOrigin(0, 0.5);
      b.rotuloSoma = texto(rx + rl - 12, y + 14, 'SOMA DA REDE', { ...titulo, fontSize: '8.5px', color: '#9a8c6c', letterSpacing: 1 }).setOrigin(1, 0.5);
      b.soma = texto(rx + rl - 12, y + 47, '0', { fontFamily: FONTES.titulo, fontStyle: '900', fontSize: '36px' }).setOrigin(1, 0.5);
      return b;
    });
    p.truco = this.criarBotao(rc, 262, rl, 44, 'TRUCO!', () => this.pedirTrucoHumano(), { variante: 'vinho', tamanho: 20 });
    p.rotuloCurva = texto(rx, 298, 'CURVA DE TREINO', { ...titulo, fontSize: '10px', color: '#e0cc9a', letterSpacing: 1 }).setOrigin(0, 0.5);
    p.subCurva = texto(rx + rl, 298, 'soma da rede por turno', { fontStyle: 'italic', fontSize: '11px', color: '#9a8c6c' }).setOrigin(1, 0.5);
    p.maximoCurva = texto(rx + 6, 316, '', { fontSize: '10px', color: '#9a8c6c' }).setOrigin(0, 0.5);
    p.registro = texto(rx, 396, '', { fontSize: '12px', color: '#dccfb2', wordWrap: { width: rl }, lineSpacing: 2 });

    /* botões de ação */
    const bl = (rl - 8) / 2, c1 = rx + bl / 2, c2 = rx + rl - bl / 2;
    p.botaoDropout = this.criarBotao(c1, 590, bl, 38, 'Dropout', () => this.alternarDropout());
    p.botaoTransfer = this.criarBotao(c2, 590, bl, 38, 'Transfer', () => this.fazerTransfer());
    p.botaoPassar = this.criarBotao(c1, 634, bl, 38, 'Passar a vez', () => this.passarAVez());
    p.botaoRegras = this.criarBotao(c2, 634, bl, 38, 'Regras', () => abrirRegras(null));
    const larguraPequena = (rl - 12) / 3;
    const pedra = { tamanho: 12, variante: 'pedra' };
    p.botaoGrimorio = this.criarBotao(rx + larguraPequena / 2, 677, larguraPequena, 32, 'Grimório', () => abrirGrimorio(this.app), pedra);
    p.botaoSom = this.criarBotao(rc, 677, larguraPequena, 32, 'Som', () => { this.app.alternarSom(); this.atualizarBotaoSom(); }, pedra);
    p.botaoMenu = this.criarBotao(rx + rl - larguraPequena / 2, 677, larguraPequena, 32, 'Menu', () => this.perguntarSeVoltaAoMenu(), pedra);
    this.atualizarBotaoSom();
  },

  /** Rótulo do botão de som conforme a preferência. */
  atualizarBotaoSom() {
    this.painel.botaoSom.definirRotulo(Som.estaMudo() ? 'Som: não' : 'Som: sim');
  },
};
