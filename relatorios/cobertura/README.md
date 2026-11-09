# Cobertura dos testes

**Versão 1.0.0** · commit `8d44a5d-dirty` (com as mudanças ainda não registradas) · 08/11/2026, 22:51 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Cobertura medida pelo V8 nos testes de unidade (Node) e nos testes de interface (Chromium, com os módulos de `src/` servidos sem empacotar), juntada pelo c8. Ficam fora da conta só `ferramentas/relatorios.js` (o gerador destes relatórios, que é quem roda os testes) e `src/recursos/` (a foto embutida, sem código).

| | Linhas | Instruções | Ramos | Funções |
|---|---:|---:|---:|---:|
| **Total** | 99,7% | 99,7% | 93,6% | 100,0% |

**Funções e métodos com nome executados pelos testes: 430 de 430 (100,0%).** A coluna "Funções" acima conta também as funções anônimas (callbacks de eventos, de animações e de `map`/`filter`).

## Por arquivo

| Arquivo | Linhas | Ramos | Funções |
|---|---:|---:|---:|
| `ferramentas/documentar.js` | 100,0% | 89,7% | 100,0% |
| `ferramentas/empacotar.js` | 100,0% | 71,4% | 100,0% |
| `ferramentas/simular.js` | 94,3% | 80,0% | 100,0% |
| `ferramentas/versionar.js` | 100,0% | 87,0% | 100,0% |
| `src/aplicacao.js` | 100,0% | 97,4% | 100,0% |
| `src/arte/avatares.js` | 100,0% | 97,5% | 100,0% |
| `src/arte/botoes.js` | 100,0% | 76,5% | 100,0% |
| `src/arte/cartas.js` | 100,0% | 94,8% | 100,0% |
| `src/arte/cartasDeTerreno.js` | 100,0% | 94,7% | 100,0% |
| `src/arte/cenarios.js` | 100,0% | 98,0% | 100,0% |
| `src/arte/emblemas.js` | 100,0% | 100,0% | 100,0% |
| `src/arte/figuras.js` | 100,0% | 91,9% | 100,0% |
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
| `src/cenas/mesa/cenario.js` | 100,0% | 94,9% | 100,0% |
| `src/cenas/mesa/desenho.js` | 99,7% | 96,1% | 100,0% |
| `src/cenas/mesa/dicas.js` | 98,8% | 57,6% | 100,0% |
| `src/cenas/mesa/efeitos.js` | 98,9% | 93,3% | 100,0% |
| `src/cenas/mesa/entrada.js` | 97,1% | 84,5% | 100,0% |
| `src/cenas/mesa/layout.js` | 100,0% | 90,5% | 100,0% |
| `src/cenas/mesa/resultado.js` | 100,0% | 85,0% | 100,0% |
| `src/cenas/mesa/truco.js` | 100,0% | 87,0% | 100,0% |
| `src/cenas/mesa/turnos.js` | 96,1% | 94,1% | 100,0% |
| `src/cenas/recursos.js` | 100,0% | 92,5% | 100,0% |
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
| `src/nucleo/aleatorio.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/baralhos.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/cartas.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/oponentes/comum.js` | 100,0% | 97,7% | 100,0% |
| `src/nucleo/oponentes/estrategias.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/oponentes/index.js` | 100,0% | 90,4% | 100,0% |
| `src/nucleo/partida.js` | 100,0% | 98,2% | 100,0% |
| `src/nucleo/pontuacao.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/rede.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/terrenos.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/truco.js` | 100,0% | 96,8% | 100,0% |
| `src/principal.js` | 100,0% | 81,8% | 100,0% |
| `src/versao.js` | 100,0% | 100,0% | 100,0% |

## Funções e métodos

Cada função ou método com nome e quantas vezes foi executado durante os testes.

### `ferramentas/documentar.js`

✅ `arquivosJs` (linha 16) — 11 execuções  
✅ `limparComentario` (linha 25) — 469 execuções  
✅ `lerModulo` (linha 37) — 62 execuções

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

