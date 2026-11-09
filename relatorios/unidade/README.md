# Testes de unidade

**Versão 1.0.0** · commit `8d44a5d-dirty` (com as mudanças ainda não registradas) · 08/11/2026, 22:51 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Regras do jogo, oponentes, conteúdo (conquistas, dicas, Grimório), arte procedural desenhada num canvas de verdade, telas em HTML (jsdom), som e música (WebAudio de mentira), aplicação e ferramentas de linha de comando.

| Testes | Aprovados | Reprovados | Pulados | Duração |
|---:|---:|---:|---:|---:|
| 169 | 169 | 0 | 0 | 38,6 s |

Resultado em formato JUnit (para ferramentas de CI): [`resultado.junit.xml`](resultado.junit.xml).

## `testes/unidade/arte.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | criarTela: tamanho multiplicado pela densidade, nunca menor que 1 pixel | pincel.js | 2 ms |
| ✅ | hashDoTexto e geradorComSemente: estáveis e reprodutíveis | pincel.js | 0 ms |
| ✅ | caminhos, degradês, texturas, sombras e brilho pintam a tela | pincel.js | 32,3 s |
| ✅ | escreverComQuebra respeita a largura e "\n"; ajustarFonte encolhe até caber | pincel.js | 6 ms |
| ✅ | comAlfa e tonalizar | pincel.js | 0 ms |
| ✅ | medidas e cores por naipe | paleta.js | 0 ms |
| ✅ | corpo da moldura (comum e lendária), placa e gema | moldura.js, emblemas.js, figuras.js e cenarios.js | 43 ms |
| ✅ | emblema de cada naipe, com e sem sombra | moldura.js, emblemas.js, figuras.js e cenarios.js | 13 ms |
| ✅ | coroa e figura de Valete, Dama e Rei de cada naipe | moldura.js, emblemas.js, figuras.js e cenarios.js | 38 ms |
| ✅ | cenários de cada naipe e peças de paisagem | moldura.js, emblemas.js, figuras.js e cenarios.js | 15 ms |
| ✅ | dadosDaCarta: nome, pontos, tipo, regras, ambientação e raridade | cartas.js | 1 ms |
| ✅ | símbolo de coleção de cada raridade | cartas.js | 4 ms |
| ✅ | todas as 52 cartas do baralho classico (completa e da mesa) | cartas.js | 982 ms |
| ✅ | todas as 52 cartas do baralho truco (completa e da mesa) | cartas.js | 770 ms |
| ✅ | todas as 52 cartas do baralho fraternidade (completa e da mesa) | cartas.js | 989 ms |
| ✅ | todas as 52 cartas do baralho yinyang (completa e da mesa) | cartas.js | 965 ms |
| ✅ | todas as 52 cartas do baralho powerbi (completa e da mesa) | cartas.js | 1,1 s |
| ✅ | verso de cada baralho nos dois formatos | versos, terrenos, avatares, mesas e botões | 81 ms |
| ✅ | carta de cada terreno | versos, terrenos, avatares, mesas e botões | 87 ms |
| ✅ | avatar de cada oponente e dos jogadores | versos, terrenos, avatares, mesas e botões | 9 ms |
| ✅ | feltro e mesa de cada terreno | versos, terrenos, avatares, mesas e botões | 51 ms |
| ✅ | faísca e botões em cada variante e estado | versos, terrenos, avatares, mesas e botões | 16 ms |
| ✅ | um ícone SVG válido para cada conquista, e o cadeado | icones.js e retrato.js | 34 ms |
| ✅ | retrato do professor em moldura medieval | icones.js e retrato.js | 18 ms |

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
| ✅ | resolução pela tela × densidade, densidades das texturas e sem forçar Canvas | — | 1 ms |

