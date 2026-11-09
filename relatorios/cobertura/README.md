# Cobertura dos testes

**Versão 1.1.2** · 09/11/2026, 19:51 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Cobertura medida pelo V8 nos testes de unidade (Node) e nos testes de interface (Chromium, com os módulos de `src/` servidos sem empacotar), juntada pelo c8. Ficam fora da conta só `ferramentas/relatorios.js` (o gerador destes relatórios, que é quem roda os testes) e `src/recursos/` (a foto embutida, sem código).

| | Linhas | Instruções | Ramos | Funções |
|---|---:|---:|---:|---:|
| **Total** | 99,7% | 99,7% | 93,7% | 100,0% |

**Funções e métodos com nome executados pelos testes: 437 de 437 (100,0%).** A coluna "Funções" acima conta também as funções anônimas (callbacks de eventos, de animações e de `map`/`filter`).

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
| `src/cenas/mesa/desenho.js` | 99,7% | 96,1% | 100,0% |
| `src/cenas/mesa/dicas.js` | 98,8% | 60,0% | 100,0% |
| `src/cenas/mesa/efeitos.js` | 98,9% | 94,5% | 100,0% |
| `src/cenas/mesa/entrada.js` | 97,9% | 85,9% | 100,0% |
| `src/cenas/mesa/layout.js` | 100,0% | 100,0% | 100,0% |
| `src/cenas/mesa/resultado.js` | 100,0% | 84,9% | 100,0% |
| `src/cenas/mesa/truco.js` | 100,0% | 87,0% | 100,0% |
| `src/cenas/mesa/turnos.js` | 96,1% | 94,1% | 100,0% |
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
| `src/nucleo/aleatorio.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/baralhos.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/cartas.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/oponentes/comum.js` | 100,0% | 96,5% | 100,0% |
| `src/nucleo/oponentes/estrategias.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/oponentes/index.js` | 100,0% | 92,2% | 100,0% |
| `src/nucleo/partida.js` | 100,0% | 98,2% | 100,0% |
| `src/nucleo/pontuacao.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/rede.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/terrenos.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/truco.js` | 100,0% | 96,8% | 100,0% |
| `src/principal.js` | 100,0% | 85,7% | 100,0% |
| `src/versao.js` | 100,0% | 100,0% | 100,0% |

## Funções e métodos

Cada função ou método com nome e quantas vezes foi executado durante os testes.

### `ferramentas/documentar.js`

✅ `arquivosJs` (linha 16) — 11 execuções  
✅ `limparComentario` (linha 25) — 472 execuções  
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

✅ `desenharFaisca` (linha 10) — 60 execuções  
✅ `desenharBotao` (linha 25) — 91 execuções

### `src/arte/cartas.js`

✅ `dadosDaCarta` (linha 22) — 1.157 execuções  
✅ `simboloDeColecao` (linha 40) — 638 execuções  
✅ `ilustracaoDaCarta` (linha 49) — 562 execuções  
✅ `posicoesDosNaipes` (linha 100) — 716 execuções  
✅ `fileira` (linha 101) — 11.456 execuções  
✅ `desenharCartaCompleta` (linha 118) — 562 execuções  
✅ `desenharCartaDaMesa` (linha 189) — 591 execuções  
✅ `indice` (linha 224) — 1.182 execuções

### `src/arte/cartasDeTerreno.js`

✅ `desenharCartaDeTerreno` (linha 16) — 72 execuções

### `src/arte/cenarios.js`

✅ `perfilDeSerra` (linha 11) — 914 execuções  
✅ `sub` (linha 14) — 116.078 execuções  
✅ `montanhas` (linha 23) — 301 execuções  
✅ `estrelas` (linha 40) — 313 execuções  
✅ `constelacao` (linha 48) — 585 execuções  
✅ `vinheta` (linha 70) — 1.234 execuções  
✅ `raios` (linha 75) — 309 execuções  
✅ `cenarioDoNaipe` (linha 89) — 1.161 execuções

### `src/arte/emblemas.js`

✅ `desenharEmblema` (linha 7) — 3.990 execuções

### `src/arte/figuras.js`

✅ `coroa` (linha 18) — 214 execuções  
✅ `desenharFigura` (linha 41) — 290 execuções

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

✅ `corpoDaMoldura` (linha 10) — 1.227 execuções  
✅ `placa` (linha 41) — 1.834 execuções  
✅ `gema` (linha 55) — 1.719 execuções

