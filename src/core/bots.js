/* Oponentes artificiais.
 *  - aleatorio: "Ruído Branco", joga qualquer coisa legal.
 *  - guloso:    "GatoNet", olha um passo à frente com uma função de avaliação (valor esperado).
 *  - montecarlo:"Monte Carlo, o Truqueiro", determiniza a informação oculta e simula partidas até o fim.
 */
var TT = (globalThis.TT = globalThis.TT || {});

TT.BOTS = {
  aleatorio: { name: 'Ruído Branco', avatar: 'ruido', blurb: 'Joga qualquer jogada legal. Ótimo para aprender as regras.' },
  guloso: { name: 'GatoNet', avatar: 'gato', blurb: 'Guloso: avalia cada jogada um passo à frente pelo valor esperado.' },
  montecarlo: { name: 'Monte Carlo', avatar: 'mc', blurb: 'Simula centenas de partidas antes de cada jogada. Pede truco com convicção.' },
};

var HAND_VALUE = 2.5;

/* Cartas que o jogador p não consegue ver */
function hiddenCards(state, p) {
  var out = [];
  state.layers.forEach(function (layer) {
    layer.forEach(function (s) { if (!s.removed && !s.faceUp && !s.known) out.push(s.cards[0]); });
  });
  state.players.forEach(function (pl, i) { if (i !== p) out = out.concat(pl.hand); });
  return out.concat(state.limbo);
}

/* Sorteia uma configuração plausível para o que p não vê (determinização) */
TT.determinize = function (state, p) {
  var c = TT.cloneState(state);
  c.seed = (Math.random() * 2147483647) | 0;
  var pool = TT.shuffle(hiddenCards(c, p).slice(), c);
  var k = 0;
  c.layers.forEach(function (layer) {
    layer.forEach(function (s) { if (!s.removed && !s.faceUp && !s.known) s.cards[0] = pool[k++]; });
  });
  c.players.forEach(function (pl, i) {
    if (i === p) return;
    pl.hand = pl.hand.map(function () { return pool[k++]; });
  });
  c.limbo = c.limbo.map(function () { return pool[k++]; });
  return c;
};

TT.evPerLayer = function (state, p) {
  return TT.expectedCardValue(state, hiddenCards(state, p));
};

function projected(state, q, ev) {
  var pl = state.players[q];
  var s = TT.scoreNetwork(state, q).total;
  if (pl.status === 'building') {
    var remaining = TT.N_LAYERS - pl.path.length;
    var can = TT.revealTargets(state, q).length > 0;
    s += remaining * ev * (can ? 0.85 : 0.35);
  }
  return s + pl.hand.length * HAND_VALUE;
}

TT.evaluate = function (state, p, ev) {
  if (state.phase === 'over') {
    var r = state.result;
    return (r.winner === p ? 1000 : -1000) + (r.scores[p] - Math.max.apply(null, r.scores.filter(function (_, i) { return i !== p; })));
  }
  var mine = projected(state, p, ev);
  var best = -Infinity;
  state.players.forEach(function (_, q) { if (q !== p) best = Math.max(best, projected(state, q, ev)); });
  return mine - best;
};

/* Agrupa revelações de neurônios desconhecidos de uma mesma camada (são equivalentes para quem joga) */
function dedupe(state, moves) {
  var seen = {};
  var out = [];
  moves.forEach(function (m) {
    if (m.t === 'reveal') {
      var s = state.slotIndex[m.slot];
      if (!s.known) {
        var key = 'u' + s.layer;
        if (seen[key]) { seen[key].alts.push(m.slot); return; }
        m = Object.assign({ alts: [m.slot] }, m);
        seen[key] = m;
      }
    }
    out.push(m);
  });
  return out;
}
function pickAlt(m) {
  if (m.alts && m.alts.length) {
    var r = Object.assign({}, m);
    r.slot = m.alts[Math.floor(Math.random() * m.alts.length)];
    delete r.alts;
    return r;
  }
  return m;
}
function strip(m) { var r = Object.assign({}, m); delete r.alts; return r; }

TT.botRandom = function (state, p) {
  var moves = TT.legalMoves(state, p);
  var reveals = moves.filter(function (m) { return m.t === 'reveal'; });
  if (reveals.length && Math.random() < 0.7) return reveals[Math.floor(Math.random() * reveals.length)];
  return moves[Math.floor(Math.random() * moves.length)];
};

TT.botGreedy = function (state, p) {
  var ev = TT.evPerLayer(state, p);
  var moves = dedupe(state, TT.legalMoves(state, p, { dropout: true }));
  var best = null, bestScore = -Infinity;
  moves.forEach(function (m) {
    var samples = m.t === 'reveal' && m.alts ? 8 : 1;
    var total = 0;
    for (var i = 0; i < samples; i++) {
      var c = samples > 1 ? TT.determinize(state, p) : TT.cloneState(state);
      var mm = strip(pickAlt(m));
      TT.applyMove(c, mm);
      total += TT.evaluate(c, p, ev);
    }
    var score = total / samples + Math.random() * 0.3;
    if (m.t === 'dropout') score -= 1.5; /* GatoNet tem preguiça de pagar cartas */
    if (score > bestScore) { bestScore = score; best = m; }
  });
  return pickAlt(best);
};

