# Referência do código

> Gerado por `npm run docs` (ferramentas/documentar.js) a partir dos comentários do código. Não edite à mão.

## `src/aplicacao.js`

Estado da aplicação fora da partida: opções do menu, progresso salvo, conquistas, som e navegação entre o menu e a mesa. É um objeto único (`Aplicacao`) compartilhado pelas cenas e pelas telas HTML.

| Nome | Tipo | Descrição |
|---|---|---|
| `OPCOES_PADRAO` | constante | Opções usadas na primeira visita. |
| `iniciar()` | método | Carrega opções e preferência de som. |
| `salvar()` | método | Grava o progresso. |
| `salvarOpcoes()` | método | Grava as escolhas do menu para a próxima visita. |
| `alternarSom()` | método | Liga ou desliga o som e lembra a escolha. |
| `alternarMusica(terreno)` | método | Liga ou desliga a música de fundo e lembra a escolha. |
| `jogar()` | método | Sai do menu e abre a mesa. |
| `irParaMenu()` | método | Volta da mesa para o menu. |
| `modoImersivo()` | método | Em celulares e tablets: tela cheia e trava na horizontal, onde o navegador permite (Chrome no Android). No iPhone isso não existe; ali vale o aviso para girar o aparelho. |
| `registrarMao(ctx)` | método | Registra o fim de uma mão contra o computador e devolve as conquistas novas. |
| `marcarVerbeteLido(id)` | método | Marca um verbete como lido e concede "Bibliotecário" quando todos foram lidos. |

## `src/arte/avatares.js`

Retratos redondos dos participantes: os três oponentes e o jogador (rosto com chapéu de palha). Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.

| Nome | Tipo | Descrição |
|---|---|---|
| `desenharAvatar(tipo, cor, S)` | função (exportada) | Desenha um avatar redondo de 112x112 (base). |

## `src/arte/botoes.js`

Texturas dos botões da mesa e da faísca das explosões. São imagens próprias porque o renderizador Canvas do Phaser não tem degradês nem tint. Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.

| Nome | Tipo | Descrição |
|---|---|---|
| `desenharFaisca(S, cor)` | função (exportada) | Faísca radial (32x32 base) usada nas explosões de partículas, na cor pedida. |
| `MARGEM_BOTAO` | constante (exportada) | Margem em volta do botão, reservada para a sombra. |
| `desenharBotao(w, h, S, variante, estado)` | função (exportada) | Textura de um botão de w × h (base). |

## `src/arte/cartas.js`

Cartas de neurônio: dados exibidos (nome, tipo, regras, raridade), carta completa (mão e inspeção) e carta da mesa. Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.

| Nome | Tipo | Descrição |
|---|---|---|
| `dadosDaCarta(carta, baralho)` | função (exportada) | Dados que a carta mostra. regras: string, ambientacao: string, raridade: 'comum'\|'incomum'\|'rara'\|'mitica'}} |
| `RARIDADE` | constante | Cores da gema de raridade (claro, escuro). |
| `simboloDeColecao(ctx, x, y, s, raridade)` | função (exportada) | Símbolo de coleção (gema de raridade) à direita da linha de tipo. |
| `ilustracaoDaCarta(ctx, carta, info, x, y, w, h, aleatorio)` | função | Desenha a ilustração da janela de arte: cena com figura (J, Q, K), emblema grande (Ás e manilhas) ou emblemas repetidos (cartas numéricas). |
| `posicoesDosNaipes(n)` | função | Posições dos naipes numa janela de arte paisagem |
| `desenharCartaCompleta(carta, baralho, S)` | função (exportada) | ---------- carta completa ---------- |
| `desenharCartaDaMesa(carta, baralho, S)` | função (exportada) | ---------- carta da mesa ---------- |

## `src/arte/cartasDeTerreno.js`

Cartas de terreno exibidas na inspeção (estilo "terreno básico"). Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.

| Nome | Tipo | Descrição |
|---|---|---|
| `desenharCartaDeTerreno(terreno, S)` | função (exportada) | Desenha a carta de terreno mostrada na inspeção (paisagem do terreno, linha de tipo e caixa de regras). |

## `src/arte/cenarios.js`

Cenários pintados das janelas de arte: montanhas ao luar (espadas), salão de banquete (copas), floresta (paus) e deserto dourado (ouros), com uma constelação em forma de rede neural. Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.

| Nome | Tipo | Descrição |
|---|---|---|
| `perfilDeSerra(aleatorio, w, aspereza)` | função (exportada) | Gera o perfil de uma serra (alturas de 0 a 1) por subdivisão aleatória; `aspereza` controla o serrilhado. |
| `montanhas(ctx, x, y, w, h, aleatorio, camadas)` | função (exportada) | Desenha camadas de montanhas, da mais distante à mais próxima, com neve opcional nos picos. |
| `estrelas(ctx, x, y, w, h, aleatorio, n, cor)` | função (exportada) | Espalha `n` estrelas pequenas na área. |
| `constelacao(ctx, x, y, w, h, aleatorio, cor)` | função (exportada) | Constelação em forma de rede neural: o toque de ML no céu |
| `vinheta(ctx, x, y, w, h, a)` | função (exportada) | Escurece as bordas da área (efeito de vinheta) com intensidade `a`. |
| `raios(ctx, cx, cy, n, comprimento, abertura, cor, a)` | função (exportada) | Desenha `n` raios de luz saindo de (cx, cy). |
| `cenarioDoNaipe(ctx, naipe, x, y, w, h, aleatorio, opcoes)` | função (exportada) | Fundo temático de cada naipe (espadas: noite e montanhas; copas: salão; paus: floresta; ouros: deserto dourado). Opções: `constelacao` (falso para omitir) e `escurecer` (0 a 1). |

## `src/arte/emblemas.js`

Naipes espanhóis do truco desenhados à mão: espada, copa, ouro e pau (bastão).

| Nome | Tipo | Descrição |
|---|---|---|
| `desenharEmblema(ctx, tipo, cx, cy, s, rot, opcoes)` | função (exportada) | Desenha o emblema do naipe espanhol: 'espada', 'copa', 'ouro' ou 'pau'. Opção `sombra` (falso para desenhar sem sombra). |

## `src/arte/figuras.js`

Retratos das figuras (Rei, Dama e Valete) no estilo do baralho espanhol. Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.

| Nome | Tipo | Descrição |
|---|---|---|
| `coroa(ctx, valor, s, cor)` | função (exportada) | Desenha a coroa (ou chapéu) da figura conforme o valor J, Q ou K. |
| `desenharFigura(ctx, valor, naipe, cx, by, s)` | função (exportada) | Retrato meio-corpo; (cx, by) = base central, s = altura do retrato |

## `src/arte/icones.js`

Ícones das conquistas em SVG (nítidos em qualquer tamanho) e cadeado das bloqueadas.

| Nome | Tipo | Descrição |
|---|---|---|
| `I` | constante | Cor do traço dos ícones. |
| `svg` | constante | Envolve o desenho num SVG 48x48. |
| `gato` | constante | Gato do GatoNet (dropout), base de duas conquistas. |
| `ICONES_CONQUISTAS` | constante (exportada) | Ícone SVG de cada conquista, pelo id. |
| `ICONE_CADEADO` | constante (exportada) | Cadeado das conquistas bloqueadas. |

## `src/arte/mesas.js`

Fundos da mesa: feltro verde (neutro) e um fundo por terreno (montanha, pântano, oceano). Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.

| Nome | Tipo | Descrição |
|---|---|---|
| `desenharFeltro(W, H, S)` | função (exportada) | Feltro verde da mesa neutra, com fibras e vinheta. |
| `fibras(ctx, W, H, aleatorio, n, clara, escura)` | função | Fibras do tecido: `n` riscos curtos alternando a cor clara e a escura. |
| `mesaMontanha(ctx, W, H, aleatorio)` | função | Fundo da mesa no terreno montanha: céu de entardecer, cordilheira e trilha subindo. |
| `vitoriaRegia(ctx, x, y, r, rot, aleatorio)` | função | Desenha uma vitória-régia (folha flutuante) no pântano. |
| `mesaPantano(ctx, W, H, aleatorio)` | função | Fundo da mesa no terreno pântano: água escura, névoa, vitórias-régias e vaga-lumes. |
| `rosaDosVentos(ctx, cx, cy, R, cor)` | função | Desenha uma rosa dos ventos de raio R. |
| `mesaOceano(ctx, W, H, aleatorio)` | função | Fundo da mesa no terreno oceano: ondas, espuma e rosa dos ventos. |
| `desenharMesa(terreno, W, H, S)` | função (exportada) | Desenha o fundo da mesa do terreno (W×H unidades na densidade S). |

## `src/arte/moldura.js`

Moldura das cartas no estilo de card game de fantasia: corpo texturizado, placas de nome/tipo/poder e gemas de custo. Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.

| Nome | Tipo | Descrição |
|---|---|---|
| `corpoDaMoldura(ctx, W, H, P, aleatorio, lendaria)` | função (exportada) | Corpo da carta: borda preta, moldura texturizada na cor do naipe e, nas lendárias, acabamento dourado. |
| `placa(ctx, x, y, w, h, P, opcoes)` | função (exportada) | Placa (barra de nome / linha de tipo / caixa de poder) |
| `gema(ctx, cx, cy, r, cor, rotulo, opcoes)` | função (exportada) | Gema redonda (símbolo de custo) |

## `src/arte/paleta.js`

Medidas-base das cartas, cores por naipe e fontes usadas na arte.

| Nome | Tipo | Descrição |
|---|---|---|
| `CARTA_L` | constante (exportada) | Tamanho-base da carta completa (mão e inspeção), em unidades de desenho. |
| `MINI_L` | constante (exportada) | Tamanho-base da carta da mesa (neurônio). |
| `TINTA` | constante (exportada) | Cor de tinta dos textos sobre pergaminho. |
| `FONTE_SIMBOLOS` | constante (exportada) | Fontes com os símbolos ♠♥♣♦ desenhados de forma consistente. |
| `PALETA_NAIPE` | constante (exportada) | Paleta de cada naipe: tons da moldura (clara, media, escura), gema de custo, brilho dos cenários, barra de título (titulo, tituloEscuro), céu do cenário (3 tons) e tinta clara. |

