/**
 * @file Relator (reporter) do executor de testes do Node: junta o resultado de cada teste
 * (nome, suíte, arquivo, situação, duração e erro) num único JSON, usado por
 * ferramentas/relatorios.js para escrever os relatórios em Markdown.
 *
 * Uso: node --test --test-reporter=./testes/apoio/relator.js --test-reporter-destination=saida.json
 */
import { relative } from 'node:path';

export default async function* relator(fonte) {
  const pais = new Map(); /* arquivo|nível|nome → nome da suíte acima */
  const pilha = {};
  const resultados = [];
  const chave = (d) => (d.file || '') + '|' + d.nesting + '|' + d.name;
  for await (const evento of fonte) {
    const d = evento.data || {};
    if (evento.type === 'test:start') {
      pilha[(d.file || '') + '#' + d.nesting] = d.name;
      pais.set(chave(d), d.nesting > 0 ? pilha[(d.file || '') + '#' + (d.nesting - 1)] : null);
    } else if (evento.type === 'test:pass' || evento.type === 'test:fail') {
      const detalhes = d.details || {};
      resultados.push({
        nome: d.name,
        suite: pais.get(chave(d)) || null,
        arquivo: d.file ? relative(process.cwd(), d.file) : null,
        nivel: d.nesting,
        tipo: detalhes.type || 'test',
        situacao: evento.type === 'test:pass' ? (d.skip ? 'pulado' : 'aprovado') : 'reprovado',
        duracaoMs: Math.round((detalhes.duration_ms || 0) * 10) / 10,
        erro: detalhes.error ? String(detalhes.error.cause?.message || detalhes.error.message || detalhes.error).slice(0, 800) : null,
      });
    }
  }
  yield JSON.stringify({ resultados }, null, 1);
}
