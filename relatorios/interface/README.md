# Testes de interface

**Versão 1.0.0** · commit `8d44a5d-dirty` (com as mudanças ainda não registradas) · 08/11/2026, 22:51 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

O jogo inteiro rodando no Chromium (Playwright): menu e telas, mãos completas contra os três oponentes e entre duas pessoas, cada ação da mesa, truco, modo dicas (mouse e toque), som, música, comemorações e celular (vertical e horizontal).

| Testes | Aprovados | Reprovados | Pulados | Duração |
|---:|---:|---:|---:|---:|
| 14 | 14 | 0 | 0 | 397,9 s |

Resultado em formato JUnit (para ferramentas de CI): [`resultado.junit.xml`](resultado.junit.xml).

## Capturas de tela

Tiradas pelo próprio teste, no momento indicado pelo nome.

<a href="capturas/01-menu.jpg"><img src="capturas/01-menu.jpg" width="300" alt="01-menu"></a>
<a href="capturas/02-conquistas.jpg"><img src="capturas/02-conquistas.jpg" width="300" alt="02-conquistas"></a>
<a href="capturas/03-celular-vertical.jpg"><img src="capturas/03-celular-vertical.jpg" width="300" alt="03-celular-vertical"></a>
<a href="capturas/04-celular-horizontal.jpg"><img src="capturas/04-celular-horizontal.jpg" width="300" alt="04-celular-horizontal"></a>
<a href="capturas/05-mesa-inicio.jpg"><img src="capturas/05-mesa-inicio.jpg" width="300" alt="05-mesa-inicio"></a>
<a href="capturas/06-aleatorio-resultado.jpg"><img src="capturas/06-aleatorio-resultado.jpg" width="300" alt="06-aleatorio-resultado"></a>
<a href="capturas/06-aleatorio-revisao.jpg"><img src="capturas/06-aleatorio-revisao.jpg" width="300" alt="06-aleatorio-revisao"></a>
<a href="capturas/08-guloso-resultado.jpg"><img src="capturas/08-guloso-resultado.jpg" width="300" alt="08-guloso-resultado"></a>
<a href="capturas/08-guloso-revisao.jpg"><img src="capturas/08-guloso-revisao.jpg" width="300" alt="08-guloso-revisao"></a>
<a href="capturas/10-montecarlo-resultado.jpg"><img src="capturas/10-montecarlo-resultado.jpg" width="300" alt="10-montecarlo-resultado"></a>
<a href="capturas/10-montecarlo-revisao.jpg"><img src="capturas/10-montecarlo-revisao.jpg" width="300" alt="10-montecarlo-revisao"></a>
<a href="capturas/12-dois-humanos-resultado.jpg"><img src="capturas/12-dois-humanos-resultado.jpg" width="300" alt="12-dois-humanos-resultado"></a>
<a href="capturas/13-tunagem.jpg"><img src="capturas/13-tunagem.jpg" width="300" alt="13-tunagem"></a>
<a href="capturas/14-stack-overflow.jpg"><img src="capturas/14-stack-overflow.jpg" width="300" alt="14-stack-overflow"></a>
<a href="capturas/15-dropout.jpg"><img src="capturas/15-dropout.jpg" width="300" alt="15-dropout"></a>
<a href="capturas/16-truco.jpg"><img src="capturas/16-truco.jpg" width="300" alt="16-truco"></a>
<a href="capturas/17-dica-de-jogo.jpg"><img src="capturas/17-dica-de-jogo.jpg" width="300" alt="17-dica-de-jogo"></a>
<a href="capturas/18-dica-do-botao.jpg"><img src="capturas/18-dica-do-botao.jpg" width="300" alt="18-dica-do-botao"></a>
<a href="capturas/19-vitoria.jpg"><img src="capturas/19-vitoria.jpg" width="300" alt="19-vitoria"></a>

## `testes/interface/acoes.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | inspeção, seleção, Esc, tunagem, overfit, stack overflow e early stop na própria rede | ações da mesa | 64,7 s |
| ✅ | dropout (escolher camadas e pagar), cancelar, transfer learning, passar a vez e vanishing gradient | ações da mesa | 47,8 s |
| ✅ | truco: pedir, responder (aumentar, aceitar, correr) e a mão terminada por corrida | ações da mesa | 47,3 s |
| ✅ | dicas: aviso de conquistas, dica de jogo a cada vez, dicas dos botões com o mouse e desligar | ações da mesa | 29,0 s |
| ✅ | celular: segurar um botão mostra a dica sem executar a ação; toque rápido executa | ações da mesa | 17,4 s |
| ✅ | som, música, comemorações, derrota e voltar ao menu | ações da mesa | 33,7 s |

## `testes/interface/menu-e-telas.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | carrega, mostra o menu com as escolhas e abre Como jogar, Grimório, Conquistas e Sobre | menu e telas | 19,6 s |
| ✅ | celular na vertical: só o aviso para girar; ao girar, o jogo é criado e o menu aparece | menu e telas | 28,9 s |
| ✅ | renderizador Canvas e resolução forçados pela URL | menu e telas | 2,2 s |

## `testes/interface/partidas.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | Zé do Ruído · clássico · neutro · revela e volta | mãos completas contra o computador | 137,4 s |
| ✅ | Gradiente Guloso · truco · montanha · revela e descarta | mãos completas contra o computador | 81,2 s |
| ✅ | Mestre Monte Carlo · fraternidade · pântano · sorteio | mãos completas contra o computador | 67,0 s |
| ✅ | duas pessoas no mesmo aparelho (yin-yang, oceano): o aparelho troca de mãos entre as vezes | duas pessoas e mão única | 31,6 s |
| ✅ | mão única sem truco (Power BI): "Nova partida" recomeça o placar | duas pessoas e mão única | 28,2 s |

