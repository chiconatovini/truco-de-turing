/* Truco de Turing — regras, baralhos e terrenos.
 * Arquivo puro (sem Phaser): roda no navegador e no Node (tools/simulate.js). */
var TT = (globalThis.TT = globalThis.TT || {});

TT.RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
TT.SUITS = ['S', 'H', 'C', 'D'];
TT.SUIT_INFO = {
  S: { name: 'Espadas', sym: '♠', red: false, emblem: 'espada', frame: 'aco' },
  H: { name: 'Copas', sym: '♥', red: true, emblem: 'copa', frame: 'rubi' },
  C: { name: 'Paus', sym: '♣', red: false, emblem: 'pau', frame: 'mata' },
  D: { name: 'Ouros', sym: '♦', red: true, emblem: 'ouro', frame: 'ouro' },
};
/* Desempate de naipe definido na especificação: espadas > copas > paus > ouros */
TT.SUIT_ORDER = { S: 4, H: 3, C: 2, D: 1 };
TT.RANK_NAME = {
  A: 'Ás', '2': 'Dois', '3': 'Três', '4': 'Quatro', '5': 'Cinco', '6': 'Seis', '7': 'Sete',
  '8': 'Oito', '9': 'Nove', '10': 'Dez', J: 'Valete', Q: 'Dama', K: 'Rei',
};
TT.RANK_PLURAL = { J: 'Valetes', Q: 'Damas', K: 'Reis' };
/* Força de carta para "quem joga primeiro" e desempates de mão */
TT.RANK_STRENGTH = { A: 14, K: 13, Q: 12, J: 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };

/* Arquitetura da rede na mesa: entrada(3) + 5 ocultas(5) + saída(4) */
TT.LAYER_SIZES = [3, 5, 5, 5, 5, 5, 4];
TT.N_LAYERS = TT.LAYER_SIZES.length;
TT.OUTPUT = TT.N_LAYERS - 1;
TT.HAND_SIZE = 5;
TT.isHidden = function (layer) { return layer > 0 && layer < TT.OUTPUT; };
TT.layerName = function (l) {
  if (l === 0) return 'Entrada';
  if (l === TT.OUTPUT) return 'Saída';
  return 'Oculta ' + l;
};

TT.isFigure = function (card) { return card.r === 'J' || card.r === 'Q' || card.r === 'K'; };

/* ---------- Baralhos ---------- */
function standardDeck() {
  var d = [];
  TT.SUITS.forEach(function (s) {
    TT.RANKS.forEach(function (r) { d.push({ id: r + s, r: r, s: s }); });
  });
  return d;
}

TT.DECKS = {
  classico: {
    name: 'Clássico',
    short: 'Baralho padrão de 52 cartas, sem coringas.',
    build: standardDeck,
  },
  truco: {
    name: 'Truco',
    short: 'Manilhas mandam: Zap (4♣) vale 12, Copas (7♥) vale 9, Espadilha (A♠) vale 13 e Pica-fumo (7♦) vale 10.',
    build: standardDeck,
    override: { '4C': 12, '7H': 9, AS: 13, '7D': 10 },
    manilhas: { '4C': 'Zap', '7H': 'Copas', AS: 'Espadilha', '7D': 'Pica-fumo' },
  },
  fraternidade: {
    name: 'Fraternidade',
    short: 'Neurônios vizinhos do mesmo naipe valem o dobro.',
    build: standardDeck,
    fraternity: true,
  },
  yinyang: {
    name: 'Yin-yang',
    short: 'Só existem 2 e Ás. Tunagens, overfits e stack overflows a todo momento.',
    build: function () {
      var d = [];
      for (var i = 0; i < 52; i++) {
        var r = i % 2 ? 'A' : '2';
        var s = TT.SUITS[Math.floor(i / 2) % 4];
        d.push({ id: r + s + '#' + i, r: r, s: s });
      }
      return d;
    },
  },
  powerbi: {
    name: 'Power BI',
    short: 'Depois de cada ação com a mão, as cartas que sobraram mudam aleatoriamente.',
    build: standardDeck,
    shuffleHand: true,
  },
};

/* ---------- Terrenos ---------- */
TT.TERRAINS = {
  neutro: { name: 'Mesa neutra', short: 'Sem efeito. Feltro verde, café e truco.' },
  montanha: {
    name: 'Montanha',
    short: 'A trilha sobe: cada neurônio vale 1 ponto a menos por camada alcançada.',
  },
  pantano: {
    name: 'Pântano',
    short: 'Neurônios sem tunagem afundam e perdem 1 ponto por rodada até a rede ser finalizada.',
  },
  oceano: {
    name: 'Oceano',
    short: 'A cada rodada o vento escolhe um naipe, que pontua em dobro.',
  },
};

TT.baseValue = function (card, deckKey) {
  var deck = TT.DECKS[deckKey];
  var key = card.r + card.s;
  if (deck && deck.override && deck.override[key] != null) return deck.override[key];
  if (card.r === 'A') return 11;
  if (TT.isFigure(card)) return 0;
  return parseInt(card.r, 10);
};

TT.cardLabel = function (card) {
  return (card.r === '10' ? '10' : card.r) + TT.SUIT_INFO[card.s].sym;
};
TT.cardName = function (card, deckKey) {
  var deck = TT.DECKS[deckKey];
  var key = card.r + card.s;
  if (deck && deck.manilhas && deck.manilhas[key]) return deck.manilhas[key];
  return TT.RANK_NAME[card.r] + ' de ' + TT.SUIT_INFO[card.s].name;
};

/* Gerador pseudoaleatório com semente (mulberry32): partidas reproduzíveis e simulações. */
TT.rng = function (state) {
  var t = (state.seed = (state.seed + 0x6d2b79f5) | 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
TT.shuffle = function (arr, state) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(TT.rng(state) * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
};
