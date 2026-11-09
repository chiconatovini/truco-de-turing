/**
 * @file Testes de interface das ações da mesa: inspeção e seleção, tunagem, overfit, stack
 * overflow, early stop na própria rede, dropout, transfer learning, passar a vez, truco (pedir,
 * aceitar, aumentar, correr), modo dicas (dica de jogo, dicas dos botões com mouse e segurando no
 * toque), som e música, comemorações e volta ao menu.
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { subirServidor, abrirJogo, comecarPartida, naCena, esperarCena, esperarMenu, capturar } from '../apoio/navegador.js';

let servidor;
before(async () => { servidor = await subirServidor(); });
after(() => servidor.fechar());

/** Responde às caixas abertas (botão vinho) e espera a vez do humano. */
async function esperarMinhaVez(pagina) {
  for (let i = 0; i < 400; i++) {
    const pronto = await naCena(pagina, `
      const vinho = document.querySelector('.camada .botao.vinho');
      if (vinho && !document.querySelector('#r-proxima')) { vinho.click(); return false; }
      if (cena.modo === 'inicio') { cena.aoClicarNaCarta(cena.mao.jogadores[cena.quemVe].mao[0].id); return false; }
      return cena.ehVezDoHumano();`);
    if (pronto) return;
    await pagina.waitForTimeout(80);
  }
  throw new Error('a vez do humano não chegou');
}

/** Ativa um neurônio qualquer na vez do humano. */
const ativarQualquer = (pagina) => naCena(pagina, 'cena.aoClicarNoNeuronio(Object.keys(cena.alvos)[0]);');

/** Clica num botão da mesa (o botão age ao soltar). */
/** Abre a janela REGRAS ou MENU da mesa e clica numa das opções dela. */
const naJanela = async (pagina, botao, seletor) => {
  await apertar(pagina, botao);
  await pagina.locator('.janela-da-mesa ' + seletor).dispatchEvent('click');
};
const apertar = (pagina, botao) => naCena(pagina, `const b = cena.painel[arg]; b.emit('pointerover', { wasTouch: false }); b.emit('pointerdown'); b.emit('pointerup'); b.emit('pointerout');`, botao);

