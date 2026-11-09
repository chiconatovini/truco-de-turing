# Relatórios de testes

**Versão 1.0.0** · commit `8d44a5d-dirty` (com as mudanças ainda não registradas) · 08/11/2026, 22:51 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Gerado por `npm run relatorios` (`ferramentas/relatorios.js`).

## Resultado

| Suíte | Testes | Aprovados | Reprovados | Duração | Relatório |
|---|---:|---:|---:|---:|---|
| ✅ Testes de unidade | 169 | 169 | 0 | 38,6 s | [unidade/](unidade/README.md) |
| ✅ Testes de interface | 14 | 14 | 0 | 397,9 s | [interface/](interface/README.md) |
| ✅ Testes de performance | 12 | 12 | 0 | 20,5 s | [performance/](performance/README.md) |

## Cobertura

| Linhas | Instruções | Ramos | Funções (todas) | Funções e métodos com nome |
|---:|---:|---:|---:|---:|
| 99,7% | 99,7% | 93,6% | 100,0% | 430 de 430 |

Detalhe por arquivo e por função em [cobertura/](cobertura/README.md).

## Destaques de performance

| Medida | Valor | Limite |
|---|---:|---:|
| Tempo até o menu (WebGL) | 790 ms | ≤ 15.000 |
| Quadros por segundo na mesa (Canvas) | 59,68 qps | ≥ 20,00 |
| Mãos completas simuladas | 11.823 mãos/s | ≥ 150 |
| Decisão gulosa | 0,47 ms | ≤ 60,00 |
| Simulações por decisão (Monte Carlo) | 1.200 partidas | ≥ 150 |
| Tamanho do arquivo único | 383 KB | ≤ 700 |

Todas as medidas em [performance/](performance/README.md).

## Como rodar

```bash
npm run testar              # unidade
npm run testar:interface    # interface (Chromium)
npm run testar:performance  # performance
npm run relatorios          # tudo + relatórios e cobertura
```
