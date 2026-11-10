# Relatórios de testes

**Versão 1.2.2** · commit `ba4cd88-dirty` (com as mudanças ainda não registradas) · 09/11/2026, 22:25 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Gerado por `npm run relatorios` (`ferramentas/relatorios.js`).

## Resultado

| Suíte | Testes | Aprovados | Reprovados | Duração | Relatório |
|---|---:|---:|---:|---:|---|
| ✅ Testes de unidade | 210 | 210 | 0 | 45,8 s | [unidade/](unidade/README.md) |
| ✅ Testes de interface | 15 | 15 | 0 | 453,8 s | [interface/](interface/README.md) |
| ✅ Testes de performance | 12 | 12 | 0 | 31,9 s | [performance/](performance/README.md) |

## Cobertura

| Linhas | Instruções | Ramos | Funções (todas) | Funções e métodos com nome |
|---:|---:|---:|---:|---:|
| 99,7% | 99,7% | 93,9% | 100,0% | 438 de 438 |

Detalhe por arquivo e por função em [cobertura/](cobertura/README.md).

## Destaques de performance

| Medida | Valor | Limite |
|---|---:|---:|
| Tempo até o menu (WebGL) | 808 ms | ≤ 15.000 |
| Quadros por segundo na mesa (Canvas) | 60,47 qps | ≥ 20,00 |
| Mãos completas simuladas | 9.895 mãos/s | ≥ 150 |
| Decisão gulosa | 0,33 ms | ≤ 60,00 |
| Simulações por decisão (Monte Carlo) | 1.600 partidas | ≥ 150 |
| Tamanho do arquivo único | 388 KB | ≤ 700 |

Todas as medidas em [performance/](performance/README.md).

## Validação das regras de negócio

Testes de aceitação RN-01 a RN-40 (dentro da suíte de unidade), testes funcionais no site e pontos de regra para validar com o professor: [validacao/](validacao/README.md).

## Como rodar

```bash
npm run testar              # unidade
npm run testar:interface    # interface (Chromium)
npm run testar:performance  # performance
npm run relatorios          # tudo + relatórios e cobertura
```
