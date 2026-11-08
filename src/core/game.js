/* Motor do jogo: estado, jogadas legais e aplicação de jogadas. Sem dependências de interface. */
var TT = (globalThis.TT = globalThis.TT || {});

TT.STARTERS = {
  'revela-descarta': 'Cada um revela uma carta da mão; a maior começa e as duas vão para o cemitério',
  'revela-volta': 'Cada um revela uma carta da mão; a maior começa e as duas voltam para a mão',
  sorteio: 'Par ou ímpar: sorteio simples',
};

TT.newGame = function (opts) {
  var state = {
    cfg: { deck: opts.deck || 'classico', terrain: opts.terrain || 'neutro', starter: opts.starter || 'revela-volta' },
    seed: opts.seed != null ? opts.seed | 0 : (Date.now() ^ (Math.random() * 1e9)) | 0,
    uid: 0,
    layers: [],
    slotIndex: {},
    players: opts.players.map(function (pp, i) {
      return {
        idx: i, name: pp.name, kind: pp.kind || 'human', bot: pp.bot || null,
        hand: [], path: [], status: 'building', dropouts: 0, actionsUsed: 0,
        transferUsed: false, frozen: null, starterCard: null,
        stats: { reveals: 0, tunings: 0, overfits: 0, earlyStops: 0, overflows: 0, selfStops: 0, suffered: 0, vanish: 0, transfer: 0 },
      };
    }),
    limbo: [], graveyard: [],
    current: 0, first: 0, round: 1, turn: 0, passesInRow: 0,
    wind: null, phase: 'starter', events: [], log: [], history: [], result: null, sim: false,
  };
  var deck = TT.shuffle(TT.DECKS[state.cfg.deck].build(), state);
  for (var l = 0; l < TT.N_LAYERS; l++) {
    var layer = [];
    for (var n = 0; n < TT.LAYER_SIZES[l]; n++) {
      var slot = { id: 'L' + l + 'N' + n, layer: l, idx: n, cards: [deck.pop()], faceUp: false, owner: -1, removed: false, known: false, revealedRound: 0 };
      layer.push(slot);
      state.slotIndex[slot.id] = slot;
    }
    state.layers.push(layer);
  }
  state.players.forEach(function (pl) { for (var i = 0; i < TT.HAND_SIZE; i++) pl.hand.push(deck.pop()); });
  state.limbo = deck; /* 10 cartas queimadas: ruído */
  if (state.cfg.terrain === 'oceano') state.wind = TT.SUITS[Math.floor(TT.rng(state) * 4)];
  if (state.cfg.starter === 'sorteio') {
    state.first = state.current = Math.floor(TT.rng(state) * state.players.length);
    state.phase = 'play';
    emit(state, { t: 'start', p: state.first, how: 'sorteio' });
  }
  pushHistory(state);
  return state;
};

function emit(state, ev) {
  if (state.sim) return;
  state.events.push(ev);
}
function log(state, msg) {
  if (state.sim) return;
  state.log.push(msg);
}
function pushHistory(state) {
  if (state.sim) return;
  state.history.push(state.players.map(function (_, p) { return TT.scoreNetwork(state, p).total; }));
}

TT.rebuildIndex = function (state) {
  state.slotIndex = {};
  state.layers.forEach(function (layer) { layer.forEach(function (s) { state.slotIndex[s.id] = s; }); });
  return state;
};

/* Cópia profunda leve para simulações (sem eventos/log/histórico) */
TT.cloneState = function (state) {
  var c = {
    cfg: state.cfg, seed: state.seed, uid: state.uid,
    layers: state.layers.map(function (layer) {
      return layer.map(function (s) {
        return { id: s.id, layer: s.layer, idx: s.idx, cards: s.cards.slice(), faceUp: s.faceUp, owner: s.owner, removed: s.removed, known: s.known, revealedRound: s.revealedRound };
      });
    }),
    slotIndex: {},
    players: state.players.map(function (pl) {
      return {
        idx: pl.idx, name: pl.name, kind: pl.kind, bot: pl.bot, hand: pl.hand.slice(), path: pl.path.slice(),
        status: pl.status, dropouts: pl.dropouts, actionsUsed: pl.actionsUsed, transferUsed: pl.transferUsed,
        frozen: pl.frozen, starterCard: pl.starterCard, stats: Object.assign({}, pl.stats),
      };
    }),
    limbo: state.limbo.slice(), graveyard: state.graveyard.slice(),
    current: state.current, first: state.first, round: state.round, turn: state.turn, passesInRow: state.passesInRow,
    wind: state.wind, phase: state.phase, events: [], log: [], history: [], result: null, sim: true,
  };
  return TT.rebuildIndex(c);
};

