# Histórico de versões

Cada merge na `main` gera uma versão nova (ver `ferramentas/versionar.js`).

## 1.3.0 — 2026-11-10

- feat: verbetes completos de Ação no Grimório, com fórmulas (#23) ([#36](https://github.com/welyngton/truco-de-turing/pull/36), por [@welyngton](https://github.com/welyngton) e [@SuzyArcanjo](https://github.com/SuzyArcanjo))

## 1.2.4 — 2026-11-09

- Autores no README: Diego Casagrande e inclusão automática nos próximos pull requests

## 1.2.3 — 2026-11-09

- Revisão pós-merge do PR #1: changelog, datas da versão e relatórios

## 1.2.2 — 2026-11-09

- test: testes de aceitação das regras de negócio em `testes/unidade/regras-de-negocio.test.js`: 40 cenários (RN-01 a RN-40) cobrindo preparação da mesa, quem começa, construção da rede, pontuação, ações com cartas, dropout, transfer learning, passar a vez, desempates, truco e invariantes em 200 mãos aleatórias. Onde o enunciado deixa margem, os testes fixam a leitura adotada no README. ([#1](https://github.com/welyngton/truco-de-turing/pull/1), por [@diegocasagrande](https://github.com/diegocasagrande))
- Planilha de validação em `relatorios/validacao/testes-regras-de-negocio.xlsx`: os 40 testes automatizados, 24 testes funcionais feitos no site publicado, números de robustez de 3.000 mãos aleatórias e os pontos de regra para validar com o professor.

## 1.2.1 — 2026-11-09

- Título da tela inicial: só "TRUCO DE TURING", letras do mesmo tamanho

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
