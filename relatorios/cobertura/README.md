# Cobertura dos testes

**Versão 1.2.0** · commit `f718683-dirty` (com as mudanças ainda não registradas) · 10/11/2026, 13:23 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Cobertura medida pelo V8 nos testes de unidade (Node) e nos testes de interface (Chromium, com os módulos de `src/` servidos sem empacotar), juntada pelo c8. Ficam fora da conta só `ferramentas/relatorios.js` (o gerador destes relatórios, que é quem roda os testes) e `src/recursos/` (a foto embutida, sem código).

| | Linhas | Instruções | Ramos | Funções |
|---|---:|---:|---:|---:|
| **Total** | 98,6% | 98,6% | 92,8% | 97,1% |

**Funções e métodos com nome executados pelos testes: 577 de 594 (97,1%).** A coluna "Funções" acima conta também as funções anônimas (callbacks de eventos, de animações e de `map`/`filter`).

## Por arquivo

| Arquivo | Linhas | Ramos | Funções |
|---|---:|---:|---:|
| `ferramentas/documentar.js` | 100,0% | 88,6% | 100,0% |
| `ferramentas/empacotar.js` | 100,0% | 71,4% | 100,0% |
| `ferramentas/simular.js` | 94,3% | 80,0% | 100,0% |
| `ferramentas/versionar.js` | 100,0% | 87,0% | 100,0% |
| `src/aplicacao.js` | 100,0% | 97,4% | 100,0% |
| `src/arte/avatares.js` | 100,0% | 97,5% | 100,0% |
| `src/arte/botoes.js` | 100,0% | 76,5% | 100,0% |
| `src/arte/cartas.js` | 100,0% | 94,4% | 100,0% |
| `src/arte/cartasDeTerreno.js` | 100,0% | 94,7% | 100,0% |
| `src/arte/cenarios.js` | 100,0% | 98,0% | 100,0% |
| `src/arte/emblemas.js` | 100,0% | 100,0% | 100,0% |
| `src/arte/figuras.js` | 100,0% | 91,7% | 100,0% |
| `src/arte/icones.js` | 100,0% | 100,0% | 100,0% |
| `src/arte/mesas.js` | 100,0% | 94,7% | 100,0% |
| `src/arte/moldura.js` | 100,0% | 100,0% | 100,0% |
| `src/arte/paleta.js` | 100,0% | 100,0% | 100,0% |
| `src/arte/pincel.js` | 100,0% | 84,8% | 100,0% |
| `src/arte/retrato.js` | 100,0% | 88,2% | 100,0% |
| `src/arte/versos.js` | 100,0% | 96,2% | 100,0% |
| `src/cenas/CenaCarregamento.js` | 100,0% | 84,6% | 100,0% |
| `src/cenas/CenaMenu.js` | 100,0% | 100,0% | 100,0% |
| `src/cenas/mesa/CenaMesa.js` | 98,8% | 90,0% | 100,0% |
| `src/cenas/mesa/cenario.js` | 100,0% | 93,6% | 100,0% |
| `src/cenas/mesa/desenho.js` | 99,7% | 95,0% | 100,0% |
| `src/cenas/mesa/dicas.js` | 98,8% | 55,9% | 100,0% |
| `src/cenas/mesa/efeitos.js` | 99,0% | 91,0% | 100,0% |
| `src/cenas/mesa/entrada.js` | 97,9% | 87,2% | 100,0% |
| `src/cenas/mesa/layout.js` | 100,0% | 100,0% | 100,0% |
| `src/cenas/mesa/resultado.js` | 100,0% | 85,7% | 100,0% |
| `src/cenas/mesa/truco.js` | 100,0% | 87,0% | 100,0% |
| `src/cenas/mesa/turnos.js` | 93,0% | 94,0% | 100,0% |
| `src/cenas/recursos.js` | 100,0% | 92,3% | 100,0% |
| `src/configuracao.js` | 100,0% | 100,0% | 100,0% |
| `src/conteudo/conquistas.js` | 100,0% | 100,0% | 100,0% |
| `src/conteudo/dicasDeJogo.js` | 100,0% | 100,0% | 100,0% |
| `src/conteudo/grimorio.js` | 100,0% | 100,0% | 100,0% |
| `src/conteudo/progresso.js` | 100,0% | 94,7% | 100,0% |
| `src/conteudo/textos.js` | 100,0% | 100,0% | 100,0% |
| `src/interface/menu.js` | 100,0% | 92,6% | 100,0% |
| `src/interface/musica.js` | 100,0% | 98,9% | 100,0% |
| `src/interface/paineis.js` | 100,0% | 100,0% | 100,0% |
| `src/interface/som.js` | 100,0% | 93,3% | 100,0% |
| `src/interface/telas/conquistas.js` | 100,0% | 84,6% | 100,0% |
| `src/interface/telas/grimorio.js` | 100,0% | 100,0% | 100,0% |
| `src/interface/telas/regras.js` | 100,0% | 100,0% | 100,0% |
| `src/interface/telas/revisao.js` | 100,0% | 99,0% | 100,0% |
| `src/interface/telas/sobre.js` | 100,0% | 100,0% | 100,0% |
| `src/motor/bot.js` | 90,4% | 94,8% | 94,1% |
| `src/motor/engine.js` | 100,0% | 100,0% | 100,0% |
| `src/motor/engine/actions.js` | 100,0% | 88,7% | 100,0% |
| `src/motor/engine/core.js` | 94,6% | 89,1% | 91,2% |
| `src/motor/engine/decks.js` | 100,0% | 100,0% | 100,0% |
| `src/motor/engine/index.js` | 82,8% | 100,0% | 0,0% |
| `src/motor/engine/registry.js` | 100,0% | 73,3% | 80,0% |
| `src/motor/engine/terrains.js` | 100,0% | 100,0% | 81,8% |
| `src/motor/engine/util.js` | 100,0% | 93,1% | 78,6% |
| `src/motor/sim.js` | 49,3% | 77,8% | 40,0% |
| `src/nucleo/aleatorio.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/baralhos.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/cartas.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/oponentes/comum.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/oponentes/estrategias.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/oponentes/index.js` | 100,0% | 92,2% | 100,0% |
| `src/nucleo/partida.js` | 99,8% | 96,1% | 100,0% |
| `src/nucleo/pontuacao.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/rede.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/terrenos.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/traducao.js` | 100,0% | 85,0% | 100,0% |
| `src/nucleo/truco.js` | 100,0% | 100,0% | 100,0% |
| `src/principal.js` | 100,0% | 85,7% | 100,0% |
| `src/versao.js` | 100,0% | 100,0% | 100,0% |