### `src/arte/pincel.js`

✅ `criarTela` (linha 9) — 1.670 execuções  
✅ `caminhoArredondado` (linha 19) — 14.198 execuções  
✅ `hashDoTexto` (linha 30) — 1.540 execuções  
✅ `geradorComSemente` (linha 36) — 1.582 execuções  
✅ `degradeLinear` (linha 45) — 20.420 execuções  
✅ `degradeRadial` (linha 51) — 23.070 execuções  
✅ `escreverComQuebra` (linha 57) — 1.197 execuções  
✅ `ajustarFonte` (linha 71) — 1.361 execuções  
✅ `granulado` (linha 75) — 2.573 execuções  
✅ `escovado` (linha 83) — 1.228 execuções  
✅ `sombraSuave` (linha 92) — 8.440 execuções  
✅ `semSombra` (linha 97) — 13.452 execuções  
✅ `brilho` (linha 99) — 15.826 execuções  
✅ `comAlfa` (linha 104) — 64.872 execuções  
✅ `tonalizar` (linha 109) — 10.931 execuções

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
✅ `update` (linha 41) — 648 execuções

### `src/cenas/mesa/CenaMesa.js`

✅ `CenaMesa` (linha 42) — 17 execuções  
✅ `create` (linha 45) — 15 execuções  
✅ `comecar` (linha 68) — 15 execuções  
✅ `update` (linha 74) — 2.267 execuções

### `src/cenas/mesa/cenario.js`

✅ `desenharCenarioFixo` (linha 20) — 15 execuções  
✅ `criarBotao` (linha 52) — 90 execuções  
✅ `textura` (linha 54) — 581 execuções  
✅ `pintar` (linha 73) — 491 execuções  
✅ `temDica` (linha 74) — 33 execuções  
✅ `mostrarDica` (linha 75) — 2 execuções  
✅ `botao.definirRotulo` (linha 97) — 1.684 execuções  
✅ `botao.habilitar` (linha 98) — 3.136 execuções  
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

✅ `inspecionar` (linha 27) — 263 execuções  
✅ `mostrarDica` (linha 33) — 959 execuções  
✅ `redesenhar` (linha 38) — 784 execuções  
✅ `desenharMaos` (linha 68) — 784 execuções  
✅ `notaDaCartaDaMao` (linha 106) — 1 execução  
✅ `atualizarPaineis` (linha 114) — 784 execuções  
✅ `textoComDicaDeJogo` (linha 135) — 853 execuções  
✅ `atualizarPilha` (linha 145) — 1.568 execuções  
✅ `atualizarBlocoDoJogador` (linha 166) — 1.568 execuções  
✅ `estaNaVez` (linha 203) — 4.755 execuções  
✅ `desenharDestaqueDaVez` (linha 208) — 1.980 execuções  
✅ `atualizarBotoes` (linha 224) — 784 execuções  
✅ `atualizarRegistro` (linha 237) — 784 execuções  
✅ `desenharCurva` (linha 246) — 784 execuções  
✅ `textoDaDica` (linha 274) — 853 execuções  
✅ `valorSelecionado` (linha 301) — 266 execuções  
✅ `calcularAlvos` (linha 307) — 784 execuções  
✅ `desenharConexoesEAlvos` (linha 337) — 1.980 execuções

### `src/cenas/mesa/dicas.js`

✅ `conceitoCurto` (linha 32) — 8 execuções  
✅ `alternarDicas` (linha 39) — 2 execuções  
✅ `acao` (linha 56) — 1 execução  
✅ `darDicaDoTurno` (linha 69) — 116 execuções  
✅ `textoDaDicaDeJogo` (linha 81) — 853 execuções  
✅ `mostrarDicaDoBotao` (linha 89) — 2 execuções  
✅ `esconderDicaDoBotao` (linha 99) — 17 execuções  
✅ `conteudoDaDica` (linha 105) — 6 execuções  
✅ `dicaDaRespostaAoTruco` (linha 163) — 6 execuções

### `src/cenas/mesa/efeitos.js`

