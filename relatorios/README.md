# Relatórios de testes

**Versão 1.2.0** · commit `f718683-dirty` (com as mudanças ainda não registradas) · 10/11/2026, 13:23 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Gerado por `npm run relatorios` (`ferramentas/relatorios.js`).

## Resultado

| Suíte | Testes | Aprovados | Reprovados | Duração | Relatório |
|---|---:|---:|---:|---:|---|
| ✅ Testes de unidade | 255 | 255 | 0 | 45,4 s | [unidade/](unidade/README.md) |
| ✅ Testes de interface | 15 | 15 | 0 | 349,4 s | [interface/](interface/README.md) |
| ✅ Testes de performance | 12 | 12 | 0 | 22,3 s | [performance/](performance/README.md) |

## Cobertura

| Linhas | Instruções | Ramos | Funções (todas) | Funções e métodos com nome |
|---:|---:|---:|---:|---:|
| 98,6% | 98,6% | 92,8% | 97,1% | 577 de 594 |

Detalhe por arquivo e por função em [cobertura/](cobertura/README.md).

## Destaques de performance

| Medida | Valor | Limite |
|---|---:|---:|
| Tempo até o menu (WebGL) | 917 ms | ≤ 15.000 |
| Quadros por segundo na mesa (Canvas) | 59,52 qps | ≥ 20,00 |
| Mãos completas simuladas | 1.990 mãos/s | ≥ 150 |
| Decisão gulosa | 0,09 ms | ≤ 60,00 |
| Simulações por decisão (Monte Carlo) | 280 partidas | ≥ 80,00 |
| Tamanho do arquivo único | 432 KB | ≤ 700 |

Todas as medidas em [performance/](performance/README.md).

## Como rodar

```bash
npm run testar              # unidade
npm run testar:interface    # interface (Chromium)
npm run testar:performance  # performance
npm run relatorios          # tudo + relatórios e cobertura
```