## `src/arte/pincel.js`

Pincel: utilitários de desenho em canvas 2D (telas com densidade, caminhos, degradês, texto, texturas, sombras e cores). Todo o resto da arte é construído sobre estas funções. Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.

| Nome | Tipo | Descrição |
|---|---|---|
| `criarTela(w, h, S)` | função (exportada) | Cria um canvas de w×h unidades na densidade S e devolve `{ c: canvas, ctx }` já escalado. |
| `caminhoArredondado(ctx, x, y, w, h, r)` | função (exportada) | Traça (sem preencher) um retângulo de cantos arredondados. |
| `hashDoTexto(texto)` | função (exportada) | Número inteiro derivado do texto (para sementes estáveis por carta). |
| `geradorComSemente(semente)` | função (exportada) | Gerador de números aleatórios reprodutível (mulberry32) a partir da semente. |
| `degradeLinear(ctx, x0, y0, x1, y1, paradas)` | função (exportada) | Cria um degradê linear a partir de uma lista de paradas `[posição, cor]`. |
| `degradeRadial(ctx, x0, y0, r0, x1, y1, r1, paradas)` | função (exportada) | Cria um degradê radial a partir de uma lista de paradas `[posição, cor]`. |
| `escreverComQuebra(ctx, texto, x, y, larguraMax, alturaLinha)` | função (exportada) | Escreve o texto quebrando linhas em `larguraMax`; respeita "\n". Devolve o número de linhas usadas. |
| `ajustarFonte(ctx, texto, larguraMax, tamanho, peso, familia, min)` | função (exportada) | Define a fonte no maior tamanho (até `tamanho`, no mínimo `min`) em que o texto cabe em `larguraMax`. |
| `granulado(ctx, x, y, w, h, aleatorio, intensidade, alfa)` | função (exportada) | Textura de grão: pontinhos claros e escuros |
| `escovado(ctx, x, y, w, h, aleatorio, alfa)` | função (exportada) | Linhas de escova (metal/pedra da moldura) |
| `sombraSuave(ctx, desfoque, deslocY, alfa)` | função (exportada) | Liga uma sombra preta suave para os próximos desenhos. |
| `semSombra(ctx)` | função (exportada) | Desliga a sombra. |
| `brilho(ctx, x, y, r, cor, a)` | função (exportada) | Desenha um brilho radial (halo) de raio r e opacidade a. |
| `comAlfa(hex, a)` | função (exportada) | Converte uma cor #rrggbb em rgba() com opacidade a. |
| `tonalizar(hex, f)` | função (exportada) | Clareia (f > 0) ou escurece (f < 0) uma cor #rrggbb. |

## `src/arte/retrato.js`

Moldura medieval do retrato do professor no quadro de conquistas.

| Nome | Tipo | Descrição |
|---|---|---|
| `caminhoArredondado(ctx, x, y, w, h, r)` | função | Caminho de retângulo arredondado. |
| `arcoGotico(ctx, x, y, w, h)` | função | Caminho de arco gótico (janela da moldura). |
| `dourado(ctx, x0, y0, x1, y1)` | função | Degradê dourado da moldura. |
| `desenharRetratoEmMoldura(src, S, nome, titulo, pronto)` | função (exportada) | Desenha a foto numa moldura medieval (arco gótico dourado, brasão e fita com o nome). A foto carrega de forma assíncrona; `pronto(canvas)` é chamado quando o desenho termina. |

## `src/arte/versos.js`

Versos das cartas, um por baralho: clássico (damasco), truco (baralho espanhol), fraternidade (anéis), yin-yang (A e 2) e Power BI (painel de indicadores). Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.

| Nome | Tipo | Descrição |
|---|---|---|
| `molduraDourada(ctx, W, H, dourado)` | função | Moldura dourada dupla do verso das cartas. |
| `legenda(ctx, W, y, a, b, cor, larguraMax)` | função | Escreve o título do verso (linha a) e o subtítulo (linha b) centralizados. |
| `versoClassico(ctx, W, H, aleatorio)` | função | Clássico: damasco vinho com a rede neural dourada |
| `versoTruco(ctx, W, H, aleatorio)` | função | Truco: verso de baralho espanhol, margem branca, treliça azul, espada e pau cruzados |
| `versoFraternidade(ctx, W, H, aleatorio)` | função | Fraternidade: corrente de anéis dourados sobre verde, quatro naipes de mãos dadas |
| `simboloYinYang(ctx, cx, cy, r)` | função | Yin-yang: campo dividido em preto e marfim, só Ás e Dois |
| `versoYinYang(ctx, W, H, aleatorio)` | função | Verso do baralho yin-yang: metades clara e escura e o símbolo no centro. |
| `versoPowerBI(ctx, W, H, aleatorio)` | função | Power BI: painel de indicadores (gráficos e um botão de atualizar), que embaralha a mão |
| `desenharVerso(formato, S, baralho)` | função (exportada) | Desenha o verso do baralho. |

## `src/cenas/CenaCarregamento.js`

Cena de carregamento: espera as fontes e gera as texturas fixas (verso clássico, cartas de terreno, avatares, faísca e a textura da inspeção). Depois abre o menu.

| Nome | Tipo | Descrição |
|---|---|---|
| `FONTES_NECESSARIAS` | constante | Fontes usadas pelo canvas; precisam estar carregadas antes de desenhar as cartas. |
| `AVATARES` | constante | Avatares gerados: chave → cor do aro. |
| `gerarTexturas()` | método | Gera as texturas que não dependem da partida. |

## `src/cenas/CenaMenu.js`

Cena do menu: fundo animado (uma rede neural pulsando e cartas flutuando) atrás do painel HTML do menu.

| Nome | Tipo | Descrição |
|---|---|---|
| `COLUNAS` | constante | Neurônios por coluna da rede decorativa. |
| `espalharCartas()` | método | Nove cartas semitransparentes flutuando devagar. |
| `update(tempo)` | método | Redesenha a rede com conexões que pulsam (azul e laranja, como no TensorFlow Playground). |

## `src/cenas/mesa/CenaMesa.js`

Cena da mesa: onde a partida acontece. A classe é pequena de propósito. Os métodos ficam em arquivos separados por assunto e são copiados para o protótipo no fim deste arquivo: | Arquivo | Assunto | |---------------|--------------------------------------------------------------------| | cenario.js | molduras fixas, botões e criação dos textos dos painéis | | desenho.js | desenhar o estado: neurônios, mãos, placar, curva, dica, alvos | | entrada.js | cliques e toques do jogador | | turnos.js | fluxo da mão: iniciar, executar jogada, vez de cada jogador | | truco.js | pedir, anunciar e responder truco | | efeitos.js | animações dos eventos, faíscas, faixas, balão e avisos do Grimório | | resultado.js | fim da mão, tentos, conquistas, comemoração e tela de resultado | | dicas.js | modo dicas: sugestão de jogada e dicas flutuantes dos botões | Estado principal da cena: - `this.partida`: placar de tentos e truco (nucleo/truco.js); - `this.mao`: estado da mão atual (nucleo/partida.js); - `this.quemVe`: índice do jogador que está olhando a tela (-1 enquanto o aparelho troca de mãos); - `this.modo`, `this.selecao`, `this.alvos`: o que o jogador está escolhendo; - `this.ocupada`: verdadeiro durante animações e a vez do oponente (bloqueia cliques); - `this.encerrada`: a mão acabou.

| Nome | Tipo | Descrição |
|---|---|---|
| `create()` | método | Monta a mesa e começa a primeira mão (depois das regras, na primeira visita). |
| `update(tempo)` | método | A cada quadro: conexões animadas, contornos pulsantes e o destaque de quem está na vez. |

## `src/cenas/mesa/cenario.js`

Parte da CenaMesa: elementos fixos da tela (molduras dos painéis, colunas das camadas), botões e criação de todos os textos e imagens dos painéis. Os métodos daqui são copiados para CenaMesa.prototype; `this` é a cena.

| Nome | Tipo | Descrição |
|---|---|---|
| `COR_ROTULO` | constante | Cor do rótulo de cada variante de botão. |
| `desenharCenarioFixo()` | método | Molduras dos painéis laterais, divisórias e colunas das camadas com seus nomes. |
| `criarBotao(x, y, l, a, rotulo, acao, opcoes = {})` | método | Cria um botão com textura própria e rótulo que se ajusta à largura. O objeto devolvido ganha `definirRotulo(texto)` e `habilitar(sim)`. Com `opcoes.dica`, o botão mostra uma dica flutuante (modo "dicas" ligado): ao passar o mouse, ou, no celular, ao segurar o botão apertado. Soltar depois de segurar não executa a ação, para que dê para ler a dica sem jogar sem querer. A ação roda ao soltar o toque/clique. |
| `criarPaineis()` | método | Cria os textos, imagens e botões dos painéis. Ficam em `this.painel`. |
| `criarTexto(x, y, s, estilo)` | método | Atalho para criar texto na fonte do corpo, já na profundidade dos painéis. |
| `criarPainelEsquerdo(p)` | método | Painel esquerdo: inspeção, limbo e cemitério (como pilhas), terreno e dica do turno. |
| `criarPlacar(p)` | método | Placar (painel direito): título da mão e um bloco por jogador com avatar, nome, nível, situação, detalhes, tentos e soma da rede. O bloco de cima é o adversário de quem está vendo. |
| `criarBotoesDeAcao(p)` | método | Botão de truco (logo acima das ações) e botões de ação e de sistema. |
| `atualizarBotaoSom()` | método | Rótulo do botão de som conforme a preferência. |
| `atualizarChaves()` | método | Rótulos das chaves de dicas e de música. |

## `src/cenas/mesa/desenho.js`

Parte da CenaMesa: desenhar o estado da mão na tela. Neurônios, mãos, placar, curva de treino, dica do turno, alvos destacados e as conexões animadas entre os neurônios de cada rede. Nada aqui muda as regras; só lê `this.mao` e `this.partida`.

