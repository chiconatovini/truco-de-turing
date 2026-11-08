/**
 * @file Motor de uma mão: estado, jogadas legais, aplicação de jogadas e desempates.
 *
 * Não depende de interface. A cena da mesa e os oponentes usam as mesmas funções, e a
 * ferramenta de simulação roda milhares de mãos no Node com elas.
 *
 * ## Estado da mão
 * ```
 * {
 *   config: { baralho, terreno, inicio },     // opções escolhidas no menu
 *   semente, contador,                         // aleatoriedade reproduzível
 *   camadas: Neuronio[][],                     // a mesa, camada a camada
 *   neuronios: { [id]: Neuronio },             // índice dos neurônios por id
 *   jogadores: Jogador[],
 *   limbo: Carta[], cemiterio: Carta[],
 *   vez, primeiro, rodada, turno, passesSeguidos, vento,
 *   fase: 'inicio' | 'jogo' | 'fim',
 *   eventos: Evento[],                         // fila consumida pela interface para animar
 *   registro: string[],                        // texto do histórico de jogadas
 *   historico: number[][],                     // soma de cada rede a cada turno (curva de treino)
 *   resultado: { somas, vencedor, motivo, travados } | null,
 *   simulacao: boolean,                        // em simulações, não gera eventos nem textos
 * }
 * ```
 * Neurônio: `{ id, camada, posicao, cartas, revelado, dono, removido, conhecido, rodadaRevelada }`.
 * Jogador: `{ indice, nome, tipo: 'humano'|'oponente', oponente, mao, caminho, situacao, dropouts,
 * acoesUsadas, transferUsado, congelada, cartaInicial, estatisticas }`.
 *
 * ## Jogadas
 * `{ tipo: 'inicio', jogador, carta }`, `{ tipo: 'ativar', jogador, neuronio }`,
 * `{ tipo: 'empilhar', jogador, neuronio, cartas }`, `{ tipo: 'dropout', jogador, n, pagamento }`,
 * `{ tipo: 'transfer', jogador, cartas }`, `{ tipo: 'passar', jogador }`.
 */
import { sortearInteiro, embaralhar, sementeNova } from './aleatorio.js';
import { VALORES, NAIPES, ORDEM_NAIPE, FORCA_VALOR, rotuloCarta } from './cartas.js';
import { BARALHOS, pontosDaCarta } from './baralhos.js';
import { TAMANHOS_CAMADAS, TOTAL_CAMADAS, CAMADA_SAIDA, TAMANHO_MAO, ehOculta, nomeCamada } from './rede.js';
import { pontuarRede } from './pontuacao.js';

/** Formas de decidir quem começa (seção "Inicialização" da especificação). */
export const FORMAS_DE_INICIO = {
  'revela-volta': 'Cada um revela uma carta da mão; a maior começa e as duas voltam para a mão',
  'revela-descarta': 'Cada um revela uma carta da mão; a maior começa e as duas vão para o cemitério',
  sorteio: 'Par ou ímpar: sorteio simples',
};

/** Nome de cada efeito de empilhamento, para a interface. */
export const NOME_EFEITO = { tunagem: 'Tunagem', overfit: 'Overfit', earlystop: 'Early stop', stackoverflow: 'Stack overflow' };

/* ======================================================================== criação */

/** Cria o objeto de um jogador no começo da mão. */
function novoJogador(dados, indice) {
  return {
    indice, nome: dados.nome, tipo: dados.tipo || 'humano', oponente: dados.oponente || null,
    mao: [], caminho: [], situacao: 'construindo', dropouts: 0, acoesUsadas: 0,
    transferUsado: false, congelada: null, cartaInicial: null,
    estatisticas: { ativacoes: 0, tunagens: 0, overfits: 0, earlyStops: 0, overflows: 0, autoParadas: 0, sofridos: 0, transfer: 0 },
  };
}

/**
 * Cria uma mão nova: embaralha, monta a mesa, distribui as cartas e queima o resto no limbo.
 * @param {object} opcoes
 * @param {string} [opcoes.baralho='classico']
 * @param {string} [opcoes.terreno='neutro']
 * @param {string} [opcoes.inicio='revela-volta']
 * @param {number} [opcoes.semente] Para partidas reproduzíveis.
 * @param {{nome:string, tipo?:string, oponente?:string}[]} opcoes.jogadores
 */
