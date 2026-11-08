/* A mesa: tabuleiro de camadas, mãos, painel de placar, truco, animações e fluxo de turnos. */
var TT = (globalThis.TT = globalThis.TT || {});

(function () {
  /* tamanhos no mundo do jogo (1280x720); a densidade real vem de TT.Q */
  var fitBoard = function (sp) { sp.setDisplaySize(TT.SIZE.boardW, TT.SIZE.boardH); sp.baseSX = sp.scaleX; return sp; };
  var ROW_GAP = 95, BOARD_CY = 334;
  var colX = function (l) { return 318 + l * 97; };
  var rowY = function (l, i) { var n = TT.LAYER_SIZES[l]; return BOARD_CY + (i - (n - 1) / 2) * ROW_GAP; };
  var PCOL = [TT.COLORS.p0, TT.COLORS.p1];
  var PCSS = [TT.CSS.p0, TT.CSS.p1];
  var KIND_COLOR = { reveal: 0xf6dc8f, tunagem: 0x7fe08a, overfit: 0xffa24a, earlystop: 0xff4d5e, stackoverflow: 0xff4dd2, dropout: 0x6fe7ff };
  var STATUS = { building: 'em construção', done: 'chegou à saída', earlystop: 'early stop', overflow: 'stack overflow' };
  var F_DISPLAY = 'Cinzel, Georgia, serif', F_BODY = 'Spectral, Georgia, serif', F_UI = F_BODY;
  /* geometria dos painéis laterais */
  var LP = { x: 8, y: 80, w: 244, h: 632 };
  var RP = { x: 962, y: 8, w: 310, h: 704 };
  /* texto de uma linha que encolhe até caber; corta com reticências se ainda assim não couber */
  function fitLine(t, text, base, maxW, min) {
    var key = text + '|' + base + '|' + maxW;
    if (t._fit === key) return t;
    t._fit = key;
    t.setText(text);
    var s = base;
    t.setFontSize(s);
    while (t.width > maxW && s > min) { s -= 0.5; t.setFontSize(s); }
    if (t.width > maxW) {
      var cut = text;
      while (cut.length > 1 && t.width > maxW) { cut = cut.slice(0, -1); t.setText(cut.trimEnd() + '\u2026'); }
    }
    return t;
  }
  /* bloco de texto com quebra de linha que encolhe até caber na altura */
  function fitBox(t, text, base, maxW, maxH, min) {
    var key = text + '|' + base + '|' + maxW + '|' + maxH;
    if (t._fit === key) return t;
    t._fit = key;
    var s = base;
    t.setWordWrapWidth(maxW);
    t.setFontSize(s);
    t.setText(text);
    while (t.height > maxH && s > min) { s -= 0.5; t.setFontSize(s); }
    return t;
  }

  class GameScene extends Phaser.Scene {
    constructor() { super('Game'); }

    create() {
      this.app = TT.App;
      this.opts = Object.assign({}, this.app.opts);
      this.hot = this.opts.bot === 'hotseat';
      this.match = TT.newMatch(this.opts.target);
      this.sessionSeen = this.app.sessionSeen;

      TT.setupCamera(this);
      TT.addFelt(this);
      this.drawStatic();
      this.connG = this.add.graphics().setDepth(2);
      this.emptyG = this.add.graphics().setDepth(1);
      this.hlG = this.add.graphics().setDepth(5);
      this.handG = this.add.graphics().setDepth(11);
      this.chartG = this.add.graphics().setDepth(6);
      this.createHud();
      var self = this;
      this.input.keyboard.on('keydown-ESC', function () { self.cancelSelection(); });
      this.events.once('shutdown', function () { self.ended = true; });
      var go = function () { self.startHand(); };
      if (!this.app.store.seenTutorial) TT.UI.rules(this.app, go); else go();
    }

    /* ------------------------------------------------------------------ cenário fixo */
    drawStatic() {
      var g = this.add.graphics().setDepth(0);
      /* painéis laterais */
      [[LP.x, LP.y, LP.w, LP.h], [RP.x, RP.y, RP.w, RP.h]].forEach(function (p) {
        g.fillStyle(0x000000, 0.35); g.fillRoundedRect(p[0] + 2, p[1] + 4, p[2], p[3], 12);
        g.fillStyle(0x07150e, 0.82); g.fillRoundedRect(p[0], p[1], p[2], p[3], 12);
        g.lineStyle(1.5, TT.COLORS.gold, 0.55); g.strokeRoundedRect(p[0], p[1], p[2], p[3], 12);
        g.lineStyle(1, TT.COLORS.gold, 0.18); g.strokeRoundedRect(p[0] + 4, p[1] + 4, p[2] - 8, p[3] - 8, 9);
      });
      /* divisórias do painel esquerdo */
      g.lineStyle(1, TT.COLORS.gold, 0.25);
      [440, 568].forEach(function (y) { g.lineBetween(LP.x + 18, y, LP.x + LP.w - 18, y); });
      /* colunas das camadas */
      for (var l = 0; l < TT.N_LAYERS; l++) {
        var imm = l === 0 || l === TT.OUTPUT;
        var n = TT.LAYER_SIZES[l];
        var top = rowY(l, 0) - 52, bot = rowY(l, n - 1) + 52;
        g.fillStyle(imm ? 0x2a1a08 : 0x000000, imm ? 0.35 : 0.18);
        g.fillRoundedRect(colX(l) - 42, top, 84, bot - top, 10);
        if (imm) { g.lineStyle(1.5, 0xe8a7b8, 0.5); g.strokeRoundedRect(colX(l) - 42, top, 84, bot - top, 10); }
        var lbl = this.add.text(colX(l), 86, TT.layerName(l).toUpperCase(), { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '13px', color: imm ? '#f3c3cf' : '#e8d6a8', letterSpacing: 1 }).setOrigin(0.5).setDepth(1);
        fitLine(lbl, lbl.text, 13, 90, 10);
        if (imm) this.add.text(colX(l), top - 11, 'imune a ações', { fontFamily: F_BODY, fontStyle: 'italic', fontSize: '11.5px', color: '#f3c3cf' }).setOrigin(0.5).setDepth(1);
      }
      this.add.text(LP.x + LP.w / 2, 98, 'INSPEÇÃO', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '12px', color: '#e8d6a8', letterSpacing: 2 }).setOrigin(0.5).setDepth(7);
    }

    /* Botão com textura própria (nítido e igual em WebGL e Canvas) e rótulo que se ajusta à largura */
    makeButton(x, y, w, h, label, cb, opt) {
      opt = opt || {};
      var scene = this, variant = opt.variant || 'gold';
      var key = function (state) {
        var k = 'btn:' + variant + ':' + w + 'x' + h + ':' + state;
        if (!scene.textures.exists(k)) scene.textures.addCanvas(k, TT.drawButton(w, h, Math.min(TT.RES, 2.5), variant, state));
        return k;
      };
      var colors = { gold: '#2a1606', wine: '#fff0e0', stone: '#f6ecd6' };
      var c = this.add.container(x, y).setDepth(8);
      var bg = this.add.image(0, 0, key('normal')).setDisplaySize(w + TT.BTN_PAD * 2, h + TT.BTN_PAD * 2);
      var base = opt.size || 14;
      var t = this.add.text(0, -0.5, label, { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: base + 'px', color: colors[variant], align: 'center' }).setOrigin(0.5);
      c.add([bg, t]);
      c.setSize(w, h);
      c.setInteractive({ useHandCursor: true });
      c.enabled = true;
      var paint = function (state) { bg.setTexture(key(state)).setDisplaySize(w + TT.BTN_PAD * 2, h + TT.BTN_PAD * 2); };
      c.on('pointerover', function () { if (c.enabled) paint('hover'); });
      c.on('pointerout', function () { paint(c.enabled ? 'normal' : 'off'); });
      c.on('pointerdown', function () { if (c.enabled) { TT.Sfx.select(); cb(); } });
      c.label = t;
      c.setLabel = function (s) { fitLine(t, s, base, w - 18, 9); return c; };
      c.setEnabled = function (on) {
        if (c.enabled === on) return c;
        c.enabled = on;
        paint(on ? 'normal' : 'off');
        t.setColor(on ? colors[variant] : variant === 'wine' ? '#a77a7a' : '#8c7f63');
        return c;
      };
      c.setLabel(label);
      return c;
    }

    createHud() {
      var self = this;
      var tx = function (x, y, s, style) { return self.add.text(x, y, s, Object.assign({ fontFamily: F_BODY, fontSize: '13px', color: '#efe3c6' }, style || {})).setDepth(7); };
      var h = (this.hud = {});
      /* adversário (topo esquerdo) */
      h.oppAvatar = this.add.image(44, 40, 'avatar-gradiente').setDisplaySize(64, 64).setDepth(7);
      h.oppName = tx(84, 23, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '18px', color: '#f6dc8f' }).setOrigin(0, 0.5);
      h.oppSub = tx(84, 50, '', { fontStyle: 'italic', fontSize: '13px', color: '#cdbf9e' }).setOrigin(0, 0.5);
      h.bubble = this.add.container(700, 40).setDepth(30).setVisible(false);
      h.bubbleBg = this.add.graphics();
      h.bubbleText = this.add.text(0, 0, '', { fontFamily: F_BODY, fontStyle: 'italic', fontSize: '15px', color: '#24170c', wordWrap: { width: 230 }, align: 'center' }).setOrigin(0.5);
      h.bubble.add([h.bubbleBg, h.bubbleText]);
      /* inspeção */
      var cx = LP.x + LP.w / 2;
      h.preview = this.add.image(cx, 250, 'terrain-' + this.opts.terrain).setDisplaySize(TT.SIZE.prevW, TT.SIZE.prevH).setDepth(7);
      h.previewNote = tx(cx, 394, '', { fontStyle: 'italic', fontSize: '12px', color: '#d6c8a6', align: 'center', wordWrap: { width: LP.w - 30 }, lineSpacing: 0 }).setOrigin(0.5, 0);
      /* pilhas */
      h.limbo = this.add.image(LP.x + 70, 474, 'back-mini').setDisplaySize(42, 59).setDepth(7).setInteractive();
      h.limboTxt = tx(LP.x + 70, 509, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '10.5px', color: '#e8d6a8', letterSpacing: 1 }).setOrigin(0.5, 0);
      h.grave = this.add.image(LP.x + LP.w - 70, 474, 'back-mini').setDisplaySize(42, 59).setDepth(7).setInteractive();
      h.graveTxt = tx(LP.x + LP.w - 70, 509, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '10.5px', color: '#e8d6a8', letterSpacing: 1 }).setOrigin(0.5, 0);
      h.limbo.on('pointerover', function () { self.showPreview('back-full', 'Limbo: cartas queimadas no início (ruído). Só voltam por transfer learning.'); });
      h.grave.on('pointerover', function () {
        var top = self.st && self.st.graveyard[self.st.graveyard.length - 1];
        self.showPreview(top ? TT.texPreview(self, top, self.st.cfg.deck) : 'back-full', 'Cemitério: ' + (self.st ? self.st.graveyard.length : 0) + ' carta(s) fora de jogo. Mostrando a última.');
      });
      h.terrainTxt = tx(cx, 528, '', { fontSize: '12px', align: 'center', color: '#d6c8a6', wordWrap: { width: LP.w - 30 } }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
      h.terrainTxt.on('pointerover', function () { self.showPreview('terrain-' + self.opts.terrain, TT.TERRAINS[self.opts.terrain].name + ': ' + TT.TERRAINS[self.opts.terrain].short); });
      /* eu (rodapé esquerdo) */
      h.meAvatar = this.add.image(LP.x + 26, 592, 'avatar-p1').setDisplaySize(36, 36).setDepth(7);
      h.meName = tx(LP.x + 52, 592, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '15px', color: '#bfe2fa' }).setOrigin(0, 0.5);
      h.hint = tx(LP.x + 14, 616, '', { fontSize: '13.5px', color: '#efe3c6', wordWrap: { width: LP.w - 28 }, lineSpacing: 1 });

      /* painel direito: placar */
      var rx = RP.x + 12, rw = RP.w - 24, rc = RP.x + RP.w / 2;
      h.handTitle = tx(rc, 28, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '16px', color: '#f6dc8f', letterSpacing: 1 }).setOrigin(0.5);
      h.subTitle = tx(rc, 50, '', { fontStyle: 'italic', fontSize: '12.5px', color: '#cdbf9e' }).setOrigin(0.5);
      h.blocks = [0, 1].map(function (i) {
        var y = 66 + i * 86;
        var b = { y: y, x: rx, w: rw, h: 80 };
        b.g = self.add.graphics().setDepth(6);
        b.name = tx(rx + 16, y + 15, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '15px' }).setOrigin(0, 0.5);
        b.status = tx(rx + 16, y + 34, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '9.5px', color: '#e0cc9a', letterSpacing: 0.8 }).setOrigin(0, 0.5);
        b.detail = tx(rx + 16, y + 51, '', { fontSize: '12px', color: '#cdbf9e' }).setOrigin(0, 0.5);
        b.tentos = tx(rx + 16 + 12 * 10 + 4, y + 67, '', { fontSize: '11px', color: '#cdbf9e' }).setOrigin(0, 0.5);
        b.scoreLbl = tx(rx + rw - 12, y + 14, 'SOMA DA REDE', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '8.5px', color: '#9a8c6c', letterSpacing: 1 }).setOrigin(1, 0.5);
        b.score = tx(rx + rw - 12, y + 47, '0', { fontFamily: F_DISPLAY, fontStyle: '900', fontSize: '36px' }).setOrigin(1, 0.5);
        return b;
      });
      h.truco = this.makeButton(rc, 262, rw, 44, 'TRUCO!', function () { self.humanTruco(); }, { variant: 'wine', size: 20 });
      h.chartLabel = tx(rx, 298, 'CURVA DE TREINO', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '10px', color: '#e0cc9a', letterSpacing: 1 }).setOrigin(0, 0.5);
      h.chartSub = tx(rx + rw, 298, 'soma da rede por turno', { fontStyle: 'italic', fontSize: '11px', color: '#9a8c6c' }).setOrigin(1, 0.5);
      h.chartMax = tx(rx + 6, 316, '', { fontSize: '10px', color: '#9a8c6c' }).setOrigin(0, 0.5);
      h.log = tx(rx, 396, '', { fontSize: '12px', color: '#dccfb2', wordWrap: { width: rw }, lineSpacing: 2 });
      var bw = (rw - 8) / 2, c1 = rx + bw / 2, c2 = rx + rw - bw / 2;
      h.btnDrop = this.makeButton(c1, 590, bw, 38, 'Dropout', function () { self.toggleDropout(); }, { size: 14 });
      h.btnTransfer = this.makeButton(c2, 590, bw, 38, 'Transfer', function () { self.humanTransfer(); }, { size: 14 });
      h.btnPass = this.makeButton(c1, 634, bw, 38, 'Passar a vez', function () { self.humanPass(); }, { size: 14 });
      h.btnRules = this.makeButton(c2, 634, bw, 38, 'Regras', function () { TT.UI.rules(null); }, { size: 14 });
      var sw = (rw - 12) / 3;
      h.btnCodex = this.makeButton(rx + sw / 2, 677, sw, 32, 'Grimório', function () { TT.UI.codex(self.app); }, { size: 12, variant: 'stone' });
      h.btnSound = this.makeButton(rc, 677, sw, 32, 'Som', function () { self.app.toggleSound(); self.refreshSoundBtn(); }, { size: 12, variant: 'stone' });
      h.btnMenu = this.makeButton(rx + rw - sw / 2, 677, sw, 32, 'Menu', function () { self.askMenu(); }, { size: 12, variant: 'stone' });
      this.refreshSoundBtn();
    }

    refreshSoundBtn() { this.hud.btnSound.setLabel(TT.Sfx.isMuted() ? 'Som: não' : 'Som: sim'); }
    setHint(text) { fitBox(this.hud.hint, text, 13.5, LP.w - 28, 712 - 616 - 8, 10.5); }

    /* ------------------------------------------------------------------ mão nova */
    startHand() {
      var self = this;
      this.ended = false;
      this.busy = true;
      this.mode = 'idle';
      this.sel = [];
      this.hoverHint = null;
      this.vanishSeen = [false, false];
      this.trucoChecked = -1;
      if (this.boardObjs) this.boardObjs.forEach(function (o) { o.destroy(); });
      (this.handSprites || []).forEach(function (o) { o.destroy(); });
      this.handSprites = [];
      TT.releaseHandTextures(this);
      this.boardObjs = [];
      var players = this.hot
        ? [{ name: 'Jogador 1', kind: 'human' }, { name: 'Jogador 2', kind: 'human' }]
        : [{ name: 'Você', kind: 'human' }, { name: TT.BOTS[this.opts.bot].name, kind: 'bot', bot: this.opts.bot }];
      this.st = TT.newGame({ deck: this.opts.deck, terrain: this.opts.terrain, starter: this.opts.starter, players: players });
      this.viewer = 0;
      this.slotSprites = {};
      this.st.layers.forEach(function (layer) {
        layer.forEach(function (slot) {
          var sp = self.add.image(colX(slot.layer), rowY(slot.layer, slot.idx), 'back-mini').setDepth(3).setInteractive({ useHandCursor: true });
          fitBoard(sp);
          sp.slotId = slot.id;
          sp.on('pointerdown', function () { self.onSlotClick(slot.id); });
          sp.on('pointerover', function () { self.onSlotHover(slot.id, true); });
          sp.on('pointerout', function () { self.onSlotHover(slot.id, false); });
          var badge = self.add.text(sp.x - 18, sp.y + 33, '', { fontFamily: F_BODY, fontStyle: '800', fontSize: '12px', color: '#24170c', backgroundColor: '#f6dc8f', padding: { x: 4, y: 1 } }).setOrigin(0.5).setDepth(4);
          var mem = self.add.text(sp.x, sp.y + 32, '', { fontFamily: F_BODY, fontStyle: '700', fontSize: '11px', color: '#f6dc8f', backgroundColor: 'rgba(0,0,0,.65)', padding: { x: 3, y: 1 } }).setOrigin(0.5).setDepth(4);
          self.slotSprites[slot.id] = { sp: sp, badge: badge, mem: mem };
          self.boardObjs.push(sp, badge, mem);
          /* animação de distribuição */
          sp.setAlpha(0); sp.y -= 30;
          self.tweens.add({ targets: sp, alpha: 1, y: sp.y + 30, duration: 260, delay: slot.layer * 40 + slot.idx * 25, ease: 'Back.out' });
        });
      });
      this.handSprites = [];
      this.oppSprites = [];
      this.hud.preview.setTexture('terrain-' + this.opts.terrain);
      fitBox(this.hud.previewNote, 'Passe o cursor ou toque numa carta para inspecioná-la.', 12, LP.w - 30, 40, 9.5);
      this.st.events.splice(0);
      this.renderAll();
      if (this.opts.terrain !== 'neutro') this.codexToast('terrenos');
      this.time.delayedCall(700, function () { self.advance(); });
    }

    /* ------------------------------------------------------------------ helpers */
    me() { return this.viewer; }
    other(p) { return 1 - p; }
    topPlayer() { return this.viewer < 0 ? 1 : this.other(this.viewer); }
    bottomPlayer() { return this.viewer < 0 ? 0 : this.viewer; }
    isHumanTurn() {
      var st = this.st;
      return !this.busy && !this.ended && st.phase === 'play' && st.players[st.current].kind === 'human' && st.current === this.viewer && !this.match.pending;
    }
    avatarKey(p) {
      var pl = this.st.players[p];
      if (pl.kind === 'bot') return 'avatar-' + TT.BOTS[pl.bot].avatar;
      return p === 0 ? 'avatar-p1' : 'avatar-p2';
    }

    showPreview(key, note) { this.hud.preview.setTexture(key).setDisplaySize(TT.SIZE.prevW, TT.SIZE.prevH); fitBox(this.hud.previewNote, note || '', 12, LP.w - 30, 40, 9.5); }

    /* ------------------------------------------------------------------ render */
    renderAll() {
      var self = this, st = this.st, deck = st.cfg.deck;
      this.scores = st.players.map(function (_, p) { return TT.scoreNetwork(st, p); });
      this.computeTargets();
      /* mesa */
      this.emptyG.clear();
      st.layers.forEach(function (layer) {
        layer.forEach(function (slot) {
          var o = self.slotSprites[slot.id];
          if (slot.removed) {
            o.sp.setVisible(false); o.badge.setVisible(false); o.mem.setVisible(false);
            self.emptyG.lineStyle(1.5, 0xd9b260, 0.28);
            self.emptyG.strokeRoundedRect(o.sp.x - 31, o.sp.y - 43, 62, 87, 6);
            return;
          }
          o.sp.setVisible(true);
          if (slot.faceUp) {
            o.sp.setTexture(TT.texMini(self, slot.cards[0], deck)); fitBoard(o.sp);
            o.mem.setVisible(false);
          } else {
            o.sp.setTexture('back-mini'); fitBoard(o.sp);
            o.mem.setVisible(slot.known).setText(slot.known ? 'lembra: ' + TT.cardLabel(slot.cards[0]) : '');
          }
          o.badge.setVisible(slot.cards.length > 1).setText('×' + slot.cards.length);
        });
      });
      this.renderHands();
      this.renderHud();
    }

    renderHands() {
      var self = this, st = this.st, deck = st.cfg.deck;
      this.handSprites.forEach(function (s) { s.destroy(); });
      this.oppSprites.forEach(function (s) { s.destroy(); });
      this.handSprites = []; this.oppSprites = [];
      var bp = this.bottomPlayer();
      var showHand = this.viewer >= 0;
      var hand = st.players[bp].hand;
      var n = hand.length;
      var spacing = Math.min(104, 640 / Math.max(1, n));
      hand.forEach(function (card, i) {
        var x = 610 + (i - (n - 1) / 2) * spacing;
        var selected = self.sel.indexOf(card.id) >= 0;
        var y = selected ? 632 : 652;
        var sp = self.add.image(x, y, showHand ? TT.texFull(self, card, deck) : 'back-hand').setDisplaySize(TT.SIZE.handW, TT.SIZE.handH).setDepth(10 + i);
        sp.baseY = y;
        if (showHand) {
          sp.setInteractive({ useHandCursor: true });
          sp.on('pointerover', function () { sp.y = sp.baseY - 8; self.showPreview(TT.texPreview(self, card, deck), self.handCardNote(card)); });
          sp.on('pointerout', function () { sp.y = sp.baseY; });
          sp.on('pointerdown', function () { self.onHandClick(card.id); });
        }
        sp.cardId = card.id;
        self.handSprites.push(sp);
      });
      var tp = this.topPlayer();
      var on = st.players[tp].hand.length;
      for (var i = 0; i < on; i++) {
        var o = this.add.image(560 + (i - (on - 1) / 2) * 34, 40, 'back-mini').setDisplaySize(41, 57).setDepth(7).setAngle((i - (on - 1) / 2) * 4);
        this.oppSprites.push(o);
      }
      /* destaque das cartas selecionadas */
      this.handG.clear();
      this.handSprites.forEach(function (sp) {
        if (self.sel.indexOf(sp.cardId) >= 0) {
          var col = self.mode === 'dropout-pay' ? KIND_COLOR.dropout : 0xf6dc8f;
          self.handG.lineStyle(4, col, 1);
          self.handG.strokeRoundedRect(sp.x - 50, sp.y - 69, 100, 138, 10);
        }
      });
    }

    handCardNote(card) {
      var st = this.st, me = this.viewer;
      var targets = TT.stackTargets(st).filter(function (s) { return TT.canStack(st, me, s.id, [card.id]) || (s.cards[0].r === card.r); });
      if (!targets.length) return 'Sem alvo para esta carta agora. Guarde para tunar, atacar ou pagar dropouts.';
      return 'Clique para selecionar. Mesma figura de: ' + targets.map(function (s) { return TT.cardLabel(s.cards[0]) + (s.owner === me ? ' (sua)' : ' (adversário)'); }).join(', ') + '.';
    }

    renderHud() {
      var st = this.st, h = this.hud, m = this.match, self = this;
      var tp = this.topPlayer(), bp = this.bottomPlayer();
      h.oppAvatar.setTexture(this.avatarKey(tp)).setDisplaySize(64, 64);
      fitLine(h.oppName.setColor(PCSS[tp]), st.players[tp].name, 18, 300, 12);
      if (!this.thinkingNow) fitLine(h.oppSub, st.players[tp].kind === 'bot' ? 'Nível ' + TT.BOTS[st.players[tp].bot].level.toLowerCase() + ' · ' + TT.BOTS[st.players[tp].bot].method : 'Aguardando a vez', 13, 300, 10);
      h.meAvatar.setTexture(this.avatarKey(bp)).setDisplaySize(36, 36);
      fitLine(h.meName.setColor(PCSS[bp]), st.players[bp].name, 15, LP.w - 66, 11);
      fitLine(h.handTitle, 'MÃO ' + (m.hand + 1) + ' · VALE ' + m.value + (m.value === 1 ? ' TENTO' : ' TENTOS'), 16, RP.w - 28, 11);
      fitLine(h.subTitle, m.target <= 1 ? 'Mão única, sem truco' : TT.maoDeOnze(m) ? 'Mão de onze: ninguém pode trucar' : 'Partida até ' + m.target + ' tentos', 12.5, RP.w - 28, 10);
      [tp, bp].forEach(function (p, i) {
        var b = h.blocks[i], pl = st.players[p];
        var active = st.phase === 'play' && st.current === p;
        b.g.clear();
        b.g.fillStyle(active ? 0x12261b : 0x000000, active ? 0.95 : 0.3); b.g.fillRoundedRect(b.x, b.y, b.w, b.h, 8);
        b.g.fillStyle(PCOL[p], 1); b.g.fillRoundedRect(b.x, b.y, active ? 7 : 5, b.h, { tl: 8, bl: 8, tr: 0, br: 0 });
        b.g.lineStyle(active ? 2 : 1, active ? PCOL[p] : 0xd9b260, active ? 1 : 0.22); b.g.strokeRoundedRect(b.x, b.y, b.w, b.h, 8);
        fitLine(b.name.setColor(PCSS[p]), pl.name, 15, b.w - 110, 10);
        var stuck = pl.status === 'building' && st.phase === 'play' && TT.revealTargets(st, p).length === 0;
        fitLine(b.status, ((stuck ? 'travada' : STATUS[pl.status]) + ' · camada ' + Math.max(0, pl.path.length - 1) + '/6').toUpperCase(), 9.5, b.w - 110, 7.5);
        fitLine(b.detail, 'Mão ' + pl.hand.length + ' · Dropouts ' + pl.dropouts + (pl.transferUsed ? ' · TL usado' : '') + (active ? ' · na vez' : ''), 12, b.w - 110, 9);
        /* tentos como grãos de feijão do truco */
        if (m.target > 1) {
          var n = Math.min(12, m.target);
          for (var k = 0; k < n; k++) {
            var px = b.x + 20 + k * 10, py = b.y + 67;
            if (k < m.tentos[p]) { b.g.fillStyle(PCOL[p], 1); b.g.fillCircle(px, py, 3.4); b.g.lineStyle(1, 0xffffff, 0.5); b.g.strokeCircle(px, py, 3.4); }
            else { b.g.lineStyle(1, 0xd9b260, 0.45); b.g.strokeCircle(px, py, 3); }
          }
          b.tentos.setVisible(true);
          fitLine(b.tentos, m.tentos[p] + (m.tentos[p] === 1 ? ' tento' : ' tentos'), 11, b.w - 150, 8.5);
        } else b.tentos.setVisible(false);
        var sc = self.scores[p];
        fitLine(b.score.setColor(sc.vanishing ? '#ff7b88' : '#f6ecd6'), String(sc.total), 36, 92, 20);
      });
      fitLine(h.limboTxt, 'LIMBO · ' + st.limbo.length, 10.5, 100, 8);
      fitLine(h.graveTxt, 'CEMITÉRIO · ' + st.graveyard.length, 10.5, 110, 8);
      var top = st.graveyard[st.graveyard.length - 1];
      h.grave.setTexture(top ? TT.texMini(this, top, st.cfg.deck) : 'back-mini').setDisplaySize(42, 59).setAlpha(top ? 1 : 0.25);
      var tline = TT.TERRAINS[st.cfg.terrain].name + ' · baralho ' + TT.DECKS[st.cfg.deck].name;
      var extra = [];
      if (st.cfg.terrain !== 'neutro') extra.push('Rodada ' + st.round);
      if (st.cfg.terrain === 'oceano' && st.wind) extra.push('vento: ' + TT.SUIT_INFO[st.wind].name + ' vale dobro');
      fitBox(h.terrainTxt, tline + (extra.length ? '\n' + extra.join(' · ') : ''), 12, LP.w - 30, 34, 9);
      /* botões */
      var my = this.isHumanTurn();
      var me = this.viewer;
      h.btnDrop.setEnabled(my && TT.trailingHidden(st, me) > 0 && st.players[me].hand.length > 0);
      h.btnDrop.setLabel(this.mode === 'dropout' || this.mode === 'dropout-pay' ? 'Cancelar' : 'Dropout');
      h.btnTransfer.setEnabled(my && !!TT.transferRank(st, me));
      h.btnPass.setEnabled(my && TT.canPass(st, me));
      h.truco.setEnabled(my && TT.canTruco(m, me));
      var nxt = TT.nextStake(m.value);
      h.truco.setLabel(m.target <= 1 ? 'SEM TRUCO' : TT.maoDeOnze(m) ? 'MÃO DE ONZE' : nxt ? TT.TRUCO_SHOUT[nxt] : 'VALE TUDO');
      /* registro: as linhas mais recentes que couberem */
      var lines = st.log.slice(-10);
      h.log.setFontSize(12).setWordWrapWidth(RP.w - 24);
      h.log.setText(lines.join('\n'));
      while (lines.length > 1 && h.log.height > 172) { lines.shift(); h.log.setText(lines.join('\n')); }
      this.renderChart();
      this.setHint(this.hoverHint || this.hintText());
    }

    renderChart() {
      var g = this.chartG, hist = this.st.history;
      g.clear();
      var x0 = RP.x + 12, w = RP.w - 24, top = 308, hgt = 72, y0 = top + hgt;
      g.fillStyle(0x000000, 0.3); g.fillRoundedRect(x0, top, w, hgt, 6);
      g.lineStyle(1, 0xd9b260, 0.2); g.strokeRoundedRect(x0, top, w, hgt, 6);
      var max = 40;
      hist.forEach(function (r) { r.forEach(function (v) { max = Math.max(max, v); }); });
      max = Math.ceil(max / 20) * 20;
      this.hud.chartMax.setText(max + ' pts');
      var ix = x0 + 8, iw = w - 16, ib = y0 - 8, ih = hgt - 20;
      g.lineStyle(1, 0xd9b260, 0.15);
      [0.5, 1].forEach(function (f) { g.lineBetween(ix, ib - ih * f, ix + iw, ib - ih * f); });
      var nPts = Math.max(2, hist.length);
      [0, 1].forEach(function (p) {
        g.lineStyle(2.5, PCOL[p], 1);
        g.beginPath();
        hist.forEach(function (r, i) {
          var x = ix + (i / (nPts - 1)) * iw, y = ib - (r[p] / max) * ih;
          if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
        });
        g.strokePath();
        var last = hist[hist.length - 1];
        if (last) { g.fillStyle(PCOL[p], 1); g.fillCircle(ix + ((hist.length - 1) / (nPts - 1)) * iw, ib - (last[p] / max) * ih, 3.5); }
      });
    }

    hintText() {
      var st = this.st, me = this.viewer;
      if (this.ended) return 'Fim da mão.';
      if (this.match.pending) return 'Truco na mesa! Aguardando resposta.';
      if (st.phase === 'starter') {
        if (this.mode === 'starter') return st.cfg.starter === 'revela-descarta'
          ? 'Escolha uma carta da mão para revelar. A mais alta começa. Ela vai para o cemitério.'
          : 'Escolha uma carta da mão para revelar. A mais alta começa. Ela volta para a sua mão.';
        return 'Decidindo quem começa…';
      }
      var cur = st.players[st.current];
      if (!this.isHumanTurn()) return cur.kind === 'bot' ? cur.name + ' está pensando…' : st.current === this.viewer ? 'Sua vez.' : 'Vez de ' + cur.name + '.';
      if (this.mode === 'dropout') return 'Dropout: clique no neurônio oculto da sua rede até onde quer desfazer. Cada camada custa 1 carta da mão. Esc cancela.';
      if (this.mode === 'dropout-pay') return 'Escolha ' + this.dropN + ' carta(s) da mão para pagar o dropout (' + this.sel.length + '/' + this.dropN + '). Esc cancela.';
      if (this.sel.length) {
        var rank = this.selRank();
        var n = Object.keys(this.targets).length;
        return n ? 'Clique num neurônio destacado para usar ' + this.sel.length + ' carta(s) ' + rank + '. Verde é tunagem; laranja e vermelho atacam.'
          : 'Nenhum neurônio aceita ' + rank + ' agora. Ações só valem no último neurônio oculto de uma rede, com a mesma figura.';
      }
      var pl = st.players[me];
      if (pl.status !== 'building') return 'Sua rede está finalizada. Ainda dá para atacar a fronteira do adversário com cartas da mão, ou passar a vez.';
      var rt = TT.revealTargets(st, me);
      if (!rt.length) return 'Não há neurônio livre na camada ' + TT.layerName(pl.path.length) + '. Faça dropout para recuar ou passe a vez.';
      return 'Sua vez: ative um neurônio da camada ' + TT.layerName(pl.path.length) + ' (dourado) ou selecione cartas da mão para uma ação.';
    }

    selRank() {
      var hand = this.st.players[this.viewer].hand;
      var c = hand.find(function (x) { return x.id === this.sel[0]; }, this);
      return c ? c.r : '';
    }

    computeTargets() {
      var st = this.st, me = this.viewer, self = this;
      this.targets = {};
      if (st.phase !== 'play' || !this.isHumanTurn()) return;
      if (this.mode === 'dropout') {
        var pl = st.players[me];
        pl.path.forEach(function (id, i) {
          if (i >= 1 && TT.isHidden(st.slotIndex[id].layer)) {
            var n = pl.path.length - i;
            if (n <= pl.hand.length) self.targets[id] = { kind: 'dropout', n: n };
          }
        });
        return;
      }
      if (this.mode === 'dropout-pay') return;
      if (this.sel.length) {
        TT.stackTargets(st).forEach(function (slot) {
          if (TT.canStack(st, me, slot.id, self.sel)) {
            var eff = TT.stackEffect(st, me, slot, self.sel.length);
            self.targets[slot.id] = { kind: eff.kind, self: eff.self };
          }
        });
        return;
      }
      TT.revealTargets(st, me).forEach(function (s) { self.targets[s.id] = { kind: 'reveal' }; });
    }

    /* ------------------------------------------------------------------ desenho contínuo */
    update(time) {
      if (!this.st) return;
      var g = this.connG, st = this.st, self = this;
      g.clear();
      st.players.forEach(function (pl, p) {
        var sc = self.scores && self.scores[p];
        for (var i = 0; i < pl.path.length; i++) {
          var a = st.slotIndex[pl.path[i]];
          var ax = colX(a.layer), ay = rowY(a.layer, a.idx);
          g.lineStyle(3, PCOL[p], 0.95); g.strokeRoundedRect(ax - 33, ay - 45, 66, 91, 7);
          if (i === pl.path.length - 1) continue;
          var b = st.slotIndex[pl.path[i + 1]];
          var bx = colX(b.layer), by = rowY(b.layer, b.idx);
          var v = sc && sc.neurons[i + 1] ? sc.neurons[i + 1].v : 2;
          var w = 1.5 + Math.min(9, v * 0.5);
          g.lineStyle(w, PCOL[p], 0.55);
          g.lineBetween(ax + 31, ay, bx - 31, by);
          for (var k = 0; k < 2; k++) {
            var t = ((time / 1100) + k * 0.5 + i * 0.13) % 1;
            g.fillStyle(0xffffff, 0.85);
            g.fillCircle(ax + 31 + (bx - ax - 62) * t, ay + (by - ay) * t, 2 + w * 0.15);
          }
        }
      });
      /* leque de candidatos, como no Playground */
      if (this.isHumanTurn() && !this.sel.length && this.mode === 'idle') {
        var f = TT.frontier(st, this.viewer);
        if (f) {
          Object.keys(this.targets).forEach(function (id) {
            var s = st.slotIndex[id];
            g.lineStyle(1, PCOL[self.viewer], 0.25);
            g.lineBetween(colX(f.layer) + 31, rowY(f.layer, f.idx), colX(s.layer) - 31, rowY(s.layer, s.idx));
          });
        }
      }
      var h = this.hlG; h.clear();
      var pulse = 0.55 + 0.45 * Math.sin(time / 180);
      if (this.mode === 'starter') {
        this.handSprites.forEach(function (sp) { h.lineStyle(3, 0xf6dc8f, pulse); h.strokeRoundedRect(sp.x - 50, sp.y - 69, 100, 138, 10); });
      }
      Object.keys(this.targets || {}).forEach(function (id) {
        var tg = self.targets[id], s = st.slotIndex[id];
        var x = colX(s.layer), y = rowY(s.layer, s.idx);
        h.lineStyle(tg.kind === 'reveal' ? 2.5 : 4, KIND_COLOR[tg.kind], pulse);
        h.strokeRoundedRect(x - 36, y - 48, 72, 97, 9);
      });
    }

    /* ------------------------------------------------------------------ entrada */
    onSlotHover(id, over) {
      var st = this.st, slot = st.slotIndex[id], deck = st.cfg.deck;
      if (!over) { this.hoverHint = null; this.setHint(this.hintText()); return; }
      if (slot.removed) return;
      if (slot.faceUp) {
        var owner = slot.owner >= 0 ? st.players[slot.owner].name : '';
        var sc = slot.owner >= 0 ? this.scores[slot.owner].neurons.find(function (n) { return n.slot.id === id; }) : null;
        this.showPreview(TT.texPreview(this, slot.cards[0], deck), 'Neurônio de ' + owner + (sc ? ': vale ' + sc.v + (sc.notes.length ? ' (' + sc.notes.join(', ') + ')' : '') : '') + (slot.cards.length > 1 ? ' · ' + slot.cards.length + ' cartas empilhadas' : ''));
      } else if (slot.known) {
        this.showPreview(TT.texPreview(this, slot.cards[0], deck), 'Neurônio desvirado por dropout. Todos lembram que é ' + TT.cardLabel(slot.cards[0]) + '.');
      } else {
        this.showPreview('back-full', TT.layerName(slot.layer) + ': neurônio desconhecido.');
      }
      var tg = this.targets[id];
      if (tg) {
        var victim = slot.owner >= 0 ? st.players[slot.owner].name : '';
        var label = TT.cardLabel(slot.cards[0]);
        var txt = {
          reveal: 'Ativar este neurônio na sua rede.',
          tunagem: 'Tunagem: empilha ' + this.sel.length + ' carta(s) em ' + label + ' e soma o valor à sua rede.',
          overfit: 'Overfit: ' + label + ' de ' + victim + ' vai para o cemitério e a rede recua uma camada.',
          earlystop: tg.self ? 'Early stop na própria rede: ela congela agora e ' + label + ' some. Tem certeza?' : 'Early stop: a rede de ' + victim + ' é finalizada agora, sem ' + label + '.',
          stackoverflow: tg.self ? 'Stack overflow na própria rede: você perde a rede e a mão. Desk rejection garantida.' : 'Stack overflow: ' + victim + ' perde a rede aqui e todas as cartas da mão.',
          dropout: 'Dropout de ' + tg.n + ' camada(s), custando ' + tg.n + ' carta(s) da mão.',
        }[tg.kind];
        this.hoverHint = txt;
        this.setHint(txt);
      }
    }

    onSlotClick(id) {
      if (!this.isHumanTurn()) return;
      var tg = this.targets[id];
      if (!tg) {
        if (this.sel.length) this.floatText(colX(this.st.slotIndex[id].layer), rowY(this.st.slotIndex[id].layer, this.st.slotIndex[id].idx), 'não encaixa', '#ffb3a8', 16);
        return;
      }
      this.hoverHint = null;
      var me = this.viewer;
      if (tg.kind === 'reveal') return this.doMove({ t: 'reveal', p: me, slot: id });
      if (tg.kind === 'dropout') {
        this.mode = 'dropout-pay';
        this.dropN = tg.n;
        this.sel = [];
        this.renderAll();
        return;
      }
      this.doMove({ t: 'stack', p: me, slot: id, cards: this.sel.slice() });
    }

    onHandClick(cardId) {
      var st = this.st, me = this.viewer;
      if (st.phase === 'starter' && this.mode === 'starter') {
        this.mode = 'idle';
        TT.Sfx.place();
        this.doMove({ t: 'starter', p: me, card: cardId });
        return;
      }
      if (!this.isHumanTurn()) return;
      TT.Sfx.select();
      var i = this.sel.indexOf(cardId);
      if (this.mode === 'dropout-pay') {
        if (i >= 0) this.sel.splice(i, 1); else if (this.sel.length < this.dropN) this.sel.push(cardId);
        if (this.sel.length === this.dropN) {
          this.doMove({ t: 'dropout', p: me, n: this.dropN, pay: this.sel.slice() });
          return;
        }
        this.renderAll();
        return;
      }
      if (this.mode === 'dropout') this.mode = 'idle';
      var hand = st.players[me].hand;
      var card = hand.find(function (c) { return c.id === cardId; });
      if (i >= 0) this.sel.splice(i, 1);
      else {
        var rank = this.selRank();
        if (rank && rank !== card.r) this.sel = [];
        this.sel.push(cardId);
      }
      this.renderAll();
    }

    cancelSelection() {
      if (this.sel.length || this.mode !== 'idle') {
        this.sel = [];
        if (this.mode !== 'starter') this.mode = 'idle';
        this.renderAll();
      }
    }
    toggleDropout() {
      if (this.mode === 'dropout' || this.mode === 'dropout-pay') { this.mode = 'idle'; this.sel = []; }
      else { this.mode = 'dropout'; this.sel = []; }
      this.renderAll();
    }
    humanTransfer() {
      var me = this.viewer, r = TT.transferRank(this.st, me);
      if (!r) return;
      var ids = this.st.players[me].hand.filter(function (c) { return c.r === r; }).slice(0, 4).map(function (c) { return c.id; });
      this.doMove({ t: 'transfer', p: me, cards: ids });
    }
    humanPass() { if (this.isHumanTurn() && TT.canPass(this.st, this.viewer)) this.doMove({ t: 'pass', p: this.viewer }); }

    askMenu() {
      var self = this;
      TT.UI.confirm('Abandonar a partida?', 'O placar de tentos desta partida será perdido. Conquistas já desbloqueadas ficam salvas.', [
        { label: 'Continuar jogando', cls: 'ghost' },
        { label: 'Voltar ao menu', cls: 'wine', cb: function () { self.app.toMenu(); } },
      ]);
    }

    /* ------------------------------------------------------------------ jogadas */
    doMove(move) {
      try {
        TT.applyMove(this.st, move);
      } catch (e) {
        TT.UI.toast('Jogada inválida', e.message);
        this.renderAll();
        return;
      }
      this.sel = [];
      if (this.mode !== 'starter') this.mode = 'idle';
      var events = this.st.events.splice(0);
      this.busy = true;
      this.renderAll();
      var delay = this.playEvents(events, move);
      var self = this;
      this.time.delayedCall(delay, function () { self.advance(); });
    }

    advance() {
      if (this.ended || !this.scene.isActive()) return;
      var st = this.st, self = this;
      if (this.match.pending) return;
      if (st.phase === 'over') return this.endHand(null);
      if (st.phase === 'starter') {
        st.players.forEach(function (pl, i) { if (pl.kind === 'bot' && !pl.starterCard) TT.applyMove(st, TT.botMove(st, i)); });
        var waiting = st.players.findIndex(function (pl) { return pl.kind === 'human' && !pl.starterCard; });
        if (waiting < 0) { var ev = st.events.splice(0); this.renderAll(); this.time.delayedCall(this.playEvents(ev), function () { self.advance(); }); return; }
        var begin = function () { self.viewer = waiting; self.mode = 'starter'; self.busy = false; self.renderAll(); };
        var someonePicked = st.players.some(function (p) { return !!p.starterCard; });
        if (this.hot && (someonePicked || this.viewer !== waiting)) return this.passDevice(waiting, begin);
        return begin();
      }
      var cur = st.current, pl = st.players[cur];
      if (pl.kind === 'bot') return this.botTurn();
      if (this.hot && this.viewer !== cur) return this.passDevice(cur, function () { self.viewer = cur; self.advance(); });
      this.viewer = cur;
      this.busy = false;
      this.mode = 'idle';
      var moves = TT.legalMoves(st, cur);
      var onlyPass = moves.length === 1 && moves[0].t === 'pass';
      if (onlyPass && (TT.trailingHidden(st, cur) === 0 || pl.hand.length === 0)) {
        this.busy = true;
        this.renderAll();
        this.setHint('Nenhuma jogada possível: passando a vez.');
        this.time.delayedCall(900, function () { self.doMove({ t: 'pass', p: cur }); });
        return;
      }
      this.renderAll();
    }

    passDevice(p, cb) {
      var self = this;
      this.viewer = -1;
      this.busy = true;
      this.renderAll();
      TT.UI.confirm('Vez de ' + this.st.players[p].name, 'Passe o aparelho. A mão fica escondida até você confirmar.', [
        { label: 'Estou pronto', cls: 'wine', cb: function () { self.viewer = p; cb(); } },
      ]);
    }

    botTurn() {
      var self = this, st = this.st, cur = st.current, kind = st.players[cur].bot;
      this.busy = true;
      this.thinkingNow = true;
      this.hud.oppSub.setText(kind === 'montecarlo' ? 'simulando partidas…' : 'pensando…');
      this.renderAll();
      this.time.delayedCall(kind === 'montecarlo' ? 350 : 650, function () {
        if (self.ended || st !== self.st) return;
        if (self.trucoChecked !== st.turn && TT.canTruco(self.match, cur)) {
          self.trucoChecked = st.turn;
          if (TT.botTrucoCall(st, cur, kind)) { self.thinkingNow = false; return self.callTruco(cur); }
        }
        var move = TT.botMove(st, cur);
        self.thinkingNow = false;
        if (move.mc) {
          self.hud.oppSub.setText('simulou ' + move.mc.sims + ' partidas · ' + Math.round(move.mc.winRate * 100) + '% de vitória');
          self.codexToast('montecarlo');
          delete move.mc;
        }
        self.doMove(move);
      });
    }

    /* ------------------------------------------------------------------ truco */
    humanTruco() {
      if (!this.isHumanTurn() || !TT.canTruco(this.match, this.viewer)) return;
      this.callTruco(this.viewer);
    }

    callTruco(p) {
      var m = this.match, self = this;
      TT.callTruco(m, p);
      TT.Sfx.truco();
      this.codexToast('truco');
      var shout = TT.TRUCO_SHOUT[m.pending.to];
      this.banner(shout, PCSS[p], 72);
      if (this.st.players[p].kind === 'bot') this.say(TT.taunt('truco'));
      this.busy = true;
      this.renderAll();
      this.time.delayedCall(900, function () { self.askAnswer(); });
    }

    askAnswer() {
      var m = this.match, self = this;
      var q = 1 - m.pending.by;
      var pl = this.st.players[q];
      var canRaise = TT.nextStake(m.pending.to) != null;
      if (pl.kind === 'bot') {
        var ans = TT.botTrucoAnswer(this.st, q, pl.bot, m.pending.to, canRaise);
        this.say(TT.taunt(ans === 'raise' ? 'raise' : ans));
        return this.resolveAnswer(q, ans);
      }
      var caller = this.st.players[m.pending.by].name;
      var buttons = [
        { label: 'Correr', cls: 'ghost', cb: function () { self.resolveAnswer(q, 'run'); } },
        { label: 'Desce! (vale ' + m.pending.to + ')', cls: 'wine', cb: function () { self.resolveAnswer(q, 'accept'); } },
      ];
      if (canRaise) buttons.push({ label: 'Pedir ' + TT.TRUCO_SHOUT[TT.nextStake(m.pending.to)], cb: function () { self.resolveAnswer(q, 'raise'); } });
      TT.UI.confirm(TT.TRUCO_SHOUT[m.pending.to],
        (this.hot ? pl.name + ', responda. ' : '') + 'Se aceitar, a mão vale ' + m.pending.to + ' tentos. Se correr, ' + caller + ' leva ' + m.value + ' agora.',
        buttons, { shout: true, top: '<div class="who">' + TT.UI.esc(caller) + ' pediu</div>' });
    }

    resolveAnswer(q, ans) {
      var m = this.match, self = this;
      var res = TT.answerTruco(m, q, ans);
      if (ans === 'run') {
        this.banner(this.st.players[q].name + ' correu!', '#efe3c6', 40);
        if (this.st.players[q].kind === 'bot') this.botRan = true;
        this.time.delayedCall(900, function () { self.endHand(res); });
        return;
      }
      if (ans === 'raise') {
        TT.Sfx.truco();
        this.banner(TT.TRUCO_SHOUT[m.pending.to], PCSS[q], 72);
        this.renderAll();
        this.time.delayedCall(900, function () { self.askAnswer(); });
        return;
      }
      this.floatText(610, 300, 'Aceito: mão vale ' + m.value, '#f6dc8f', 26);
      this.renderAll();
      this.time.delayedCall(600, function () { self.busy = false; self.advance(); });
    }

    /* ------------------------------------------------------------------ efeitos */
    slotXY(id) { var s = this.st.slotIndex[id]; return { x: colX(s.layer), y: rowY(s.layer, s.idx) }; }

    playEvents(events, move) {
      var self = this, st = this.st, deck = st.cfg.deck;
      var delay = 350;
      events.forEach(function (ev) {
        var isBot = ev.p != null && st.players[ev.p] && st.players[ev.p].kind === 'bot';
        if (ev.t === 'reveal') {
          var o = self.slotSprites[ev.slot];
          o.sp.scaleX = 0;
          self.tweens.add({ targets: o.sp, scaleX: o.sp.baseSX, duration: 200, ease: 'Sine.out' });
          TT.Sfx.flip();
          var xy = self.slotXY(ev.slot);
          var neuron = self.scores[ev.p].neurons.find(function (n) { return n.slot.id === ev.slot; });
          self.floatText(xy.x, xy.y - 50, '+' + (neuron ? neuron.v : 0), PCSS[ev.p], 22);
          self.showPreview(TT.texPreview(self, ev.card, deck), st.players[ev.p].name + ' ativou ' + TT.cardName(ev.card, deck) + '.');
          self.codexToast('neuronio');
          if (st.players[ev.p].path.length >= 2) self.codexToast('forward');
          if (st.players[ev.p].path.length >= 3) self.codexToast('pesos');
          delay = Math.max(delay, 450);
        } else if (ev.t === 'tunagem') {
          var xy2 = self.slotXY(ev.slot);
          ev.cards.forEach(function (c, i) { self.flyCard(c, isBot ? 560 : 610, isBot ? 40 : 652, xy2.x, xy2.y, i * 120); });
          var add = 0;
          ev.cards.forEach(function (c) { add += TT.isFigure(c) ? 10 : TT.baseValue(c, deck); });
          self.time.delayedCall(320, function () { TT.Sfx.tune(); self.floatText(xy2.x, xy2.y - 50, 'Tunagem +' + add, '#7fe08a', 20); self.burst(xy2.x, xy2.y, 0x7fe08a, 14); });
          self.codexToast('tunagem');
          delay = Math.max(delay, 800);
        } else if (ev.t === 'overfit' || ev.t === 'earlystop' || ev.t === 'stackoverflow') {
          var xy3 = self.slotXY(ev.slot);
          var played = move && move.cards ? move.cards.length : 1;
          for (var k = 0; k < played; k++) self.flyCard(ev.cards[ev.cards.length - 1 - k], isBot ? 560 : 610, isBot ? 40 : 652, xy3.x, xy3.y, k * 110);
          var ghost = self.add.image(xy3.x, xy3.y, TT.texMini(self, ev.cards[0], deck)).setDisplaySize(TT.SIZE.boardW, TT.SIZE.boardH).setDepth(15);
          self.tweens.add({ targets: ghost, x: '+=6', yoyo: true, repeat: 4, duration: 50, delay: 300 });
          self.tweens.add({ targets: ghost, alpha: 0, displayWidth: TT.SIZE.boardW * 1.5, displayHeight: TT.SIZE.boardH * 1.5, angle: 25, duration: 500, delay: 560, onComplete: function () { ghost.destroy(); } });
          var col = { overfit: 0xffa24a, earlystop: 0xff4d5e, stackoverflow: 0xff4dd2 }[ev.t];
          var title = { overfit: 'OVERFIT!', earlystop: 'EARLY STOP!', stackoverflow: 'STACK OVERFLOW!' }[ev.t];
          self.time.delayedCall(420, function () {
            self.burst(xy3.x, xy3.y, col, ev.t === 'stackoverflow' ? 50 : 26);
            if (ev.t === 'stackoverflow') { TT.Sfx.boom(); self.cameras.main.shake(450, 0.012); }
            else { TT.Sfx.hit(); self.cameras.main.shake(220, ev.t === 'earlystop' ? 0.007 : 0.003); }
            self.banner(title + (ev.self ? ' (na própria rede)' : ''), '#' + col.toString(16).padStart(6, '0'), ev.t === 'stackoverflow' ? 58 : 50);
          });
          if (!ev.self) {
            if (st.players[ev.p].kind === 'bot') self.say(TT.taunt(ev.t));
            else if (st.players[ev.o].kind === 'bot') self.say(TT.taunt(ev.t === 'overfit' ? 'sufferOverfit' : 'sufferStop'));
          }
          self.codexToast(ev.t);
          if (ev.t !== 'overfit') self.codexToast('overfit');
          delay = Math.max(delay, 1250);
        } else if (ev.t === 'dropout') {
          ev.slots.forEach(function (id, i) {
            var o2 = self.slotSprites[id];
            o2.sp.scaleX = 0;
            self.tweens.add({ targets: o2.sp, scaleX: o2.sp.baseSX, duration: 220, delay: i * 120 });
          });
          TT.Sfx.dropout();
          self.banner('GatoNet! Dropout ×' + ev.slots.length, '#6fe7ff', 40);
          self.codexToast('dropout');
          delay = Math.max(delay, 700);
        } else if (ev.t === 'transfer') {
          TT.Sfx.badge();
          self.banner('TRANSFER LEARNING', '#9fe3e0', 46);
          self.codexToast('transfer');
          self.codexToast('ruido');
          delay = Math.max(delay, 1000);
        } else if (ev.t === 'complete') {
          TT.Sfx.badge();
          self.floatText(colX(TT.OUTPUT), 590, 'Rede completa!', PCSS[ev.p], 22);
          delay = Math.max(delay, 600);
        } else if (ev.t === 'wind') {
          self.floatText(610, 120, 'O vento virou: ' + TT.SUIT_INFO[ev.suit].sym + ' ' + TT.SUIT_INFO[ev.suit].name + ' vale dobro', '#bfe7f4', 20);
        } else if (ev.t === 'powerbi') {
          TT.UI.toast('Power BI', st.players[ev.p].name + ' atualizou o dashboard: as cartas da mão mudaram.', null, 3500);
        } else if (ev.t === 'pass') {
          self.floatText(ev.p === self.bottomPlayer() ? 610 : 560, ev.p === self.bottomPlayer() ? 570 : 90, st.players[ev.p].name + ' passou', '#efe3c6', 18);
        } else if (ev.t === 'start') {
          if (ev.cards) {
            ev.cards.forEach(function (c, i) {
              var img = self.add.image(520 + i * 180, 330, TT.texFullBig(self, c, deck)).setDisplaySize(120, 168).setDepth(25).setAlpha(0);
              self.tweens.add({ targets: img, alpha: 1, duration: 200 });
              var lbl = self.add.text(520 + i * 180, 430, st.players[i].name, { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '16px', color: PCSS[i] }).setOrigin(0.5).setDepth(25);
              self.time.delayedCall(1700, function () { self.tweens.add({ targets: [img, lbl], alpha: 0, duration: 300, onComplete: function () { img.destroy(); lbl.destroy(); } }); });
            });
            self.time.delayedCall(700, function () { self.banner(st.players[ev.p].name + ' começa' + (ev.tie ? ' (empate: sorteio)' : ''), PCSS[ev.p], 36); });
            delay = Math.max(delay, 2100);
          } else {
            self.banner(st.players[ev.p].name + ' começa (sorteio)', PCSS[ev.p], 36);
            delay = Math.max(delay, 900);
          }
        }
      });
      /* vanishing gradient recém-formado */
      st.players.forEach(function (_, p) {
        var sc = self.scores[p];
        if (sc.vanishing && !self.vanishSeen[p]) {
          self.vanishSeen[p] = true;
          self.time.delayedCall(500, function () {
            TT.Sfx.boom();
            self.banner('VANISHING GRADIENT', '#ff6b7a', 52);
            self.say(TT.taunt('vanishing'));
          });
          self.codexToast('vanishing');
          delay = Math.max(delay, 1400);
        } else if (!sc.vanishing) self.vanishSeen[p] = false;
        if (sc.combos.some(function (c) { return !c.label.match(/vanishing/); })) self.codexToast('vanishing');
      });
      if (st.history.length > 3) this.codexToast('perda');
      return delay;
    }

    flyCard(card, x0, y0, x1, y1, delay) {
      var img = this.add.image(x0, y0, TT.texMini(this, card, this.st.cfg.deck)).setDisplaySize(72, 101).setDepth(16);
      this.tweens.add({ targets: img, x: x1 + 8, y: y1 - 8, displayWidth: TT.SIZE.boardW, displayHeight: TT.SIZE.boardH, angle: 8, duration: 320, delay: delay || 0, ease: 'Cubic.out', onComplete: function () { img.destroy(); } });
    }

    burst(x, y, color, n) {
      /* faísca colorida própria: tint não existe no renderizador Canvas */
      var hex = '#' + color.toString(16).padStart(6, '0'), key = 'spark-' + hex;
      if (!this.textures.exists(key)) this.textures.addCanvas(key, TT.drawSpark(Math.min(TT.RES, 2), hex));
      var em = this.add.particles(x, y, key, { speed: { min: 80, max: 260 }, lifespan: 650, scale: { start: 13 / (32 * Math.min(TT.RES, 2)), end: 0 }, blendMode: 'ADD', emitting: false }).setDepth(18);
      em.explode(n);
      this.time.delayedCall(900, function () { em.destroy(); });
    }

    floatText(x, y, text, color, size) {
      var t = this.add.text(x, y, text, { fontFamily: F_DISPLAY, fontStyle: '900', fontSize: (size || 20) + 'px', color: color || '#fff', stroke: '#0d0a08', strokeThickness: 5 }).setOrigin(0.5).setDepth(20);
      this.tweens.add({ targets: t, y: y - 36, alpha: 0, duration: 1200, ease: 'Cubic.out', onComplete: function () { t.destroy(); } });
    }

    banner(text, color, size) {
      var t = this.add.text(610, 330, text, { fontFamily: F_DISPLAY, fontStyle: '900', fontSize: (size || 48) + 'px', color: color || '#f6dc8f', stroke: '#0d0a08', strokeThickness: 8, align: 'center' }).setOrigin(0.5).setDepth(40).setScale(0.6).setAlpha(0);
      this.tweens.add({ targets: t, scale: 1, alpha: 1, duration: 220, ease: 'Back.out' });
      this.tweens.add({ targets: t, alpha: 0, y: 300, duration: 380, delay: 1050, onComplete: function () { t.destroy(); } });
    }

    say(text) {
      var h = this.hud;
      if (!text) return;
      h.bubbleText.setText(text);
      var w = Math.min(250, h.bubbleText.width + 28), hh = h.bubbleText.height + 18;
      h.bubbleBg.clear();
      h.bubbleBg.fillStyle(0xefe3c6, 1); h.bubbleBg.fillRoundedRect(-w / 2, -hh / 2, w, hh, 10);
      h.bubbleBg.fillTriangle(-w / 2 + 10, -4, -w / 2 - 12, -10, -w / 2 + 10, 8);
      h.bubbleBg.lineStyle(2, 0x0d0a08, 1); h.bubbleBg.strokeRoundedRect(-w / 2, -hh / 2, w, hh, 10);
      h.bubble.setPosition(Math.min(950 - w / 2, 690 + w / 2), 40).setVisible(true).setAlpha(1);
      this.tweens.killTweensOf(h.bubble);
      this.tweens.add({ targets: h.bubble, alpha: 0, delay: 2600, duration: 400, onComplete: function () { h.bubble.setVisible(false); } });
    }

    codexToast(id) {
      if (this.sessionSeen[id]) return;
      this.sessionSeen[id] = true;
      var e = TT.CODEX.find(function (x) { return x.id === id; });
      if (!e) return;
      TT.UI.toast('Grimório · ' + e.title, e.game, null, 6500);
    }

    /* ------------------------------------------------------------------ fim da mão */
    endHand(runRes) {
      if (this.ended) return;
      this.ended = true;
      this.busy = true;
      var self = this, st = this.st, m = this.match;
      var full = !runRes;
      var winner = full ? st.result.winner : runRes.winner;
      var handValue = full ? m.value : runRes.pts;
      var gain = TT.scoreHand(m, winner, full ? null : runRes.pts);
      this.renderAll();
      var humanWon = st.players[winner].kind === 'human';
      if (!this.hot) {
        if (humanWon) TT.Sfx.win(); else TT.Sfx.lose();
        this.say(TT.taunt(humanWon ? 'lose' : 'win'));
      } else TT.Sfx.win();
      var unlocked = this.hot ? [] : this.app.recordHand({ st: st, me: 0, won: winner === 0, full: full, match: m, matchWon: m.over && m.winner === 0, handValue: handValue, botRan: !!this.botRan, opts: this.opts });
      this.botRan = false;
      this.time.delayedCall(full ? 1100 : 300, function () { self.showResult(winner, gain, full, unlocked); });
    }

    netHtml(p) {
      var st = this.st, sc = TT.scoreNetwork(st, p), pl = st.players[p], esc = TT.UI.esc;
      var stuck = pl.status === 'building' && st.result && st.result.stuck[p];
      var terms = sc.neurons.map(function (n) {
        return '<span class="term">' + esc(TT.cardLabel(n.card)) + (n.stack > 1 ? '×' + n.stack : '') + ' = ' + n.v + (n.notes.length ? ' <small>(' + esc(n.notes.join(', ')) + ')</small>' : '') + '</span>';
      }).join('');
      terms += sc.combos.map(function (c) { return '<span class="term ' + (c.count >= 4 ? 'bad' : 'combo') + '">' + esc(c.label) + '</span>'; }).join('');
      return '<div class="net p' + p + '"><div class="status">' + esc(stuck ? 'travada' : STATUS[pl.status]) + '</div><h3 style="margin:2px 0 6px;color:' + PCSS[p] + '">' + esc(pl.name) + '</h3>' +
        '<div class="total">' + sc.total + '</div><div class="terms">' + (terms || '<span class="term">rede vazia</span>') + '</div>' +
        '<small>dropouts ' + pl.dropouts + ' · mão ' + pl.hand.length + '</small></div>';
    }

    showResult(winner, gain, full, unlocked) {
      var self = this, st = this.st, m = this.match, esc = TT.UI.esc;
      var wname = st.players[winner].name;
      var title = this.hot ? wname + ' vence a mão' : winner === 0 ? 'Você venceu a mão!' : wname + ' venceu a mão';
      var reason = full ? 'Critério: ' + st.result.reason + '.' : st.players[1 - winner].name + ' correu do truco.';
      var html = '<div class="sheet"><h2>' + esc(title) + '</h2><p>' + esc(reason) + '</p>';
      if (full) html += '<div class="result-grid">' + this.netHtml(0) + this.netHtml(1) + '</div>';
      if (m.target > 1) {
        html += '<div class="tentos">+' + gain + (gain === 1 ? ' tento' : ' tentos') + ' para ' + esc(wname) + ' · placar <span class="big">' + m.tentos[0] + ' × ' + m.tentos[1] + '</span> (até ' + m.target + ')</div>';
        if (m.over) html += '<p><b>' + esc(st.players[m.winner].name) + ' venceu a partida!</b></p>';
      }
      if (unlocked.length) {
        html += '<h3>Conquistas desbloqueadas</h3><div class="unlocks">' + unlocked.map(function (a) {
          return '<div class="unlock"><span class="chip" style="background:' + TT.TIERS[a.tier].color + ';color:#24140a">' + TT.TIERS[a.tier].name + '</span>' + esc(a.name) + ' · <small>' + esc(a.desc) + '</small></div>';
        }).join('') + '</div>';
      }
      var matchOver = m.over || m.target <= 1;
      html += '<div class="row end" style="margin-top:16px"><button class="btn ghost" id="r-menu">Menu</button>' +
        '<button class="btn wine" id="r-next">' + (matchOver ? 'Nova partida' : 'Próxima mão') + '</button></div></div>';
      var dlg = TT.UI.open(html);
      dlg.el.querySelector('#r-menu').addEventListener('click', function () { dlg.close(); self.app.toMenu(); });
      dlg.el.querySelector('#r-next').addEventListener('click', function () {
        dlg.close();
        if (matchOver) self.match = TT.newMatch(self.opts.target); else TT.nextHand(self.match);
        self.startHand();
      });
    }
  }

  TT.GameScene = GameScene;
})();
