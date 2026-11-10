/**
 * @file Testes de unidade do conteúdo: Grimório, textos, conquistas (o teste de cada uma),
 * dicas de jogo (cada tipo de dica e a regra de só usar informação pública) e progresso salvo.
 */
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { VERBETES } from '../../src/conteudo/grimorio.js';
import { AMBIENTACAO, PROVOCACOES, provocar } from '../../src/conteudo/textos.js';
import { GRADUACOES, CONQUISTAS, VALEM_SEM_MAO_COMPLETA } from '../../src/conteudo/conquistas.js';
import { DICAS_GERAIS, escolherDicaDeJogo } from '../../src/conteudo/dicasDeJogo.js';
import { carregarProgresso, salvarProgresso } from '../../src/conteudo/progresso.js';
import { novaMao, aplicarJogada } from '../../src/nucleo/partida.js';
import { novaPartida } from '../../src/nucleo/truco.js';
import { determinizar } from '../../src/nucleo/oponentes/comum.js';
import { jogadaAleatoria } from '../../src/nucleo/oponentes/estrategias.js';
import { BARALHOS } from '../../src/nucleo/baralhos.js';
import { TERRENOS } from '../../src/nucleo/terrenos.js';
import { maoNova, maoAteOFim, redeCom } from '../apoio/estados.js';

describe('grimorio.js', () => {
  it('verbetes com id único, título, categoria, conceito e "no jogo"', () => {
    assert.ok(VERBETES.length >= 16);
    assert.equal(new Set(VERBETES.map((v) => v.id)).size, VERBETES.length);
    for (const v of VERBETES) assert.ok(v.titulo && v.categoria && v.conceito && v.noJogo, v.id);
  });
  it('verbetes completos: ideia, onde a comparação falha, matemática com LaTeX balanceado e autoria', () => {
    const completos = VERBETES.filter((v) => v.ideia);
    assert.ok(completos.length >= 6);
    for (const v of completos) {
      assert.ok(v.ondeFalha && v.aprofundar && v.formula && v.autoria, v.id);
      for (const campo of ['ideia', 'conceito', 'noJogo', 'ondeFalha', 'aprofundar']) {
        assert.equal((v[campo].match(/\$/g) || []).length % 2, 0, v.id + '.' + campo + ': cifrões sem par');
      }
    }
  });
});

describe('textos.js', () => {
  it('ambientação para cada valor e provocações para cada situação', () => {
    for (const valor of ['A', '2', '7', 'K']) assert.ok(AMBIENTACAO[valor]);
    for (const [situacao, lista] of Object.entries(PROVOCACOES)) {
      assert.ok(lista.length > 0, situacao);
      assert.ok(lista.includes(provocar(situacao)));
    }
  });
  it('provocar: situação desconhecida devolve texto vazio', () => {
    assert.equal(provocar('nao-existe'), '');
  });
});