✅ `iniciar` (linha 30) — 17 execuções  
✅ `salvar` (linha 38) — 71 execuções  
✅ `salvarOpcoes` (linha 41) — 19 execuções  
✅ `alternarSom` (linha 44) — 3 execuções  
✅ `alternarMusica` (linha 54) — 4 execuções  
✅ `jogar` (linha 62) — 15 execuções  
✅ `irParaMenu` (linha 71) — 5 execuções  
✅ `modoImersivo` (linha 82) — 16 execuções  
✅ `registrarMao` (linha 99) — 11 execuções  
✅ `marcarVerbeteLido` (linha 124) — 35 execuções

### `src/arte/avatares.js`

✅ `desenharAvatar` (linha 16) — 85 execuções  
✅ `curve` (linha 30) — 1.785 execuções

### `src/arte/botoes.js`

✅ `desenharFaisca` (linha 10) — 52 execuções  
✅ `desenharBotao` (linha 25) — 101 execuções

### `src/arte/cartas.js`

✅ `dadosDaCarta` (linha 22) — 1.089 execuções  
✅ `simboloDeColecao` (linha 40) — 603 execuções  
✅ `ilustracaoDaCarta` (linha 49) — 531 execuções  
✅ `posicoesDosNaipes` (linha 100) — 694 execuções  
✅ `fileira` (linha 101) — 11.104 execuções  
✅ `desenharCartaCompleta` (linha 118) — 531 execuções  
✅ `desenharCartaDaMesa` (linha 189) — 554 execuções  
✅ `indice` (linha 224) — 1.108 execuções

### `src/arte/cartasDeTerreno.js`

✅ `desenharCartaDeTerreno` (linha 16) — 68 execuções

### `src/arte/cenarios.js`

✅ `perfilDeSerra` (linha 11) — 883 execuções  
✅ `sub` (linha 14) — 112.141 execuções  
✅ `montanhas` (linha 23) — 291 execuções  
✅ `estrelas` (linha 40) — 302 execuções  
✅ `constelacao` (linha 48) — 553 execuções  
✅ `vinheta` (linha 70) — 1.162 execuções  
✅ `raios` (linha 75) — 310 execuções  
✅ `cenarioDoNaipe` (linha 89) — 1.093 execuções

### `src/arte/emblemas.js`

✅ `desenharEmblema` (linha 7) — 3.837 execuções

### `src/arte/figuras.js`

✅ `coroa` (linha 18) — 186 execuções  
✅ `desenharFigura` (linha 41) — 259 execuções

### `src/arte/icones.js`

✅ `svg` (linha 7) — 504 execuções  
✅ `gato` (linha 11) — 36 execuções

### `src/arte/mesas.js`

✅ `desenharFeltro` (linha 12) — 34 execuções  
✅ `vinhetaDaMesa` (linha 36) — 24 execuções  
✅ `fibras` (linha 41) — 17 execuções  
✅ `mesaMontanha` (linha 51) — 6 execuções  
✅ `vitoriaRegia` (linha 97) — 770 execuções  
✅ `mesaPantano` (linha 111) — 11 execuções  
✅ `rosaDosVentos` (linha 145) — 7 execuções  
✅ `mesaOceano` (linha 161) — 7 execuções  
✅ `desenharMesa` (linha 186) — 57 execuções

### `src/arte/moldura.js`

✅ `corpoDaMoldura` (linha 10) — 1.155 execuções  
✅ `placa` (linha 41) — 1.733 execuções  
✅ `gema` (linha 55) — 1.620 execuções

### `src/arte/pincel.js`

✅ `criarTela` (linha 9) — 1.589 execuções  
✅ `caminhoArredondado` (linha 19) — 13.483 execuções  
✅ `hashDoTexto` (linha 30) — 1.469 execuções  
✅ `geradorComSemente` (linha 36) — 1.509 execuções  
✅ `degradeLinear` (linha 45) — 19.377 execuções  
✅ `degradeRadial` (linha 51) — 22.040 execuções  
✅ `escreverComQuebra` (linha 57) — 1.131 execuções  
✅ `ajustarFonte` (linha 71) — 1.287 execuções  
✅ `granulado` (linha 75) — 2.438 execuções  
✅ `escovado` (linha 83) — 1.156 execuções  
✅ `sombraSuave` (linha 92) — 8.030 execuções  
✅ `semSombra` (linha 97) — 12.836 execuções  
✅ `brilho` (linha 99) — 15.157 execuções  
✅ `comAlfa` (linha 104) — 62.359 execuções  
✅ `tonalizar` (linha 109) — 10.166 execuções