| Nome | Tipo | Descrição |
|---|---|---|
| `inspecionar(textura, nota)` | método | Mostra uma textura na inspeção, com uma nota explicativa embaixo. |
| `mostrarDica(texto)` | método | Mostra a dica do turno no rodapé do painel esquerdo. |
| `redesenhar()` | método | Redesenha tudo a partir do estado: pontuações, alvos, neurônios, mãos e painéis. |
| `desenharMaos()` | método | Desenha a mão do jogador de baixo (aberta) e a do de cima (versos). |
| `notaDaCartaDaMao(carta)` | método | Nota da inspeção para uma carta da mão: onde ela pode ser usada agora. |
| `atualizarPaineis()` | método | Atualiza os textos e botões dos painéis. |
| `textoComDicaDeJogo()` | método | Dica do turno e, com as dicas ligadas, o título da dica de jogo atual. |
| `atualizarPilha(pilha, nome, quantidade, texturaDoTopo)` | método | Desenha uma pilha (limbo ou cemitério): a carta do topo (ou o verso), bordas de cartas empilhadas por baixo quando há mais de uma, o contador e o rótulo. |
| `atualizarBlocoDoJogador(b, j)` | método | Bloco de placar de um jogador: avatar, nome, nível, situação, detalhes, tentos e soma. |
| `estaNaVez(j)` | método | O jogador `j` está na vez (e a mão está em andamento)? |
| `desenharDestaqueDaVez(tempo)` | método | Brilho pulsante em volta do bloco de placar de quem está na vez (desenhado a cada quadro). |
| `atualizarBotoes()` | método | Habilita os botões conforme o que o jogador pode fazer agora. |
| `atualizarRegistro()` | método | Registro de jogadas: as linhas mais recentes que couberem. |
| `desenharCurva()` | método | Curva de treino: soma de cada rede a cada turno. |
| `textoDaDica()` | método | Texto de ajuda do momento, conforme a fase e o modo de seleção. |
| `valorSelecionado()` | método | Valor (A, 2…K) das cartas selecionadas na mão. |
| `calcularAlvos()` | método | Calcula quais neurônios podem ser clicados agora e com que efeito (em `this.alvos`). |
| `desenharConexoesEAlvos(tempo)` | método | Desenho contínuo (a cada quadro): contorno e conexões de cada rede, com espessura proporcional ao valor, pulsos de "sinal" percorrendo as ligações e o contorno pulsante dos alvos. |

## `src/cenas/mesa/dicas.js`

Parte da CenaMesa: o modo "dicas". Com as dicas ligadas, o jogador recebe: - a cada vez, uma **dica de jogo** (conteudo/dicasDeJogo.js) no estilo do Grimório: uma oportunidade, um risco ou uma estratégia geral, sempre com o conceito de redes neurais por trás. As dicas usam só informação pública e nunca apontam qual neurônio oculto ativar; - **dicas flutuantes** nos botões de ação (Dropout, Transfer, Passar e TRUCO): ao passar o mouse ou, no celular, ao segurar o botão. Explicam a ação, o que vale fazer agora (no truco, a chance estimada por simulação) e o conceito do Grimório; - a chance estimada de vitória também na caixa de resposta ao truco. Em troca, a mão jogada com dicas (ligadas em algum momento) não vale conquistas nem conta nas estatísticas. O aviso aparece ao ligar.

| Nome | Tipo | Descrição |
|---|---|---|
| `SIMULACOES_DA_DICA` | constante | Simulações usadas para estimar a chance de vitória mostrada nas dicas. |
| `MEMORIA_DE_DICAS` | constante | Quantas dicas recentes evitar repetir. |
| `conceitoCurto(id)` | função | Primeira frase do conceito de um verbete (para a linha "conceito" das dicas). |
| `alternarDicas()` | método | Botão "Ativar dicas": avisa sobre as conquistas antes de ligar; desliga direto. |
| `darDicaDoTurno()` | método | Mostra a dica de jogo da vez do humano (só com as dicas ligadas e só se mudou). |
| `textoDaDicaDeJogo()` | método | Linha curta da dica atual, para o rodapé do painel esquerdo. |
| `mostrarDicaDoBotao(chave, x, y, l, a)` | método | Mostra a dica do botão `chave` ao lado do retângulo (x, y, l, a) do mundo do jogo. |
| `esconderDicaDoBotao()` | método | Esconde a dica flutuante. |
| `conteudoDaDica(chave)` | método | Texto da dica de cada botão: o que faz, o que vale fazer agora e o conceito de ML. |
| `dicaDaRespostaAoTruco(quem)` | método | Linha com a chance estimada, para a caixa de resposta ao truco (só com dicas ligadas). |

## `src/cenas/mesa/efeitos.js`

Parte da CenaMesa: animações e falas. Traduz os eventos das regras (ver nucleo/partida.js) em giros de carta, cartas voando, faíscas, faixas de texto, tremidas de câmera, balão de fala do oponente e avisos do Grimório.

| Nome | Tipo | Descrição |
|---|---|---|
| `ATAQUES` | constante | Cor e título de cada ataque. |
| `corCss` | constante | Número de cor 0xRRGGBB para texto CSS. |
| `posicaoDoNeuronio(id)` | método | Centro do neurônio na tela. |
| `origemDasCartas(j)` | método | Ponto de onde saem as cartas jogadas por `j` (a mão de baixo ou a de cima). |
| `animarEventos(eventos, jogada)` | método | Anima uma lista de eventos das regras. |
| `animar_ativacao(evento)` | método | Neurônio revelado: gira a carta e mostra os pontos ganhos. |
| `animar_tunagem(evento)` | método | Tunagem: cartas voam para o neurônio e somam pontos. |
| `animar_ataque(evento, jogada)` | método | Ataques (overfit, early stop, stack overflow): cartas voam, o neurônio treme e some. |
| `animar_dropout(evento)` | método | Dropout: os neurônios desfeitos giram de volta para o verso. |
| `animar_transfer()` | método | Transfer learning. |
| `animar_completa(evento)` | método | Rede chegou à camada de saída. |
| `animar_vento(evento)` | método | Terreno oceano: o vento mudou de naipe. |
| `animar_powerbi(evento)` | método | Baralho Power BI: as cartas da mão foram trocadas. |
| `animar_passe(evento)` | método | Alguém passou a vez. |
| `animar_inicio(evento)` | método | Quem começa: mostra as cartas reveladas (ou anuncia o sorteio). |
| `verificarVanishing()` | método | Avisa quando uma rede acaba de formar uma quadra de figuras (vanishing gradient). |
| `voarCarta(carta, x0, y0, x1, y1, atraso = 0)` | método | Uma carta voa de (x0, y0) até (x1, y1) e some. |
| `explodir(x, y, cor, quantidade)` | método | Explosão de `quantidade` faíscas da cor dada. A faísca colorida é uma textura própria (Canvas não tem tint). |
| `textoFlutuante(x, y, texto, cor = '#fff', tamanho = 20)` | método | Texto que sobe e desaparece. |
| `faixa(texto, cor = '#f6dc8f', tamanho = 48)` | método | Faixa grande no centro do tabuleiro (gritos de truco, ataques). |
| `falar(texto)` | método | Balão de fala do oponente. Fica à esquerda do placar, na altura do bloco do oponente, com a ponta virada para o avatar dele. |
| `impactoDoTruco(valor)` | método | Impacto do grito de truco: tapa na mesa, flash e tremor de tela mais fortes que o do stack overflow, crescendo a cada degrau (TRUCO 3, SEIS 6, NOVE 9, DOZE 12). |
| `avisarVerbete(id)` | método | Mostra uma vez por sessão o resumo do verbete do Grimório ligado ao que aconteceu. |

## `src/cenas/mesa/entrada.js`

Parte da CenaMesa: respostas a toques e cliques do jogador. Passar o cursor nos neurônios, clicar neles, selecionar cartas da mão, dropout, transfer, passar a vez e voltar ao menu. Modos de seleção (`this.modo`): 'livre' (padrão), 'inicio' (escolher a carta que decide quem começa), 'dropout' (escolher até onde desfazer) e 'pagarDropout' (escolher as cartas que pagam).

| Nome | Tipo | Descrição |
|---|---|---|
| `aoPassarNoNeuronio(id, entrando)` | método | Cursor sobre um neurônio: mostra a carta na inspeção e explica o efeito de clicar. |
| `aoClicarNoNeuronio(id)` | método | Clique num neurônio: ativa, empilha as cartas selecionadas ou escolhe o alcance do dropout. |
| `aoClicarNaCarta(idCarta)` | método | Clique numa carta da mão: escolhe a carta de início, paga o dropout ou monta a seleção. |
| `cancelarSelecao()` | método | Esc: limpa a seleção e sai do modo de dropout. |
| `alternarDropout()` | método | Botão Dropout: entra ou sai do modo de escolher o alcance. |
| `fazerTransfer()` | método | Botão Transfer: troca as quatro cartas iguais da mão. |
| `passarAVez()` | método | Botão Passar a vez. |
| `perguntarSeVoltaAoMenu()` | método | Botão Menu: confirma antes de abandonar a partida. |

## `src/cenas/mesa/layout.js`

Geometria da mesa e utilitários de texto que se ajusta ao espaço. Tudo em coordenadas do mundo (1280x720). Painel esquerdo: inspeção, pilhas e dica. Centro: as sete camadas da rede e as mãos. Painel direito: placar, truco, curva e ações.