## `testes/unidade/conteudo.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | verbetes com id único, título, categoria, conceito e "no jogo" | grimorio.js | 1 ms |
| ✅ | ambientação para cada valor e provocações para cada situação | textos.js | 0 ms |
| ✅ | provocar: situação desconhecida devolve texto vazio | textos.js | 0 ms |
| ✅ | graduações com nome e cor | conquistas.js | 0 ms |
| ✅ | toda conquista tem caso de teste, e VALEM_SEM_MAO_COMPLETA só cita conquistas existentes | conquistas.js | 1 ms |
| ✅ | conquista "Primeira época" (primeira) | conquistas.js | 3 ms |
| ✅ | conquista "Convergiu" (dez) | conquistas.js | 1 ms |
| ✅ | conquista "Estado da arte" (cinquenta) | conquistas.js | 1 ms |
| ✅ | conquista "Gato curioso" (gato10) | conquistas.js | 1 ms |
| ✅ | conquista "Sete vidas não bastam" (gato100) | conquistas.js | 1 ms |
| ✅ | conquista "Inferência pura" (zen) | conquistas.js | 5 ms |
| ✅ | conquista "Monge do forward pass" (zen10) | conquistas.js | 1 ms |
| ✅ | conquista "Desk rejection" (desk) | conquistas.js | 1 ms |
| ✅ | conquista "Marcha dos patos" (patos) | conquistas.js | 1 ms |
| ✅ | conquista "Contra tudo e contra todos" (contra) | conquistas.js | 1 ms |
| ✅ | conquista "Artilheiro dos gols inúteis" (artilheiro) | conquistas.js | 1 ms |
| ✅ | conquista "Pré-treinado" (transfer) | conquistas.js | 1 ms |
| ✅ | conquista "Gradiente evaporado" (vanishing) | conquistas.js | 2 ms |
| ✅ | conquista "Regularizador" (overfit) | conquistas.js | 4 ms |
| ✅ | conquista "Paciência de validação" (earlystop) | conquistas.js | 0 ms |
| ✅ | conquista "Segmentation fault" (overflow) | conquistas.js | 1 ms |
| ✅ | conquista "Atenção multi-cabeça" (trio) | conquistas.js | 1 ms |
| ✅ | conquista "Rede profunda" (sessenta) | conquistas.js | 1 ms |
| ✅ | conquista "Truco, marreco!" (truco) | conquistas.js | 0 ms |
| ✅ | conquista "Vale a partida" (doze) | conquistas.js | 0 ms |
| ✅ | conquista "Corre que é cilada" (correu) | conquistas.js | 0 ms |
| ✅ | conquista "Campeão da mesa" (campeao) | conquistas.js | 0 ms |
| ✅ | conquista "Venceu a máquina" (maquina) | conquistas.js | 3 ms |
| ✅ | conquista "Cartógrafo" (cartografo) | conquistas.js | 1 ms |
| ✅ | conquista "Colecionador" (colecionador) | conquistas.js | 0 ms |
| ✅ | conquista "Zap na saída" (zap) | conquistas.js | 1 ms |
| ✅ | conquista "Bibliotecário" (biblio) | conquistas.js | 0 ms |
| ✅ | dicas gerais ligadas a verbetes existentes | dicasDeJogo.js | 0 ms |
| ✅ | só usa informação pública: sortear de novo o que está escondido não muda a dica | dicasDeJogo.js | 120 ms |
| ✅ | cobre todos os tipos de dica em situações montadas à mão | dicasDeJogo.js | 1 ms |
| ✅ | sem nada salvo: progresso inicial com música ligada | progresso.js | 0 ms |
| ✅ | salvar e carregar de volta | progresso.js | 0 ms |
| ✅ | migra o formato da versão 1 (nomes em inglês) | progresso.js | 0 ms |
| ✅ | armazenamento quebrado ou ausente não derruba o jogo | progresso.js | 0 ms |