TT.frontier = function (state, p) {
  var path = state.players[p].path;
  return path.length ? state.slotIndex[path[path.length - 1]] : null;
};

TT.revealTargets = function (state, p) {
  var pl = state.players[p];
  if (pl.status !== 'building') return [];
  var next = pl.path.length;
  if (next >= TT.N_LAYERS) return [];
  return state.layers[next].filter(function (s) { return !s.removed && s.owner === -1; });
};

/* Neurônios que podem receber cartas empilhadas: fronteira oculta de redes ainda em construção */
TT.stackTargets = function (state) {
  var out = [];
  state.players.forEach(function (pl, o) {
    if (pl.status !== 'building') return;
    var f = TT.frontier(state, o);
    if (f && TT.isHidden(f.layer) && f.cards.length < 4) out.push(f);
  });
  return out;
};

TT.stackEffect = function (state, p, slot, n) {
  var size = slot.cards.length + n;
  var self = slot.owner === p;
  if (size === 2) return { kind: self ? 'tunagem' : 'overfit', self: self };
  if (size === 3) return { kind: 'earlystop', self: self };
  if (size === 4) return { kind: 'stackoverflow', self: self };
  return null;
};

TT.EFFECT_LABEL = {
  tunagem: 'Tunagem', overfit: 'Overfit', earlystop: 'Early stop', stackoverflow: 'Stack overflow',
};

TT.canStack = function (state, p, slotId, cardIds) {
  if (state.phase !== 'play' || state.current !== p || !cardIds.length) return false;
  var slot = state.slotIndex[slotId];
  if (!slot || TT.stackTargets(state).indexOf(slot) < 0) return false;
  if (slot.cards.length + cardIds.length > 4) return false;
  var hand = state.players[p].hand;
  return cardIds.every(function (id) {
    var c = hand.find(function (h) { return h.id === id; });
    return c && c.r === slot.cards[0].r;
  });
};

TT.trailingHidden = function (state, p) {
  var pl = state.players[p];
  if (pl.status !== 'building' || pl.path.length < 2) return 0;
  return pl.path.length - 1;
};

TT.transferRank = function (state, p) {
  var pl = state.players[p];
  if (pl.transferUsed) return null;
  var count = {};
  pl.hand.forEach(function (c) { count[c.r] = (count[c.r] || 0) + 1; });
  for (var r in count) if (count[r] >= 4) return r;
  return null;
};

TT.canPass = function (state, p) {
  return state.phase === 'play' && state.current === p && TT.revealTargets(state, p).length === 0;
};

function combos(arr, k) {
  var out = [];
  (function rec(start, acc) {
    if (acc.length === k) { out.push(acc.slice()); return; }
    for (var i = start; i < arr.length; i++) { acc.push(arr[i]); rec(i + 1, acc); acc.pop(); }
  })(0, []);
  return out;
}

