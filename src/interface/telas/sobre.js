/**
 * @file Tela "Sobre": o jogo, a disciplina, a especificação, o professor, os autores e a licença.
 */
import { abrirPainel } from '../paineis.js';

/** Abre a tela "Sobre". */
export function abrirSobre() {
  const html = '<div class="folha sobre"><button class="fechar-x" data-fechar aria-label="Fechar">\u00d7</button>' +
      '<h2>Sobre o Truco de Turing</h2>' +
      '<p>Um jogo de cartas para navegador que ensina redes neurais jogando. Cada carta é um neurônio, cada mão é uma rede construída da entrada à saída, e cada ação com as cartas (tunagem, overfit, dropout, early stop, transfer learning) é um conceito do treino de modelos. Por cima de tudo, o truco: tentos, pedidos de TRUCO, SEIS, NOVE e DOZE, e blefe.</p>' +
      '<h3>A disciplina</h3>' +
      '<p>Trabalho do tema 4 da disciplina FPO, semestre 2026/2, na Universidade de Brasília, com o prof. Peng Yaohao. O tema pede um jogo indie para ensinar conceitos de machine learning e redes neurais, a partir de uma premissa: um jogo educativo precisa, antes de tudo, ser um jogo divertido. Se o jogo for divertido e o docente tiver competência suficiente, ele pode se tornar educativo.</p>' +
      '<h3>A especificação</h3>' +
      '<ul>' +
      '<li>Mesa com um baralho de 52 cartas: 3 neurônios na entrada, 5 camadas ocultas de 5 neurônios e 4 na saída. Cada jogador recebe 5 cartas; as 10 restantes vão para o limbo, como ruído.</li>' +
      '<li>Os jogadores se alternam ativando neurônios para ligar a entrada à saída. Vence a rede de maior soma: 2 a 10 pelo valor, Ás 11, figuras 0, com pares e trios de figuras vizinhas valendo bônus e quadras zerando a rede (vanishing gradient).</li>' +
      '<li>Ações com a mão: tunagem, overfit, early stop, stack overflow, dropout (o GatoNet) e transfer learning. Entrada e saída são imunes.</li>' +
      '<li>Desempates em cascata e três formas de decidir quem começa.</li>' +
      '<li>Extensões propostas: baralhos com efeitos (truco, fraternidade, yin-yang, Power BI), terrenos (montanha, pântano, oceano), coringas e conquistas em graduações de bronze a antimatéria.</li>' +
      '<li>Inspirações citadas: TensorFlow Playground, Balatro, Magic: The Gathering e Geometry Dash.</li>' +
      '</ul>' +
      '<p>Esta versão implementa todas as regras, os baralhos e os terrenos da especificação, além da camada de truco e de três oponentes. As leituras adotadas onde o texto deixa margem estão no README do projeto.</p>' +
      '<h3>O professor</h3>' +
      '<p><b>Peng Yaohao</b> é professor da Universidade de Brasília, mestre e doutor pela UnB na área de Finanças e Métodos Quantitativos. Pesquisa aprendizado de máquina, modelos não lineares e econometria financeira, com trabalhos sobre previsão de volatilidade e de preços de ações e um estudo empírico sobre não linearidade e overfitting em machine learning com dados da COVID-19.</p>' +
      '<h3>Autores</h3>' +
      '<p class="autores">Welyngton José Vinicius Dal Prá</p>' +
      '<p class="contribuicoes">Contribuições são bem-vindas: o código está aberto no repositório.</p>' +
      '<h3>Créditos e licença</h3>' +
      '<p>Código aberto sob a licença <a href="https://github.com/welyngton/truco-de-turing#GPL-3.0-1-ov-file" target="_blank" rel="noopener">GPL-3.0</a>, no repositório <a href="https://github.com/welyngton/truco-de-turing" target="_blank" rel="noopener">github.com/welyngton/truco-de-turing</a>. Feito com Phaser 3; toda a arte das cartas é gerada por código; fontes Cinzel e Spectral.</p>' +
      '<div class="linha fim" style="margin-top:14px"><button class="botao" data-fechar>Fechar</button></div></div>';
  return abrirPainel(html, { fechaAoClicarFora: true });
}