| Nome | Tipo | Descrição |
|---|---|---|
| `PAINEL_ESQ` | constante (exportada) | Painel esquerdo (inspeção, pilhas e dica). |
| `PAINEL_DIR` | constante (exportada) | Painel direito (placar, curva, registro e ações). |
| `ESQ` | constante (exportada) | Posições verticais dentro do painel esquerdo, de cima para baixo. `pilha` é o tamanho das cartas do limbo e do cemitério. |
| `DIR` | constante (exportada) | Posições verticais dentro do painel direito. Os blocos de placar ficam empilhados a partir de `blocos`, cada um com altura `alturaBloco`; o botão de truco fica logo acima das ações. |
| `ESPACO_LINHA` | constante | Distância vertical entre neurônios e centro vertical do tabuleiro. |
| `colunaX` | constante (exportada) | X do centro da coluna da camada. |
| `linhaY` | constante (exportada) | Y do centro do neurônio `posicao` na camada. |
| `COR_JOGADOR` | constante (exportada) | Cor de cada jogador, em número (Phaser) e em texto (CSS). |
| `COR_DO_ALVO` | constante (exportada) | Cor do contorno que destaca cada tipo de alvo. |
| `NOME_SITUACAO` | constante (exportada) | Texto da situação de cada rede. |
| `ajustarCartaDaMesa(imagem)` | função (exportada) | Ajusta a imagem de um neurônio ao tamanho da carta da mesa e guarda a escala-base (para animar o giro). |
| `ajustarLinha(texto, conteudo, tamanho, larguraMax, minimo)` | função (exportada) | Texto de uma linha que encolhe até caber em `larguraMax`; se ainda não couber, corta com "…". Não refaz o cálculo se nada mudou. |
| `ajustarBloco(texto, conteudo, tamanho, larguraMax, alturaMax, minimo)` | função (exportada) | Bloco de texto com quebra de linha que encolhe até caber na altura. |

## `src/cenas/mesa/resultado.js`

Parte da CenaMesa: fim da mão. Marca os tentos, registra conquistas e mostra a tela de resultado com a soma detalhada de cada rede.

| Nome | Tipo | Descrição |
|---|---|---|
| `TROFEU` | constante | Troféu desenhado em SVG para a tela de vitória. |
| `encerrarMao(corrida)` | método | Encerra a mão. truco, ou null quando a mão foi jogada até o fim. |
| `comemorar(nivel, nome)` | método | Comemoração da vitória: fanfarra, clarão dourado, faixa grande, fogos e chuva de confete. |
| `faixaDeVitoria(titulo, subtitulo, duracao)` | método | Faixa dourada de vitória com título e subtítulo, que cresce e pulsa. |
| `chuvaDeConfete(duracao)` | método | Confete colorido caindo do alto da tela. |
| `htmlDaRede(j)` | método | HTML com a soma detalhada da rede do jogador `j`. |
| `mostrarResultado()` | método | Tela de resultado: vencedor, critério, redes, placar de tentos, conquistas novas e o botão de revisão da mão. Usa `this.ultimoResultado` (guardado em `encerrarMao`), para poder reabrir depois da revisão. |

## `src/cenas/mesa/truco.js`

Parte da CenaMesa: o truco. Pedir, anunciar com grito na tela, perguntar a resposta (ao humano numa caixa, ao oponente pelo seu perfil) e aplicar aceitar, correr ou aumentar.

| Nome | Tipo | Descrição |
|---|---|---|
| `pedirTrucoHumano()` | método | Botão TRUCO! do jogador humano. |
| `anunciarTruco(j)` | método | Registra o pedido de `j`, grita na tela e pergunta a resposta ao outro jogador. |
| `pedirResposta()` | método | Pergunta a resposta a quem recebeu o pedido. |
| `aplicarResposta(quem, resposta)` | método | Aplica a resposta de `quem`. |

## `src/cenas/mesa/turnos.js`

Parte da CenaMesa: o fluxo da mão. Começar a mão, executar jogadas, decidir quem joga a seguir, passar o aparelho no modo de dois jogadores e a vez do oponente do computador. O ciclo é: `avancar()` olha o estado e entrega a vez (humano, oponente ou troca de aparelho); cada jogada passa por `executarJogada()`, que aplica as regras, anima os eventos e chama `avancar()` de novo quando a animação termina.

| Nome | Tipo | Descrição |
|---|---|---|
| `verso(uso)` | método | Chave da textura do verso do baralho em uso. |
| `jogadorDeBaixo()` | método | Jogador mostrado embaixo (quem está vendo; o 0 enquanto o aparelho troca de mãos). |
| `jogadorDeCima()` | método | Jogador mostrado em cima. |
| `avatarDe(j)` | método | Textura do avatar do jogador. |
| `ehVezDoHumano()` | método | O jogador humano que está vendo a tela pode jogar agora? |
| `iniciarMao()` | método | Distribui uma mão nova: cria o estado, os neurônios na tela e começa o fluxo. |
| `criarNeuronios()` | método | Cria uma imagem clicável para cada neurônio, com a animação de distribuição. |
| `executarJogada(jogada)` | método | Aplica uma jogada (de qualquer jogador), anima os eventos e segue o fluxo. |
| `avancar()` | método | Decide o próximo passo: fim da mão, escolha de quem começa, vez do humano ou do oponente. |
| `anotarNaLinhaDoTempo(jogada, eventos, texto)` | método | Guarda um passo da mão para a revisão didática do fim (interface/telas/revisao.js): quem jogou, o que aconteceu (texto do registro e tipos de evento) e as somas depois da jogada. |
| `avancarNoInicio()` | método | Fase de início: oponentes escolhem a carta; humanos escolhem um de cada vez. |
| `passarAparelho(j, continuar)` | método | Modo de dois jogadores: esconde a mão e pede para passar o aparelho. |
| `vezDoOponente()` | método | Vez do oponente do computador: talvez pede truco, depois escolhe e executa a jogada. `this.notaDoOponente` substitui a linha de nível no painel ("pensando…", resultado da simulação). |

## `src/cenas/recursos.js`

Recursos compartilhados pelas cenas do Phaser: texto nítido, câmera ajustada à tela, fundo da mesa e texturas das cartas geradas sob demanda. As texturas são geradas pela arte (pasta arte/) na densidade certa para cada uso e guardadas no gerenciador de texturas do Phaser com chaves descritivas ('carta-mesa:truco:4P', 'verso-mao@yinyang').

| Nome | Tipo | Descrição |
|---|---|---|
| `prepararTextoNitido()` | função (exportada) | Todo texto do Phaser nasce na resolução interna, para não borrar com o zoom da câmera. A resolução vai no estilo, na criação: o renderizador Canvas só a lê nesse momento. Chamada uma vez em principal.js, antes de criar o jogo. |
| `ajustarCamera(cena)` | função (exportada) | Ajusta a câmera para mostrar o mundo (1280x720) inteiro e centralizado em qualquer tela. O Phaser, no modo EXPAND, não redimensiona a câmera ao girar o aparelho; por isso o ajuste é conferido no evento de resize e a cada quadro (custo: uma comparação). |
| `texturaDaMesa(cena, terreno = 'neutro')` | função (exportada) | Chave da textura do fundo da mesa do terreno (mantém em memória só o neutro e o atual). |
| `colocarFundo(cena, terreno)` | função (exportada) | Coloca o fundo da mesa (feltro ou terreno) atrás de tudo. Fica em `cena.fundo`. |
| `texturaDoVerso(cena, uso, baralho = 'classico')` | função (exportada) | Chave da textura do verso do baralho. |
| `texturaDaCartaNaMao(cena, carta, baralho)` | função (exportada) | Textura da carta completa no tamanho da mão. |
| `texturaDaCartaMedia(cena, carta, baralho)` | função (exportada) | Textura da carta completa em tamanho médio (cartas reveladas para decidir quem começa). |
| `texturaDaCartaNaMesa(cena, carta, baralho)` | função (exportada) | Textura da carta da mesa (neurônio). |
| `desenhosDeInspecao` | constante | Cartas completas já desenhadas em alta densidade para a inspeção (guarda as 14 mais recentes). |
| `criarTexturaDeInspecao(cena)` | função (exportada) | Cria a textura única da inspeção, redesenhada a cada carta mostrada. |
| `texturaDeInspecao(cena, carta, baralho)` | função (exportada) | Desenha a carta na textura da inspeção e devolve a chave dela. |
| `liberarCartasDaMao(cena)` | função (exportada) | Libera as cartas da mão da mão anterior (memória de vídeo é limitada em celulares). |
| `retanguloNaTela(cena, x, y, l, a)` | função (exportada) | Converte um retângulo do mundo do jogo (centro x, y e tamanho l × a) em pixels da página, para posicionar elementos HTML (como as dicas flutuantes) sobre o canvas. |

## `src/configuracao.js`

Configurações visuais compartilhadas: tamanho do mundo do jogo, cores das redes, resolução de renderização e densidade das texturas.

| Nome | Tipo | Descrição |
|---|---|---|
| `MUNDO` | constante (exportada) | O mundo do jogo tem sempre 1280x720 unidades; a câmera aplica o zoom para cada tela. |
| `CORES` | constante (exportada) | Cores das duas redes (padrão do TensorFlow Playground), do dourado e afins, em número (Phaser). |
| `CORES_CSS` | constante (exportada) | As mesmas cores em texto CSS. |
| `FONTES` | constante (exportada) | Fontes dos textos desenhados pelo Phaser. |
| `RESOLUCAO` | constante (exportada) | Resolução interna: o canvas tem os pixels físicos que a tela consegue mostrar em tela cheia (tamanho da tela × densidade de pixels), até 3x o mundo. Pode ser forçada com `?res=2` na URL. |
| `DENSIDADE` | constante (exportada) | Densidade (fator sobre o tamanho-base) com que cada tipo de textura é gerado. |
| `TAMANHO_CARTA` | constante (exportada) | Tamanho de exibição das cartas no mundo do jogo. |
| `FORCAR_CANVAS` | constante (exportada) | Diz se a página foi aberta pedindo o renderizador Canvas (`?renderer=canvas`), útil em testes. |

## `src/conteudo/conquistas.js`

Conquistas e suas graduações (bronze a antimatéria, como sugere a especificação). Cada conquista tem um `teste(ctx)` avaliado ao fim de cada mão contra oponentes. O contexto é: ``` { mao, eu, venceu, completa, // estado final da mão, índice do humano, resultado, se foi jogada até o fim partida, venceuPartida, valorDaMao, // camada de truco oponenteCorreu, opcoes, // se o oponente correu do truco; opções do menu progresso } // contadores acumulados (ver progresso.js) ```