/* Lista de jogadas legais. opts.dropout inclui dropouts "baratos" (para bots). */
TT.legalMoves = function (state, p, opts) {
  opts = opts || {};
  var pl = state.players[p];
  var moves = [];
  if (state.phase === 'starter') {
    if (pl.starterCard == null) pl.hand.forEach(function (c) { moves.push({ t: 'starter', p: p, card: c.id }); });
    return moves;
  }
  if (state.phase !== 'play' || state.current !== p) return moves;
  var reveals = TT.revealTargets(state, p);
  reveals.forEach(function (s) { moves.push({ t: 'reveal', p: p, slot: s.id }); });
  TT.stackTargets(state).forEach(function (slot) {
    var rank = slot.cards[0].r;
    var matching = pl.hand.filter(function (c) { return c.r === rank; });
    var maxN = Math.min(matching.length, 4 - slot.cards.length);
    for (var n = 1; n <= maxN; n++) {
      var values = {};
      matching.forEach(function (c) { values[TT.baseValue(c, state.cfg.deck)] = 1; });
      var sets = Object.keys(values).length > 1 ? combos(matching, n) : [matching.slice(0, n)];
      sets.forEach(function (set) {
        moves.push({ t: 'stack', p: p, slot: slot.id, cards: set.map(function (c) { return c.id; }) });
      });
    }
  });
  var tr = TT.transferRank(state, p);
  if (tr) {
    moves.push({ t: 'transfer', p: p, cards: pl.hand.filter(function (c) { return c.r === tr; }).slice(0, 4).map(function (c) { return c.id; }) });
  }
  if (opts.dropout) {
    var maxD = Math.min(TT.trailingHidden(state, p), pl.hand.length);
    var cheap = pl.hand.slice().sort(function (a, b) { return TT.baseValue(a, state.cfg.deck) - TT.baseValue(b, state.cfg.deck); });
    for (var d = 1; d <= Math.min(maxD, 2); d++) {
      moves.push({ t: 'dropout', p: p, n: d, pay: cheap.slice(0, d).map(function (c) { return c.id; }) });
    }
  }
  if (!reveals.length) moves.push({ t: 'pass', p: p });
  return moves;
};

function takeFromHand(pl, ids) {
  return ids.map(function (id) {
    var i = pl.hand.findIndex(function (c) { return c.id === id; });
    if (i < 0) throw new Error('Carta fora da mão: ' + id);
    return pl.hand.splice(i, 1)[0];
  });
}

function finalize(state, o, status) {
  var pl = state.players[o];
  pl.status = status;
  pl.frozen = { round: state.round, wind: state.wind };
}

function powerBiShuffle(state, pl) {
  if (!TT.DECKS[state.cfg.deck].shuffleHand) return;
  pl.hand = pl.hand.map(function () {
    state.uid++;
    var r = TT.RANKS[Math.floor(TT.rng(state) * 13)];
    var s = TT.SUITS[Math.floor(TT.rng(state) * 4)];
    return { id: r + s + '~' + state.uid, r: r, s: s };
  });
  emit(state, { t: 'powerbi', p: pl.idx });
}

function endTurn(state) {
  state.turn++;
  state.current = (state.current + 1) % state.players.length;
  if (state.current === state.first) {
    state.round++;
    if (state.cfg.terrain === 'oceano') {
      state.wind = TT.SUITS[Math.floor(TT.rng(state) * 4)];
      emit(state, { t: 'wind', suit: state.wind });
    }
  }
  pushHistory(state);
  var allFinal = state.players.every(function (pl) { return pl.status !== 'building'; });
  if (allFinal || state.passesInRow >= state.players.length) finishGame(state);
}

function resolveStarter(state) {
  var ps = state.players;
  var best = -1, bestKey = -1, tie = false;
  ps.forEach(function (pl, i) {
    var c = pl.starterCard;
    var key = TT.RANK_STRENGTH[c.r] * 10 + TT.SUIT_ORDER[c.s];
    if (key > bestKey) { bestKey = key; best = i; tie = false; } else if (key === bestKey) tie = true;
  });
  if (tie) best = Math.floor(TT.rng(state) * ps.length);
  var discard = state.cfg.starter === 'revela-descarta';
  var cards = ps.map(function (pl) { return pl.starterCard; });
  ps.forEach(function (pl) {
    if (discard) {
      var i = pl.hand.findIndex(function (c) { return c.id === pl.starterCard.id; });
      state.graveyard.push(pl.hand.splice(i, 1)[0]);
    }
  });
  state.first = state.current = best;
  state.phase = 'play';
  emit(state, { t: 'start', p: best, how: 'revela', cards: cards, tie: tie, discard: discard });
  log(state, ps[best].name + ' começa' + (tie ? ' (empate decidido no par ou ímpar)' : '') + '.');
}

