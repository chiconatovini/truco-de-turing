/* Camada de truco: a partida vale tentos (até 12) e cada mão pode ser trucada.
 * TRUCO! (3) -> SEIS! (6) -> NOVE! (9) -> DOZE! (12). Quem corre entrega o valor atual.
 * Mão de onze: com alguém a um tento da vitória, ninguém pode trucar. */
var TT = (globalThis.TT = globalThis.TT || {});

TT.TRUCO_LADDER = [1, 3, 6, 9, 12];
TT.TRUCO_SHOUT = { 3: 'TRUCO!', 6: 'SEIS!', 9: 'NOVE!', 12: 'DOZE!' };

TT.newMatch = function (target) {
  return { target: target, tentos: [0, 0], hand: 0, value: 1, raisedBy: -1, pending: null, over: false, winner: -1, log: [] };
};

TT.nextStake = function (v) {
  var i = TT.TRUCO_LADDER.indexOf(v);
  return i >= 0 && i < TT.TRUCO_LADDER.length - 1 ? TT.TRUCO_LADDER[i + 1] : null;
};

TT.maoDeOnze = function (m) {
  return m.target > 1 && (m.tentos[0] === m.target - 1 || m.tentos[1] === m.target - 1);
};

TT.canTruco = function (m, p) {
  if (m.over || m.target <= 1 || m.pending) return false;
  if (m.raisedBy === p) return false;
  if (TT.maoDeOnze(m)) return false;
  return TT.nextStake(m.value) != null;
};

TT.callTruco = function (m, p) {
  if (!TT.canTruco(m, p)) return false;
  m.pending = { by: p, to: TT.nextStake(m.value) };
  return true;
};

/* Responde a um pedido pendente. Retorna {handOver, winner, pts} quando alguém corre. */
TT.answerTruco = function (m, q, answer) {
  var pend = m.pending;
  if (!pend) return null;
  if (answer === 'run') {
    m.pending = null;
    return { handOver: true, winner: pend.by, pts: m.value };
  }
  m.value = pend.to;
  m.raisedBy = pend.by;
  m.pending = null;
  if (answer === 'raise') {
    var nxt = TT.nextStake(m.value);
    if (nxt) m.pending = { by: q, to: nxt };
  }
  return { handOver: false };
};

TT.scoreHand = function (m, winner, pts) {
  var gain = pts != null ? pts : m.value;
  m.tentos[winner] = Math.min(m.target, m.tentos[winner] + gain);
  if (m.tentos[winner] >= m.target) { m.over = true; m.winner = winner; }
  return gain;
};

TT.nextHand = function (m) {
  m.hand++;
  m.value = 1;
  m.raisedBy = -1;
  m.pending = null;
};
