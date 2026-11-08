/* Pontuação da rede ("forward pass").
 *
 * Regras da especificação:
 *  - 2 a 10: valor nominal | Ás: 11 | J, Q, K: 0
 *  - Pares de figuras iguais em camadas adjacentes valem 10 em conjunto, trios 20,
 *    quadras zeram a rede inteira (vanishing gradient).
 *  - Tunagem soma a nova carta; em figura adiciona +10, cumulativo com as figuras adjacentes.
 *
 * Leitura adotada para o exemplo do professor ("8-K-K-3" com tunagem em um K = 41):
 *  cada carta de figura empilhada conta para o combo. K(2 cartas)+K(1 carta) = 3 Reis em
 *  camadas adjacentes = trio (20) + tunagem (10) => 8 + 20 + 10 + 3 = 41.
 *  Quatro figuras iguais numa sequência adjacente (contando as empilhadas) => vanishing gradient.
 */
var TT = (globalThis.TT = globalThis.TT || {});

TT.slotById = function (state, id) { return state.slotIndex[id]; };

TT.scoreNetwork = function (state, p) {
  var pl = state.players[p];
  var ctx = pl.frozen || { round: state.round, wind: state.wind };
  var deckKey = state.cfg.deck;
  var terrain = state.cfg.terrain;
  var neurons = pl.path.map(function (id, i) {
    var slot = TT.slotById(state, id);
    var top = slot.cards[0];
    var stack = slot.cards.length;
    var fig = TT.isFigure(top);
    var v, notes = [];
    if (fig) {
      v = 10 * (stack - 1);
      if (stack > 1) notes.push('tunagem +' + v);
    } else {
      v = 0;
      slot.cards.forEach(function (c) { v += TT.baseValue(c, deckKey); });
      if (stack > 1) notes.push('tunado x' + stack);
    }
    if (terrain === 'montanha' && v > 0) {
      var nv = Math.max(0, v - i);
      if (nv !== v) notes.push('montanha -' + (v - nv));
      v = nv;
    } else if (terrain === 'pantano' && stack === 1 && v > 0) {
      var sink = Math.max(0, ctx.round - slot.revealedRound);
      var sv = Math.max(0, v - sink);
      if (sv !== v) notes.push('afundou -' + (v - sv));
      v = sv;
    } else if (terrain === 'oceano' && top.s === ctx.wind && v > 0) {
      notes.push('vento x2');
      v *= 2;
    }
    return { slot: slot, layer: i, card: top, stack: stack, fig: fig, v: v, notes: notes };
  });

  /* Baralho da fraternidade: sequências do mesmo naipe dobram */
  if (TT.DECKS[deckKey].fraternity) {
    for (var i = 0; i < neurons.length; i++) {
      var prev = neurons[i - 1], next = neurons[i + 1];
      var n = neurons[i];
      if ((prev && prev.card.s === n.card.s) || (next && next.card.s === n.card.s)) {
        if (n.v > 0) { n.v *= 2; n.notes.push('fraternidade x2'); }
        n.frat = true;
      }
    }
  }

  /* Combos de figuras em camadas adjacentes */
  var combos = [];
  var vanishing = false;
  var k = 0;
  while (k < neurons.length) {
    var start = k;
    if (neurons[k].fig) {
      while (k + 1 < neurons.length && neurons[k + 1].fig && neurons[k + 1].card.r === neurons[start].card.r) k++;
    }
    var len = k - start + 1;
    if (len >= 2) {
      var count = 0;
      for (var j = start; j <= k; j++) count += neurons[j].stack;
      var rank = neurons[start].card.r;
      if (count >= 4) {
        vanishing = true;
        combos.push({ from: start, to: k, rank: rank, count: count, pts: 0, label: 'Quadra de ' + TT.RANK_PLURAL[rank] + ': vanishing gradient' });
      } else {
        var pts = 10 * (count - 1);
        combos.push({ from: start, to: k, rank: rank, count: count, pts: pts, label: (count === 2 ? 'Par' : 'Trio') + ' de ' + TT.RANK_PLURAL[rank] + ' +' + pts });
      }
    }
    k++;
  }

  var total = 0;
  neurons.forEach(function (n) { total += n.v; });
  combos.forEach(function (c) { total += c.pts; });
  if (vanishing) total = 0;
  return { total: total, neurons: neurons, combos: combos, vanishing: vanishing };
};

/* Média de pontos de uma carta desconhecida (para heurísticas dos bots) */
TT.expectedCardValue = function (state, cards) {
  if (!cards.length) return 0;
  var s = 0;
  cards.forEach(function (c) { s += TT.baseValue(c, state.cfg.deck); });
  return s / cards.length;
};