### `src/arte/retrato.js`

✅ `caminhoArredondado` (linha 6) — 4 execuções  
✅ `arcoGotico` (linha 11) — 16 execuções  
✅ `dourado` (linha 21) — 4 execuções  
✅ `desenharRetratoEmMoldura` (linha 35) — 4 execuções  
✅ `img.onload` (linha 42) — 4 execuções

### `src/arte/versos.js`

✅ `molduraDourada` (linha 13) — 77 execuções  
✅ `legenda` (linha 26) — 88 execuções  
✅ `versoClassico` (linha 33) — 66 execuções  
✅ `versoTruco` (linha 75) — 8 execuções  
✅ `versoFraternidade` (linha 120) — 5 execuções  
✅ `simboloYinYang` (linha 160) — 6 execuções  
✅ `versoYinYang` (linha 172) — 6 execuções  
✅ `bx` (linha 173) — 1.914 execuções  
✅ `versoPowerBI` (linha 206) — 17 execuções  
✅ `desenharVerso` (linha 278) — 102 execuções

### `src/cenas/CenaCarregamento.js`

✅ `CenaCarregamento` (linha 22) — 16 execuções  
✅ `create` (linha 24) — 16 execuções  
✅ `gerarTexturas` (linha 37) — 16 execuções  
✅ `adicionar` (linha 38) — 160 execuções

### `src/cenas/CenaMenu.js`

✅ `CenaMenu` (linha 17) — 16 execuções  
✅ `create` (linha 19) — 20 execuções  
✅ `espalharCartas` (linha 30) — 20 execuções  
✅ `update` (linha 41) — 624 execuções

### `src/cenas/mesa/CenaMesa.js`

✅ `CenaMesa` (linha 42) — 16 execuções  
✅ `create` (linha 45) — 14 execuções  
✅ `comecar` (linha 68) — 14 execuções  
✅ `update` (linha 74) — 2.137 execuções

### `src/cenas/mesa/cenario.js`

✅ `desenharCenarioFixo` (linha 22) — 14 execuções  
✅ `criarBotao` (linha 54) — 140 execuções  
✅ `textura` (linha 56) — 556 execuções  
✅ `pintar` (linha 69) — 416 execuções  
✅ `temDica` (linha 70) — 37 execuções  
✅ `mostrarDica` (linha 71) — 2 execuções  
✅ `botao.definirRotulo` (linha 93) — 1.564 execuções  
✅ `botao.habilitar` (linha 94) — 2.740 execuções  
✅ `criarPaineis` (linha 106) — 14 execuções  
✅ `criarTexto` (linha 116) — 406 execuções  
✅ `criarPainelEsquerdo` (linha 121) — 14 execuções  
✅ `criarPilha` (linha 129) — 28 execuções  
✅ `criarPlacar` (linha 174) — 14 execuções  
✅ `criarBotoesDeAcao` (linha 203) — 14 execuções  
✅ `p.truco.criarBotao.variante` (linha 205) — 2 execuções  
✅ `p.botaoDropout.criarBotao.dica` (linha 207) — 3 execuções  
✅ `p.botaoTransfer.criarBotao.dica` (linha 208) — 1 execução  
✅ `p.botaoPassar.criarBotao.dica` (linha 209) — 1 execução  
✅ `atualizarBotaoSom` (linha 219) — 16 execuções  
✅ `atualizarChaves` (linha 224) — 19 execuções

### `src/cenas/mesa/desenho.js`