✅ `corCss` (linha 26) — 115 execuções  
✅ `posicaoDoNeuronio` (linha 30) — 197 execuções  
✅ `origemDasCartas` (linha 36) — 36 execuções  
✅ `animarEventos` (linha 46) — 228 execuções  
✅ `animar_ativacao` (linha 58) — 161 execuções  
✅ `animar_tunagem` (linha 76) — 13 execuções  
✅ `animar_ataque` (linha 88) — 23 execuções  
✅ `onComplete` (linha 102) — 23 execuções  
✅ `animar_overfit` (linha 120) — 19 execuções  
✅ `animar_earlystop` (linha 121) — 3 execuções  
✅ `animar_stackoverflow` (linha 122) — 1 execução  
✅ `animar_dropout` (linha 125) — 9 execuções  
✅ `animar_transfer` (linha 138) — 1 execução  
✅ `animar_completa` (linha 147) — 14 execuções  
✅ `animar_vento` (linha 154) — 16 execuções  
✅ `animar_powerbi` (linha 161) — 3 execuções  
✅ `animar_passe` (linha 167) — 13 execuções  
✅ `animar_inicio` (linha 174) — 6 execuções  
✅ `onComplete` (linha 185) — 12 execuções  
✅ `verificarVanishing` (linha 192) — 228 execuções  
✅ `voarCarta` (linha 210) — 39 execuções  
✅ `onComplete` (linha 214) — 39 execuções  
✅ `explodir` (linha 219) — 92 execuções  
✅ `textoFlutuante` (linha 231) — 224 execuções  
✅ `onComplete` (linha 233) — 222 execuções  
✅ `faixa` (linha 237) — 50 execuções  
✅ `onComplete` (linha 241) — 50 execuções  
✅ `falar` (linha 248) — 36 execuções  
✅ `onComplete` (linha 260) — 36 execuções  
✅ `impactoDoTruco` (linha 267) — 10 execuções  
✅ `avisarVerbete` (linha 276) — 704 execuções

### `src/cenas/mesa/entrada.js`

✅ `aoPassarNoNeuronio` (linha 20) — 167 execuções  
✅ `aoClicarNoNeuronio` (linha 52) — 105 execuções  
✅ `aoClicarNaCarta` (linha 74) — 143 execuções  
✅ `cancelarSelecao` (linha 108) — 145 execuções  
✅ `alternarDropout` (linha 116) — 3 execuções  
✅ `fazerTransfer` (linha 123) — 1 execução  
✅ `passarAVez` (linha 131) — 2 execuções  
✅ `abrirRegrasDaMesa` (linha 139) — 4 execuções  
✅ `regras` (linha 151) — 1 execução  
✅ `grimorio` (linha 152) — 1 execução  
✅ `dicas` (linha 153) — 2 execuções  
✅ `abrirMenuDaMesa` (linha 166) — 4 execuções  
✅ `q` (linha 175) — 12 execuções  
✅ `perguntarSeVoltaAoMenu` (linha 183) — 2 execuções  
✅ `acao` (linha 186) — 1 execução

### `src/cenas/mesa/layout.js`

✅ `colunaX` (linha 47) — 19.647 execuções  
✅ `linhaY` (linha 49) — 19.573 execuções  
✅ `ajustarCartaDaMesa` (linha 62) — 24.916 execuções  
✅ `ajustarLinha` (linha 72) — 14.209 execuções  
✅ `ajustarBloco` (linha 88) — 2.025 execuções

### `src/cenas/mesa/resultado.js`

✅ `encerrarMao` (linha 29) — 10 execuções  
✅ `comemorar` (linha 67) — 7 execuções  
✅ `faixaDeVitoria` (linha 88) — 7 execuções  
✅ `onComplete` (linha 105) — 7 execuções  
✅ `chuvaDeConfete` (linha 110) — 7 execuções  
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

✅ `verso` (linha 21) — 24.396 execuções  
✅ `jogadorDeBaixo` (linha 24) — 3.597 execuções  
✅ `jogadorDeCima` (linha 27) — 3.548 execuções  
✅ `avatarDe` (linha 30) — 1.568 execuções  
✅ `ehVezDoHumano` (linha 37) — 5.634 execuções  
✅ `iniciarMao` (linha 46) — 19 execuções  
✅ `criarNeuronios` (linha 82) — 19 execuções  
✅ `executarJogada` (linha 106) — 227 execuções  
✅ `avancar` (linha 125) — 273 execuções  
✅ `anotarNaLinhaDoTempo` (linha 158) — 243 execuções  
✅ `avancarNoInicio` (linha 175) — 8 execuções  
✅ `comecar` (linha 187) — 8 execuções  
✅ `passarAparelho` (linha 194) — 24 execuções  
✅ `acao` (linha 199) — 24 execuções  
✅ `vezDoOponente` (linha 207) — 109 execuções