describe('ações da mesa', () => {
  it('inspeção, seleção, Esc, tunagem, overfit, stack overflow e early stop na própria rede', async () => {
    const jogo = await abrirJogo(servidor.url, { consulta: '?res=1' });
    const { pagina } = jogo;
    try {
      await comecarPartida(pagina, { oponente: 'aleatorio', baralho: 'classico', terreno: 'neutro', inicio: 'sorteio' });
      await esperarMinhaVez(pagina);
      /* inspeção: neurônio virado, carta da mão, limbo, cemitério e terreno */
      await naCena(pagina, `
        const id = Object.keys(cena.alvos)[0];
        cena.aoPassarNoNeuronio(id, true); cena.aoPassarNoNeuronio(id, false);
        const carta = cena.cartasDaMao[0]; carta.emit('pointerover'); carta.emit('pointerout');
        cena.painel.limbo.carta.emit('pointerover'); cena.painel.cemiterio.carta.emit('pointerover'); cena.painel.textoTerreno.emit('pointerover');`);
      /* seleção e Esc */
      await naCena(pagina, 'cena.cartasDaMao[0].emit("pointerdown"); cena.cartasDaMao[1].emit("pointerdown");');
      assert.ok(await naCena(pagina, 'return cena.selecao.length >= 1'));
      await naCena(pagina, 'cena.aoClicarNoNeuronio("C6N0");'); /* alvo inválido: "não encaixa" */
      await pagina.keyboard.press('Escape');
      assert.equal(await naCena(pagina, 'return cena.selecao.length'), 0);
      /* constrói até as duas redes terem um neurônio oculto na ponta */
      for (let i = 0; i < 6; i++) {
        await esperarMinhaVez(pagina);
        const pronto = await naCena(pagina, `
          const f = (j) => { const c = cena.mao.jogadores[j].caminho; return c.length ? cena.mao.neuronios[c[c.length - 1]] : null; };
          const a = f(0), b = f(1);
          return !!(a && b && a.camada >= 1 && a.camada <= 4 && b.camada >= 1 && b.camada <= 4 && a.cartas.length === 1 && b.cartas.length === 1);`);
        if (pronto) break;
        await ativarQualquer(pagina);
      }
      /* tunagem na própria rede: dá à mão uma carta igual à da ponta e empilha */
      const executar = async (alvo, quantas, efeito) => {
        await esperarMinhaVez(pagina);
        const ok = await naCena(pagina, `
          const [alvo, quantas] = arg;
          const c = cena.mao.jogadores[alvo].caminho, n = cena.mao.neuronios[c[c.length - 1]];
          if (!n || n.camada < 1 || n.camada > 5 || cena.mao.jogadores[alvo].situacao !== 'construindo') return false;
          const valor = n.cartas[0].valor;
          cena.mao.jogadores[0].mao = Array.from({ length: 4 }, (_, i) => ({ id: 'teste' + Math.random(), valor, naipe: 'ECPO'[i] }));
          cena.redesenhar();
          for (let i = 0; i < quantas; i++) cena.aoClicarNaCarta(cena.mao.jogadores[0].mao[i].id);
          if (!cena.alvos[n.id]) return 'sem alvo';
          cena.aoPassarNoNeuronio(n.id, true);
          cena.aoClicarNoNeuronio(n.id);
          return true;`, [alvo, quantas]);
        assert.equal(ok, true, efeito);
        await esperarCena(pagina, `return cena.linhaDoTempo.some((p) => p.eventos.includes('${efeito}'))`);
      };
      await executar(0, 1, 'tunagem');
      await capturar(pagina, '13-tunagem');
      await executar(1, 1, 'overfit');
      await esperarMinhaVez(pagina);
      await ativarQualquer(pagina); /* a rede adversária recuou: deixa ele reconstruir */
      for (let i = 0; i < 4; i++) {
        await esperarMinhaVez(pagina);
        const pilha = await naCena(pagina, 'const c = cena.mao.jogadores[1].caminho; const n = cena.mao.neuronios[c[c.length - 1]]; return n && n.camada >= 1 && n.camada <= 5 ? n.cartas.length : 0;');
        if (pilha === 1) break;
        await ativarQualquer(pagina);
      }
      await executar(1, 3, 'stackoverflow');
      await capturar(pagina, '14-stack-overflow');
      for (let i = 0; i < 3; i++) {
        await esperarMinhaVez(pagina);
        const pilha = await naCena(pagina, 'const c = cena.mao.jogadores[0].caminho; const n = cena.mao.neuronios[c[c.length - 1]]; return n && n.camada >= 1 && n.camada <= 5 ? n.cartas.length : 0;');
        if (pilha === 1) break;
        await ativarQualquer(pagina);
      }
      await executar(0, 2, 'earlystop');
      await pagina.waitForSelector('#r-proxima', { timeout: 60000 });
      assert.match(await pagina.locator('.folha').first().textContent(), /Critério/);
      assert.deepEqual(jogo.erros, []);
    } finally { await jogo.fechar(); }
  });

  it('dropout (escolher camadas e pagar), cancelar, transfer learning, passar a vez e vanishing gradient', async () => {
    const jogo = await abrirJogo(servidor.url, { consulta: '?res=1' });
    const { pagina } = jogo;
    try {
      await comecarPartida(pagina, { oponente: 'aleatorio', baralho: 'truco', terreno: 'oceano', inicio: 'revela-descarta' });
      for (let i = 0; i < 3; i++) { await esperarMinhaVez(pagina); await ativarQualquer(pagina); }
      await esperarMinhaVez(pagina);
      /* dropout: entra e sai do modo; depois escolhe a camada e paga */
      await apertar(pagina, 'botaoDropout');
      assert.equal(await naCena(pagina, 'return cena.modo'), 'dropout');
      await apertar(pagina, 'botaoDropout');
      assert.equal(await naCena(pagina, 'return cena.modo'), 'livre');
      await apertar(pagina, 'botaoDropout');
      const alvo = await naCena(pagina, 'const id = Object.keys(cena.alvos).filter((k) => cena.alvos[k].tipo === "dropout").sort((a, b) => cena.alvos[a].n - cena.alvos[b].n)[0]; cena.aoPassarNoNeuronio(id, true); cena.aoClicarNoNeuronio(id); return cena.modo;');
      assert.equal(alvo, 'pagarDropout');
      await naCena(pagina, 'const n = cena.camadasDropout; const ids = cena.mao.jogadores[0].mao.slice(0, n).map((c) => c.id); cena.aoClicarNaCarta(ids[0]); cena.aoClicarNaCarta(ids[0]); ids.forEach((id) => cena.aoClicarNaCarta(id));');
      await esperarCena(pagina, 'return cena.mao.jogadores[0].dropouts > 0');
      await capturar(pagina, '15-dropout');
      /* transfer learning: quatro cartas iguais */
      await esperarMinhaVez(pagina);
      await naCena(pagina, 'cena.mao.jogadores[0].mao = "ECPO".split("").map((n) => ({ id: "7" + n + "t", valor: "7", naipe: n })); cena.redesenhar();');
      await apertar(pagina, 'botaoTransfer');
      await esperarCena(pagina, 'return cena.mao.jogadores[0].transferUsado');
      /* vanishing gradient: quatro Reis seguidos na rede */
      await naCena(pagina, `
        const caminho = cena.mao.jogadores[0].caminho;
        cena.mao.neuronios[caminho[0]].cartas = 'ECP'.split('').map((n) => ({ id: 'K' + n + 'v', valor: 'K', naipe: n }));
        cena.mao.neuronios[caminho[1]].cartas = [{ id: 'KOv', valor: 'K', naipe: 'O' }];
        cena.redesenhar(); cena.animarEventos([]);`);
      assert.equal(await naCena(pagina, 'return cena.vanishingAvisado[0]'), true);
      /* passar a vez: sem neurônio livre na próxima camada */
      await esperarMinhaVez(pagina);
      await naCena(pagina, `
        const proxima = cena.mao.jogadores[0].caminho.length;
        if (proxima < 7) cena.mao.camadas[proxima].forEach((n) => { if (n.dono === -1) n.dono = 9; });
        cena.redesenhar();`);
      const pode = await naCena(pagina, 'return cena.painel.botaoPassar.habilitado');
      if (pode) await apertar(pagina, 'botaoPassar');
      await esperarCena(pagina, 'return cena.mao.registro.some((l) => /passou a vez/.test(l)) || !!document.querySelector("#r-proxima")');
      assert.deepEqual(jogo.erros, []);
    } finally { await jogo.fechar(); }
  });

  it('truco: pedir, responder (aumentar, aceitar, correr) e a mão terminada por corrida', async () => {
    const jogo = await abrirJogo(servidor.url, { consulta: '?res=1' });
    const { pagina } = jogo;
    try {
      await comecarPartida(pagina, { oponente: 'guloso', baralho: 'classico', terreno: 'neutro', inicio: 'sorteio', partida: '12' });
      await esperarMinhaVez(pagina);
      /* o humano pede truco; o oponente responde sozinho */
      await apertar(pagina, 'truco');
      await esperarCena(pagina, 'return !cena.partida.pedido || !!document.querySelector(".grito-truco")');
      /* o oponente pede truco: o humano pede mais, depois aceita */
      await esperarCena(pagina, 'return !!document.querySelector("#r-proxima") || cena.ehVezDoHumano() || !!document.querySelector(".grito-truco")', 60000);
      if (await pagina.$('#r-proxima')) await pagina.click('#r-proxima');
      await esperarCena(pagina, 'return cena.mao && !cena.encerrada && cena.mao.fase === "jogo" && !cena.partida.pedido && !document.querySelector(".camada")', 60000);
      await naCena(pagina, 'cena.partida.aumentadoPor = -1; cena.partida.valor = 1; cena.anunciarTruco(1);');
      await pagina.waitForSelector('.grito-truco');
      await capturar(pagina, '16-truco');
      assert.match(await pagina.locator('.grito-truco').textContent(), /Correr \(Perde 1\)/);
      const aumentar = pagina.locator('.grito-truco .botao', { hasText: 'Pedir' });
      if (await aumentar.count()) await aumentar.click();
      await pagina.waitForTimeout(1500);
      if (await pagina.$('.grito-truco')) await pagina.locator('.grito-truco .botao.vinho').click();
      await pagina.waitForTimeout(800);
      /* novo pedido do oponente: o humano corre e a mão acaba na hora */
      await esperarCena(pagina, 'return !document.querySelector(".grito-truco")');
      if (!(await pagina.$('#r-proxima'))) {
        await esperarCena(pagina, 'return !cena.partida.pedido && !cena.encerrada', 60000);
        await naCena(pagina, 'cena.partida.aumentadoPor = -1; if (cena.partida.valor >= 12) cena.partida.valor = 1; cena.anunciarTruco(1);');
        await pagina.waitForSelector('.grito-truco');
        await pagina.locator('.grito-truco .botao', { hasText: 'Correr' }).click();
      }
      await pagina.waitForSelector('#r-proxima', { timeout: 60000 });
      assert.ok(await naCena(pagina, 'return cena.historicoDaPartida.length >= 1'));
      assert.deepEqual(jogo.erros, []);
    } finally { await jogo.fechar(); }
  });

  it('dicas: aviso de conquistas, dica de jogo a cada vez, dicas dos botões com o mouse e desligar', async () => {
    const jogo = await abrirJogo(servidor.url, { consulta: '?res=1' });
    const { pagina } = jogo;
    try {
      await comecarPartida(pagina, { oponente: 'aleatorio', baralho: 'classico', terreno: 'pantano', inicio: 'sorteio', partida: '12' });
      await naJanela(pagina, 'botaoRegras', '[data-opcao="dicas"]');
      await pagina.waitForSelector('.camada h2:has-text("Ativar dicas")');
      /* o computador pode gritar truco ao mesmo tempo: mira a caixa das dicas, e não a de cima */
      const caixa = pagina.locator('.camada', { has: pagina.locator('h2', { hasText: 'Ativar dicas' }) });
      assert.match(await caixa.locator('.folha').textContent(), /não valem conquistas/);
      await caixa.locator('.botao.vinho').dispatchEvent('click');
      await esperarMinhaVez(pagina);
      await pagina.waitForSelector('.dica-de-jogo');
      await capturar(pagina, '17-dica-de-jogo');
      assert.match(await naCena(pagina, 'return cena.painel.dica.text'), /Dica:/);
      for (const chave of ['dropout', 'transfer', 'passar', 'truco']) {
        const conteudo = await naCena(pagina, 'return cena.conteudoDaDica(arg)', chave);
        assert.ok(conteudo.titulo && conteudo.corpo && conteudo.agora, chave);
      }
      /* passar o mouse sobre o botão TRUCO mostra a dica flutuante */
      const [x, y] = await naCena(pagina, `
        const b = cena.painel.truco, canvas = jogo.canvas, r = canvas.getBoundingClientRect(), cam = cena.cameras.main, k = r.width / canvas.width;
        return [r.left + (b.x - cam.worldView.x) * cam.zoom * k, r.top + (b.y - cam.worldView.y) * cam.zoom * k];`);
      await pagina.mouse.move(x, y);
      await pagina.waitForSelector('.dica-flutuante');
      await capturar(pagina, '18-dica-do-botao');
      await pagina.mouse.move(600, 300);
      /* com dicas, a mão não vale conquistas */
      assert.equal(await naCena(pagina, 'return cena.dicasNaMao'), true);
      await naJanela(pagina, 'botaoRegras', '[data-opcao="dicas"]');
      assert.equal(await naCena(pagina, 'return app.dicasLigadas'), false);
      assert.deepEqual(jogo.erros, []);
    } finally { await jogo.fechar(); }
  });

  it('celular: segurar um botão mostra a dica sem executar a ação; toque rápido executa', async () => {
    const jogo = await abrirJogo(servidor.url, { dispositivo: 'Pixel 7', deitado: true, consulta: '?res=1' });
    const { pagina, contexto } = jogo;
    try {
      await comecarPartida(pagina, { oponente: 'aleatorio', partida: '12', inicio: 'sorteio' });
      await naCena(pagina, 'app.dicasLigadas = true; cena.dicasNaMao = true; cena.atualizarChaves();');
      await esperarMinhaVez(pagina);
      const [x, y] = await naCena(pagina, `
        const b = cena.painel.truco, canvas = jogo.canvas, r = canvas.getBoundingClientRect(), cam = cena.cameras.main, k = r.width / canvas.width;
        return [r.left + (b.x - cam.worldView.x) * cam.zoom * k, r.top + (b.y - cam.worldView.y) * cam.zoom * k];`);
      const cdp = await contexto.newCDPSession(pagina);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      await pagina.waitForTimeout(800);
      assert.ok(await pagina.$('.dica-flutuante'), 'dica aparece ao segurar');
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await pagina.waitForTimeout(300);
      assert.equal(await naCena(pagina, 'return cena.partida.valor > 1 || !!cena.partida.pedido'), false, 'segurar não truca');
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      await pagina.waitForTimeout(60);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await esperarCena(pagina, 'return cena.partida.valor > 1 || !!cena.partida.pedido || cena.encerrada');
      assert.deepEqual(jogo.erros, []);
    } finally { await jogo.fechar(); }
  });

  it('celular em tela cheia: botão responde mesmo com o polegar apoiado na borda da tela', async () => {
    const jogo = await abrirJogo(servidor.url, { dispositivo: 'Pixel 7', deitado: true, consulta: '?res=1' });
    const { pagina, contexto } = jogo;
    try {
      await comecarPartida(pagina, { oponente: 'aleatorio', partida: '12', inicio: 'sorteio' });
      /* entrar e sair da tela cheia remede o canvas (os toques seguem caindo nos botões) */
      await pagina.evaluate(() => document.dispatchEvent(new Event('fullscreenchange')));
      await pagina.waitForTimeout(1400);
      const [x, y] = await naCena(pagina, `
        const b = cena.painel.botaoMenu, canvas = jogo.canvas, r = canvas.getBoundingClientRect(), cam = cena.cameras.main, k = r.width / canvas.width;
        return [r.left + (b.x - cam.worldView.x) * cam.zoom * k, r.top + (b.y - cam.worldView.y) * cam.zoom * k];`);
      const cdp = await contexto.newCDPSession(pagina);
      const toque = (type, touchPoints) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints });
      const polegar = { x: 4, y: 200, id: 1 }, dedo = { x, y, id: 2 };
      await toque('touchStart', [polegar]);
      await pagina.waitForTimeout(100);
      await toque('touchStart', [polegar, dedo]);
      await pagina.waitForTimeout(80);
      await toque('touchEnd', [polegar]);
      await pagina.waitForTimeout(100);
      await toque('touchEnd', []);
      await pagina.waitForTimeout(300);
      assert.ok(await pagina.$('.janela-da-mesa'), 'o segundo dedo aperta o botão MENU');
      assert.deepEqual(jogo.erros, []);
    } finally { await jogo.fechar(); }
  });

  it('som, música, comemorações, derrota e voltar ao menu', async () => {
    const jogo = await abrirJogo(servidor.url, { consulta: '?res=1' });
    const { pagina } = jogo;
    try {
      await comecarPartida(pagina, { oponente: 'aleatorio', terreno: 'montanha', partida: '12', inicio: 'sorteio' });
      /* MENU: som e música mudam com a janela aberta */
      await apertar(pagina, 'botaoMenu');
      const som = pagina.locator('.janela-da-mesa [data-chave="som"]'), musica = pagina.locator('.janela-da-mesa [data-chave="musica"]');
      await som.dispatchEvent('click');
      assert.match(await som.textContent(), /Som: não/);
      await som.dispatchEvent('click');
      assert.match(await som.textContent(), /Som: sim/);
      await musica.dispatchEvent('click');
      assert.match(await musica.textContent(), /Música: não/);
      await musica.dispatchEvent('click');
      assert.match(await musica.textContent(), /Música: sim/);
      await capturar(pagina, '20-menu-da-mesa');
      await pagina.locator('.janela-da-mesa [data-fechar]').dispatchEvent('click');
      /* comemorações e impacto do truco */
      await naCena(pagina, 'cena.comemorar("mao", "Você"); cena.impactoDoTruco(12);');
      await pagina.waitForTimeout(500);
      await capturar(pagina, '19-vitoria');
      await naCena(pagina, 'cena.comemorar("partida", "Você");');
      await pagina.waitForTimeout(300);
      /* regras e grimório pelos botões da mesa */
      await naJanela(pagina, 'botaoRegras', '[data-opcao="regras"]');
      await pagina.locator('.camada [data-fechar] >> nth=0').click();
      await naJanela(pagina, 'botaoRegras', '[data-opcao="grimorio"]');
      await pagina.locator('.camada [data-fechar] >> nth=0').click();
      /* menu: continuar jogando, depois voltar */
      await naJanela(pagina, 'botaoMenu', '[data-opcao="sair"]');
      await pagina.locator('.camada .botao', { hasText: 'Continuar jogando' }).click();
      await naJanela(pagina, 'botaoMenu', '[data-opcao="sair"]');
      await pagina.locator('.camada .botao', { hasText: 'Voltar ao menu' }).click();
      await esperarMenu(pagina);
      assert.deepEqual(jogo.erros, []);
    } finally { await jogo.fechar(); }
  });
});
