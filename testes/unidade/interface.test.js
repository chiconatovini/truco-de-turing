/**
 * @file Testes de unidade da interface em HTML (com jsdom): painéis, avisos, confirmações, dicas
 * flutuantes, menu, telas (regras, grimório, conquistas, sobre e revisão), som e música (com um
 * WebAudio de mentira) e a Aplicacao (progresso, conquistas, navegação).
 */
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { instalarNavegadorFalso, registroDeAudio, limparRegistroDeAudio, esperar } from '../apoio/ambiente.js';

instalarNavegadorFalso({ toque: true });
const paineis = await import('../../src/interface/paineis.js');
const { Som, contextoDeAudio } = await import('../../src/interface/som.js');
const { Musica } = await import('../../src/interface/musica.js');
const { abrirMenu } = await import('../../src/interface/menu.js');
const { abrirRegras } = await import('../../src/interface/telas/regras.js');
const { abrirGrimorio, htmlDoVerbete } = await import('../../src/interface/telas/grimorio.js');
const { textoComFormulas, formulaHtml } = await import('../../src/interface/formulas.js');
const { abrirConquistas, medalhaHtml } = await import('../../src/interface/telas/conquistas.js');
const { abrirSobre } = await import('../../src/interface/telas/sobre.js');
const { abrirRevisao } = await import('../../src/interface/telas/revisao.js');
const { Aplicacao } = await import('../../src/aplicacao.js');
const { VERSAO } = await import('../../src/versao.js');
const { VERBETES } = await import('../../src/conteudo/grimorio.js');
const { CONQUISTAS } = await import('../../src/conteudo/conquistas.js');
const { novaPartida, marcarTentos } = await import('../../src/nucleo/truco.js');
const { maoAteOFim } = await import('../apoio/estados.js');

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const clicar = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

beforeEach(() => { paineis.fecharTodos(); $('#avisos').innerHTML = ''; paineis.esconderDicaFlutuante(); });

