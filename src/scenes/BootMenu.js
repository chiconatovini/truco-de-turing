/* Cena de carregamento (fontes + texturas base), resolução adaptativa e cena de fundo do menu. */
var TT = (globalThis.TT = globalThis.TT || {});

TT.W = 1280;
TT.H = 720;
TT.COLORS = { p0: 0x4aa3df, p1: 0xf59322, gold: 0xd9b260, wine: 0x7a1626, felt: 0x0f3b2a, parchment: 0xefe3c6, ink: 0x24170c };
TT.CSS = { p0: '#4aa3df', p1: '#f59322', gold: '#d9b260', parchment: '#efe3c6', ink: '#24170c' };

/* Resolução interna: o mundo do jogo continua 1280x720, mas o canvas tem os pixels físicos que a
 * tela consegue mostrar em tela cheia (tamanho da tela x densidade de pixels), até 3x.
 * A câmera aplica o zoom e as texturas são geradas na densidade certa para cada uso. */
TT.RES = (function () {
  try {
    var q = /[?&]res=([\d.]+)/.exec(location.search);
    if (q) return Math.max(1, Math.min(3, parseFloat(q[1])));
  } catch (e) { /* ignora */ }
  var dpr = globalThis.devicePixelRatio || 1;
  var sw = Math.max(screen.width || 1280, screen.height || 720);
  var sh = Math.min(screen.width || 1280, screen.height || 720);
  var fit = Math.min(sw / TT.W, sh / TT.H);
  var r = Math.ceil(fit * dpr * 4) / 4;
  return Math.max(1, Math.min(3, r));
})();
/* densidade de cada tipo de textura (fator sobre o tamanho-base) */
TT.Q = {
  mini: Math.max(1, TT.RES * 0.62),     /* carta da mesa: base 120x168, exibida a 62x87 */
  hand: Math.max(1, TT.RES * 0.5),      /* carta na mão: base 240x336, exibida a 96x134 */
  big: Math.max(1, TT.RES * 0.95),      /* inspeção: base 240x336, exibida a ~197x276 */
  avatar: Math.max(1, TT.RES * 0.7),
};
TT.SIZE = { boardW: 62, boardH: 87, handW: 96, handH: 134, prevW: 197, prevH: 276 };

/* Todo texto do Phaser nasce na resolução interna, para não borrar com o zoom da câmera */
(function () {
  var F = Phaser.GameObjects.GameObjectFactory.prototype;
  var orig = F.text;
  F.text = function (x, y, t, s) { var o = orig.call(this, x, y, t, s); o.setResolution(TT.RES); return o; };
})();

TT.setupCamera = function (scene) {
  scene.cameras.main.setZoom(TT.RES).centerOn(TT.W / 2, TT.H / 2);
};

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    TT.setupCamera(this);
    var self = this;
    var t = this.add.text(TT.W / 2, TT.H / 2, 'Embaralhando neurônios…', { fontFamily: 'Georgia, serif', fontSize: '24px', color: '#d9b260' }).setOrigin(0.5);
    var fonts = ['900 30px Cinzel', '700 15px Cinzel', '500 12px Alegreya', 'italic 11px Alegreya', '700 13px "Alegreya Sans"', '900 17px "Alegreya Sans"'];
    var loads = document.fonts ? Promise.all(fonts.map(function (f) { return document.fonts.load(f).catch(function () {}); })) : Promise.resolve();
    var timeout = new Promise(function (r) { setTimeout(r, 3000); });
    Promise.race([loads, timeout]).then(function () {
      t.destroy();
      var add = function (key, canvas) { if (self.textures.exists(key)) self.textures.remove(key); self.textures.addCanvas(key, canvas); };
      add('felt', TT.drawFelt(TT.W, TT.H, Math.min(TT.RES, 2)));
      add('back-full', TT.drawCardBack('full', TT.Q.big));
      add('back-hand', TT.drawCardBack('full', TT.Q.hand));
      add('back-mini', TT.drawCardBack('mini', TT.Q.mini));
      Object.keys(TT.TERRAINS).forEach(function (k) { add('terrain-' + k, TT.drawTerrainCard(k, TT.Q.big)); });
      [['gato', TT.CSS.p1], ['mc', TT.CSS.p1], ['ruido', TT.CSS.p1], ['p1', TT.CSS.p0], ['p2', TT.CSS.p1]].forEach(function (a) {
        add('avatar-' + a[0], TT.drawAvatar(a[0], a[1], TT.Q.avatar));
      });
      add('spark', TT.drawSpark(Math.min(TT.RES, 2)));
      var c = document.createElement('canvas');
      c.width = Math.round(TT.CARD_SIZES.FULL_W * TT.Q.big); c.height = Math.round(TT.CARD_SIZES.FULL_H * TT.Q.big);
      self.textures.addCanvas('preview', c);
      self.scene.start('Menu');
    });
  }
}

