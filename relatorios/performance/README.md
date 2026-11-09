# Testes de performance

**Versão 1.0.0** · commit `8d44a5d-dirty` (com as mudanças ainda não registradas) · 08/11/2026, 22:51 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Tempos do motor de regras, dos oponentes, das dicas, da arte e do empacotamento no Node; tempo de carregamento, quadros por segundo, memória e tempo de resposta no navegador. Cada medida tem um limite; acima dele, o teste falha.

| Testes | Aprovados | Reprovados | Pulados | Duração |
|---:|---:|---:|---:|---:|
| 12 | 12 | 0 | 0 | 20,5 s |

Resultado em formato JUnit (para ferramentas de CI): [`resultado.junit.xml`](resultado.junit.xml).

## Medidas

| | Grupo | Medida | Valor | Limite | Observação |
|---|---|---|---:|---:|---|
| ✅ | Navegador | Tempo até o menu (WebGL) | 790 ms | ≤ 15.000 |  |
| ✅ | Navegador | Tempo até a mesa pronta (WebGL) | 5.211 ms | ≤ 15.000 |  |
| ✅ | Navegador | Quadros por segundo na mesa (WebGL) | 5,63 qps | ≥ 3,00 | WebGL por software (sem GPU no teste) |
| ✅ | Navegador | Memória JavaScript em uso (WebGL) | 35,57 MB | ≤ 400 |  |
| ✅ | Navegador | Resposta a uma jogada (WebGL) | 29,70 ms | ≤ 300 |  |
| ✅ | Navegador | Tempo até o menu (Canvas) | 269 ms | ≤ 15.000 |  |
| ✅ | Navegador | Tempo até a mesa pronta (Canvas) | 811 ms | ≤ 15.000 |  |
| ✅ | Navegador | Quadros por segundo na mesa (Canvas) | 59,68 qps | ≥ 20,00 | Chromium sem GPU |
| ✅ | Navegador | Memória JavaScript em uso (Canvas) | 23,37 MB | ≤ 400 |  |
| ✅ | Navegador | Resposta a uma jogada (Canvas) | 28,90 ms | ≤ 300 |  |
| ✅ | Node | pontuarRede | 3,47 µs por chamada | ≤ 200 |  |
| ✅ | Node | jogadasLegais | 6,74 µs por chamada | ≤ 300 |  |
| ✅ | Node | Mãos completas simuladas | 11.823 mãos/s | ≥ 150 |  |
| ✅ | Node | copiarMao | 6,06 µs por chamada | ≤ 300 |  |
| ✅ | Node | determinizar | 11,31 µs por chamada | ≤ 600 |  |
| ✅ | Node | Decisão gulosa | 0,47 ms | ≤ 60,00 | p95 1.5 ms |
| ✅ | Node | Simulações por decisão (Monte Carlo) | 1.200 partidas | ≥ 150 |  |
| ✅ | Node | chanceDeVitoria (40 simulações) | 4,38 ms | ≤ 150 |  |
| ✅ | Node | escolherDicaDeJogo | 7,62 µs por chamada | ≤ 500 |  |
| ✅ | Node | Carta completa (densidade 2) | 16,13 ms | ≤ 120 |  |
| ✅ | Node | Carta da mesa (densidade 1,25) | 5,40 ms | ≤ 60,00 |  |
| ✅ | Node | Verso (densidade 2) | 0,34 ms | ≤ 120 |  |
| ✅ | Node | Fundo da mesa 1280×720 | 11,13 ms | ≤ 400 |  |
| ✅ | Node | Empacotamento (esbuild) | 144 ms | ≤ 8.000 |  |
| ✅ | Node | Tamanho do arquivo único | 383 KB | ≤ 700 |  |

Todas as medidas em [`medidas.json`](medidas.json). O Chromium dos testes não tem placa de vídeo: o WebGL é desenhado por software, por isso os quadros por segundo em WebGL ficam muito abaixo do que um aparelho de verdade alcança; a medida em Canvas mostra que a lógica do jogo não é o gargalo.

## `testes/performance/navegador.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | WebGL (padrão) | jogo no navegador | 11,6 s |
| ✅ | Canvas 2D | jogo no navegador | 5,1 s |

## `testes/performance/nucleo-e-arte.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | pontuar uma rede no meio da mão | motor de regras | 23 ms |
| ✅ | listar as jogadas legais | motor de regras | 37 ms |
| ✅ | mãos inteiras por segundo (jogadas aleatórias) | motor de regras | 1,5 s |
| ✅ | copiar e determinizar uma mão | motor de regras | 38 ms |
| ✅ | decisão do Gradiente Guloso | oponentes e dicas | 22 ms |
| ✅ | partidas simuladas pelo Mestre Monte Carlo numa decisão (orçamento de 380 ms) | oponentes e dicas | 148 ms |
| ✅ | chance de vitória com 40 simulações (dica do truco) | oponentes e dicas | 51 ms |
| ✅ | escolher a dica de jogo | oponentes e dicas | 18 ms |
| ✅ | desenhar cartas, versos e a mesa | arte procedural e empacotamento | 457 ms |
| ✅ | tempo de empacotamento e tamanho do arquivo único | arte procedural e empacotamento | 153 ms |