## Funções e métodos

Cada função ou método com nome e quantas vezes foi executado durante os testes.

### `ferramentas/documentar.js`

✅ `arquivosJs` (linha 16) — 13 execuções  
✅ `limparComentario` (linha 25) — 489 execuções  
✅ `lerModulo` (linha 37) — 73 execuções

### `ferramentas/empacotar.js`

✅ `ler` (linha 17) — 4 execuções  
✅ `trecho` (linha 38) — 4 execuções

### `ferramentas/simular.js`

✅ `media` (linha 48) — 2 execuções

### `ferramentas/versionar.js`

✅ `caminho` (linha 30) — 28 execuções  
✅ `lerArgumentos` (linha 33) — 4 execuções  
✅ `tipoDeMudanca` (linha 48) — 11 execuções  
✅ `proximaVersao` (linha 56) — 8 execuções  
✅ `gravarModuloDeVersao` (linha 64) — 3 execuções  
✅ `gravarNoReadme` (linha 75) — 3 execuções  
✅ `gravarNoHistorico` (linha 85) — 3 execuções

### `src/aplicacao.js`

✅ `iniciar` (linha 30) — 18 execuções  
✅ `salvar` (linha 38) — 73 execuções  
✅ `salvarOpcoes` (linha 41) — 20 execuções  
✅ `alternarSom` (linha 44) — 3 execuções  
✅ `alternarMusica` (linha 54) — 4 execuções  
✅ `jogar` (linha 62) — 16 execuções  
✅ `irParaMenu` (linha 71) — 5 execuções  
✅ `modoImersivo` (linha 82) — 17 execuções  
✅ `registrarMao` (linha 99) — 11 execuções  
✅ `marcarVerbeteLido` (linha 124) — 35 execuções

### `src/arte/avatares.js`

✅ `desenharAvatar` (linha 16) — 90 execuções  
✅ `curve` (linha 30) — 1.890 execuções

### `src/arte/botoes.js`

✅ `desenharFaisca` (linha 10) — 54 execuções  
✅ `desenharBotao` (linha 25) — 91 execuções

### `src/arte/cartas.js`

✅ `dadosDaCarta` (linha 22) — 1.090 execuções  
✅ `simboloDeColecao` (linha 42) — 605 execuções  
✅ `ilustracaoDaCarta` (linha 51) — 529 execuções  
✅ `posicoesDosNaipes` (linha 102) — 658 execuções  
✅ `fileira` (linha 103) — 10.528 execuções  
✅ `desenharCartaCompleta` (linha 120) — 529 execuções  
✅ `desenharCartaDaMesa` (linha 191) — 557 execuções  
✅ `indice` (linha 226) — 1.114 execuções

### `src/arte/cartasDeTerreno.js`

✅ `desenharCartaDeTerreno` (linha 16) — 72 execuções

### `src/arte/cenarios.js`

✅ `perfilDeSerra` (linha 11) — 860 execuções  
✅ `sub` (linha 14) — 109.220 execuções  
✅ `montanhas` (linha 23) — 283 execuções  
✅ `estrelas` (linha 40) — 295 execuções  
✅ `constelacao` (linha 48) — 552 execuções  
✅ `vinheta` (linha 70) — 1.167 execuções  
✅ `raios` (linha 75) — 320 execuções  
✅ `cenarioDoNaipe` (linha 89) — 1.094 execuções

### `src/arte/emblemas.js`

✅ `desenharEmblema` (linha 7) — 3.706 execuções

### `src/arte/figuras.js`

✅ `coroa` (linha 18) — 195 execuções  
✅ `desenharFigura` (linha 41) — 273 execuções

### `src/arte/icones.js`

✅ `svg` (linha 7) — 532 execuções  
✅ `gato` (linha 11) — 38 execuções

### `src/arte/mesas.js`

✅ `desenharFeltro` (linha 12) — 36 execuções  
✅ `vinhetaDaMesa` (linha 36) — 24 execuções  
✅ `fibras` (linha 41) — 17 execuções  
✅ `mesaMontanha` (linha 51) — 6 execuções  
✅ `vitoriaRegia` (linha 97) — 770 execuções  
✅ `mesaPantano` (linha 111) — 11 execuções  
✅ `rosaDosVentos` (linha 145) — 7 execuções  
✅ `mesaOceano` (linha 161) — 7 execuções  
✅ `desenharMesa` (linha 186) — 59 execuções

### `src/arte/moldura.js`

✅ `corpoDaMoldura` (linha 10) — 1.160 execuções  
✅ `placa` (linha 41) — 1.735 execuções  
✅ `gema` (linha 55) — 1.619 execuções

### `src/arte/pincel.js`

✅ `criarTela` (linha 9) — 1.597 execuções  
✅ `caminhoArredondado` (linha 19) — 13.365 execuções  
✅ `hashDoTexto` (linha 30) — 1.473 execuções  
✅ `geradorComSemente` (linha 36) — 1.515 execuções  
✅ `degradeLinear` (linha 45) — 19.511 execuções  
✅ `degradeRadial` (linha 51) — 21.812 execuções  
✅ `escreverComQuebra` (linha 57) — 1.131 execuções  
✅ `ajustarFonte` (linha 71) — 1.295 execuções  
✅ `granulado` (linha 75) — 2.439 execuções  
✅ `escovado` (linha 83) — 1.161 execuções  
✅ `sombraSuave` (linha 92) — 7.908 execuções  
✅ `semSombra` (linha 97) — 12.603 execuções  
✅ `brilho` (linha 99) — 15.065 execuções  
✅ `comAlfa` (linha 104) — 62.088 execuções  
✅ `tonalizar` (linha 109) — 10.298 execuções

