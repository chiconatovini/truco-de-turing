# Testes de unidade

**Versão 1.2.0** · commit `68acb37-dirty` (com as mudanças ainda não registradas) · 10/11/2026, 20:53 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Regras do jogo, oponentes, conteúdo (conquistas, avatares, dicas, Biblioteca de conceitos), motor do NeuroDeck e a camada de tradução, arte procedural desenhada num canvas de verdade, telas em HTML (jsdom), som e música (WebAudio de mentira), aplicação e ferramentas de linha de comando.

| Testes | Aprovados | Reprovados | Pulados | Duração |
|---:|---:|---:|---:|---:|
| 302 | 302 | 0 | 0 | 47,7 s |

Resultado em formato JUnit (para ferramentas de CI): [`resultado.junit.xml`](resultado.junit.xml).

## `testes/unidade/arte.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | criarTela: tamanho multiplicado pela densidade, nunca menor que 1 pixel | pincel.js | 3 ms |
| ✅ | hashDoTexto e geradorComSemente: estáveis e reprodutíveis | pincel.js | 0 ms |
| ✅ | caminhos, degradês, texturas, sombras e brilho pintam a tela | pincel.js | 36,7 s |
| ✅ | escreverComQuebra respeita a largura e "\n"; ajustarFonte encolhe até caber | pincel.js | 8 ms |
| ✅ | comAlfa e tonalizar | pincel.js | 0 ms |
| ✅ | medidas e cores por naipe | paleta.js | 0 ms |
| ✅ | corpo da moldura (comum e lendária), placa e gema | moldura.js, emblemas.js, figuras.js e cenarios.js | 39 ms |
| ✅ | emblema de cada naipe, com e sem sombra | moldura.js, emblemas.js, figuras.js e cenarios.js | 13 ms |
| ✅ | coroa e figura de Valete, Dama e Rei de cada naipe | moldura.js, emblemas.js, figuras.js e cenarios.js | 48 ms |
| ✅ | cenários de cada naipe e peças de paisagem | moldura.js, emblemas.js, figuras.js e cenarios.js | 17 ms |
| ✅ | dadosDaCarta: nome, pontos, tipo, regras, ambientação e raridade | cartas.js | 1 ms |
| ✅ | símbolo de coleção de cada raridade | cartas.js | 3 ms |
| ✅ | todas as 52 cartas do baralho classico (completa e da mesa) | cartas.js | 1,4 s |
| ✅ | todas as 52 cartas do baralho truco (completa e da mesa) | cartas.js | 1,2 s |
| ✅ | todas as 52 cartas do baralho nobreza (completa e da mesa) | cartas.js | 1,5 s |
| ✅ | todas as 52 cartas do baralho backprop (completa e da mesa) | cartas.js | 1,2 s |
| ✅ | todas as 52 cartas do baralho fraternidade (completa e da mesa) | cartas.js | 1,2 s |
| ✅ | todas as 52 cartas do baralho yinyang (completa e da mesa) | cartas.js | 1,2 s |
| ✅ | todas as 52 cartas do baralho powerbi (completa e da mesa) | cartas.js | 1,3 s |
| ✅ | verso de cada baralho nos dois formatos | versos, terrenos, avatares, mesas e botões | 162 ms |
| ✅ | carta de cada terreno | versos, terrenos, avatares, mesas e botões | 88 ms |
| ✅ | avatar de cada oponente e dos jogadores | versos, terrenos, avatares, mesas e botões | 11 ms |
| ✅ | feltro e mesa de cada terreno | versos, terrenos, avatares, mesas e botões | 58 ms |
| ✅ | faísca e botões em cada variante e estado | versos, terrenos, avatares, mesas e botões | 16 ms |
| ✅ | um ícone SVG válido para cada conquista, e o cadeado | icones.js e retrato.js | 44 ms |
| ✅ | retrato do professor em moldura medieval | icones.js e retrato.js | 590 ms |

## `testes/unidade/baralhos-novos.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | estão no menu, no motor e geram 52 cartas | Nobreza e Backprop | 1 ms |
| ✅ | Nobreza: figuras valem 11 a 13 e figuras iguais vizinhas valem o dobro (8 + K + K = 60) | Nobreza e Backprop | 4 ms |
| ✅ | Backprop: a rede vale a ativação da saída; cada neurônio mostra a ativação depois dele | Nobreza e Backprop | 1 ms |
| ✅ | mãos inteiras com os dois baralhos terminam e pontuam todas as redes | Nobreza e Backprop | 82 ms |
| ✅ | arte: versos próprios, legenda de ativação e peso no Backprop e texto das regras | Nobreza e Backprop | 88 ms |
| ✅ | cada avatar do jogador tem retrato desenhado | avatares extras | 15 ms |
| ✅ | um SVG acessível para cada ação da barra e para o vanishing gradient | ícones das ações | 0 ms |

## `testes/unidade/configuracao-node.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | fora do navegador: resolução 1 e Canvas não forçado | — | 1 ms |