## `testes/unidade/ferramentas.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | tipoDeMudanca: rótulos e título decidem maior, menor ou correção | versionar.js | 1 ms |
| ✅ | proximaVersao | versionar.js | 0 ms |
| ✅ | --simular só mostra a próxima versão | versionar.js | 35 ms |
| ✅ | sobe a versão em package.json, package-lock, src/versao.js, README e CHANGELOG | versionar.js | 35 ms |
| ✅ | --atual publica a versão sem subir e não duplica a entrada do histórico | versionar.js | 30 ms |
| ✅ | sem PR nem título: correção, com "Atualização" no histórico | versionar.js | 32 ms |
| ✅ | gera o HTML completo e a versão para artifact, com CSS e JS embutidos | empacotar.js | 129 ms |
| ✅ | gera a referência com os módulos e as funções documentadas | documentar.js | 42 ms |
| ✅ | roda mãos entre dois oponentes e mostra o placar | simular.js | 86 ms |

## `testes/unidade/interface.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | escaparHtml | paineis.js | 7 ms |
| ✅ | abrirPainel: fecha pelo botão data-fechar, por fora e por fecharTodos; chama aoFechar | paineis.js | 50 ms |
| ✅ | mostrarAviso e mostrarDicaDeJogo: um por vez, somem sozinhos ou com um toque | paineis.js | 91 ms |
| ✅ | confirmar: botões com ação, grito de truco e topo | paineis.js | 12 ms |
| ✅ | dica flutuante: à esquerda, acima ou abaixo do alvo conforme o espaço | paineis.js | 5 ms |
| ✅ | cada efeito sonoro agenda osciladores ou ruído; mudo não toca nada | som.js e musica.js | 16 ms |
| ✅ | música: cada terreno agenda notas; trocar, repetir e parar | som.js e musica.js | 7,4 s |
| ✅ | menu: mostra as escolhas, lê as mudanças, atualiza as miniaturas e abre cada tela | telas | 313 ms |
| ✅ | regras: marca o tutorial como visto e chama aoFechar | telas | 39 ms |
| ✅ | grimório: abre no verbete pedido, troca de verbete e marca como lido | telas | 15 ms |
| ✅ | conquistas: medalhas bloqueadas e desbloqueadas, contagem e retrato | telas | 102 ms |
| ✅ | sobre: versão, disciplina, professor e autores | telas | 18 ms |
| ✅ | revisão: resumo, curva, linha do tempo comentada e placar da partida | telas | 88 ms |
| ✅ | iniciar: opções padrão, música ligada sem escolha e som conforme o progresso | aplicacao.js | 1 ms |
| ✅ | salvarOpcoes, alternarMusica (liga com terreno, desliga sem) | aplicacao.js | 1 ms |
| ✅ | jogar e irParaMenu trocam as cenas; modo imersivo pede tela cheia no toque | aplicacao.js | 3 ms |
| ✅ | registrarMao: contadores, conquistas novas (uma vez só) e mão encerrada por truco | aplicacao.js | 2 ms |
| ✅ | marcarVerbeteLido: conta cada verbete uma vez e concede "Bibliotecário" no fim | aplicacao.js | 3 ms |

## `testes/unidade/nucleo-base.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | sortear: reprodutível pela semente e sempre em [0, 1) | aleatorio.js | 2 ms |
| ✅ | sortearInteiro: inteiros em [0, n) que cobrem todos os valores | aleatorio.js | 0 ms |
| ✅ | embaralhar: mesma lista em outra ordem, sem perder nem repetir itens | aleatorio.js | 0 ms |
| ✅ | sementeNova: número inteiro | aleatorio.js | 0 ms |
| ✅ | tabelas de valores e naipes | cartas.js | 0 ms |
| ✅ | ehFigura: só J, Q e K | cartas.js | 0 ms |
| ✅ | rotuloCarta: valor + símbolo do naipe | cartas.js | 0 ms |
| ✅ | baralhoPadrao: 52 cartas com ids únicos | cartas.js | 0 ms |
| ✅ | formato 3-5-5-5-5-5-4 e mão de 5 cartas | rede.js | 0 ms |
| ✅ | ehOculta: só as camadas 1 a 5 | rede.js | 0 ms |
| ✅ | nomeCamada: entrada, ocultas numeradas e saída | rede.js | 0 ms |
| ✅ | cada baralho monta 52 cartas e tem nome e resumo | baralhos.js | 0 ms |
| ✅ | pontosDaCarta: Ás 11, figuras 0, números pelo valor; manilhas do truco | baralhos.js | 0 ms |
| ✅ | nomeDaCarta e manilhaDaCarta | baralhos.js | 0 ms |
| ✅ | quatro terrenos com nome e resumo | terrenos.js | 0 ms |

