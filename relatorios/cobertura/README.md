# Cobertura dos testes

**Versão 1.2.2** · commit `ba4cd88-dirty` (com as mudanças ainda não registradas) · 09/11/2026, 22:25 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Cobertura medida pelo V8 nos testes de unidade (Node) e nos testes de interface (Chromium, com os módulos de `src/` servidos sem empacotar), juntada pelo c8. Ficam fora da conta só `ferramentas/relatorios.js` (o gerador destes relatórios, que é quem roda os testes) e `src/recursos/` (a foto embutida, sem código).

| | Linhas | Instruções | Ramos | Funções |
|---|---:|---:|---:|---:|
| **Total** | 99,7% | 99,7% | 93,9% | 100,0% |

**Funções e métodos com nome executados pelos testes: 438 de 438 (100,0%).** A coluna "Funções" acima conta também as funções anônimas (callbacks de eventos, de animações e de `map`/`filter`).

## Por arquivo

| Arquivo | Linhas | Ramos | Funções |
|---|---:|---:|---:|
| `ferramentas/documentar.js` | 100,0% | 89,7% | 100,0% |
| `ferramentas/empacotar.js` | 100,0% | 71,4% | 100,0% |
| `ferramentas/simular.js` | 94,3% | 80,0% | 100,0% |
| `ferramentas/versionar.js` | 100,0% | 87,3% | 100,0% |
| `src/aplicacao.js` | 100,0% | 97,4% | 100,0% |
| `src/arte/avatares.js` | 100,0% | 97,5% | 100,0% |
| `src/arte/botoes.js` | 100,0% | 76,5% | 100,0% |
| `src/arte/cartas.js` | 100,0% | 94,8% | 100,0% |
| `src/arte/cartasDeTerreno.js` | 100,0% | 94,7% | 100,0% |
| `src/arte/cenarios.js` | 100,0% | 98,0% | 100,0% |
| `src/arte/emblemas.js` | 100,0% | 100,0% | 100,0% |
| `src/arte/figuras.js` | 100,0% | 91,4% | 100,0% |
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
| `src/cenas/mesa/cenario.js` | 100,0% | 93,7% | 100,0% |
| `src/cenas/mesa/desenho.js` | 99,7% | 96,0% | 100,0% |
| `src/cenas/mesa/dicas.js` | 98,8% | 56,9% | 100,0% |
| `src/cenas/mesa/efeitos.js` | 98,9% | 94,6% | 100,0% |
| `src/cenas/mesa/entrada.js` | 97,9% | 87,2% | 100,0% |
| `src/cenas/mesa/layout.js` | 100,0% | 100,0% | 100,0% |
| `src/cenas/mesa/resultado.js` | 100,0% | 85,8% | 100,0% |
| `src/cenas/mesa/truco.js` | 100,0% | 87,0% | 100,0% |
| `src/cenas/mesa/turnos.js` | 96,1% | 94,0% | 100,0% |
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
| `src/nucleo/truco.js` | 100,0% | 100,0% | 100,0% |
| `src/principal.js` | 100,0% | 85,7% | 100,0% |
| `src/versao.js` | 100,0% | 100,0% | 100,0% |

## Funções e métodos

Cada função ou método com nome e quantas vezes foi executado durante os testes.

### `ferramentas/documentar.js`

✅ `arquivosJs` (linha 16) — 11 execuções  
✅ `limparComentario` (linha 25) — 473 execuções  
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
✅ `dataEmBrasilia` (linha 64) — 3 execuções  
✅ `gravarModuloDeVersao` (linha 69) — 3 execuções  
✅ `gravarNoReadme` (linha 80) — 3 execuções  
✅ `gravarNoHistorico` (linha 90) — 3 execuções

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

✅ `desenharFaisca` (linha 10) — 59 execuções  
✅ `desenharBotao` (linha 25) — 91 execuções

### `src/arte/cartas.js`

✅ `dadosDaCarta` (linha 22) — 1.123 execuções  
✅ `simboloDeColecao` (linha 40) — 623 execuções  
✅ `ilustracaoDaCarta` (linha 49) — 547 execuções  
✅ `posicoesDosNaipes` (linha 100) — 717 execuções  
✅ `fileira` (linha 101) — 11.472 execuções  
✅ `desenharCartaCompleta` (linha 118) — 547 execuções  
✅ `desenharCartaDaMesa` (linha 189) — 572 execuções  
✅ `indice` (linha 224) — 1.144 execuções

