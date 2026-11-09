# Relatórios de testes

**Versão 1.1.1** · 09/11/2026, 00:40 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Gerado por `npm run relatorios` (`ferramentas/relatorios.js`).

## Resultado

| Suíte | Testes | Aprovados | Reprovados | Duração | Relatório |
|---|---:|---:|---:|---:|---|
| ✅ Testes de unidade | 169 | 169 | 0 | 41,6 s | [unidade/](unidade/README.md) |
| ✅ Testes de interface | 15 | 15 | 0 | 407,0 s | [interface/](interface/README.md) |
| ✅ Testes de performance | 12 | 12 | 0 | 19,4 s | [performance/](performance/README.md) |

## Cobertura

| Linhas | Instruções | Ramos | Funções (todas) | Funções e métodos com nome |
|---:|---:|---:|---:|---:|
| 99,7% | 99,7% | 93,7% | 100,0% | 431 de 431 |

Detalhe por arquivo e por função em [cobertura/](cobertura/README.md).

## Destaques de performance

| Medida | Valor | Limite |
|---|---:|---:|
| Tempo até o menu (WebGL) | 587 ms | ≤ 15.000 |
| Quadros por segundo na mesa (Canvas) | 59,71 qps | ≥ 20,00 |
| Mãos completas simuladas | 12.601 mãos/s | ≥ 150 |
| Decisão gulosa | 0,37 ms | ≤ 60,00 |
| Simulações por decisão (Monte Carlo) | 1.200 partidas | ≥ 150 |
| Tamanho do arquivo único | 385 KB | ≤ 700 |

Todas as medidas em [performance/](performance/README.md).

## Como rodar

```bash
npm run testar              # unidade
npm run testar:interface    # interface (Chromium)
npm run testar:performance  # performance
npm run relatorios          # tudo + relatórios e cobertura
```