class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }
  create() {
    TT.setupCamera(this);
    this.add.image(0, 0, 'felt').setOrigin(0).setDisplaySize(TT.W, TT.H).setAlpha(0.95);
    var g = this.add.graphics();
    var cols = [3, 5, 5, 5, 4];
    this.pts = cols.map(function (n, c) {
      var a = [];
      for (var i = 0; i < n; i++) a.push({ x: 120 + c * 260, y: 360 + (i - (n - 1) / 2) * 120 });
      return a;
    });
    this.g = g;
    var deck = TT.DECKS.classico.build();
    TT.shuffle(deck, { seed: 99 });
    for (var i = 0; i < 9; i++) {
      var key = TT.texMini(this, deck[i], 'classico');
      var sp = this.add.image(Phaser.Math.Between(60, 1220), Phaser.Math.Between(60, 660), key).setDisplaySize(68, 95).setAlpha(0.28).setAngle(Phaser.Math.Between(-25, 25));
      this.tweens.add({ targets: sp, y: sp.y - Phaser.Math.Between(20, 60), angle: sp.angle + Phaser.Math.Between(-10, 10), duration: Phaser.Math.Between(3000, 6000), yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }
    TT.UI.closeAll();
    TT.UI.menu(TT.App);
  }
  update(time) {
    var g = this.g; g.clear();
    var pts = this.pts;
    for (var c = 0; c < pts.length - 1; c++) {
      pts[c].forEach(function (a, i) {
        pts[c + 1].forEach(function (b, j) {
          var w = 0.5 + 2.5 * Math.abs(Math.sin(i * 1.7 + j * 2.3 + c + time / 2400));
          g.lineStyle(w, (i + j + c) % 2 ? TT.COLORS.p0 : TT.COLORS.p1, 0.18);
          g.lineBetween(a.x, a.y, b.x, b.y);
        });
      });
    }
    pts.forEach(function (col) { col.forEach(function (p) { g.fillStyle(0xd9b260, 0.25); g.fillCircle(p.x, p.y, 9); }); });
  }
}

/* Texturas sob demanda (o baralho Power BI cria cartas novas no meio da mão) */
TT.texFull = function (scene, card, deck) {
  var key = 'f:' + deck + ':' + card.r + card.s;
  if (!scene.textures.exists(key)) scene.textures.addCanvas(key, TT.drawFullCard(card, deck, TT.Q.hand));
  return key;
};
TT.texFullBig = function (scene, card, deck) {
  var key = 'f:big:' + deck + ':' + card.r + card.s;
  if (!scene.textures.exists(key)) scene.textures.addCanvas(key, TT.drawFullCard(card, deck, Math.max(1, TT.RES * 0.55)));
  return key;
};
TT.texMini = function (scene, card, deck) {
  var key = 'm:' + deck + ':' + card.r + card.s;
  if (!scene.textures.exists(key)) scene.textures.addCanvas(key, TT.drawMiniCard(card, deck, TT.Q.mini));
  return key;
};
/* Inspeção: uma única textura de alta densidade, redesenhada a cada carta (cache em memória comum) */
TT._previewCache = new Map();
TT.texPreview = function (scene, card, deck) {
  var key = deck + ':' + card.r + card.s;
  var src = TT._previewCache.get(key);
  if (!src) {
    src = TT.drawFullCard(card, deck, TT.Q.big);
    TT._previewCache.set(key, src);
    if (TT._previewCache.size > 14) TT._previewCache.delete(TT._previewCache.keys().next().value);
  }
  var tex = scene.textures.get('preview');
  var ctx = tex.getContext();
  ctx.clearRect(0, 0, tex.width, tex.height);
  ctx.drawImage(src, 0, 0, tex.width, tex.height);
  tex.refresh();
  return 'preview';
};
/* Libera as cartas da mão da mão anterior (memória de GPU limitada em celulares) */
TT.releaseHandTextures = function (scene) {
  scene.textures.getTextureKeys().forEach(function (k) { if (k.indexOf('f:') === 0) scene.textures.remove(k); });
};

TT.BootScene = BootScene;
TT.MenuScene = MenuScene;