### `src/arte/cartasDeTerreno.js`

✅ `desenharCartaDeTerreno` (linha 16) — 72 execuções

### `src/arte/cenarios.js`

✅ `perfilDeSerra` (linha 11) — 929 execuções  
✅ `sub` (linha 14) — 117.983 execuções  
✅ `montanhas` (linha 23) — 306 execuções  
✅ `estrelas` (linha 40) — 318 execuções  
✅ `constelacao` (linha 48) — 570 execuções  
✅ `vinheta` (linha 70) — 1.200 execuções  
✅ `raios` (linha 75) — 322 execuções  
✅ `cenarioDoNaipe` (linha 89) — 1.127 execuções

### `src/arte/emblemas.js`

✅ `desenharEmblema` (linha 7) — 3.946 execuções

### `src/arte/figuras.js`

✅ `coroa` (linha 18) — 199 execuções  
✅ `desenharFigura` (linha 41) — 270 execuções

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

✅ `corpoDaMoldura` (linha 10) — 1.193 execuções  
✅ `placa` (linha 41) — 1.789 execuções  
✅ `gema` (linha 55) — 1.670 execuções

### `src/arte/pincel.js`

✅ `criarTela` (linha 9) — 1.635 execuções  
✅ `caminhoArredondado` (linha 19) — 13.899 execuções  
✅ `hashDoTexto` (linha 30) — 1.506 execuções  
✅ `geradorComSemente` (linha 36) — 1.548 execuções  
✅ `degradeLinear` (linha 45) — 19.934 execuções  
✅ `degradeRadial` (linha 51) — 22.721 execuções  
✅ `escreverComQuebra` (linha 57) — 1.167 execuções  
✅ `ajustarFonte` (linha 71) — 1.331 execuções  
✅ `granulado` (linha 75) — 2.505 execuções  
✅ `escovado` (linha 83) — 1.194 execuções  
✅ `sombraSuave` (linha 92) — 8.260 execuções  
✅ `semSombra` (linha 97) — 13.213 execuções  
✅ `brilho` (linha 99) — 15.567 execuções  
✅ `comAlfa` (linha 104) — 64.007 execuções  
✅ `tonalizar` (linha 109) — 10.512 execuções

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
✅ `update` (linha 74) — 2.324 execuções

### `src/cenas/mesa/cenario.js`

✅ `desenharCenarioFixo` (linha 20) — 15 execuções  
✅ `criarBotao` (linha 52) — 90 execuções  
✅ `textura` (linha 54) — 519 execuções  
✅ `pintar` (linha 73) — 429 execuções  
✅ `temDica` (linha 74) — 33 execuções  
✅ `mostrarDica` (linha 75) — 2 execuções  
✅ `botao.definirRotulo` (linha 97) — 1.622 execuções  
✅ `botao.habilitar` (linha 98) — 3.012 execuções  
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

✅ `inspecionar` (linha 27) — 227 execuções  
✅ `mostrarDica` (linha 33) — 903 execuções  
✅ `redesenhar` (linha 38) — 753 execuções  
✅ `desenharMaos` (linha 68) — 753 execuções  
✅ `notaDaCartaDaMao` (linha 106) — 1 execução  
✅ `atualizarPaineis` (linha 114) — 753 execuções  
✅ `textoComDicaDeJogo` (linha 135) — 812 execuções  
✅ `atualizarPilha` (linha 145) — 1.506 execuções  
✅ `atualizarBlocoDoJogador` (linha 166) — 1.506 execuções  
✅ `estaNaVez` (linha 203) — 4.895 execuções  
✅ `desenharDestaqueDaVez` (linha 208) — 2.034 execuções  
✅ `atualizarBotoes` (linha 224) — 753 execuções  
✅ `atualizarRegistro` (linha 237) — 753 execuções  
✅ `desenharCurva` (linha 246) — 753 execuções  
✅ `textoDaDica` (linha 274) — 812 execuções  
✅ `valorSelecionado` (linha 301) — 294 execuções  
✅ `calcularAlvos` (linha 307) — 753 execuções  
✅ `desenharConexoesEAlvos` (linha 337) — 2.034 execuções

### `src/cenas/mesa/dicas.js`