export function novaMao(opcoes) {
  const mao = {
    config: { baralho: opcoes.baralho || 'classico', terreno: opcoes.terreno || 'neutro', inicio: opcoes.inicio || 'revela-volta' },
    semente: opcoes.semente != null ? opcoes.semente | 0 : sementeNova(),
    contador: 0,
    camadas: [], neuronios: {},
    jogadores: opcoes.jogadores.map(novoJogador),
    limbo: [], cemiterio: [],
    vez: 0, primeiro: 0, rodada: 1, turno: 0, passesSeguidos: 0, vento: null,
    fase: 'inicio', eventos: [], registro: [], historico: [], resultado: null, simulacao: false,
  };
  const cartas = embaralhar(BARALHOS[mao.config.baralho].montar(), mao);
  for (let c = 0; c < TOTAL_CAMADAS; c++) {
    const camada = [];
    for (let p = 0; p < TAMANHOS_CAMADAS[c]; p++) {
      const neuronio = { id: 'C' + c + 'N' + p, camada: c, posicao: p, cartas: [cartas.pop()], revelado: false, dono: -1, removido: false, conhecido: false, rodadaRevelada: 0 };
      camada.push(neuronio);
      mao.neuronios[neuronio.id] = neuronio;
    }
    mao.camadas.push(camada);
  }
  for (const jogador of mao.jogadores) for (let i = 0; i < TAMANHO_MAO; i++) jogador.mao.push(cartas.pop());
  mao.limbo = cartas; /* as 10 restantes: ruído */
  if (mao.config.terreno === 'oceano') mao.vento = NAIPES[sortearInteiro(mao, 4)];
  if (mao.config.inicio === 'sorteio') {
    mao.primeiro = mao.vez = sortearInteiro(mao, mao.jogadores.length);
    mao.fase = 'jogo';
    emitir(mao, { tipo: 'inicio', jogador: mao.primeiro, como: 'sorteio' });
  }
  anotarHistorico(mao);
  return mao;
}

/** Recria o índice de neurônios por id (necessário após copiar a mesa). */
function reindexar(mao) {
  mao.neuronios = {};
  for (const camada of mao.camadas) for (const n of camada) mao.neuronios[n.id] = n;
  return mao;
}

/**
 * Cópia leve da mão para simulações dos oponentes (sem eventos, textos ou histórico).
 * @returns {object}
 */
export function copiarMao(mao) {
  const copia = {
    config: mao.config, semente: mao.semente, contador: mao.contador,
    camadas: mao.camadas.map((camada) => camada.map((n) => ({ ...n, cartas: n.cartas.slice() }))),
    neuronios: {},
    jogadores: mao.jogadores.map((j) => ({ ...j, mao: j.mao.slice(), caminho: j.caminho.slice(), estatisticas: { ...j.estatisticas } })),
    limbo: mao.limbo.slice(), cemiterio: mao.cemiterio.slice(),
    vez: mao.vez, primeiro: mao.primeiro, rodada: mao.rodada, turno: mao.turno, passesSeguidos: mao.passesSeguidos, vento: mao.vento,
    fase: mao.fase, eventos: [], registro: [], historico: [], resultado: null, simulacao: true,
  };
  return reindexar(copia);
}

/* ======================================================================== avisos */

/** Coloca um evento na fila da interface (ignorado em simulação). */
function emitir(mao, evento) {
  if (!mao.simulacao) mao.eventos.push(evento);
}

/** Acrescenta uma linha ao registro de jogadas (ignorado em simulação). */
function anotar(mao, texto) {
  if (!mao.simulacao) mao.registro.push(texto);
}

/** Guarda a soma atual de cada rede para a curva de treino. */
function anotarHistorico(mao) {
  if (!mao.simulacao) mao.historico.push(mao.jogadores.map((_, j) => pontuarRede(mao, j).total));
}

/* ======================================================================== consultas */

/** Último neurônio do caminho do jogador (a "fronteira"), ou null. */
export function fronteira(mao, j) {
  const caminho = mao.jogadores[j].caminho;
  return caminho.length ? mao.neuronios[caminho[caminho.length - 1]] : null;
}

