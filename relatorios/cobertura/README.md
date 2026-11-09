# Cobertura dos testes

**Versão 1.1.1** · 09/11/2026, 00:40 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Cobertura medida pelo V8 nos testes de unidade (Node) e nos testes de interface (Chromium, com os módulos de `src/` servidos sem empacotar), juntada pelo c8. Ficam fora da conta só `ferramentas/relatorios.js` (o gerador destes relatórios, que é quem roda os testes) e `src/recursos/` (a foto embutida, sem código).

| | Linhas | Instruções | Ramos | Funções |
|---|---:|---:|---:|---:|
| **Total** | 99,7% | 99,7% | 93,7% | 100,0% |

**Funções e métodos com nome executados pelos testes: 431 de 431 (100,0%).** A coluna "Funções" acima conta também as funções anônimas (callbacks de eventos, de animações e de `map`/`filter`).

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
| `src/arte/cartas.js` | 100,0% | 94,7% | 100,0% |
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
| `src/cenas/mesa/cenario.js` | 100,0% | 94,9% | 100,0% |
| `src/cenas/mesa/desenho.js` | 99,7% | 95,6% | 100,0% |
| `src/cenas/mesa/dicas.js` | 98,8% | 59,3% | 100,0% |
| `src/cenas/mesa/efeitos.js` | 98,9% | 94,5% | 100,0% |
| `src/cenas/mesa/entrada.js` | 97,1% | 84,7% | 100,0% |
| `src/cenas/mesa/layout.js` | 100,0% | 90,5% | 100,0% |
| `src/cenas/mesa/resultado.js` | 100,0% | 85,0% | 100,0% |
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
| `src/nucleo/oponentes/comum.js` | 100,0% | 97,7% | 100,0% |
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
✅ `limparComentario` (linha 25) — 471 execuções  
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
✅ `salvar` (linha 38) — 74 execuções  
✅ `salvarOpcoes` (linha 41) — 20 execuções  
✅ `alternarSom` (linha 44) — 4 execuções  
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

✅ `desenharFaisca` (linha 10) — 57 execuções  
✅ `desenharBotao` (linha 25) — 108 execuções

### `src/arte/cartas.js`

✅ `dadosDaCarta` (linha 22) — 1.127 execuções  
✅ `simboloDeColecao` (linha 40) — 625 execuções  
✅ `ilustracaoDaCarta` (linha 49) — 549 execuções  
✅ `posicoesDosNaipes` (linha 100) — 720 execuções  
✅ `fileira` (linha 101) — 11.520 execuções  
✅ `desenharCartaCompleta` (linha 118) — 549 execuções  
✅ `desenharCartaDaMesa` (linha 189) — 574 execuções  
✅ `indice` (linha 224) — 1.148 execuções

### `src/arte/cartasDeTerreno.js`

✅ `desenharCartaDeTerreno` (linha 16) — 72 execuções

### `src/arte/cenarios.js`

✅ `perfilDeSerra` (linha 11) — 893 execuções  
✅ `sub` (linha 14) — 113.411 execuções  
✅ `montanhas` (linha 23) — 294 execuções  
✅ `estrelas` (linha 40) — 306 execuções  
✅ `constelacao` (linha 48) — 572 execuções  
✅ `vinheta` (linha 70) — 1.204 execuções  
✅ `raios` (linha 75) — 328 execuções  
✅ `cenarioDoNaipe` (linha 89) — 1.131 execuções

### `src/arte/emblemas.js`

✅ `desenharEmblema` (linha 7) — 4.004 execuções

### `src/arte/figuras.js`

✅ `coroa` (linha 18) — 187 execuções  
✅ `desenharFigura` (linha 41) — 258 execuções

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

✅ `corpoDaMoldura` (linha 10) — 1.197 execuções  
✅ `placa` (linha 41) — 1.795 execuções  
✅ `gema` (linha 55) — 1.676 execuções

### `src/arte/pincel.js`