TT.applyMove = function (state, m) {
  var p = m.p;
  var pl = state.players[p];
  if (m.t === 'starter') {
    pl.starterCard = pl.hand.find(function (c) { return c.id === m.card; });
    if (state.players.every(function (x) { return x.starterCard; })) resolveStarter(state);
    return state;
  }
  if (state.phase !== 'play') throw new Error('Partida não está em andamento');
  if (state.current !== p) throw new Error('Não é a vez de ' + pl.name);

  if (m.t === 'reveal') {
    var slot = state.slotIndex[m.slot];
    if (TT.revealTargets(state, p).indexOf(slot) < 0) throw new Error('Neurônio indisponível');
    slot.faceUp = true; slot.owner = p; slot.known = true; slot.revealedRound = state.round;
    pl.path.push(slot.id);
    pl.stats.reveals++;
    state.passesInRow = 0;
    emit(state, { t: 'reveal', p: p, slot: slot.id, card: slot.cards[0] });
    log(state, pl.name + ' ativou ' + TT.cardLabel(slot.cards[0]) + ' na camada ' + TT.layerName(slot.layer) + '.');
    if (slot.layer === TT.OUTPUT) {
      finalize(state, p, 'done');
      emit(state, { t: 'complete', p: p });
      log(state, pl.name + ' chegou à camada de saída!');
    }
    endTurn(state);
    return state;
  }

  if (m.t === 'stack') {
    if (!TT.canStack(state, p, m.slot, m.cards)) throw new Error('Empilhamento inválido');
    var target = state.slotIndex[m.slot];
    var o = target.owner;
    var victim = state.players[o];
    var eff = TT.stackEffect(state, p, target, m.cards.length);
    var played = takeFromHand(pl, m.cards);
    target.cards = target.cards.concat(played);
    pl.actionsUsed++;
    state.passesInRow = 0;
    if (eff.kind === 'tunagem') {
      pl.stats.tunings++;
      target.revealedRound = state.round;
      emit(state, { t: 'tunagem', p: p, o: o, slot: target.id, cards: played });
      log(state, pl.name + ' tunou ' + TT.cardLabel(target.cards[0]) + ' com ' + played.map(TT.cardLabel).join(' ') + '.');
    } else {
      var removed = target.cards;
      state.graveyard = state.graveyard.concat(removed);
      target.cards = []; target.removed = true; target.owner = -1;
      victim.path.pop();
      victim.stats.suffered++;
      if (eff.self) pl.stats.selfStops++;
      if (eff.kind === 'overfit') {
        pl.stats.overfits++;
        log(state, pl.name + ' aplicou OVERFIT em ' + TT.cardLabel(removed[0]) + ' de ' + victim.name + '.');
      } else if (eff.kind === 'earlystop') {
        if (!eff.self) pl.stats.earlyStops++;
        finalize(state, o, 'earlystop');
        log(state, pl.name + ' aplicou EARLY STOP' + (eff.self ? ' na própria rede' : ' em ' + victim.name) + '.');
      } else {
        if (!eff.self) pl.stats.overflows++;
        state.graveyard = state.graveyard.concat(victim.hand);
        var lost = victim.hand.length;
        victim.hand = [];
        finalize(state, o, 'overflow');
        log(state, 'STACK OVERFLOW! ' + victim.name + ' perdeu a rede e ' + lost + ' carta(s) da mão.');
      }
      emit(state, { t: eff.kind, p: p, o: o, slot: target.id, cards: removed, self: eff.self });
    }
    powerBiShuffle(state, pl);
    endTurn(state);
    return state;
  }

  if (m.t === 'dropout') {
    var maxD = TT.trailingHidden(state, p);
    if (m.n < 1 || m.n > maxD || m.pay.length !== m.n) throw new Error('Dropout inválido');
    var paid = takeFromHand(pl, m.pay);
    state.graveyard = state.graveyard.concat(paid);
    var dropped = [];
    for (var i = 0; i < m.n; i++) {
      var s = state.slotIndex[pl.path.pop()];
      var extra = s.cards.splice(1);
      state.graveyard = state.graveyard.concat(extra);
      s.faceUp = false; s.owner = -1; s.known = true;
      dropped.push(s.id);
    }
    pl.dropouts += m.n;
    pl.actionsUsed++;
    emit(state, { t: 'dropout', p: p, slots: dropped, paid: paid });
    log(state, pl.name + ' fez dropout (GatoNet) de ' + m.n + ' camada(s).');
    powerBiShuffle(state, pl);
    return state; /* não consome o turno */
  }

  if (m.t === 'transfer') {
    var rank = TT.transferRank(state, p);
    if (!rank || m.cards.length !== 4) throw new Error('Transfer learning indisponível');
    var out = takeFromHand(pl, m.cards);
    state.graveyard = state.graveyard.concat(out);
    TT.shuffle(state.limbo, state);
    var got = state.limbo.splice(0, Math.min(4, state.limbo.length));
    pl.hand = pl.hand.concat(got);
    pl.transferUsed = true;
    pl.actionsUsed++;
    pl.stats.transfer++;
    state.passesInRow = 0;
    emit(state, { t: 'transfer', p: p, out: out, got: got.length });
    log(state, pl.name + ' fez TRANSFER LEARNING: trocou quatro ' + rank + ' por ' + got.length + ' carta(s) do limbo.');
    powerBiShuffle(state, pl);
    endTurn(state);
    return state;
  }

  if (m.t === 'pass') {
    if (!TT.canPass(state, p)) throw new Error('Só passa a vez quem não pode ativar neurônio');
    state.passesInRow++;
    emit(state, { t: 'pass', p: p });
    log(state, pl.name + ' passou a vez.');
    endTurn(state);
    return state;
  }
  throw new Error('Jogada desconhecida: ' + m.t);
};