## `testes/unidade/configuracao-url.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | ?res= é limitado a 3 e ?renderer=canvas força o Canvas | — | 1 ms |

## `testes/unidade/configuracao.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | resolução pela tela × densidade, densidades das texturas e sem forçar Canvas | — | 2 ms |

## `testes/unidade/conteudo.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | verbetes com id único, título, categoria, conceito e "no jogo" | grimorio.js | 1 ms |
| ✅ | Biblioteca de conceitos: todo verbete tem equação em MathML e "até onde vale a comparação"; as figuras existem | grimorio.js | 6 ms |
| ✅ | textos revistos: as linhas não são pesos, stack overflow não é conceito de redes, a curva da mesa sobe | grimorio.js | 0 ms |
| ✅ | ajuda das ações: cada ação da barra tem verbete na Biblioteca e regra no motor | grimorio.js | 0 ms |
| ✅ | livres desde o início e os outros liberados pela conquista; o escolhido só vale se liberado | avatares.js | 1 ms |
| ✅ | ambientação para cada valor e provocações para cada situação | textos.js | 0 ms |
| ✅ | provocar: situação desconhecida devolve texto vazio | textos.js | 0 ms |
| ✅ | graduações com nome e cor | conquistas.js | 0 ms |
| ✅ | toda conquista tem caso de teste, e VALEM_SEM_MAO_COMPLETA só cita conquistas existentes | conquistas.js | 0 ms |
| ✅ | conquista "Primeira época" (primeira) | conquistas.js | 8 ms |
| ✅ | conquista "Convergiu" (dez) | conquistas.js | 4 ms |
| ✅ | conquista "Estado da arte" (cinquenta) | conquistas.js | 3 ms |
| ✅ | conquista "Gato curioso" (gato10) | conquistas.js | 7 ms |
| ✅ | conquista "Sete vidas não bastam" (gato100) | conquistas.js | 5 ms |
| ✅ | conquista "Inferência pura" (zen) | conquistas.js | 4 ms |
| ✅ | conquista "Monge do forward pass" (zen10) | conquistas.js | 4 ms |
| ✅ | conquista "Desk rejection" (desk) | conquistas.js | 9 ms |
| ✅ | conquista "Marcha dos patos" (patos) | conquistas.js | 2 ms |
| ✅ | conquista "Contra tudo e contra todos" (contra) | conquistas.js | 8 ms |
| ✅ | conquista "Artilheiro dos gols inúteis" (artilheiro) | conquistas.js | 4 ms |
| ✅ | conquista "Pré-treinado" (transfer) | conquistas.js | 6 ms |
| ✅ | conquista "Gradiente evaporado" (vanishing) | conquistas.js | 6 ms |
| ✅ | conquista "Regularizador" (overfit) | conquistas.js | 5 ms |
| ✅ | conquista "Paciência de validação" (earlystop) | conquistas.js | 10 ms |
| ✅ | conquista "Segmentation fault" (overflow) | conquistas.js | 2 ms |
| ✅ | conquista "Atenção multi-cabeça" (trio) | conquistas.js | 8 ms |
| ✅ | conquista "Rede profunda" (sessenta) | conquistas.js | 2 ms |
| ✅ | conquista "Truco, marreco!" (truco) | conquistas.js | 6 ms |
| ✅ | conquista "Vale a partida" (doze) | conquistas.js | 6 ms |
| ✅ | conquista "Corre que é cilada" (correu) | conquistas.js | 2 ms |
| ✅ | conquista "Campeão da mesa" (campeao) | conquistas.js | 3 ms |
| ✅ | conquista "Venceu a máquina" (maquina) | conquistas.js | 2 ms |
| ✅ | conquista "Cartógrafo" (cartografo) | conquistas.js | 2 ms |
| ✅ | conquista "Colecionador" (colecionador) | conquistas.js | 5 ms |
| ✅ | conquista "Zap na saída" (zap) | conquistas.js | 2 ms |
| ✅ | conquista "Bibliotecário" (biblio) | conquistas.js | 3 ms |
| ✅ | conquista "Sangue azul" (nobreza) | conquistas.js | 3 ms |
| ✅ | conquista "Forward pass de ouro" (backprop) | conquistas.js | 5 ms |
| ✅ | conquista "Ajuste fino" (tunador) | conquistas.js | 2 ms |
| ✅ | conquista "Batch grande" (batch) | conquistas.js | 3 ms |
| ✅ | conquista "Ensemble" (ensemble) | conquistas.js | 4 ms |
| ✅ | conquista "Big data" (bigdata) | conquistas.js | 5 ms |
| ✅ | conquista "Deep learning de verdade" (profunda) | conquistas.js | 2 ms |
| ✅ | conquista "Arquiteto de redes" (arquiteto) | conquistas.js | 10 ms |
| ✅ | dicas gerais ligadas a verbetes existentes | dicasDeJogo.js | 0 ms |
| ✅ | só usa informação pública: sortear de novo o que está escondido não muda a dica | dicasDeJogo.js | 628 ms |
| ✅ | cobre todos os tipos de dica em situações montadas à mão | dicasDeJogo.js | 3 ms |
| ✅ | sem nada salvo: progresso inicial com música ligada | progresso.js | 1 ms |
| ✅ | salvar e carregar de volta | progresso.js | 0 ms |
| ✅ | migra o formato da versão 1 (nomes em inglês) | progresso.js | 0 ms |
| ✅ | armazenamento quebrado ou ausente não derruba o jogo | progresso.js | 0 ms |

