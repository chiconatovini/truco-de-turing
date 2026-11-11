# Cobertura dos testes

**Versão 1.2.0** · commit `68acb37-dirty` (com as mudanças ainda não registradas) · 10/11/2026, 20:53 (horário de Brasília)  
Ambiente: Node v22.23.4 · Chromium 153.0.8010.12 · Linux x64 · 2 núcleos

Cobertura medida pelo V8 nos testes de unidade (Node) e nos testes de interface (Chromium, com os módulos de `src/` servidos sem empacotar), juntada pelo c8. Ficam fora da conta só `ferramentas/relatorios.js` (o gerador destes relatórios, que é quem roda os testes) e `src/recursos/` (a foto embutida, sem código).

| | Linhas | Instruções | Ramos | Funções |
|---|---:|---:|---:|---:|
| **Total** | 98,7% | 98,7% | 92,2% | 96,8% |

**Funções e métodos com nome executados pelos testes: 716 de 740 (96,8%).** A coluna "Funções" acima conta também as funções anônimas (callbacks de eventos, de animações e de `map`/`filter`).

## Por arquivo

| Arquivo | Linhas | Ramos | Funções |
|---|---:|---:|---:|
| `ferramentas/documentar.js` | 100,0% | 88,6% | 100,0% |
| `ferramentas/empacotar.js` | 100,0% | 71,4% | 100,0% |
| `ferramentas/simular.js` | 94,3% | 80,0% | 100,0% |
| `ferramentas/versionar.js` | 100,0% | 87,0% | 100,0% |
| `src/aplicacao.js` | 100,0% | 89,6% | 100,0% |
| `src/arte/avatares.js` | 100,0% | 98,4% | 100,0% |
| `src/arte/botoes.js` | 100,0% | 76,5% | 100,0% |
| `src/arte/cartas.js` | 100,0% | 95,2% | 100,0% |
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
| `src/arte/versos.js` | 100,0% | 96,0% | 100,0% |
| `src/cenas/CenaCarregamento.js` | 100,0% | 86,7% | 100,0% |
| `src/cenas/CenaMenu.js` | 100,0% | 90,9% | 100,0% |
| `src/cenas/mesa/CenaMesa.js` | 99,0% | 90,0% | 100,0% |
| `src/cenas/mesa/ambiente.js` | 100,0% | 78,1% | 100,0% |
| `src/cenas/mesa/cenario.js` | 100,0% | 95,0% | 82,8% |
| `src/cenas/mesa/desenho.js` | 99,2% | 94,5% | 100,0% |
| `src/cenas/mesa/dicas.js` | 98,8% | 58,3% | 100,0% |
| `src/cenas/mesa/efeitos.js` | 99,0% | 92,1% | 100,0% |
| `src/cenas/mesa/entrada.js` | 91,8% | 74,8% | 100,0% |
| `src/cenas/mesa/layout.js` | 100,0% | 96,7% | 90,0% |
| `src/cenas/mesa/paineis.js` | 98,6% | 72,0% | 100,0% |
| `src/cenas/mesa/resultado.js` | 100,0% | 88,6% | 100,0% |
| `src/cenas/mesa/truco.js` | 100,0% | 91,3% | 100,0% |
| `src/cenas/mesa/turnos.js` | 93,8% | 93,0% | 100,0% |
| `src/cenas/recursos.js` | 100,0% | 90,9% | 100,0% |
| `src/configuracao.js` | 100,0% | 100,0% | 100,0% |
| `src/conteudo/avatares.js` | 100,0% | 92,3% | 100,0% |
| `src/conteudo/conquistas.js` | 100,0% | 100,0% | 100,0% |
| `src/conteudo/dicasDeJogo.js` | 100,0% | 100,0% | 100,0% |
| `src/conteudo/figurasDaBiblioteca.js` | 100,0% | 100,0% | 100,0% |
| `src/conteudo/grimorio.js` | 100,0% | 100,0% | 100,0% |
| `src/conteudo/modExemplo.js` | 100,0% | 100,0% | 100,0% |
| `src/conteudo/progresso.js` | 100,0% | 94,7% | 100,0% |
| `src/conteudo/textos.js` | 100,0% | 100,0% | 100,0% |
| `src/interface/menu.js` | 100,0% | 93,5% | 100,0% |
| `src/interface/musica.js` | 98,7% | 99,0% | 100,0% |
| `src/interface/paineis.js` | 100,0% | 100,0% | 100,0% |
| `src/interface/som.js` | 100,0% | 93,5% | 100,0% |
| `src/interface/telas/ajudaDasAcoes.js` | 100,0% | 77,8% | 100,0% |
| `src/interface/telas/avatares.js` | 100,0% | 90,9% | 100,0% |
| `src/interface/telas/conquistas.js` | 100,0% | 84,6% | 100,0% |
| `src/interface/telas/grimorio.js` | 100,0% | 88,9% | 100,0% |
| `src/interface/telas/mods.js` | 98,5% | 80,0% | 100,0% |
| `src/interface/telas/regras.js` | 100,0% | 90,3% | 83,3% |
| `src/interface/telas/revisao.js` | 100,0% | 96,5% | 100,0% |
| `src/interface/telas/sobre.js` | 100,0% | 100,0% | 100,0% |
| `src/motor/bot.js` | 90,4% | 94,8% | 94,1% |
| `src/motor/engine.js` | 100,0% | 100,0% | 100,0% |
| `src/motor/engine/actions.js` | 100,0% | 88,7% | 100,0% |
| `src/motor/engine/core.js` | 94,6% | 89,0% | 91,2% |
| `src/motor/engine/decks.js` | 100,0% | 100,0% | 100,0% |
| `src/motor/engine/index.js` | 100,0% | 83,3% | 100,0% |
| `src/motor/engine/registry.js` | 100,0% | 73,3% | 80,0% |
| `src/motor/engine/terrains.js` | 100,0% | 100,0% | 81,8% |
| `src/motor/engine/util.js` | 100,0% | 93,1% | 78,6% |
| `src/motor/sim.js` | 49,3% | 77,8% | 40,0% |
| `src/nucleo/aleatorio.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/baralhos.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/cartas.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/oponentes/comum.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/oponentes/estrategias.js` | 100,0% | 100,0% | 100,0% |
| `src/nucleo/oponentes/index.js` | 100,0% | 91,8% | 100,0% |
| `src/nucleo/partida.js` | 99,8% | 96,2% | 97,0% |
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
✅ `limparComentario` (linha 25) — 596 execuções  
✅ `lerModulo` (linha 37) — 81 execuções

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

✅ `normalizarOpcoes` (linha 28) — 103 execuções  
✅ `iniciar` (linha 50) — 22 execuções  
✅ `salvar` (linha 58) — 90 execuções  
✅ `salvarOpcoes` (linha 61) — 26 execuções  
✅ `alternarSom` (linha 64) — 3 execuções  
✅ `alternarMusica` (linha 74) — 4 execuções  
✅ `jogar` (linha 82) — 20 execuções  
✅ `irParaMenu` (linha 91) — 5 execuções  
✅ `modoImersivo` (linha 102) — 21 execuções  
✅ `registrarMao` (linha 119) — 13 execuções  
✅ `marcarVerbeteLido` (linha 147) — 40 execuções

