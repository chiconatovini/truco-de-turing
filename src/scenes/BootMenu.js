/* Cena de carregamento (fontes + texturas base) e cena de fundo do menu. */
var TT = (globalThis.TT = globalThis.TT || {});

TT.W = 1280;
TT.H = 720;
TT.COLORS = { p0: 0x4aa3df, p1: 0xf59322, gold: 0xd9b260, wine: 0x7a1626, felt: 0x0f3b2a, parchment: 0xefe3c6, ink: 0x24170c };
TT.CSS = { p0: '#4aa3df', p1: '#f59322', gold: '#d9b260', parchment: '#efe3c6', ink: '#24170c' };

function makeFelt(w, h) {
  var c = document.createElement('canvas');
  c.width = w; c.height = h;
  var ctx = c.getContext('2d');
  var g = ctx.createRadialGradient(w * 0.48, h * 0.48, 60, w * 0.5, h * 0.5, w * 0.75);
  g.addColorStop(0, '#15503a'); g.addColorStop(0.6, '#0e3a2a'); g.addColorStop(1, '#06180f');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  var img = ctx.getImageData(0, 0, w, h), d = img.data;
  for (var i = 0; i < d.length; i += 4) {
    var n = (Math.random() - 0.5) * 14;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    var self = this;
    var t = this.add.text(TT.W / 2, TT.H / 2, 'Embaralhando neurônios…', { fontFamily: 'Georgia, serif', fontSize: '24px', color: '#d9b260' }).setOrigin(0.5);
    var fonts = ['900 30px Cinzel', '700 15px Cinzel', '500 12px Alegreya', 'italic 11px Alegreya', '700 13px "Alegreya Sans"', '900 17px "Alegreya Sans"'];
    var loads = document.fonts ? Promise.all(fonts.map(function (f) { return document.fonts.load(f).catch(function () {}); })) : Promise.resolve();
    var timeout = new Promise(function (r) { setTimeout(r, 3000); });
    Promise.race([loads, timeout]).then(function () {
      t.destroy();
      self.textures.addCanvas('felt', makeFelt(TT.W, TT.H));
      self.textures.addCanvas('back-full', TT.drawCardBack(TT.CARD_SIZES.FULL_W, TT.CARD_SIZES.FULL_H));
      self.textures.addCanvas('back-mini', TT.drawCardBack(TT.CARD_SIZES.MINI_W, TT.CARD_SIZES.MINI_H));
      Object.keys(TT.TERRAINS).forEach(function (k) { self.textures.addCanvas('terrain-' + k, TT.drawTerrainCard(k)); });
      [['gato', TT.CSS.p1], ['mc', TT.CSS.p1], ['ruido', TT.CSS.p1], ['p1', TT.CSS.p0], ['p2', TT.CSS.p1]].forEach(function (a) {
        self.textures.addCanvas('avatar-' + a[0], TT.drawAvatar(a[0], a[1]));
      });
      var g = self.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 1); g.fillCircle(6, 6, 6); g.generateTexture('spark', 12, 12); g.destroy();
      self.scene.start('Menu');
    });
  }
}

class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }
  create() {
    this.add.image(0, 0, 'felt').setOrigin(0).setAlpha(0.9);
    /* rede neural de fundo, ao estilo do Playground */
    var g = this.add.graphics();
    var cols = [3, 5, 5, 5, 4];
    var pts = cols.map(function (n, c) {
      var a = [];
      for (var i = 0; i < n; i++) a.push({ x: 120 + c * 260, y: 360 + (i - (n - 1) / 2) * 120 });
      return a;
    });
    this.pts = pts; this.g = g;
    /* cartas flutuando */
    var deck = TT.DECKS.classico.build();
    TT.shuffle(deck, { seed: 99 });
    this.floaters = [];
    for (var i = 0; i < 9; i++) {
      var card = deck[i];
      var key = TT.texMini(this, card, 'classico');
      var sp = this.add.image(Phaser.Math.Between(60, 1220), Phaser.Math.Between(60, 660), key).setScale(0.55).setAlpha(0.22).setAngle(Phaser.Math.Between(-25, 25));
      this.tweens.add({ targets: sp, y: sp.y - Phaser.Math.Between(20, 60), angle: sp.angle + Phaser.Math.Between(-10, 10), duration: Phaser.Math.Between(3000, 6000), yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.floaters.push(sp);
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

/* Texturas sob demanda para cada carta (o baralho Power BI cria cartas novas no meio da mão) */
TT.texFull = function (scene, card, deck) {
  var key = 'f:' + deck + ':' + card.r + card.s;
  if (!scene.textures.exists(key)) scene.textures.addCanvas(key, TT.drawFullCard(card, deck));
  return key;
};
TT.texMini = function (scene, card, deck) {
  var key = 'm:' + deck + ':' + card.r + card.s;
  if (!scene.textures.exists(key)) scene.textures.addCanvas(key, TT.drawMiniCard(card, deck));
  return key;
};

TT.BootScene = BootScene;
TT.MenuScene = MenuScene;