| Nome | Tipo | Descrição |
|---|---|---|
| `GRADUACOES` | constante (exportada) | Graduações com nome e cor da medalha. |
| `meu` | constante | Atalho: dados do jogador humano na mão encerrada. |
| `VALEM_SEM_MAO_COMPLETA` | constante (exportada) | Conquistas que podem ser ganhas mesmo quando a mão termina porque alguém correu do truco. |

## `src/conteudo/dicasDeJogo.js`

Dicas de jogo do modo "dicas": como jogar bem e o conceito de redes neurais por trás. Regra de ouro: as dicas usam **só informação pública** — as cartas da mão de quem pede a dica, os neurônios já revelados na mesa, as somas e o placar. Nunca apontam qual neurônio oculto ativar nem dizem o que há embaixo de uma carta virada; isso seria trapaça, não dica. `escolherDicaDeJogo` olha a situação e devolve a dica mais útil agora (oportunidades e riscos primeiro), ou uma dica geral de estratégia ligada a um verbete do Grimório. Não depende do Phaser: roda também no Node (testes).

| Nome | Tipo | Descrição |
|---|---|---|
| `DICAS_GERAIS` | constante (exportada) | Dicas gerais de estratégia, usadas quando nenhuma situação especial aparece. Cada uma liga uma boa prática do jogo a um conceito do Grimório (`verbete`). |
| `contarValores(mao)` | função | Contagem de cartas da mão por valor. |
| `escolherDicaDeJogo(mao, j, partida, recentes = [])` | função (exportada) | Escolhe a dica de jogo para o jogador `j` agora. |

## `src/conteudo/grimorio.js`

Grimório: cada mecânica do jogo explicada como conceito de aprendizado de máquina. Cada verbete tem `id`, `titulo`, `categoria`, `conceito` (o que é em ML) e `noJogo` (como aparece na mesa). A mesa mostra o verbete como aviso na primeira vez que a mecânica acontece.

## `src/conteudo/progresso.js`

Progresso do jogador guardado no navegador (localStorage): contadores, conquistas, verbetes lidos, opções do menu e preferência de som. O armazenamento pode falhar (janela anônima, armazenamento bloqueado); por isso toda leitura e escrita é protegida e o jogo funciona normalmente sem ele.

| Nome | Tipo | Descrição |
|---|---|---|
| `progressoInicial()` | função | Progresso vazio. |
| `migrarV1(antigo)` | função | Converte o formato da versão anterior (nomes em inglês) para o atual, sem perder conquistas. |
| `carregarProgresso()` | função (exportada) | Lê o progresso salvo (ou o inicial). |
| `salvarProgresso(progresso)` | função (exportada) | Salva o progresso. Falhas são ignoradas. |

## `src/conteudo/textos.js`

Textos de ambientação das cartas e falas dos oponentes.

| Nome | Tipo | Descrição |
|---|---|---|
| `AMBIENTACAO` | constante (exportada) | Frase em itálico na caixa de texto de cada carta (por valor, ou pelo nome da manilha). |
| `PROVOCACOES` | constante (exportada) | Falas dos oponentes por situação. |
| `provocar(situacao)` | função (exportada) | Sorteia uma fala da situação. |

## `src/interface/menu.js`

Menu principal: apresentação do jogo, botões das telas e configuração da mesa (oponente, baralho, terreno, quem começa e tipo de partida).

| Nome | Tipo | Descrição |
|---|---|---|
| `ESCOLHAS_OPONENTE` | constante | Opções da lista "Oponente", incluindo o modo de dois humanos. |
| `miniaturas` | constante | Miniaturas do verso e da mesa já desenhadas (evita redesenhar a cada troca). |
| `mostrarMiniatura(elemento, chave, desenhar)` | função | Mostra a miniatura `chave` dentro do elemento, desenhando-a na primeira vez com `desenhar()`. |
| `opcoesHtml(rotulos, selecionado)` | função | Gera as `<option>` de uma lista. `rotulos` mapeia valor → texto (ou objeto com `nome`). |
| `htmlDoMenu(opcoes)` | função | HTML do menu. |
| `abrirMenu(app)` | função (exportada) | Abre o menu principal. |
| `atualizarDicas()` | função | Atualiza descrições e miniaturas conforme as escolhas. |
| `lerEscolhas()` | função | Guarda as escolhas atuais na aplicação. |

## `src/interface/musica.js`

Música de fundo sintetizada com WebAudio, uma para cada terreno: | Terreno | Estilo | Andamento | |----------|--------------------------------|-----------| | neutro | blues com balanço (shuffle) em Mi | 92 bpm | | oceano | valsa lenta em Sol, com ondas | 66 bpm (3/4) | | montanha | épica em Lá menor, com tambores | 88 bpm | | pantano | sombria e gótica em Ré menor, órgão e sino | 56 bpm | Cada música é um laço de compassos com acordes, baixo, acompanhamento, melodia e percussão. A melodia é sorteada por compasso com uma semente fixa, então o laço sempre se repete igual. Um agendador olha 0,4 s à frente e marca as notas no relógio do WebAudio (sem atrasos).

| Nome | Tipo | Descrição |
|---|---|---|
| `VOLUME` | constante | Volume geral da música (baixo, para não brigar com os efeitos). |
| `ANTECEDENCIA` | constante | Quanto tempo à frente as notas são agendadas, em segundos. |
| `hz` | constante | Frequência de uma nota MIDI (69 = Lá 440 Hz). |
| `sorteador(semente)` | função | Gerador reprodutível (mesmo compasso, mesma melodia). |
| `voz(saida, tempo, midi, duracao, { forma = 'triangle', volume = 0.1, ataque = 0.01, liberacao = 0.15, filtro = 0, vibrato = 0, desafinar = 0 } = {})` | função | Toca uma nota com envelope (ataque, sustentação, liberação), filtro passa-baixa opcional e vibrato opcional. |
| `chiado(saida, tempo, duracao, { volume = 0.05, filtro = 8000, tipo = 'highpass', ataque = 0.002 } = {})` | função | Ruído filtrado: chimbal, prato, ondas do mar. |
| `tambor(saida, tempo, { volume = 0.35, de = 110, para = 42, duracao = 0.45 } = {})` | função | Tambor grave (bumbo, taiko): seno que despenca de frequência. |
| `sino(saida, tempo, midi, volume = 0.06)` | função | Sino: parciais inarmônicas que somem devagar. |
| `agendar()` | função | Agenda as notas que caem nos próximos ANTECEDENCIA segundos. |
| `Musica` | constante (exportada) | Música de fundo: tocar a do terreno, parar, ligar e desligar. |
| `tocar(terreno)` | método | Começa (ou troca para) a música do terreno, com entrada suave. |
| `parar()` | método | Para a música com saída suave. |
| `tocando()` | método | Está tocando? |

## `src/interface/paineis.js`

Base dos painéis HTML sobrepostos ao canvas: abrir e fechar telas, avisos rápidos e caixas de confirmação. As telas específicas (menu, regras, grimório…) usam estas funções. Os painéis vivem em `#paineis` e os avisos em `#avisos` (ver index.html).

| Nome | Tipo | Descrição |
|---|---|---|
| `escaparHtml(texto)` | função (exportada) | Escapa texto para inserir em HTML com segurança. |
| `abrirPainel(html, opcoes = {})` | função (exportada) | Abre uma tela sobre o jogo. |
| `fecharTodos()` | função (exportada) | Fecha todas as telas abertas. |
| `mostrarAviso(titulo, texto, tipo, duracaoMs = 5200)` | função (exportada) | Mostra um aviso rápido no topo da tela (só um por vez). |
| `mostrarDicaDeJogo(titulo, texto, tituloDoConceito, conceito)` | função (exportada) | Dica de jogo do modo "dicas", no estilo do Grimório: título, conselho e o conceito de redes neurais relacionado. Usa a mesma área dos avisos e fica 9 segundos (um toque fecha). |
| `confirmar(titulo, texto, botoes, opcoes = {})` | função (exportada) | Caixa de confirmação com botões. |
| `mostrarDicaFlutuante(titulo, html, alvo)` | função (exportada) | Mostra uma dica no estilo do Grimório ao lado de um elemento da mesa (botão, carta). Fica à esquerda do retângulo quando há espaço; senão, acima ou abaixo. |
| `esconderDicaFlutuante()` | função (exportada) | Esconde a dica flutuante, se houver. |

## `src/interface/som.js`

Efeitos sonoros sintetizados com WebAudio (nenhum arquivo de áudio). O navegador só libera som depois de um clique; `Som.desbloquear()` é chamado no botão "Jogar".

| Nome | Tipo | Descrição |
|---|---|---|
| `contextoDeAudio()` | função (exportada) | Cria (ou retoma) o contexto de áudio. Devolve null se o navegador não tiver WebAudio. |
| `audio()` | função | Contexto de áudio compartilhado com a música (interface/musica.js). |
| `nota(frequencia, duracao, forma, volume, atraso, deslize)` | função | Toca uma nota curta. |
| `ruido(duracao, volume, atraso, filtro)` | função | Toca um chiado filtrado (cartas, impactos). |
| `Som` | constante (exportada) | Efeitos sonoros do jogo, um por acontecimento. |
| `truco(forca = 1)` | método | Grito de truco: tapa na mesa (baque grave e estalo), depois a fanfarra do pedido. |
| `fanfarra()` | método | Fanfarra de vitória da mão, no espírito dos fins de fase dos jogos de 8 bits dos anos 80 (melodia original): escalas rápidas em onda quadrada subindo por três acordes, um rufar e o acorde final sustentado com o baixo. |
| `campeao()` | método | Vitória da partida: a fanfarra seguida de um hino mais longo, com tambores. |

## `src/interface/telas/conquistas.js`

Quadro de conquistas: retrato do professor em moldura medieval à esquerda e as medalhas à direita (desbloqueadas coloridas; bloqueadas em cinza, com cadeado).