## `testes/unidade/ferramentas.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | tipoDeMudanca: rótulos e título decidem maior, menor ou correção | versionar.js | 1 ms |
| ✅ | proximaVersao | versionar.js | 0 ms |
| ✅ | --simular só mostra a próxima versão | versionar.js | 55 ms |
| ✅ | sobe a versão em package.json, package-lock, src/versao.js, README e CHANGELOG | versionar.js | 61 ms |
| ✅ | --atual publica a versão sem subir e não duplica a entrada do histórico | versionar.js | 71 ms |
| ✅ | sem PR nem título: correção, com "Atualização" no histórico | versionar.js | 66 ms |
| ✅ | gera o HTML completo e a versão para artifact, com CSS e JS embutidos | empacotar.js | 237 ms |
| ✅ | gera a referência com os módulos e as funções documentadas | documentar.js | 59 ms |
| ✅ | roda mãos entre dois oponentes e mostra o placar | simular.js | 108 ms |

## `testes/unidade/interface.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | escaparHtml | paineis.js | 9 ms |
| ✅ | abrirPainel: fecha pelo botão data-fechar, por fora e por fecharTodos; chama aoFechar | paineis.js | 53 ms |
| ✅ | mostrarAviso e mostrarDicaDeJogo: um por vez, somem sozinhos ou com um toque | paineis.js | 91 ms |
| ✅ | confirmar: botões com ação, grito de truco e topo | paineis.js | 10 ms |
| ✅ | dica flutuante: à esquerda, acima ou abaixo do alvo conforme o espaço | paineis.js | 5 ms |
| ✅ | cada efeito sonoro agenda osciladores ou ruído; mudo não toca nada | som.js e musica.js | 12 ms |
| ✅ | trilhas: menu e os quatro terrenos, com tema composto que cabe nos compassos | som.js e musica.js | 47 ms |
| ✅ | música: cada terreno agenda notas; trocar, repetir e parar | som.js e musica.js | 8,7 s |
| ✅ | menu: mostra as escolhas, lê as mudanças, atualiza as miniaturas e abre cada tela | telas | 542 ms |
| ✅ | menu: configurações do NeuroDeck (jogadores, humanos, oponentes, arquitetura e baralhos) | telas | 192 ms |
| ✅ | mods: tipos, exemplo comentado e o aviso de que a interface ainda não carrega mods | telas | 43 ms |
| ✅ | regras: marca o tutorial como visto e chama aoFechar | telas | 177 ms |
| ✅ | grimório: abre no verbete pedido, troca de verbete e marca como lido | telas | 57 ms |
| ✅ | Biblioteca de conceitos: título novo, equação, figura e "até onde vale a comparação" | telas | 28 ms |
| ✅ | regras em abas: troca de aba, ajuda das ações e "Ver o conceito" abrindo o verbete certo | telas | 649 ms |
| ✅ | avatares: escolhe um liberado, ignora o bloqueado e avisa quem mudou | telas | 115 ms |
| ✅ | conquistas: medalhas bloqueadas e desbloqueadas, contagem e retrato | telas | 131 ms |
| ✅ | sobre: versão, os dois jogos, disciplina, professor e autores | telas | 9 ms |
| ✅ | revisão: resumo, curva, linha do tempo comentada e placar da partida | telas | 71 ms |
| ✅ | iniciar: opções padrão, música ligada sem escolha e som conforme o progresso | aplicacao.js | 3 ms |
| ✅ | salvarOpcoes, alternarMusica (liga com terreno, desliga sem) | aplicacao.js | 2 ms |
| ✅ | jogar e irParaMenu trocam as cenas; modo imersivo pede tela cheia no toque | aplicacao.js | 2 ms |
| ✅ | registrarMao: contadores, conquistas novas (uma vez só) e mão encerrada por truco | aplicacao.js | 7 ms |
| ✅ | marcarVerbeteLido: conta cada verbete uma vez e concede "Bibliotecário" no fim | aplicacao.js | 1 ms |