/* Política rápida usada nos rollouts de Monte Carlo */
function rolloutMove(state, q) {
  var pl = state.players[q];
  var moves = TT.legalMoves(state, q);
  if (moves.length === 1) return moves[0];
  if (Math.random() < 0.12) return moves[Math.floor(Math.random() * moves.length)];
  var best = null, bestPri = 0;
  moves.forEach(function (m) {
    if (m.t !== 'stack') return;
    var slot = state.slotIndex[m.slot];
    var eff = TT.stackEffect(state, q, slot, m.cards.length);
    var pri = 0;
    var v = TT.baseValue(slot.cards[0], state.cfg.deck);
    if (!eff.self) {
      if (eff.kind === 'stackoverflow') pri = 9;
      else if (eff.kind === 'earlystop') pri = 8;
      else if (eff.kind === 'overfit' && v >= 7) pri = 5;
    } else if (eff.kind === 'tunagem' && (v >= 6 || TT.isFigure(slot.cards[0]))) pri = 4;
    if (pri > bestPri) { bestPri = pri; best = m; }
  });
  if (best && Math.random() < 0.75) return best;
  var reveals = moves.filter(function (m) { return m.t === 'reveal'; });
  if (reveals.length) {
    var known = reveals.filter(function (m) { return state.slotIndex[m.slot].known; });
    var goodKnown = known.filter(function (m) { return TT.baseValue(state.slotIndex[m.slot].cards[0], state.cfg.deck) >= 7; });
    if (goodKnown.length) return goodKnown[0];
    var unknown = reveals.filter(function (m) { return !state.slotIndex[m.slot].known; });
    var list = unknown.length ? unknown : reveals;
    return list[Math.floor(Math.random() * list.length)];
  }
  return moves[moves.length - 1];
}

TT.playout = function (state) {
  var guard = 0;
  while (state.phase === 'play' && guard++ < 200) {
    TT.applyMove(state, rolloutMove(state, state.current));
  }
  return state;
};

/* Probabilidade estimada de p vencer a mão a partir do estado atual */
TT.winProb = function (state, p, n) {
  if (state.phase === 'over') return state.result.winner === p ? 1 : 0;
  var wins = 0;
  for (var i = 0; i < n; i++) {
    var c = TT.determinize(state, p);
    if (c.phase === 'starter') return 0.5;
    TT.playout(c);
    if (c.result && c.result.winner === p) wins++;
  }
  return wins / n;
};

TT.botMonteCarlo = function (state, p, budgetMs) {
  budgetMs = budgetMs || 380;
  var moves = dedupe(state, TT.legalMoves(state, p, { dropout: true }));
  if (moves.length === 1) return pickAlt(moves[0]);
  var stats = moves.map(function () { return { w: 0, n: 0, d: 0 }; });
  var t0 = Date.now();
  var rounds = 0;
  while ((Date.now() - t0 < budgetMs || rounds < 6) && rounds < 400) {
    for (var i = 0; i < moves.length; i++) {
      var c = TT.determinize(state, p);
      TT.applyMove(c, strip(pickAlt(moves[i])));
      TT.playout(c);
      var st = stats[i];
      st.n++;
      if (c.result) {
        if (c.result.winner === p) st.w++;
        st.d += c.result.scores[p] - c.result.scores[1 - p];
      }
    }
    rounds++;
  }
  var best = 0, bestScore = -Infinity;
  stats.forEach(function (st, i) {
    var score = st.w / st.n + 0.002 * (st.d / st.n);
    if (moves[i].t === 'dropout') score -= 0.02;
    if (score > bestScore) { bestScore = score; best = i; }
  });
  var chosen = pickAlt(moves[best]);
  chosen.mc = { winRate: stats[best].w / stats[best].n, sims: rounds * moves.length };
  return chosen;
};

TT.botStarterCard = function (state, p) {
  var hand = state.players[p].hand.slice();
  if (state.cfg.starter === 'revela-descarta') {
    /* descarta a carta menos útil: a de menor valor de pontos */
    hand.sort(function (a, b) { return TT.baseValue(a, state.cfg.deck) - TT.baseValue(b, state.cfg.deck) || TT.RANK_STRENGTH[a.r] - TT.RANK_STRENGTH[b.r]; });
    return hand[0];
  }
  hand.sort(function (a, b) { return TT.RANK_STRENGTH[b.r] * 10 + TT.SUIT_ORDER[b.s] - (TT.RANK_STRENGTH[a.r] * 10 + TT.SUIT_ORDER[a.s]); });
  return hand[0];
};

TT.botMove = function (state, p) {
  var kind = state.players[p].bot;
  if (state.phase === 'starter') return { t: 'starter', p: p, card: TT.botStarterCard(state, p).id };
  if (kind === 'aleatorio') return TT.botRandom(state, p);
  if (kind === 'montecarlo') return TT.botMonteCarlo(state, p);
  return TT.botGreedy(state, p);
};

/* ---- Truco: decisões do bot ---- */
TT.botTrucoCall = function (state, p, kind) {
  if (state.phase !== 'play') return false;
  if (kind === 'aleatorio') return Math.random() < 0.06;
  var pw = TT.winProb(state, p, kind === 'montecarlo' ? 60 : 24);
  if (pw > 0.72) return Math.random() < 0.8;
  if (pw > 0.4 && Math.random() < 0.05) return true; /* blefe */
  return false;
};

TT.botTrucoAnswer = function (state, p, kind, stake, canRaise) {
  if (kind === 'aleatorio') {
    var r = Math.random();
    return r < 0.55 ? 'accept' : r < 0.85 ? 'run' : canRaise ? 'raise' : 'accept';
  }
  var pw = state.phase === 'starter' ? 0.5 : TT.winProb(state, p, kind === 'montecarlo' ? 60 : 24);
  if (canRaise && pw > 0.8) return 'raise';
  var bar = 0.3 + Math.min(0.15, stake * 0.012);
  if (pw >= bar) return 'accept';
  if (Math.random() < 0.08) return 'accept'; /* teimosia */
  return 'run';
};