### `src/cenas/recursos.js`

✅ `prepararTextoNitido` (linha 19) — 17 execuções  
✅ `fabrica.text` (linha 22) — 2.223 execuções  
✅ `ajustarCamera` (linha 35) — 53 execuções  
✅ `ajustar` (linha 39) — 3.048 execuções  
✅ `cena.reajustarCamera` (linha 53) — 36 execuções  
✅ `texturaDaMesa` (linha 61) — 53 execuções  
✅ `colocarFundo` (linha 71) — 36 execuções  
✅ `texturaDoVerso` (linha 82) — 24.447 execuções  
✅ `texturaDaCartaNaMao` (linha 89) — 2.790 execuções  
✅ `texturaDaCartaMedia` (linha 96) — 12 execuções  
✅ `texturaDaCartaNaMesa` (linha 103) — 5.463 execuções  
✅ `criarTexturaDeInspecao` (linha 113) — 17 execuções  
✅ `texturaDeInspecao` (linha 122) — 190 execuções  
✅ `liberarCartasDaMao` (linha 139) — 19 execuções  
✅ `retanguloNaTela` (linha 147) — 2 execuções  
✅ `px` (linha 150) — 6 execuções  
✅ `py` (linha 151) — 6 execuções

### `src/conteudo/conquistas.js`

✅ `meu` (linha 28) — 75 execuções  
✅ `teste` (linha 31) — 11 execuções  
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
✅ `teste` (linha 44) — 8 execuções  
✅ `teste` (linha 45) — 11 execuções  
✅ `teste` (linha 46) — 11 execuções  
✅ `teste` (linha 47) — 11 execuções  
✅ `teste` (linha 48) — 11 execuções  
✅ `teste` (linha 49) — 11 execuções  
✅ `teste` (linha 50) — 13 execuções  
✅ `teste` (linha 51) — 12 execuções  
✅ `teste` (linha 52) — 13 execuções  
✅ `teste` (linha 53) — 13 execuções  
✅ `teste` (linha 54) — 13 execuções  
✅ `teste` (linha 55) — 13 execuções  
✅ `teste` (linha 56) — 11 execuções  
✅ `teste` (linha 57) — 13 execuções

### `src/conteudo/dicasDeJogo.js`

✅ `contarValores` (linha 43) — 5.465 execuções  
✅ `escolherDicaDeJogo` (linha 57) — 5.465 execuções  
✅ `dica` (linha 64) — 4.212 execuções  
✅ `atacavel` (linha 65) — 5.465 execuções

### `src/conteudo/progresso.js`

✅ `progressoInicial` (linha 13) — 25 execuções  
✅ `migrarV1` (linha 22) — 2 execuções  
✅ `carregarProgresso` (linha 34) — 25 execuções  
✅ `salvarProgresso` (linha 46) — 75 execuções

### `src/conteudo/textos.js`

✅ `provocar` (linha 43) — 49 execuções

### `src/interface/menu.js`

✅ `mostrarMiniatura` (linha 36) — 160 execuções  
✅ `opcoesHtml` (linha 45) — 110 execuções  
✅ `htmlDoMenu` (linha 53) — 22 execuções  
✅ `abrirMenu` (linha 83) — 22 execuções  
✅ `campo` (linha 86) — 870 execuções  
✅ `atualizarDicas` (linha 89) — 80 execuções  
✅ `lerEscolhas` (linha 103) — 24 execuções

### `src/interface/musica.js`

✅ `hz` (linha 23) — 2.715 execuções  
✅ `sorteador` (linha 26) — 1.344 execuções  
✅ `voz` (linha 43) — 2.671 execuções  
✅ `chiado` (linha 69) — 485 execuções  
✅ `tambor` (linha 85) — 359 execuções  
✅ `sino` (linha 98) — 11 execuções  
✅ `tocar` (linha 123) — 933 execuções  
✅ `tocar` (linha 145) — 88 execuções  
✅ `tocar` (linha 165) — 248 execuções  
✅ `tocar` (linha 190) — 75 execuções  
✅ `agendar` (linha 216) — 1.240 execuções  
✅ `tocar` (linha 237) — 28 execuções  
✅ `parar` (linha 253) — 30 execuções  
✅ `tocando` (linha 266) — 9 execuções

### `src/interface/paineis.js`