/** Neurônios livres que o jogador pode ativar na próxima camada da sua rede. */
export function alvosDeAtivacao(mao, j) {
  const jogador = mao.jogadores[j];
  if (jogador.situacao !== 'construindo') return [];
  const proxima = jogador.caminho.length;
  if (proxima >= TOTAL_CAMADAS) return [];
  return mao.camadas[proxima].filter((n) => !n.removido && n.dono === -1);
}

/** Neurônios que aceitam cartas empilhadas: a fronteira oculta das redes ainda em construção. */
export function alvosDeEmpilhamento(mao) {
  const alvos = [];
  mao.jogadores.forEach((jogador, j) => {
    if (jogador.situacao !== 'construindo') return;
    const f = fronteira(mao, j);
    if (f && ehOculta(f.camada) && f.cartas.length < 4) alvos.push(f);
  });
  return alvos;
}

/**
 * Efeito de empilhar `n` cartas no neurônio, pelo tamanho final da pilha:
 * 2 = tunagem (própria) ou overfit (adversário); 3 = early stop; 4 = stack overflow.
 * @returns {{tipo: string, proprio: boolean} | null}
 */
export function efeitoDoEmpilhamento(mao, j, neuronio, n) {
  const tamanho = neuronio.cartas.length + n;
  const proprio = neuronio.dono === j;
  if (tamanho === 2) return { tipo: proprio ? 'tunagem' : 'overfit', proprio };
  if (tamanho === 3) return { tipo: 'earlystop', proprio };
  if (tamanho === 4) return { tipo: 'stackoverflow', proprio };
  return null;
}

/** Diz se o jogador pode empilhar essas cartas da mão nesse neurônio. */
export function podeEmpilhar(mao, j, idNeuronio, idsCartas) {
  if (mao.fase !== 'jogo' || mao.vez !== j || !idsCartas.length) return false;
  const neuronio = mao.neuronios[idNeuronio];
  if (!neuronio || !alvosDeEmpilhamento(mao).includes(neuronio)) return false;
  if (neuronio.cartas.length + idsCartas.length > 4) return false;
  const mao_ = mao.jogadores[j].mao;
  return idsCartas.every((id) => {
    const carta = mao_.find((c) => c.id === id);
    return carta && carta.valor === neuronio.cartas[0].valor;
  });
}

/** Quantas camadas ocultas o jogador pode desfazer com dropout. */
export function camadasDesfaziveis(mao, j) {
  const jogador = mao.jogadores[j];
  if (jogador.situacao !== 'construindo' || jogador.caminho.length < 2) return 0;
  return jogador.caminho.length - 1;
}

/** Valor que o jogador tem quatro vezes na mão (para transfer learning), ou null. */
export function valorParaTransfer(mao, j) {
  const jogador = mao.jogadores[j];
  if (jogador.transferUsado) return null;
  const conta = {};
  for (const c of jogador.mao) conta[c.valor] = (conta[c.valor] || 0) + 1;
  for (const valor in conta) if (conta[valor] >= 4) return valor;
  return null;
}

/** Só passa a vez quem não tem neurônio para ativar. */
export function podePassar(mao, j) {
  return mao.fase === 'jogo' && mao.vez === j && alvosDeAtivacao(mao, j).length === 0;
}

/** Todas as combinações de `k` itens da lista. */
function combinacoes(lista, k) {
  const saida = [];
  (function recursao(inicio, acumulado) {
    if (acumulado.length === k) { saida.push(acumulado.slice()); return; }
    for (let i = inicio; i < lista.length; i++) { acumulado.push(lista[i]); recursao(i + 1, acumulado); acumulado.pop(); }
  })(0, []);
  return saida;
}

/**
 * Lista as jogadas legais do jogador.
 * @param {object} mao
 * @param {number} j
 * @param {{comDropout?: boolean}} [opcoes] `comDropout` inclui dropouts baratos (usado pelos oponentes).
 */
