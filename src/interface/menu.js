/**
 * @file Menu principal: apresentação do jogo, botões das telas e configuração da mesa
 * (oponente, baralho, terreno, quem começa e tipo de partida).
 */
import { MUNDO } from '../configuracao.js';
import { BARALHOS } from '../nucleo/baralhos.js';
import { TERRENOS } from '../nucleo/terrenos.js';
import { OPONENTES } from '../nucleo/oponentes/index.js';
import { desenharVerso } from '../arte/versos.js';
import { desenharMesa } from '../arte/mesas.js';
import { abrirPainel, escaparHtml } from './paineis.js';
import { Som } from './som.js';
import { abrirRegras } from './telas/regras.js';
import { abrirGrimorio } from './telas/grimorio.js';
import { abrirConquistas } from './telas/conquistas.js';
import { abrirSobre } from './telas/sobre.js';

/** Opções da lista "Oponente", incluindo o modo de dois humanos. */
const ESCOLHAS_OPONENTE = {
  montecarlo: 'Mestre Monte Carlo · difícil',
  guloso: 'Gradiente Guloso · médio',
  aleatorio: 'Zé do Ruído · fácil',
  doisHumanos: '2 humanos no mesmo aparelho',
};
const ESCOLHAS_INICIO = {
  'revela-descarta': 'Revela carta da mão (vai para o cemitério)',
  'revela-volta': 'Revela carta da mão (volta para a mão)',
  sorteio: 'Par ou ímpar (sorteio)',
};
const ESCOLHAS_PARTIDA = { 12: 'Partida até 12 tentos, com truco', 1: 'Mão única, sem truco' };

/** Miniaturas do verso e da mesa já desenhadas (evita redesenhar a cada troca). */
const miniaturas = {};

/** Mostra a miniatura `chave` dentro do elemento, desenhando-a na primeira vez com `desenhar()`. */
function mostrarMiniatura(elemento, chave, desenhar) {
  if (!elemento) return;
  if (!miniaturas[chave]) { try { miniaturas[chave] = desenhar().toDataURL(); } catch (e) { return; } }
  const img = elemento.querySelector('img') || elemento.appendChild(document.createElement('img'));
  img.alt = '';
  img.src = miniaturas[chave];
}

/** Gera as `<option>` de uma lista. `rotulos` mapeia valor → texto (ou objeto com `nome`). */
function opcoesHtml(rotulos, selecionado) {
  return Object.keys(rotulos).map((valor) => {
    const rotulo = typeof rotulos[valor] === 'string' ? rotulos[valor] : rotulos[valor].nome;
    return '<option value="' + valor + '"' + (valor === String(selecionado) ? ' selected' : '') + '>' + escaparHtml(rotulo) + '</option>';
  }).join('');
}