### `src/arte/retrato.js`

✅ `caminhoArredondado` (linha 6) — 4 execuções  
✅ `arcoGotico` (linha 11) — 16 execuções  
✅ `dourado` (linha 21) — 4 execuções  
✅ `desenharRetratoEmMoldura` (linha 35) — 4 execuções  
✅ `img.onload` (linha 42) — 4 execuções

### `src/arte/versos.js`

✅ `molduraDourada` (linha 13) — 81 execuções  
✅ `legenda` (linha 26) — 92 execuções  
✅ `versoClassico` (linha 33) — 70 execuções  
✅ `versoTruco` (linha 75) — 8 execuções  
✅ `versoFraternidade` (linha 120) — 5 execuções  
✅ `simboloYinYang` (linha 160) — 6 execuções  
✅ `versoYinYang` (linha 172) — 6 execuções  
✅ `bx` (linha 173) — 1.914 execuções  
✅ `versoPowerBI` (linha 206) — 17 execuções  
✅ `desenharVerso` (linha 278) — 106 execuções

### `src/cenas/CenaCarregamento.js`

✅ `CenaCarregamento` (linha 22) — 17 execuções  
✅ `create` (linha 24) — 17 execuções  
✅ `gerarTexturas` (linha 37) — 17 execuções  
✅ `adicionar` (linha 38) — 170 execuções

### `src/cenas/CenaMenu.js`

✅ `CenaMenu` (linha 17) — 17 execuções  
✅ `create` (linha 19) — 21 execuções  
✅ `espalharCartas` (linha 30) — 21 execuções  
✅ `update` (linha 41) — 662 execuções

### `src/cenas/mesa/CenaMesa.js`

✅ `CenaMesa` (linha 42) — 17 execuções  
✅ `create` (linha 45) — 15 execuções  
✅ `comecar` (linha 68) — 15 execuções  
✅ `update` (linha 74) — 2.033 execuções

### `src/cenas/mesa/cenario.js`

✅ `desenharCenarioFixo` (linha 20) — 15 execuções  
✅ `criarBotao` (linha 52) — 90 execuções  
✅ `textura` (linha 54) — 489 execuções  
✅ `pintar` (linha 73) — 399 execuções  
✅ `temDica` (linha 74) — 33 execuções  
✅ `mostrarDica` (linha 75) — 2 execuções  
✅ `botao.definirRotulo` (linha 97) — 1.690 execuções  
✅ `botao.habilitar` (linha 98) — 3.148 execuções  
✅ `criarPaineis` (linha 110) — 15 execuções  
✅ `criarTexto` (linha 119) — 435 execuções  
✅ `criarPainelEsquerdo` (linha 124) — 15 execuções  
✅ `criarPilha` (linha 132) — 30 execuções  
✅ `criarPlacar` (linha 174) — 15 execuções  
✅ `criarBotoesDeAcao` (linha 203) — 15 execuções  
✅ `p.truco.criarBotao.variante` (linha 205) — 2 execuções  
✅ `coluna` (linha 206) — 45 execuções  
✅ `p.botaoDropout.criarBotao` (linha 208) — 3 execuções  
✅ `p.botaoTransfer.criarBotao` (linha 209) — 1 execução  
✅ `p.botaoPassar.criarBotao` (linha 210) — 1 execução  
✅ `atualizarChaves` (linha 217) — 26 execuções

### `src/cenas/mesa/desenho.js`

✅ `inspecionar` (linha 27) — 199 execuções  
✅ `mostrarDica` (linha 33) — 915 execuções  
✅ `redesenhar` (linha 38) — 787 execuções  
✅ `desenharMaos` (linha 68) — 787 execuções  
✅ `notaDaCartaDaMao` (linha 106) — 1 execução  
✅ `atualizarPaineis` (linha 114) — 787 execuções  
✅ `textoComDicaDeJogo` (linha 135) — 840 execuções  
✅ `atualizarPilha` (linha 145) — 1.574 execuções  
✅ `atualizarBlocoDoJogador` (linha 166) — 1.574 execuções  
✅ `estaNaVez` (linha 203) — 4.538 execuções  
✅ `desenharDestaqueDaVez` (linha 208) — 1.769 execuções  
✅ `atualizarBotoes` (linha 224) — 787 execuções  
✅ `atualizarRegistro` (linha 237) — 787 execuções  
✅ `desenharCurva` (linha 246) — 787 execuções  
✅ `textoDaDica` (linha 274) — 840 execuções  
✅ `valorSelecionado` (linha 300) — 376 execuções  
✅ `calcularAlvos` (linha 306) — 787 execuções  
✅ `desenharConexoesEAlvos` (linha 336) — 1.769 execuções

### `src/cenas/mesa/dicas.js`

✅ `conceitoCurto` (linha 32) — 8 execuções  
✅ `alternarDicas` (linha 39) — 2 execuções  
✅ `acao` (linha 56) — 1 execução  
✅ `darDicaDoTurno` (linha 69) — 91 execuções  
✅ `textoDaDicaDeJogo` (linha 81) — 840 execuções  
✅ `mostrarDicaDoBotao` (linha 89) — 2 execuções  
✅ `esconderDicaDoBotao` (linha 99) — 17 execuções  
✅ `conteudoDaDica` (linha 105) — 6 execuções  
✅ `dicaDaRespostaAoTruco` (linha 164) — 7 execuções

### `src/cenas/mesa/efeitos.js`