export function jogadasLegais(mao, j, opcoes = {}) {
  const jogador = mao.jogadores[j];
  const jogadas = [];
  if (mao.fase === 'inicio') {
    if (!jogador.cartaInicial) for (const c of jogador.mao) jogadas.push({ tipo: 'inicio', jogador: j, carta: c.id });
    return jogadas;
  }
  if (mao.fase !== 'jogo' || mao.vez !== j) return jogadas;
  const ativacoes = alvosDeAtivacao(mao, j);
  for (const n of ativacoes) jogadas.push({ tipo: 'ativar', jogador: j, neuronio: n.id });
  for (const alvo of alvosDeEmpilhamento(mao)) {
    const iguais = jogador.mao.filter((c) => c.valor === alvo.cartas[0].valor);
    const maximo = Math.min(iguais.length, 4 - alvo.cartas.length);
    /* com manilhas, cartas do mesmo valor podem valer pontos diferentes: considera cada combinação */
    const pontosDiferentes = new Set(iguais.map((c) => pontosDaCarta(c, mao.config.baralho))).size > 1;
    for (let n = 1; n <= maximo; n++) {
      const grupos = pontosDiferentes ? combinacoes(iguais, n) : [iguais.slice(0, n)];
      for (const grupo of grupos) jogadas.push({ tipo: 'empilhar', jogador: j, neuronio: alvo.id, cartas: grupo.map((c) => c.id) });
    }
  }
  const valor = valorParaTransfer(mao, j);
  if (valor) jogadas.push({ tipo: 'transfer', jogador: j, cartas: jogador.mao.filter((c) => c.valor === valor).slice(0, 4).map((c) => c.id) });
  if (opcoes.comDropout) {
    const maximo = Math.min(camadasDesfaziveis(mao, j), jogador.mao.length);
    const baratas = jogador.mao.slice().sort((a, b) => pontosDaCarta(a, mao.config.baralho) - pontosDaCarta(b, mao.config.baralho));
    for (let n = 1; n <= Math.min(maximo, 2); n++) jogadas.push({ tipo: 'dropout', jogador: j, n, pagamento: baratas.slice(0, n).map((c) => c.id) });
  }
  if (!ativacoes.length) jogadas.push({ tipo: 'passar', jogador: j });
  return jogadas;
}

/* ======================================================================== efeitos internos */

/** Tira as cartas da mão do jogador e as devolve. */
function tirarDaMao(jogador, ids) {
  return ids.map((id) => {
    const i = jogador.mao.findIndex((c) => c.id === id);
    if (i < 0) throw new Error('Carta fora da mão: ' + id);
    return jogador.mao.splice(i, 1)[0];
  });
}

/** Finaliza a rede do jogador, congelando rodada e vento (relevantes para os terrenos). */
function finalizarRede(mao, j, situacao) {
  const jogador = mao.jogadores[j];
  jogador.situacao = situacao;
  jogador.congelada = { rodada: mao.rodada, vento: mao.vento };
}

/** Baralho Power BI: troca as cartas que sobraram na mão por cartas aleatórias. */
function trocarMaoPowerBI(mao, jogador) {
  if (!BARALHOS[mao.config.baralho].trocaMao) return;
  jogador.mao = jogador.mao.map(() => {
    mao.contador++;
    const valor = VALORES[sortearInteiro(mao, 13)];
    const naipe = NAIPES[sortearInteiro(mao, 4)];
    return { id: valor + naipe + '~' + mao.contador, valor, naipe };
  });
  emitir(mao, { tipo: 'powerbi', jogador: jogador.indice });
}

/** Passa a vez; ao completar uma volta, avança a rodada (e o vento, no oceano). Encerra a mão se for o caso. */
function encerrarTurno(mao) {
  mao.turno++;
  mao.vez = (mao.vez + 1) % mao.jogadores.length;
  if (mao.vez === mao.primeiro) {
    mao.rodada++;
    if (mao.config.terreno === 'oceano') {
      mao.vento = NAIPES[sortearInteiro(mao, 4)];
      emitir(mao, { tipo: 'vento', naipe: mao.vento });
    }
  }
  anotarHistorico(mao);
  const todasFinalizadas = mao.jogadores.every((j) => j.situacao !== 'construindo');
  if (todasFinalizadas || mao.passesSeguidos >= mao.jogadores.length) encerrarMao(mao);
}