## `testes/unidade/nucleo-partida.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | monta a mesa 3-5-5-5-5-5-4, distribui 5 cartas e queima 10 no limbo | novaMao | 3 ms |
| ✅ | início por sorteio já começa a fase de jogo e emite o evento | novaMao | 0 ms |
| ✅ | oceano sorteia o vento; mesma semente, mesma mesa | novaMao | 0 ms |
| ✅ | sem semente usa uma semente nova | novaMao | 0 ms |
| ✅ | constantes de apoio | novaMao | 0 ms |
| ✅ | cópia independente, sem eventos, em modo simulação | copiarMao | 1 ms |
| ✅ | fronteira: null sem rede; depois o último neurônio do caminho | consultas | 0 ms |
| ✅ | alvosDeAtivacao: livres da próxima camada; vazio para rede finalizada | consultas | 0 ms |
| ✅ | alvosDeEmpilhamento: só fronteiras ocultas de redes em construção | consultas | 1 ms |
| ✅ | efeitoDoEmpilhamento: pela pilha final (2, 3, 4) e por quem é o dono | consultas | 0 ms |
| ✅ | podeEmpilhar: exige vez, alvo válido, mesma figura e pilha ≤ 4 | consultas | 1 ms |
| ✅ | camadasDesfaziveis: camadas ocultas do caminho | consultas | 0 ms |
| ✅ | valorParaTransfer: quatro iguais na mão, uma vez por mão | consultas | 0 ms |
| ✅ | podePassar: só sem neurônio para ativar | consultas | 0 ms |
| ✅ | fase de início: uma jogada por carta da mão | jogadasLegais | 0 ms |
| ✅ | fora da vez: nenhuma jogada | jogadasLegais | 0 ms |
| ✅ | inclui dropout só com a opção comDropout | jogadasLegais | 0 ms |
| ✅ | com manilhas de pontos diferentes, considera cada combinação de cartas | jogadasLegais | 0 ms |
| ✅ | início "revela e volta": a carta mais forte começa e volta para a mão | aplicarJogada | 0 ms |
| ✅ | início "revela e descarta": as cartas vão para o cemitério; empate vai para o sorteio | aplicarJogada | 0 ms |
| ✅ | ativar: revela, liga à rede e passa a vez | aplicarJogada | 0 ms |
| ✅ | ativar na camada de saída conclui a rede | aplicarJogada | 1 ms |
| ✅ | tunagem, overfit, early stop e stack overflow | aplicarJogada | 3 ms |
| ✅ | dropout: desvira, paga com cartas e não gasta o turno | aplicarJogada | 1 ms |
| ✅ | transfer learning: troca quatro iguais por cartas do limbo | aplicarJogada | 0 ms |
| ✅ | Power BI troca a mão depois de uma ação | aplicarJogada | 0 ms |
| ✅ | passar: só sem neurônio livre; dois passes seguidos encerram a mão | aplicarJogada | 0 ms |
| ✅ | erros: fora da vez, mão não iniciada, jogada desconhecida, carta fora da mão | aplicarJogada | 0 ms |
| ✅ | rede travada antes da saída pode ser finalizada por early stop no próprio neurônio | aplicarJogada | 1 ms |
| ✅ | mão jogada até o fim tem vencedor, somas e motivo | fim da mão e desempates | 1 ms |
| ✅ | 1º desempate: menos dropouts | fim da mão e desempates | 0 ms |
| ✅ | 2º: quem ficou sem cartas perde | fim da mão e desempates | 0 ms |
| ✅ | 3º: soma das melhores cartas da mão | fim da mão e desempates | 0 ms |
| ✅ | 4º: carta mais alta; 5º: quem jogou primeiro | fim da mão e desempates | 0 ms |