## `testes/unidade/mesa-dinamica.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | a mesa tem os tamanhos da arquitetura, com um neurônio a mais por camada para cada jogador além de 2 | Mesa: arquiteturas, jogadores e baralhos | 7 ms |
| ✅ | com 2 baralhos a mão tem 10 cartas e o limbo 20; com 3 baralhos, 15 e 30 | Mesa: arquiteturas, jogadores e baralhos | 1 ms |
| ✅ | cartas repetidas (vários baralhos) têm ids diferentes na interface | Mesa: arquiteturas, jogadores e baralhos | 1 ms |
| ✅ | recusa arquitetura desconhecida e mesas com menos de 2 ou mais de 5 jogadores | Mesa: arquiteturas, jogadores e baralhos | 1 ms |
| ✅ | mãos completas com 3, 4 e 5 jogadores, em todas as arquiteturas: nenhuma carta some e toda mão termina | Mesa: arquiteturas, jogadores e baralhos | 375 ms |
| ✅ | com 3 jogadores, as fronteiras de todos os rivais aceitam ataque e o alvo é o dono do neurônio clicado | Mesa: arquiteturas, jogadores e baralhos | 1 ms |
| ✅ | a partida vale tentos para cada jogador, mas ninguém pode trucar | Truco com mais de 2 jogadores | 0 ms |
| ✅ | com 2 jogadores tudo continua como antes | Truco com mais de 2 jogadores | 0 ms |
| ✅ | a dica de ataque aponta para o rival que dá para atacar, mesmo que não seja o próximo | Dicas e revisão com mais de 2 jogadores | 7 ms |
| ✅ | a revisão mostra uma curva, um resumo e um placar para cada jogador | Dicas e revisão com mais de 2 jogadores | 79 ms |
| ✅ | a mesa padrão fica exatamente onde ficava: colunas de 318 a 900, linhas a 95, cartas 62x87 | Geometria do tabuleiro (layout.js) | 0 ms |
| ✅ | em todas as mesas possíveis as cartas cabem no tabuleiro e não se sobrepõem | Geometria do tabuleiro (layout.js) | 0 ms |
| ✅ | placar: 2 blocos grandes com 2 jogadores; blocos compactos que cabem acima da curva com 3 a 5 | Geometria do tabuleiro (layout.js) | 0 ms |
| ✅ | cores diferentes para as 5 redes | Geometria do tabuleiro (layout.js) | 0 ms |
| ✅ | opções padrão: 2 jogadores, 1 humano, arquitetura padrão e 1 baralho | Opções da mesa (aplicacao.js) | 0 ms |
| ✅ | o antigo "2 humanos no mesmo aparelho" vira 2 humanos; valores fora da faixa são corrigidos | Opções da mesa (aplicacao.js) | 0 ms |

## `testes/unidade/mods.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | carrega pelo mesmo caminho de um mod de verdade e registra o terreno | Mod de exemplo (terreno Regularização L1) | 3 ms |
| ✅ | neurônios acima de 8 pontos perdem 1 ponto | Mod de exemplo (terreno Regularização L1) | 2 ms |
| ✅ | partidas inteiras no terreno do mod terminam normalmente | Mod de exemplo (terreno Regularização L1) | 71 ms |

## `testes/unidade/motor-equivalencia.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | as 1.000 partidas têm o mesmo total de jogadas do site | Motor do NeuroDeck: equivalência com o site publicado | 1 ms |
| ✅ | cada bloco de 100 partidas tem o mesmo resumo do site | Motor do NeuroDeck: equivalência com o site publicado | 0 ms |
| ✅ | o resumo geral é idêntico ao do site | Motor do NeuroDeck: equivalência com o site publicado | 0 ms |

## `testes/unidade/motor-inicio.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | opção (a), 'reveal': as cartas reveladas vão para o cemitério | Quem começa | 4 ms |
| ✅ | opção (b), 'reveal-keep': as cartas reveladas voltam para a mão | Quem começa | 0 ms |
| ✅ | nas duas opções começa quem revelou a carta mais forte (Ás > K > … > 2; naipe desempata) | Quem começa | 7 ms |
| ✅ | sorteio ('random'): não há fase de revelação | Quem começa | 0 ms |
| ✅ | os bots espertos revelam a carta mais forte quando ela volta para a mão, e a de menor valor quando é descartada | Quem começa | 1 ms |
| ✅ | monteCarloResults devolve cada jogada com taxa de vitória e margem, da melhor para a pior | Monte Carlo: resultado das simulações | 38 ms |
| ✅ | monteCarloMove escolhe a primeira jogada de monteCarloResults | Monte Carlo: resultado das simulações | 34 ms |