✅ `criarTela` (linha 9) — 1.654 execuções  
✅ `caminhoArredondado` (linha 19) — 14.031 execuções  
✅ `hashDoTexto` (linha 30) — 1.527 execuções  
✅ `geradorComSemente` (linha 36) — 1.569 execuções  
✅ `degradeLinear` (linha 45) — 20.216 execuções  
✅ `degradeRadial` (linha 51) — 22.757 execuções  
✅ `escreverComQuebra` (linha 57) — 1.171 execuções  
✅ `ajustarFonte` (linha 71) — 1.335 execuções  
✅ `granulado` (linha 75) — 2.530 execuções  
✅ `escovado` (linha 83) — 1.198 execuções  
✅ `sombraSuave` (linha 92) — 8.340 execuções  
✅ `semSombra` (linha 97) — 13.353 execuções  
✅ `brilho` (linha 99) — 15.714 execuções  
✅ `comAlfa` (linha 104) — 64.772 execuções  
✅ `tonalizar` (linha 109) — 10.428 execuções

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
✅ `update` (linha 41) — 650 execuções

### `src/cenas/mesa/CenaMesa.js`

✅ `CenaMesa` (linha 42) — 17 execuções  
✅ `create` (linha 45) — 15 execuções  
✅ `comecar` (linha 68) — 15 execuções  
✅ `update` (linha 74) — 2.176 execuções

### `src/cenas/mesa/cenario.js`

✅ `desenharCenarioFixo` (linha 22) — 15 execuções  
✅ `criarBotao` (linha 54) — 150 execuções  
✅ `textura` (linha 56) — 559 execuções  
✅ `pintar` (linha 69) — 409 execuções  
✅ `temDica` (linha 70) — 39 execuções  
✅ `mostrarDica` (linha 71) — 2 execuções  
✅ `botao.definirRotulo` (linha 93) — 1.820 execuções  
✅ `botao.habilitar` (linha 94) — 3.224 execuções  
✅ `criarPaineis` (linha 106) — 15 execuções  
✅ `criarTexto` (linha 116) — 435 execuções  
✅ `criarPainelEsquerdo` (linha 121) — 15 execuções  
✅ `criarPilha` (linha 129) — 30 execuções  
✅ `criarPlacar` (linha 174) — 15 execuções  
✅ `criarBotoesDeAcao` (linha 203) — 15 execuções  
✅ `p.truco.criarBotao.variante` (linha 205) — 2 execuções  
✅ `p.botaoDropout.criarBotao.dica` (linha 207) — 3 execuções  
✅ `p.botaoTransfer.criarBotao.dica` (linha 208) — 1 execução  
✅ `p.botaoPassar.criarBotao.dica` (linha 209) — 1 execução  
✅ `atualizarBotaoSom` (linha 219) — 18 execuções  
✅ `atualizarChaves` (linha 224) — 20 execuções

### `src/cenas/mesa/desenho.js`

✅ `inspecionar` (linha 27) — 233 execuções  
✅ `mostrarDica` (linha 33) — 955 execuções  
✅ `redesenhar` (linha 38) — 806 execuções  
✅ `desenharMaos` (linha 68) — 806 execuções  
✅ `notaDaCartaDaMao` (linha 106) — 1 execução  
✅ `atualizarPaineis` (linha 114) — 806 execuções  
✅ `textoComDicaDeJogo` (linha 135) — 864 execuções  
✅ `atualizarPilha` (linha 145) — 1.612 execuções  
✅ `atualizarBlocoDoJogador` (linha 166) — 1.612 execuções  
✅ `estaNaVez` (linha 203) — 4.655 execuções  
✅ `desenharDestaqueDaVez` (linha 208) — 1.885 execuções  
✅ `atualizarBotoes` (linha 224) — 806 execuções  
✅ `atualizarRegistro` (linha 237) — 806 execuções  
✅ `desenharCurva` (linha 246) — 806 execuções  
✅ `textoDaDica` (linha 274) — 864 execuções  
✅ `valorSelecionado` (linha 301) — 338 execuções  
✅ `calcularAlvos` (linha 307) — 806 execuções  
✅ `desenharConexoesEAlvos` (linha 337) — 1.885 execuções

### `src/cenas/mesa/dicas.js`

✅ `conceitoCurto` (linha 32) — 8 execuções  
✅ `alternarDicas` (linha 39) — 2 execuções  
✅ `acao` (linha 56) — 1 execução  
✅ `darDicaDoTurno` (linha 69) — 100 execuções  
✅ `textoDaDicaDeJogo` (linha 81) — 864 execuções  
✅ `mostrarDicaDoBotao` (linha 89) — 2 execuções  
✅ `esconderDicaDoBotao` (linha 99) — 21 execuções  
✅ `conteudoDaDica` (linha 105) — 6 execuções  
✅ `dicaDaRespostaAoTruco` (linha 163) — 6 execuções