describe('conquistas.js', () => {
  /** Contexto mínimo de fim de mão; `mudar` ajusta o que o teste precisa. */
  function contexto(mudar = () => {}) {
    const mao = maoAteOFim();
    const ctx = {
      mao, eu: 0, venceu: false, completa: true, partida: novaPartida(12), venceuPartida: false, valorDaMao: 1, oponenteCorreu: false,
      opcoes: { oponente: 'guloso' },
      progresso: { vitorias: 0, dropouts: 0, vitoriasZen: 0, verbetesLidos: 0, terrenos: {}, baralhos: {} },
    };
    mudar(ctx);
    return ctx;
  }
  /** Para cada conquista: um contexto em que ela vale e outro em que não vale. */
  const CASOS = {
    primeira: [(c) => { c.venceu = true; }],
    dez: [(c) => { c.progresso.vitorias = 10; }],
    cinquenta: [(c) => { c.progresso.vitorias = 50; }],
    gato10: [(c) => { c.progresso.dropouts = 10; }],
    gato100: [(c) => { c.progresso.dropouts = 100; }],
    zen: [(c) => { c.venceu = true; c.mao.jogadores[0].acoesUsadas = 0; }, (c) => { c.venceu = true; c.mao.jogadores[0].acoesUsadas = 2; }],
    zen10: [(c) => { c.progresso.vitoriasZen = 10; }],
    desk: [(c) => { c.mao.jogadores[0].estatisticas.autoParadas = 1; }, (c) => { c.mao.jogadores[0].estatisticas.autoParadas = 0; }],
    patos: [(c) => { c.mao.resultado.vencedor = 1; c.mao.resultado.travados = [false, true]; }, (c) => { c.venceu = true; }],
    contra: [(c) => { c.venceu = true; c.mao.jogadores[0].situacao = 'overflow'; }],
    artilheiro: [(c) => { c.mao.jogadores[0].transferUsado = true; }, (c) => { c.mao.jogadores[0].transferUsado = false; }],
    transfer: [(c) => { c.mao.jogadores[0].transferUsado = true; }, (c) => { c.mao.jogadores[0].transferUsado = false; }],
    vanishing: [(c) => { c.mao = redeCom([[['8', 'O']], [['K', 'E'], ['K', 'C']], [['K', 'P']], [['K', 'O']]]); }, (c) => { c.mao = redeCom([[['8', 'O']]]); }],
    overfit: [(c) => { c.mao.jogadores[0].estatisticas.overfits = 1; }, (c) => { c.mao.jogadores[0].estatisticas.overfits = 0; }],
    earlystop: [(c) => { c.mao.jogadores[0].estatisticas.earlyStops = 1; }, (c) => { c.mao.jogadores[0].estatisticas.earlyStops = 0; }],
    overflow: [(c) => { c.mao.jogadores[0].estatisticas.overflows = 1; }, (c) => { c.mao.jogadores[0].estatisticas.overflows = 0; }],
    trio: [(c) => { c.mao = redeCom([[['Q', 'O']], [['Q', 'E']], [['Q', 'C']]]); }, (c) => { c.mao = redeCom([[['8', 'O']]]); }],
    sessenta: [(c) => { c.mao.resultado.somas = [60, 0]; }, (c) => { c.mao.resultado.somas = [59, 0]; }],
    truco: [(c) => { c.venceu = true; c.valorDaMao = 3; }],
    doze: [(c) => { c.venceu = true; c.valorDaMao = 12; }],
    correu: [(c) => { c.oponenteCorreu = true; }],
    campeao: [(c) => { c.venceuPartida = true; }],
    maquina: [(c) => { c.venceuPartida = true; c.opcoes.oponente = 'montecarlo'; }, (c) => { c.venceuPartida = true; }],
    cartografo: [(c) => { for (const t of Object.keys(TERRENOS)) c.progresso.terrenos[t] = true; }],
    colecionador: [(c) => { for (const b of Object.keys(BARALHOS)) c.progresso.baralhos[b] = true; }],
    zap: [(c) => {
      c.venceu = true;
      c.mao = redeCom([[['4', 'P']]], { baralho: 'truco' });
    }, (c) => { c.venceu = true; c.mao = redeCom([[['5', 'P']]], { baralho: 'truco' }); }],
    biblio: [(c) => { c.progresso.verbetesLidos = VERBETES.length; }],
  };
  it('graduações com nome e cor', () => {
    for (const g of Object.values(GRADUACOES)) assert.ok(g.nome && /^#/.test(g.cor));
  });
  it('toda conquista tem caso de teste, e VALEM_SEM_MAO_COMPLETA só cita conquistas existentes', () => {
    assert.deepEqual(CONQUISTAS.map((c) => c.id).sort(), Object.keys(CASOS).sort());
    for (const id of VALEM_SEM_MAO_COMPLETA) assert.ok(CASOS[id], id);
  });
  for (const conquista of CONQUISTAS) {
    it('conquista "' + conquista.nome + '" (' + conquista.id + ')', () => {
      const [vale, naoVale] = CASOS[conquista.id];
      assert.ok(conquista.teste(contexto(vale)), 'deveria valer');
      assert.ok(!conquista.teste(contexto(naoVale || (() => {}))), 'não deveria valer');
    });
  }
});

describe('dicasDeJogo.js', () => {
  it('dicas gerais ligadas a verbetes existentes', () => {
    for (const d of DICAS_GERAIS) assert.ok(VERBETES.some((v) => v.id === d.verbete), d.id);
  });
  it('só usa informação pública: sortear de novo o que está escondido não muda a dica', () => {
    let verificadas = 0;
    for (let semente = 1; semente <= 60; semente++) {
      const mao = novaMao({ semente, terreno: ['neutro', 'montanha', 'pantano', 'oceano'][semente % 4], inicio: 'sorteio', jogadores: [{ nome: 'A' }, { nome: 'B' }] });
      const partida = novaPartida(12);
      for (let passo = 0; passo < 30 && mao.fase === 'jogo'; passo++) {
        const j = mao.vez, dica = escolherDicaDeJogo(mao, j, partida);
        assert.ok(dica.titulo && dica.texto && dica.verbete);
        for (let k = 0; k < 3; k++) assert.deepEqual(escolherDicaDeJogo(determinizar(mao, j), j, partida), dica);
        verificadas++;
        aplicarJogada(mao, jogadaAleatoria(mao, j));
      }
    }
    assert.ok(verificadas > 500);
  });
  it('cobre todos os tipos de dica em situações montadas à mão', () => {
    const vistas = new Set();
    const dica = (mao, j = 0, partida = novaPartida(12), recentes = []) => { const d = escolherDicaDeJogo(mao, j, partida, recentes); vistas.add(d.id); return d; };
    /* oportunidades de ataque contra a fronteira do adversário (jogador 1) */
    const ataque = (pilha, naMao, valor = '9') => {
      const mao = redeCom([[['5', 'O']], [['3', 'E']]]);
      mao.jogadores[1].caminho = ['C0N1', 'C1N1'];
      Object.assign(mao.neuronios.C1N1, { revelado: true, dono: 1, cartas: Array.from({ length: pilha }, (_, i) => ({ id: 'v' + i, valor, naipe: 'E' })) });
      mao.neuronios.C0N1.dono = 1; mao.neuronios.C0N1.revelado = true;
      mao.jogadores[0].mao = Array.from({ length: naMao }, (_, i) => ({ id: 'm' + i, valor, naipe: 'C' }));
      return mao;
    };
    assert.equal(dica(ataque(1, 3)).id, 'ataque-overflow');
    assert.equal(dica(ataque(2, 1)).id, 'ataque-earlystop');
    assert.equal(dica(ataque(1, 1)).id, 'ataque-overfit');
    /* riscos na própria rede */
    assert.equal(dica(redeCom([[['5', 'O']], [['K', 'E']], [['K', 'C']]])).id, 'risco-vanishing');
    assert.equal(dica(redeCom([[['5', 'O']], [['7', 'E'], ['7', 'C']]])).id, 'risco-tunado');
    const tunar = redeCom([[['5', 'O']], [['7', 'E']]]);
    tunar.jogadores[0].mao = [{ id: 'x', valor: '7', naipe: 'O' }];
    assert.equal(dica(tunar).id, 'tunagem');
    /* corrida, truco, transfer, mão curta e terrenos */
    const corrida = redeCom([[['2', 'O']]]);
    corrida.jogadores[1].caminho = ['C0N1', 'C1N1', 'C2N1', 'C3N1', 'C4N1', 'C5N1'];
    corrida.jogadores[0].mao = ['3', '4', '5'].map((v) => ({ id: 'c' + v, valor: v, naipe: 'E' }));
    corrida.jogadores[1].caminho.forEach((id) => { Object.assign(corrida.neuronios[id], { revelado: true, dono: 1, cartas: [{ id: id + 'x', valor: '9', naipe: 'P' }] }); });
    assert.equal(dica(corrida).id, 'corrida');
    const frente = redeCom([[['A', 'O']], [['A', 'E']]]);
    assert.equal(dica(frente, 0, novaPartida(12), ['risco-tunado']).id, 'truco');
    const quatro = redeCom([[['2', 'O']]]);
    quatro.jogadores[0].mao = ['E', 'C', 'P', 'O'].map((n) => ({ id: '6' + n, valor: '6', naipe: n }));
    assert.equal(dica(quatro).id, 'transfer');
    const curta = redeCom([[['2', 'O']]]);
    curta.jogadores[0].mao = [{ id: 'z', valor: '3', naipe: 'E' }];
    assert.equal(dica(curta).id, 'mao-curta');
    assert.equal(dica(redeCom([[['2', 'O']]], { terreno: 'pantano' })).id, 'terreno-pantano');
    assert.equal(dica(redeCom([[['2', 'O']]], { terreno: 'montanha' })).id, 'terreno-montanha');
    const oceano = redeCom([[['2', 'O']]], { terreno: 'oceano' });
    assert.equal(dica(oceano).id, 'terreno-oceano');
    /* sem nada especial: dicas gerais em rodízio, sem repetir as recentes */
    const recentes = [];
    for (let i = 0; i < DICAS_GERAIS.length; i++) recentes.push(dica(maoNova(), 0, novaPartida(1), recentes).id);
    assert.equal(new Set(recentes).size, DICAS_GERAIS.length);
    assert.equal(dica(maoNova(), 0, novaPartida(1), recentes).id, DICAS_GERAIS[0].id);
  });
});

describe('progresso.js', () => {
  const armazenamento = new Map();
  beforeEach(() => {
    armazenamento.clear();
    globalThis.localStorage = { getItem: (k) => armazenamento.get(k) ?? null, setItem: (k, v) => armazenamento.set(k, String(v)) };
  });
  it('sem nada salvo: progresso inicial com música ligada', () => {
    const p = carregarProgresso();
    assert.equal(p.vitorias, 0);
    assert.equal(p.musica, true);
  });
  it('salvar e carregar de volta', () => {
    const p = carregarProgresso();
    p.vitorias = 7; p.desbloqueadas.primeira = 1;
    salvarProgresso(p);
    assert.equal(carregarProgresso().vitorias, 7);
  });
  it('migra o formato da versão 1 (nomes em inglês)', () => {
    armazenamento.set('truco-de-turing:v1', JSON.stringify({ wins: 3, hands: 5, unlocked: { primeira: 1 }, muted: true, opts: { bot: 'hotseat', deck: 'truco', terrain: 'oceano', starter: 'sorteio', target: 12 } }));
    const p = carregarProgresso();
    assert.equal(p.vitorias, 3);
    assert.equal(p.mudo, true);
    assert.equal(p.opcoes.oponente, 'doisHumanos');
    const semOpcoes = (armazenamento.set('truco-de-turing:v1', '{}'), carregarProgresso());
    assert.equal(semOpcoes.opcoes, null);
  });
  it('armazenamento quebrado ou ausente não derruba o jogo', () => {
    globalThis.localStorage = { getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('cheio'); } };
    assert.equal(carregarProgresso().vitorias, 0);
    assert.doesNotThrow(() => salvarProgresso({ a: 1 }));
    delete globalThis.localStorage;
    assert.equal(carregarProgresso().maos, 0);
  });
});
