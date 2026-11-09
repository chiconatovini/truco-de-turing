/**
 * @file Testes de performance no navegador (Chromium sem janela): tempo até o menu, tempo até a
 * mesa ficar pronta, quadros por segundo na mesa, memória e tempo de resposta a uma jogada.
 * O Chromium de teste não tem placa de vídeo (desenha por software), então os limites são folgados.
 */
import { describe, it, before, after } from 'node:test';
import { subirServidor, abrirJogo, comecarPartida, naCena, esperarCena } from '../apoio/navegador.js';
import { registrarMedida } from '../apoio/medidas.js';

const grupo = 'Navegador';
let servidor;
before(async () => { servidor = await subirServidor(); });
after(() => servidor.fechar());

/** Abre o jogo, mede a mesa (por renderizador) e fecha. */
async function medirMesa(consulta, rotulo) {
  const jogo = await abrirJogo(servidor.url, { consulta });
  const { pagina } = jogo;
  try {
    const inicio = Date.now();
    await pagina.waitForSelector('#m-jogar', { timeout: 60000 });
    registrarMedida({ grupo, nome: 'Tempo até o menu (' + rotulo + ')', valor: Date.now() - inicio, unidade: 'ms', limite: 15000, melhor: 'menor' });
    const antes = Date.now();
    await comecarPartida(pagina, { oponente: 'aleatorio', inicio: 'sorteio' });
    registrarMedida({ grupo, nome: 'Tempo até a mesa pronta (' + rotulo + ')', valor: Date.now() - antes, unidade: 'ms', limite: 15000, melhor: 'menor' });
    await naCena(pagina, 'cena.time.timeScale = 1; cena.tweens.timeScale = 1;');
    const quadros = await pagina.evaluate(() => new Promise((resolve) => {
      let n = 0; const inicio = performance.now();
      const contar = () => { n++; if (performance.now() - inicio < 3000) requestAnimationFrame(contar); else resolve(n / ((performance.now() - inicio) / 1000)); };
      requestAnimationFrame(contar);
    }));
    registrarMedida({ grupo, nome: 'Quadros por segundo na mesa (' + rotulo + ')', valor: quadros, unidade: 'qps', limite: rotulo === 'WebGL' ? 3 : 20, melhor: 'maior', detalhe: rotulo === 'WebGL' ? 'WebGL por software (sem GPU no teste)' : 'Chromium sem GPU' });
    const memoria = await pagina.evaluate(() => (performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 0));
    if (memoria) registrarMedida({ grupo, nome: 'Memória JavaScript em uso (' + rotulo + ')', valor: memoria, unidade: 'MB', limite: 400, melhor: 'menor' });
    /* tempo de resposta: do clique numa jogada até a mesa redesenhada */
    await esperarCena(pagina, 'if (document.querySelector(".camada .botao.vinho")) document.querySelector(".camada .botao.vinho").click(); return cena.ehVezDoHumano()');
    const resposta = await naCena(pagina, 'const t = performance.now(); cena.aoClicarNoNeuronio(Object.keys(cena.alvos)[0]); return performance.now() - t;');
    registrarMedida({ grupo, nome: 'Resposta a uma jogada (' + rotulo + ')', valor: resposta, unidade: 'ms', limite: 300, melhor: 'menor' });
  } finally { await jogo.fechar(); }
}

describe('jogo no navegador', () => {
  it('WebGL (padrão)', () => medirMesa('?res=1', 'WebGL'));
  it('Canvas 2D', () => medirMesa('?renderer=canvas&res=1', 'Canvas'));
});