### `src/cenas/mesa/efeitos.js`

✅ `corCss` (linha 26) — 107 execuções  
✅ `posicaoDoNeuronio` (linha 30) — 174 execuções  
✅ `origemDasCartas` (linha 36) — 28 execuções  
✅ `animarEventos` (linha 46) — 205 execuções  
✅ `animar_ativacao` (linha 58) — 146 execuções  
✅ `animar_tunagem` (linha 76) — 12 execuções  
✅ `animar_ataque` (linha 88) — 16 execuções  
✅ `onComplete` (linha 102) — 16 execuções  
✅ `animar_overfit` (linha 120) — 12 execuções  
✅ `animar_earlystop` (linha 121) — 3 execuções  
✅ `animar_stackoverflow` (linha 122) — 1 execução  
✅ `animar_dropout` (linha 125) — 9 execuções  
✅ `animar_transfer` (linha 138) — 1 execução  
✅ `animar_completa` (linha 147) — 14 execuções  
✅ `animar_vento` (linha 154) — 12 execuções  
✅ `animar_powerbi` (linha 161) — 1 execução  
✅ `animar_passe` (linha 167) — 13 execuções  
✅ `animar_inicio` (linha 174) — 6 execuções  
✅ `onComplete` (linha 185) — 12 execuções  
✅ `verificarVanishing` (linha 192) — 205 execuções  
✅ `voarCarta` (linha 210) — 31 execuções  
✅ `onComplete` (linha 214) — 31 execuções  
✅ `explodir` (linha 219) — 91 execuções  
✅ `textoFlutuante` (linha 231) — 204 execuções  
✅ `onComplete` (linha 233) — 202 execuções  
✅ `faixa` (linha 237) — 43 execuções  
✅ `onComplete` (linha 241) — 43 execuções  
✅ `falar` (linha 248) — 29 execuções  
✅ `onComplete` (linha 260) — 29 execuções  
✅ `impactoDoTruco` (linha 267) — 10 execuções  
✅ `avisarVerbete` (linha 276) — 632 execuções

### `src/cenas/mesa/entrada.js`

✅ `aoPassarNoNeuronio` (linha 18) — 141 execuções  
✅ `aoClicarNoNeuronio` (linha 50) — 90 execuções  
✅ `aoClicarNaCarta` (linha 72) — 179 execuções  
✅ `cancelarSelecao` (linha 106) — 192 execuções  
✅ `alternarDropout` (linha 114) — 3 execuções  
✅ `fazerTransfer` (linha 121) — 1 execução  
✅ `passarAVez` (linha 129) — 1 execução  
✅ `perguntarSeVoltaAoMenu` (linha 134) — 2 execuções  
✅ `acao` (linha 137) — 1 execução

### `src/cenas/mesa/layout.js`

✅ `colunaX` (linha 37) — 18.420 execuções  
✅ `linhaY` (linha 39) — 18.346 execuções  
✅ `ajustarCartaDaMesa` (linha 52) — 25.798 execuções  
✅ `ajustarLinha` (linha 62) — 14.693 execuções  
✅ `ajustarBloco` (linha 78) — 2.013 execuções

### `src/cenas/mesa/resultado.js`

✅ `encerrarMao` (linha 29) — 10 execuções  
✅ `comemorar` (linha 67) — 8 execuções  
✅ `faixaDeVitoria` (linha 88) — 8 execuções  
✅ `onComplete` (linha 105) — 8 execuções  
✅ `chuvaDeConfete` (linha 110) — 8 execuções  
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

✅ `verso` (linha 21) — 25.933 execuções  
✅ `jogadorDeBaixo` (linha 24) — 3.538 execuções  
✅ `jogadorDeCima` (linha 27) — 3.497 execuções  
✅ `avatarDe` (linha 30) — 1.612 execuções  
✅ `ehVezDoHumano` (linha 37) — 5.548 execuções  
✅ `iniciarMao` (linha 46) — 19 execuções  
✅ `criarNeuronios` (linha 82) — 19 execuções  
✅ `executarJogada` (linha 106) — 204 execuções  
✅ `avancar` (linha 125) — 242 execuções  
✅ `anotarNaLinhaDoTempo` (linha 158) — 220 execuções  
✅ `avancarNoInicio` (linha 175) — 8 execuções  
✅ `comecar` (linha 187) — 8 execuções  
✅ `passarAparelho` (linha 194) — 16 execuções  
✅ `acao` (linha 199) — 16 execuções  
✅ `vezDoOponente` (linha 207) — 102 execuções