## `testes/unidade/motor-regras.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | K vence J quando a soma das mãos empata | B1: desempate pela carta mais alta | 4 ms |
| ✅ | Q vence J, e figura vence carta numérica | B1: desempate pela carta mais alta | 1 ms |
| ✅ | Ás é a carta mais alta | B1: desempate pela carta mais alta | 0 ms |
| ✅ | o naipe só decide quando a carta mais alta é a mesma | B1: desempate pela carta mais alta | 0 ms |
| ✅ | no motor original (nd-2.0.0), K contra J era decidido pelo naipe | B1: desempate pela carta mais alta | 0 ms |
| ✅ | par de figuras iguais vale 20 (10 por figura) | B2: o trio de figuras vale mais que o par | 2 ms |
| ✅ | trio de figuras iguais vale 30 (10 por figura) | B2: o trio de figuras vale mais que o par | 1 ms |
| ✅ | quadra de figuras iguais zera a rede (vanishing gradient) | B2: o trio de figuras vale mais que o par | 1 ms |
| ✅ | figura isolada continua valendo 0, e figuras diferentes não formam par | B2: o trio de figuras vale mais que o par | 0 ms |
| ✅ | no motor original (nd-2.0.0), o trio empatava com o par | B2: o trio de figuras vale mais que o par | 0 ms |
| ✅ | exemplo do slide: 8-K-K-3 com um K tunado vale 41 | R1: a carta empilhada conta na sequência de figuras | 0 ms |
| ✅ | tunar os dois Ks de um par forma quadra e zera a rede | R1: a carta empilhada conta na sequência de figuras | 0 ms |
| ✅ | figura isolada tunada com outra igual forma par e vale 20 | R1: a carta empilhada conta na sequência de figuras | 0 ms |
| ✅ | tunagem de carta numérica continua somando o valor da carta empilhada | R1: a carta empilhada conta na sequência de figuras | 0 ms |
| ✅ | o detalhamento por neurônio soma o total | R1: a carta empilhada conta na sequência de figuras | 0 ms |
| ✅ | no motor original (nd-2.0.0), a carta empilhada não entrava na sequência | R1: a carta empilhada conta na sequência de figuras | 0 ms |
| ✅ | quem sofreu early stop do rival pode passar, mesmo com ataque possível | R2: qualquer early stop libera o passar | 2 ms |
| ✅ | quem aplicou early stop na própria rede também pode passar | R2: qualquer early stop libera o passar | 1 ms |
| ✅ | quem chegou à saída ou ficou sem neurônio livre é obrigado a jogar se puder | R2: qualquer early stop libera o passar | 1 ms |
| ✅ | com a rede aberta não se pode passar | R2: qualquer early stop libera o passar | 0 ms |
| ✅ | no motor original (nd-2.0.0), quem se aplicou early stop era obrigado a atacar | R2: qualquer early stop libera o passar | 1 ms |
| ✅ | o padrão é o conjunto da fusão, e o nome fica no estado | Conjuntos de regras | 1 ms |
| ✅ | refazendo as mesmas jogadas com as regras da fusão, só muda o resultado de partidas que tocam B1, B2 ou R1 | Conjuntos de regras | 8,5 s |
| ✅ | dropout: o neurônio desfeito sai da mesa, vai para o cemitério e não gasta a vez | Decisões confirmadas pelo professor (o motor já fazia assim) | 2 ms |
| ✅ | camada sem neurônio livre: a rede é finalizada ali ("acabou o campo") | Decisões confirmadas pelo professor (o motor já fazia assim) | 0 ms |
| ✅ | transfer learning não gasta a vez e só vale uma vez por partida | Decisões confirmadas pelo professor (o motor já fazia assim) | 0 ms |
| ✅ | em 350 partidas aleatórias (7 baralhos, 4 terrenos, 2 a 4 jogadores) nenhuma carta some ou duplica e toda partida termina | Regressão com as regras da fusão | 350 ms |

## `testes/unidade/nucleo-base.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | sortear: reprodutível pela semente e sempre em [0, 1) | aleatorio.js | 2 ms |
| ✅ | sortearInteiro: inteiros em [0, n) que cobrem todos os valores | aleatorio.js | 1 ms |
| ✅ | embaralhar: mesma lista em outra ordem, sem perder nem repetir itens | aleatorio.js | 0 ms |
| ✅ | sementeNova: número inteiro | aleatorio.js | 0 ms |
| ✅ | tabelas de valores e naipes | cartas.js | 0 ms |
| ✅ | ehFigura: só J, Q e K | cartas.js | 0 ms |
| ✅ | rotuloCarta: valor + símbolo do naipe | cartas.js | 0 ms |
| ✅ | baralhoPadrao: 52 cartas com ids únicos | cartas.js | 0 ms |
| ✅ | formato 3-5-5-5-5-5-4 e mão de 5 cartas | rede.js | 0 ms |
| ✅ | ehOculta: só as camadas 1 a 5 na mesa padrão; numa mesa de 9 camadas, de 1 a 7 | rede.js | 0 ms |
| ✅ | tamanhosDaMesa: arquiteturas do NeuroDeck, com um neurônio a mais por camada para cada jogador além de 2 | rede.js | 0 ms |
| ✅ | nomeCamada: entrada, ocultas numeradas e saída | rede.js | 0 ms |
| ✅ | cada baralho monta as cartas do motor (52; o truco, 2 baralhos de 27) e tem nome e resumo | baralhos.js | 2 ms |
| ✅ | pontosDaCarta: Ás 11, figuras 0, números pelo valor; no truco, manilhas e a ordem do truco | baralhos.js | 0 ms |
| ✅ | nomeDaCarta e manilhaDaCarta | baralhos.js | 0 ms |
| ✅ | quatro terrenos com nome e resumo | terrenos.js | 0 ms |