### `src/arte/avatares.js`

✅ `desenharAvatar` (linha 17) — 304 execuções  
✅ `curve` (linha 31) — 2.310 execuções  
✅ `olho` (linha 168) — 96 execuções  
✅ `gato` (linha 178) — 24 execuções  
✅ `robo` (linha 194) — 24 execuções  
✅ `coruja` (linha 211) — 24 execuções  
✅ `monge` (linha 224) — 24 execuções  
✅ `nobre` (linha 241) — 24 execuções  
✅ `decifrador` (linha 257) — 24 execuções  
✅ `cosmico` (linha 271) — 24 execuções

### `src/arte/botoes.js`

✅ `desenharFaisca` (linha 10) — 76 execuções  
✅ `desenharBotao` (linha 25) — 130 execuções

### `src/arte/cartas.js`

✅ `dadosDaCarta` (linha 22) — 1.529 execuções  
✅ `simboloDeColecao` (linha 54) — 702 execuções  
✅ `ilustracaoDaCarta` (linha 63) — 602 execuções  
✅ `posicoesDosNaipes` (linha 114) — 773 execuções  
✅ `fileira` (linha 115) — 12.368 execuções  
✅ `desenharCartaCompleta` (linha 132) — 602 execuções  
✅ `desenharCartaDaMesa` (linha 203) — 921 execuções  
✅ `indice` (linha 265) — 1.842 execuções

### `src/arte/cartasDeTerreno.js`

✅ `desenharCartaDeTerreno` (linha 16) — 96 execuções

### `src/arte/cenarios.js`

✅ `perfilDeSerra` (linha 11) — 1.202 execuções  
✅ `sub` (linha 14) — 152.654 execuções  
✅ `montanhas` (linha 23) — 395 execuções  
✅ `estrelas` (linha 40) — 435 execuções  
✅ `constelacao` (linha 48) — 631 execuções  
✅ `vinheta` (linha 70) — 1.628 execuções  
✅ `raios` (linha 75) — 404 execuções  
✅ `cenarioDoNaipe` (linha 89) — 1.531 execuções

### `src/arte/emblemas.js`

✅ `desenharEmblema` (linha 7) — 4.617 execuções

### `src/arte/figuras.js`

✅ `coroa` (linha 18) — 268 execuções  
✅ `desenharFigura` (linha 41) — 372 execuções

### `src/arte/icones.js`

✅ `svg` (linha 8) — 1.100 execuções  
✅ `gato` (linha 12) — 75 execuções

### `src/arte/mesas.js`

✅ `desenharFeltro` (linha 12) — 44 execuções  
✅ `vinhetaDaMesa` (linha 36) — 26 execuções  
✅ `fibras` (linha 41) — 19 execuções  
✅ `mesaMontanha` (linha 51) — 6 execuções  
✅ `vitoriaRegia` (linha 97) — 910 execuções  
✅ `mesaPantano` (linha 111) — 13 execuções  
✅ `rosaDosVentos` (linha 145) — 7 execuções  
✅ `mesaOceano` (linha 161) — 7 execuções  
✅ `desenharMesa` (linha 186) — 69 execuções

### `src/arte/moldura.js`

✅ `corpoDaMoldura` (linha 10) — 1.621 execuções  
✅ `placa` (linha 41) — 2.002 execuções  
✅ `gema` (linha 55) — 2.129 execuções

### `src/arte/pincel.js`

✅ `criarTela` (linha 9) — 2.380 execuções  
✅ `caminhoArredondado` (linha 19) — 18.277 execuções  
✅ `hashDoTexto` (linha 30) — 2.226 execuções  
✅ `geradorComSemente` (linha 36) — 2.276 execuções  
✅ `degradeLinear` (linha 45) — 25.641 execuções  
✅ `degradeRadial` (linha 51) — 27.981 execuções  
✅ `escreverComQuebra` (linha 57) — 1.301 execuções  
✅ `ajustarFonte` (linha 71) — 1.522 execuções  
✅ `granulado` (linha 75) — 3.410 execuções  
✅ `escovado` (linha 83) — 1.622 execuções  
✅ `sombraSuave` (linha 92) — 10.103 execuções  
✅ `semSombra` (linha 97) — 15.910 execuções  
✅ `brilho` (linha 99) — 18.919 execuções  
✅ `comAlfa` (linha 104) — 76.794 execuções  
✅ `tonalizar` (linha 109) — 13.833 execuções

### `src/arte/retrato.js`

✅ `caminhoArredondado` (linha 6) — 4 execuções  
✅ `arcoGotico` (linha 11) — 16 execuções  
✅ `dourado` (linha 21) — 4 execuções  
✅ `desenharRetratoEmMoldura` (linha 35) — 4 execuções  
✅ `img.onload` (linha 42) — 4 execuções

### `src/arte/versos.js`

✅ `molduraDourada` (linha 14) — 109 execuções  
✅ `legenda` (linha 27) — 125 execuções  
✅ `versoClassico` (linha 34) — 89 execuções  
✅ `versoTruco` (linha 76) — 10 execuções  
✅ `versoFraternidade` (linha 121) — 7 execuções  
✅ `simboloYinYang` (linha 161) — 8 execuções  
✅ `versoYinYang` (linha 173) — 8 execuções  
✅ `bx` (linha 174) — 2.552 execuções  
✅ `versoPowerBI` (linha 207) — 19 execuções  
✅ `versoNobreza` (linha 272) — 5 execuções  
✅ `florDeLis` (linha 300) — 700 execuções  
✅ `coroa` (linha 309) — 5 execuções  
✅ `versoBackprop` (linha 324) — 5 execuções  
✅ `no` (linha 339) — 20 execuções  
✅ `seta` (linha 345) — 25 execuções  
✅ `desenharVerso` (linha 378) — 143 execuções

### `src/cenas/CenaCarregamento.js`

✅ `CenaCarregamento` (linha 23) — 21 execuções  
✅ `create` (linha 25) — 21 execuções  
✅ `gerarTexturas` (linha 38) — 21 execuções  
✅ `adicionar` (linha 39) — 357 execuções

### `src/cenas/CenaMenu.js`

✅ `CenaMenu` (linha 19) — 21 execuções  
✅ `create` (linha 21) — 25 execuções  
✅ `tocarMusicaDoMenu` (linha 36) — 25 execuções  
✅ `aoTocar` (linha 39) — 20 execuções  
✅ `espalharCartas` (linha 50) — 25 execuções  
✅ `update` (linha 61) — 988 execuções

### `src/cenas/mesa/CenaMesa.js`

✅ `CenaMesa` (linha 50) — 21 execuções  
✅ `create` (linha 53) — 19 execuções  
✅ `comecar` (linha 82) — 19 execuções  
✅ `update` (linha 88) — 2.919 execuções

### `src/cenas/mesa/ambiente.js`