| Nome | Tipo | Descrição |
|---|---|---|
| `medalhaHtml(conquista, desbloqueada)` | função (exportada) | HTML da medalha de uma conquista (também usado no resumo do fim da mão). |
| `itemHtml(conquista, desbloqueada)` | função | HTML de um item da lista de conquistas. |
| `abrirConquistas(app)` | função (exportada) | Abre o quadro de conquistas. |

## `src/interface/telas/grimorio.js`

Tela do Grimório: lista de verbetes à esquerda e o verbete escolhido à direita. Ler um verbete conta para a conquista "Bibliotecário".

| Nome | Tipo | Descrição |
|---|---|---|
| `abrirGrimorio(app, idInicial, aoFechar)` | função (exportada) | Abre o Grimório. |
| `desenharLista(ativo)` | função | Desenha a lista com o verbete ativo destacado. |
| `mostrar(id)` | função | Mostra um verbete e o marca como lido. |

## `src/interface/telas/regras.js`

Tela "Como jogar": resumo das regras, ações, desempates, truco, baralhos e terrenos.

| Nome | Tipo | Descrição |
|---|---|---|
| `listaDeExtensoes()` | função | Lista "nome: resumo" de baralhos e terrenos (o terreno neutro fica de fora). |
| `abrirRegras(app, aoFechar)` | função (exportada) | Abre a tela de regras. Na primeira partida ela abre sozinha; ao fechar, chama `aoFechar`. |

## `src/interface/telas/revisao.js`

Tela de revisão didática do fim da mão (e da partida). Mostra, a partir da linha do tempo guardada pela mesa (cenas/mesa/turnos.js): - um resumo com os momentos-chave (maior salto, golpe mais duro, a virada) e o que cada um fez; - a curva de treino das duas redes, passo a passo, com marcas nas ações importantes; - a linha do tempo comentada, ligando cada ação ao conceito de redes neurais do Grimório; - na partida com várias mãos, o placar mão a mão.

| Nome | Tipo | Descrição |
|---|---|---|
| `COR` | constante | Cor das redes. |
| `MARCAS` | constante | Cor e rótulo de cada tipo de acontecimento marcado na curva. |
| `tipoDoPasso(passo)` | função | Tipo principal de um passo: o evento mais marcante, ou o tipo da jogada. |
| `VERBETE_DO_TIPO` | constante | Verbete do Grimório ligado a cada tipo de passo. |
| `variacoes(passos)` | função | Diferença das somas em relação ao passo anterior. |
| `momentosChave(passos, nomes)` | função | Momentos-chave da mão, em frases curtas. |
| `contagens(passos)` | função | Quantas vezes cada jogador fez cada tipo de ação. |
| `graficoDaCurva(passos, nomes)` | função | Gráfico SVG da curva de treino com as marcas das ações. |
| `linhaDoTempoHtml(passos, nomes)` | função | Linha do tempo comentada: cada passo, a variação das somas e o conceito (na primeira vez). |
| `tabelaDaPartida(historico, nomes)` | função | Placar mão a mão da partida. |
| `abrirRevisao({ mao, linhaDoTempo, partida, historicoDaPartida, numeroDaMao, aoFechar })` | função (exportada) | Abre a revisão. |

## `src/interface/telas/sobre.js`

Tela "Sobre": versão, o jogo, a disciplina, a especificação, o professor, os autores e a licença.

| Nome | Tipo | Descrição |
|---|---|---|
| `abrirSobre()` | função (exportada) | Abre a tela "Sobre". |

## `src/nucleo/aleatorio.js`

Gerador de números aleatórios com semente. Toda a aleatoriedade das regras passa por aqui. Com a mesma semente, a mesma partida se repete, o que permite reproduzir erros e comparar oponentes em simulação.

| Nome | Tipo | Descrição |
|---|---|---|
| `sortear(estado)` | função (exportada) | Sorteia um número em [0, 1) e avança a semente guardada no objeto (algoritmo mulberry32). |
| `sortearInteiro(estado, n)` | função (exportada) | Sorteia um inteiro em [0, n). |
| `embaralhar(lista, estado)` | função (exportada) | Embaralha a lista no lugar (Fisher-Yates) e a devolve. @template T |
| `sementeNova()` | função (exportada) | Cria uma semente nova a partir do relógio, para partidas não reproduzíveis. |

## `src/nucleo/baralhos.js`

Baralhos com efeitos (seção "Extensões" da especificação) e valor em pontos das cartas.

| Nome | Tipo | Descrição |
|---|---|---|
| `BARALHOS` | constante (exportada) | Cada baralho tem: `nome`, `resumo` (texto do menu), `montar()` que gera as 52 cartas e, opcionalmente, um efeito: - `pontosFixos`: pontos especiais por id de carta (manilhas do truco); - `manilhas`: nome especial de cartas; - `fraternidade`: vizinhos do mesmo naipe valem dobro; - `trocaMao`: a mão muda aleatoriamente após cada ação (Power BI). |
| `pontosDaCarta(carta, baralho)` | função (exportada) | Pontos de uma carta isolada: 2 a 10 pelo número, Ás 11, figuras 0, manilhas pelo baralho. |
| `nomeDaCarta(carta, baralho)` | função (exportada) | Nome por extenso da carta, ou o nome da manilha ("Zap"). |
| `manilhaDaCarta(carta, baralho)` | função (exportada) | Nome da manilha, se a carta for uma no baralho escolhido. |

## `src/nucleo/cartas.js`

Cartas do baralho: valores, naipes e nomes. Uma carta é um objeto simples `{ id, valor, naipe }`: - `valor`: 'A', '2'…'10', 'J' (valete), 'Q' (dama) ou 'K' (rei); - `naipe`: 'E' (espadas), 'C' (copas), 'P' (paus) ou 'O' (ouros); - `id`: identificador único dentro da partida (ex.: 'KC', '2E#7').

| Nome | Tipo | Descrição |
|---|---|---|
| `VALORES` | constante (exportada) | Valores do baralho, do Ás ao Rei. |
| `NAIPES` | constante (exportada) | Naipes na ordem de desempate da especificação: espadas > copas > paus > ouros. |
| `NAIPE` | constante (exportada) | Dados de exibição de cada naipe. `emblema` é o desenho do naipe espanhol usado na arte. |
| `ORDEM_NAIPE` | constante (exportada) | Peso de cada naipe no desempate. |
| `NOME_VALOR` | constante (exportada) | Nome por extenso de cada valor. |
| `PLURAL_FIGURA` | constante (exportada) | Plural das figuras, usado nos nomes de combos ("Trio de Reis"). |
| `FORCA_VALOR` | constante (exportada) | Força de cada valor para decidir quem começa e para desempates (Ás é a mais alta). |
| `ehFigura(carta)` | função (exportada) | Diz se a carta é uma figura (valete, dama ou rei). |
| `rotuloCarta(carta)` | função (exportada) | Rótulo curto da carta, ex.: '10♠'. |
| `baralhoPadrao()` | função (exportada) | Baralho padrão de 52 cartas, sem coringas. |

## `src/nucleo/oponentes/comum.js`

Ferramentas compartilhadas pelos oponentes: o que eles não veem, determinização, avaliação de posições e simulação rápida até o fim da mão.

| Nome | Tipo | Descrição |
|---|---|---|
| `VALOR_DE_CARTA_NA_MAO` | constante | Valor estimado, em pontos, de cada carta guardada na mão. |
| `cartasOcultas(mao, j)` | função (exportada) | Cartas que o jogador `j` não consegue ver: neurônios virados, mão do adversário e limbo. |
| `determinizar(mao, j)` | função (exportada) | Determinização: copia a mão e sorteia uma distribuição plausível para tudo o que `j` não vê. É assim que os oponentes "imaginam" as cartas escondidas antes de simular. |
| `pontosEsperadosPorCamada(mao, j)` | função (exportada) | Pontos esperados por camada ainda não revelada, do ponto de vista de `j`. |
| `projecao(mao, i, esperado)` | função | Projeção da soma final do jogador `i`: soma atual + camadas que faltam + cartas na mão. |
| `avaliar(mao, j, esperado)` | função (exportada) | Nota de uma posição para `j`: vantagem projetada sobre o melhor adversário (ou ±1000 no fim). |
| `agruparEquivalentes(mao, jogadas)` | função (exportada) | Agrupa ativações de neurônios desconhecidos da mesma camada: para quem joga, são equivalentes. Cada grupo vira uma jogada com a lista `alternativas`. |
| `concretizar(jogada)` | função (exportada) | Escolhe um neurônio ao acaso entre as alternativas e devolve uma jogada aplicável. |
| `jogadaRapida(mao, j)` | função | Política rápida usada nas simulações: ataques fortes, tunagens boas e ativações razoáveis. |
| `simularAteOFim(mao)` | função (exportada) | Joga a mão até o fim com a política rápida (um "rollout"). |
| `chanceDeVitoria(mao, j, n)` | função (exportada) | Estima a chance de `j` vencer a mão simulando `n` finais possíveis. |

## `src/nucleo/oponentes/estrategias.js`

As três estratégias de jogo, uma por nível de dificuldade. - aleatória (Zé do Ruído): sorteia qualquer jogada válida; - gulosa (Gradiente Guloso): avalia cada jogada um turno à frente pelo valor esperado; - Monte Carlo (Mestre Monte Carlo): simula partidas inteiras para cada jogada e escolhe a que mais venceu.

| Nome | Tipo | Descrição |
|---|---|---|
| `jogadaAleatoria(mao, j)` | função (exportada) | Estratégia aleatória: prefere ativar neurônios (70%) para a mão andar. |
| `jogadaGulosa(mao, j)` | função (exportada) | Estratégia gulosa: aplica cada jogada numa cópia e escolhe a de melhor avaliação. Ativações de neurônios desconhecidos são testadas com 8 sorteios do que pode estar embaixo. |
| `jogadaMonteCarlo(mao, j, orcamentoMs = 380)` | função (exportada) | Estratégia de Monte Carlo: para cada jogada, sorteia o que está escondido, joga até o fim e conta vitórias. Repete até gastar o tempo `orcamentoMs`. A jogada escolhida leva `simulacao` com a taxa de vitória e o total de partidas simuladas, que a interface mostra. |

