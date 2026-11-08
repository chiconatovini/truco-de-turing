/* Laboratório de Monte Carlo em Node: roda partidas bot × bot e agrega estatísticas.
 * Uso: node tools/simulate.js [partidas] [bot1] [bot2] [baralho] [terreno] */
const path = require('path');
['rules', 'scoring', 'game', 'bots', 'truco'].forEach((f) => require(path.join(__dirname, '..', 'src', 'core', f + '.js')));
const TT = globalThis.TT;

const N = +process.argv[2] || 300;
const b1 = process.argv[3] || 'guloso';
const b2 = process.argv[4] || 'aleatorio';
const deck = process.argv[5] || 'classico';
const terrain = process.argv[6] || 'neutro';

const agg = { wins: [0, 0], firstWins: 0, scores: [], turns: [], ev: {}, reasons: {}, errors: 0 };
const t0 = Date.now();
for (let g = 0; g < N; g++) {
  const st = TT.newGame({
    deck, terrain, starter: 'revela-volta', seed: g * 7919 + 13,
    players: [{ name: 'A', kind: 'bot', bot: b1 }, { name: 'B', kind: 'bot', bot: b2 }],
  });
  try {
    let guard = 0;
    while (st.phase !== 'over' && guard++ < 400) {
      if (st.phase === 'starter') {
        st.players.forEach((pl, i) => { if (!pl.starterCard) TT.applyMove(st, TT.botMove(st, i)); });
        continue;
      }
      const m = b1 === 'montecarlo' || b2 === 'montecarlo'
        ? (st.players[st.current].bot === 'montecarlo' ? TT.botMonteCarlo(st, st.current, 40) : TT.botMove(st, st.current))
        : TT.botMove(st, st.current);
      delete m.mc;
      TT.applyMove(st, m);
    }
    if (st.phase !== 'over') throw new Error('não terminou');
    st.events.forEach((e) => { agg.ev[e.t] = (agg.ev[e.t] || 0) + 1; });
    agg.wins[st.result.winner]++;
    if (st.result.winner === st.first) agg.firstWins++;
    agg.scores.push(...st.result.scores);
    agg.turns.push(st.turn);
    agg.reasons[st.result.reason] = (agg.reasons[st.result.reason] || 0) + 1;
  } catch (e) {
    agg.errors++;
    if (agg.errors < 4) console.error('Erro na partida', g, e.message);
  }
}
const mean = (a) => (a.reduce((s, x) => s + x, 0) / a.length).toFixed(1);
console.log(`${N} partidas ${b1} × ${b2} | baralho ${deck} | terreno ${terrain} | ${Date.now() - t0} ms`);
console.log('vitórias', agg.wins, '| quem começa vence', (100 * agg.firstWins / N).toFixed(1) + '%');
console.log('pontuação média', mean(agg.scores), '| máx', Math.max(...agg.scores), '| turnos médios', mean(agg.turns));
console.log('eventos por partida', Object.fromEntries(Object.entries(agg.ev).map(([k, v]) => [k, (v / N).toFixed(2)])));
console.log('motivos', agg.reasons, '| erros', agg.errors);