## `testes/unidade/nucleo-partida.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | monta a mesa 3-5-5-5-5-5-4, distribui 5 cartas e separa 10 no limbo | novaMao | 5 ms |
| ✅ | início por sorteio já começa a fase de jogo e emite o evento | novaMao | 2 ms |
| ✅ | oceano sorteia o vento; mesma semente, mesma mesa | novaMao | 1 ms |
| ✅ | sem semente usa uma semente nova | novaMao | 1 ms |
| ✅ | baralho de truco: 2 baralhos, mão de 10 cartas e ids únicos | novaMao | 1 ms |
| ✅ | opção desconhecida é recusada com mensagem clara | novaMao | 1 ms |
| ✅ | constantes de apoio | novaMao | 1 ms |
| ✅ | a visão acompanha o estado do motor a cada jogada | visão da interface | 7 ms |
| ✅ | atualizarVisao refaz a visão depois de uma mudança direta no estado do motor | visão da interface | 0 ms |
| ✅ | as cartas da interface mantêm valor, naipe e id ao longo da mão | visão da interface | 2 ms |
| ✅ | cópia independente, sem eventos, em modo simulação | copiarMao | 2 ms |
| ✅ | fronteira: null sem rede; depois o último neurônio do caminho | consultas | 1 ms |
| ✅ | alvosDeAtivacao: livres da próxima camada; vazio para rede finalizada | consultas | 1 ms |
| ✅ | alvosDeEmpilhamento: só fronteiras ocultas de redes em construção | consultas | 1 ms |
| ✅ | efeitoDoEmpilhamento: pela pilha final (2, 3, 4) e por quem é o dono | consultas | 0 ms |
| ✅ | podeEmpilhar: exige vez, alvo válido, mesma figura e pilha ≤ 4 | consultas | 1 ms |
| ✅ | camadasDesfaziveis: camadas ocultas do caminho | consultas | 1 ms |
| ✅ | valorParaTransfer: quatro iguais na mão, uma vez por mão | consultas | 1 ms |
| ✅ | podePassar: rede interrompida por early stop com cartas na mão, ou nenhuma outra jogada | consultas | 1 ms |
| ✅ | fase de início: uma jogada por carta da mão, para quem ainda não escolheu | jogadasLegais | 1 ms |
| ✅ | fora da vez e depois do fim: nenhuma jogada | jogadasLegais | 3 ms |
| ✅ | inclui dropout só com a opção comDropout | jogadasLegais | 1 ms |
| ✅ | toda jogada listada é aceita, em mãos inteiras de todos os baralhos | jogadasLegais | 110 ms |
| ✅ | início "revela e descarta" (padrão): a carta mais forte começa e as cartas vão para o cemitério | aplicarJogada | 1 ms |
| ✅ | início "revela e volta": as cartas voltam para a mão; empate vai para o sorteio | aplicarJogada | 0 ms |
| ✅ | ativar: revela, liga à rede e passa a vez | aplicarJogada | 0 ms |
| ✅ | ativar na camada de saída conclui a rede | aplicarJogada | 8 ms |
| ✅ | tunagem, overfit, early stop e stack overflow: eventos, estatísticas e registro | aplicarJogada | 3 ms |
| ✅ | dropout: os neurônios vão para o cemitério, paga com cartas e não gasta o turno | aplicarJogada | 4 ms |
| ✅ | transfer learning: troca quatro iguais por cartas do limbo e não gasta o turno | aplicarJogada | 1 ms |
| ✅ | Power BI embaralha a mão com o limbo depois de uma ação com cartas | aplicarJogada | 0 ms |
| ✅ | passar: recusado com a rede em construção; permitido depois de um early stop | aplicarJogada | 0 ms |
| ✅ | rede sem neurônio livre na camada seguinte é finalizada como travada | aplicarJogada | 1 ms |
| ✅ | oceano: a virada do vento a cada rodada vira evento | aplicarJogada | 1 ms |
| ✅ | erros: fora da vez, mão não iniciada, jogada desconhecida, carta fora da mão; o estado não muda | aplicarJogada | 1 ms |
| ✅ | early stop na própria rede: empilhar 2 cartas no próprio neurônio finaliza a rede | aplicarJogada | 1 ms |
| ✅ | mão jogada até o fim tem vencedor, somas e motivo | fim da mão e desempates | 2 ms |
| ✅ | finalizarMao encerra a mão no ponto em que está | fim da mão e desempates | 1 ms |
| ✅ | sem empate: maior soma da rede | fim da mão e desempates | 1 ms |
| ✅ | 1º desempate: menos dropouts | fim da mão e desempates | 0 ms |
| ✅ | 2º: quem ficou sem cartas perde | fim da mão e desempates | 1 ms |
| ✅ | 3º: soma das melhores cartas da mão | fim da mão e desempates | 1 ms |
| ✅ | 4º: carta mais alta; 5º: naipe; 6º: quem jogou primeiro | fim da mão e desempates | 1 ms |