✅ `corCss` (linha 26) — 95 execuções  
✅ `posicaoDoNeuronio` (linha 30) — 158 execuções  
✅ `origemDasCartas` (linha 36) — 31 execuções  
✅ `animarEventos` (linha 46) — 173 execuções  
✅ `animar_ativacao` (linha 58) — 119 execuções  
✅ `animar_tunagem` (linha 76) — 10 execuções  
✅ `animar_ataque` (linha 89) — 21 execuções  
✅ `onComplete` (linha 103) — 21 execuções  
✅ `animar_overfit` (linha 121) — 14 execuções  
✅ `animar_earlystop` (linha 122) — 5 execuções  
✅ `animar_stackoverflow` (linha 123) — 2 execuções  
✅ `animar_dropout` (linha 126) — 8 execuções  
✅ `animar_transfer` (linha 138) — 1 execução  
✅ `animar_completa` (linha 147) — 11 execuções  
✅ `animar_vento` (linha 154) — 10 execuções  
✅ `animar_powerbi` (linha 161) — 3 execuções  
✅ `animar_travada` (linha 167) — 1 execução  
✅ `animar_passe` (linha 174) — 6 execuções  
✅ `animar_inicio` (linha 181) — 6 execuções  
✅ `onComplete` (linha 192) — 12 execuções  
✅ `verificarVanishing` (linha 199) — 173 execuções  
✅ `voarCarta` (linha 217) — 37 execuções  
✅ `onComplete` (linha 221) — 37 execuções  
✅ `explodir` (linha 226) — 74 execuções  
✅ `textoFlutuante` (linha 238) — 164 execuções  
✅ `onComplete` (linha 240) — 162 execuções  
✅ `faixa` (linha 244) — 49 execuções  
✅ `onComplete` (linha 248) — 49 execuções  
✅ `falar` (linha 255) — 32 execuções  
✅ `onComplete` (linha 267) — 32 execuções  
✅ `impactoDoTruco` (linha 274) — 11 execuções  
✅ `avisarVerbete` (linha 283) — 520 execuções

### `src/cenas/mesa/entrada.js`

✅ `aoPassarNoNeuronio` (linha 20) — 129 execuções  
✅ `aoClicarNoNeuronio` (linha 52) — 77 execuções  
✅ `aoClicarNaCarta` (linha 74) — 198 execuções  
✅ `cancelarSelecao` (linha 108) — 205 execuções  
✅ `alternarDropout` (linha 116) — 3 execuções  
✅ `fazerTransfer` (linha 123) — 1 execução  
✅ `passarAVez` (linha 131) — 6 execuções  
✅ `abrirRegrasDaMesa` (linha 139) — 4 execuções  
✅ `regras` (linha 151) — 1 execução  
✅ `grimorio` (linha 152) — 1 execução  
✅ `dicas` (linha 153) — 2 execuções  
✅ `abrirMenuDaMesa` (linha 166) — 4 execuções  
✅ `q` (linha 175) — 12 execuções  
✅ `perguntarSeVoltaAoMenu` (linha 183) — 2 execuções  
✅ `acao` (linha 186) — 1 execução

### `src/cenas/mesa/layout.js`

✅ `colunaX` (linha 47) — 14.961 execuções  
✅ `linhaY` (linha 49) — 14.890 execuções  
✅ `ajustarCartaDaMesa` (linha 62) — 24.817 execuções  
✅ `ajustarLinha` (linha 72) — 14.277 execuções  
✅ `ajustarBloco` (linha 88) — 1.920 execuções

### `src/cenas/mesa/resultado.js`

✅ `encerrarMao` (linha 29) — 10 execuções  
✅ `comemorar` (linha 67) — 4 execuções  
✅ `faixaDeVitoria` (linha 88) — 4 execuções  
✅ `onComplete` (linha 105) — 4 execuções  
✅ `chuvaDeConfete` (linha 110) — 4 execuções  
✅ `htmlDaRede` (linha 132) — 24 execuções  
✅ `mostrarResultado` (linha 150) — 13 execuções  
✅ `aoFechar` (linha 184) — 3 execuções

### `src/cenas/mesa/truco.js`

✅ `pedirTrucoHumano` (linha 13) — 2 execuções  
✅ `anunciarTruco` (linha 19) — 9 execuções  
✅ `pedirResposta` (linha 32) — 9 execuções  
✅ `acao` (linha 45) — 1 execução  
✅ `acao` (linha 46) — 5 execuções  
✅ `acao` (linha 48) — 1 execução  
✅ `aplicarResposta` (linha 59) — 9 execuções

### `src/cenas/mesa/turnos.js`

✅ `verso` (linha 21) — 26.309 execuções  
✅ `jogadorDeBaixo` (linha 24) — 3.380 execuções  
✅ `jogadorDeCima` (linha 27) — 3.343 execuções  
✅ `avatarDe` (linha 30) — 1.574 execuções  
✅ `ehVezDoHumano` (linha 37) — 5.252 execuções  
✅ `iniciarMao` (linha 46) — 19 execuções  
✅ `criarNeuronios` (linha 82) — 19 execuções  
✅ `executarJogada` (linha 106) — 172 execuções  
✅ `avancar` (linha 125) — 213 execuções  
✅ `anotarNaLinhaDoTempo` (linha 158) — 190 execuções  
✅ `avancarNoInicio` (linha 175) — 8 execuções  
✅ `comecar` (linha 187) — 8 execuções  
✅ `passarAparelho` (linha 194) — 18 execuções  
✅ `acao` (linha 199) — 18 execuções  
✅ `vezDoOponente` (linha 207) — 88 execuções

### `src/cenas/recursos.js`

✅ `prepararTextoNitido` (linha 19) — 17 execuções  
✅ `fabrica.text` (linha 22) — 2.156 execuções  
✅ `ajustarCamera` (linha 35) — 53 execuções  
✅ `ajustar` (linha 39) — 2.828 execuções  
✅ `cena.reajustarCamera` (linha 53) — 36 execuções  
✅ `texturaDaMesa` (linha 61) — 53 execuções  
✅ `colocarFundo` (linha 71) — 36 execuções  
✅ `texturaDoVerso` (linha 82) — 26.360 execuções  
✅ `texturaDaCartaNaMao` (linha 89) — 4.077 execuções  
✅ `texturaDaCartaMedia` (linha 96) — 12 execuções  
✅ `texturaDaCartaNaMesa` (linha 103) — 4.225 execuções  
✅ `criarTexturaDeInspecao` (linha 113) — 17 execuções  
✅ `texturaDeInspecao` (linha 122) — 142 execuções  
✅ `liberarCartasDaMao` (linha 139) — 19 execuções  
✅ `retanguloNaTela` (linha 147) — 2 execuções  
✅ `px` (linha 150) — 6 execuções  
✅ `py` (linha 151) — 6 execuções