✅ `reduzirMovimento` (linha 17) — 19 execuções  
✅ `criarAmbiente` (linha 23) — 19 execuções  
✅ `criarTexturasDoAmbiente` (linha 31) — 19 execuções  
✅ `luzDoTerreno` (linha 50) — 19 execuções  
✅ `ambienteNeutro` (linha 56) — 12 execuções  
✅ `ambienteMontanha` (linha 68) — 2 execuções  
✅ `onComplete` (linha 78) — 6 execuções  
✅ `ambientePantano` (linha 89) — 3 execuções  
✅ `ambienteOceano` (linha 110) — 2 execuções  
✅ `nuvemEmLaco` (linha 129) — 6 execuções  
✅ `desenharOndas` (linha 136) — 270 execuções  
✅ `atualizarAmbiente` (linha 152) — 2.919 execuções

### `src/cenas/mesa/cenario.js`

✅ `desenharCenarioFixo` (linha 20) — 19 execuções  
✅ `criarBotao` (linha 61) — 228 execuções  
✅ `textura` (linha 63) — 1.262 execuções  
✅ `pintar` (linha 82) — 1.034 execuções  
✅ `temDica` (linha 83) — 39 execuções  
✅ `mostrarDica` (linha 84) — 2 execuções  
✅ `botao.definirRotulo` (linha 108) — 2.296 execuções  
✅ `botao.habilitar` (linha 109) — 9.171 execuções  
✅ `criarPaineis` (linha 121) — 19 execuções  
✅ `criarTexto` (linha 130) — 618 execuções  
✅ `criarPainelEsquerdo` (linha 135) — 19 execuções  
✅ `criarPilha` (linha 143) — 38 execuções  
✅ `criarPlacar` (linha 192) — 19 execuções  
✅ `criarBlocoCompacto` (linha 237) — 12 execuções  
✅ `criarBotoesDeAcao` (linha 261) — 19 execuções  
✅ `p.truco.criarBotao.variante` (linha 265) — 2 execuções  
✅ `p.botaoAjuda.criarBotao.variante` (linha 266) — 1 execução  
❌ `explicar` (linha 268) — 0 execuções  
✅ `coluna` (linha 270) — 152 execuções  
✅ `tunagem` (linha 272) — 1 execução  
❌ `overfit` (linha 272) — 0 execuções  
❌ `earlystop` (linha 273) — 0 execuções  
❌ `stackoverflow` (linha 273) — 0 execuções  
✅ `dropout` (linha 274) — 3 execuções  
✅ `transfer` (linha 274) — 1 execução  
✅ `passar` (linha 274) — 1 execução  
❌ `limpar` (linha 274) — 0 execuções  
✅ `explicar` (linha 282) — 7 execuções  
✅ `atualizarChaves` (linha 294) — 30 execuções

### `src/cenas/mesa/desenho.js`

✅ `inspecionar` (linha 27) — 303 execuções  
✅ `mostrarDica` (linha 33) — 1.215 execuções  
✅ `redesenhar` (linha 38) — 1.019 execuções  
✅ `desenharMaos` (linha 76) — 1.019 execuções  
✅ `posicaoDaMaoDeCima` (linha 129) — 1.653 execuções  
✅ `notaDaCartaDaMao` (linha 136) — 1 execução  
✅ `atualizarPaineis` (linha 144) — 1.019 execuções  
✅ `textoComDicaDeJogo` (linha 164) — 1.098 execuções  
✅ `atualizarPilha` (linha 174) — 2.038 execuções  
✅ `atualizarBlocoDoJogador` (linha 195) — 2.652 execuções  
✅ `textoDaSituacao` (linha 232) — 2.652 execuções  
✅ `atualizarBlocoCompacto` (linha 239) — 1.174 execuções  
✅ `estaNaVez` (linha 257) — 7.745 execuções  
✅ `desenharDestaqueDaVez` (linha 262) — 2.556 execuções  
✅ `atualizarBotoes` (linha 279) — 1.019 execuções  
✅ `atualizarRegistro` (linha 295) — 1.019 execuções  
✅ `desenharCurva` (linha 304) — 1.019 execuções  
✅ `textoDaDica` (linha 332) — 1.098 execuções  
✅ `alvosDaAcao` (linha 367) — 2.859 execuções  
✅ `dropoutPossivel` (linha 376) — 714 execuções  
✅ `valorSelecionado` (linha 386) — 416 execuções  
✅ `calcularAlvos` (linha 392) — 1.019 execuções  
✅ `desenharConexoesEAlvos` (linha 427) — 2.556 execuções

### `src/cenas/mesa/dicas.js`

✅ `conceitoCurto` (linha 32) — 8 execuções  
✅ `alternarDicas` (linha 39) — 2 execuções  
✅ `acao` (linha 56) — 1 execução  
✅ `darDicaDoTurno` (linha 69) — 120 execuções  
✅ `textoDaDicaDeJogo` (linha 81) — 1.098 execuções  
✅ `mostrarDicaDoBotao` (linha 89) — 2 execuções  
✅ `esconderDicaDoBotao` (linha 99) — 20 execuções  
✅ `conteudoDaDica` (linha 105) — 6 execuções  
✅ `dicaDaRespostaAoTruco` (linha 164) — 8 execuções

### `src/cenas/mesa/efeitos.js`

✅ `corCss` (linha 25) — 131 execuções  
✅ `posicaoDoNeuronio` (linha 29) — 245 execuções  
✅ `origemDasCartas` (linha 35) — 52 execuções  
✅ `animarEventos` (linha 47) — 262 execuções  
✅ `animar_ativacao` (linha 59) — 193 execuções  
✅ `animar_tunagem` (linha 77) — 18 execuções  
✅ `animar_ataque` (linha 93) — 30 execuções  
✅ `onComplete` (linha 108) — 30 execuções  
✅ `animar_overfit` (linha 126) — 19 execuções  
✅ `animar_earlystop` (linha 127) — 9 execuções  
✅ `animar_stackoverflow` (linha 128) — 2 execuções  
✅ `animar_dropout` (linha 131) — 4 execuções  
✅ `animar_transfer` (linha 143) — 1 execução  
✅ `animar_completa` (linha 152) — 19 execuções  
✅ `animar_vento` (linha 159) — 12 execuções  
✅ `animar_powerbi` (linha 166) — 1 execução  
✅ `animar_travada` (linha 172) — 1 execução  
✅ `animar_passe` (linha 179) — 4 execuções  
✅ `animar_inicio` (linha 186) — 9 execuções  
✅ `onComplete` (linha 202) — 24 execuções  
✅ `verificarVanishing` (linha 209) — 262 execuções  
✅ `voarCarta` (linha 227) — 55 execuções  
✅ `onComplete` (linha 232) — 55 execuções  
✅ `explodir` (linha 237) — 101 execuções  
✅ `textoFlutuante` (linha 249) — 254 execuções  
✅ `onComplete` (linha 251) — 252 execuções  
✅ `faixa` (linha 255) — 77 execuções  
✅ `onComplete` (linha 272) — 77 execuções  
✅ `falar` (linha 281) — 46 execuções  
✅ `onComplete` (linha 296) — 43 execuções  
✅ `impactoDoTruco` (linha 303) — 12 execuções  
✅ `avisarVerbete` (linha 312) — 809 execuções