✅ `conceitoCurto` (linha 32) — 8 execuções  
✅ `alternarDicas` (linha 39) — 2 execuções  
✅ `acao` (linha 56) — 1 execução  
✅ `darDicaDoTurno` (linha 69) — 102 execuções  
✅ `textoDaDicaDeJogo` (linha 81) — 812 execuções  
✅ `mostrarDicaDoBotao` (linha 89) — 2 execuções  
✅ `esconderDicaDoBotao` (linha 99) — 18 execuções  
✅ `conteudoDaDica` (linha 105) — 6 execuções  
✅ `dicaDaRespostaAoTruco` (linha 163) — 4 execuções

### `src/cenas/mesa/efeitos.js`

✅ `corCss` (linha 26) — 100 execuções  
✅ `posicaoDoNeuronio` (linha 30) — 168 execuções  
✅ `origemDasCartas` (linha 36) — 27 execuções  
✅ `animarEventos` (linha 46) — 202 execuções  
✅ `animar_ativacao` (linha 58) — 141 execuções  
✅ `animar_tunagem` (linha 76) — 10 execuções  
✅ `animar_ataque` (linha 88) — 17 execuções  
✅ `onComplete` (linha 102) — 17 execuções  
✅ `animar_overfit` (linha 120) — 11 execuções  
✅ `animar_earlystop` (linha 121) — 5 execuções  
✅ `animar_stackoverflow` (linha 122) — 1 execução  
✅ `animar_dropout` (linha 125) — 8 execuções  
✅ `animar_transfer` (linha 138) — 1 execução  
✅ `animar_completa` (linha 147) — 12 execuções  
✅ `animar_vento` (linha 154) — 12 execuções  
✅ `animar_powerbi` (linha 161) — 1 execução  
✅ `animar_passe` (linha 167) — 17 execuções  
✅ `animar_inicio` (linha 174) — 6 execuções  
✅ `onComplete` (linha 185) — 12 execuções  
✅ `verificarVanishing` (linha 192) — 202 execuções  
✅ `voarCarta` (linha 210) — 31 execuções  
✅ `onComplete` (linha 214) — 31 execuções  
✅ `explodir` (linha 219) — 83 execuções  
✅ `textoFlutuante` (linha 231) — 197 execuções  
✅ `onComplete` (linha 233) — 195 execuções  
✅ `faixa` (linha 237) — 41 execuções  
✅ `onComplete` (linha 241) — 41 execuções  
✅ `falar` (linha 248) — 29 execuções  
✅ `onComplete` (linha 260) — 27 execuções  
✅ `impactoDoTruco` (linha 267) — 8 execuções  
✅ `avisarVerbete` (linha 276) — 613 execuções

### `src/cenas/mesa/entrada.js`

✅ `aoPassarNoNeuronio` (linha 20) — 141 execuções  
✅ `aoClicarNoNeuronio` (linha 52) — 89 execuções  
✅ `aoClicarNaCarta` (linha 74) — 157 execuções  
✅ `cancelarSelecao` (linha 108) — 164 execuções  
✅ `alternarDropout` (linha 116) — 3 execuções  
✅ `fazerTransfer` (linha 123) — 1 execução  
✅ `passarAVez` (linha 131) — 4 execuções  
✅ `abrirRegrasDaMesa` (linha 139) — 4 execuções  
✅ `regras` (linha 151) — 1 execução  
✅ `grimorio` (linha 152) — 1 execução  
✅ `dicas` (linha 153) — 2 execuções  
✅ `abrirMenuDaMesa` (linha 166) — 4 execuções  
✅ `q` (linha 175) — 12 execuções  
✅ `perguntarSeVoltaAoMenu` (linha 183) — 2 execuções  
✅ `acao` (linha 186) — 1 execução

### `src/cenas/mesa/layout.js`

✅ `colunaX` (linha 47) — 20.670 execuções  
✅ `linhaY` (linha 49) — 20.598 execuções  
✅ `ajustarCartaDaMesa` (linha 62) — 24.245 execuções  
✅ `ajustarLinha` (linha 72) — 13.621 execuções  
✅ `ajustarBloco` (linha 88) — 1.902 execuções

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
✅ `anunciarTruco` (linha 19) — 6 execuções  
✅ `pedirResposta` (linha 32) — 6 execuções  
✅ `acao` (linha 45) — 1 execução  
✅ `acao` (linha 46) — 2 execuções  
✅ `acao` (linha 48) — 1 execução  
✅ `aplicarResposta` (linha 59) — 6 execuções