/** HTML do menu. */
function htmlDoMenu(opcoes) {
  return '<div class="menu">' +
    '<section class="menu-capa">' +
    '<h1><span>O JOGO DO</span>Truco de Turing</h1>' +
    '<p>Monte uma rede neural carta por carta, da entrada à saída. Tune seus neurônios, aplique overfit no adversário, fuja do vanishing gradient e, quando sentir a mão boa, grite TRUCO.</p>' +
    '<div class="legenda"><span><i class="ponto" style="background:var(--azul)"></i><b>Azul</b> é a sua rede</span><span><i class="ponto" style="background:var(--laranja)"></i><b>Laranja</b> é a do adversário</span></div>' +
    '<div class="menu-acoes">' +
    '<button class="botao vinho jogar" id="m-jogar" autofocus>Jogar</button>' +
    '<div class="menu-mais">' +
    '<button class="botao" id="m-regras">Como jogar</button>' +
    '<button class="botao" id="m-grimorio">Grimório</button>' +
    '<button class="botao" id="m-conquistas">Conquistas</button>' +
    '<button class="botao" id="m-sobre">Sobre</button>' +
    '</div></div>' +
    '<div class="creditos">Regras originais: prof. Peng Yaohao (FPO 2026/2, PPCA/UnB). Feito com Phaser. Código aberto sob a licença <a href="https://github.com/welyngton/truco-de-turing#GPL-3.0-1-ov-file" target="_blank" rel="noopener">GPL-3.0</a>.</div>' +
    '</section>' +
    '<section class="folha menu-painel">' +
    '<h3 style="margin-top:0">Configurar a mesa</h3>' +
    '<div class="campo"><label for="m-oponente">Oponente</label><select id="m-oponente">' + opcoesHtml(ESCOLHAS_OPONENTE, opcoes.oponente) + '</select><div class="dica" id="m-oponente-dica"></div></div>' +
    '<div class="campo"><label for="m-baralho">Baralho</label><div class="campo-linha"><select id="m-baralho">' + opcoesHtml(BARALHOS, opcoes.baralho) + '</select><span class="miniatura verso" id="m-baralho-img"></span></div><div class="dica" id="m-baralho-dica"></div></div>' +
    '<div class="campo"><label for="m-terreno">Terreno</label><div class="campo-linha"><select id="m-terreno">' + opcoesHtml(TERRENOS, opcoes.terreno) + '</select><span class="miniatura mesa" id="m-terreno-img"></span></div><div class="dica" id="m-terreno-dica"></div></div>' +
    '<div class="campo"><label for="m-inicio">Quem começa</label><select id="m-inicio">' + opcoesHtml(ESCOLHAS_INICIO, opcoes.inicio) + '</select></div>' +
    '<div class="campo" style="margin-bottom:0"><label for="m-partida">Partida</label><select id="m-partida">' + opcoesHtml(ESCOLHAS_PARTIDA, opcoes.alvo) + '</select></div>' +
    '</section></div>';
}

/**
 * Abre o menu principal.
 * @param {object} app A aplicação (ver aplicacao.js).
 */
export function abrirMenu(app) {
  const painel = abrirPainel(htmlDoMenu(app.opcoes), { transparente: true });
  const elemento = painel.elemento;
  const campo = (id) => elemento.querySelector('#' + id);

  /** Atualiza descrições e miniaturas conforme as escolhas. */
  function atualizarDicas() {
    const oponente = campo('m-oponente').value;
    const perfil = OPONENTES[oponente];
    campo('m-oponente-dica').textContent = perfil
      ? 'Nível ' + perfil.nivel.toLowerCase() + ', ' + perfil.metodo + '. ' + perfil.estilo
      : 'Dois jogadores se revezam no mesmo aparelho. A mão de quem não joga fica escondida.';
    const baralho = campo('m-baralho').value, terreno = campo('m-terreno').value;
    campo('m-baralho-dica').textContent = BARALHOS[baralho].resumo;
    campo('m-terreno-dica').textContent = TERRENOS[terreno].resumo;
    mostrarMiniatura(campo('m-baralho-img'), 'verso:' + baralho, () => desenharVerso('mesa', 1.2, baralho));
    mostrarMiniatura(campo('m-terreno-img'), 'mesa:' + terreno, () => desenharMesa(terreno, MUNDO.largura * 2, MUNDO.altura * 2, 0.07));
  }

  /** Guarda as escolhas atuais na aplicação (as opções que não estão nesta tela continuam como estavam). */
  function lerEscolhas() {
    app.opcoes = {
      ...app.opcoes,
      oponente: campo('m-oponente').value, baralho: campo('m-baralho').value, terreno: campo('m-terreno').value,
      inicio: campo('m-inicio').value, alvo: Number(campo('m-partida').value),
    };
    app.salvarOpcoes();
  }

  elemento.querySelectorAll('select').forEach((s) => s.addEventListener('change', atualizarDicas));
  atualizarDicas();
  campo('m-jogar').addEventListener('click', () => { Som.desbloquear(); lerEscolhas(); painel.fechar(); app.jogar(); });
  campo('m-regras').addEventListener('click', () => { lerEscolhas(); abrirRegras(app); });
  campo('m-grimorio').addEventListener('click', () => { lerEscolhas(); abrirGrimorio(app); });
  campo('m-conquistas').addEventListener('click', () => { lerEscolhas(); abrirConquistas(app); });
  campo('m-sobre').addEventListener('click', () => { lerEscolhas(); abrirSobre(); });
  return painel;
}