✅ `$` (linha 9) — 257 execuções  
✅ `escaparHtml` (linha 12) — 1.785 execuções  
✅ `abrirPainel` (linha 31) — 117 execuções  
✅ `fechar` (linha 38) — 96 execuções  
✅ `fecharTodos` (linha 51) — 61 execuções  
✅ `mostrarAviso` (linha 62) — 75 execuções  
✅ `mostrarDicaDeJogo` (linha 78) — 4 execuções  
✅ `confirmar` (linha 98) — 35 execuções  
✅ `mostrarDicaFlutuante` (linha 126) — 5 execuções  
✅ `esconderDicaFlutuante` (linha 145) — 46 execuções

### `src/interface/som.js`

✅ `contextoDeAudio` (linha 11) — 36 execuções  
✅ `audio` (linha 14) — 1.189 execuções  
✅ `nota` (linha 33) — 831 execuções  
✅ `ruido` (linha 49) — 305 execuções  
✅ `desbloquear` (linha 65) — 17 execuções  
✅ `definirMudo` (linha 66) — 24 execuções  
✅ `estaMudo` (linha 67) — 32 execuções  
✅ `virarCarta` (linha 68) — 162 execuções  
✅ `colocarCarta` (linha 69) — 8 execuções  
✅ `selecionar` (linha 70) — 150 execuções  
✅ `tunagem` (linha 71) — 14 execuções  
✅ `golpe` (linha 72) — 25 execuções  
✅ `explosao` (linha 73) — 4 execuções  
✅ `dropout` (linha 74) — 10 execuções  
✅ `truco` (linha 79) — 16 execuções  
✅ `vitoria` (linha 88) — 1 execução  
✅ `fanfarra` (linha 94) — 10 execuções  
✅ `campeao` (linha 109) — 2 execuções  
✅ `derrota` (linha 121) — 6 execuções  
✅ `medalha` (linha 122) — 25 execuções

### `src/interface/telas/conquistas.js`

✅ `medalhaHtml` (linha 16) — 102 execuções  
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

✅ `tipoDoPasso` (linha 31) — 348 execuções  
✅ `variacoes` (linha 45) — 14 execuções  
✅ `momentosChave` (linha 53) — 5 execuções  
✅ `contagens` (linha 72) — 5 execuções  
✅ `graficoDaCurva` (linha 82) — 4 execuções  
✅ `x` (linha 88) — 246 execuções  
✅ `y` (linha 89) — 296 execuções  
✅ `linhaDoTempoHtml` (linha 120) — 5 execuções  
✅ `tabelaDaPartida` (linha 140) — 4 execuções  
✅ `abrirRevisao` (linha 151) — 5 execuções  
✅ `linha` (linha 155) — 10 execuções  
✅ `qtd` (linha 158) — 45 execuções

### `src/interface/telas/sobre.js`

✅ `abrirSobre` (linha 8) — 3 execuções

### `src/nucleo/aleatorio.js`

✅ `sortear` (linha 13) — 2.215.274 execuções  
✅ `sortearInteiro` (linha 25) — 2.214.874 execuções  
✅ `embaralhar` (linha 36) — 54.428 execuções  
✅ `sementeNova` (linha 45) — 21 execuções

### `src/nucleo/baralhos.js`

✅ `montar` (linha 36) — 2 execuções  
✅ `pontosDaCarta` (linha 59) — 2.492.402 execuções  
✅ `nomeDaCarta` (linha 69) — 1.320 execuções  
✅ `manilhaDaCarta` (linha 76) — 2 execuções

### `src/nucleo/cartas.js`

✅ `ehFigura` (linha 40) — 5.002.527 execuções  
✅ `rotuloCarta` (linha 45) — 504.266 execuções  
✅ `baralhoPadrao` (linha 50) — 18.421 execuções

### `src/nucleo/oponentes/comum.js`

✅ `cartasOcultas` (linha 16) — 36.160 execuções  
✅ `determinizar` (linha 27) — 36.010 execuções  
✅ `pontosEsperadosPorCamada` (linha 39) — 149 execuções  
✅ `projecao` (linha 44) — 2.828 execuções  
✅ `avaliar` (linha 56) — 1.480 execuções  
✅ `agruparEquivalentes` (linha 72) — 186 execuções  
✅ `concretizar` (linha 91) — 29.317 execuções  
✅ `jogadaRapida` (linha 98) — 255.984 execuções  
✅ `simularAteOFim` (linha 132) — 30.244 execuções  
✅ `chanceDeVitoria` (linha 139) — 66 execuções