### `src/cenas/mesa/turnos.js`

✅ `verso` (linha 21) — 24.160 execuções  
✅ `jogadorDeBaixo` (linha 24) — 3.584 execuções  
✅ `jogadorDeCima` (linha 27) — 3.540 execuções  
✅ `avatarDe` (linha 30) — 1.506 execuções  
✅ `ehVezDoHumano` (linha 37) — 5.642 execuções  
✅ `iniciarMao` (linha 46) — 19 execuções  
✅ `criarNeuronios` (linha 82) — 19 execuções  
✅ `executarJogada` (linha 106) — 201 execuções  
✅ `avancar` (linha 125) — 238 execuções  
✅ `anotarNaLinhaDoTempo` (linha 158) — 213 execuções  
✅ `avancarNoInicio` (linha 175) — 8 execuções  
✅ `comecar` (linha 187) — 8 execuções  
✅ `passarAparelho` (linha 194) — 17 execuções  
✅ `acao` (linha 199) — 17 execuções  
✅ `vezDoOponente` (linha 207) — 94 execuções

### `src/cenas/recursos.js`

✅ `prepararTextoNitido` (linha 19) — 17 execuções  
✅ `fabrica.text` (linha 22) — 2.187 execuções  
✅ `ajustarCamera` (linha 35) — 53 execuções  
✅ `ajustar` (linha 39) — 3.105 execuções  
✅ `cena.reajustarCamera` (linha 53) — 36 execuções  
✅ `texturaDaMesa` (linha 61) — 53 execuções  
✅ `colocarFundo` (linha 71) — 36 execuções  
✅ `texturaDoVerso` (linha 82) — 24.211 execuções  
✅ `texturaDaCartaNaMao` (linha 89) — 2.997 execuções  
✅ `texturaDaCartaMedia` (linha 96) — 12 execuções  
✅ `texturaDaCartaNaMesa` (linha 103) — 4.907 execuções  
✅ `criarTexturaDeInspecao` (linha 113) — 17 execuções  
✅ `texturaDeInspecao` (linha 122) — 164 execuções  
✅ `liberarCartasDaMao` (linha 139) — 19 execuções  
✅ `retanguloNaTela` (linha 147) — 2 execuções  
✅ `px` (linha 150) — 6 execuções  
✅ `py` (linha 151) — 6 execuções

### `src/conteudo/conquistas.js`

✅ `meu` (linha 28) — 76 execuções  
✅ `teste` (linha 31) — 10 execuções  
✅ `teste` (linha 32) — 13 execuções  
✅ `teste` (linha 33) — 13 execuções  
✅ `teste` (linha 34) — 13 execuções  
✅ `teste` (linha 35) — 13 execuções  
✅ `teste` (linha 36) — 10 execuções  
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

✅ `contarValores` (linha 43) — 5.473 execuções  
✅ `escolherDicaDeJogo` (linha 57) — 5.473 execuções  
✅ `dica` (linha 64) — 6.165 execuções  
✅ `atacavel` (linha 65) — 5.473 execuções

### `src/conteudo/progresso.js`

✅ `progressoInicial` (linha 13) — 25 execuções  
✅ `migrarV1` (linha 22) — 2 execuções  
✅ `carregarProgresso` (linha 34) — 25 execuções  
✅ `salvarProgresso` (linha 46) — 75 execuções

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

✅ `hz` (linha 23) — 2.975 execuções  
✅ `sorteador` (linha 26) — 1.482 execuções  
✅ `voz` (linha 43) — 2.927 execuções  
✅ `chiado` (linha 69) — 530 execuções  
✅ `tambor` (linha 85) — 402 execuções  
✅ `sino` (linha 98) — 12 execuções  
✅ `tocar` (linha 123) — 1.020 execuções  
✅ `tocar` (linha 145) — 89 execuções  
✅ `tocar` (linha 165) — 288 execuções  
✅ `tocar` (linha 190) — 85 execuções  
✅ `agendar` (linha 216) — 1.283 execuções  
✅ `tocar` (linha 237) — 28 execuções  
✅ `parar` (linha 253) — 30 execuções  
✅ `tocando` (linha 266) — 9 execuções

