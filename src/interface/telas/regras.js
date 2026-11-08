/**
 * @file Tela "Como jogar": resumo das regras, ações, desempates, truco, baralhos e terrenos.
 */
import { BARALHOS } from '../../nucleo/baralhos.js';
import { TERRENOS } from '../../nucleo/terrenos.js';
import { abrirPainel, escaparHtml } from '../paineis.js';

/** Lista "nome: resumo" de baralhos e terrenos (o terreno neutro fica de fora). */
function listaDeExtensoes() {
  const baralhos = Object.values(BARALHOS).map((b) => '<li><b>' + b.nome + ':</b> ' + escaparHtml(b.resumo) + '</li>');
  const terrenos = Object.entries(TERRENOS).filter(([chave]) => chave !== 'neutro').map(([, t]) => '<li><b>' + t.nome + ':</b> ' + escaparHtml(t.resumo) + '</li>');
  return '<ul>' + baralhos.join('') + terrenos.join('') + '</ul>';
}

/**
 * Abre a tela de regras. Na primeira partida ela abre sozinha; ao fechar, chama `aoFechar`.
 * @param {object|null} app Aplicação (marca o tutorial como visto), ou null.
 * @param {() => void} [aoFechar]
 */
export function abrirRegras(app, aoFechar) {
  const html = '<div class="folha"><button class="fechar-x" data-fechar aria-label="Fechar">\u00d7</button>' +
      '<h2>Como jogar</h2>' +
      '<p>Dois jogadores disputam quem constrói a rede neural de maior soma, ligando a <b>camada de entrada</b> à <b>camada de saída</b> com um neurônio em cada uma das 5 camadas ocultas. A sua rede é <span class="selo azul">azul</span>, a do adversário é <span class="selo laranja">laranja</span>.</p>' +
      '<h3>Preparação</h3>' +
      '<ul><li>Baralho de 52 cartas, sem coringas. Na mesa, viradas: 3 na entrada, 5 em cada uma das 5 camadas ocultas e 4 na saída.</li>' +
      '<li>Cada jogador recebe 5 cartas na mão. Elas <b>não são repostas</b>: são seu estoque de ações para a mão inteira.</li>' +
      '<li>As 10 restantes vão para o <b>limbo</b> sem serem vistas (ruído).</li></ul>' +
      '<h3>Seu turno</h3>' +
      '<p>Faça uma destas coisas: <b>ative um neurônio</b> virado na próxima camada da sua rede (clique nele), ou use cartas da mão numa ação. Cada neurônio pertence a um só jogador. Só pode passar quem não tem neurônio para ativar.</p>' +
      '<h3>Pontuação</h3>' +
      '<ul><li>2 a 10 valem o número, Ás vale 11, J, Q e K valem 0.</li>' +
      '<li>Figuras iguais em camadas vizinhas: par vale +10, trio +20. Quatro figuras iguais seguidas (contando as empilhadas) causam <b>vanishing gradient</b> e zeram a rede.</li></ul>' +
      '<h3>Ações com a mão</h3>' +
      '<p>Selecione cartas da mão de mesma figura do neurônio e clique no alvo. Entrada e saída são imunes. O alvo é sempre o neurônio oculto mais recente de uma rede.</p>' +
      '<ul><li><b>Tunagem</b> (1 carta no seu neurônio): a carta soma à rede; em figuras, +10.</li>' +
      '<li><b>Overfit</b> (1 carta no neurônio do adversário): o neurônio vai para o cemitério e a rede dele recua uma camada.</li>' +
      '<li><b>Early stop</b> (o neurônio fica com 3 cartas): a rede atingida é finalizada na hora.</li>' +
      '<li><b>Stack overflow</b> (4 cartas): early stop e a vítima perde a mão inteira.</li>' +
      '<li><b>Dropout / GatoNet</b>: desvire seus últimos neurônios ocultos pagando 1 carta por camada. Não gasta o turno.</li>' +
      '<li><b>Transfer learning</b>: com quatro cartas iguais na mão, troque-as por quatro do limbo (uma vez por mão).</li></ul>' +
      '<p>Exemplo do enunciado: a rede 8-K-K-3 com tunagem num K soma 8 + (trio de Reis 20) + (tunagem 10) + 3 = <b>41</b>.</p>' +
      '<h3>Fim da mão e desempates</h3>' +
      '<p>A mão acaba quando todas as redes estão finalizadas (chegaram à saída, ou sofreram early stop ou stack overflow) ou quando todos passam em seguida. Vence a maior soma. Empate: menos dropouts; depois a maior soma das melhores cartas da mão; depois a carta mais alta (espadas &gt; copas &gt; paus &gt; ouros); por fim, quem jogou primeiro.</p>' +
      '<h3>Truco</h3>' +
      '<p>Na partida até 12 tentos cada mão vale 1. Na sua vez, peça <b>TRUCO</b> (3). O outro aceita, corre (você leva o valor atual) ou aumenta: SEIS, NOVE, DOZE. Com alguém a um tento da vitória é <b>mão de onze</b> e ninguém truca.</p>' +
      '<h3>Baralhos e terrenos</h3>' + listaDeExtensoes() +
    '<div class="linha fim" style="margin-top:14px"><button class="botao" data-fechar>Entendi</button></div></div>';
  if (app) { app.progresso.tutorialVisto = true; app.salvar(); }
  return abrirPainel(html, { fechaAoClicarFora: true, aoFechar });
}