/** Compara as cartas reveladas para decidir quem começa. */
function resolverInicio(mao) {
  let melhor = -1, chaveMelhor = -1, empate = false;
  mao.jogadores.forEach((jogador, j) => {
    const c = jogador.cartaInicial;
    const chave = FORCA_VALOR[c.valor] * 10 + ORDEM_NAIPE[c.naipe];
    if (chave > chaveMelhor) { chaveMelhor = chave; melhor = j; empate = false; } else if (chave === chaveMelhor) empate = true;
  });
  if (empate) melhor = sortearInteiro(mao, mao.jogadores.length);
  const descarta = mao.config.inicio === 'revela-descarta';
  const cartas = mao.jogadores.map((j) => j.cartaInicial);
  if (descarta) {
    for (const jogador of mao.jogadores) {
      const i = jogador.mao.findIndex((c) => c.id === jogador.cartaInicial.id);
      mao.cemiterio.push(jogador.mao.splice(i, 1)[0]);
    }
  }
  mao.primeiro = mao.vez = melhor;
  mao.fase = 'jogo';
  emitir(mao, { tipo: 'inicio', jogador: melhor, como: 'revela', cartas, empate, descarta });
  anotar(mao, mao.jogadores[melhor].nome + ' começa' + (empate ? ' (empate decidido no par ou ímpar)' : '') + '.');
}

/* ======================================================================== aplicação de jogadas */

/** Jogada 'ativar': revela o neurônio e o liga à rede do jogador. */
function ativar(mao, jogada) {
  const j = jogada.jogador, jogador = mao.jogadores[j];
  const neuronio = mao.neuronios[jogada.neuronio];
  if (!alvosDeAtivacao(mao, j).includes(neuronio)) throw new Error('Neurônio indisponível');
  neuronio.revelado = true; neuronio.dono = j; neuronio.conhecido = true; neuronio.rodadaRevelada = mao.rodada;
  jogador.caminho.push(neuronio.id);
  jogador.estatisticas.ativacoes++;
  mao.passesSeguidos = 0;
  emitir(mao, { tipo: 'ativacao', jogador: j, neuronio: neuronio.id, carta: neuronio.cartas[0] });
  anotar(mao, jogador.nome + ' ativou ' + rotuloCarta(neuronio.cartas[0]) + ' na camada ' + nomeCamada(neuronio.camada) + '.');
  if (neuronio.camada === CAMADA_SAIDA) {
    finalizarRede(mao, j, 'concluida');
    emitir(mao, { tipo: 'completa', jogador: j });
    anotar(mao, jogador.nome + ' chegou à camada de saída!');
  }
  encerrarTurno(mao);
}

/** Jogada 'empilhar': tunagem, overfit, early stop ou stack overflow, conforme a pilha final. */
function empilhar(mao, jogada) {
  const j = jogada.jogador, jogador = mao.jogadores[j];
  if (!podeEmpilhar(mao, j, jogada.neuronio, jogada.cartas)) throw new Error('Empilhamento inválido');
  const alvo = mao.neuronios[jogada.neuronio];
  const d = alvo.dono, vitima = mao.jogadores[d];
  const efeito = efeitoDoEmpilhamento(mao, j, alvo, jogada.cartas.length);
  const jogadas = tirarDaMao(jogador, jogada.cartas);
  alvo.cartas = alvo.cartas.concat(jogadas);
  jogador.acoesUsadas++;
  mao.passesSeguidos = 0;
  if (efeito.tipo === 'tunagem') {
    jogador.estatisticas.tunagens++;
    alvo.rodadaRevelada = mao.rodada;
    emitir(mao, { tipo: 'tunagem', jogador: j, dono: d, neuronio: alvo.id, cartas: jogadas });
    anotar(mao, jogador.nome + ' tunou ' + rotuloCarta(alvo.cartas[0]) + ' com ' + jogadas.map(rotuloCarta).join(' ') + '.');
  } else {
    /* o neurônio atingido vai inteiro para o cemitério e a rede da vítima recua uma camada */
    const removidas = alvo.cartas;
    mao.cemiterio = mao.cemiterio.concat(removidas);
    alvo.cartas = []; alvo.removido = true; alvo.dono = -1;
    vitima.caminho.pop();
    vitima.estatisticas.sofridos++;
    if (efeito.proprio) jogador.estatisticas.autoParadas++;
    if (efeito.tipo === 'overfit') {
      jogador.estatisticas.overfits++;
      anotar(mao, jogador.nome + ' aplicou OVERFIT em ' + rotuloCarta(removidas[0]) + ' de ' + vitima.nome + '.');
    } else if (efeito.tipo === 'earlystop') {
      if (!efeito.proprio) jogador.estatisticas.earlyStops++;
      finalizarRede(mao, d, 'earlystop');
      anotar(mao, jogador.nome + ' aplicou EARLY STOP' + (efeito.proprio ? ' na própria rede' : ' em ' + vitima.nome) + '.');
    } else {
      if (!efeito.proprio) jogador.estatisticas.overflows++;
      const perdidas = vitima.mao.length;
      mao.cemiterio = mao.cemiterio.concat(vitima.mao);
      vitima.mao = [];
      finalizarRede(mao, d, 'overflow');
      anotar(mao, 'STACK OVERFLOW! ' + vitima.nome + ' perdeu a rede e ' + perdidas + ' carta(s) da mão.');
    }
    emitir(mao, { tipo: efeito.tipo, jogador: j, dono: d, neuronio: alvo.id, cartas: removidas, proprio: efeito.proprio });
  }
  trocarMaoPowerBI(mao, jogador);
  encerrarTurno(mao);
}