### `src/cenas/mesa/entrada.js`

✅ `realcarNeuronio` (linha 25) — 183 execuções  
✅ `aoPassarNoNeuronio` (linha 37) — 183 execuções  
✅ `executarAcao` (linha 73) — 1 execução  
✅ `acionarDropout` (linha 89) — 3 execuções  
✅ `explicarAcao` (linha 103) — 7 execuções  
✅ `aoClicarNoNeuronio` (linha 147) — 108 execuções  
✅ `aoClicarNaCarta` (linha 169) — 218 execuções  
✅ `cancelarSelecao` (linha 204) — 220 execuções  
✅ `alternarDropout` (linha 213) — 3 execuções  
✅ `fazerTransfer` (linha 220) — 1 execução  
✅ `passarAVez` (linha 228) — 4 execuções  
✅ `abrirRegrasDaMesa` (linha 236) — 5 execuções  
✅ `regras` (linha 249) — 1 execução  
✅ `ajuda` (linha 250) — 1 execução  
✅ `grimorio` (linha 251) — 1 execução  
✅ `dicas` (linha 252) — 2 execuções  
✅ `abrirAjudaDaMesa` (linha 262) — 2 execuções  
✅ `abrirMenuDaMesa` (linha 270) — 4 execuções  
✅ `q` (linha 279) — 12 execuções  
✅ `perguntarSeVoltaAoMenu` (linha 287) — 2 execuções  
✅ `acao` (linha 290) — 1 execução

### `src/cenas/mesa/layout.js`

✅ `blocosDoPlacar` (linha 65) — 23 execuções  
✅ `definirMesa` (linha 90) — 37 execuções  
✅ `geometria` (linha 103) — 19 execuções  
❌ `totalDeCamadasDaMesa` (linha 106) — 0 execuções  
✅ `colunaX` (linha 109) — 30.276 execuções  
✅ `linhaY` (linha 111) — 30.372 execuções  
✅ `cartaDaMesa` (linha 114) — 41.396 execuções  
✅ `ajustarCartaDaMesa` (linha 130) — 37.493 execuções  
✅ `ajustarLinha` (linha 141) — 18.789 execuções  
✅ `ajustarBloco` (linha 157) — 2.560 execuções

### `src/cenas/mesa/paineis.js`

✅ `cabecalho` (linha 12) — 3 execuções  
✅ `listaDeCartas` (linha 16) — 1 execução  
✅ `abrirPlacarPorCamada` (linha 26) — 1 execução  
✅ `abrirRegistroCompleto` (linha 52) — 1 execução  
✅ `abrirCemiterio` (linha 62) — 1 execução

### `src/cenas/mesa/resultado.js`

✅ `encerrarMao` (linha 30) — 14 execuções  
✅ `comemorar` (linha 68) — 6 execuções  
✅ `faixaDeVitoria` (linha 89) — 6 execuções  
✅ `onComplete` (linha 106) — 6 execuções  
✅ `chuvaDeConfete` (linha 111) — 6 execuções  
✅ `htmlDaRede` (linha 133) — 48 execuções  
✅ `mostrarResultado` (linha 151) — 19 execuções  
✅ `aoFechar` (linha 186) — 6 execuções

### `src/cenas/mesa/truco.js`

✅ `pedirTrucoHumano` (linha 13) — 2 execuções  
✅ `anunciarTruco` (linha 19) — 10 execuções  
✅ `pedirResposta` (linha 32) — 10 execuções  
✅ `acao` (linha 45) — 1 execução  
✅ `acao` (linha 46) — 6 execuções  
✅ `acao` (linha 48) — 1 execução  
✅ `aplicarResposta` (linha 59) — 10 execuções

### `src/cenas/mesa/turnos.js`

✅ `verso` (linha 22) — 41.077 execuções  
✅ `jogadorDeBaixo` (linha 25) — 9.358 execuções  
✅ `outrosJogadores` (linha 28) — 4.661 execuções  
✅ `ordemDoPlacar` (linha 34) — 3.622 execuções  
✅ `avatarDe` (linha 40) — 2.652 execuções  
✅ `montarJogadores` (linha 52) — 23 execuções  
✅ `ehVezDoHumano` (linha 62) — 7.996 execuções  
✅ `iniciarMao` (linha 71) — 23 execuções  
✅ `criarNeuronios` (linha 108) — 23 execuções  
✅ `executarJogada` (linha 136) — 261 execuções  
✅ `avancar` (linha 156) — 323 execuções  
✅ `anotarNaLinhaDoTempo` (linha 189) — 281 execuções  
✅ `avancarNoInicio` (linha 206) — 12 execuções  
✅ `comecar` (linha 218) — 12 execuções  
✅ `passarAparelho` (linha 225) — 37 execuções  
✅ `acao` (linha 230) — 37 execuções  
✅ `vezDoOponente` (linha 238) — 145 execuções

### `src/cenas/recursos.js`

✅ `prepararTextoNitido` (linha 20) — 21 execuções  
✅ `fabrica.text` (linha 23) — 3.768 execuções  
✅ `ajustarCamera` (linha 36) — 65 execuções  
✅ `ajustar` (linha 40) — 4.064 execuções  
✅ `cena.reajustarCamera` (linha 54) — 44 execuções  
✅ `texturaDaMesa` (linha 62) — 65 execuções  
✅ `colocarFundo` (linha 72) — 44 execuções  
✅ `texturaDoVerso` (linha 83) — 41.140 execuções  
✅ `texturaDaCartaNaMao` (linha 94) — 5.162 execuções  
✅ `texturaDaCartaMedia` (linha 101) — 24 execuções  
✅ `texturaDaCartaNaMesa` (linha 108) — 7.858 execuções  
✅ `criarTexturaDeInspecao` (linha 118) — 21 execuções  
✅ `texturaDeInspecao` (linha 127) — 222 execuções  
✅ `liberarCartasDaMao` (linha 144) — 23 execuções  
✅ `retanguloNaTela` (linha 152) — 2 execuções  
✅ `px` (linha 155) — 6 execuções  
✅ `py` (linha 156) — 6 execuções  
✅ `carregarIconesDasAcoes` (linha 164) — 19 execuções  
✅ `imagem.onload` (linha 169) — 152 execuções

### `src/conteudo/avatares.js`

✅ `avatarLiberado` (linha 25) — 1.353 execuções  
✅ `avatarDoJogador` (linha 30) — 1.309 execuções  
✅ `conquistaQueLibera` (linha 36) — 17 execuções  
✅ `avataresDaConquista` (linha 42) — 20 execuções

### `src/conteudo/conquistas.js`