✅ `inspecionar` (linha 27) — 211 execuções  
✅ `mostrarDica` (linha 33) — 817 execuções  
✅ `redesenhar` (linha 38) — 685 execuções  
✅ `desenharMaos` (linha 68) — 685 execuções  
✅ `notaDaCartaDaMao` (linha 106) — 1 execução  
✅ `atualizarPaineis` (linha 114) — 685 execuções  
✅ `textoComDicaDeJogo` (linha 135) — 742 execuções  
✅ `atualizarPilha` (linha 145) — 1.370 execuções  
✅ `atualizarBlocoDoJogador` (linha 166) — 1.370 execuções  
✅ `estaNaVez` (linha 203) — 4.417 execuções  
✅ `desenharDestaqueDaVez` (linha 208) — 1.873 execuções  
✅ `atualizarBotoes` (linha 224) — 685 execuções  
✅ `atualizarRegistro` (linha 237) — 685 execuções  
✅ `desenharCurva` (linha 246) — 685 execuções  
✅ `textoDaDica` (linha 274) — 742 execuções  
✅ `valorSelecionado` (linha 301) — 268 execuções  
✅ `calcularAlvos` (linha 307) — 685 execuções  
✅ `desenharConexoesEAlvos` (linha 337) — 1.873 execuções

### `src/cenas/mesa/dicas.js`

✅ `conceitoCurto` (linha 32) — 8 execuções  
✅ `alternarDicas` (linha 39) — 2 execuções  
✅ `acao` (linha 56) — 1 execução  
✅ `darDicaDoTurno` (linha 69) — 96 execuções  
✅ `textoDaDicaDeJogo` (linha 81) — 742 execuções  
✅ `mostrarDicaDoBotao` (linha 89) — 2 execuções  
✅ `esconderDicaDoBotao` (linha 99) — 19 execuções  
✅ `conteudoDaDica` (linha 105) — 6 execuções  
✅ `dicaDaRespostaAoTruco` (linha 163) — 6 execuções

### `src/cenas/mesa/efeitos.js`

✅ `corCss` (linha 26) — 69 execuções  
✅ `posicaoDoNeuronio` (linha 30) — 152 execuções  
✅ `origemDasCartas` (linha 36) — 19 execuções  
✅ `animarEventos` (linha 46) — 175 execuções  
✅ `animar_ativacao` (linha 58) — 133 execuções  
✅ `animar_tunagem` (linha 76) — 11 execuções  
✅ `animar_ataque` (linha 88) — 8 execuções  
✅ `onComplete` (linha 102) — 8 execuções  
✅ `animar_overfit` (linha 120) — 4 execuções  
✅ `animar_earlystop` (linha 121) — 3 execuções  
✅ `animar_stackoverflow` (linha 122) — 1 execução  
✅ `animar_dropout` (linha 125) — 4 execuções  
✅ `animar_transfer` (linha 138) — 1 execução  
✅ `animar_completa` (linha 147) — 14 execuções  
✅ `animar_vento` (linha 154) — 14 execuções  
✅ `animar_powerbi` (linha 161) — 2 execuções  
✅ `animar_passe` (linha 167) — 10 execuções  
✅ `animar_inicio` (linha 174) — 6 execuções  
✅ `onComplete` (linha 185) — 12 execuções  
✅ `verificarVanishing` (linha 192) — 175 execuções  
✅ `voarCarta` (linha 210) — 22 execuções  
✅ `onComplete` (linha 214) — 22 execuções  
✅ `explodir` (linha 219) — 61 execuções  
✅ `textoFlutuante` (linha 231) — 189 execuções  
✅ `onComplete` (linha 233) — 187 execuções  
✅ `faixa` (linha 237) — 30 execuções  
✅ `onComplete` (linha 241) — 30 execuções  
✅ `falar` (linha 248) — 23 execuções  
✅ `onComplete` (linha 260) — 23 execuções  
✅ `impactoDoTruco` (linha 267) — 10 execuções  
✅ `avisarVerbete` (linha 276) — 551 execuções

### `src/cenas/mesa/entrada.js`

✅ `aoPassarNoNeuronio` (linha 18) — 131 execuções  
✅ `aoClicarNoNeuronio` (linha 50) — 81 execuções  
✅ `aoClicarNaCarta` (linha 72) — 144 execuções  
✅ `cancelarSelecao` (linha 106) — 150 execuções  
✅ `alternarDropout` (linha 114) — 3 execuções  
✅ `fazerTransfer` (linha 121) — 1 execução  
✅ `passarAVez` (linha 129) — 7 execuções  
✅ `perguntarSeVoltaAoMenu` (linha 134) — 2 execuções  
✅ `acao` (linha 137) — 1 execução

