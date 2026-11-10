/**
 * @file Texto com fórmulas em LaTeX para os painéis HTML: `$...$` no meio da frase e `$$...$$`
 * em destaque. Usa o KaTeX carregado pela página (global `katex`); sem ele, mostra o LaTeX
 * como código, para o texto continuar legível offline.
 */
import { escaparHtml } from './paineis.js';

/** Trechos `$$...$$` (destaque) ou `$...$` (na linha). */
const FORMULA = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;

/**
 * Uma fórmula em HTML.
 * @param {string} tex LaTeX sem os cifrões.
 * @param {boolean} destaque `true` para fórmula em bloco.
 * @param {object} [katex] Biblioteca KaTeX (padrão: a global).
 * @returns {string}
 */
export function formulaHtml(tex, destaque, katex = globalThis.katex) {
  if (katex && typeof katex.renderToString === 'function') {
    try {
      return katex.renderToString(tex, { displayMode: destaque, throwOnError: false, output: 'htmlAndMathml' });
    } catch (e) { /* cai no LaTeX como código */ }
  }
  const codigo = '<code class="formula-tex">' + escaparHtml(tex) + '</code>';
  return destaque ? '<div class="formula-bloco">' + codigo + '</div>' : codigo;
}

/**
 * Texto em HTML, com o texto comum escapado e as fórmulas renderizadas.
 * @param {string} texto Texto com `$...$` e `$$...$$`.
 * @param {object} [katex] Biblioteca KaTeX (padrão: a global).
 * @returns {string}
 */
export function textoComFormulas(texto, katex = globalThis.katex) {
  let html = '', ultimo = 0;
  for (const m of String(texto).matchAll(FORMULA)) {
    html += escaparHtml(texto.slice(ultimo, m.index));
    html += m[1] !== undefined ? formulaHtml(m[1].trim(), true, katex) : formulaHtml(m[2].trim(), false, katex);
    ultimo = m.index + m[0].length;
  }
  return html + escaparHtml(String(texto).slice(ultimo));
}