✅ `meu` (linha 29) — 97 execuções  
✅ `teste` (linha 32) — 14 execuções  
✅ `teste` (linha 33) — 15 execuções  
✅ `teste` (linha 34) — 15 execuções  
✅ `teste` (linha 35) — 15 execuções  
✅ `teste` (linha 36) — 15 execuções  
✅ `teste` (linha 37) — 13 execuções  
✅ `teste` (linha 38) — 13 execuções  
✅ `teste` (linha 39) — 13 execuções  
✅ `teste` (linha 40) — 13 execuções  
✅ `teste` (linha 41) — 13 execuções  
✅ `teste` (linha 42) — 13 execuções  
✅ `teste` (linha 43) — 13 execuções  
✅ `teste` (linha 44) — 13 execuções  
✅ `teste` (linha 45) — 11 execuções  
✅ `teste` (linha 46) — 13 execuções  
✅ `teste` (linha 47) — 13 execuções  
✅ `teste` (linha 48) — 13 execuções  
✅ `teste` (linha 49) — 13 execuções  
✅ `teste` (linha 50) — 14 execuções  
✅ `teste` (linha 51) — 15 execuções  
✅ `teste` (linha 52) — 14 execuções  
✅ `teste` (linha 53) — 15 execuções  
✅ `teste` (linha 54) — 15 execuções  
✅ `teste` (linha 55) — 15 execuções  
✅ `teste` (linha 56) — 15 execuções  
✅ `teste` (linha 57) — 13 execuções  
✅ `teste` (linha 58) — 15 execuções  
✅ `teste` (linha 60) — 13 execuções  
✅ `teste` (linha 61) — 13 execuções  
✅ `teste` (linha 62) — 13 execuções  
✅ `teste` (linha 63) — 13 execuções  
✅ `teste` (linha 64) — 13 execuções  
✅ `teste` (linha 65) — 13 execuções  
✅ `teste` (linha 66) — 13 execuções  
✅ `teste` (linha 67) — 15 execuções

### `src/conteudo/dicasDeJogo.js`

✅ `contarValores` (linha 43) — 6.088 execuções  
✅ `escolherDicaDeJogo` (linha 57) — 6.088 execuções  
✅ `soma` (linha 63) — 12.176 execuções  
✅ `podeAtacar` (linha 64) — 6.089 execuções  
✅ `dica` (linha 70) — 5.395 execuções  
✅ `atacavel` (linha 71) — 6.088 execuções

### `src/conteudo/figurasDaBiblioteca.js`

✅ `svg` (linha 10) — 15 execuções  
✅ `traco` (linha 15) — 14 execuções  
✅ `eixos` (linha 20) — 3 execuções  
✅ `amostrar` (linha 27) — 7 execuções  
✅ `neuronio` (linha 34) — 6 execuções  
✅ `ativacoes` (linha 56) — 1 execução  
✅ `painel` (linha 57) — 3 execuções  
✅ `tela` (linha 58) — 183 execuções  
✅ `rede` (linha 70) — 1 execução  
✅ `ys` (linha 72) — 24 execuções  
✅ `curvas` (linha 86) — 1 execução  
✅ `tela` (linha 87) — 124 execuções  
✅ `treino` (linha 88) — 61 execuções  
✅ `validacao` (linha 89) — 63 execuções  
✅ `sobreajuste` (linha 101) — 1 execução  
✅ `tela` (linha 103) — 272 execuções  
✅ `suave` (linha 104) — 41 execuções  
✅ `decorada` (linha 106) — 221 execuções  
✅ `dropout` (linha 116) — 4 execuções  
✅ `ys` (linha 118) — 80 execuções  
✅ `vanishing` (linha 137) — 1 execução  
✅ `figuraDaBiblioteca` (linha 151) — 16 execuções

### `src/conteudo/grimorio.js`

✅ `bloco` (linha 16) — 572 execuções  
✅ `mi` (linha 17) — 3.224 execuções  
✅ `mo` (linha 18) — 3.276 execuções  
✅ `mn` (linha 19) — 650 execuções  
✅ `mt` (linha 20) — 572 execuções  
✅ `linha` (linha 21) — 1.794 execuções  
✅ `sub` (linha 22) — 494 execuções  
✅ `sup` (linha 23) — 546 execuções  
✅ `frac` (linha 24) — 390 execuções  
✅ `raiz` (linha 25) — 26 execuções  
✅ `soma` (linha 26) — 78 execuções  
✅ `prod` (linha 27) — 52 execuções  
✅ `parc` (linha 28) — 182 execuções  
✅ `par` (linha 29) — 546 execuções  
✅ `abs` (linha 30) — 52 execuções  
✅ `chapeu` (linha 31) — 26 execuções  
✅ `negrito` (linha 32) — 468 execuções  
✅ `camada` (linha 33) — 130 execuções  
✅ `mspace` (linha 143) — 286 execuções  
✅ `mover` (linha 145) — 78 execuções

### `src/conteudo/progresso.js`

✅ `progressoInicial` (linha 13) — 30 execuções  
✅ `migrarV1` (linha 22) — 2 execuções  
✅ `carregarProgresso` (linha 34) — 30 execuções  
✅ `salvarProgresso` (linha 46) — 92 execuções

### `src/conteudo/textos.js`

✅ `provocar` (linha 43) — 59 execuções

### `src/interface/menu.js`

✅ `escolhasDeHumanos` (linha 44) — 142 execuções  
✅ `mostrarMiniatura` (linha 54) — 230 execuções  
✅ `opcoesHtml` (linha 63) — 358 execuções  
✅ `htmlDoMenu` (linha 71) — 27 execuções  
✅ `abrirMenu` (linha 114) — 27 execuções  
✅ `campo` (linha 118) — 2.690 execuções  
✅ `atualizarDicas` (linha 121) — 115 execuções  
✅ `lerEscolhas` (linha 148) — 32 execuções  
✅ `mostrarAvatar` (linha 167) — 28 execuções

### `src/interface/musica.js`

✅ `hz` (linha 24) — 5.809 execuções  
✅ `sorteador` (linha 27) — 1.880 execuções  
✅ `voz` (linha 44) — 4.939 execuções  
✅ `chiado` (linha 70) — 468 execuções  
✅ `tambor` (linha 86) — 223 execuções  
✅ `sino` (linha 99) — 12 execuções  
✅ `harpa` (linha 112) — 508 execuções  
✅ `glockenspiel` (linha 118) — 274 execuções  
✅ `harmonicaDeVidro` (linha 131) — 181 execuções  
✅ `marimba` (linha 138) — 126 execuções  
✅ `pizzicato` (linha 144) — 216 execuções  
✅ `coro` (linha 149) — 79 execuções  
✅ `melodia` (linha 154) — 1.880 execuções  
✅ `tocar` (linha 177) — 198 execuções  
✅ `tocar` (linha 201) — 892 execuções  
✅ `tocar` (linha 227) — 192 execuções  
✅ `tocar` (linha 250) — 310 execuções  
✅ `tocar` (linha 282) — 288 execuções  
✅ `gravarTrilha` (linha 303) — 5 execuções  
✅ `agendar` (linha 325) — 1.779 execuções  
✅ `tocar` (linha 346) — 58 execuções  
✅ `parar` (linha 362) — 59 execuções  
✅ `tocando` (linha 375) — 12 execuções

