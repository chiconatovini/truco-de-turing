# Testes de performance

**Versão 1.2.2** · commit `ba4cd88-dirty` (com as mudanças ainda não registradas) · 09/11/2026, 22:25 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Tempos do motor de regras, dos oponentes, das dicas, da arte e do empacotamento no Node; tempo de carregamento, quadros por segundo, memória e tempo de resposta no navegador. Cada medida tem um limite; acima dele, o teste falha.

| Testes | Aprovados | Reprovados | Pulados | Duração |
|---:|---:|---:|---:|---:|
| 12 | 12 | 0 | 0 | 31,9 s |

Resultado em formato JUnit (para ferramentas de CI): [`resultado.junit.xml`](resultado.junit.xml).

## Medidas

| | Grupo | Medida | Valor | Limite | Observação |
|---|---|---|---:|---:|---|
| ✅ | Navegador | Tempo até o menu (WebGL) | 808 ms | ≤ 15.000 |  |
| ✅ | Navegador | Tempo até a mesa pronta (WebGL) | 5.456 ms | ≤ 15.000 |  |
| ✅ | Navegador | Quadros por segundo na mesa (WebGL) | 5,45 qps | ≥ 3,00 | WebGL por software (sem GPU no teste) |
| ✅ | Navegador | Memória JavaScript em uso (WebGL) | 33,47 MB | ≤ 400 |  |
| ✅ | Navegador | Resposta a uma jogada (WebGL) | 36,50 ms | ≤ 300 |  |
| ✅ | Navegador | Tempo até o menu (Canvas) | 313 ms | ≤ 15.000 |  |
| ✅ | Navegador | Tempo até a mesa pronta (Canvas) | 874 ms | ≤ 15.000 |  |
| ✅ | Navegador | Quadros por segundo na mesa (Canvas) | 60,47 qps | ≥ 20,00 | Chromium sem GPU |
| ✅ | Navegador | Memória JavaScript em uso (Canvas) | 22,03 MB | ≤ 400 |  |
| ✅ | Navegador | Resposta a uma jogada (Canvas) | 43,80 ms | ≤ 300 |  |
| ✅ | Node | pontuarRede | 4,96 µs por chamada | ≤ 200 |  |
| ✅ | Node | jogadasLegais | 9,32 µs por chamada | ≤ 300 |  |
| ✅ | Node | Mãos completas simuladas | 9.895 mãos/s | ≥ 150 |  |
| ✅ | Node | copiarMao | 6,58 µs por chamada | ≤ 300 |  |
| ✅ | Node | determinizar | 14,20 µs por chamada | ≤ 600 |  |
| ✅ | Node | Decisão gulosa | 0,33 ms | ≤ 60,00 | p95 0.3 ms |
| ✅ | Node | Simulações por decisão (Monte Carlo) | 1.600 partidas | ≥ 150 |  |
| ✅ | Node | chanceDeVitoria (40 simulações) | 3,72 ms | ≤ 150 |  |
| ✅ | Node | escolherDicaDeJogo | 5,67 µs por chamada | ≤ 500 |  |
| ✅ | Node | Carta completa (densidade 2) | 13,95 ms | ≤ 120 |  |
| ✅ | Node | Carta da mesa (densidade 1,25) | 5,54 ms | ≤ 60,00 |  |
| ✅ | Node | Verso (densidade 2) | 0,32 ms | ≤ 120 |  |
| ✅ | Node | Fundo da mesa 1280×720 | 12,81 ms | ≤ 400 |  |
| ✅ | Node | Empacotamento (esbuild) | 148 ms | ≤ 8.000 |  |
| ✅ | Node | Tamanho do arquivo único | 388 KB | ≤ 700 |  |

Todas as medidas em [`medidas.json`](medidas.json). O Chromium dos testes não tem placa de vídeo: o WebGL é desenhado por software, por isso os quadros por segundo em WebGL ficam muito abaixo do que um aparelho de verdade alcança; a medida em Canvas mostra que a lógica do jogo não é o gargalo.

## `testes/performance/navegador.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | WebGL (padrão) | jogo no navegador | 22,7 s |
| ✅ | Canvas 2D | jogo no navegador | 5,3 s |

## `testes/performance/nucleo-e-arte.test.js`

| | Teste | Grupo | Duração |
|---|---|---|---:|
| ✅ | pontuar uma rede no meio da mão | motor de regras | 33 ms |
| ✅ | listar as jogadas legais | motor de regras | 50 ms |
| ✅ | mãos inteiras por segundo (jogadas aleatórias) | motor de regras | 1,5 s |
| ✅ | copiar e determinizar uma mão | motor de regras | 45 ms |
| ✅ | decisão do Gradiente Guloso | oponentes e dicas | 16 ms |
| ✅ | partidas simuladas pelo Mestre Monte Carlo numa decisão (orçamento de 380 ms) | oponentes e dicas | 134 ms |
| ✅ | chance de vitória com 40 simulações (dica do truco) | oponentes e dicas | 44 ms |
| ✅ | escolher a dica de jogo | oponentes e dicas | 13 ms |
| ✅ | desenhar cartas, versos e a mesa | arte procedural e empacotamento | 434 ms |
| ✅ | tempo de empacotamento e tamanho do arquivo único | arte procedural e empacotamento | 156 ms |

