# Histórico de versões

Cada merge na `main` gera uma versão nova (ver `ferramentas/versionar.js`).

## Em andamento: fusão com o NeuroDeck (Etapa 1)

Entra na próxima versão, quando o pull request da fusão for aceito. Plano e decisões: issues #1 a #11 do fork.

- feat: motor de regras do NeuroDeck em `src/motor/`, cópia fiel do site publicado (SHA-256 de cada arquivo e 1.000 partidas com semente idênticas às do site; ver `src/motor/ORIGEM.md`). (#1)
- fix: regras da fusão no motor: desempate pela carta mais alta compara a força da carta (K vence J); trio de figuras vale 30; a carta empilhada conta na sequência de figuras (decisão do professor; o exemplo 8-K-K-3 com um K tunado continua valendo 41); qualquer early stop libera o passar. O conjunto original segue disponível com `rules: 'nd-2.0.0'`. (#1)
- feat: `src/nucleo` vira uma camada de tradução sobre o motor: as telas do Truco de Turing passam a jogar com as regras do NeuroDeck. Mudam para o jogador: o dropout manda os neurônios para o cemitério; rede sem neurônio livre na camada seguinte é finalizada; transfer learning não gasta a vez; só passa quem teve a rede interrompida por early stop; par de figuras vale 20; os terrenos e o baralho Truco são os do NeuroDeck (truco com 2 baralhos e mão de 10 cartas); os oponentes são os bots do NeuroDeck. O padrão de "quem começa" passa a ser revelar e descartar; revelar e devolver à mão e o sorteio continuam no menu. O modo truco não mudou. (#2)
- test: 40 testes de regra de negócio atualizados para as regras da fusão (10 mudaram de expectativa), testes do motor (`motor-equivalencia`, `motor-regras`, `motor-inicio`), testes da camada de tradução e montagem de situações pelo estado do motor (`testes/apoio/montagem.js`). Planilha de validação refeita para a fusão (`relatorios/validacao/`): 40 testes de regra, 37 do motor e 28 cenários funcionais no jogo unificado, com as decisões de regra; relatórios das três suítes regenerados (255 de unidade, 15 de interface, 12 de performance). (#3)

## Em andamento: fusão com o NeuroDeck (Etapa 2)

- feat: mesa dinâmica: arquiteturas do NeuroDeck (padrão, curta, profunda, larga), de 2 a 5 jogadores com até 4 humanos no mesmo aparelho e de 1 a 3 baralhos; colunas, cartas e placar se ajustam ao tamanho da mesa. Com mais de 2 jogadores o modo truco fica desligado. (#5)
- feat: menu com jogadores, pessoas, arquitetura e baralhos; tela de Mods com a API do NeuroDeck e um mod de exemplo; tela Sobre com o jogo unificado e os autores. (#4)
- feat: barra de ações do NeuroDeck na mesa: tunagem, overfit, early stop, stack overflow, dropout, transfer, passar e limpar; selecionar cartas acende só as ações possíveis e passar o cursor num botão explica o efeito com a regra do NeuroDeck. Ações na própria rede (early stop, stack overflow) pedem o clique no neurônio para confirmar. Selo de tunagem (⚡ e quantas cartas foram empilhadas) e pontos de cada neurônio na cor do dono; cartas da mão maiores e zoom ao passar o cursor nas cartas da mesa. Painéis de leitura: placar por camada (clique no placar), registro completo da mão (clique no registro) e cemitério e limbo (clique na pilha). (#6)
- feat: o Grimório vira a **Biblioteca de conceitos**, com 18 verbetes (entram função de ativação e retropropagação), cada um com equação em MathML, figura em SVG quando ajuda (neurônio, ativações, rede densa, curvas de perda, sobreajuste, dropout, vanishing gradient), como aparece no jogo, até onde a comparação vale e fonte. Textos revistos: as linhas da mesa não são pesos; stack overflow é um erro de programação, não a explosão de gradientes; a curva da mesa sobe, ao contrário da perda; os avisos não supõem mais 2 jogadores. (#7)
- feat: regras com o conteúdo do manual do NeuroDeck em abas (Como jogar, Ações, Pontuação, Baralhos e terrenos com a arte do jogo, Dicas e estratégias) e ajuda das ações: o botão "?" ao lado do TRUCO (e REGRAS > Ajuda das ações) abre um cartão por jogada com a regra do motor, quando o botão acende, o conceito de machine learning e "Ver o conceito", que abre o verbete na Biblioteca. (#7)
- feat: baralhos Nobreza e Backprop do NeuroDeck, com verso próprio (coroa em veludo; grafo de computação em papel de projeto). No Backprop cada neurônio mostra a ativação depois dele e as notas trazem peso, viés e função de ativação. (#8)
- feat: terrenos mais claros e animados: poeira dourada na mesa neutra, neve, nuvens e sol na montanha, neblina, vaga-lumes e bolhas no pântano, ondas, espuma e vento no oceano (parados com "reduzir movimento"). (#8)
- feat: ícone para cada ação (tunagem, overfit, early stop, stack overflow, dropout com o gato do GatoNet, transfer, passar, vanishing gradient) no nome da ação que aparece no centro da mesa e na ajuda das ações; tunagem também ganha o nome no centro. (#8)
- feat: cartas da mão com a face limpa (índices grandes, gema de pontos e medalhão central com um naipe por número da carta), legenda da manilha no Truco e da ativação ou peso no Backprop; a carta completa continua na inspeção. (#8)
- feat: trilhas novas, com temas compostos que se repetem iguais: menu (canção de ninar em Fá, harpa e caixinha de música, começa no primeiro toque na página), Planície (blues mais lento, notas longas e poucos saltos), montanha (trompa macia no lugar do timbre espetado, harpa ao fundo e tambores nos repousos), pântano (no espírito da "Dança da Fada Açucarada", mais lenta, harmônica de vidro, glockenspiel e pizzicato) e oceano (repousos cheios com coro e baixo ligados entre compassos, marimba ao fundo). Os efeitos sonoros não mudaram. (#9)

## 1.2.1 — 2026-11-09

- test: testes de aceitação das regras de negócio em `testes/unidade/regras-de-negocio.test.js`: 40 cenários (RN-01 a RN-40) cobrindo preparação da mesa, quem começa, construção da rede, pontuação, ações com cartas, dropout, transfer learning, passar a vez, desempates, truco e invariantes em 200 mãos aleatórias. Onde o enunciado deixa margem, os testes fixam a leitura adotada no README.
- Planilha de validação em `relatorios/validacao/testes-regras-de-negocio.xlsx`: os 40 testes automatizados, 24 testes funcionais feitos no site publicado, números de robustez de 3.000 mãos aleatórias e os pontos de regra para validar com o professor.

## 1.2.0 — 2026-11-09

- feat: mesa com só REGRAS e MENU à esquerda e botões maiores para o toque

## 1.1.2 — 2026-11-09

- Toque nos botões da mesa em tela cheia no celular

## 1.1.1 — 2026-11-09

- Menu inicial centralizado e alinhado no celular

## 1.1.0 — 2026-11-09

- Nova suíte de testes: unidade, interface e performance, com relatórios e cobertura

## 1.0.0 — 2026-11-08

- Primeira versão numerada. Jogo completo segundo a especificação do tema 4 (FPO 2026/2): mesa 3-5-5-5-5-5-4, tunagem, overfit, early stop, stack overflow, dropout, transfer learning e desempates; 5 baralhos e 4 terrenos; truco até 12 tentos; três oponentes (aleatório, guloso e Monte Carlo); 27 conquistas; Grimório.
- Código modular em português (núcleo de regras, conteúdo, arte, interface e cenas), com manual e referência gerada.
- Modo dicas (estratégia e conceitos, sem revelar cartas viradas), revisão didática da mão, música por terreno e comemoração de vitória.