### `src/interface/paineis.js`

✅ `$` (linha 9) — 340 execuções  
✅ `escaparHtml` (linha 12) — 4.674 execuções  
✅ `abrirPainel` (linha 31) — 168 execuções  
✅ `fechar` (linha 38) — 137 execuções  
✅ `fecharTodos` (linha 51) — 75 execuções  
✅ `mostrarAviso` (linha 62) — 93 execuções  
✅ `mostrarDicaDeJogo` (linha 78) — 4 execuções  
✅ `confirmar` (linha 98) — 50 execuções  
✅ `mostrarDicaFlutuante` (linha 126) — 5 execuções  
✅ `esconderDicaFlutuante` (linha 145) — 55 execuções

### `src/interface/som.js`

✅ `contextoDeAudio` (linha 11) — 72 execuções  
✅ `audio` (linha 14) — 1.420 execuções  
✅ `nota` (linha 33) — 960 execuções  
✅ `ruido` (linha 49) — 346 execuções  
✅ `desbloquear` (linha 65) — 42 execuções  
✅ `liberado` (linha 67) — 25 execuções  
✅ `definirMudo` (linha 68) — 28 execuções  
✅ `estaMudo` (linha 69) — 36 execuções  
✅ `virarCarta` (linha 70) — 194 execuções  
✅ `colocarCarta` (linha 71) — 12 execuções  
✅ `selecionar` (linha 72) — 224 execuções  
✅ `tunagem` (linha 73) — 19 execuções  
✅ `golpe` (linha 74) — 31 execuções  
✅ `explosao` (linha 75) — 5 execuções  
✅ `dropout` (linha 76) — 5 execuções  
✅ `truco` (linha 81) — 18 execuções  
✅ `vitoria` (linha 90) — 1 execução  
✅ `fanfarra` (linha 96) — 9 execuções  
✅ `campeao` (linha 111) — 2 execuções  
✅ `derrota` (linha 123) — 10 execuções  
✅ `medalha` (linha 124) — 31 execuções

### `src/interface/telas/ajudaDasAcoes.js`

✅ `doMotor` (linha 43) — 32 execuções  
✅ `abrirAjudaDasAcoes` (linha 52) — 4 execuções

### `src/interface/telas/avatares.js`

✅ `retratoDoAvatar` (linha 14) — 46 execuções  
✅ `abrirAvatares` (linha 24) — 2 execuções

### `src/interface/telas/conquistas.js`

✅ `medalhaHtml` (linha 17) — 126 execuções  
✅ `itemHtml` (linha 24) — 105 execuções  
✅ `abrirConquistas` (linha 34) — 3 execuções

### `src/interface/telas/grimorio.js`

✅ `abrirGrimorio` (linha 16) — 8 execuções  
✅ `desenharLista` (linha 25) — 10 execuções  
✅ `mostrar` (linha 33) — 10 execuções

### `src/interface/telas/mods.js`

✅ `abrirMods` (linha 28) — 3 execuções

### `src/interface/telas/regras.js`

✅ `abaDeAcoes` (linha 59) — 25 execuções  
✅ `abaDeExtensoes` (linha 68) — 25 execuções  
✅ `desenharArte` (linha 93) — 2 execuções  
✅ `abrirRegras` (linha 116) — 25 execuções  
✅ `mostrarAba` (linha 128) — 29 execuções  
❌ `marcarVerbeteLido` (linha 136) — 0 execuções

### `src/interface/telas/revisao.js`

✅ `placar` (linha 19) — 18 execuções  
✅ `tipoDoPasso` (linha 34) — 616 execuções  
✅ `variacoes` (linha 48) — 26 execuções  
✅ `momentosChave` (linha 56) — 9 execuções  
✅ `contagens` (linha 77) — 9 execuções  
✅ `graficoDaCurva` (linha 89) — 8 execuções  
✅ `x` (linha 95) — 639 execuções  
✅ `y` (linha 96) — 745 execuções  
✅ `linhaDoTempoHtml` (linha 130) — 9 execuções  
✅ `tabelaDaPartida` (linha 150) — 8 execuções  
✅ `abrirRevisao` (linha 161) — 9 execuções  
✅ `linha` (linha 165) — 26 execuções  
✅ `qtd` (linha 168) — 111 execuções

### `src/interface/telas/sobre.js`

✅ `abrirSobre` (linha 9) — 3 execuções

### `src/motor/bot.js`

✅ `botMoves` (linha 19) — 611.807 execuções  
✅ `optionalPass` (linha 20) — 11.912 execuções  
✅ `revealPick` (linha 24) — 2.436 execuções  
✅ `str` (linha 27) — 24 execuções  
✅ `val` (linha 30) — 12.396 execuções  
✅ `randomPolicy` (linha 35) — 595.235 execuções  
✅ `playout` (linha 54) — 71.812 execuções  
✅ `margin` (linha 65) — 132.225 execuções  
✅ `evaluate` (linha 71) — 62.687 execuções  
✅ `mean` (linha 73) — 125.374 execuções  
✅ `bad` (linha 75) — 173.033 execuções  
✅ `greedyMove` (linha 80) — 13.050 execuções  
✅ `monteCarloMove` (linha 106) — 3.520 execuções  
✅ `monteCarloResults` (linha 116) — 3.373 execuções  
✅ `defaultRollouts` (linha 134) — 31 execuções  
✅ `chooseMove` (linha 136) — 40.054 execuções  
❌ `describeMove` (linha 142) — 0 execuções

### `src/motor/engine/actions.js`

✅ `generate` (linha 18) — 2.148.473 execuções  
✅ `isValid` (linha 24) — 590.655 execuções  
✅ `execute` (linha 33) — 590.654 execuções  
✅ `generate` (linha 49) — 2.148.473 execuções  
✅ `isValid` (linha 58) — 40.376 execuções  
✅ `execute` (linha 64) — 40.274 execuções  
✅ `attackAction` (linha 84) — 111 execuções  
✅ `generate` (linha 87) — 6.445.419 execuções  
✅ `isValid` (linha 100) — 73.085 execuções  
✅ `execute` (linha 112) — 72.904 execuções  
✅ `statWeight` (linha 146) — 19.702 execuções  
✅ `generate` (linha 149) — 631.518 execuções  
✅ `isValid` (linha 159) — 19.704 execuções  
✅ `execute` (linha 171) — 19.702 execuções  
✅ `generate` (linha 186) — 957.262 execuções  
✅ `isValid` (linha 192) — 2.603 execuções  
✅ `execute` (linha 197) — 2.602 execuções  
✅ `generate` (linha 217) — 2.147.720 execuções  
✅ `isValid` (linha 218) — 2.119 execuções  
✅ `execute` (linha 219) — 2.112 execuções

### `src/motor/engine/core.js`