/** Jogada 'dropout' (GatoNet): desvira os últimos neurônios pagando uma carta por camada. Não gasta o turno. */
function fazerDropout(mao, jogada) {
  const j = jogada.jogador, jogador = mao.jogadores[j];
  if (jogada.n < 1 || jogada.n > camadasDesfaziveis(mao, j) || jogada.pagamento.length !== jogada.n) throw new Error('Dropout inválido');
  const pagas = tirarDaMao(jogador, jogada.pagamento);
  mao.cemiterio = mao.cemiterio.concat(pagas);
  const desfeitos = [];
  for (let i = 0; i < jogada.n; i++) {
    const n = mao.neuronios[jogador.caminho.pop()];
    mao.cemiterio = mao.cemiterio.concat(n.cartas.splice(1)); /* tunagens empilhadas vão embora */
    n.revelado = false; n.dono = -1; n.conhecido = true;
    desfeitos.push(n.id);
  }
  jogador.dropouts += jogada.n;
  jogador.acoesUsadas++;
  emitir(mao, { tipo: 'dropout', jogador: j, neuronios: desfeitos, pagas });
  anotar(mao, jogador.nome + ' fez dropout (GatoNet) de ' + jogada.n + ' camada(s).');
  trocarMaoPowerBI(mao, jogador);
}

/** Jogada 'transfer': troca quatro cartas iguais por quatro do limbo (uma vez por mão). */
function fazerTransfer(mao, jogada) {
  const j = jogada.jogador, jogador = mao.jogadores[j];
  const valor = valorParaTransfer(mao, j);
  if (!valor || jogada.cartas.length !== 4) throw new Error('Transfer learning indisponível');
  const saem = tirarDaMao(jogador, jogada.cartas);
  mao.cemiterio = mao.cemiterio.concat(saem);
  embaralhar(mao.limbo, mao);
  const entram = mao.limbo.splice(0, Math.min(4, mao.limbo.length));
  jogador.mao = jogador.mao.concat(entram);
  jogador.transferUsado = true;
  jogador.acoesUsadas++;
  jogador.estatisticas.transfer++;
  mao.passesSeguidos = 0;
  emitir(mao, { tipo: 'transfer', jogador: j, saem, entram: entram.length });
  anotar(mao, jogador.nome + ' fez TRANSFER LEARNING: trocou quatro ' + valor + ' por ' + entram.length + ' carta(s) do limbo.');
  trocarMaoPowerBI(mao, jogador);
  encerrarTurno(mao);
}

/**
 * Aplica uma jogada ao estado (modifica `mao`). Lança erro se a jogada for inválida.
 * @param {object} mao
 * @param {object} jogada Ver tipos no topo do arquivo.
 * @returns {object} a própria mão
 */