### `src/cenas/recursos.js`

✅ `prepararTextoNitido` (linha 19) — 17 execuções  
✅ `fabrica.text` (linha 22) — 2.258 execuções  
✅ `ajustarCamera` (linha 35) — 53 execuções  
✅ `ajustar` (linha 39) — 2.959 execuções  
✅ `cena.reajustarCamera` (linha 53) — 36 execuções  
✅ `texturaDaMesa` (linha 61) — 53 execuções  
✅ `colocarFundo` (linha 71) — 36 execuções  
✅ `texturaDoVerso` (linha 82) — 25.984 execuções  
✅ `texturaDaCartaNaMao` (linha 89) — 3.095 execuções  
✅ `texturaDaCartaMedia` (linha 96) — 12 execuções  
✅ `texturaDaCartaNaMesa` (linha 103) — 4.969 execuções  
✅ `criarTexturaDeInspecao` (linha 113) — 17 execuções  
✅ `texturaDeInspecao` (linha 122) — 171 execuções  
✅ `liberarCartasDaMao` (linha 139) — 19 execuções  
✅ `retanguloNaTela` (linha 147) — 2 execuções  
✅ `px` (linha 150) — 6 execuções  
✅ `py` (linha 151) — 6 execuções

### `src/conteudo/conquistas.js`

✅ `meu` (linha 28) — 75 execuções  
✅ `teste` (linha 31) — 10 execuções  
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
✅ `teste` (linha 44) — 9 execuções  
✅ `teste` (linha 45) — 11 execuções  
✅ `teste` (linha 46) — 11 execuções  
✅ `teste` (linha 47) — 11 execuções  
✅ `teste` (linha 48) — 10 execuções  
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

✅ `contarValores` (linha 43) — 5.541 execuções  
✅ `escolherDicaDeJogo` (linha 57) — 5.541 execuções  
✅ `dica` (linha 64) — 6.325 execuções  
✅ `atacavel` (linha 65) — 5.541 execuções

### `src/conteudo/progresso.js`

✅ `progressoInicial` (linha 13) — 25 execuções  
✅ `migrarV1` (linha 22) — 2 execuções  
✅ `carregarProgresso` (linha 34) — 25 execuções  
✅ `salvarProgresso` (linha 46) — 76 execuções

### `src/conteudo/textos.js`

✅ `provocar` (linha 43) — 42 execuções

### `src/interface/menu.js`

✅ `mostrarMiniatura` (linha 36) — 160 execuções  
✅ `opcoesHtml` (linha 45) — 110 execuções  
✅ `htmlDoMenu` (linha 53) — 22 execuções  
✅ `abrirMenu` (linha 83) — 22 execuções  
✅ `campo` (linha 86) — 870 execuções  
✅ `atualizarDicas` (linha 89) — 80 execuções  
✅ `lerEscolhas` (linha 103) — 24 execuções

### `src/interface/musica.js`

✅ `hz` (linha 23) — 2.747 execuções  
✅ `sorteador` (linha 26) — 1.367 execuções  
✅ `voz` (linha 43) — 2.707 execuções  
✅ `chiado` (linha 69) — 488 execuções  
✅ `tambor` (linha 85) — 379 execuções  
✅ `sino` (linha 98) — 10 execuções  
✅ `tocar` (linha 123) — 938 execuções  
✅ `tocar` (linha 145) — 81 execuções  
✅ `tocar` (linha 165) — 280 execuções  
✅ `tocar` (linha 190) — 68 execuções  
✅ `agendar` (linha 216) — 1.188 execuções  
✅ `tocar` (linha 237) — 28 execuções  
✅ `parar` (linha 253) — 30 execuções  
✅ `tocando` (linha 266) — 9 execuções

### `src/interface/paineis.js`