✅ `rulesOf` (linha 48) — 1.126.544 execuções  
✅ `scaleLayers` (linha 59) — 6.214 execuções  
✅ `newGame` (linha 66) — 6.051 execuções  
✅ `rng` (linha 70) — 385.757 execuções  
✅ `each` (linha 103) — 54.450 execuções  
✅ `mkNet` (linha 141) — 13.803 execuções  
✅ `startPlay` (linha 143) — 6.037 execuções  
✅ `revealMoves` (linha 157) — 3.089 execuções  
✅ `applyReveal` (linha 161) — 4.865 execuções  
✅ `deckOf` (linha 183) — 11.891.320 execuções  
✅ `terrainOf` (linha 184) — 5.155.972 execuções  
❌ `outputLayer` (linha 185) — 0 execuções  
❌ `layerName` (linha 186) — 0 execuções  
✅ `lastSlot` (linha 192) — 9.756.697 execuções  
✅ `nextLayer` (linha 198) — 4.486.998 execuções  
✅ `isHidden` (linha 199) — 7.284.778 execuções  
✅ `pileSize` (linha 200) — 6.658.628 execuções  
✅ `pileRoom` (linha 201) — 1.601.362 execuções  
✅ `handCardsByRank` (linha 202) — 6.326.271 execuções  
✅ `hiddenInPath` (linha 203) — 631.518 execuções  
✅ `attackTarget` (linha 207) — 150.772 execuções  
✅ `cardValue` (linha 216) — 10.243.448 execuções  
✅ `strengthOf` (linha 221) — 8.639 execuções  
✅ `stackValue` (linha 225) — 162.360 execuções  
✅ `peekCards` (linha 234) — 142.895 execuções  
✅ `takeCards` (linha 246) — 139.688 execuções  
✅ `pileCheck` (linha 251) — 113.461 execuções  
✅ `removeSlot` (linha 258) — 97.311 execuções  
✅ `finishNet` (linha 262) — 140.922 execuções  
✅ `discardHand` (linha 268) — 3.175 execuções  
✅ `addAchievement` (linha 271) — 19.647 execuções  
✅ `logEvent` (linha 274) — 728.248 execuções  
✅ `legalMoves` (linha 278) — 2.150.809 execuções  
✅ `canPass` (linha 298) — 2.150.381 execuções  
✅ `validate` (linha 305) — 733.407 execuções  
✅ `applyMove` (linha 321) — 733.124 execuções  
✅ `roundEnded` (linha 361) — 705.944 execuções  
❌ `nextK` (linha 371) — 0 execuções  
✅ `pickNext` (linha 380) — 705.944 execuções  
✅ `canAct` (linha 393) — 1.516.202 execuções  
✅ `checkStuck` (linha 398) — 734.285 execuções  
✅ `checkOver` (linha 409) — 728.248 execuções  
✅ `endGame` (linha 416) — 78.519 execuções  
✅ `neuronBonus` (linha 435) — 3.673.062 execuções  
✅ `score` (linha 439) — 748.625 execuções  
✅ `compareTwo` (linha 456) — 162.292 execuções  
✅ `val` (linha 463) — 71.998 execuções  
✅ `sum` (linha 468) — 7.756 execuções  
✅ `best` (linha 472) — 396 execuções  
✅ `high` (linha 475) — 188 execuções  
✅ `pos` (linha 481) — 1.148 execuções  
✅ `resolveWinner` (linha 485) — 78.519 execuções  
✅ `cloneState` (linha 497) — 92.461 execuções  
❌ `toPlain` (linha 505) — 0 execuções  
❌ `viewFor` (linha 513) — 0 execuções  
✅ `replay` (linha 527) — 1.000 execuções  
✅ `determinize` (linha 535) — 89.907 execuções

### `src/motor/engine/decks.js`

✅ `sumScore` (linha 23) — 723.283 execuções  
✅ `score` (linha 72) — 143.310 execuções  
✅ `activation` (linha 81) — 88.350 execuções  
✅ `activationName` (linha 87) — 88.350 execuções  
✅ `score` (linha 92) — 25.342 execuções  
✅ `trucoValue` (linha 124) — 284.786 execuções  
✅ `build` (linha 129) — 605 execuções  
✅ `strength` (linha 140) — 755 execuções  
✅ `score` (linha 141) — 41.057 execuções  
✅ `cardValue` (linha 148) — 154.247 execuções  
✅ `stackValue` (linha 149) — 6.691 execuções  
✅ `strength` (linha 151) — 508 execuções  
✅ `score` (linha 152) — 24.200 execuções  
✅ `sumScore.faceAsValue` (linha 152) — 24.200 execuções  
✅ `score` (linha 167) — 40.591 execuções  
✅ `build` (linha 182) — 918 execuções  
✅ `score` (linha 188) — 91.221 execuções  
✅ `score` (linha 195) — 382.904 execuções  
✅ `onAfterAction` (linha 196) — 527.212 execuções

### `src/motor/engine/index.js`

✅ `loadMod` (linha 24) — 1 execução

### `src/motor/engine/registry.js`

✅ `need` (linha 46) — 704 execuções  
✅ `registerDeck` (linha 56) — 259 execuções  
✅ `registerTerrain` (linha 61) — 149 execuções  
✅ `registerAction` (linha 66) — 296 execuções  
✅ `deck` (linha 72) — 11.897.407 execuções  
✅ `terrain` (linha 73) — 5.162.024 execuções  
✅ `action` (linha 74) — 728.295 execuções  
❌ `deckList` (linha 76) — 0 execuções  
❌ `terrainList` (linha 77) — 0 execuções  
✅ `actionList` (linha 78) — 2.480.267 execuções

### `src/motor/engine/terrains.js`

✅ `key` (linha 10) — 2.969.905 execuções  
✅ `neuronBonus` (linha 21) — 748.204 execuções  
✅ `onGameStart` (linha 30) — 941 execuções  
✅ `onRoundEnd` (linha 31) — 92.504 execuções  
✅ `neuronBonus` (linha 38) — 948.645 execuções  
❌ `status` (linha 42) — 0 execuções  
✅ `onGameStart` (linha 49) — 946 execuções  
✅ `onRoundEnd` (linha 50) — 69.446 execuções  
✅ `onCardPlayed` (linha 54) — 120.483 execuções  
✅ `neuronBonus` (linha 60) — 751.321 execuções  
❌ `status` (linha 65) — 0 execuções

### `src/motor/engine/util.js`

✅ `mulberry32` (linha 13) — 114.574 execuções  
✅ `rand` (linha 26) — 1.936.682 execuções  
✅ `shuffle` (linha 35) — 98.559 execuções  
❌ `rankLabel` (linha 43) — 0 execuções  
❌ `cardLabel` (linha 44) — 0 execuções  
✅ `isFace` (linha 45) — 8.055.409 execuções  
✅ `nominalValue` (linha 48) — 10.030.751 execuções  
✅ `cardStrength` (linha 55) — 7.376 execuções  
✅ `standardDeck` (linha 60) — 5.520 execuções  
❌ `otherPlayer` (linha 69) — 0 execuções  
✅ `playerCount` (linha 70) — 20.793.807 execuções  
✅ `nextPlayer` (linha 71) — 8.614.997 execuções  
✅ `opponents` (linha 76) — 6.730.587 execuções  
✅ `round2` (linha 82) — 1.140.359 execuções