### `src/cenas/mesa/layout.js`

✅ `colunaX` (linha 37) — 19.649 execuções  
✅ `linhaY` (linha 39) — 19.579 execuções  
✅ `ajustarCartaDaMesa` (linha 52) — 22.310 execuções  
✅ `ajustarLinha` (linha 62) — 12.482 execuções  
✅ `ajustarBloco` (linha 78) — 1.731 execuções

### `src/cenas/mesa/resultado.js`

✅ `encerrarMao` (linha 29) — 10 execuções  
✅ `comemorar` (linha 67) — 5 execuções  
✅ `faixaDeVitoria` (linha 88) — 5 execuções  
✅ `onComplete` (linha 105) — 5 execuções  
✅ `chuvaDeConfete` (linha 110) — 5 execuções  
✅ `htmlDaRede` (linha 132) — 24 execuções  
✅ `mostrarResultado` (linha 150) — 13 execuções  
✅ `aoFechar` (linha 184) — 3 execuções

### `src/cenas/mesa/truco.js`

✅ `pedirTrucoHumano` (linha 13) — 2 execuções  
✅ `anunciarTruco` (linha 19) — 8 execuções  
✅ `pedirResposta` (linha 32) — 8 execuções  
✅ `acao` (linha 45) — 1 execução  
✅ `acao` (linha 46) — 4 execuções  
✅ `acao` (linha 48) — 1 execução  
✅ `aplicarResposta` (linha 59) — 8 execuções

### `src/cenas/mesa/turnos.js`

✅ `verso` (linha 21) — 22.647 execuções  
✅ `jogadorDeBaixo` (linha 24) — 3.272 execuções  
✅ `jogadorDeCima` (linha 27) — 3.243 execuções  
✅ `avatarDe` (linha 30) — 1.370 execuções  
✅ `ehVezDoHumano` (linha 37) — 5.120 execuções  
✅ `iniciarMao` (linha 46) — 18 execuções  
✅ `criarNeuronios` (linha 82) — 18 execuções  
✅ `executarJogada` (linha 106) — 174 execuções  
✅ `avancar` (linha 125) — 214 execuções  
✅ `anotarNaLinhaDoTempo` (linha 158) — 190 execuções  
✅ `avancarNoInicio` (linha 175) — 8 execuções  
✅ `comecar` (linha 187) — 8 execuções  
✅ `passarAparelho` (linha 194) — 19 execuções  
✅ `acao` (linha 199) — 19 execuções  
✅ `vezDoOponente` (linha 207) — 82 execuções

### `src/cenas/recursos.js`

✅ `prepararTextoNitido` (linha 19) — 16 execuções  
✅ `fabrica.text` (linha 22) — 2.109 execuções  
✅ `ajustarCamera` (linha 35) — 50 execuções  
✅ `ajustar` (linha 39) — 2.866 execuções  
✅ `cena.reajustarCamera` (linha 53) — 34 execuções  
✅ `texturaDaMesa` (linha 61) — 50 execuções  
✅ `colocarFundo` (linha 71) — 34 execuções  
✅ `texturaDoVerso` (linha 82) — 22.695 execuções  
✅ `texturaDaCartaNaMao` (linha 89) — 2.872 execuções  
✅ `texturaDaCartaMedia` (linha 96) — 12 execuções  
✅ `texturaDaCartaNaMesa` (linha 103) — 4.358 execuções  
✅ `criarTexturaDeInspecao` (linha 113) — 16 execuções  
✅ `texturaDeInspecao` (linha 122) — 150 execuções  
✅ `liberarCartasDaMao` (linha 139) — 18 execuções  
✅ `retanguloNaTela` (linha 147) — 2 execuções  
✅ `px` (linha 150) — 6 execuções  
✅ `py` (linha 151) — 6 execuções

### `src/conteudo/conquistas.js`

