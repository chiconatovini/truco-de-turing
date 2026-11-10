/**
 * @file Tela do Grimório: lista de verbetes à esquerda e o verbete escolhido à direita.
 * Ler um verbete conta para a conquista "Bibliotecário".
 */
import { VERBETES } from '../../conteudo/grimorio.js';
import { abrirPainel, escaparHtml } from '../paineis.js';
import { textoComFormulas } from '../formulas.js';

/** Parágrafo com rótulo em negrito, se houver texto. */
function secao(rotulo, texto, classe = '') {
  if (!texto) return '';
  return '<p' + (classe ? ' class="' + classe + '"' : '') + '><b>' + rotulo + ':</b> ' + textoComFormulas(texto) + '</p>';
}

/**
 * Corpo do verbete. Os verbetes completos têm a ideia, o conceito, a jogada, onde a comparação
 * falha e a matemática; os curtos, só o conceito e a jogada.
 * @param {object} v Verbete de `VERBETES`.
 * @returns {string}
 */
export function htmlDoVerbete(v) {
  if (!v.ideia) return '<p>' + textoComFormulas(v.conceito) + '</p>' + secao('No jogo', v.noJogo, 'no-jogo');
  return secao('A ideia', v.ideia) +
    secao('Na vida real', v.conceito) +
    secao('No jogo', v.noJogo, 'no-jogo') +
    secao('Onde a comparação falha', v.ondeFalha) +
    (v.aprofundar ? '<div class="aprofundar"><h3>Para se aprofundar</h3><p>' + textoComFormulas(v.aprofundar) + '</p>' +
      (v.formula ? textoComFormulas('$$' + v.formula + '$$') : '') + '</div>' : '') +
    (v.autoria ? '<p class="autoria">Verbete redigido por ' + escaparHtml(v.autoria) + '.</p>' : '');
}

/**
 * Abre o Grimório.
 * @param {object} app Aplicação (guarda os verbetes lidos).
 * @param {string} [idInicial] Verbete aberto de início.
 * @param {() => void} [aoFechar]
 */
export function abrirGrimorio(app, idInicial, aoFechar) {
  const html = '<div class="folha"><button class="fechar-x" data-fechar aria-label="Fechar">×</button>' +
    '<h2>Grimório de conceitos</h2><p>Cada mecânica do jogo é um conceito de aprendizado de máquina. Os verbetes aparecem destacados quando acontecem na mesa.</p>' +
    '<div class="grimorio"><nav class="grimorio-lista" id="g-lista"></nav><article class="grimorio-verbete" id="g-verbete"></article></div></div>';
  const painel = abrirPainel(html, { fechaAoClicarFora: true, aoFechar });
  const lista = painel.elemento.querySelector('#g-lista');
  const artigo = painel.elemento.querySelector('#g-verbete');

  /** Desenha a lista com o verbete ativo destacado. */
  function desenharLista(ativo) {
    lista.innerHTML = VERBETES.map((v) =>
      '<button data-id="' + v.id + '" aria-current="' + (v.id === ativo) + '">' + escaparHtml(v.titulo) +
      (app.progresso.lidos[v.id] ? '<span class="lido">lido</span>' : '') + '</button>').join('');
    lista.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => mostrar(b.dataset.id)));
  }

  /** Mostra um verbete e o marca como lido. */
  function mostrar(id) {
    const v = VERBETES.find((x) => x.id === id) || VERBETES[0];
    app.marcarVerbeteLido(v.id);
    artigo.innerHTML = '<div class="categoria">' + escaparHtml(v.categoria) + '</div><h2>' + escaparHtml(v.titulo) + '</h2>' +
      htmlDoVerbete(v);
    desenharLista(v.id);
  }

  mostrar(idInicial || VERBETES[0].id);
  return painel;
}