## `testes/unidade/nucleo-pontuacao.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | rede vazia vale 0 | pontuarRede | 4 ms |
| ✅ | exemplo do enunciado: 8-K-K-3 com tunagem num K soma 41 (trio de Reis, contando o empilhado) | pontuarRede | 1 ms |
| ✅ | par de figuras vizinhas vale 20 (10 por figura) | pontuarRede | 1 ms |
| ✅ | figura isolada tunada com outra igual é um par dentro do mesmo neurônio | pontuarRede | 0 ms |
| ✅ | quatro Reis vizinhos (contando os empilhados) zeram a rede: vanishing gradient | pontuarRede | 0 ms |
| ✅ | tunagem numérica soma todas as cartas da pilha | pontuarRede | 0 ms |
| ✅ | montanha: cada neurônio vale 1 ponto a mais por camada alcançada | pontuarRede | 1 ms |
| ✅ | pântano: a cada rodada, neurônio sem tunagem afunda 1 ponto | pontuarRede | 3 ms |
| ✅ | oceano: neurônio do naipe do vento revelado na rodada vale o dobro para sempre | pontuarRede | 1 ms |
| ✅ | fraternidade: vizinhos do mesmo naipe valem dobro | pontuarRede | 1 ms |
| ✅ | truco: as figuras valem pontos próprios e não formam par nem trio; a quadra ainda zera a rede | pontuarRede | 1 ms |
| ✅ | média dos pontos de uma lista de cartas (0 para lista vazia) | mediaDePontos | 0 ms |

## `testes/unidade/nucleo-truco-oponentes.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | escada 1-3-6-9-12 e gritos | truco.js | 2 ms |
| ✅ | novaPartida e proximaMao zeram o valor e o pedido | truco.js | 0 ms |
| ✅ | podeTrucar: não em mão única, não com pedido aberto, não quem aumentou por último, não na mão de onze | truco.js | 0 ms |
| ✅ | responderTruco: aceitar sobe o valor; aumentar devolve o pedido; correr entrega o valor atual | truco.js | 0 ms |
| ✅ | marcarTentos, fim da partida e mão de onze | truco.js | 0 ms |
| ✅ | novoGerador: números em [0, 1), uma sequência por gerador | oponentes/comum.js | 0 ms |
| ✅ | determinizar: mantém o que j vê e redistribui o resto | oponentes/comum.js | 5 ms |
| ✅ | chanceDeVitoria: entre 0 e 1 durante a mão; 0,5 antes de começar; 0 ou 1 no fim | oponentes/comum.js | 12 ms |
| ✅ | chanceDeVitoria não altera a mão | oponentes/comum.js | 11 ms |
| ✅ | jogadaAleatoria, jogadaGulosa e jogadaMonteCarlo devolvem jogadas legais | oponentes/estrategias.js | 96 ms |
| ✅ | Monte Carlo com uma jogada só devolve direto | oponentes/estrategias.js | 1 ms |
| ✅ | três perfis com nome, nível, método, avatar e estilo | oponentes/index.js | 0 ms |
| ✅ | escolherJogada: carta de início por perfil e jogada por estratégia | oponentes/index.js | 20 ms |
| ✅ | querTrucar e responderAoTruco: respostas válidas para cada perfil | oponentes/index.js | 365 ms |

