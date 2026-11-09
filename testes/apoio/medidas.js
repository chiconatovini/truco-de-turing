/**
 * @file Apoio aos testes de performance: cronômetro e registro das medidas para o relatório.
 *
 * Cada medida tem um limite. O teste falha se o limite for ultrapassado; o valor medido vai para
 * o relatório (arquivo JSON na pasta indicada por RELATORIO_MEDIDAS, quando definida).
 */
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import assert from 'node:assert/strict';

/**
 * Roda `funcao` repetidas vezes (após um aquecimento) e devolve o tempo médio, a mediana e o p95
 * em milissegundos.
 */
export function cronometrar(funcao, { repeticoes = 50, aquecimento = 5 } = {}) {
  for (let i = 0; i < aquecimento; i++) funcao(i);
  const tempos = [];
  for (let i = 0; i < repeticoes; i++) {
    const inicio = performance.now();
    funcao(i);
    tempos.push(performance.now() - inicio);
  }
  tempos.sort((a, b) => a - b);
  const media = tempos.reduce((s, t) => s + t, 0) / tempos.length;
  return { media, mediana: tempos[Math.floor(tempos.length / 2)], p95: tempos[Math.floor(tempos.length * 0.95)], repeticoes };
}

/**
 * Registra uma medida e confere o limite.
 * @param {{grupo: string, nome: string, valor: number, unidade: string, limite: number, melhor: 'menor'|'maior', detalhe?: string}} medida
 */
export function registrarMedida(medida) {
  const pasta = process.env.RELATORIO_MEDIDAS;
  if (pasta) {
    mkdirSync(pasta, { recursive: true });
    appendFileSync(join(pasta, 'medidas-' + process.pid + '.jsonl'), JSON.stringify({ ...medida, quando: new Date().toISOString() }) + '\n');
  }
  const ok = medida.melhor === 'menor' ? medida.valor <= medida.limite : medida.valor >= medida.limite;
  assert.ok(ok, medida.nome + ': ' + medida.valor.toFixed(2) + ' ' + medida.unidade + ' (limite ' + (medida.melhor === 'menor' ? '≤ ' : '≥ ') + medida.limite + ')');
}
