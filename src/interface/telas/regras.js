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
      '<li>Cada jogador recebe 5 cartas na mão (10 no baralho de truco, que usa 2 baralhos). Elas <b>não são repostas</b>: são seu estoque de ações para a mão inteira.</li>' +
      '<li>As 10 restantes vão para o <b>limbo</b> sem serem vistas (ruído).</li></ul>' +
      '<h3>Seu turno</h3>' +
      '<p>Faça uma destas coisas: <b>ative um neurônio</b> virado na próxima camada da sua rede (clique nele), ou use cartas da mão numa ação. Cada neurônio pertence a um só jogador. Se não sobrar neurônio livre na próxima camada, a sua rede é finalizada ali. Só passa a vez quem teve a rede interrompida por early stop (atacar não é obrigatório) ou não tem nenhuma jogada.</p>' +
      '<h3>Pontuação</h3>' +
      '<ul><li>2 a 10 valem o número, Ás vale 11, J, Q e K valem 0.</li>' +
      '<li>Figuras iguais em camadas vizinhas formam uma sequência, e as empilhadas contam. Cada figura da sequência vale 10: par 20, trio 30. Quatro figuras iguais causam <b>vanishing gradient</b> e zeram a rede.</li></ul>' +
      '<h3>Ações com a mão</h3>' +
      '<p>Selecione cartas da mão de mesma figura do neurônio e clique no alvo. Entrada e saída são imunes. O alvo é sempre o neurônio oculto mais recente de uma rede.</p>' +
      '<ul><li><b>Tunagem</b> (1 carta no seu neurônio): a carta soma à rede; em figura, ela entra na sequência de figuras iguais (um K tunado já é um par).</li>' +
      '<li><b>Overfit</b> (1 carta no neurônio do adversário): o neurônio vai para o cemitério e a rede dele recua uma camada.</li>' +
      '<li><b>Early stop</b> (o neurônio fica com 3 cartas): a rede atingida é finalizada na hora.</li>' +
      '<li><b>Stack overflow</b> (4 cartas): early stop e a vítima perde a mão inteira.</li>' +
      '<li><b>Dropout / GatoNet</b>: desfaça seus últimos neurônios ocultos pagando 1 carta por camada. Eles vão para o cemitério e você continua da camada anterior. Não gasta o turno.</li>' +
      '<li><b>Transfer learning</b>: com quatro cartas iguais na mão, troque-as por quatro do limbo (uma vez por mão). Não gasta o turno.</li></ul>' +
      '<p>Exemplo do enunciado: a rede 8-K-K-3 com tunagem num K tem três Reis e soma 8 + (trio de Reis 30) + 3 = <b>41</b>. Tunar os dois Reis formaria uma quadra e zeraria a rede.</p>' +
      '<h3>Fim da mão e desempates</h3>' +
      '<p>A mão acaba quando todas as redes estão finalizadas (chegaram à saída, sofreram early stop ou stack overflow, ou ficaram sem neurônio livre) ou quando ninguém mais tem jogada. Vence a maior soma. Empate: menos dropouts; depois a maior soma das melhores cartas da mão; depois a carta mais alta (Ás, K, Q, J, 10 … 2); depois o naipe dela (espadas &gt; copas &gt; paus &gt; ouros); por fim, quem jogou primeiro.</p>' +
      '<h3>Truco</h3>' +
      '<p>Na partida até 12 tentos cada mão vale 1. Na sua vez, peça <b>TRUCO</b> (3). O outro aceita, corre (você leva o valor atual) ou aumenta: SEIS, NOVE, DOZE. Com alguém a um tento da vitória é <b>mão de onze</b> e ninguém truca.</p>' +
      '<h3>Baralhos e terrenos</h3>' + listaDeExtensoes() +
    '<div class="linha fim" style="margin-top:14px"><button class="botao" data-fechar>Entendi</button></div></div>';
  if (app) { app.progresso.tutorialVisto = true; app.salvar(); }
  return abrirPainel(html, { fechaAoClicarFora: true, aoFechar });
}
