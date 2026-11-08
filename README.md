# Truco de Turing

Jogo de cartas para navegador, feito em **Phaser 3**, para ensinar redes neurais e deep learning jogando.
Implementa a proposta do prof. Peng Yaohao (FPO 2026/2, PPCA/UnB, trabalho tema 4), com inspiração no [TensorFlow Playground](https://playground.tensorflow.org/),
em card games de fantasia (moldura, tipo, caixa de regras, texto de ambientação, "poder") e no truco
(naipes espanhóis, manilhas, pedidos de TRUCO/SEIS/NOVE/DOZE e partida até 12 tentos).

## Como rodar

Sem build: sirva a pasta e abra no navegador.

```bash
npm start            # http://localhost:8080  (ou: python3 -m http.server 8080)
```

Arquivo único (CSS e JS embutidos, Phaser via CDN):

```bash
npm run build        # gera dist/truco-de-turing.html
```

Laboratório de Monte Carlo em Node (bots jogando entre si, sem interface):

```bash
node tools/simulate.js 500 guloso aleatorio classico neutro
node tools/simulate.js 60 montecarlo guloso truco oceano
```

## Estrutura

```
index.html                 página e ordem dos scripts
src/style.css              mesa, painéis HTML (menu, regras, grimório, conquistas)
src/core/rules.js          baralhos, terrenos, valores, RNG com semente
src/core/scoring.js        soma da rede: combos de figuras, tunagem, terrenos, fraternidade
src/core/game.js           estado, jogadas legais, aplicação de jogadas, desempates
src/core/bots.js           Zé do Ruído (aleatório), Gradiente Guloso (guloso), Mestre Monte Carlo (determinização + rollouts)
src/core/truco.js          tentos, TRUCO/SEIS/NOVE/DOZE, mão de onze
src/core/content.js        Grimório (conceitos), conquistas, textos das cartas, provocações dos bots
src/ui/cardArt.js          arte procedural das cartas em canvas (nenhuma imagem externa)
src/ui/audio.js            efeitos sonoros sintetizados (WebAudio)
src/ui/overlay.js          painéis HTML sobre o canvas (menu, regras, grimório, conquistas, sobre)
src/ui/icons.js            ícones SVG das conquistas e moldura medieval do retrato
src/assets/professor.js    retrato do professor (JPEG embutido)
src/scenes/BootMenu.js     carregamento de fontes/texturas e fundo animado do menu
src/scenes/GameScene.js    a mesa: tabuleiro, mãos, placar, truco, animações
tools/simulate.js          simulações em massa
tools/build.js             empacota tudo em um HTML
```

O motor (`src/core`) não depende do Phaser: roda no navegador e no Node, o que permite testar regras
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

## O que torna o jogo divertido

- **Truco** por cima da mecânica: cada mão vale 1 tento; peça TRUCO (3), SEIS, NOVE, DOZE; correr entrega o valor atual; partida até 12; mão de onze.
- **Tensão de corrida**: chegar à saída torna a rede imune; tunar aumenta a soma, mas deixa o neurônio a uma carta do early stop.
- **Três oponentes, um por nível**:
  - *Zé do Ruído* (fácil): sorteia qualquer jogada válida; bom para aprender as regras.
  - *Gradiente Guloso* (médio): como a descida de gradiente, escolhe o lance que mais melhora o placar agora, olhando um turno à frente pelo valor esperado.
  - *Mestre Monte Carlo* (difícil): sorteia as cartas ocultas, simula centenas de partidas e escolhe o lance que mais venceu; mostra a própria chance de vitória e truca com base nas simulações.
- **5 baralhos e 4 terrenos** da seção de extensões (Truco com manilhas, Fraternidade, Yin-yang, Power BI; Montanha, Pântano, Oceano).
- **27 conquistas** em graduações de bronze a antimatéria, incluindo as do enunciado (Desk rejection, Marcha dos patos, Contra tudo e contra todos, Artilheiro dos gols inúteis, 100 dropouts…).
- **Feedback visual**: conexões com espessura proporcional ao valor (como no Playground), curva de treino, explosões, banners e sons.

## Conteúdo educativo

Cada mecânica corresponde a um verbete do **Grimório**, que aparece como aviso na primeira vez em que acontece:
neurônio, camadas, propagação direta, pesos, curva de treino, fine-tuning, overfitting, dropout, early stopping,
explosão de gradientes, vanishing gradient, transfer learning, ruído, Monte Carlo, mudança de distribuição
(terrenos como weight decay e concept drift) e decisão sob incerteza (truco).

## Ideias de extensão

Mais de 2 jogadores e múltiplos baralhos (o motor já itera sobre `players`), coringas com efeitos,
modo online (o estado é serializável), tutorial guiado e um laboratório de simulação na interface.

## Licença

Distribuído sob a [GPL-3.0](https://github.com/welyngton/truco-de-turing#GPL-3.0-1-ov-file). Código-fonte: https://github.com/welyngton/truco-de-turing

Autores: Welyngton José Vinicius Dal Prá

Regras originais: Peng Yaohao - FPO-UNB - 2026-2
