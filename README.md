# Truco de Turing

<!-- versao -->
**Versão 1.1.0** (2026-11-09) · [histórico de versões](CHANGELOG.md)
<!-- /versao -->

Jogo de cartas para navegador, feito em **Phaser 3**, para ensinar redes neurais e deep learning jogando.
Implementa a proposta do prof. Peng Yaohao (FPO 2026/2, PPCA/UnB, trabalho tema 4),
em card games de fantasia (moldura, tipo, caixa de regras, texto de ambientação, "poder") e no truco
(naipes espanhóis, manilhas, pedidos de TRUCO/SEIS/NOVE/DOZE e partida até 12 tentos).

## Como rodar

O código usa módulos ES; sirva a pasta por http e abra no navegador.

```bash
npm install          # esbuild (empacotador)
npm start            # http://localhost:8080  (ou: python3 -m http.server 8080)
```

Arquivo único (CSS e JS embutidos, Phaser via CDN), que abre até com duplo clique:

```bash
npm run build        # gera dist/truco-de-turing.html
```

Laboratório de Monte Carlo em Node (oponentes jogando entre si, sem interface):

```bash
node ferramentas/simular.js 500 guloso aleatorio classico neutro
node ferramentas/simular.js 60 montecarlo guloso truco oceano
```

## Documentação

- [**Manual do código**](docs/MANUAL.md): arquitetura, convenções, fluxo de uma jogada, como rodar,
  publicar e estender (novo baralho, terreno, oponente, conquista ou verbete).
- [**Referência**](docs/REFERENCIA.md): todos os módulos e funções, gerada dos comentários com `npm run docs`.

## Testes

Três suítes com o executor nativo do Node: **unidade** (regras, conteúdo, arte, telas, som e
ferramentas), **interface** (o jogo inteiro no Chromium, inclusive no celular) e **performance**
(tempos com limites). Os relatórios ficam em [`relatorios/`](relatorios/README.md): resultado de
cada teste, cobertura por arquivo e por função (Node + navegador), medidas de performance e
capturas de tela.

```bash
npm run testar              # unidade
npm run testar:interface    # interface (Chromium)
npm run testar:performance  # performance
npm run relatorios          # tudo + relatórios
```

No GitHub, cada pull request e cada push na main rodam as três suítes e publicam os relatórios
como artefato.

## Versões

Cada merge na `main` gera uma versão nova, automaticamente (GitHub Actions, `.github/workflows/versao.yml`):
o número sobe, a tela **Sobre** e este README passam a mostrá-lo, o [histórico](CHANGELOG.md) ganha uma
entrada com o título do pull request, e uma tag `vX.Y.Z` e uma release são publicadas.

| Pull request | Versão |
|---|---|
| comum (correção, ajuste) | 1.0.0 → 1.0.1 |
| título começando com `feat`, `nova` ou `novo`, ou rótulo `versao:menor` | 1.0.0 → 1.1.0 |
| título com `!:` ou "BREAKING", ou rótulo `versao:maior` | 1.0.0 → 2.0.0 |

Em cada pull request, o resumo da verificação mostra qual versão ele vai gerar.

## Estrutura

Todo o código está em português do Brasil, em camadas que só dependem das de baixo:

```
index.html                 página de desenvolvimento
src/principal.js           ponto de entrada: cria o Phaser.Game
src/aplicacao.js           opções, progresso, conquistas e navegação menu ⇄ mesa
src/configuracao.js        mundo 1280x720, cores, fontes, resolução
src/estilo.css             painéis HTML (menu, regras, grimório, conquistas, sobre)
src/nucleo/                regras puras (sem Phaser): cartas, baralhos, terrenos, rede,
                           pontuação, partida, truco e oponentes
src/conteudo/              Grimório, conquistas, textos e progresso salvo
src/arte/                  arte procedural em canvas: cartas, versos, mesas, avatares, ícones
src/interface/             menu, telas HTML, avisos e som (WebAudio)
src/cenas/                 cenas do Phaser: carregamento, menu e mesa
src/cenas/mesa/            a mesa dividida por assunto: cenário, desenho, entrada,
                           turnos, truco, efeitos e resultado
ferramentas/               empacotar, simular, documentar, versionar e gerar relatórios
testes/                    unidade, interface (Chromium) e performance
relatorios/                relatórios de testes, cobertura e performance
.github/workflows/         versão automática a cada merge na main
docs/                      manual e referência
```

O núcleo (`src/nucleo`) não depende do Phaser: roda no navegador e no Node, o que permite testar regras
e balanceamento com milhares de partidas.

## Regras implementadas

