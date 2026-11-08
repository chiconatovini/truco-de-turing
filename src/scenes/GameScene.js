/* A mesa: tabuleiro de camadas, mãos, painel de placar, truco, animações e fluxo de turnos. */
var TT = (globalThis.TT = globalThis.TT || {});

(function () {
  var MS = 0.52;          /* escala das cartas da mesa (120x168 -> 62x87) */
  var HS = 0.4;           /* escala das cartas na mão (240x336 -> 96x134) */
  var PS = 0.82;          /* escala da inspeção */
  var ROW_GAP = 95, BOARD_CY = 334;
  var colX = function (l) { return 318 + l * 97; };
  var rowY = function (l, i) { var n = TT.LAYER_SIZES[l]; return BOARD_CY + (i - (n - 1) / 2) * ROW_GAP; };
  var PCOL = [TT.COLORS.p0, TT.COLORS.p1];
  var PCSS = [TT.CSS.p0, TT.CSS.p1];
  var KIND_COLOR = { reveal: 0xf6dc8f, tunagem: 0x7fe08a, overfit: 0xffa24a, earlystop: 0xff4d5e, stackoverflow: 0xff4dd2, dropout: 0x6fe7ff };
  var STATUS = { building: 'em construção', done: 'chegou à saída', earlystop: 'early stop', overflow: 'stack overflow' };
  var F_DISPLAY = 'Cinzel, Georgia, serif', F_UI = '"Alegreya Sans", Arial, sans-serif', F_BODY = 'Alegreya, Georgia, serif';

  class GameScene extends Phaser.Scene {
    constructor() { super('Game'); }

    create() {
      this.app = TT.App;
      this.opts = Object.assign({}, this.app.opts);
      this.hot = this.opts.bot === 'hotseat';
      this.match = TT.newMatch(this.opts.target);
      this.sessionSeen = this.app.sessionSeen;

      this.add.image(0, 0, 'felt').setOrigin(0);
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
      g.fillStyle(0x07150e, 0.72); g.fillRoundedRect(8, 80, 244, 632, 12);
      g.fillStyle(0x07150e, 0.72); g.fillRoundedRect(962, 8, 310, 704, 12);
      g.lineStyle(1.5, TT.COLORS.gold, 0.45); g.strokeRoundedRect(8, 80, 244, 632, 12); g.strokeRoundedRect(962, 8, 310, 704, 12);
      /* colunas das camadas */
      for (var l = 0; l < TT.N_LAYERS; l++) {
        var imm = l === 0 || l === TT.OUTPUT;
        var n = TT.LAYER_SIZES[l];
        var top = rowY(l, 0) - 52, bot = rowY(l, n - 1) + 52;
        g.fillStyle(imm ? 0x2a1a08 : 0x000000, imm ? 0.35 : 0.18);
        g.fillRoundedRect(colX(l) - 42, top, 84, bot - top, 10);
        if (imm) { g.lineStyle(1.5, 0xe8a7b8, 0.55); g.strokeRoundedRect(colX(l) - 42, top, 84, bot - top, 10); }
        this.add.text(colX(l), 84, TT.layerName(l).toUpperCase(), { fontFamily: F_UI, fontStyle: '700', fontSize: '12px', color: imm ? '#f0b7c4' : '#d9c79a', letterSpacing: 1.5 }).setOrigin(0.5).setDepth(1);
        if (imm) this.add.text(colX(l), top - 10, 'imune a ações', { fontFamily: F_UI, fontSize: '11px', color: '#f0b7c4' }).setOrigin(0.5).setDepth(1);
      }
      this.add.text(130, 96, 'INSPEÇÃO', { fontFamily: F_UI, fontStyle: '700', fontSize: '12px', color: '#d9c79a', letterSpacing: 2 }).setOrigin(0.5);
    }

    makeButton(x, y, w, h, label, cb, opt) {
      opt = opt || {};
      var c = this.add.container(x, y).setDepth(8);
      var bg = this.add.graphics();
      var fill = opt.fill || 0xd9b260, fill2 = opt.fill2 || 0xa47a28, txtCol = opt.color || '#24140a';
      var draw = function (hover) {
        bg.clear();
        bg.fillStyle(0x0d0a08, 1); bg.fillRoundedRect(-w / 2, -h / 2 + 3, w, h, 9);
        bg.fillGradientStyle(hover ? 0xfff0bc : fill, hover ? 0xfff0bc : fill, fill2, fill2, 1);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 9);
        bg.lineStyle(2, 0x0d0a08, 1); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 9);
      };
      draw(false);
      var t = this.add.text(0, 0, label, { fontFamily: opt.font || F_DISPLAY, fontStyle: '700', fontSize: (opt.size || 14) + 'px', color: txtCol, align: 'center' }).setOrigin(0.5);
      c.add([bg, t]);
      c.setSize(w, h);
      c.setInteractive({ useHandCursor: true });
      c.on('pointerover', function () { if (c.enabled) draw(true); });
      c.on('pointerout', function () { draw(false); });
      c.on('pointerdown', function () { if (c.enabled) { TT.Sfx.select(); cb(); } });
      c.enabled = true;
      c.label = t;
      c.setEnabled = function (on) { c.enabled = on; c.setAlpha(on ? 1 : 0.38); if (!on) draw(false); };
      return c;
    }

    createHud() {
      var self = this;
      var tx = function (x, y, s, style) { return self.add.text(x, y, s, Object.assign({ fontFamily: F_UI, fontSize: '14px', color: '#efe3c6' }, style || {})).setDepth(7); };
      var h = (this.hud = {});
      /* adversário (topo esquerdo) */
      h.oppAvatar = this.add.image(44, 40, 'avatar-gato').setScale(0.56).setDepth(7);
      h.oppName = tx(84, 16, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '18px', color: '#f6dc8f' });
      h.oppSub = tx(84, 42, '', { fontSize: '13px', color: '#c9b993' });
      h.bubble = this.add.container(700, 40).setDepth(30).setVisible(false);
      h.bubbleBg = this.add.graphics();
      h.bubbleText = this.add.text(0, 0, '', { fontFamily: F_BODY, fontStyle: 'italic', fontSize: '17px', color: '#24170c', wordWrap: { width: 230 } }).setOrigin(0.5);
      h.bubble.add([h.bubbleBg, h.bubbleText]);
      /* inspeção */
      h.preview = this.add.image(130, 250, 'terrain-' + this.opts.terrain).setScale(PS).setDepth(7);
      h.previewNote = tx(130, 396, '', { fontSize: '12px', color: '#c9b993', align: 'center', wordWrap: { width: 230 } }).setOrigin(0.5, 0);
      /* pilhas */
      h.limbo = this.add.image(72, 462, 'back-mini').setScale(0.42).setDepth(7).setInteractive();
      h.limboTxt = tx(72, 504, '', { fontSize: '13px', align: 'center' }).setOrigin(0.5, 0);
      h.grave = this.add.image(188, 462, 'back-mini').setScale(0.42).setDepth(7).setInteractive();
      h.graveTxt = tx(188, 504, '', { fontSize: '13px', align: 'center' }).setOrigin(0.5, 0);
      h.limbo.on('pointerover', function () { self.showPreview('back-full', 'Limbo: cartas queimadas no início (ruído). Só voltam por transfer learning.'); });
      h.grave.on('pointerover', function () {
        var top = self.st && self.st.graveyard[self.st.graveyard.length - 1];
        self.showPreview(top ? TT.texFull(self, top, self.st.cfg.deck) : 'back-full', 'Cemitério: ' + (self.st ? self.st.graveyard.length : 0) + ' carta(s) fora de jogo. Mostrando a última.');
      });
      h.terrainTxt = tx(130, 534, '', { fontSize: '13px', align: 'center', color: '#d9c79a', wordWrap: { width: 230 } }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
      h.terrainTxt.on('pointerover', function () { self.showPreview('terrain-' + self.opts.terrain, TT.TERRAINS[self.opts.terrain].name); });
      /* eu (rodapé esquerdo) */
      h.meAvatar = this.add.image(36, 604, 'avatar-p1').setScale(0.42).setDepth(7);
      h.meName = tx(66, 592, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '16px', color: '#bfe2fa' });
      h.hint = tx(18, 628, '', { fontFamily: F_BODY, fontSize: '14.5px', color: '#efe3c6', wordWrap: { width: 226 }, lineSpacing: 1 });

      /* painel direito */
      h.handTitle = tx(1117, 20, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '15px', color: '#f6dc8f' }).setOrigin(0.5, 0);
      h.tentos = tx(1117, 42, '', { fontSize: '14px', color: '#d9c79a' }).setOrigin(0.5, 0);
      h.blocks = [0, 1].map(function (i) {
        var y = 70 + i * 82;
        var b = { y: y };
        b.g = self.add.graphics().setDepth(6);
        b.name = tx(988, y + 8, '', { fontFamily: F_DISPLAY, fontStyle: '700', fontSize: '15px' });
        b.status = tx(988, y + 30, '', { fontSize: '11px', color: '#d9c79a', letterSpacing: 1.2 });
        b.detail = tx(988, y + 50, '', { fontSize: '13px', color: '#c9b993' });
        b.score = tx(1256, y + 38, '0', { fontFamily: F_DISPLAY, fontStyle: '900', fontSize: '38px' }).setOrigin(1, 0.5);
        return b;
      });
      h.truco = this.makeButton(1117, 258, 286, 42, 'TRUCO!', function () { self.humanTruco(); }, { fill: 0xc0303e, fill2: 0x6e1420, color: '#ffe9d6', size: 20 });
      h.chartLabel = tx(978, 288, 'CURVA DE TREINO · soma da rede por turno', { fontSize: '11px', color: '#d9c79a', letterSpacing: 1 });
      h.chartMax = tx(978, 304, '', { fontSize: '10px', color: '#8f8166' });
      h.log = tx(978, 398, '', { fontSize: '13px', color: '#d9cfb6', wordWrap: { width: 284 }, lineSpacing: 2 });
      h.btnDrop = this.makeButton(1043, 574, 140, 38, 'Dropout', function () { self.toggleDropout(); }, { size: 14 });
      h.btnTransfer = this.makeButton(1191, 574, 140, 38, 'Transfer', function () { self.humanTransfer(); }, { size: 14 });
      h.btnPass = this.makeButton(1043, 618, 140, 38, 'Passar a vez', function () { self.humanPass(); }, { size: 13 });
      h.btnRules = this.makeButton(1191, 618, 140, 38, 'Regras', function () { TT.UI.rules(null); }, { size: 14 });
      h.btnCodex = this.makeButton(1018, 666, 90, 34, 'Grimório', function () { TT.UI.codex(self.app); }, { size: 12, fill: 0x8a7a5a, fill2: 0x4a3f2c, color: '#f5ecd6' });
      h.btnSound = this.makeButton(1117, 666, 90, 34, '', function () { self.app.toggleSound(); self.refreshSoundBtn(); }, { size: 12, fill: 0x8a7a5a, fill2: 0x4a3f2c, color: '#f5ecd6' });
      h.btnMenu = this.makeButton(1216, 666, 90, 34, 'Menu', function () { self.askMenu(); }, { size: 12, fill: 0x8a7a5a, fill2: 0x4a3f2c, color: '#f5ecd6' });
      this.refreshSoundBtn();
      h.thinking = tx(610, 560, '', { fontFamily: F_BODY, fontStyle: 'italic', fontSize: '15px', color: '#f6dc8f' }).setOrigin(0.5).setDepth(12);
    }

    refreshSoundBtn() { this.hud.btnSound.label.setText(TT.Sfx.isMuted() ? 'Som: não' : 'Som: sim'); }

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
      this.boardObjs = [];
      var players = this.hot
        ? [{ name: 'Jogador 1', kind: 'human' }, { name: 'Jogador 2', kind: 'human' }]
        : [{ name: 'Você', kind: 'human' }, { name: TT.BOTS[this.opts.bot].name, kind: 'bot', bot: this.opts.bot }];
      this.st = TT.newGame({ deck: this.opts.deck, terrain: this.opts.terrain, starter: this.opts.starter, players: players });
      this.viewer = 0;
      this.slotSprites = {};
      this.st.layers.forEach(function (layer) {
        layer.forEach(function (slot) {
          var sp = self.add.image(colX(slot.layer), rowY(slot.layer, slot.idx), 'back-mini').setScale(MS).setDepth(3).setInteractive({ useHandCursor: true });
          sp.slotId = slot.id;
          sp.on('pointerdown', function () { self.onSlotClick(slot.id); });
          sp.on('pointerover', function () { self.onSlotHover(slot.id, true); });
          sp.on('pointerout', function () { self.onSlotHover(slot.id, false); });
          var badge = self.add.text(sp.x + 26, sp.y - 40, '', { fontFamily: F_UI, fontStyle: '900', fontSize: '13px', color: '#24170c', backgroundColor: '#f6dc8f', padding: { x: 4, y: 1 } }).setOrigin(0.5).setDepth(4);
          var mem = self.add.text(sp.x, sp.y + 32, '', { fontFamily: F_UI, fontStyle: '700', fontSize: '12px', color: '#f6dc8f', backgroundColor: 'rgba(0,0,0,.65)', padding: { x: 3, y: 1 } }).setOrigin(0.5).setDepth(4);
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
      this.hud.previewNote.setText(TT.TERRAINS[this.opts.terrain].name + ' · baralho ' + TT.DECKS[this.opts.deck].name);
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

    showPreview(key, note) { this.hud.preview.setTexture(key); this.hud.previewNote.setText(note || ''); }

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
            o.sp.setTexture(TT.texMini(self, slot.cards[0], deck));
            o.mem.setVisible(false);
          } else {
            o.sp.setTexture('back-mini');
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
        var sp = self.add.image(x, y, showHand ? TT.texFull(self, card, deck) : 'back-full').setScale(HS).setDepth(10 + i);
        sp.baseY = y;
        if (showHand) {
          sp.setInteractive({ useHandCursor: true });
          sp.on('pointerover', function () { sp.y = sp.baseY - 8; self.showPreview(TT.texFull(self, card, deck), self.handCardNote(card)); });
          sp.on('pointerout', function () { sp.y = sp.baseY; });
          sp.on('pointerdown', function () { self.onHandClick(card.id); });
        }
        sp.cardId = card.id;
        self.handSprites.push(sp);
      });
      var tp = this.topPlayer();
      var on = st.players[tp].hand.length;
      for (var i = 0; i < on; i++) {
        var o = this.add.image(560 + (i - (on - 1) / 2) * 34, 40, 'back-mini').setScale(0.34).setDepth(7).setAngle((i - (on - 1) / 2) * 4);
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
      h.oppAvatar.setTexture(this.avatarKey(tp));
      h.oppName.setText(st.players[tp].name).setColor(PCSS[tp]);
      if (!this.thinkingNow) h.oppSub.setText(st.players[tp].kind === 'bot' ? TT.BOTS[st.players[tp].bot].blurb.split(':')[0].split('.')[0] : 'Aguardando a vez');
      h.meAvatar.setTexture(this.avatarKey(bp));
      h.meName.setText(st.players[bp].name).setColor(PCSS[bp]);
      h.handTitle.setText('MÃO ' + (m.hand + 1) + ' · vale ' + m.value + (m.value === 1 ? ' tento' : ' tentos'));
      h.tentos.setText(m.target > 1
        ? st.players[0].name + ' ' + m.tentos[0] + ' × ' + m.tentos[1] + ' ' + st.players[1].name + '  ·  até ' + m.target + (TT.maoDeOnze(m) ? '  ·  MÃO DE ONZE' : '')
        : 'Mão única · sem truco');
      [tp, bp].forEach(function (p, i) {
        var b = h.blocks[i], pl = st.players[p];
        b.g.clear();
        var active = st.phase === 'play' && st.current === p;
        b.g.fillStyle(0x000000, active ? 0.45 : 0.25); b.g.fillRoundedRect(974, b.y, 288, 74, 8);
        b.g.fillStyle(PCOL[p], 1); b.g.fillRoundedRect(974, b.y, 6, 74, 3);
        if (active) { b.g.lineStyle(1.5, PCOL[p], 0.9); b.g.strokeRoundedRect(974, b.y, 288, 74, 8); }
        b.name.setText(pl.name + (active ? '  ◀ vez' : '')).setColor(PCSS[p]);
        var stuck = pl.status === 'building' && st.phase === 'play' && TT.revealTargets(st, p).length === 0;
        b.status.setText((stuck ? 'TRAVADA' : STATUS[pl.status]).toUpperCase() + ' · camada ' + Math.max(0, pl.path.length - 1) + '/6');
        b.detail.setText('mão ' + pl.hand.length + ' · dropouts ' + pl.dropouts + (pl.transferUsed ? ' · TL usado' : ''));
        var sc = self.scores[p];
        b.score.setText(String(sc.total)).setColor(sc.vanishing ? '#ff6b7a' : '#f5ecd6');
      });
      h.limboTxt.setText('Limbo ' + st.limbo.length);
      h.graveTxt.setText('Cemitério ' + st.graveyard.length);
      var top = st.graveyard[st.graveyard.length - 1];
      h.grave.setTexture(top ? TT.texMini(this, top, st.cfg.deck) : 'back-mini').setAlpha(top ? 1 : 0.25);
      var tline = 'Terreno: ' + TT.TERRAINS[st.cfg.terrain].name + ' · Baralho: ' + TT.DECKS[st.cfg.deck].name;
      if (st.cfg.terrain === 'oceano' && st.wind) tline += '\nVento: ' + TT.SUIT_INFO[st.wind].sym + ' ' + TT.SUIT_INFO[st.wind].name + ' vale dobro';
      if (st.cfg.terrain !== 'neutro') tline += '\nRodada ' + st.round;
      h.terrainTxt.setText(tline);
      /* botões */
      var my = this.isHumanTurn();
      var me = this.viewer;
      h.btnDrop.setEnabled(my && TT.trailingHidden(st, me) > 0 && st.players[me].hand.length > 0);
      h.btnDrop.label.setText(this.mode === 'dropout' || this.mode === 'dropout-pay' ? 'Cancelar' : 'Dropout');
      h.btnTransfer.setEnabled(my && !!TT.transferRank(st, me));
      h.btnPass.setEnabled(my && TT.canPass(st, me));
      var canT = my && TT.canTruco(m, me);
      h.truco.setEnabled(canT);
      var nxt = TT.nextStake(m.value);
      h.truco.label.setText(m.target <= 1 ? 'SEM TRUCO' : TT.maoDeOnze(m) ? 'MÃO DE ONZE' : nxt ? TT.TRUCO_SHOUT[nxt] : 'VALE TUDO');
      /* log */
      var lines = st.log.slice(-8);
      h.log.setText(lines.join('\n'));
      this.renderChart();
      h.hint.setText(this.hoverHint || this.hintText());
    }

    renderChart() {
      var g = this.chartG, hist = this.st.history;
      g.clear();
      var x0 = 978, y0 = 386, w = 280, hgt = 66;
      g.fillStyle(0x000000, 0.25); g.fillRoundedRect(x0 - 4, y0 - hgt - 6, w + 8, hgt + 12, 6);
      var max = 40;
      hist.forEach(function (r) { r.forEach(function (v) { max = Math.max(max, v); }); });
      max = Math.ceil(max / 20) * 20;
      this.hud.chartMax.setText(max + ' pts');
      g.lineStyle(1, 0xd9b260, 0.18);
      [0.5, 1].forEach(function (f) { g.lineBetween(x0, y0 - hgt * f, x0 + w, y0 - hgt * f); });
      var nPts = Math.max(2, hist.length);
      [0, 1].forEach(function (p) {
        g.lineStyle(2.5, PCOL[p], 1);
        g.beginPath();
        hist.forEach(function (r, i) {
          var x = x0 + (i / (nPts - 1)) * w, y = y0 - (r[p] / max) * hgt;
          if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
        });
        g.strokePath();
        var last = hist[hist.length - 1];
        if (last) { g.fillStyle(PCOL[p], 1); g.fillCircle(x0 + ((hist.length - 1) / (nPts - 1)) * w, y0 - (last[p] / max) * hgt, 3.5); }
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
      if (!over) { this.hoverHint = null; this.hud.hint.setText(this.hintText()); return; }
      if (slot.removed) return;
      if (slot.faceUp) {
        var owner = slot.owner >= 0 ? st.players[slot.owner].name : '';
        var sc = slot.owner >= 0 ? this.scores[slot.owner].neurons.find(function (n) { return n.slot.id === id; }) : null;
        this.showPreview(TT.texFull(this, slot.cards[0], deck), 'Neurônio de ' + owner + (sc ? ': vale ' + sc.v + (sc.notes.length ? ' (' + sc.notes.join(', ') + ')' : '') : '') + (slot.cards.length > 1 ? ' · ' + slot.cards.length + ' cartas empilhadas' : ''));
      } else if (slot.known) {
        this.showPreview(TT.texFull(this, slot.cards[0], deck), 'Neurônio desvirado por dropout. Todos lembram que é ' + TT.cardLabel(slot.cards[0]) + '.');
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
        this.hud.hint.setText(txt);
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
        this.hud.hint.setText('Nenhuma jogada possível: passando a vez.');
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
          self.tweens.add({ targets: o.sp, scaleX: MS, duration: 200, ease: 'Sine.out' });
          TT.Sfx.flip();
          var xy = self.slotXY(ev.slot);
          var neuron = self.scores[ev.p].neurons.find(function (n) { return n.slot.id === ev.slot; });
          self.floatText(xy.x, xy.y - 50, '+' + (neuron ? neuron.v : 0), PCSS[ev.p], 22);
          self.showPreview(TT.texFull(self, ev.card, deck), st.players[ev.p].name + ' ativou ' + TT.cardName(ev.card, deck) + '.');
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
          var ghost = self.add.image(xy3.x, xy3.y, TT.texMini(self, ev.cards[0], deck)).setScale(MS).setDepth(15);
          self.tweens.add({ targets: ghost, x: '+=6', yoyo: true, repeat: 4, duration: 50, delay: 300 });
          self.tweens.add({ targets: ghost, alpha: 0, scale: MS * 1.5, angle: 25, duration: 500, delay: 560, onComplete: function () { ghost.destroy(); } });
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
            self.tweens.add({ targets: o2.sp, scaleX: MS, duration: 220, delay: i * 120 });
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
              var img = self.add.image(520 + i * 180, 330, TT.texFull(self, c, deck)).setScale(0.5).setDepth(25).setAlpha(0);
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
      var img = this.add.image(x0, y0, TT.texMini(this, card, this.st.cfg.deck)).setScale(0.6).setDepth(16);
      this.tweens.add({ targets: img, x: x1 + 8, y: y1 - 8, scale: MS, angle: 8, duration: 320, delay: delay || 0, ease: 'Cubic.out', onComplete: function () { img.destroy(); } });
    }

    burst(x, y, color, n) {
      var em = this.add.particles(x, y, 'spark', { speed: { min: 80, max: 260 }, lifespan: 650, scale: { start: 0.9, end: 0 }, tint: color, blendMode: 'ADD', emitting: false }).setDepth(18);
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