/* Desempates, na ordem da especificação */
function bestHandSum(state, pl, n) {
  var vals = pl.hand.map(function (c) { return TT.baseValue(c, state.cfg.deck); }).sort(function (a, b) { return b - a; });
  var s = 0;
  for (var i = 0; i < n; i++) s += vals[i];
  return s;
}
function highCardKey(state, pl) {
  var best = 0;
  pl.hand.forEach(function (c) {
    var k = TT.baseValue(c, state.cfg.deck) * 1000 + TT.RANK_STRENGTH[c.r] * 10 + TT.SUIT_ORDER[c.s];
    if (k > best) best = k;
  });
  return best;
}
function filterMax(list, fn) {
  var best = -Infinity;
  list.forEach(function (i) { best = Math.max(best, fn(i)); });
  return list.filter(function (i) { return fn(i) === best; });
}

function finishGame(state) {
  state.phase = 'over';
  var scores = state.players.map(function (_, p) { return TT.scoreNetwork(state, p).total; });
  var cand = state.players.map(function (_, i) { return i; });
  var reason = 'maior soma da rede';
  cand = filterMax(cand, function (i) { return scores[i]; });
  if (cand.length > 1) {
    reason = 'empate na soma; menos dropouts';
    cand = filterMax(cand, function (i) { return -state.players[i].dropouts; });
  }
  if (cand.length > 1) {
    var n = Math.min.apply(null, cand.map(function (i) { return state.players[i].hand.length; }));
    if (n === 0) {
      reason = 'empate; quem ficou sem cartas na mão perde';
      cand = filterMax(cand, function (i) { return state.players[i].hand.length > 0 ? 1 : 0; });
    } else {
      reason = 'empate; maior soma das ' + n + ' melhores cartas da mão';
      cand = filterMax(cand, function (i) { return bestHandSum(state, state.players[i], n); });
    }
  }
  if (cand.length > 1) {
    reason = 'empate; carta mais alta na mão (naipe desempata)';
    cand = filterMax(cand, function (i) { return highCardKey(state, state.players[i]); });
  }
  if (cand.length > 1) {
    reason = 'empate total; vence quem jogou primeiro';
    cand = cand.indexOf(state.first) >= 0 ? [state.first] : [cand[0]];
  }
  var stuck = state.players.map(function (pl) { return pl.status === 'building' && pl.path.length < TT.N_LAYERS; });
  state.result = { scores: scores, winner: cand[0], reason: reason, stuck: stuck };
  emit(state, { t: 'over', result: state.result });
  if (!state.sim) log(state, 'Fim da mão: ' + state.players[cand[0]].name + ' vence (' + reason + ').');
}