### `src/interface/paineis.js`

✅ `$` (linha 9) — 242 execuções  
✅ `escaparHtml` (linha 12) — 1.689 execuções  
✅ `abrirPainel` (linha 31) — 108 execuções  
✅ `fechar` (linha 38) — 87 execuções  
✅ `fecharTodos` (linha 51) — 61 execuções  
✅ `mostrarAviso` (linha 62) — 69 execuções  
✅ `mostrarDicaDeJogo` (linha 78) — 4 execuções  
✅ `confirmar` (linha 98) — 26 execuções  
✅ `mostrarDicaFlutuante` (linha 126) — 5 execuções  
✅ `esconderDicaFlutuante` (linha 145) — 47 execuções

### `src/interface/som.js`

✅ `contextoDeAudio` (linha 11) — 36 execuções  
✅ `audio` (linha 14) — 1.120 execuções  
✅ `nota` (linha 33) — 792 execuções  
✅ `ruido` (linha 49) — 275 execuções  
✅ `desbloquear` (linha 65) — 17 execuções  
✅ `definirMudo` (linha 66) — 24 execuções  
✅ `estaMudo` (linha 67) — 32 execuções  
✅ `virarCarta` (linha 68) — 142 execuções  
✅ `colocarCarta` (linha 69) — 8 execuções  
✅ `selecionar` (linha 70) — 164 execuções  
✅ `tunagem` (linha 71) — 11 execuções  
✅ `golpe` (linha 72) — 19 execuções  
✅ `explosao` (linha 73) — 4 execuções  
✅ `dropout` (linha 74) — 9 execuções  
✅ `truco` (linha 79) — 14 execuções  
✅ `vitoria` (linha 88) — 1 execução  
✅ `fanfarra` (linha 94) — 10 execuções  
✅ `campeao` (linha 109) — 2 execuções  
✅ `derrota` (linha 121) — 6 execuções  
✅ `medalha` (linha 122) — 22 execuções

### `src/interface/telas/conquistas.js`

✅ `medalhaHtml` (linha 16) — 103 execuções  
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
✅ `x` (linha 88) — 214 execuções  
✅ `y` (linha 89) — 268 execuções  
✅ `linhaDoTempoHtml` (linha 120) — 5 execuções  
✅ `tabelaDaPartida` (linha 140) — 4 execuções  
✅ `abrirRevisao` (linha 151) — 5 execuções  
✅ `linha` (linha 155) — 10 execuções  
✅ `qtd` (linha 158) — 43 execuções

### `src/interface/telas/sobre.js`

✅ `abrirSobre` (linha 8) — 3 execuções

### `src/nucleo/aleatorio.js`

✅ `sortear` (linha 13) — 1.906.755 execuções  
✅ `sortearInteiro` (linha 25) — 1.906.355 execuções  
✅ `embaralhar` (linha 36) — 44.814 execuções  
✅ `sementeNova` (linha 45) — 21 execuções

### `src/nucleo/baralhos.js`

✅ `montar` (linha 36) — 52 execuções  
✅ `pontosDaCarta` (linha 59) — 2.208.964 execuções  
✅ `nomeDaCarta` (linha 69) — 1.266 execuções  
✅ `manilhaDaCarta` (linha 76) — 2 execuções

### `src/nucleo/cartas.js`

✅ `ehFigura` (linha 40) — 4.305.585 execuções  
✅ `rotuloCarta` (linha 45) — 405.321 execuções  
✅ `baralhoPadrao` (linha 50) — 15.483 execuções

### `src/nucleo/oponentes/comum.js`

✅ `cartasOcultas` (linha 16) — 29.401 execuções  
✅ `determinizar` (linha 27) — 29.264 execuções  
✅ `pontosEsperadosPorCamada` (linha 39) — 136 execuções  
✅ `projecao` (linha 44) — 2.452 execuções  
✅ `avaliar` (linha 56) — 1.284 execuções  
✅ `agruparEquivalentes` (linha 72) — 164 execuções  
✅ `concretizar` (linha 91) — 22.151 execuções  
✅ `jogadaRapida` (linha 98) — 197.183 execuções  
✅ `simularAteOFim` (linha 132) — 23.620 execuções  
✅ `chanceDeVitoria` (linha 139) — 78 execuções

### `src/nucleo/oponentes/estrategias.js`

