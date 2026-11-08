/* Ponto de entrada: estado do aplicativo, conquistas e configuração do Phaser. */
var TT = (globalThis.TT = globalThis.TT || {});

TT.App = {
  store: TT.Store.load(),
  sessionSeen: {},
  opts: null,
  game: null,

  init: function () {
    this.opts = Object.assign({ bot: 'guloso', deck: 'classico', terrain: 'neutro', starter: 'revela-volta', target: 12 }, this.store.opts || {});
    TT.Sfx.setMuted(!!this.store.muted);
  },
  persist: function () { TT.Store.save(this.store); },
  saveOpts: function () { this.store.opts = this.opts; this.persist(); },
  toggleSound: function () {
    this.store.muted = !TT.Sfx.isMuted();
    TT.Sfx.setMuted(this.store.muted);
    this.persist();
  },
  play: function () {
    TT.UI.closeAll();
    this.game.scene.stop('Menu');
    this.game.scene.start('Game');
  },
  toMenu: function () {
    TT.UI.closeAll();
    this.game.scene.stop('Game');
    this.game.scene.start('Menu');
  },

  /* Registra o fim de uma mão contra bot e devolve as conquistas novas */
  recordHand: function (ctx) {
    var s = this.store;
    var pl = ctx.st.players[ctx.me];
    s.hands++;
    s.dropouts += pl.dropouts;
    if (ctx.won) {
      s.wins++;
      if (ctx.full && pl.actionsUsed === 0) s.zenWins++;
      if (ctx.full) { s.terrains[ctx.st.cfg.terrain] = true; s.decks[ctx.st.cfg.deck] = true; }
    }
    ctx.stats = s;
    var partialOk = { correu: 1, campeao: 1, maquina: 1, primeira: 1, dez: 1, cinquenta: 1, gato10: 1, gato100: 1, biblio: 1, truco: 1, doze: 1, cartografo: 1, colecionador: 1 };
    var fresh = [];
    TT.ACHIEVEMENTS.forEach(function (a) {
      if (s.unlocked[a.id]) return;
      if (!ctx.full && !partialOk[a.id]) return;
      var ok = false;
      try { ok = !!a.test(ctx); } catch (e) { ok = false; }
      if (ok) { s.unlocked[a.id] = Date.now(); fresh.push(a); }
    });
    this.persist();
    if (fresh.length) TT.Sfx.badge();
    return fresh;
  },

  checkMetaAchievements: function () {
    var s = this.store;
    var a = TT.ACHIEVEMENTS.find(function (x) { return x.id === 'biblio'; });
    if (!s.unlocked.biblio && s.codexRead >= TT.CODEX.length) {
      s.unlocked.biblio = Date.now();
      this.persist();
      TT.UI.toast('Conquista: ' + a.name, a.desc, 'badge');
      TT.Sfx.badge();
    }
  },
};

TT.boot = function () {
  TT.App.init();
  TT.App.game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: Math.round(TT.W * TT.RES),
    height: Math.round(TT.H * TT.RES),
    backgroundColor: '#06180f',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    render: { antialias: true, roundPixels: false },
    input: { windowEvents: false }, /* cliques nos painéis HTML não vazam para o canvas */
    scene: [TT.BootScene, TT.MenuScene, TT.GameScene],
  });
  globalThis.__TT_GAME__ = TT.App.game;
};

TT.boot();