✅ `meu` (linha 28) — 71 execuções  
✅ `teste` (linha 31) — 12 execuções  
✅ `teste` (linha 32) — 13 execuções  
✅ `teste` (linha 33) — 13 execuções  
✅ `teste` (linha 34) — 13 execuções  
✅ `teste` (linha 35) — 13 execuções  
✅ `teste` (linha 36) — 11 execuções  
✅ `teste` (linha 37) — 11 execuções  
✅ `teste` (linha 38) — 10 execuções  
✅ `teste` (linha 39) — 11 execuções  
✅ `teste` (linha 40) — 11 execuções  
✅ `teste` (linha 41) — 11 execuções  
✅ `teste` (linha 42) — 11 execuções  
✅ `teste` (linha 43) — 11 execuções  
✅ `teste` (linha 44) — 9 execuções  
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

✅ `contarValores` (linha 43) — 5.545 execuções  
✅ `escolherDicaDeJogo` (linha 57) — 5.545 execuções  
✅ `dica` (linha 64) — 4.308 execuções  
✅ `atacavel` (linha 65) — 5.545 execuções

### `src/conteudo/progresso.js`

✅ `progressoInicial` (linha 13) — 24 execuções  
✅ `migrarV1` (linha 22) — 2 execuções  
✅ `carregarProgresso` (linha 34) — 24 execuções  
✅ `salvarProgresso` (linha 46) — 73 execuções

### `src/conteudo/textos.js`

✅ `provocar` (linha 43) — 36 execuções

### `src/interface/menu.js`

✅ `mostrarMiniatura` (linha 36) — 152 execuções  
✅ `opcoesHtml` (linha 45) — 105 execuções  
✅ `htmlDoMenu` (linha 53) — 21 execuções  
✅ `abrirMenu` (linha 83) — 21 execuções  
✅ `campo` (linha 86) — 828 execuções  
✅ `atualizarDicas` (linha 89) — 76 execuções  
✅ `lerEscolhas` (linha 103) — 23 execuções

### `src/interface/musica.js`

✅ `hz` (linha 23) — 2.624 execuções  
✅ `sorteador` (linha 26) — 1.296 execuções  
✅ `voz` (linha 43) — 2.576 execuções  
✅ `chiado` (linha 69) — 447 execuções  
✅ `tambor` (linha 85) — 358 execuções  
✅ `sino` (linha 98) — 12 execuções  
✅ `tocar` (linha 123) — 851 execuções  
✅ `tocar` (linha 145) — 83 execuções  
✅ `tocar` (linha 165) — 279 execuções  
✅ `tocar` (linha 190) — 83 execuções  
✅ `agendar` (linha 216) — 1.179 execuções  
✅ `tocar` (linha 237) — 27 execuções  
✅ `parar` (linha 253) — 29 execuções  
✅ `tocando` (linha 266) — 9 execuções

### `src/interface/paineis.js`

✅ `$` (linha 9) — 237 execuções  
✅ `escaparHtml` (linha 12) — 1.667 execuções  
✅ `abrirPainel` (linha 31) — 102 execuções  
✅ `fechar` (linha 38) — 82 execuções  
✅ `fecharTodos` (linha 51) — 59 execuções  
✅ `mostrarAviso` (linha 62) — 72 execuções  
✅ `mostrarDicaDeJogo` (linha 78) — 4 execuções  
✅ `confirmar` (linha 98) — 30 execuções  
✅ `mostrarDicaFlutuante` (linha 126) — 5 execuções  
✅ `esconderDicaFlutuante` (linha 145) — 48 execuções

### `src/interface/som.js`