export function aplicarJogada(mao, jogada) {
  const jogador = mao.jogadores[jogada.jogador];
  if (jogada.tipo === 'inicio') {
    jogador.cartaInicial = jogador.mao.find((c) => c.id === jogada.carta);
    if (mao.jogadores.every((x) => x.cartaInicial)) resolverInicio(mao);
    return mao;
  }
  if (mao.fase !== 'jogo') throw new Error('A mão não está em andamento');
  if (mao.vez !== jogada.jogador) throw new Error('Não é a vez de ' + jogador.nome);
  switch (jogada.tipo) {
    case 'ativar': ativar(mao, jogada); break;
    case 'empilhar': empilhar(mao, jogada); break;
    case 'dropout': fazerDropout(mao, jogada); break;
    case 'transfer': fazerTransfer(mao, jogada); break;
    case 'passar':
      if (!podePassar(mao, jogada.jogador)) throw new Error('Só passa a vez quem não pode ativar neurônio');
      mao.passesSeguidos++;
      emitir(mao, { tipo: 'passe', jogador: jogada.jogador });
      anotar(mao, jogador.nome + ' passou a vez.');
      encerrarTurno(mao);
      break;
    default: throw new Error('Jogada desconhecida: ' + jogada.tipo);
  }
  return mao;
}

/* ======================================================================== fim da mão e desempates */

/** Soma das `n` cartas de maior valor na mão do jogador. */
function somaDasMelhores(mao, jogador, n) {
  const pontos = jogador.mao.map((c) => pontosDaCarta(c, mao.config.baralho)).sort((a, b) => b - a);
  let soma = 0;
  for (let i = 0; i < n; i++) soma += pontos[i];
  return soma;
}

/** Chave numérica da carta mais alta da mão (pontos, depois força, depois naipe). */
function cartaMaisAlta(mao, jogador) {
  let melhor = 0;
  for (const c of jogador.mao) {
    const chave = pontosDaCarta(c, mao.config.baralho) * 1000 + FORCA_VALOR[c.valor] * 10 + ORDEM_NAIPE[c.naipe];
    if (chave > melhor) melhor = chave;
  }
  return melhor;
}

/** Mantém só os candidatos com o maior valor de `criterio`. */
function filtrarMaiores(candidatos, criterio) {
  const maior = Math.max(...candidatos.map(criterio));
  return candidatos.filter((i) => criterio(i) === maior);
}

/** Decide o vencedor com os critérios de desempate da especificação, na ordem. */
function encerrarMao(mao) {
  mao.fase = 'fim';
  const somas = mao.jogadores.map((_, j) => pontuarRede(mao, j).total);
  let candidatos = mao.jogadores.map((_, j) => j);
  let motivo = 'maior soma da rede';
  candidatos = filtrarMaiores(candidatos, (j) => somas[j]);
  if (candidatos.length > 1) {
    motivo = 'empate na soma; menos dropouts';
    candidatos = filtrarMaiores(candidatos, (j) => -mao.jogadores[j].dropouts);
  }
  if (candidatos.length > 1) {
    const n = Math.min(...candidatos.map((j) => mao.jogadores[j].mao.length));
    if (n === 0) {
      motivo = 'empate; quem ficou sem cartas na mão perde';
      candidatos = filtrarMaiores(candidatos, (j) => (mao.jogadores[j].mao.length > 0 ? 1 : 0));
    } else {
      motivo = 'empate; maior soma das ' + n + ' melhores cartas da mão';
      candidatos = filtrarMaiores(candidatos, (j) => somaDasMelhores(mao, mao.jogadores[j], n));
    }
  }
  if (candidatos.length > 1) {
    motivo = 'empate; carta mais alta na mão (naipe desempata)';
    candidatos = filtrarMaiores(candidatos, (j) => cartaMaisAlta(mao, mao.jogadores[j]));
  }
  if (candidatos.length > 1) {
    motivo = 'empate total; vence quem jogou primeiro';
    candidatos = candidatos.includes(mao.primeiro) ? [mao.primeiro] : [candidatos[0]];
  }
  const travados = mao.jogadores.map((j) => j.situacao === 'construindo' && j.caminho.length < TOTAL_CAMADAS);
  mao.resultado = { somas, vencedor: candidatos[0], motivo, travados };
  emitir(mao, { tipo: 'fim', resultado: mao.resultado });
  anotar(mao, 'Fim da mão: ' + mao.jogadores[candidatos[0]].nome + ' vence (' + motivo + ').');
}