### `src/conteudo/conquistas.js`

✅ `meu` (linha 28) — 72 execuções  
✅ `teste` (linha 31) — 12 execuções  
✅ `teste` (linha 32) — 13 execuções  
✅ `teste` (linha 33) — 13 execuções  
✅ `teste` (linha 34) — 13 execuções  
✅ `teste` (linha 35) — 13 execuções  
✅ `teste` (linha 36) — 11 execuções  
✅ `teste` (linha 37) — 11 execuções  
✅ `teste` (linha 38) — 11 execuções  
✅ `teste` (linha 39) — 11 execuções  
✅ `teste` (linha 40) — 11 execuções  
✅ `teste` (linha 41) — 11 execuções  
✅ `teste` (linha 42) — 11 execuções  
✅ `teste` (linha 43) — 11 execuções  
✅ `teste` (linha 44) — 10 execuções  
✅ `teste` (linha 45) — 11 execuções  
✅ `teste` (linha 46) — 11 execuções  
✅ `teste` (linha 47) — 11 execuções  
✅ `teste` (linha 48) — 11 execuções  
✅ `teste` (linha 49) — 12 execuções  
✅ `teste` (linha 50) — 13 execuções  
✅ `teste` (linha 51) — 12 execuções  
✅ `teste` (linha 52) — 13 execuções  
✅ `teste` (linha 53) — 13 execuções  
✅ `teste` (linha 54) — 13 execuções  
✅ `teste` (linha 55) — 13 execuções  
✅ `teste` (linha 56) — 11 execuções  
✅ `teste` (linha 57) — 13 execuções

### `src/conteudo/dicasDeJogo.js`

✅ `contarValores` (linha 43) — 6.103 execuções  
✅ `escolherDicaDeJogo` (linha 57) — 6.103 execuções  
✅ `dica` (linha 64) — 5.266 execuções  
✅ `atacavel` (linha 65) — 6.103 execuções

### `src/conteudo/progresso.js`

✅ `progressoInicial` (linha 13) — 25 execuções  
✅ `migrarV1` (linha 22) — 2 execuções  
✅ `carregarProgresso` (linha 34) — 25 execuções  
✅ `salvarProgresso` (linha 46) — 75 execuções

### `src/conteudo/textos.js`

✅ `provocar` (linha 43) — 45 execuções

### `src/interface/menu.js`

✅ `mostrarMiniatura` (linha 36) — 160 execuções  
✅ `opcoesHtml` (linha 45) — 110 execuções  
✅ `htmlDoMenu` (linha 53) — 22 execuções  
✅ `abrirMenu` (linha 83) — 22 execuções  
✅ `campo` (linha 86) — 870 execuções  
✅ `atualizarDicas` (linha 89) — 80 execuções  
✅ `lerEscolhas` (linha 103) — 24 execuções

### `src/interface/musica.js`

✅ `hz` (linha 23) — 2.298 execuções  
✅ `sorteador` (linha 26) — 1.142 execuções  
✅ `voz` (linha 43) — 2.258 execuções  
✅ `chiado` (linha 69) — 390 execuções  
✅ `tambor` (linha 85) — 321 execuções  
✅ `sino` (linha 98) — 10 execuções  
✅ `tocar` (linha 123) — 752 execuções  
✅ `tocar` (linha 145) — 60 execuções  
✅ `tocar` (linha 165) — 261 execuções  
✅ `tocar` (linha 190) — 69 execuções  
✅ `agendar` (linha 216) — 1.089 execuções  
✅ `tocar` (linha 237) — 28 execuções  
✅ `parar` (linha 253) — 30 execuções  
✅ `tocando` (linha 266) — 9 execuções

### `src/interface/paineis.js`

✅ `$` (linha 9) — 249 execuções  
✅ `escaparHtml` (linha 12) — 1.689 execuções  
✅ `abrirPainel` (linha 31) — 112 execuções  
✅ `fechar` (linha 38) — 91 execuções  
✅ `fecharTodos` (linha 51) — 61 execuções  
✅ `mostrarAviso` (linha 62) — 72 execuções  
✅ `mostrarDicaDeJogo` (linha 78) — 4 execuções  
✅ `confirmar` (linha 98) — 30 execuções  
✅ `mostrarDicaFlutuante` (linha 126) — 5 execuções  
✅ `esconderDicaFlutuante` (linha 145) — 46 execuções

### `src/interface/som.js`

✅ `contextoDeAudio` (linha 11) — 36 execuções  
✅ `audio` (linha 14) — 1.064 execuções  
✅ `nota` (linha 33) — 766 execuções  
✅ `ruido` (linha 49) — 245 execuções  
✅ `desbloquear` (linha 65) — 17 execuções  
✅ `definirMudo` (linha 66) — 24 execuções  
✅ `estaMudo` (linha 67) — 32 execuções  
✅ `virarCarta` (linha 68) — 120 execuções  
✅ `colocarCarta` (linha 69) — 8 execuções  
✅ `selecionar` (linha 70) — 205 execuções  
✅ `tunagem` (linha 71) — 11 execuções  
✅ `golpe` (linha 72) — 22 execuções  
✅ `explosao` (linha 73) — 5 execuções  
✅ `dropout` (linha 74) — 9 execuções  
✅ `truco` (linha 79) — 17 execuções  
✅ `vitoria` (linha 88) — 1 execução  
✅ `fanfarra` (linha 94) — 7 execuções  
✅ `campeao` (linha 109) — 2 execuções  
✅ `derrota` (linha 121) — 9 execuções  
✅ `medalha` (linha 122) — 20 execuções