### `src/motor/sim.js`

✅ `runGame` (linha 6) — 2.020 execuções  
❌ `emptyStats` (linha 18) — 0 execuções  
❌ `accumulate` (linha 27) — 0 execuções  
❌ `summarize` (linha 50) — 0 execuções  
✅ `choose` (linha 61) — 15 execuções

### `src/nucleo/aleatorio.js`

✅ `sortear` (linha 13) — 2.226 execuções  
✅ `sortearInteiro` (linha 25) — 1.826 execuções  
✅ `embaralhar` (linha 36) — 26 execuções  
✅ `sementeNova` (linha 45) — 25 execuções

### `src/nucleo/baralhos.js`

✅ `montarBaralho` (linha 12) — 36 execuções  
✅ `BARALHOS.<computed>.montar` (linha 61) — 36 execuções  
✅ `pontosDaCarta` (linha 69) — 3.652 execuções  
✅ `nomeDaCarta` (linha 76) — 1.724 execuções  
✅ `manilhaDaCarta` (linha 83) — 2 execuções

### `src/nucleo/cartas.js`

✅ `ehFigura` (linha 40) — 69.286 execuções  
✅ `rotuloCarta` (linha 45) — 42.739 execuções  
✅ `baralhoPadrao` (linha 50) — 8 execuções

### `src/nucleo/oponentes/comum.js`

✅ `novoGerador` (linha 10) — 42.663 execuções  
✅ `determinizar` (linha 19) — 5.050 execuções  
✅ `chanceDeVitoria` (linha 27) — 62 execuções

### `src/nucleo/oponentes/estrategias.js`

✅ `jogadaAleatoria` (linha 15) — 34.664 execuções  
✅ `jogadaGulosa` (linha 20) — 636 execuções  
✅ `jogadaMonteCarlo` (linha 30) — 38 execuções

### `src/nucleo/oponentes/index.js`

✅ `cartaDeInicio` (linha 30) — 28 execuções  
✅ `forca` (linha 38) — 42 execuções  
✅ `escolherJogada` (linha 49) — 1.137 execuções  
✅ `querTrucar` (linha 61) — 48 execuções  
✅ `responderAoTruco` (linha 74) — 20 execuções

### `src/nucleo/partida.js`

✅ `novoJogador` (linha 74) — 5.223 execuções  
✅ `todasAsCartas` (linha 84) — 2.578 execuções  
✅ `indexarCartas` (linha 96) — 2.578 execuções  
✅ `montar` (linha 118) — 10.182 execuções  
✅ `novaMao` (linha 147) — 2.584 execuções  
✅ `copiarMao` (linha 176) — 7.604 execuções  
✅ `atualizarVisao` (linha 186) — 53.491 execuções  
✅ `carta` (linha 188) — 2.825.167 execuções  
✅ `emitir` (linha 222) — 53.113 execuções  
✅ `anotar` (linha 227) — 49.667 execuções  
✅ `somas` (linha 232) — 44.562 execuções  
✅ `anotarHistorico` (linha 237) — 45.111 execuções  
❌ `totalDeCamadas` (linha 244) — 0 execuções  
✅ `fronteira` (linha 247) — 24.198 execuções  
✅ `alvosDeAtivacao` (linha 253) — 2.552 execuções  
✅ `alvosDeEmpilhamento` (linha 262) — 212 execuções  
✅ `efeitoDoEmpilhamento` (linha 277) — 4.670 execuções  
✅ `podeEmpilhar` (linha 287) — 288 execuções  
✅ `camadasDesfaziveis` (linha 297) — 720 execuções  
✅ `valorParaTransfer` (linha 304) — 6.604 execuções  
✅ `podePassar` (linha 317) — 543 execuções  
✅ `jogadasLegais` (linha 327) — 11.802 execuções  
✅ `idsNoMotor` (linha 337) — 6.681 execuções  
✅ `jogadaParaND` (linha 351) — 43.341 execuções  
✅ `jogadaParaTT` (linha 386) — 106.397 execuções  
✅ `ids` (linha 388) — 26.049 execuções  
✅ `ultimo` (linha 389) — 8.321 execuções  
✅ `anunciarInicio` (linha 416) — 236 execuções  
✅ `narrarAtivacao` (linha 425) — 36.559 execuções  
✅ `narrarEmpilhamento` (linha 437) — 4.630 execuções  
✅ `encerrar` (linha 467) — 2.440 execuções  
✅ `finalizarMao` (linha 484) — 16 execuções  
✅ `aplicarJogada` (linha 499) — 43.060 execuções  
✅ `carta` (linha 511) — 6.671 execuções

### `src/nucleo/pontuacao.js`

✅ `arredondar` (linha 41) — 14.786 execuções  
✅ `pontuarRede` (linha 49) — 20.019 execuções  
✅ `decimal` (linha 81) — 217 execuções  
✅ `pontuarForward` (linha 88) — 21 execuções  
✅ `mediaDePontos` (linha 106) — 2 execuções

### `src/nucleo/rede.js`

✅ `tamanhosDaMesa` (linha 25) — 2.743 execuções  
✅ `ehOculta` (linha 45) — 23.236 execuções  
✅ `nomeCamada` (linha 54) — 37.226 execuções

### `src/nucleo/traducao.js`

✅ `naipeParaTT` (linha 39) — 3.254 execuções  
✅ `rankDoValor` (linha 42) — 4.037 execuções  
✅ `valorDoRank` (linha 45) — 138.442 execuções  
✅ `cartaParaND` (linha 48) — 3.653 execuções  
✅ `cartaParaTT` (linha 56) — 138.442 execuções  
✅ `idDoNeuronio` (linha 62) — 844.808 execuções  
✅ `lugarDoNeuronio` (linha 65) — 36.562 execuções  
✅ `situacaoDaRede` (linha 77) — 109.334 execuções  
✅ `motivoDaVitoria` (linha 82) — 2.440 execuções

### `src/nucleo/truco.js`

✅ `novaPartida` (linha 25) — 194 execuções  
✅ `temTruco` (linha 30) — 8.716 execuções  
✅ `proximoValor` (linha 35) — 7.544 execuções  
✅ `ehMaoDeOnze` (linha 41) — 7.801 execuções  
✅ `podeTrucar` (linha 46) — 6.759 execuções  
✅ `pedirTruco` (linha 54) — 17 execuções  
✅ `responderTruco` (linha 65) — 18 execuções  
✅ `marcarTentos` (linha 83) — 19 execuções  
✅ `proximaMao` (linha 91) — 4 execuções

### `src/principal.js`

✅ `remedirAposMudarATela` (linha 25) — 6 execuções  
✅ `criarJogo` (linha 32) — 21 execuções  
✅ `iniciarJogo` (linha 53) — 22 execuções  
✅ `aoGirar` (linha 56) — 2 execuções
