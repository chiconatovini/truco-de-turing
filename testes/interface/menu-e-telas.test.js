/**
 * @file Testes de interface (navegador de verdade): carregamento, menu, telas do menu, versão,
 * celular na vertical (aviso para girar) e renderizador Canvas.
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { subirServidor, abrirJogo, esperarMenu, naCena, capturar, comecarPartida, esperarCena } from '../apoio/navegador.js';

let servidor;
before(async () => { servidor = await subirServidor(); });
after(() => servidor.fechar());

describe('menu e telas', () => {
  it('carrega, mostra o menu com as escolhas e abre Como jogar, Grimório, Conquistas, Mods e Sobre', async () => {
    const jogo = await abrirJogo(servidor.url, { consulta: '?res=1' });
    const { pagina } = jogo;
    try {
      await esperarMenu(pagina);
      await capturar(pagina, '01-menu');
      assert.equal(await pagina.locator('#m-oponente option').count(), 3);
      assert.equal(await pagina.locator('#m-jogadores option').count(), 4);
      assert.equal(await pagina.locator('#m-arquitetura option').count(), 4);
      assert.equal(await pagina.locator('#m-baralho option').count(), 5);
      assert.equal(await pagina.locator('#m-terreno option').count(), 4);
      await pagina.selectOption('#m-terreno', 'oceano');
      await pagina.waitForSelector('.miniatura img');
      for (const [botao, texto] of [['#m-regras', 'Como jogar'], ['#m-grimorio', 'Grimório'], ['#m-conquistas', 'Conquistas'], ['#m-mods', 'Mods'], ['#m-sobre', 'Sobre']]) {
        await pagina.click(botao);
        await pagina.waitForSelector('.camada:not(.transparente) h2');
        assert.match(await pagina.locator('.camada:not(.transparente) h2').first().textContent(), new RegExp(texto));
        if (botao === '#m-grimorio') {
          await pagina.click('#g-lista button >> nth=3');
          assert.equal(await pagina.locator('#g-lista .lido').count(), 2);
        }
        if (botao === '#m-conquistas') { await pagina.waitForSelector('#c-retrato canvas'); await capturar(pagina, '02-conquistas'); }
        if (botao === '#m-sobre') assert.match(await pagina.locator('.versao').textContent(), /Versão \d+\.\d+\.\d+/);
        if (botao === '#m-mods') await capturar(pagina, '24-mods');
        await pagina.click('.camada:not(.transparente) [data-fechar] >> nth=0');
      }
      assert.deepEqual(jogo.erros, []);
    } finally { await jogo.fechar(); }
  });

  it('celular na vertical: só o aviso para girar; ao girar, o jogo é criado e o menu aparece', async () => {
    const jogo = await abrirJogo(servidor.url, { dispositivo: 'iPhone 13' });
    const { pagina } = jogo;
    try {
      await pagina.waitForTimeout(800);
      assert.equal(await pagina.evaluate(() => getComputedStyle(document.querySelector('#girar')).display), 'grid');
      assert.equal(await pagina.evaluate(() => !!globalThis.__TRUCO_DE_TURING__.jogo), false);
      await capturar(pagina, '03-celular-vertical');
      await pagina.setViewportSize({ width: 844, height: 390 });
      await esperarMenu(pagina);
      assert.equal(await pagina.evaluate(() => getComputedStyle(document.querySelector('#girar')).display), 'none');
      await comecarPartida(pagina);
      await esperarCena(pagina, 'return cena.modo === "inicio"');
      await capturar(pagina, '04-celular-horizontal');
      /* o jogo pediu tela cheia ao começar (celular): sai dela para poder girar a janela */
      await pagina.evaluate(() => document.fullscreenElement && document.exitFullscreen());
      await pagina.waitForTimeout(200);
      await pagina.setViewportSize({ width: 390, height: 844 });
      await pagina.waitForTimeout(300);
      assert.equal(await pagina.evaluate(() => getComputedStyle(document.querySelector('#girar')).display), 'grid');
      assert.deepEqual(jogo.erros, []);
    } finally { await jogo.fechar(); }
  });

  it('renderizador Canvas e resolução forçados pela URL', async () => {
    const jogo = await abrirJogo(servidor.url, { consulta: '?renderer=canvas&res=1.5' });
    const { pagina } = jogo;
    try {
      await esperarMenu(pagina);
      const tipo = await naCena(pagina, 'return jogo.config.renderType === Phaser.CANVAS');
      assert.equal(tipo, true);
      assert.equal(await naCena(pagina, 'return jogo.config.width'), 1920);
      assert.deepEqual(jogo.erros, []);
    } finally { await jogo.fechar(); }
  });
});