describe('paineis.js', () => {
  it('escaparHtml', () => {
    assert.equal(paineis.escaparHtml('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
    assert.equal(paineis.escaparHtml(5), '5');
  });
  it('abrirPainel: fecha pelo botão data-fechar, por fora e por fecharTodos; chama aoFechar', async () => {
    let fechou = 0;
    const p = paineis.abrirPainel('<div class="folha"><button class="botao" data-fechar>x</button></div>', { fechaAoClicarFora: true, aoFechar: () => fechou++ });
    await esperar(40);
    assert.equal($$('.camada').length, 1);
    clicar(p.elemento.querySelector('[data-fechar]'));
    assert.equal($$('.camada').length, 0);
    assert.equal(fechou, 1);
    const q = paineis.abrirPainel('<div>y</div>', { fechaAoClicarFora: true, transparente: true });
    assert.ok(q.elemento.classList.contains('transparente'));
    clicar(q.elemento);
    assert.equal($$('.camada').length, 0);
    paineis.abrirPainel('<div>z</div>');
    paineis.fecharTodos();
    assert.equal($$('.camada').length, 0);
  });
  it('mostrarAviso e mostrarDicaDeJogo: um por vez, somem sozinhos ou com um toque', async () => {
    paineis.mostrarAviso('Título', 'texto <b>', 'medalha-aviso', 60);
    assert.match($('#avisos').innerHTML, /medalha-aviso/);
    assert.match($('#avisos').textContent, /texto <b>/);
    paineis.mostrarAviso('Outro');
    assert.equal($$('#avisos .aviso').length, 1);
    clicar($('#avisos .aviso'));
    assert.equal($$('#avisos .aviso').length, 0);
    paineis.mostrarAviso('Rápido', '', null, 50);
    await esperar(80);
    assert.equal($$('#avisos .aviso').length, 0);
    paineis.mostrarDicaDeJogo('Corrida', 'Ataque agora.', 'Camadas', 'Uma rede tem camadas.');
    assert.match($('#avisos').textContent, /Dica · Corrida.*Redes neurais · Camadas/s);
    paineis.mostrarDicaDeJogo('Sem conceito', 'texto', '', '');
    assert.equal($$('.dica-de-jogo .conceito').length, 0);
    clicar($('.dica-de-jogo'));
    assert.equal($$('.dica-de-jogo').length, 0);
  });
  it('confirmar: botões com ação, grito de truco e topo', () => {
    let escolha = null;
    paineis.confirmar('Truco?', 'texto', [{ rotulo: 'Não', classe: 'discreto' }, { rotulo: 'Sim', classe: 'vinho', acao: () => { escolha = 'sim'; } }], { grito: true, topo: '<div class="quem">Bia pediu</div>' });
    assert.ok($('.grito-truco .quem'));
    clicar($('.botao.vinho'));
    assert.equal(escolha, 'sim');
    paineis.confirmar('Sem texto', '', [{ rotulo: 'Ok' }]);
    clicar($('[data-indice="0"]'));
    assert.equal($$('.camada').length, 0);
  });
  it('dica flutuante: à esquerda, acima ou abaixo do alvo conforme o espaço', () => {
    for (const alvo of [{ x: 900, y: 300, l: 100, a: 40 }, { x: 10, y: 400, l: 100, a: 40 }, { x: 10, y: 5, l: 100, a: 40 }]) {
      paineis.mostrarDicaFlutuante('Dropout', 'corpo <span class="agora">agora</span>', alvo);
      const caixa = $('.dica-flutuante');
      assert.ok(caixa && caixa.style.left && caixa.style.top);
      assert.equal($$('.dica-flutuante').length, 1);
    }
    paineis.esconderDicaFlutuante();
    assert.equal($$('.dica-flutuante').length, 0);
  });
});

describe('som.js e musica.js', () => {
  it('cada efeito sonoro agenda osciladores ou ruído; mudo não toca nada', () => {
    const efeitos = ['virarCarta', 'colocarCarta', 'selecionar', 'tunagem', 'golpe', 'explosao', 'dropout', 'vitoria', 'fanfarra', 'campeao', 'derrota', 'medalha'];
    Som.definirMudo(false);
    Som.desbloquear();
    for (const efeito of efeitos) {
      limparRegistroDeAudio();
      Som[efeito]();
      assert.ok(registroDeAudio.osciladores.length + registroDeAudio.fontes.length > 0, efeito);
    }
    for (const forca of [undefined, 1, 4, 9]) { limparRegistroDeAudio(); Som.truco(forca); assert.ok(registroDeAudio.osciladores.length >= 5); }
    Som.definirMudo(true);
    assert.ok(Som.estaMudo());
    limparRegistroDeAudio();
    Som.golpe(); Som.truco(2);
    assert.equal(registroDeAudio.osciladores.length + registroDeAudio.fontes.length, 0);
    Som.definirMudo(false);
    assert.ok(contextoDeAudio());
  });
  it('música: cada terreno agenda notas; trocar, repetir e parar', async (t) => {
    for (const terreno of ['neutro', 'oceano', 'montanha', 'pantano', 'desconhecido']) {
      limparRegistroDeAudio();
      Musica.tocar(terreno);
      assert.ok(Musica.tocando());
      const contexto = contextoDeAudio();
      for (let passo = 0; passo < 12; passo++) { contexto.currentTime += 0.5; await esperar(105); }
      assert.ok(registroDeAudio.osciladores.length > 5, terreno);
      Musica.tocar(terreno); /* mesma música: não reinicia */
    }
    contextoDeAudio().currentTime = -5; /* aba em segundo plano: o agendador retoma do agora */
    await esperar(110);
    Musica.parar();
    assert.ok(!Musica.tocando());
    Musica.parar();
    await esperar(950);
  });
});

describe('telas', () => {
  /** Aplicação de mentira para as telas. */
  const appFalso = () => ({
    progresso: { tutorialVisto: false, lidos: {}, desbloqueadas: { primeira: 1 }, vitorias: 3, dropouts: 4 },
    opcoes: { oponente: 'guloso', baralho: 'truco', terreno: 'oceano', inicio: 'sorteio', alvo: 12 },
    salvo: 0, salvar() { this.salvo++; }, salvarOpcoes() { this.salvo++; },
    marcarVerbeteLido(id) { this.progresso.lidos[id] = true; },
    jogou: 0, jogar() { this.jogou++; },
  });
  it('menu: mostra as escolhas, lê as mudanças, atualiza as miniaturas e abre cada tela', () => {
    const app = appFalso();
    abrirMenu(app);
    assert.equal($('#m-baralho').value, 'truco');
    assert.ok($('#m-oponente').options.length >= 4);
    $('#m-terreno').value = 'montanha';
    $('#m-terreno').dispatchEvent(new window.Event('change'));
    assert.ok($$('.miniatura img').length >= 1);
    for (const id of ['m-regras', 'm-grimorio', 'm-conquistas', 'm-sobre']) {
      clicar($('#' + id));
      assert.equal(app.opcoes.terreno, 'montanha');
    }
    clicar($('#m-jogar'));
    assert.equal(app.jogou, 1);
  });
  it('regras: marca o tutorial como visto e chama aoFechar', () => {
    const app = appFalso();
    let fechou = false;
    abrirRegras(app, () => { fechou = true; });
    assert.ok(app.progresso.tutorialVisto);
    assert.match($('.camada').textContent, /41/);
    clicar($('.camada [data-fechar]'));
    assert.ok(fechou);
    abrirRegras(null);
    assert.ok($('.camada'));
  });
  it('grimório: abre no verbete pedido, troca de verbete e marca como lido', () => {
    const app = appFalso();
    abrirGrimorio(app, 'dropout');
    assert.match($('#g-verbete').textContent, /Dropout/i);
    clicar($$('#g-lista button')[0]);
    assert.ok(app.progresso.lidos[VERBETES[0].id] && app.progresso.lidos.dropout);
    assert.ok($$('#g-lista .lido').length >= 2);
    abrirGrimorio(app, 'nao-existe');
  });
  it('grimório: verbete completo mostra ideia, onde falha, matemática e autoria', () => {
    const app = appFalso();
    abrirGrimorio(app, 'dropout');
    const texto = $('#g-verbete').textContent;
    for (const trecho of ['A ideia', 'Na vida real', 'No jogo', 'Onde a comparação falha', 'Para se aprofundar', 'Suzy Arcanjo']) assert.match(texto, new RegExp(trecho));
    assert.ok($('#g-verbete .formula-bloco, #g-verbete .katex-display'));
    const curto = htmlDoVerbete(VERBETES.find((v) => !v.ideia));
    assert.doesNotMatch(curto, /A ideia|Para se aprofundar/);
  });
  it('fórmulas: KaTeX quando existe, LaTeX escapado como código quando não', () => {
    const semKatex = textoComFormulas('peso $w<1$ e $$a \\cdot b$$ fim', null);
    assert.match(semKatex, /peso <code class="formula-tex">w&lt;1<\/code> e <div class="formula-bloco"><code class="formula-tex">a \\cdot b<\/code><\/div> fim/);
    const katex = { renderToString: (tex, o) => '[' + (o.displayMode ? 'D' : 'L') + ':' + tex + ']' };
    assert.equal(textoComFormulas('x $a$ y $$b$$', katex), 'x [L:a] y [D:b]');
    assert.match(formulaHtml('c', false, { renderToString: () => { throw new Error('ruim'); } }), /formula-tex/);
    assert.equal(textoComFormulas('sem fórmula <b>', null), 'sem fórmula &lt;b&gt;');
  });
  it('conquistas: medalhas bloqueadas e desbloqueadas, contagem e retrato', async () => {
    const app = appFalso();
    abrirConquistas(app);
    assert.match($('.conquistas-resumo').textContent, /1 de 27/);
    assert.equal($$('.conquista').length, CONQUISTAS.length);
    await esperar(50);
    assert.ok($('#c-retrato canvas'));
    assert.match(medalhaHtml(CONQUISTAS[0], true), /medalha/);
    assert.match(medalhaHtml(CONQUISTAS[0], false), /cadeado|bloquead/);
  });
  it('sobre: versão, disciplina, professor e autores', () => {
    abrirSobre();
    const texto = $('.camada').textContent;
    assert.ok(texto.includes('Versão ' + VERSAO));
    assert.match(texto, /Peng Yaohao/);
    assert.match(texto, /Welyngton/);
  });
  it('revisão: resumo, curva, linha do tempo comentada e placar da partida', () => {
    const mao = maoAteOFim({ terreno: 'pantano' });
    const somasDosPassos = [[7, 0], [12, 3], [9, 5], [9, 14], [9, 20], [16, 20], [16, 22], [30, 22], [30, 22]];
    const tipos = ['ativar', 'empilhar', 'empilhar', 'empilhar', 'dropout', 'transfer', 'truco', 'ativar', 'passar'];
    const eventos = [['ativacao'], ['tunagem'], ['overfit'], ['stackoverflow'], ['dropout'], ['transfer'], ['truco'], ['ativacao', 'completa'], ['passe']];
    const linhaDoTempo = tipos.map((tipo, i) => {
      return { numero: i + 1, jogador: i % 2, tipo, eventos: eventos[i], texto: 'passo ' + i, somas: somasDosPassos[i] };
    });
    const partida = novaPartida(12);
    marcarTentos(partida, 0, 12);
    let voltou = false;
    abrirRevisao({
      mao, linhaDoTempo, partida, numeroDaMao: 3, aoFechar: () => { voltou = true; },
      historicoDaPartida: [{ numero: 1, vencedor: 1, ganho: 3, completa: false, somas: [0, 0], tentos: [0, 3] }, { numero: 2, vencedor: 0, ganho: 12, completa: true, somas: [40, 30], tentos: [12, 3] }],
    });
    const texto = $('.revisao').textContent;
    assert.match(texto, /Revisão da mão 3/);
    assert.match(texto, /Maior salto/);
    assert.match(texto, /Golpe mais duro/);
    assert.match(texto, /virada/i);
    assert.match(texto, /Pântano/);
    assert.match(texto, /1 lance de truco/);
    assert.ok($$('.curva-svg .marca').length >= 5);
    assert.ok($('.curva-svg .linha-truco'));
    assert.equal($$('.linha-do-tempo li').length, tipos.length);
    assert.equal($$('.tabela-partida tbody tr').length, 2);
    clicar($('.revisao .botao.vinho'));
    assert.ok(voltou);
    abrirRevisao({ mao: maoAteOFim(), linhaDoTempo: [], partida: novaPartida(1), historicoDaPartida: [], numeroDaMao: 1, aoFechar() {} });
    assert.match($('.revisao').textContent, /Nenhuma jogada/);
  });
});

describe('aplicacao.js', () => {
  /** Jogo de mentira que registra as cenas ligadas e desligadas. */
  const jogoFalso = () => ({ cenas: [], scene: { stop(n) { this.dono.cenas.push('-' + n); }, start(n) { this.dono.cenas.push('+' + n); } } });
  it('iniciar: opções padrão, música ligada sem escolha e som conforme o progresso', () => {
    Aplicacao.progresso.musicaEscolhida = false; Aplicacao.progresso.musica = false; Aplicacao.progresso.mudo = true;
    Aplicacao.iniciar();
    assert.equal(Aplicacao.opcoes.oponente, 'guloso');
    assert.equal(Aplicacao.progresso.musica, true);
    assert.ok(Som.estaMudo());
    Aplicacao.alternarSom();
    assert.ok(!Som.estaMudo());
  });
  it('salvarOpcoes, alternarMusica (liga com terreno, desliga sem)', () => {
    Aplicacao.opcoes.baralho = 'yinyang';
    Aplicacao.salvarOpcoes();
    assert.equal(JSON.parse(localStorage.getItem('truco-de-turing:v2')).opcoes.baralho, 'yinyang');
    Aplicacao.progresso.musica = false;
    Aplicacao.alternarMusica('oceano');
    assert.ok(Musica.tocando() && Aplicacao.progresso.musicaEscolhida);
    Aplicacao.alternarMusica();
    assert.ok(!Musica.tocando());
  });
  it('jogar e irParaMenu trocam as cenas; modo imersivo pede tela cheia no toque', () => {
    const jogo = jogoFalso(); jogo.scene.dono = jogo;
    Aplicacao.jogo = jogo;
    let pediu = false;
    document.documentElement.requestFullscreen = () => { pediu = true; return Promise.resolve(); };
    Aplicacao.jogar();
    assert.ok(document.body.classList.contains('em-partida'));
    assert.ok(pediu);
    Aplicacao.irParaMenu();
    assert.deepEqual(jogo.cenas, ['-Menu', '+Mesa', '-Mesa', '+Menu']);
    document.documentElement.requestFullscreen = () => { throw new Error('negado'); };
    assert.doesNotThrow(() => Aplicacao.modoImersivo());
  });
  it('registrarMao: contadores, conquistas novas (uma vez só) e mão encerrada por truco', () => {
    const p = Aplicacao.progresso;
    p.desbloqueadas = {}; p.vitorias = 0; p.maos = 0; p.vitoriasZen = 0; p.terrenos = {}; p.baralhos = {};
    const mao = maoAteOFim();
    mao.jogadores[0].acoesUsadas = 0;
    const novas = Aplicacao.registrarMao({ mao, eu: 0, venceu: true, completa: true, partida: novaPartida(12), venceuPartida: false, valorDaMao: 3, oponenteCorreu: true, opcoes: { oponente: 'guloso' } });
    const ids = novas.map((c) => c.id);
    assert.ok(ids.includes('primeira') && ids.includes('truco') && ids.includes('correu') && ids.includes('zen'));
    assert.equal(p.vitorias, 1);
    assert.equal(p.vitoriasZen, 1);
    const repetidas = Aplicacao.registrarMao({ mao, eu: 0, venceu: true, completa: false, partida: novaPartida(12), venceuPartida: false, valorDaMao: 1, oponenteCorreu: false, opcoes: {} });
    assert.ok(!repetidas.some((c) => ids.includes(c.id)));
    assert.ok(!repetidas.some((c) => c.id === 'zen'));
  });
  it('marcarVerbeteLido: conta cada verbete uma vez e concede "Bibliotecário" no fim', () => {
    const p = Aplicacao.progresso;
    p.lidos = {}; p.verbetesLidos = 0; delete p.desbloqueadas.biblio;
    for (const v of VERBETES) { Aplicacao.marcarVerbeteLido(v.id); Aplicacao.marcarVerbeteLido(v.id); }
    assert.equal(p.verbetesLidos, VERBETES.length);
    assert.ok(p.desbloqueadas.biblio);
    assert.match($('#avisos').textContent, /Bibliotecário/);
  });
});