## `testes/unidade/nucleo-pontuacao.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | rede vazia vale 0 | pontuarRede | 2 ms |
| ✅ | exemplo do enunciado: 8-K-K-3 com tunagem num K soma 41 (trio + tunagem) | pontuarRede | 1 ms |
| ✅ | par de figuras vizinhas vale +10 | pontuarRede | 0 ms |
| ✅ | quatro Reis vizinhos (contando os empilhados) zeram a rede: vanishing gradient | pontuarRede | 0 ms |
| ✅ | tunagem numérica soma todas as cartas da pilha | pontuarRede | 0 ms |
| ✅ | montanha: cada camada tira 1 ponto | pontuarRede | 0 ms |
| ✅ | pântano: neurônio sem tunagem afunda 1 por rodada | pontuarRede | 0 ms |
| ✅ | oceano: naipe do vento vale dobro | pontuarRede | 0 ms |
| ✅ | fraternidade: vizinhos do mesmo naipe valem dobro | pontuarRede | 0 ms |
| ✅ | média dos pontos de uma lista de cartas (0 para lista vazia) | mediaDePontos | 0 ms |

## `testes/unidade/nucleo-truco-oponentes.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | escada 1-3-6-9-12 e gritos | truco.js | 1 ms |
| ✅ | novaPartida e proximaMao zeram o valor e o pedido | truco.js | 0 ms |
| ✅ | podeTrucar: não em mão única, não com pedido aberto, não quem aumentou por último, não na mão de onze | truco.js | 0 ms |
| ✅ | responderTruco: aceitar sobe o valor; aumentar devolve o pedido; correr entrega o valor atual | truco.js | 0 ms |
| ✅ | marcarTentos, fim da partida e mão de onze | truco.js | 0 ms |
| ✅ | cartasOcultas: neurônios virados, mão do outro e limbo | oponentes/comum.js | 1 ms |
| ✅ | determinizar: mantém o que j vê e redistribui o resto | oponentes/comum.js | 1 ms |
| ✅ | pontosEsperadosPorCamada: um número positivo | oponentes/comum.js | 0 ms |
| ✅ | avaliar: ±1000 no fim, vantagem projetada durante a mão | oponentes/comum.js | 1 ms |
| ✅ | agruparEquivalentes e concretizar: ativações desconhecidas da mesma camada viram uma jogada com alternativas | oponentes/comum.js | 0 ms |
| ✅ | simularAteOFim e chanceDeVitoria | oponentes/comum.js | 3 ms |
| ✅ | jogadaAleatoria, jogadaGulosa e jogadaMonteCarlo devolvem jogadas legais | oponentes/estrategias.js | 98 ms |
| ✅ | Monte Carlo com uma jogada só devolve direto | oponentes/estrategias.js | 0 ms |
| ✅ | três perfis com nome, nível, método, avatar e estilo | oponentes/index.js | 0 ms |
| ✅ | escolherJogada: carta de início por perfil e jogada por estratégia | oponentes/index.js | 1 ms |
| ✅ | querTrucar e responderAoTruco: respostas válidas para cada perfil | oponentes/index.js | 170 ms |

## `testes/unidade/som-sem-audio.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | sem WebAudio: efeitos e música não tocam e não quebram | — | 2 ms |