## `src/nucleo/oponentes/index.js`

Ponto de entrada dos oponentes: perfis (nome, nível, estilo), escolha de jogada e decisões de truco.

| Nome | Tipo | Descrição |
|---|---|---|
| `OPONENTES` | constante (exportada) | Perfis exibidos no menu e na mesa. `avatar` é a chave da arte em arte/avatares.js. |
| `cartaDeInicio(mao, j)` | função | Carta que o oponente revela para decidir quem começa. |
| `escolherJogada(mao, j, orcamentoMs)` | função (exportada) | Escolhe a jogada do oponente `j` conforme o seu perfil. |
| `SIMULACOES_TRUCO` | constante | Simulações usadas para estimar a chance de vitória em cada perfil. |
| `querTrucar(mao, j, perfil)` | função (exportada) | Decide se o oponente pede truco antes da sua jogada. |
| `responderAoTruco(mao, j, perfil, valorPedido, podeAumentar)` | função (exportada) | Resposta do oponente a um pedido de truco. |

## `src/nucleo/partida.js`

Motor de uma mão: estado, jogadas legais, aplicação de jogadas e desempates. Não depende de interface. A cena da mesa e os oponentes usam as mesmas funções, e a ferramenta de simulação roda milhares de mãos no Node com elas. ## Estado da mão ``` { config: { baralho, terreno, inicio }, // opções escolhidas no menu semente, contador, // aleatoriedade reproduzível camadas: Neuronio[][], // a mesa, camada a camada neuronios: { [id]: Neuronio }, // índice dos neurônios por id jogadores: Jogador[], limbo: Carta[], cemiterio: Carta[], vez, primeiro, rodada, turno, passesSeguidos, vento, fase: 'inicio' | 'jogo' | 'fim', eventos: Evento[], // fila consumida pela interface para animar registro: string[], // texto do histórico de jogadas historico: number[][], // soma de cada rede a cada turno (curva de treino) resultado: { somas, vencedor, motivo, travados } | null, simulacao: boolean, // em simulações, não gera eventos nem textos } ``` Neurônio: `{ id, camada, posicao, cartas, revelado, dono, removido, conhecido, rodadaRevelada }`. Jogador: `{ indice, nome, tipo: 'humano'|'oponente', oponente, mao, caminho, situacao, dropouts, acoesUsadas, transferUsado, congelada, cartaInicial, estatisticas }`. ## Jogadas `{ tipo: 'inicio', jogador, carta }`, `{ tipo: 'ativar', jogador, neuronio }`, `{ tipo: 'empilhar', jogador, neuronio, cartas }`, `{ tipo: 'dropout', jogador, n, pagamento }`, `{ tipo: 'transfer', jogador, cartas }`, `{ tipo: 'passar', jogador }`.

| Nome | Tipo | Descrição |
|---|---|---|
| `FORMAS_DE_INICIO` | constante (exportada) | Formas de decidir quem começa (seção "Inicialização" da especificação). |
| `NOME_EFEITO` | constante (exportada) | Nome de cada efeito de empilhamento, para a interface. |
| `novoJogador(dados, indice)` | função | Cria o objeto de um jogador no começo da mão. |
| `novaMao(opcoes)` | função (exportada) | Cria uma mão nova: embaralha, monta a mesa, distribui as cartas e queima o resto no limbo. |
| `reindexar(mao)` | função | Recria o índice de neurônios por id (necessário após copiar a mesa). |
| `copiarMao(mao)` | função (exportada) | Cópia leve da mão para simulações dos oponentes (sem eventos, textos ou histórico). |
| `emitir(mao, evento)` | função | Coloca um evento na fila da interface (ignorado em simulação). |
| `anotar(mao, texto)` | função | Acrescenta uma linha ao registro de jogadas (ignorado em simulação). |
| `anotarHistorico(mao)` | função | Guarda a soma atual de cada rede para a curva de treino. |
| `fronteira(mao, j)` | função (exportada) | Último neurônio do caminho do jogador (a "fronteira"), ou null. |
| `alvosDeAtivacao(mao, j)` | função (exportada) | Neurônios livres que o jogador pode ativar na próxima camada da sua rede. |
| `alvosDeEmpilhamento(mao)` | função (exportada) | Neurônios que aceitam cartas empilhadas: a fronteira oculta das redes ainda em construção. |
| `efeitoDoEmpilhamento(mao, j, neuronio, n)` | função (exportada) | Efeito de empilhar `n` cartas no neurônio, pelo tamanho final da pilha: 2 = tunagem (própria) ou overfit (adversário); 3 = early stop; 4 = stack overflow. |
| `podeEmpilhar(mao, j, idNeuronio, idsCartas)` | função (exportada) | Diz se o jogador pode empilhar essas cartas da mão nesse neurônio. |
| `camadasDesfaziveis(mao, j)` | função (exportada) | Quantas camadas ocultas o jogador pode desfazer com dropout. |
| `valorParaTransfer(mao, j)` | função (exportada) | Valor que o jogador tem quatro vezes na mão (para transfer learning), ou null. |
| `podePassar(mao, j)` | função (exportada) | Só passa a vez quem não tem neurônio para ativar. |
| `combinacoes(lista, k)` | função | Todas as combinações de `k` itens da lista. |
| `jogadasLegais(mao, j, opcoes = {})` | função (exportada) | Lista as jogadas legais do jogador. |
| `tirarDaMao(jogador, ids)` | função | Tira as cartas da mão do jogador e as devolve. |
| `finalizarRede(mao, j, situacao)` | função | Finaliza a rede do jogador, congelando rodada e vento (relevantes para os terrenos). |
| `trocarMaoPowerBI(mao, jogador)` | função | Baralho Power BI: troca as cartas que sobraram na mão por cartas aleatórias. |
| `encerrarTurno(mao)` | função | Passa a vez; ao completar uma volta, avança a rodada (e o vento, no oceano). Encerra a mão se for o caso. |
| `resolverInicio(mao)` | função | Compara as cartas reveladas para decidir quem começa. |
| `ativar(mao, jogada)` | função | Jogada 'ativar': revela o neurônio e o liga à rede do jogador. |
| `empilhar(mao, jogada)` | função | Jogada 'empilhar': tunagem, overfit, early stop ou stack overflow, conforme a pilha final. |
| `fazerDropout(mao, jogada)` | função | Jogada 'dropout' (GatoNet): desvira os últimos neurônios pagando uma carta por camada. Não gasta o turno. |
| `fazerTransfer(mao, jogada)` | função | Jogada 'transfer': troca quatro cartas iguais por quatro do limbo (uma vez por mão). |
| `aplicarJogada(mao, jogada)` | função (exportada) | Aplica uma jogada ao estado (modifica `mao`). Lança erro se a jogada for inválida. |
| `somaDasMelhores(mao, jogador, n)` | função | Soma das `n` cartas de maior valor na mão do jogador. |
| `cartaMaisAlta(mao, jogador)` | função | Chave numérica da carta mais alta da mão (pontos, depois força, depois naipe). |
| `filtrarMaiores(candidatos, criterio)` | função | Mantém só os candidatos com o maior valor de `criterio`. |
| `encerrarMao(mao)` | função | Decide o vencedor com os critérios de desempate da especificação, na ordem. |

## `src/nucleo/pontuacao.js`

Soma da rede de um jogador (o "forward pass" do jogo). Regras da especificação: - 2 a 10 valem o número, Ás 11, figuras 0; - figuras iguais em camadas vizinhas: par +10, trio +20; quadra zera a rede (vanishing gradient); - tunagem soma a carta empilhada; em figura, +10 por carta empilhada. Leitura adotada para o exemplo do enunciado ("8-K-K-3" com tunagem num K = 41): as cartas de figura empilhadas contam para o combo. K(2 cartas) + K(1) = três Reis vizinhos = trio (20) + tunagem (10), logo 8 + 20 + 10 + 3 = 41.

| Nome | Tipo | Descrição |
|---|---|---|
| `pontuarNeuronios(mao, j)` | função | Pontos de cada neurônio do caminho, com efeitos de tunagem e terreno. |
| `aplicarFraternidade(neuronios)` | função | Baralho da fraternidade: dobra neurônios com vizinho do mesmo naipe. |
| `encontrarCombos(neuronios)` | função | Encontra sequências de figuras iguais em camadas vizinhas e calcula o bônus de cada uma. |
| `pontuarRede(mao, j)` | função (exportada) | Calcula a soma da rede do jogador `j`. |
| `mediaDePontos(mao, cartas)` | função (exportada) | Média de pontos de um conjunto de cartas (usada pelos oponentes para estimar camadas futuras). |

## `src/nucleo/rede.js`

Arquitetura da rede neural montada na mesa. Camada 0 é a entrada (3 neurônios), 1 a 5 são ocultas (5 cada) e 6 é a saída (4). Cada jogador recebe `TAMANHO_MAO` cartas; o que sobra vai para o limbo.

| Nome | Tipo | Descrição |
|---|---|---|
| `TAMANHOS_CAMADAS` | constante (exportada) | Neurônios por camada, da entrada à saída. |
| `TOTAL_CAMADAS` | constante (exportada) | Quantidade de camadas (7). |
| `CAMADA_SAIDA` | constante (exportada) | Índice da camada de saída (6). |
| `TAMANHO_MAO` | constante (exportada) | Cartas na mão de cada jogador no início. |
| `ehOculta(camada)` | função (exportada) | Diz se a camada é oculta (só nelas valem as ações com cartas). |
| `nomeCamada(camada)` | função (exportada) | Nome da camada para a interface: 'Entrada', 'Oculta 3', 'Saída'. |

## `src/nucleo/terrenos.js`

Terrenos (seção "Extensões" da especificação). O efeito de cada um é aplicado em `pontuacao.js`; aqui ficam só nome e descrição.

## `src/nucleo/truco.js`