✅ `$` (linha 9) — 236 execuções  
✅ `escaparHtml` (linha 12) — 1.706 execuções  
✅ `abrirPainel` (linha 31) — 101 execuções  
✅ `fechar` (linha 38) — 81 execuções  
✅ `fecharTodos` (linha 51) — 61 execuções  
✅ `mostrarAviso` (linha 62) — 70 execuções  
✅ `mostrarDicaDeJogo` (linha 78) — 4 execuções  
✅ `confirmar` (linha 98) — 27 execuções  
✅ `mostrarDicaFlutuante` (linha 126) — 5 execuções  
✅ `esconderDicaFlutuante` (linha 145) — 50 execuções

### `src/interface/som.js`

✅ `contextoDeAudio` (linha 11) — 36 execuções  
✅ `audio` (linha 14) — 1.201 execuções  
✅ `nota` (linha 33) — 859 execuções  
✅ `ruido` (linha 49) — 289 execuções  
✅ `desbloquear` (linha 65) — 17 execuções  
✅ `definirMudo` (linha 66) — 25 execuções  
✅ `estaMudo` (linha 67) — 25 execuções  
✅ `virarCarta` (linha 68) — 147 execuções  
✅ `colocarCarta` (linha 69) — 8 execuções  
✅ `selecionar` (linha 70) — 189 execuções  
✅ `tunagem` (linha 71) — 13 execuções  
✅ `golpe` (linha 72) — 18 execuções  
✅ `explosao` (linha 73) — 4 execuções  
✅ `dropout` (linha 74) — 10 execuções  
✅ `truco` (linha 79) — 16 execuções  
✅ `vitoria` (linha 88) — 1 execução  
✅ `fanfarra` (linha 94) — 11 execuções  
✅ `campeao` (linha 109) — 2 execuções  
✅ `derrota` (linha 121) — 5 execuções  
✅ `medalha` (linha 122) — 22 execuções

### `src/interface/telas/conquistas.js`

✅ `medalhaHtml` (linha 16) — 100 execuções  
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

✅ `tipoDoPasso` (linha 31) — 316 execuções  
✅ `variacoes` (linha 45) — 14 execuções  
✅ `momentosChave` (linha 53) — 5 execuções  
✅ `contagens` (linha 72) — 5 execuções  
✅ `graficoDaCurva` (linha 82) — 4 execuções  
✅ `x` (linha 88) — 222 execuções  
✅ `y` (linha 89) — 272 execuções  
✅ `linhaDoTempoHtml` (linha 120) — 5 execuções  
✅ `tabelaDaPartida` (linha 140) — 4 execuções  
✅ `abrirRevisao` (linha 151) — 5 execuções  
✅ `linha` (linha 155) — 10 execuções  
✅ `qtd` (linha 158) — 45 execuções

### `src/interface/telas/sobre.js`

✅ `abrirSobre` (linha 8) — 3 execuções

### `src/nucleo/aleatorio.js`

✅ `sortear` (linha 13) — 2.284.545 execuções  
✅ `sortearInteiro` (linha 25) — 2.284.145 execuções  
✅ `embaralhar` (linha 36) — 54.968 execuções  
✅ `sementeNova` (linha 45) — 21 execuções

### `src/nucleo/baralhos.js`

✅ `montar` (linha 36) — 2 execuções  
✅ `pontosDaCarta` (linha 59) — 2.648.662 execuções  
✅ `nomeDaCarta` (linha 69) — 1.275 execuções  
✅ `manilhaDaCarta` (linha 76) — 2 execuções

### `src/nucleo/cartas.js`

✅ `ehFigura` (linha 40) — 5.262.524 execuções  
✅ `rotuloCarta` (linha 45) — 534.228 execuções  
✅ `baralhoPadrao` (linha 50) — 19.319 execuções

### `src/nucleo/oponentes/comum.js`

✅ `cartasOcultas` (linha 16) — 35.796 execuções  
✅ `determinizar` (linha 27) — 35.652 execuções  
✅ `pontosEsperadosPorCamada` (linha 39) — 143 execuções  
✅ `projecao` (linha 44) — 2.622 execuções  
✅ `avaliar` (linha 56) — 1.377 execuções  
✅ `agruparEquivalentes` (linha 72) — 178 execuções  
✅ `concretizar` (linha 91) — 28.383 execuções  
✅ `jogadaRapida` (linha 98) — 264.181 execuções  
✅ `simularAteOFim` (linha 132) — 29.877 execuções  
✅ `chanceDeVitoria` (linha 139) — 73 execuções

### `src/nucleo/oponentes/estrategias.js`