## `testes/unidade/regras-de-negocio.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | RN-01 mesa 3-5-5-5-5-5-4 virada, 5 cartas na mão de cada jogador e 10 no limbo (52 no total) | Preparação da mesa | 4 ms |
| ✅ | RN-02 opção (a), o padrão: cada um revela uma carta, a maior começa e as cartas vão para o cemitério | Quem começa | 2 ms |
| ✅ | RN-03 opção (b): a maior começa e as cartas reveladas voltam para a mão | Quem começa | 1 ms |
| ✅ | RN-04 opção (c): par ou ímpar sorteia quem começa e a mão já está em jogo | Quem começa | 0 ms |
| ✅ | RN-05 força das cartas para começar: Ás > K > Q > J > 10 … 2 | Quem começa | 0 ms |
| ✅ | RN-06 um neurônio por camada, só na próxima camada, e cada neurônio tem um único dono | Construção da rede | 2 ms |
| ✅ | RN-07 ao chegar à camada de saída a rede está concluída, com 7 neurônios | Construção da rede | 3 ms |
| ✅ | RN-08 números valem o valor, Ás vale 11 e figura isolada vale 0 | Pontuação (baralho clássico) | 2 ms |
| ✅ | RN-09 par de figuras iguais em camadas vizinhas vale 20 (10 por figura) | Pontuação (baralho clássico) | 1 ms |
| ✅ | RN-10 trio de figuras iguais vizinhas vale 30 (10 por figura) | Pontuação (baralho clássico) | 0 ms |
| ✅ | RN-11 figuras iguais não vizinhas, ou vizinhas e diferentes, não pontuam | Pontuação (baralho clássico) | 1 ms |
| ✅ | RN-12 quadra de figuras iguais vizinhas zera a rede inteira (vanishing gradient) | Pontuação (baralho clássico) | 1 ms |
| ✅ | RN-13 exemplo do enunciado: 8-K-K-3 vale 31; com tunagem num K vale 41 | Pontuação (baralho clássico) | 1 ms |
| ✅ | RN-14 tunar os dois Reis de um par forma quadra e zera a rede | Pontuação (baralho clássico) | 0 ms |
| ✅ | RN-15 tunagem numérica soma o valor da carta empilhada; figura isolada tunada forma par | Pontuação (baralho clássico) | 1 ms |
| ✅ | RN-16 entrada e saída são imunes: só a fronteira em camada oculta aceita cartas | Ações com cartas da mão | 1 ms |
| ✅ | RN-17 empilhar exige carta de mesmo valor; o naipe não importa | Ações com cartas da mão | 1 ms |
| ✅ | RN-18 overfit: 1 carta no último neurônio do rival manda o neurônio ao cemitério e a rede dele recua | Ações com cartas da mão | 1 ms |
| ✅ | RN-19 early stop: pilha de 3 cartas finaliza a rede do rival sem esse neurônio | Ações com cartas da mão | 1 ms |
| ✅ | RN-20 neurônio já tunado (2 cartas) sofre early stop com uma única carta do rival | Ações com cartas da mão | 1 ms |
| ✅ | RN-21 stack overflow: pilha de 4 finaliza a rede do rival e ele perde toda a mão | Ações com cartas da mão | 1 ms |
| ✅ | RN-22 auto early stop e auto stack overflow: empilhar 2 ou 3 cartas na própria fronteira encerra a própria rede | Ações com cartas da mão | 1 ms |
| ✅ | RN-23 rede finalizada não pode mais ser atacada | Ações com cartas da mão | 2 ms |
| ✅ | RN-24 dropout custa uma carta por camada desfeita, não gasta o turno e conta no desempate | Dropout (GatoNet) e transfer learning | 1 ms |
| ✅ | RN-25 o neurônio desfeito sai da mesa e vai para o cemitério, com as tunagens | Dropout (GatoNet) e transfer learning | 1 ms |
| ✅ | RN-26 dropout não desfaz a camada de entrada | Dropout (GatoNet) e transfer learning | 1 ms |
| ✅ | RN-27 transfer learning: quadra na mão troca por cartas do limbo, uma vez por mão, e não gasta o turno | Dropout (GatoNet) e transfer learning | 1 ms |
| ✅ | RN-28 sem quadra na mão não há transfer learning | Dropout (GatoNet) e transfer learning | 0 ms |
| ✅ | RN-29 com a rede em construção não é permitido passar | Passar a vez e fim da mão | 0 ms |
| ✅ | RN-30 só passa quem teve a rede interrompida por early stop; rede concluída com ataque possível é obrigada a jogar | Passar a vez e fim da mão | 2 ms |
| ✅ | RN-31 rede sem neurônio livre na próxima camada é finalizada ali e conta a soma parcial | Passar a vez e fim da mão | 1 ms |
| ✅ | RN-32 1º critério: menos dropouts | Desempates (soma igual) | 1 ms |
| ✅ | RN-33 2º critério: maior soma das N melhores cartas da mão (N = tamanho da menor mão) | Desempates (soma igual) | 0 ms |
| ✅ | RN-34 quem ficou sem cartas na mão perde para quem tem pelo menos uma | Desempates (soma igual) | 0 ms |
| ✅ | RN-35 3º critério: carta mais alta da mão (Ás > K > Q > J > 10 … 2); o naipe só decide entre cartas iguais | Desempates (soma igual) | 1 ms |
| ✅ | RN-36 último critério: vence quem jogou primeiro | Desempates (soma igual) | 0 ms |
| ✅ | RN-37 escada TRUCO (3) → SEIS (6) → NOVE (9) → DOZE (12); correr entrega o valor atual | Camada de truco (partida até 12 tentos) | 0 ms |
| ✅ | RN-38 quem aumentou por último não pede de novo; mão única e mão de onze não têm truco | Camada de truco (partida até 12 tentos) | 0 ms |
| ✅ | RN-39 a partida termina quando alguém chega a 12 tentos | Camada de truco (partida até 12 tentos) | 0 ms |
| ✅ | RN-40 em 300 mãos aleatórias (5 baralhos x 4 terrenos x 3 inícios) nenhuma carta some ou duplica, os donos batem com as redes e toda mão termina | Invariantes em partidas aleatórias | 678 ms |

## `testes/unidade/som-sem-audio.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | sem WebAudio: efeitos e música não tocam e não quebram | — | 2 ms |