### `src/interface/telas/conquistas.js`

✅ `medalhaHtml` (linha 16) — 93 execuções  
✅ `itemHtml` (linha 23) — 81 execuções  
✅ `abrirConquistas` (linha 33) — 3 execuções

### `src/interface/telas/grimorio.js`

✅ `abrirGrimorio` (linha 14) — 5 execuções  
✅ `desenharLista` (linha 23) — 7 execuções  
✅ `mostrar` (linha 31) — 7 execuções

### `src/interface/telas/regras.js`

✅ `listaDeExtensoes` (linha 9) — 20 execuções  
✅ `abrirRegras` (linha 20) — 20 execuções

### `src/interface/telas/revisao.js`

✅ `tipoDoPasso` (linha 31) — 304 execuções  
✅ `variacoes` (linha 45) — 14 execuções  
✅ `momentosChave` (linha 53) — 5 execuções  
✅ `contagens` (linha 72) — 5 execuções  
✅ `graficoDaCurva` (linha 82) — 4 execuções  
✅ `x` (linha 88) — 220 execuções  
✅ `y` (linha 89) — 266 execuções  
✅ `linhaDoTempoHtml` (linha 120) — 5 execuções  
✅ `tabelaDaPartida` (linha 140) — 4 execuções  
✅ `abrirRevisao` (linha 151) — 5 execuções  
✅ `linha` (linha 155) — 10 execuções  
✅ `qtd` (linha 158) — 47 execuções

### `src/interface/telas/sobre.js`

✅ `abrirSobre` (linha 8) — 3 execuções

### `src/motor/bot.js`

✅ `botMoves` (linha 19) — 619.911 execuções  
✅ `optionalPass` (linha 20) — 13.081 execuções  
✅ `revealPick` (linha 24) — 2.436 execuções  
✅ `str` (linha 27) — 24 execuções  
✅ `val` (linha 30) — 12.396 execuções  
✅ `randomPolicy` (linha 35) — 604.040 execuções  
✅ `playout` (linha 54) — 71.428 execuções  
✅ `margin` (linha 65) — 127.797 execuções  
✅ `evaluate` (linha 71) — 58.859 execuções  
✅ `mean` (linha 73) — 117.718 execuções  
✅ `bad` (linha 75) — 158.558 execuções  
✅ `greedyMove` (linha 80) — 12.349 execuções  
✅ `monteCarloMove` (linha 106) — 3.520 execuções  
✅ `monteCarloResults` (linha 116) — 3.373 execuções  
✅ `defaultRollouts` (linha 134) — 31 execuções  
✅ `chooseMove` (linha 136) — 39.724 execuções  
❌ `describeMove` (linha 142) — 0 execuções

### `src/motor/engine/actions.js`

✅ `generate` (linha 18) — 2.166.504 execuções  
✅ `isValid` (linha 24) — 597.798 execuções  
✅ `execute` (linha 33) — 597.797 execuções  
✅ `generate` (linha 49) — 2.166.504 execuções  
✅ `isValid` (linha 58) — 39.627 execuções  
✅ `execute` (linha 64) — 39.548 execuções  
✅ `attackAction` (linha 84) — 90 execuções  
✅ `generate` (linha 87) — 6.499.512 execuções  
✅ `isValid` (linha 100) — 73.227 execuções  
✅ `execute` (linha 112) — 73.113 execuções  
✅ `statWeight` (linha 146) — 19.241 execuções  
✅ `generate` (linha 149) — 639.593 execuções  
✅ `isValid` (linha 159) — 19.243 execuções  
✅ `execute` (linha 171) — 19.241 execuções  
✅ `generate` (linha 186) — 972.315 execuções  
✅ `isValid` (linha 192) — 2.707 execuções  
✅ `execute` (linha 197) — 2.706 execuções  
✅ `generate` (linha 217) — 2.165.794 execuções  
✅ `isValid` (linha 218) — 2.654 execuções  
✅ `execute` (linha 219) — 2.647 execuções

### `src/motor/engine/core.js`

✅ `rulesOf` (linha 48) — 1.165.619 execuções  
✅ `scaleLayers` (linha 59) — 7.046 execuções  
✅ `newGame` (linha 66) — 7.047 execuções  
✅ `rng` (linha 70) — 434.577 execuções  
✅ `each` (linha 103) — 63.414 execuções  
✅ `mkNet` (linha 141) — 15.728 execuções  
✅ `startPlay` (linha 143) — 7.033 execuções  
✅ `revealMoves` (linha 157) — 3.026 execuções  
✅ `applyReveal` (linha 161) — 4.790 execuções  
✅ `deckOf` (linha 183) — 11.971.457 execuções  
✅ `terrainOf` (linha 184) — 5.272.491 execuções  
❌ `outputLayer` (linha 185) — 0 execuções  
❌ `layerName` (linha 186) — 0 execuções  
✅ `lastSlot` (linha 192) — 9.777.636 execuções  
✅ `nextLayer` (linha 198) — 4.521.382 execuções  
✅ `isHidden` (linha 199) — 7.240.516 execuções  
✅ `pileSize` (linha 200) — 6.603.933 execuções  
✅ `pileRoom` (linha 201) — 1.597.530 execuções  
✅ `handCardsByRank` (linha 202) — 6.277.117 execuções  
✅ `hiddenInPath` (linha 203) — 639.593 execuções  
✅ `attackTarget` (linha 207) — 157.176 execuções  
✅ `cardValue` (linha 216) — 10.307.092 execuções  
✅ `strengthOf` (linha 221) — 8.482 execuções  
✅ `stackValue` (linha 225) — 151.173 execuções  
✅ `peekCards` (linha 234) — 141.677 execuções  
✅ `takeCards` (linha 246) — 138.771 execuções  
✅ `pileCheck` (linha 251) — 112.854 execuções  
✅ `removeSlot` (linha 258) — 97.013 execuções  
✅ `finishNet` (linha 262) — 141.305 execuções  
✅ `discardHand` (linha 268) — 3.162 execuções  
✅ `addAchievement` (linha 271) — 19.748 execuções  
✅ `logEvent` (linha 274) — 735.052 execuções  
✅ `legalMoves` (linha 278) — 2.168.820 execuções  
✅ `canPass` (linha 298) — 2.168.934 execuções  
✅ `validate` (linha 305) — 740.046 execuções  
✅ `applyMove` (linha 321) — 739.853 execuções  
✅ `roundEnded` (linha 361) — 713.105 execuções  
❌ `nextK` (linha 371) — 0 execuções  
✅ `pickNext` (linha 380) — 713.105 execuções  
✅ `canAct` (linha 393) — 1.526.201 execuções  
✅ `checkStuck` (linha 398) — 742.085 execuções  
✅ `checkOver` (linha 409) — 735.052 execuções  
✅ `endGame` (linha 416) — 79.145 execuções  
✅ `neuronBonus` (linha 435) — 3.760.748 execuções  
✅ `score` (linha 439) — 769.658 execuções  
✅ `compareTwo` (linha 456) — 163.381 execuções  
✅ `val` (linha 463) — 69.968 execuções  
✅ `sum` (linha 468) — 7.550 execuções  
✅ `best` (linha 472) — 386 execuções  
✅ `high` (linha 475) — 172 execuções  
✅ `pos` (linha 481) — 1.148 execuções  
✅ `resolveWinner` (linha 485) — 79.145 execuções  
✅ `cloneState` (linha 497) — 91.419 execuções  
❌ `toPlain` (linha 505) — 0 execuções  
❌ `viewFor` (linha 513) — 0 execuções  
✅ `replay` (linha 527) — 1.000 execuções  
✅ `determinize` (linha 535) — 88.865 execuções

