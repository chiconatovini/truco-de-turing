# Testes de performance

**Versão 1.2.0** · commit `68acb37-dirty` (com as mudanças ainda não registradas) · 10/11/2026, 20:53 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Tempos do motor de regras, dos oponentes, das dicas, da arte e do empacotamento no Node; tempo de carregamento, quadros por segundo, memória e tempo de resposta no navegador. Cada medida tem um limite; acima dele, o teste falha.

| Testes | Aprovados | Reprovados | Pulados | Duração |
|---:|---:|---:|---:|---:|
| 12 | 12 | 0 | 0 | 22,8 s |

Resultado em formato JUnit (para ferramentas de CI): [`resultado.junit.xml`](resultado.junit.xml).

## Medidas

| | Grupo | Medida | Valor | Limite | Observação |
|---|---|---|---:|---:|---|
| ✅ | Navegador | Tempo até o menu (WebGL) | 516 ms | ≤ 15.000 |  |
| ✅ | Navegador | Tempo até a mesa pronta (WebGL) | 5.486 ms | ≤ 15.000 |  |
| ✅ | Navegador | Quadros por segundo na mesa (WebGL) | 5,62 qps | ≥ 3,00 | WebGL por software (sem GPU no teste) |
| ✅ | Navegador | Memória JavaScript em uso (WebGL) | 35,74 MB | ≤ 400 |  |
| ✅ | Navegador | Resposta a uma jogada (WebGL) | 45,70 ms | ≤ 300 |  |
| ✅ | Navegador | Tempo até o menu (Canvas) | 298 ms | ≤ 15.000 |  |
| ✅ | Navegador | Tempo até a mesa pronta (Canvas) | 759 ms | ≤ 15.000 |  |
| ✅ | Navegador | Quadros por segundo na mesa (Canvas) | 60,31 qps | ≥ 20,00 | Chromium sem GPU |
| ✅ | Navegador | Memória JavaScript em uso (Canvas) | 22,55 MB | ≤ 400 |  |
| ✅ | Navegador | Resposta a uma jogada (Canvas) | 49,40 ms | ≤ 300 |  |
| ✅ | Node | pontuarRede | 7,60 µs por chamada | ≤ 200 |  |
| ✅ | Node | jogadasLegais | 14,53 µs por chamada | ≤ 300 |  |
| ✅ | Node | Mãos completas simuladas | 1.255 mãos/s | ≥ 150 |  |
| ✅ | Node | copiarMao | 57,67 µs por chamada | ≤ 300 |  |
| ✅ | Node | determinizar | 65,28 µs por chamada | ≤ 600 |  |
| ✅ | Node | Decisão gulosa | 0,04 ms | ≤ 60,00 | p95 0.1 ms |
| ✅ | Node | Simulações por decisão (Monte Carlo) | 280 partidas | ≥ 80,00 |  |
| ✅ | Node | Decisão do Monte Carlo | 95,63 ms | ≤ 1.500 | p95 107.6 ms |
| ✅ | Node | chanceDeVitoria (40 simulações) | 16,33 ms | ≤ 150 |  |
| ✅ | Node | escolherDicaDeJogo | 10,09 µs por chamada | ≤ 500 |  |
| ✅ | Node | Carta completa (densidade 2) | 14,27 ms | ≤ 120 |  |
| ✅ | Node | Carta da mesa (densidade 1,25) | 8,70 ms | ≤ 60,00 |  |
| ✅ | Node | Verso (densidade 2) | 0,33 ms | ≤ 120 |  |
| ✅ | Node | Fundo da mesa 1280×720 | 14,36 ms | ≤ 400 |  |
| ✅ | Node | Empacotamento (esbuild) | 179 ms | ≤ 8.000 |  |
| ✅ | Node | Tamanho do arquivo único | 562 KB | ≤ 700 |  |

Todas as medidas em [`medidas.json`](medidas.json). O Chromium dos testes não tem placa de vídeo: o WebGL é desenhado por software, por isso os quadros por segundo em WebGL ficam muito abaixo do que um aparelho de verdade alcança; a medida em Canvas mostra que a lógica do jogo não é o gargalo.

## `testes/performance/navegador.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | WebGL (padrão) | jogo no navegador | 12,3 s |
| ✅ | Canvas 2D | jogo no navegador | 5,6 s |

## `testes/performance/nucleo-e-arte.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | pontuar uma rede no meio da mão | motor de regras | 55 ms |
| ✅ | listar as jogadas legais | motor de regras | 77 ms |
| ✅ | mãos inteiras por segundo (jogadas aleatórias) | motor de regras | 1,5 s |
| ✅ | copiar e determinizar uma mão | motor de regras | 250 ms |
| ✅ | decisão do Gradiente Guloso | oponentes e dicas | 9 ms |
| ✅ | decisão do Mestre Monte Carlo (40 partidas simuladas por jogada) | oponentes e dicas | 681 ms |
| ✅ | chance de vitória com 40 simulações (dica do truco) | oponentes e dicas | 187 ms |
| ✅ | escolher a dica de jogo | oponentes e dicas | 24 ms |
| ✅ | desenhar cartas, versos e a mesa | arte procedural e empacotamento | 492 ms |
| ✅ | tempo de empacotamento e tamanho do arquivo único | arte procedural e empacotamento | 203 ms |