✅ `contextoDeAudio` (linha 11) — 35 execuções  
✅ `audio` (linha 14) — 1.032 execuções  
✅ `nota` (linha 33) — 731 execuções  
✅ `ruido` (linha 49) — 250 execuções  
✅ `desbloquear` (linha 65) — 16 execuções  
✅ `definirMudo` (linha 66) — 23 execuções  
✅ `estaMudo` (linha 67) — 22 execuções  
✅ `virarCarta` (linha 68) — 134 execuções  
✅ `colocarCarta` (linha 69) — 8 execuções  
✅ `selecionar` (linha 70) — 153 execuções  
✅ `tunagem` (linha 71) — 12 execuções  
✅ `golpe` (linha 72) — 10 execuções  
✅ `explosao` (linha 73) — 4 execuções  
✅ `dropout` (linha 74) — 5 execuções  
✅ `truco` (linha 79) — 16 execuções  
✅ `vitoria` (linha 88) — 1 execução  
✅ `fanfarra` (linha 94) — 8 execuções  
✅ `campeao` (linha 109) — 2 execuções  
✅ `derrota` (linha 121) — 8 execuções  
✅ `medalha` (linha 122) — 23 execuções

### `src/interface/telas/conquistas.js`

✅ `medalhaHtml` (linha 16) — 97 execuções  
✅ `itemHtml` (linha 23) — 81 execuções  
✅ `abrirConquistas` (linha 33) — 3 execuções

### `src/interface/telas/grimorio.js`

✅ `abrirGrimorio` (linha 14) — 5 execuções  
✅ `desenharLista` (linha 23) — 7 execuções  
✅ `mostrar` (linha 31) — 7 execuções

### `src/interface/telas/regras.js`

✅ `listaDeExtensoes` (linha 9) — 19 execuções  
✅ `abrirRegras` (linha 20) — 19 execuções

### `src/interface/telas/revisao.js`

✅ `tipoDoPasso` (linha 31) — 260 execuções  
✅ `variacoes` (linha 45) — 14 execuções  
✅ `momentosChave` (linha 53) — 5 execuções  
✅ `contagens` (linha 72) — 5 execuções  
✅ `graficoDaCurva` (linha 82) — 4 execuções  
✅ `x` (linha 88) — 182 execuções  
✅ `y` (linha 89) — 236 execuções  
✅ `linhaDoTempoHtml` (linha 120) — 5 execuções  
✅ `tabelaDaPartida` (linha 140) — 4 execuções  
✅ `abrirRevisao` (linha 151) — 5 execuções  
✅ `linha` (linha 155) — 10 execuções  
✅ `qtd` (linha 158) — 43 execuções

### `src/interface/telas/sobre.js`

✅ `abrirSobre` (linha 8) — 3 execuções

### `src/nucleo/aleatorio.js`

✅ `sortear` (linha 13) — 2.169.011 execuções  
✅ `sortearInteiro` (linha 25) — 2.168.611 execuções  
✅ `embaralhar` (linha 36) — 51.377 execuções  
✅ `sementeNova` (linha 45) — 20 execuções

### `src/nucleo/baralhos.js`

✅ `montar` (linha 36) — 2 execuções  
✅ `pontosDaCarta` (linha 59) — 2.490.498 execuções  
✅ `nomeDaCarta` (linha 69) — 1.224 execuções  
✅ `manilhaDaCarta` (linha 76) — 2 execuções

### `src/nucleo/cartas.js`

✅ `ehFigura` (linha 40) — 4.943.119 execuções  
✅ `rotuloCarta` (linha 45) — 474.605 execuções  
✅ `baralhoPadrao` (linha 50) — 18.016 execuções

### `src/nucleo/oponentes/comum.js`

✅ `cartasOcultas` (linha 16) — 33.493 execuções  
✅ `determinizar` (linha 27) — 33.366 execuções  
✅ `pontosEsperadosPorCamada` (linha 39) — 126 execuções  
✅ `projecao` (linha 44) — 2.314 execuções  
✅ `avaliar` (linha 56) — 1.234 execuções  
✅ `agruparEquivalentes` (linha 72) — 154 execuções  
✅ `concretizar` (linha 91) — 26.567 execuções  
✅ `jogadaRapida` (linha 98) — 217.283 execuções  
✅ `simularAteOFim` (linha 132) — 27.724 execuções  
✅ `chanceDeVitoria` (linha 139) — 64 execuções

### `src/nucleo/oponentes/estrategias.js`

✅ `jogadaAleatoria` (linha 14) — 260.077 execuções  
✅ `jogadaGulosa` (linha 25) — 125 execuções  
✅ `jogadaMonteCarlo` (linha 49) — 28 execuções