### `src/motor/engine/decks.js`

✅ `sumScore` (linha 23) — 744.764 execuções  
✅ `score` (linha 72) — 173.013 execuções  
✅ `activation` (linha 81) — 86.788 execuções  
✅ `activationName` (linha 87) — 86.788 execuções  
✅ `score` (linha 92) — 24.894 execuções  
✅ `trucoValue` (linha 124) — 266.559 execuções  
✅ `build` (linha 129) — 605 execuções  
✅ `strength` (linha 140) — 755 execuções  
✅ `score` (linha 141) — 40.874 execuções  
✅ `cardValue` (linha 148) — 150.950 execuções  
✅ `stackValue` (linha 149) — 6.588 execuções  
✅ `strength` (linha 151) — 508 execuções  
✅ `score` (linha 152) — 23.740 execuções  
✅ `sumScore.faceAsValue` (linha 152) — 23.740 execuções  
✅ `score` (linha 167) — 33.078 execuções  
✅ `build` (linha 182) — 918 execuções  
✅ `score` (linha 188) — 91.215 execuções  
✅ `score` (linha 195) — 382.844 execuções  
✅ `onAfterAction` (linha 196) — 527.210 execuções

### `src/motor/engine/index.js`

❌ `loadMod` (linha 24) — 0 execuções

### `src/motor/engine/registry.js`

✅ `need` (linha 46) — 570 execuções  
✅ `registerDeck` (linha 56) — 210 execuções  
✅ `registerTerrain` (linha 61) — 120 execuções  
✅ `registerAction` (linha 66) — 240 execuções  
✅ `deck` (linha 72) — 11.978.532 execuções  
✅ `terrain` (linha 73) — 5.279.538 execuções  
✅ `action` (linha 74) — 735.052 execuções  
❌ `deckList` (linha 76) — 0 execuções  
❌ `terrainList` (linha 77) — 0 execuções  
✅ `actionList` (linha 78) — 2.506.272 execuções

### `src/motor/engine/terrains.js`

✅ `key` (linha 10) — 2.959.231 execuções  
✅ `neuronBonus` (linha 21) — 737.514 execuções  
✅ `onGameStart` (linha 30) — 934 execuções  
✅ `onRoundEnd` (linha 31) — 94.229 execuções  
✅ `neuronBonus` (linha 38) — 920.960 execuções  
❌ `status` (linha 42) — 0 execuções  
✅ `onGameStart` (linha 49) — 940 execuções  
✅ `onRoundEnd` (linha 50) — 69.261 execuções  
✅ `onCardPlayed` (linha 54) — 120.299 execuções  
✅ `neuronBonus` (linha 60) — 727.522 execuções  
❌ `status` (linha 65) — 0 execuções

### `src/motor/engine/util.js`

✅ `mulberry32` (linha 13) — 130.819 execuções  
✅ `rand` (linha 26) — 1.986.475 execuções  
✅ `shuffle` (linha 35) — 98.617 execuções  
❌ `rankLabel` (linha 43) — 0 execuções  
❌ `cardLabel` (linha 44) — 0 execuções  
✅ `isFace` (linha 45) — 8.321.299 execuções  
✅ `nominalValue` (linha 48) — 10.112.978 execuções  
✅ `cardStrength` (linha 55) — 7.219 execuções  
✅ `standardDeck` (linha 60) — 6.487 execuções  
❌ `otherPlayer` (linha 69) — 0 execuções  
✅ `playerCount` (linha 70) — 20.879.589 execuções  
✅ `nextPlayer` (linha 71) — 8.600.878 execuções  
✅ `opponents` (linha 76) — 6.775.362 execuções  
✅ `round2` (linha 82) — 1.149.491 execuções

### `src/motor/sim.js`

✅ `runGame` (linha 6) — 2.000 execuções  
❌ `emptyStats` (linha 18) — 0 execuções  
❌ `accumulate` (linha 27) — 0 execuções  
❌ `summarize` (linha 50) — 0 execuções  
✅ `choose` (linha 61) — 10 execuções

### `src/nucleo/aleatorio.js`

