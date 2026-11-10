# Validação das regras de negócio

Testes das regras da especificação do tema 4 (FPO 2026/2), feitos em 09/11/2026.

## Arquivos

- [`testes-regras-de-negocio.xlsx`](testes-regras-de-negocio.xlsx): planilha com todos os testes e resultados.
  - **Resumo**: totais por bloco e legenda do status.
  - **Testes TDD**: os 40 testes automatizados (RN-01 a RN-40), com cenário, esperado, base da regra e resultado.
  - **Testes funcionais**: os 24 testes feitos no site publicado (F-01 a F-24).
  - **Robustez**: números de 3.000 mãos aleatórias.
  - **Pontos de atenção**: regras ambíguas para validar com o professor.
- [`../../testes/unidade/regras-de-negocio.test.js`](../../testes/unidade/regras-de-negocio.test.js): os testes automatizados. Cada um tem o identificador RN-xx da planilha e um comentário com o cenário e o resultado esperado. Rodam junto com a suíte de unidade (`npm run testar`).

## Resultado

| Bloco | Testes | Passou | Atenção | Falhou |
|---|---:|---:|---:|---:|
| Testes TDD (versão 1.2.0) | 40 | 40 | 0 | 0 |
| Testes funcionais (site, versão 1.1.2) | 24 | 20 | 4 | 0 |

"Atenção" quer dizer que o jogo funciona, mas a regra é ambígua no enunciado ou diverge de outra leitura da turma. Os quatro casos: a regra de passar a vez, o critério de "carta mais alta" no desempate, o padrão de "quem começa" na tela inicial e dois textos do Grimório.

Quando o enunciado deixa margem, os testes fixam a leitura adotada no README do projeto. Se o professor decidir outra leitura, o teste correspondente fica vermelho até o código ser ajustado, e esse é o comportamento desejado.
