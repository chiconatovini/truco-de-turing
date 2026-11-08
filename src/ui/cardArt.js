/* Arte procedural das cartas: moldura de "card game de fantasia" + naipes espanhóis do truco.
 * Tudo desenhado em canvas 2D (sem imagens externas). */
var TT = (globalThis.TT = globalThis.TT || {});

(function () {
  var FULL_W = 240, FULL_H = 336, MINI_W = 120, MINI_H = 168;

  var FRAMES = {
    S: { name: 'aco', light: '#a9b8c8', mid: '#6d7f93', dark: '#253140', sky1: '#3a4d66', sky2: '#a8c0d8', ink: '#eaf2fb' },
    H: { name: 'rubi', light: '#e07a6e', mid: '#a5302f', dark: '#3d0f12', sky1: '#5a1820', sky2: '#e9967a', ink: '#ffe9e2' },
    C: { name: 'mata', light: '#8fc07f', mid: '#3e7349', dark: '#122a19', sky1: '#1f4a2c', sky2: '#b7d99a', ink: '#eaf7e2' },
    D: { name: 'ouro', light: '#f2d27a', mid: '#b98a2a', dark: '#3d2a08', sky1: '#6b4a12', sky2: '#f6dc8f', ink: '#fff6da' },
  };
  var PARCH = '#efe3c6', PARCH_D = '#d9c7a0', INK = '#24170c';

  function canvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function prng(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), seed | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function wrap(ctx, text, x, y, maxW, lh) {
    var lines = [];
    text.split('\n').forEach(function (para) {
      var words = para.split(' ');
      var line = '';
      words.forEach(function (w) {
        var t = line ? line + ' ' + w : w;
        if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
      });
      lines.push(line);
    });
    lines.forEach(function (l, i) { ctx.fillText(l, x, y + i * lh); });
    return lines.length;
  }

  function fitText(ctx, text, x, y, maxW, size, weight, family) {
    do { ctx.font = weight + ' ' + size + 'px ' + family; size -= 0.5; } while (ctx.measureText(text).width > maxW && size > 7);
    ctx.fillText(text, x, y);
  }

  /* ---------- Naipes espanhóis ---------- */
  function emblem(ctx, kind, cx, cy, s, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    if (rot) ctx.rotate(rot);
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(1, s * 0.035);
    ctx.strokeStyle = '#1a1208';
    var g;
    if (kind === 'espada') {
      g = ctx.createLinearGradient(-s * 0.08, 0, s * 0.08, 0);
      g.addColorStop(0, '#dfe7ef'); g.addColorStop(0.5, '#ffffff'); g.addColorStop(1, '#8796a8');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.5);
      ctx.lineTo(s * 0.075, -s * 0.38);
      ctx.lineTo(s * 0.06, s * 0.2);
      ctx.lineTo(-s * 0.06, s * 0.2);
      ctx.lineTo(-s * 0.075, -s * 0.38);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -s * 0.42); ctx.lineTo(0, s * 0.17); ctx.strokeStyle = 'rgba(40,50,60,.5)'; ctx.stroke();
      ctx.strokeStyle = '#1a1208';
      ctx.fillStyle = '#c9a03a';
      rr(ctx, -s * 0.24, s * 0.19, s * 0.48, s * 0.07, s * 0.03); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#6b3f1d';
      rr(ctx, -s * 0.045, s * 0.26, s * 0.09, s * 0.18, s * 0.02); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c9a03a';
      ctx.beginPath(); ctx.arc(0, s * 0.47, s * 0.06, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (kind === 'copa') {
      g = ctx.createLinearGradient(-s * 0.3, 0, s * 0.3, 0);
      g.addColorStop(0, '#9a6a14'); g.addColorStop(0.45, '#ffe08a'); g.addColorStop(1, '#a87516');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, -s * 0.32);
      ctx.bezierCurveTo(-s * 0.3, s * 0.02, -s * 0.12, s * 0.08, -s * 0.05, s * 0.1);
      ctx.lineTo(-s * 0.04, s * 0.28);
      ctx.bezierCurveTo(-s * 0.2, s * 0.32, -s * 0.24, s * 0.38, -s * 0.24, s * 0.42);
      ctx.lineTo(s * 0.24, s * 0.42);
      ctx.bezierCurveTo(s * 0.24, s * 0.38, s * 0.2, s * 0.32, s * 0.04, s * 0.28);
      ctx.lineTo(s * 0.05, s * 0.1);
      ctx.bezierCurveTo(s * 0.12, s * 0.08, s * 0.3, s * 0.02, s * 0.3, -s * 0.32);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#7a1424';
      ctx.beginPath(); ctx.ellipse(0, -s * 0.32, s * 0.3, s * 0.07, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c0283c';
      ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.06, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (kind === 'ouro') {
      g = ctx.createRadialGradient(-s * 0.1, -s * 0.12, s * 0.05, 0, 0, s * 0.42);
      g.addColorStop(0, '#fff3b8'); g.addColorStop(0.6, '#e6b43c'); g.addColorStop(1, '#9a6a14');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#b5781a';
      ctx.beginPath();
      for (var i = 0; i < 16; i++) {
        var a = (i / 16) * Math.PI * 2;
        var r = i % 2 ? s * 0.11 : s * 0.25;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff3b8';
      ctx.beginPath(); ctx.arc(0, 0, s * 0.07, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (kind === 'pau') {
      ctx.rotate(-0.35);
      g = ctx.createLinearGradient(-s * 0.1, 0, s * 0.1, 0);
      g.addColorStop(0, '#5a3214'); g.addColorStop(0.5, '#a8692e'); g.addColorStop(1, '#4a2810');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-s * 0.05, s * 0.48);
      ctx.lineTo(-s * 0.13, -s * 0.36);
      ctx.quadraticCurveTo(0, -s * 0.56, s * 0.13, -s * 0.36);
      ctx.lineTo(s * 0.05, s * 0.48);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#7a4a1e';
      [[-0.1, -0.15], [0.09, -0.02], [-0.07, 0.15], [0.07, 0.3]].forEach(function (k) {
        ctx.beginPath(); ctx.ellipse(k[0] * s, k[1] * s, s * 0.05, s * 0.035, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      ctx.fillStyle = '#3f8a3a';
      ctx.beginPath(); ctx.ellipse(s * 0.12, -s * 0.3, s * 0.07, s * 0.035, -0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }
  TT.drawEmblem = emblem;

  function crown(ctx, rank, cx, cy, s, col) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = col; ctx.strokeStyle = '#1a1208'; ctx.lineWidth = 2;
    ctx.beginPath();
    if (rank === 'K') {
      ctx.moveTo(-s * 0.5, s * 0.25); ctx.lineTo(-s * 0.5, -s * 0.2); ctx.lineTo(-s * 0.25, s * 0.02);
      ctx.lineTo(0, -s * 0.35); ctx.lineTo(s * 0.25, s * 0.02); ctx.lineTo(s * 0.5, -s * 0.2); ctx.lineTo(s * 0.5, s * 0.25);
    } else if (rank === 'Q') {
      ctx.moveTo(-s * 0.45, s * 0.25);
      ctx.quadraticCurveTo(-s * 0.5, -s * 0.15, -s * 0.2, -s * 0.05);
      ctx.quadraticCurveTo(0, -s * 0.4, s * 0.2, -s * 0.05);
      ctx.quadraticCurveTo(s * 0.5, -s * 0.15, s * 0.45, s * 0.25);
    } else {
      ctx.moveTo(-s * 0.45, s * 0.25); ctx.quadraticCurveTo(-s * 0.4, -s * 0.25, s * 0.1, -s * 0.22);
      ctx.quadraticCurveTo(s * 0.55, -s * 0.2, s * 0.5, s * 0.05); ctx.lineTo(s * 0.45, s * 0.25);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c0283c';
    ctx.beginPath(); ctx.arc(0, s * 0.08, s * 0.07, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (rank === 'J') { ctx.strokeStyle = '#f5f0e0'; ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.2); ctx.quadraticCurveTo(s * 0.4, -s * 0.6, s * 0.6, -s * 0.45); ctx.lineWidth = 3; ctx.stroke(); }
    ctx.restore();
  }

  function neuralBackdrop(ctx, x, y, w, h, rnd, color) {
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    var cols = 4, pts = [];
    for (var c = 0; c < cols; c++) {
      var n = 2 + Math.floor(rnd() * 3);
      var col = [];
      for (var i = 0; i < n; i++) col.push([x + w * (0.12 + 0.76 * c / (cols - 1)), y + h * (0.15 + 0.7 * (i + 0.5) / n) + (rnd() - 0.5) * 10]);
      pts.push(col);
    }
    ctx.strokeStyle = color; ctx.globalAlpha = 0.28;
    for (var c2 = 0; c2 < cols - 1; c2++) {
      pts[c2].forEach(function (a) {
        pts[c2 + 1].forEach(function (b) {
          ctx.lineWidth = 0.5 + rnd() * 2.2;
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        });
      });
    }
    ctx.globalAlpha = 0.45; ctx.fillStyle = color;
    pts.forEach(function (col) { col.forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2); ctx.fill(); }); });
    ctx.restore();
  }

  function pipLayout(n) {
    var L = {
      1: [[0.5, 0.5]], 2: [[0.5, 0.25], [0.5, 0.75]], 3: [[0.5, 0.18], [0.5, 0.5], [0.5, 0.82]],
      4: [[0.3, 0.27], [0.7, 0.27], [0.3, 0.73], [0.7, 0.73]], 5: [[0.3, 0.25], [0.7, 0.25], [0.5, 0.5], [0.3, 0.75], [0.7, 0.75]],
      6: [[0.3, 0.2], [0.7, 0.2], [0.3, 0.5], [0.7, 0.5], [0.3, 0.8], [0.7, 0.8]],
      7: [[0.3, 0.2], [0.7, 0.2], [0.5, 0.35], [0.3, 0.5], [0.7, 0.5], [0.3, 0.8], [0.7, 0.8]],
      8: [[0.3, 0.18], [0.7, 0.18], [0.5, 0.34], [0.3, 0.5], [0.7, 0.5], [0.5, 0.66], [0.3, 0.82], [0.7, 0.82]],
      9: [[0.25, 0.2], [0.5, 0.2], [0.75, 0.2], [0.25, 0.5], [0.5, 0.5], [0.75, 0.5], [0.25, 0.8], [0.5, 0.8], [0.75, 0.8]],
      10: [[0.2, 0.2], [0.4, 0.2], [0.6, 0.2], [0.8, 0.2], [0.3, 0.5], [0.7, 0.5], [0.2, 0.8], [0.4, 0.8], [0.6, 0.8], [0.8, 0.8]],
    };
    return L[n] || L[1];
  }

  function frameShell(ctx, W, H, fr, legendary) {
    ctx.fillStyle = '#0d0a08';
    rr(ctx, 0, 0, W, H, W * 0.06); ctx.fill();
    var g = ctx.createLinearGradient(0, 0, W, H);
    if (legendary) {
      g.addColorStop(0, '#fff1b0'); g.addColorStop(0.3, '#d4a12a'); g.addColorStop(0.55, '#fff6d0'); g.addColorStop(0.8, '#b07a12'); g.addColorStop(1, '#f6dc8f');
    } else {
      g.addColorStop(0, fr.light); g.addColorStop(0.5, fr.mid); g.addColorStop(1, fr.dark);
    }
    ctx.fillStyle = g;
    rr(ctx, W * 0.04, W * 0.04, W - W * 0.08, H - W * 0.08, W * 0.035); ctx.fill();
    /* textura sutil */
    var rnd = prng(hash(fr.name + W));
    ctx.globalAlpha = 0.12; ctx.fillStyle = '#000';
    for (var i = 0; i < W * 1.2; i++) ctx.fillRect(W * 0.05 + rnd() * W * 0.9, W * 0.05 + rnd() * (H - W * 0.1), 1, 1);
    ctx.globalAlpha = 1;
  }

  function plate(ctx, x, y, w, h, fr) {
    var g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, '#fbf4e2'); g.addColorStop(1, PARCH_D);
    ctx.fillStyle = g;
    rr(ctx, x, y, w, h, h * 0.45); ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = fr.dark; ctx.stroke();
  }

  TT.cardMeta = function (card, deckKey) {
    var deck = TT.DECKS[deckKey];
    var key = card.r + card.s;
    var manilha = deck.manilhas && deck.manilhas[key];
    var v = TT.baseValue(card, deckKey);
    var fig = TT.isFigure(card);
    var type = manilha ? 'Manilha — Neurônio Lendário' : fig ? 'Neurônio — Figura' : card.r === 'A' ? 'Neurônio — Ás' : 'Neurônio — Numérico';
    var rules;
    if (fig) rules = 'Ativa com 0. Tunagem: +10.\nPar vizinho +10 · Trio +20 · Quadra zera a rede.';
    else rules = (manilha ? 'Manilha: ' : '') + 'Ativa com ' + v + ' pontos.\nTunagem: empilhe outro ' + card.r + ' para somar o valor dele.';
    var flavor = (manilha && TT.FLAVOR[manilha]) || TT.FLAVOR[card.r];
    return { name: TT.cardName(card, deckKey), v: v, fig: fig, manilha: manilha, type: type, rules: rules, flavor: flavor };
  };

  /* ---------- Carta completa (inspeção e mão) ---------- */
  TT.drawFullCard = function (card, deckKey) {
    var c = canvas(FULL_W, FULL_H), ctx = c.getContext('2d');
    var fr = FRAMES[card.s];
    var meta = TT.cardMeta(card, deckKey);
    var si = TT.SUIT_INFO[card.s];
    var rnd = prng(hash(card.r + card.s + deckKey));
    frameShell(ctx, FULL_W, FULL_H, fr, !!meta.manilha);

    /* barra de nome + custo */
    plate(ctx, 16, 16, 208, 30, fr);
    ctx.fillStyle = INK; ctx.font = '700 15px Cinzel, Georgia, serif'; ctx.textBaseline = 'middle';
    var name = meta.name;
    var fs = 15;
    while (ctx.measureText(name).width > 150 && fs > 10) {
      fs--;
      ctx.font = '700 ' + fs + 'px Cinzel, Georgia, serif';
    }
    ctx.fillText(name, 26, 32);
    /* "custo" em gemas: valor da carta */
    var gem = meta.fig ? '0' : String(meta.v);
    ctx.font = '700 13px "Alegreya Sans", Arial, sans-serif';
    var gw = Math.max(22, ctx.measureText(gem).width + 12);
    var gx = 216 - gw;
    var gg = ctx.createRadialGradient(gx + gw / 2 - 3, 27, 2, gx + gw / 2, 31, 14);
    gg.addColorStop(0, '#ffffff'); gg.addColorStop(1, fr.light);
    ctx.fillStyle = gg; rr(ctx, gx, 20, gw, 22, 11); ctx.fill();
    ctx.strokeStyle = fr.dark; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText(gem, gx + gw / 2, 32); ctx.textAlign = 'left';

    /* janela de arte */
    var ax = 20, ay = 52, aw = 200, ah = 132;
    var sky = ctx.createLinearGradient(0, ay, 0, ay + ah);
    sky.addColorStop(0, fr.sky1); sky.addColorStop(1, fr.sky2);
    ctx.fillStyle = sky; ctx.fillRect(ax, ay, aw, ah);
    neuralBackdrop(ctx, ax, ay, aw, ah, rnd, fr.ink);
    /* raios de luz */
    ctx.save(); ctx.beginPath(); ctx.rect(ax, ay, aw, ah); ctx.clip();
    ctx.globalAlpha = 0.12; ctx.fillStyle = '#fff';
    for (var i = 0; i < 6; i++) {
      var a0 = -Math.PI / 2 + (i - 2.5) * 0.35;
      ctx.beginPath(); ctx.moveTo(ax + aw / 2, ay + ah * 0.55);
      ctx.lineTo(ax + aw / 2 + Math.cos(a0 - 0.08) * 220, ay + ah * 0.55 + Math.sin(a0 - 0.08) * 220);
      ctx.lineTo(ax + aw / 2 + Math.cos(a0 + 0.08) * 220, ay + ah * 0.55 + Math.sin(a0 + 0.08) * 220);
      ctx.fill();
    }
    ctx.restore(); ctx.globalAlpha = 1;
    if (meta.fig) {
      var cx = ax + aw / 2;
      /* silhueta */
      ctx.fillStyle = 'rgba(10,8,6,.55)';
      ctx.beginPath(); ctx.arc(cx, ay + 62, 22, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - 52, ay + ah); ctx.quadraticCurveTo(cx - 48, ay + 86, cx, ay + 84); ctx.quadraticCurveTo(cx + 48, ay + 86, cx + 52, ay + ah); ctx.fill();
      crown(ctx, card.r, cx, ay + 36, 46, card.r === 'K' ? '#f2c94c' : card.r === 'Q' ? '#e8d6ff' : '#c7462f');
      emblem(ctx, si.emblem, cx + 50, ay + 92, 58, 0.25);
      ctx.font = '900 30px Cinzel, Georgia, serif'; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.textAlign = 'center';
      ctx.fillText(card.r, ax + 26, ay + 26); ctx.textAlign = 'left';
    } else {
      var n = card.r === 'A' ? 1 : parseInt(card.r, 10);
      var size = n === 1 ? 104 : n <= 3 ? 46 : n <= 6 ? 38 : 30;
      pipLayout(n).forEach(function (p, k) {
        emblem(ctx, si.emblem, ax + aw * p[0], ay + ah * p[1], size, (rnd() - 0.5) * 0.3 + (k % 2 ? 0.1 : -0.1));
      });
    }
    if (meta.manilha) {
      ctx.save(); ctx.globalCompositeOperation = 'overlay';
      var holo = ctx.createLinearGradient(ax, ay, ax + aw, ay + ah);
      holo.addColorStop(0, 'rgba(255,0,180,.35)'); holo.addColorStop(0.5, 'rgba(0,220,255,.35)'); holo.addColorStop(1, 'rgba(255,230,0,.35)');
      ctx.fillStyle = holo; ctx.fillRect(ax, ay, aw, ah); ctx.restore();
    }
    ctx.lineWidth = 3; ctx.strokeStyle = '#120d08'; ctx.strokeRect(ax, ay, aw, ah);

    /* linha de tipo */
    plate(ctx, 16, 188, 208, 24, fr);
    ctx.fillStyle = INK;
    fitText(ctx, meta.type, 25, 201, 172, 11, '700', 'Cinzel, Georgia, serif');
    /* símbolo de coleção: nabla do gradiente */
    ctx.fillStyle = fr.mid; ctx.beginPath(); ctx.moveTo(204, 194); ctx.lineTo(216, 194); ctx.lineTo(210, 206); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();

    /* caixa de texto */
    var tg = ctx.createLinearGradient(0, 216, 0, 304);
    tg.addColorStop(0, '#f5ecd6'); tg.addColorStop(1, PARCH);
    ctx.fillStyle = tg; ctx.fillRect(22, 216, 196, 88);
    ctx.strokeStyle = fr.dark; ctx.lineWidth = 1.5; ctx.strokeRect(22, 216, 196, 88);
    ctx.fillStyle = INK; ctx.font = '500 12px Alegreya, Georgia, serif'; ctx.textBaseline = 'top';
    var used = wrap(ctx, meta.rules, 30, 222, 180, 14);
    ctx.font = 'italic 11px Alegreya, Georgia, serif'; ctx.fillStyle = '#4b3a26';
    wrap(ctx, meta.flavor, 30, 228 + used * 14, 150, 13);

    /* caixa de "poder" */
    var pv = meta.fig ? '0' : String(meta.v);
    plate(ctx, 166, 290, 58, 28, fr);
    ctx.fillStyle = INK; ctx.font = '900 17px "Alegreya Sans", Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(pv + ' ' + si.sym, 195, 305);
    ctx.textAlign = 'left';
    /* linha de colecionador */
    ctx.font = '500 8px "Alegreya Sans", Arial, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.textBaseline = 'alphabetic';
    var idx = TT.SUITS.indexOf(card.s) * 13 + TT.RANKS.indexOf(card.r) + 1;
    ctx.fillText('TdT · FPO 2026/2 · ' + idx + '/52', 18, 318);
    ctx.fillText('Arte gerada por código', 18, 327);
    return c;
  };

  /* ---------- Carta da mesa (neurônio) ---------- */
  TT.drawMiniCard = function (card, deckKey) {
    var c = canvas(MINI_W, MINI_H), ctx = c.getContext('2d');
    var fr = FRAMES[card.s];
    var meta = TT.cardMeta(card, deckKey);
    var si = TT.SUIT_INFO[card.s];
    frameShell(ctx, MINI_W, MINI_H, fr, !!meta.manilha);
    var g = ctx.createLinearGradient(0, 10, 0, MINI_H - 10);
    g.addColorStop(0, '#fbf5e6'); g.addColorStop(1, PARCH);
    ctx.fillStyle = g; rr(ctx, 10, 10, MINI_W - 20, MINI_H - 20, 8); ctx.fill();
    ctx.strokeStyle = fr.dark; ctx.lineWidth = 2; ctx.stroke();
    var red = si.red;
    ctx.fillStyle = red ? '#a8232f' : '#1d1a17';
    ctx.textBaseline = 'top'; ctx.textAlign = 'left';
    ctx.font = '900 30px Cinzel, Georgia, serif';
    ctx.fillText(card.r, 16, 14);
    ctx.font = '700 24px Arial, sans-serif';
    ctx.fillText(si.sym, 18, 46);
    if (meta.fig) {
      crown(ctx, card.r, 72, 70, 40, card.r === 'K' ? '#f2c94c' : card.r === 'Q' ? '#e8d6ff' : '#c7462f');
      emblem(ctx, si.emblem, 66, 112, 52, 0.2);
    } else {
      emblem(ctx, si.emblem, 70, 88, card.r === 'A' ? 78 : 64, 0.1);
    }
    /* selo de valor */
    var vtxt = meta.fig ? '0' : String(meta.v);
    ctx.fillStyle = fr.dark; ctx.beginPath(); ctx.arc(MINI_W - 26, MINI_H - 26, 16, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = meta.manilha ? '#ffe28a' : fr.light; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '900 16px "Alegreya Sans", Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(vtxt, MINI_W - 26, MINI_H - 25);
    return c;
  };

  /* ---------- Verso ---------- */
  TT.drawCardBack = function (w, h) {
    var c = canvas(w, h), ctx = c.getContext('2d');
    var k = w / FULL_W;
    ctx.scale(k, k);
    var W = FULL_W, H = FULL_H;
    ctx.fillStyle = '#0d0a08'; rr(ctx, 0, 0, W, H, 14); ctx.fill();
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#6e1420'); g.addColorStop(1, '#3a0a14');
    ctx.fillStyle = g; rr(ctx, 10, 10, W - 20, H - 20, 10); ctx.fill();
    ctx.save(); rr(ctx, 10, 10, W - 20, H - 20, 10); ctx.clip();
    ctx.strokeStyle = 'rgba(232,190,110,.22)'; ctx.lineWidth = 1.2;
    for (var i = -H; i < W + H; i += 16) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i, H); ctx.lineTo(i + H, 0); ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = '#d9b260'; ctx.lineWidth = 3; rr(ctx, 18, 18, W - 36, H - 36, 8); ctx.stroke();
    ctx.lineWidth = 1; rr(ctx, 24, 24, W - 48, H - 48, 6); ctx.stroke();
    /* medalhão */
    var mg = ctx.createRadialGradient(W / 2, H / 2 - 10, 10, W / 2, H / 2, 80);
    mg.addColorStop(0, '#2a1a10'); mg.addColorStop(1, '#120b06');
    ctx.fillStyle = mg; ctx.beginPath(); ctx.ellipse(W / 2, H / 2, 72, 96, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#d9b260'; ctx.lineWidth = 3; ctx.stroke();
    /* mini rede 3-4-2 */
    var cols = [[3, -44], [4, 0], [2, 44]];
    var pts = cols.map(function (cc) {
      var arr = [];
      for (var j = 0; j < cc[0]; j++) arr.push([W / 2 + cc[1], H / 2 - 18 + (j - (cc[0] - 1) / 2) * 22]);
      return arr;
    });
    ctx.strokeStyle = 'rgba(217,178,96,.7)'; ctx.lineWidth = 1.2;
    for (var a = 0; a < 2; a++) pts[a].forEach(function (p) { pts[a + 1].forEach(function (q) { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }); });
    pts.forEach(function (col, ci) {
      col.forEach(function (p) {
        ctx.fillStyle = ci === 1 ? '#f59322' : '#4aa3df';
        ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#d9b260'; ctx.stroke();
      });
    });
    ctx.fillStyle = '#e8c878'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 15px Cinzel, Georgia, serif';
    ctx.fillText('TRUCO DE', W / 2, H / 2 + 46);
    ctx.fillText('TURING', W / 2, H / 2 + 64);
    return c;
  };

  /* ---------- Cartas de terreno ---------- */
  TT.drawTerrainCard = function (key) {
    var c = canvas(FULL_W, FULL_H), ctx = c.getContext('2d');
    var pal = {
      neutro: { light: '#9fc79a', mid: '#3c6e47', dark: '#13291a', name: 'neutro' },
      montanha: { light: '#e0a27c', mid: '#8a4b2c', dark: '#2e160b', name: 'montanha' },
      pantano: { light: '#a7a08a', mid: '#4b4a3b', dark: '#18170f', name: 'pantano' },
      oceano: { light: '#8fd0e6', mid: '#2a6f93', dark: '#0b2433', name: 'oceano' },
    }[key];
    var t = TT.TERRAINS[key];
    var rnd = prng(hash(key));
    frameShell(ctx, FULL_W, FULL_H, pal, false);
    plate(ctx, 16, 16, 208, 30, pal);
    ctx.fillStyle = INK; ctx.font = '700 16px Cinzel, Georgia, serif'; ctx.textBaseline = 'middle';
    ctx.fillText(t.name, 26, 32);
    var ax = 20, ay = 52, aw = 200, ah = 132;
    ctx.save(); ctx.beginPath(); ctx.rect(ax, ay, aw, ah); ctx.clip();
    var sky = ctx.createLinearGradient(0, ay, 0, ay + ah);
    if (key === 'montanha') { sky.addColorStop(0, '#f6c48a'); sky.addColorStop(1, '#c4683d'); }
    else if (key === 'pantano') { sky.addColorStop(0, '#5d6a52'); sky.addColorStop(1, '#232a1e'); }
    else if (key === 'oceano') { sky.addColorStop(0, '#bfe7f4'); sky.addColorStop(1, '#2f7fa8'); }
    else { sky.addColorStop(0, '#2b5c37'); sky.addColorStop(1, '#173a22'); }
    ctx.fillStyle = sky; ctx.fillRect(ax, ay, aw, ah);
    if (key === 'montanha') {
      [['#6b3a24', 0.8], ['#4a2414', 1]].forEach(function (m, li) {
        ctx.fillStyle = m[0];
        ctx.beginPath(); ctx.moveTo(ax, ay + ah);
        for (var x = 0; x <= aw; x += 20) ctx.lineTo(ax + x, ay + ah * (0.35 + 0.15 * li) + Math.abs(Math.sin(x * 0.03 + li * 2)) * 40 * m[1] + rnd() * 10);
        ctx.lineTo(ax + aw, ay + ah); ctx.fill();
      });
      ctx.fillStyle = '#fff6e8'; ctx.beginPath(); ctx.moveTo(ax + 100, ay + 40); ctx.lineTo(ax + 88, ay + 58); ctx.lineTo(ax + 112, ay + 58); ctx.fill();
      ctx.strokeStyle = '#ffe9b0'; ctx.setLineDash([4, 4]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ax + 20, ay + ah - 6); ctx.quadraticCurveTo(ax + 90, ay + 90, ax + 100, ay + 52); ctx.stroke(); ctx.setLineDash([]);
    } else if (key === 'pantano') {
      for (var tr = 0; tr < 7; tr++) {
        var x0 = ax + rnd() * aw, h0 = 50 + rnd() * 70;
        ctx.strokeStyle = '#1a1c12'; ctx.lineWidth = 4 + rnd() * 4;
        ctx.beginPath(); ctx.moveTo(x0, ay + ah); ctx.quadraticCurveTo(x0 + (rnd() - 0.5) * 30, ay + ah - h0 / 2, x0 + (rnd() - 0.5) * 20, ay + ah - h0); ctx.stroke();
      }
      ctx.fillStyle = '#20261a'; ctx.fillRect(ax, ay + ah - 34, aw, 34);
      ctx.globalAlpha = 0.35; ctx.fillStyle = '#d8e2c8';
      for (var mi = 0; mi < 5; mi++) { ctx.beginPath(); ctx.ellipse(ax + rnd() * aw, ay + ah - 30 + rnd() * 20, 50, 7, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#c8ff8a';
      for (var e = 0; e < 3; e++) { ctx.beginPath(); ctx.arc(ax + 40 + e * 60, ay + ah - 14, 3, 0, Math.PI * 2); ctx.fill(); }
    } else if (key === 'oceano') {
      for (var wv = 0; wv < 6; wv++) {
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.3 + wv * 0.1) + ')'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (var x2 = 0; x2 <= aw; x2 += 4) ctx.lineTo(ax + x2, ay + 60 + wv * 13 + Math.sin(x2 * 0.08 + wv) * 4);
        ctx.stroke();
      }
      ctx.save(); ctx.translate(ax + 160, ay + 34);
      ctx.strokeStyle = '#123'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#c0283c'; ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(5, 0); ctx.lineTo(-5, 0); ctx.fill();
      ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(5, 0); ctx.lineTo(-5, 0); ctx.fill();
      ctx.restore();
    } else {
      ctx.globalAlpha = 0.08; ctx.fillStyle = '#000';
      for (var nz = 0; nz < 900; nz++) ctx.fillRect(ax + rnd() * aw, ay + rnd() * ah, 1, 1);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#f2ebe0'; ctx.beginPath(); ctx.ellipse(ax + 100, ay + 92, 26, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#efe6d8'; rr(ctx, ax + 84, ay + 60, 32, 30, 6); ctx.fill();
      ctx.fillStyle = '#3b2010'; ctx.beginPath(); ctx.ellipse(ax + 100, ay + 62, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ax + 95, ay + 52); ctx.quadraticCurveTo(ax + 90, ay + 40, ax + 98, ay + 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ax + 105, ay + 52); ctx.quadraticCurveTo(ax + 112, ay + 42, ax + 104, ay + 32); ctx.stroke();
    }
    ctx.restore();
    ctx.lineWidth = 3; ctx.strokeStyle = '#120d08'; ctx.strokeRect(ax, ay, aw, ah);
    plate(ctx, 16, 188, 208, 24, pal);
    ctx.fillStyle = INK;
    fitText(ctx, 'Terreno — Distribuição de dados', 25, 201, 190, 11, '700', 'Cinzel, Georgia, serif');
    ctx.fillStyle = '#f5ecd6'; ctx.fillRect(22, 216, 196, 100);
    ctx.strokeStyle = pal.dark; ctx.lineWidth = 1.5; ctx.strokeRect(22, 216, 196, 100);
    ctx.fillStyle = INK; ctx.font = '500 12.5px Alegreya, Georgia, serif'; ctx.textBaseline = 'top';
    wrap(ctx, t.short, 30, 224, 180, 15);
    return c;
  };

  /* ---------- Avatares ---------- */
  TT.drawAvatar = function (kind, colorHex) {
    var S = 112, c = canvas(S, S), ctx = c.getContext('2d');
    ctx.beginPath(); ctx.arc(S / 2, S / 2, S / 2 - 3, 0, Math.PI * 2);
    var g = ctx.createRadialGradient(S / 2, S / 3, 5, S / 2, S / 2, S / 2);
    g.addColorStop(0, '#3a2a1c'); g.addColorStop(1, '#140d08');
    ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = colorHex; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(S / 2, S / 2, S / 2 - 6, 0, Math.PI * 2); ctx.clip();
    if (kind === 'gato') {
      ctx.fillStyle = '#2b3442';
      ctx.beginPath(); ctx.moveTo(26, 46); ctx.lineTo(32, 16); ctx.lineTo(50, 34); ctx.lineTo(62, 34); ctx.lineTo(80, 16); ctx.lineTo(86, 46);
      ctx.quadraticCurveTo(94, 90, 56, 96); ctx.quadraticCurveTo(18, 90, 26, 46); ctx.fill();
      ctx.fillStyle = '#4ad7ff';
      ctx.beginPath(); ctx.ellipse(42, 56, 8, 6, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(70, 56, 8, 6, -0.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#081018'; ctx.fillRect(41, 51, 2, 10); ctx.fillRect(69, 51, 2, 10);
      ctx.fillStyle = '#f59322'; ctx.beginPath(); ctx.moveTo(52, 70); ctx.lineTo(60, 70); ctx.lineTo(56, 75); ctx.fill();
      ctx.strokeStyle = '#cfd8e2'; ctx.lineWidth = 1.2;
      [[-1, 70], [-1, 76], [1, 70], [1, 76]].forEach(function (w) { ctx.beginPath(); ctx.moveTo(56 + w[0] * 10, w[1]); ctx.lineTo(56 + w[0] * 34, w[1] - 4 + (w[1] - 70)); ctx.stroke(); });
      ctx.strokeStyle = '#f59322'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(56, 40, 30, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    } else if (kind === 'mc') {
      ctx.fillStyle = '#4b2a6b';
      ctx.beginPath(); ctx.moveTo(56, 6); ctx.lineTo(86, 60); ctx.lineTo(26, 60); ctx.fill();
      ctx.fillStyle = '#f2c94c';
      for (var s = 0; s < 5; s++) { ctx.beginPath(); ctx.arc(44 + s * 7, 30 + (s % 2) * 12, 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.save(); ctx.translate(56, 78); ctx.rotate(0.3);
      ctx.fillStyle = '#f5efe0'; rr(ctx, -20, -20, 40, 40, 6); ctx.fill(); ctx.strokeStyle = '#222'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#c0283c';
      [[-10, -10], [10, -10], [0, 0], [-10, 10], [10, 10]].forEach(function (d) { ctx.beginPath(); ctx.arc(d[0], d[1], 3.5, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();
    } else if (kind === 'ruido') {
      var rnd = prng(7);
      for (var y = 0; y < S; y += 3) for (var x = 0; x < S; x += 3) {
        var v = Math.floor(rnd() * 255);
        ctx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; ctx.fillRect(x, y, 3, 3);
      }
      ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, 48, S, 18);
      ctx.fillStyle = '#fff'; ctx.font = '700 12px "Alegreya Sans", Arial'; ctx.textAlign = 'center'; ctx.fillText('SEM SINAL', 56, 61);
    } else {
      ctx.fillStyle = colorHex;
      ctx.beginPath(); ctx.arc(56, 44, 18, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(20, 104); ctx.quadraticCurveTo(22, 66, 56, 66); ctx.quadraticCurveTo(90, 66, 92, 104); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '900 18px Cinzel, Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(kind === 'p2' ? 'II' : 'I', 56, 45);
    }
    ctx.restore();
    return c;
  };

  TT.CARD_SIZES = { FULL_W: FULL_W, FULL_H: FULL_H, MINI_W: MINI_W, MINI_H: MINI_H };
})();