✅ `sortear` (linha 13) — 2.022 execuções  
✅ `sortearInteiro` (linha 25) — 1.622 execuções  
✅ `embaralhar` (linha 36) — 22 execuções  
✅ `sementeNova` (linha 45) — 21 execuções

### `src/nucleo/baralhos.js`

✅ `montarBaralho` (linha 12) — 28 execuções  
✅ `BARALHOS.<computed>.montar` (linha 49) — 28 execuções  
✅ `pontosDaCarta` (linha 57) — 5.010 execuções  
✅ `nomeDaCarta` (linha 64) — 1.211 execuções  
✅ `manilhaDaCarta` (linha 71) — 2 execuções

### `src/nucleo/cartas.js`

✅ `ehFigura` (linha 40) — 81.141 execuções  
✅ `rotuloCarta` (linha 45) — 59.514 execuções  
✅ `baralhoPadrao` (linha 50) — 6 execuções

### `src/nucleo/oponentes/comum.js`

✅ `novoGerador` (linha 10) — 59.528 execuções  
✅ `determinizar` (linha 19) — 5.062 execuções  
✅ `chanceDeVitoria` (linha 27) — 65 execuções

### `src/nucleo/oponentes/estrategias.js`

✅ `jogadaAleatoria` (linha 15) — 51.831 execuções  
✅ `jogadaGulosa` (linha 20) — 106 execuções  
✅ `jogadaMonteCarlo` (linha 30) — 38 execuções

### `src/nucleo/oponentes/index.js`

✅ `cartaDeInicio` (linha 30) — 20 execuções  
✅ `forca` (linha 38) — 42 execuções  
✅ `escolherJogada` (linha 49) — 179 execuções  
✅ `querTrucar` (linha 61) — 50 execuções  
✅ `responderAoTruco` (linha 74) — 20 execuções

### `src/nucleo/partida.js`

✅ `novoJogador` (linha 74) — 7.192 execuções  
✅ `todasAsCartas` (linha 84) — 3.596 execuções  
✅ `indexarCartas` (linha 96) — 3.596 execuções  
✅ `montar` (linha 118) — 11.212 execuções  
✅ `novaMao` (linha 145) — 3.599 execuções  
✅ `copiarMao` (linha 168) — 7.616 execuções  
✅ `atualizarVisao` (linha 178) — 71.032 execuções  
✅ `carta` (linha 180) — 3.696.369 execuções  
✅ `emitir` (linha 214) — 73.535 execuções  
✅ `anotar` (linha 219) — 69.124 execuções  
✅ `somas` (linha 224) — 62.187 execuções  
✅ `anotarHistorico` (linha 229) — 62.736 execuções  
✅ `fronteira` (linha 236) — 19.627 execuções  
✅ `alvosDeAtivacao` (linha 242) — 1.634 execuções  
✅ `alvosDeEmpilhamento` (linha 251) — 195 execuções  
✅ `efeitoDoEmpilhamento` (linha 266) — 6.422 execuções  
✅ `podeEmpilhar` (linha 276) — 197 execuções  
✅ `camadasDesfaziveis` (linha 286) — 458 execuções  
✅ `valorParaTransfer` (linha 293) — 6.564 execuções  
✅ `podePassar` (linha 306) — 487 execuções  
✅ `jogadasLegais` (linha 316) — 11.710 execuções  
✅ `idsNoMotor` (linha 326) — 8.422 execuções  
✅ `jogadaParaND` (linha 340) — 59.782 execuções  
✅ `jogadaParaTT` (linha 375) — 97.376 execuções  
✅ `ids` (linha 377) — 22.489 execuções  
✅ `ultimo` (linha 378) — 15.096 execuções  
✅ `anunciarInicio` (linha 405) — 217 execuções  
✅ `narrarAtivacao` (linha 414) — 51.252 execuções  
✅ `narrarEmpilhamento` (linha 426) — 6.392 execuções  
✅ `encerrar` (linha 456) — 3.478 execuções  
✅ `finalizarMao` (linha 473) — 16 execuções  
✅ `aplicarJogada` (linha 488) — 59.592 execuções  
✅ `carta` (linha 500) — 8.704 execuções

### `src/nucleo/pontuacao.js`

✅ `arredondar` (linha 41) — 18.460 execuções  
✅ `pontuarRede` (linha 49) — 18.887 execuções  
✅ `mediaDePontos` (linha 80) — 2 execuções

### `src/nucleo/rede.js`

✅ `ehOculta` (linha 21) — 17.373 execuções  
✅ `nomeCamada` (linha 26) — 51.787 execuções

### `src/nucleo/traducao.js`

✅ `naipeParaTT` (linha 39) — 2.981 execuções  
✅ `rankDoValor` (linha 42) — 5.358 execuções  
✅ `valorDoRank` (linha 45) — 188.949 execuções  
✅ `cartaParaND` (linha 48) — 5.011 execuções  
✅ `cartaParaTT` (linha 56) — 188.949 execuções  
✅ `idDoNeuronio` (linha 62) — 997.756 execuções  
✅ `lugarDoNeuronio` (linha 65) — 51.255 execuções  
✅ `situacaoDaRede` (linha 77) — 142.064 execuções  
✅ `motivoDaVitoria` (linha 82) — 3.478 execuções

### `src/nucleo/truco.js`

✅ `novaPartida` (linha 18) — 169 execuções  
✅ `proximoValor` (linha 23) — 7.405 execuções  
✅ `ehMaoDeOnze` (linha 29) — 8.050 execuções  
✅ `podeTrucar` (linha 34) — 6.655 execuções  
✅ `pedirTruco` (linha 42) — 15 execuções  
✅ `responderTruco` (linha 53) — 17 execuções  
✅ `marcarTentos` (linha 71) — 14 execuções  
✅ `proximaMao` (linha 79) — 4 execuções

### `src/principal.js`

✅ `remedirAposMudarATela` (linha 25) — 6 execuções  
✅ `criarJogo` (linha 32) — 17 execuções  
✅ `iniciarJogo` (linha 53) — 18 execuções  
✅ `aoGirar` (linha 56) — 2 execuções