### `src/nucleo/oponentes/index.js`

✅ `cartaDeInicio` (linha 29) — 20 execuções  
✅ `forca` (linha 37) — 252 execuções  
✅ `escolherJogada` (linha 48) — 204 execuções  
✅ `querTrucar` (linha 60) — 65 execuções  
✅ `responderAoTruco` (linha 73) — 20 execuções

### `src/nucleo/partida.js`

✅ `novoJogador` (linha 53) — 35.974 execuções  
✅ `novaMao` (linha 71) — 17.987 execuções  
✅ `reindexar` (linha 105) — 35.604 execuções  
✅ `copiarMao` (linha 115) — 35.604 execuções  
✅ `emitir` (linha 131) — 651.081 execuções  
✅ `anotar` (linha 136) — 632.674 execuções  
✅ `anotarHistorico` (linha 141) — 508.011 execuções  
✅ `fronteira` (linha 148) — 932.250 execuções  
✅ `alvosDeAtivacao` (linha 154) — 942.252 execuções  
✅ `alvosDeEmpilhamento` (linha 163) — 517.780 execuções  
✅ `efeitoDoEmpilhamento` (linha 178) — 98.583 execuções  
✅ `podeEmpilhar` (linha 188) — 34.883 execuções  
✅ `camadasDesfaziveis` (linha 201) — 19.617 execuções  
✅ `valorParaTransfer` (linha 208) — 488.673 execuções  
✅ `podePassar` (linha 218) — 31.191 execuções  
✅ `combinacoes` (linha 223) — 14 execuções  
✅ `recursao` (linha 225) — 49 execuções  
✅ `jogadasLegais` (linha 238) — 482.766 execuções  
✅ `tirarDaMao` (linha 272) — 48.689 execuções  
✅ `finalizarRede` (linha 281) — 86.063 execuções  
✅ `trocarMaoPowerBI` (linha 288) — 48.688 execuções  
✅ `encerrarTurno` (linha 300) — 490.024 execuções  
✅ `resolverInicio` (linha 316) — 14 execuções  
✅ `ativar` (linha 341) — 424.489 execuções  
✅ `empilhar` (linha 360) — 34.709 execuções  
✅ `fazerDropout` (linha 405) — 13.978 execuções  
✅ `fazerTransfer` (linha 425) — 4 execuções  
✅ `aplicarJogada` (linha 450) — 504.037 execuções  
✅ `somaDasMelhores` (linha 479) — 2.788 execuções  
✅ `cartaMaisAlta` (linha 487) — 104 execuções  
✅ `filtrarMaiores` (linha 497) — 47.394 execuções  
✅ `encerrarMao` (linha 503) — 45.682 execuções

### `src/nucleo/pontuacao.js`

✅ `pontuarNeuronios` (linha 40) — 667.783 execuções  
✅ `aplicarFraternidade` (linha 77) — 49.227 execuções  
✅ `encontrarCombos` (linha 88) — 667.783 execuções  
✅ `pontuarRede` (linha 120) — 667.783 execuções  
✅ `mediaDePontos` (linha 132) — 128 execuções

### `src/nucleo/rede.js`

✅ `ehOculta` (linha 21) — 881.471 execuções  
✅ `nomeCamada` (linha 26) — 424.905 execuções

### `src/nucleo/truco.js`

✅ `novaPartida` (linha 18) — 161 execuções  
✅ `proximoValor` (linha 23) — 6.638 execuções  
✅ `ehMaoDeOnze` (linha 29) — 7.155 execuções  
✅ `podeTrucar` (linha 34) — 5.988 execuções  
✅ `pedirTruco` (linha 42) — 11 execuções  
✅ `responderTruco` (linha 53) — 12 execuções  
✅ `marcarTentos` (linha 71) — 13 execuções  
✅ `proximaMao` (linha 79) — 4 execuções

### `src/principal.js`

✅ `criarJogo` (linha 19) — 16 execuções  
✅ `iniciarJogo` (linha 35) — 17 execuções  
✅ `aoGirar` (linha 38) — 2 execuções
