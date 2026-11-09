# Relatórios de testes

**Versão 1.1.2** · 09/11/2026, 19:51 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Gerado por `npm run relatorios` (`ferramentas/relatorios.js`).

## Resultado

| Suíte | Testes | Aprovados | Reprovados | Duração | Relatório |
|---|---:|---:|---:|---:|---|
| ✅ Testes de unidade | 169 | 169 | 0 | 38,2 s | [unidade/](unidade/README.md) |
| ✅ Testes de interface | 15 | 15 | 0 | 402,0 s | [interface/](interface/README.md) |
| ✅ Testes de performance | 12 | 12 | 0 | 28,0 s | [performance/](performance/README.md) |

## Cobertura

| Linhas | Instruções | Ramos | Funções (todas) | Funções e métodos com nome |
|---:|---:|---:|---:|---:|
| 99,7% | 99,7% | 93,7% | 100,0% | 437 de 437 |

Detalhe por arquivo e por função em [cobertura/](cobertura/README.md).

## Destaques de performance

| Medida | Valor | Limite |
|---|---:|---:|
| Tempo até o menu (WebGL) | 879 ms | ≤ 15.000 |
| Quadros por segundo na mesa (Canvas) | 59,84 qps | ≥ 20,00 |
| Mãos completas simuladas | 12.091 mãos/s | ≥ 150 |
| Decisão gulosa | 0,21 ms | ≤ 60,00 |
| Simulações por decisão (Monte Carlo) | 1.600 partidas | ≥ 150 |
| Tamanho do arquivo único | 388 KB | ≤ 700 |

Todas as medidas em [performance/](performance/README.md).

## Como rodar

```bash
npm run testar              # unidade
npm run testar:interface    # interface (Chromium)
npm run testar:performance  # performance
npm run relatorios          # tudo + relatórios e cobertura
```