✅ `jogadaAleatoria` (linha 14) — 279.401 execuções  
✅ `jogadaGulosa` (linha 25) — 142 execuções  
✅ `jogadaMonteCarlo` (linha 49) — 35 execuções

### `src/nucleo/oponentes/index.js`

✅ `cartaDeInicio` (linha 29) — 20 execuções  
✅ `forca` (linha 37) — 248 execuções  
✅ `escolherJogada` (linha 48) — 244 execuções  
✅ `querTrucar` (linha 60) — 80 execuções  
✅ `responderAoTruco` (linha 73) — 20 execuções

### `src/nucleo/partida.js`

✅ `novoJogador` (linha 53) — 38.578 execuções  
✅ `novaMao` (linha 71) — 19.289 execuções  
✅ `reindexar` (linha 105) — 37.897 execuções  
✅ `copiarMao` (linha 115) — 37.897 execuções  
✅ `emitir` (linha 131) — 729.500 execuções  
✅ `anotar` (linha 136) — 709.695 execuções  
✅ `anotarHistorico` (linha 141) — 580.526 execuções  
✅ `fronteira` (linha 148) — 1.038.419 execuções  
✅ `alvosDeAtivacao` (linha 154) — 1.083.538 execuções  
✅ `alvosDeEmpilhamento` (linha 163) — 584.926 execuções  
✅ `efeitoDoEmpilhamento` (linha 178) — 99.240 execuções  
✅ `podeEmpilhar` (linha 188) — 33.779 execuções  
✅ `camadasDesfaziveis` (linha 201) — 18.507 execuções  
✅ `valorParaTransfer` (linha 208) — 556.952 execuções  
✅ `podePassar` (linha 218) — 43.052 execuções  
✅ `combinacoes` (linha 223) — 8 execuções  
✅ `recursao` (linha 225) — 28 execuções  
✅ `jogadasLegais` (linha 238) — 550.981 execuções  
✅ `tirarDaMao` (linha 272) — 44.373 execuções  
✅ `finalizarRede` (linha 281) — 91.020 execuções  
✅ `trocarMaoPowerBI` (linha 288) — 44.372 execuções  
✅ `encerrarTurno` (linha 300) — 561.237 execuções  
✅ `resolverInicio` (linha 316) — 14 execuções  
✅ `ativar` (linha 341) — 485.052 execuções  
✅ `empilhar` (linha 360) — 33.556 execuções  
✅ `fazerDropout` (linha 405) — 10.813 execuções  
✅ `fazerTransfer` (linha 425) — 6 execuções  
✅ `aplicarJogada` (linha 450) — 572.085 execuções  
✅ `somaDasMelhores` (linha 479) — 2.420 execuções  
✅ `cartaMaisAlta` (linha 487) — 124 execuções  
✅ `filtrarMaiores` (linha 497) — 50.672 execuções  
✅ `encerrarMao` (linha 503) — 49.123 execuções

### `src/nucleo/pontuacao.js`

✅ `pontuarNeuronios` (linha 40) — 716.511 execuções  
✅ `aplicarFraternidade` (linha 77) — 53.547 execuções  
✅ `encontrarCombos` (linha 88) — 716.511 execuções  
✅ `pontuarRede` (linha 120) — 716.511 execuções  
✅ `mediaDePontos` (linha 132) — 145 execuções

### `src/nucleo/rede.js`

✅ `ehOculta` (linha 21) — 983.437 execuções  
✅ `nomeCamada` (linha 26) — 485.526 execuções

### `src/nucleo/truco.js`

✅ `novaPartida` (linha 18) — 162 execuções  
✅ `proximoValor` (linha 23) — 6.840 execuções  
✅ `ehMaoDeOnze` (linha 29) — 7.490 execuções  
✅ `podeTrucar` (linha 34) — 6.066 execuções  
✅ `pedirTruco` (linha 42) — 11 execuções  
✅ `responderTruco` (linha 53) — 12 execuções  
✅ `marcarTentos` (linha 71) — 13 execuções  
✅ `proximaMao` (linha 79) — 4 execuções

### `src/principal.js`

✅ `remedirAposMudarATela` (linha 25) — 6 execuções  
✅ `criarJogo` (linha 32) — 17 execuções  
✅ `iniciarJogo` (linha 53) — 18 execuções  
✅ `aoGirar` (linha 56) — 2 execuções