### `src/nucleo/oponentes/estrategias.js`

✅ `jogadaAleatoria` (linha 14) — 266.121 execuções  
✅ `jogadaGulosa` (linha 25) — 148 execuções  
✅ `jogadaMonteCarlo` (linha 49) — 37 execuções

### `src/nucleo/oponentes/index.js`

✅ `cartaDeInicio` (linha 29) — 20 execuções  
✅ `forca` (linha 37) — 246 execuções  
✅ `escolherJogada` (linha 48) — 256 execuções  
✅ `querTrucar` (linha 60) — 67 execuções  
✅ `responderAoTruco` (linha 73) — 20 execuções

### `src/nucleo/partida.js`

✅ `novoJogador` (linha 53) — 36.782 execuções  
✅ `novaMao` (linha 71) — 18.391 execuções  
✅ `reindexar` (linha 105) — 38.310 execuções  
✅ `copiarMao` (linha 115) — 38.310 execuções  
✅ `emitir` (linha 131) — 704.913 execuções  
✅ `anotar` (linha 136) — 686.057 execuções  
✅ `anotarHistorico` (linha 141) — 558.689 execuções  
✅ `fronteira` (linha 148) — 975.075 execuções  
✅ `alvosDeAtivacao` (linha 154) — 1.042.375 execuções  
✅ `alvosDeEmpilhamento` (linha 163) — 558.333 execuções  
✅ `efeitoDoEmpilhamento` (linha 178) — 89.170 execuções  
✅ `podeEmpilhar` (linha 188) — 30.625 execuções  
✅ `camadasDesfaziveis` (linha 201) — 16.917 execuções  
✅ `valorParaTransfer` (linha 208) — 533.413 execuções  
✅ `podePassar` (linha 218) — 51.317 execuções  
✅ `combinacoes` (linha 223) — 14 execuções  
✅ `recursao` (linha 225) — 49 execuções  
✅ `jogadasLegais` (linha 238) — 527.578 execuções  
✅ `tirarDaMao` (linha 272) — 41.665 execuções  
✅ `finalizarRede` (linha 281) — 88.263 execuções  
✅ `trocarMaoPowerBI` (linha 288) — 41.664 execuções  
✅ `encerrarTurno` (linha 300) — 540.298 execuções  
✅ `resolverInicio` (linha 316) — 14 execuções  
✅ `ativar` (linha 341) — 458.909 execuções  
✅ `empilhar` (linha 360) — 30.436 execuções  
✅ `fazerDropout` (linha 405) — 11.225 execuções  
✅ `fazerTransfer` (linha 425) — 6 execuções  
✅ `aplicarJogada` (linha 450) — 551.558 execuções  
✅ `somaDasMelhores` (linha 479) — 2.928 execuções  
✅ `cartaMaisAlta` (linha 487) — 104 execuções  
✅ `filtrarMaiores` (linha 497) — 50.576 execuções  
✅ `encerrarMao` (linha 503) — 48.592 execuções

### `src/nucleo/pontuacao.js`

✅ `pontuarNeuronios` (linha 40) — 687.155 execuções  
✅ `aplicarFraternidade` (linha 77) — 53.371 execuções  
✅ `encontrarCombos` (linha 88) — 687.155 execuções  
✅ `pontuarRede` (linha 120) — 687.155 execuções  
✅ `mediaDePontos` (linha 132) — 151 execuções

### `src/nucleo/rede.js`

✅ `ehOculta` (linha 21) — 923.163 execuções  
✅ `nomeCamada` (linha 26) — 459.379 execuções

### `src/nucleo/truco.js`

✅ `novaPartida` (linha 18) — 162 execuções  
✅ `proximoValor` (linha 23) — 6.675 execuções  
✅ `ehMaoDeOnze` (linha 29) — 7.307 execuções  
✅ `podeTrucar` (linha 34) — 5.940 execuções  
✅ `pedirTruco` (linha 42) — 11 execuções  
✅ `responderTruco` (linha 53) — 12 execuções  
✅ `marcarTentos` (linha 71) — 13 execuções  
✅ `proximaMao` (linha 79) — 4 execuções

### `src/principal.js`

✅ `remedirAposMudarATela` (linha 25) — 6 execuções  
✅ `criarJogo` (linha 32) — 17 execuções  
✅ `iniciarJogo` (linha 53) — 18 execuções  
✅ `aoGirar` (linha 56) — 2 execuções
