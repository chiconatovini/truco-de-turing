# Testes de performance

**Versão 1.2.0** · commit `f718683-dirty` (com as mudanças ainda não registradas) · 10/11/2026, 13:23 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Tempos do motor de regras, dos oponentes, das dicas, da arte e do empacotamento no Node; tempo de carregamento, quadros por segundo, memória e tempo de resposta no navegador. Cada medida tem um limite; acima dele, o teste falha.

| Testes | Aprovados | Reprovados | Pulados | Duração |
|---:|---:|---:|---:|---:|
| 12 | 12 | 0 | 0 | 22,3 s |

Resultado em formato JUnit (para ferramentas de CI): [`resultado.junit.xml`](resultado.junit.xml).

## Medidas

| | Grupo | Medida | Valor | Limite | Observação |
|---|---|---|---:|---:|---|
| ✅ | Navegador | Tempo até o menu (WebGL) | 917 ms | ≤ 15.000 |  |
| ✅ | Navegador | Tempo até a mesa pronta (WebGL) | 5.307 ms | ≤ 15.000 |  |
| ✅ | Navegador | Quadros por segundo na mesa (WebGL) | 6,20 qps | ≥ 3,00 | WebGL por software (sem GPU no teste) |
| ✅ | Navegador | Memória JavaScript em uso (WebGL) | 31,22 MB | ≤ 400 |  |
| ✅ | Navegador | Resposta a uma jogada (WebGL) | 32,10 ms | ≤ 300 |  |
| ✅ | Navegador | Tempo até o menu (Canvas) | 382 ms | ≤ 15.000 |  |
| ✅ | Navegador | Tempo até a mesa pronta (Canvas) | 985 ms | ≤ 15.000 |  |
| ✅ | Navegador | Quadros por segundo na mesa (Canvas) | 59,52 qps | ≥ 20,00 | Chromium sem GPU |
| ✅ | Navegador | Memória JavaScript em uso (Canvas) | 20,71 MB | ≤ 400 |  |
| ✅ | Navegador | Resposta a uma jogada (Canvas) | 39,80 ms | ≤ 300 |  |
| ✅ | Node | pontuarRede | 8,83 µs por chamada | ≤ 200 |  |
| ✅ | Node | jogadasLegais | 7,87 µs por chamada | ≤ 300 |  |
| ✅ | Node | Mãos completas simuladas | 1.990 mãos/s | ≥ 150 |  |
| ✅ | Node | copiarMao | 49,63 µs por chamada | ≤ 300 |  |
| ✅ | Node | determinizar | 54,44 µs por chamada | ≤ 600 |  |
| ✅ | Node | Decisão gulosa | 0,09 ms | ≤ 60,00 | p95 0.2 ms |
| ✅ | Node | Simulações por decisão (Monte Carlo) | 280 partidas | ≥ 80,00 |  |
| ✅ | Node | Decisão do Monte Carlo | 65,48 ms | ≤ 1.500 | p95 96.8 ms |
| ✅ | Node | chanceDeVitoria (40 simulações) | 6,61 ms | ≤ 150 |  |
| ✅ | Node | escolherDicaDeJogo | 9,10 µs por chamada | ≤ 500 |  |
| ✅ | Node | Carta completa (densidade 2) | 10,83 ms | ≤ 120 |  |
| ✅ | Node | Carta da mesa (densidade 1,25) | 4,72 ms | ≤ 60,00 |  |
| ✅ | Node | Verso (densidade 2) | 0,26 ms | ≤ 120 |  |
| ✅ | Node | Fundo da mesa 1280×720 | 10,36 ms | ≤ 400 |  |
| ✅ | Node | Empacotamento (esbuild) | 155 ms | ≤ 8.000 |  |
| ✅ | Node | Tamanho do arquivo único | 432 KB | ≤ 700 |  |

Todas as medidas em [`medidas.json`](medidas.json). O Chromium dos testes não tem placa de vídeo: o WebGL é desenhado por software, por isso os quadros por segundo em WebGL ficam muito abaixo do que um aparelho de verdade alcança; a medida em Canvas mostra que a lógica do jogo não é o gargalo.

## `testes/performance/navegador.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | WebGL (padrão) | jogo no navegador | 12,1 s |
| ✅ | Canvas 2D | jogo no navegador | 5,8 s |

## `testes/performance/nucleo-e-arte.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | pontuar uma rede no meio da mão | motor de regras | 59 ms |
| ✅ | listar as jogadas legais | motor de regras | 50 ms |
| ✅ | mãos inteiras por segundo (jogadas aleatórias) | motor de regras | 1,5 s |
| ✅ | copiar e determinizar uma mão | motor de regras | 212 ms |
| ✅ | decisão do Gradiente Guloso | oponentes e dicas | 6 ms |
| ✅ | decisão do Mestre Monte Carlo (40 partidas simuladas por jogada) | oponentes e dicas | 535 ms |
| ✅ | chance de vitória com 40 simulações (dica do truco) | oponentes e dicas | 81 ms |
| ✅ | escolher a dica de jogo | oponentes e dicas | 22 ms |
| ✅ | desenhar cartas, versos e a mesa | arte procedural e empacotamento | 347 ms |
| ✅ | tempo de empacotamento e tamanho do arquivo único | arte procedural e empacotamento | 172 ms |