✅ `jogadaAleatoria` (linha 14) — 220.332 execuções  
✅ `jogadaGulosa` (linha 25) — 135 execuções  
✅ `jogadaMonteCarlo` (linha 49) — 28 execuções

### `src/nucleo/oponentes/index.js`

✅ `cartaDeInicio` (linha 29) — 20 execuções  
✅ `forca` (linha 37) — 252 execuções  
✅ `escolherJogada` (linha 48) — 218 execuções  
✅ `querTrucar` (linha 60) — 76 execuções  
✅ `responderAoTruco` (linha 73) — 20 execuções

### `src/nucleo/partida.js`

✅ `novoJogador` (linha 53) — 31.006 execuções  
✅ `novaMao` (linha 71) — 15.503 execuções  
✅ `reindexar` (linha 105) — 31.496 execuções  
✅ `copiarMao` (linha 115) — 31.496 execuções  
✅ `emitir` (linha 131) — 566.697 execuções  
✅ `anotar` (linha 136) — 550.433 execuções  
✅ `anotarHistorico` (linha 141) — 449.708 execuções  
✅ `fronteira` (linha 148) — 807.687 execuções  
✅ `alvosDeAtivacao` (linha 154) — 838.978 execuções  
✅ `alvosDeEmpilhamento` (linha 163) — 460.536 execuções  
✅ `efeitoDoEmpilhamento` (linha 178) — 87.554 execuções  
✅ `podeEmpilhar` (linha 188) — 30.153 execuções  
✅ `camadasDesfaziveis` (linha 201) — 23.355 execuções  
✅ `valorParaTransfer` (linha 208) — 436.119 execuções  
✅ `podePassar` (linha 218) — 39.504 execuções  
✅ `combinacoes` (linha 223) — 27 execuções  
✅ `recursao` (linha 225) — 103 execuções  
✅ `jogadasLegais` (linha 238) — 430.235 execuções  
✅ `tirarDaMao` (linha 272) — 40.459 execuções  
✅ `finalizarRede` (linha 281) — 70.339 execuções  
✅ `trocarMaoPowerBI` (linha 288) — 40.458 execuções  
✅ `encerrarTurno` (linha 300) — 434.205 execuções  
✅ `resolverInicio` (linha 316) — 151 execuções  
✅ `ativar` (linha 341) — 365.096 execuções  
✅ `empilhar` (linha 360) — 29.974 execuções  
✅ `fazerDropout` (linha 405) — 10.462 execuções  
✅ `fazerTransfer` (linha 425) — 26 execuções  
✅ `aplicarJogada` (linha 450) — 444.979 execuções  
✅ `somaDasMelhores` (linha 479) — 2.568 execuções  
✅ `cartaMaisAlta` (linha 487) — 96 execuções  
✅ `filtrarMaiores` (linha 497) — 40.668 execuções  
✅ `encerrarMao` (linha 503) — 39.037 execuções

### `src/nucleo/pontuacao.js`

✅ `pontuarNeuronios` (linha 40) — 578.942 execuções  
✅ `aplicarFraternidade` (linha 77) — 42.201 execuções  
✅ `encontrarCombos` (linha 88) — 578.942 execuções  
✅ `pontuarRede` (linha 120) — 578.942 execuções  
✅ `mediaDePontos` (linha 132) — 138 execuções

### `src/nucleo/rede.js`

✅ `ehOculta` (linha 21) — 764.000 execuções  
✅ `nomeCamada` (linha 26) — 365.546 execuções

### `src/nucleo/truco.js`

✅ `novaPartida` (linha 18) — 167 execuções  
✅ `proximoValor` (linha 23) — 6.663 execuções  
✅ `ehMaoDeOnze` (linha 29) — 7.239 execuções  
✅ `podeTrucar` (linha 34) — 5.957 execuções  
✅ `pedirTruco` (linha 42) — 12 execuções  
✅ `responderTruco` (linha 53) — 14 execuções  
✅ `marcarTentos` (linha 71) — 14 execuções  
✅ `proximaMao` (linha 79) — 4 execuções

### `src/principal.js`

✅ `remedirAposMudarATela` (linha 25) — 6 execuções  
✅ `criarJogo` (linha 32) — 17 execuções  
✅ `iniciarJogo` (linha 53) — 18 execuções  
✅ `aoGirar` (linha 56) — 2 execuções