Seguem a especificação do enunciado: mesa 3-5-5-5-5-5-4, 5 cartas na mão, 10 no limbo; uma carta por camada
da entrada à saída; Ás 11, figuras 0; par de figuras iguais adjacentes +10, trio +20, quadra zera a rede;
tunagem, overfit, early stop, stack overflow, dropout (GatoNet, não consome o turno), transfer learning
(uma vez por mão); entrada e saída imunes; desempates na ordem do enunciado; as três opções de "quem começa".

Pontos em que o enunciado deixa margem e a leitura adotada:

| Ponto | Leitura adotada |
|---|---|
| Exemplo 8-K-K-3 com tunagem = 41 | Cartas de figura empilhadas contam para o combo: K(2)+K(1) = trio (20) + tunagem (10) → 8+20+10+3 = 41. Quatro figuras iguais seguidas, contando empilhadas, causam vanishing gradient. |
| Efeito de empilhar | Decidido pelo tamanho final da pilha: 2 = tunagem (própria) ou overfit (adversário); 3 = early stop; 4 = stack overflow. Vale também na própria rede (auto-early-stop, auto-stack-overflow). |
| Dropout | Desvira os últimos neurônios ocultos (voltam à mesa sem dono, marcados como "lembra: X"); cartas de tunagem empilhadas vão ao cemitério. |
| Transfer learning | Consome o turno. |
| Passar a vez | Só quando não há neurônio livre para ativar (rede finalizada ou travada). |
| Fim da mão | Todas as redes finalizadas, ou todos passam em sequência. Redes travadas contam a soma parcial. |
| Terrenos | Valem até a rede ser finalizada; a soma congela no early stop, stack overflow ou chegada à saída. |

## Proposta geral de mecânicas para gerar engajamento

- **Truco** por cima da mecânica: cada mão vale 1 tento; peça TRUCO (3), SEIS, NOVE, DOZE; correr entrega o valor atual; partida até 12; mão de onze.
- **Tensão de corrida**: chegar à saída torna a rede imune; tunar aumenta a soma, mas deixa o neurônio a uma carta do early stop.
- **Três oponentes, um por nível**:
  - *Zé do Ruído* (fácil): sorteia qualquer jogada válida; bom para aprender as regras.
  - *Gradiente Guloso* (médio): como a descida de gradiente, escolhe o lance que mais melhora o placar agora, olhando um turno à frente pelo valor esperado.
  - *Mestre Monte Carlo* (difícil): sorteia as cartas ocultas, simula centenas de partidas e escolhe o lance que mais venceu; mostra a própria chance de vitória e truca com base nas simulações.
- **5 baralhos e 4 terrenos** da seção de extensões (Truco com manilhas, Fraternidade, Yin-yang, Power BI; Montanha, Pântano, Oceano).
- **27 conquistas** em graduações de bronze a antimatéria, incluindo as do enunciado (Desk rejection, Marcha dos patos, Contra tudo e contra todos, Artilheiro dos gols inúteis, 100 dropouts…).
- **Modo dicas**: dicas de estratégia a cada vez, sempre com o conceito de redes neurais por trás, e explicações nos botões (mouse ou segurar no celular); só usam o que está à vista e nunca dizem qual carta virada escolher. Mãos com dicas não valem conquistas.
- **Revisão da mão**: curva de treino passo a passo, momentos-chave e linha do tempo comentada com os conceitos do Grimório.
- **Música por terreno** (ligada por padrão): blues na mesa neutra, valsa no oceano, épica na montanha e gótica no pântano; fanfarra e confete na vitória.
- **Feedback visual**: conexões com espessura proporcional ao valor (como no Playground), curva de treino, explosões, banners, músicas e sons.

## Conteúdo educativo

Cada mecânica corresponde a um verbete do **Grimório**, que aparece como aviso na primeira vez em que acontece:
neurônio, camadas, propagação direta, pesos, curva de treino, fine-tuning, overfitting, dropout, early stopping,
explosão de gradientes, vanishing gradient, transfer learning, ruído, Monte Carlo, mudança de distribuição
(terrenos como weight decay e concept drift) e decisão sob incerteza (truco).

## Ideias de extensão

Mais de 2 jogadores e múltiplos baralhos (o motor já itera sobre `jogadores`), coringas com efeitos,
modo online (o estado é serializável), tutorial guiado e um laboratório de simulação na interface.

## Licença

Distribuído sob a [GPL-3.0](https://github.com/welyngton/truco-de-turing#GPL-3.0-1-ov-file). Código-fonte: https://github.com/welyngton/truco-de-turing

Autores:
Welyngton Jose Vinicius Dal Pra
...

Regras originais: Peng Yaohao - FPO-UNB - 2026-2