Camada de truco: a partida vale tentos e cada mão pode ser trucada. TRUCO! (3) → SEIS! (6) → NOVE! (9) → DOZE! (12). Quem corre entrega o valor atual. Mão de onze: com alguém a um tento da vitória, ninguém pode trucar. Estado da partida: `{ alvo, tentos: [n, n], numeroMao, valor, aumentadoPor, pedido, encerrada, vencedor }`. `pedido` é `{ por, para }` enquanto um truco espera resposta.

| Nome | Tipo | Descrição |
|---|---|---|
| `ESCADA_TRUCO` | constante (exportada) | Valores possíveis de uma mão. |
| `GRITO_TRUCO` | constante (exportada) | O que se grita ao pedir cada valor. |
| `novaPartida(alvo)` | função (exportada) | Cria uma partida. `alvo` é o número de tentos para vencer (1 = mão única, sem truco). |
| `proximoValor(valor)` | função (exportada) | Próximo degrau da escada a partir de `valor`, ou null no topo. |
| `ehMaoDeOnze(partida)` | função (exportada) | Mão de onze: alguém está a um tento da vitória. |
| `podeTrucar(partida, j)` | função (exportada) | Diz se o jogador pode pedir truco agora (quem aumentou por último não aumenta de novo). |
| `pedirTruco(partida, j)` | função (exportada) | Registra um pedido de truco. Devolve falso se não for permitido. |
| `responderTruco(partida, j, resposta)` | função (exportada) | Responde ao pedido pendente. |
| `marcarTentos(partida, vencedor, pontos)` | função (exportada) | Soma os tentos da mão ao vencedor e encerra a partida se ele chegou ao alvo. Devolve os tentos ganhos. |
| `proximaMao(partida)` | função (exportada) | Prepara a próxima mão da partida. |

## `src/principal.js`

Ponto de entrada do jogo: prepara o texto nítido, carrega as opções e cria o Phaser.Game com as três cenas (Carregamento → Menu → Mesa). Num celular na vertical, o jogo só é criado depois que o aparelho é girado; até lá aparece o aviso #girar (index.html). O Phaser vem do CDN como variável global `Phaser` (ver index.html).

| Nome | Tipo | Descrição |
|---|---|---|
| `celularEmPe` | constante | Celular na vertical (o aviso para girar aparece no lugar do jogo; ver #girar em estilo.css). |
| `criarJogo()` | função | Cria o Phaser.Game com as três cenas. |
| `iniciarJogo()` | função | Cria o jogo agora ou, num celular em pé, assim que ele for girado para a horizontal. |

## `src/recursos/retratoProfessor.js`

Foto do prof. Peng Yaohao (360x360, JPEG embutido), enviada pelo autor para o quadro de conquistas.

## `src/versao.js`

Versão do jogo, mostrada na tela "Sobre". Gerado por ferramentas/versionar.js a cada merge na main (GitHub Actions). Não edite à mão.

| Nome | Tipo | Descrição |
|---|---|---|
| `VERSAO` | constante (exportada) | Número da versão (MAIOR.MENOR.CORREÇÃO). |
| `DATA_DA_VERSAO` | constante (exportada) | Data da versão (AAAA-MM-DD). |

## `ferramentas/documentar.js`

Gera docs/REFERENCIA.md: a lista de módulos e funções do projeto, montada a partir dos comentários JSDoc do código (o `@file` de cada arquivo e o comentário `/** ... *\/` logo acima de cada função, constante ou método). Assim a referência nunca fica desatualizada: basta documentar o código e rodar `npm run docs`.

| Nome | Tipo | Descrição |
|---|---|---|
| `raiz` | constante | Pasta do projeto. `TRUCO_RAIZ` permite rodar sobre uma cópia (usado nos testes). |
| `arquivosJs(pasta)` | função | Lista recursiva dos arquivos .js de uma pasta, em ordem alfabética. |
| `limparComentario(bloco)` | função | Texto limpo de um bloco de comentário JSDoc (sem `*` e sem as tags @param/@returns). |
| `lerModulo(caminho)` | função | Extrai a descrição do arquivo e os itens documentados. |

## `ferramentas/empacotar.js`

Empacota o jogo num único arquivo HTML (CSS e JavaScript embutidos; Phaser e fontes via CDN). Saídas: - dist/truco-de-turing.html: página completa, para abrir direto ou hospedar em qualquer lugar; - dist/artifact.html: o mesmo conteúdo sem <html>/<head>/<body>, para publicar como artifact. Uso: `npm run build`.

| Nome | Tipo | Descrição |
|---|---|---|
| `raiz` | constante | Pasta do projeto. `TRUCO_RAIZ` permite rodar sobre uma cópia (usado nos testes). |

## `ferramentas/relatorios.js`

Roda todas as suítes de teste e escreve os relatórios em relatorios/. Suítes: - unidade (testes/unidade): regras, conteúdo, arte, interface HTML, aplicação e ferramentas; - interface (testes/interface): o jogo de verdade no Chromium (menu, partidas, ações, celular); - performance (testes/performance): tempos e limites no Node e no navegador. Saídas (relatorios/): - README.md: resumo geral (versão, commit, ambiente, totais, cobertura e destaques de performance); - unidade/, interface/, performance/: README.md com cada teste e o resultado JUnit (XML); - interface/capturas/: capturas de tela tiradas durante os testes de interface; - performance/medidas.json: todas as medidas; - cobertura/README.md e resumo.json: cobertura de linhas, ramos e funções por arquivo e a lista de todas as funções e métodos com quantas vezes foram executados nos testes (Node + navegador). Uso: `npm run relatorios` (todas) ou `node ferramentas/relatorios.js unidade performance`.

| Nome | Tipo | Descrição |
|---|---|---|
| `raiz` | constante | Pasta do projeto. |
| `SUITES` | constante | Suítes de teste: pasta, título e descrição para o relatório. |
| `rodarSuite(nome)` | função | Roda uma suíte com os relatores JSON, JUnit e o resumo no terminal. |
| `gerarCobertura()` | função | Junta a cobertura do Node e do navegador com o c8. |
| `lerMedidas()` | função | ', '--include', 'ferramentas/**', '--exclude', 'src/recursos/**', '--exclude', 'ferramentas/relatorios.js'].map((p) => JSON.stringify(p)).join(' '), { cwd: raiz, stdio: 'inherit' }); return { resumo: JSON.parse(readFileSync(join(temporaria, 'c8', 'coverage-summary.json'), 'utf8')), detalhe: JSON.parse(readFileSync(join(temporaria, 'c8', 'coverage-final.json'), 'utf8')), }; } /** Medidas de performance gravadas pelos testes. |
| `totais(suite)` | função | Totais de uma suíte (só testes, sem as suítes que os agrupam). |
| `escreverSuite(suite, contexto, extra = '')` | função | Relatório de uma suíte: cada arquivo, cada grupo e cada teste. |
| `galeria()` | função | Galeria das capturas de tela dos testes de interface. |
| `escreverPerformance(suite, medidas, contexto)` | função | Relatório de performance: tabela de medidas com limite e situação. |
| `escreverCobertura(cobertura, contexto)` | função | Relatório de cobertura: totais, tabela por arquivo e a lista de funções e métodos com o número de execuções (funções anônimas, como callbacks, aparecem só nos totais). |
| `escreverResumo(suites, cobertura, medidas, contexto)` | função | Resumo geral em relatorios/README.md. |

## `ferramentas/simular.js`

Laboratório de Monte Carlo no terminal: oponentes jogam entre si e as estatísticas são agregadas. Uso: node ferramentas/simular.js [partidas] [oponente1] [oponente2] [baralho] [terreno] Exemplo: node ferramentas/simular.js 300 guloso aleatorio truco oceano

## `ferramentas/versionar.js`

Versionamento do jogo (versionamento semântico MAIOR.MENOR.CORREÇÃO). Roda no GitHub Actions a cada merge (ou push) na main — ver .github/workflows/versao.yml — e também à mão. Atualiza, de uma vez: - package.json e package-lock.json (`version`); - src/versao.js (mostrada na tela "Sobre"); - README.md (a linha entre os marcadores `<!-- versao -->` e `<!-- /versao -->`); - CHANGELOG.md (uma entrada nova no topo, com o título do pull request). Que parte da versão sobe é decidido pelo pull request (ou pela mensagem do commit, sem PR): - rótulo `versao:maior`, ou título com `!:`/"BREAKING" → MAIOR (2.0.0); - rótulo `versao:menor`, ou título começando com `feat`, `nova` ou `novo` → MENOR (1.1.0); - qualquer outro caso → CORREÇÃO (1.0.1). Uso: node ferramentas/versionar.js --tipo auto --titulo "feat: dicas" --rotulos "versao:menor" --pr 12 node ferramentas/versionar.js --tipo correcao node ferramentas/versionar.js --atual (publica a versão atual sem subir; 1ª versão) node ferramentas/versionar.js --simular ... (só mostra a próxima versão, sem gravar) O título e os rótulos também podem vir das variáveis de ambiente TITULO e ROTULOS (mais seguro no CI). A versão final é impressa na última linha da saída.

| Nome | Tipo | Descrição |
|---|---|---|
| `raiz` | constante | Pasta do projeto. `TRUCO_RAIZ` permite rodar sobre uma cópia (usado nos testes). |
| `lerArgumentos(lista)` | função | Lê os argumentos `--chave valor` (e `--chave` sozinho como verdadeiro). |
| `tipoDeMudanca(titulo = '', rotulos = [])` | função (exportada) | Decide que parte da versão sobe. |
| `proximaVersao(versao, tipo)` | função (exportada) | Soma uma versão: '1.4.2' + 'menor' → '1.5.0'. |
| `gravarModuloDeVersao(versao, data)` | função | Grava a versão em src/versao.js. |
| `gravarNoReadme(versao, data)` | função | Troca a linha de versão do README (entre os marcadores). |
| `gravarNoHistorico(versao, data, titulo, pr, repositorio)` | função | Acrescenta a entrada da versão no topo do CHANGELOG.md. |

