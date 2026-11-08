/* Arte procedural das cartas, em alta resolução.
 *
 * Todas as funções desenham em coordenadas-base (carta completa 240x336, carta de mesa 120x168)
 * e recebem um fator de densidade S: o canvas real tem (base x S) pixels. Assim a mesma arte sai
 * nítida num celular, num tablet ou num monitor 4K, sem nenhuma imagem externa.
 *
 * Linguagem visual: moldura de card game de fantasia (borda preta, moldura texturizada na cor do
 * naipe, barra de nome, gemas de custo, janela de arte, linha de tipo com símbolo de raridade,
 * caixa de regras com marca d'água, caixa de "poder") + naipes espanhóis do truco. */
var TT = (globalThis.TT = globalThis.TT || {});

(function () {
  var FULL_W = 240, FULL_H = 336, MINI_W = 120, MINI_H = 168;
  var INK = '#1d140b';
  var SYMBOL_FONT = '"Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2", "DejaVu Sans", Arial, sans-serif';

  /* Paletas por naipe: moldura, céu do cenário, brilho, gema e barra de título */
  var PAL = {
    S: { light: '#d7e2ee', mid: '#7f95ad', dark: '#1f2c3b', gem: '#4f86c9', glow: '#cfe6ff', title: '#e3eaf2', titleD: '#a9b8c9', sky: ['#0d1626', '#2b4466', '#8fa9c6'], ink: '#dfeeff' },
    H: { light: '#f6b4a4', mid: '#b2353a', dark: '#3a0b10', gem: '#d42a3c', glow: '#ffd59a', title: '#f4e0d8', titleD: '#d0a596', sky: ['#1d0508', '#5e1418', '#c2533d'], ink: '#ffe3d6' },
    C: { light: '#bfe0a8', mid: '#4f8a52', dark: '#112a17', gem: '#3a9e55', glow: '#eaffb8', title: '#e0ecd6', titleD: '#a8bf98', sky: ['#081a10', '#24502f', '#9cc178'], ink: '#efffe0' },
    D: { light: '#fff0b8', mid: '#cf9a2e', dark: '#4a3008', gem: '#e4a92c', glow: '#fff4c2', title: '#f8ecd2', titleD: '#d8be8a', sky: ['#2a1206', '#9a4a14', '#f4bf5c'], ink: '#fff6dc' },
  };
  TT.SUIT_PAL = PAL;

  /* ---------------------------------------------------------------- utilidades */
  function mk(w, h, S) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * S));
    c.height = Math.max(1, Math.round(h * S));
    var ctx = c.getContext('2d');
    ctx.scale(c.width / w, c.height / h);
    ctx.imageSmoothingQuality = 'high';
    return { c: c, ctx: ctx };
  }
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
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
  function lin(ctx, x0, y0, x1, y1, stops) {
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(function (s) { g.addColorStop(s[0], s[1]); });
    return g;
  }
  function rad(ctx, x0, y0, r0, x1, y1, r1, stops) {
    var g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    stops.forEach(function (s) { g.addColorStop(s[0], s[1]); });
    return g;
  }
  function wrap(ctx, text, x, y, maxW, lh) {
    var lines = [];
    text.split('\n').forEach(function (para) {
      var line = '';
      para.split(' ').forEach(function (w) {
        var t = line ? line + ' ' + w : w;
        if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
      });
      lines.push(line);
    });
    lines.forEach(function (l, i) { ctx.fillText(l, x, y + i * lh); });
    return lines.length;
  }
  function fitFont(ctx, text, maxW, size, weight, family, min) {
    do { ctx.font = weight + ' ' + size + 'px ' + family; size -= 0.25; } while (ctx.measureText(text).width > maxW && size > (min || 7));
  }
  /* textura de grão: pontinhos claros e escuros */
  function grain(ctx, x, y, w, h, rnd, amount, alpha) {
    var n = Math.floor(w * h * (amount || 0.06));
    for (var i = 0; i < n; i++) {
      ctx.fillStyle = rnd() < 0.5 ? 'rgba(255,255,255,' + (alpha || 0.06) * rnd() + ')' : 'rgba(0,0,0,' + (alpha || 0.06) * 1.4 * rnd() + ')';
      ctx.fillRect(x + rnd() * w, y + rnd() * h, 0.6 + rnd() * 0.8, 0.6 + rnd() * 0.8);
    }
  }
  /* linhas de escova (metal/pedra da moldura) */
  function brushed(ctx, x, y, w, h, rnd, alpha) {
    ctx.lineWidth = 0.5;
    for (var i = 0; i < (w * h) / 55; i++) {
      var px = x + rnd() * w, py = y + rnd() * h, len = 3 + rnd() * 9, a = -0.6 + rnd() * 0.25;
      ctx.strokeStyle = rnd() < 0.5 ? 'rgba(255,255,255,' + alpha * rnd() + ')' : 'rgba(0,0,0,' + alpha * rnd() + ')';
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a) * len, py + Math.sin(a) * len); ctx.stroke();
    }
  }
  function softShadow(ctx, blur, oy, alpha) {
    ctx.shadowColor = 'rgba(0,0,0,' + (alpha == null ? 0.55 : alpha) + ')';
    ctx.shadowBlur = blur; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = oy || 0;
  }
  function noShadow(ctx) { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
  function glowDisc(ctx, x, y, r, col, a) {
    ctx.fillStyle = rad(ctx, x, y, 0, x, y, r, [[0, hexA(col, a == null ? 0.75 : a)], [0.45, hexA(col, (a == null ? 0.75 : a) * 0.35)], [1, hexA(col, 0)]]);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    var m = f < 0 ? 0 : 255, t = Math.abs(f);
    r = Math.round(r + (m - r) * t); g = Math.round(g + (m - g) * t); b = Math.round(b + (m - b) * t);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  /* ---------------------------------------------------------------- moldura */
  function frameBody(ctx, W, H, P, rnd, legendary) {
    ctx.fillStyle = '#0a0806';
    rr(ctx, 0, 0, W, H, W * 0.052); ctx.fill();
    var m = W * 0.034, x = m, y = m, w = W - 2 * m, h = H - 2 * m, r = W * 0.03;
    ctx.save();
    rr(ctx, x, y, w, h, r); ctx.clip();
    if (legendary) {
      ctx.fillStyle = lin(ctx, x, y, x + w, y + h, [[0, '#fff3c4'], [0.2, '#d6a23a'], [0.42, '#fff8dc'], [0.6, '#b9801b'], [0.8, '#f9e08f'], [1, '#8a5a10']]);
    } else {
      ctx.fillStyle = lin(ctx, x, y, x + w * 0.7, y + h, [[0, P.light], [0.32, P.mid], [0.75, shade(P.mid, -0.35)], [1, P.dark]]);
    }
    ctx.fillRect(x, y, w, h);
    brushed(ctx, x, y, w, h, rnd, 0.16);
    grain(ctx, x, y, w, h, rnd, 0.05, 0.1);
    /* brilho diagonal */
    ctx.fillStyle = lin(ctx, x, y, x + w, y + h * 0.6, [[0, 'rgba(255,255,255,.28)'], [0.35, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']]);
    ctx.fillRect(x, y, w, h);
    if (legendary) {
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = lin(ctx, x, y, x + w, y + h, [[0, 'rgba(255,60,190,.45)'], [0.33, 'rgba(60,220,255,.4)'], [0.66, 'rgba(255,240,60,.45)'], [1, 'rgba(160,80,255,.45)']]);
      ctx.fillRect(x, y, w, h);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    /* bisel */
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; rr(ctx, x + 0.8, y + 0.8, w - 1.6, h - 1.6, r); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.55)'; rr(ctx, x + 2.2, y + 2.2, w - 4.4, h - 4.4, r * 0.8); ctx.stroke();
  }

  /* placa (barra de nome / linha de tipo / caixa de poder) */
  function plate(ctx, x, y, w, h, P, opts) {
    opts = opts || {};
    var r = opts.r != null ? opts.r : h * 0.42;
    softShadow(ctx, 3, 1.5, 0.6);
    ctx.fillStyle = '#000'; rr(ctx, x, y, w, h, r); ctx.fill();
    noShadow(ctx);
    ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, '#fffaf0'], [0.18, P.title], [0.85, P.titleD], [1, shade(P.titleD, -0.25)]]);
    rr(ctx, x, y, w, h, r); ctx.fill();
    ctx.lineWidth = 1.3; ctx.strokeStyle = '#120c07'; ctx.stroke();
    ctx.lineWidth = 0.8; ctx.strokeStyle = 'rgba(255,255,255,.75)';
    ctx.beginPath(); ctx.moveTo(x + r * 0.7, y + 1.4); ctx.lineTo(x + w - r * 0.7, y + 1.4); ctx.stroke();
  }

  /* gema redonda (símbolo de custo) */
  function gem(ctx, cx, cy, r, col, label, opts) {
    opts = opts || {};
    softShadow(ctx, 2.5, 1.2, 0.7);
    ctx.fillStyle = '#0b0907'; ctx.beginPath(); ctx.arc(cx, cy, r + 0.9, 0, Math.PI * 2); ctx.fill();
    noShadow(ctx);
    ctx.fillStyle = rad(ctx, cx - r * 0.35, cy - r * 0.45, r * 0.05, cx, cy, r, [[0, '#ffffff'], [0.25, shade(col, 0.45)], [0.7, col], [1, shade(col, -0.45)]]);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.beginPath(); ctx.ellipse(cx - r * 0.25, cy - r * 0.5, r * 0.45, r * 0.22, -0.35, 0, Math.PI * 2); ctx.fill();
    if (label != null) {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var fs = r * (String(label).length > 1 ? 1.05 : 1.25);
      ctx.font = (opts.weight || '900') + ' ' + fs + 'px ' + (opts.family || '"Alegreya Sans", Arial, sans-serif');
      ctx.lineWidth = r * 0.28; ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.strokeText(label, cx, cy + r * 0.06);
      ctx.fillStyle = opts.color || '#ffffff'; ctx.fillText(label, cx, cy + r * 0.06);
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    }
  }

  /* ---------------------------------------------------------------- naipes espanhóis */
  function emblem(ctx, kind, cx, cy, s, rot, opts) {
    opts = opts || {};
    ctx.save();
    ctx.translate(cx, cy);
    if (rot) ctx.rotate(rot);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    var lw = Math.max(0.8, s * 0.028);
    ctx.lineWidth = lw; ctx.strokeStyle = '#140d06';
    if (opts.shadow !== false) softShadow(ctx, s * 0.08, s * 0.03, 0.55);
    if (kind === 'espada') {
      /* lâmina com sulco central */
      ctx.fillStyle = lin(ctx, -s * 0.07, 0, s * 0.07, 0, [[0, '#9fb0c4'], [0.45, '#ffffff'], [0.55, '#e8eef5'], [1, '#6c7d92']]);
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.52); ctx.lineTo(s * 0.068, -s * 0.4); ctx.lineTo(s * 0.058, s * 0.16); ctx.lineTo(-s * 0.058, s * 0.16); ctx.lineTo(-s * 0.068, -s * 0.4);
      ctx.closePath(); ctx.fill(); noShadow(ctx); ctx.stroke();
      ctx.strokeStyle = 'rgba(70,90,115,.7)'; ctx.lineWidth = lw * 0.8;
      ctx.beginPath(); ctx.moveTo(0, -s * 0.42); ctx.lineTo(0, s * 0.13); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = lw * 0.5;
      ctx.beginPath(); ctx.moveTo(-s * 0.03, -s * 0.38); ctx.lineTo(-s * 0.026, s * 0.12); ctx.stroke();
      ctx.strokeStyle = '#140d06'; ctx.lineWidth = lw;
      /* guarda com volutas */
      var gold = lin(ctx, 0, s * 0.15, 0, s * 0.24, [[0, '#fff0b0'], [0.5, '#d6a23a'], [1, '#7a4f0e']]);
      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.moveTo(-s * 0.26, s * 0.17);
      ctx.quadraticCurveTo(-s * 0.3, s * 0.12, -s * 0.24, s * 0.11);
      ctx.quadraticCurveTo(-s * 0.1, s * 0.17, 0, s * 0.155);
      ctx.quadraticCurveTo(s * 0.1, s * 0.17, s * 0.24, s * 0.11);
      ctx.quadraticCurveTo(s * 0.3, s * 0.12, s * 0.26, s * 0.17);
      ctx.quadraticCurveTo(s * 0.12, s * 0.25, 0, s * 0.235);
      ctx.quadraticCurveTo(-s * 0.12, s * 0.25, -s * 0.26, s * 0.17);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      /* empunhadura trançada */
      ctx.fillStyle = '#5a2d12';
      rr(ctx, -s * 0.042, s * 0.235, s * 0.084, s * 0.19, s * 0.02); ctx.fill(); ctx.stroke();
      ctx.save(); rr(ctx, -s * 0.042, s * 0.235, s * 0.084, s * 0.19, s * 0.02); ctx.clip();
      ctx.strokeStyle = '#c98a4a'; ctx.lineWidth = lw * 0.9;
      for (var k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(-s * 0.05, s * (0.245 + k * 0.032)); ctx.lineTo(s * 0.05, s * (0.27 + k * 0.032)); ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle = gold;
      ctx.beginPath(); ctx.arc(0, s * 0.46, s * 0.055, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c0283c'; ctx.beginPath(); ctx.arc(0, s * 0.46, s * 0.022, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4ad1ff'; ctx.beginPath(); ctx.arc(0, s * 0.195, s * 0.022, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (kind === 'copa') {
      var goldC = lin(ctx, -s * 0.3, 0, s * 0.3, 0, [[0, '#7a4a0c'], [0.3, '#f2c75c'], [0.48, '#fff6c8'], [0.7, '#d29a2a'], [1, '#6a3e08']]);
      ctx.fillStyle = goldC;
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, -s * 0.3);
      ctx.bezierCurveTo(-s * 0.31, -s * 0.02, -s * 0.15, s * 0.07, -s * 0.05, s * 0.09);
      ctx.lineTo(-s * 0.045, s * 0.14);
      ctx.bezierCurveTo(-s * 0.1, s * 0.15, -s * 0.1, s * 0.2, -s * 0.04, s * 0.21);
      ctx.lineTo(-s * 0.04, s * 0.3);
      ctx.bezierCurveTo(-s * 0.2, s * 0.33, -s * 0.25, s * 0.38, -s * 0.25, s * 0.43);
      ctx.lineTo(s * 0.25, s * 0.43);
      ctx.bezierCurveTo(s * 0.25, s * 0.38, s * 0.2, s * 0.33, s * 0.04, s * 0.3);
      ctx.lineTo(s * 0.04, s * 0.21);
      ctx.bezierCurveTo(s * 0.1, s * 0.2, s * 0.1, s * 0.15, s * 0.045, s * 0.14);
      ctx.lineTo(s * 0.05, s * 0.09);
      ctx.bezierCurveTo(s * 0.15, s * 0.07, s * 0.31, -s * 0.02, s * 0.3, -s * 0.3);
      ctx.closePath(); ctx.fill(); noShadow(ctx); ctx.stroke();
      /* vinho na boca */
      ctx.fillStyle = rad(ctx, 0, -s * 0.3, 0, 0, -s * 0.3, s * 0.3, [[0, '#d8364a'], [1, '#5a0a16']]);
      ctx.beginPath(); ctx.ellipse(0, -s * 0.3, s * 0.3, s * 0.07, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = lw * 0.7;
      ctx.beginPath(); ctx.ellipse(-s * 0.04, -s * 0.31, s * 0.18, s * 0.035, 0, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke();
      ctx.strokeStyle = '#140d06'; ctx.lineWidth = lw;
      /* faixa e pedras */
      ctx.strokeStyle = 'rgba(90,50,8,.8)'; ctx.lineWidth = lw * 1.4;
      ctx.beginPath(); ctx.moveTo(-s * 0.27, -s * 0.17); ctx.quadraticCurveTo(0, -s * 0.1, s * 0.27, -s * 0.17); ctx.stroke();
      [[-0.15, -0.11, '#1fb36b'], [0, -0.08, '#c0283c'], [0.15, -0.11, '#2a7be4']].forEach(function (g) {
        ctx.fillStyle = g[2]; ctx.strokeStyle = '#140d06'; ctx.lineWidth = lw * 0.8;
        ctx.beginPath(); ctx.arc(g[0] * s, g[1] * s, s * 0.03, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(g[0] * s - s * 0.01, g[1] * s - s * 0.01, s * 0.009, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      ctx.beginPath(); ctx.ellipse(-s * 0.17, -s * 0.12, s * 0.035, s * 0.1, 0.25, 0, Math.PI * 2); ctx.fill();
    } else if (kind === 'ouro') {
      ctx.fillStyle = rad(ctx, -s * 0.12, -s * 0.14, s * 0.02, 0, 0, s * 0.42, [[0, '#fffbe0'], [0.35, '#f6cf5a'], [0.75, '#c88a1e'], [1, '#6e4208']]);
      ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill(); noShadow(ctx); ctx.stroke();
      /* serrilha */
      ctx.fillStyle = '#fff1b0';
      for (var b = 0; b < 28; b++) {
        var a = (b / 28) * Math.PI * 2;
        ctx.beginPath(); ctx.arc(Math.cos(a) * s * 0.35, Math.sin(a) * s * 0.35, s * 0.014, 0, Math.PI * 2); ctx.fill();
      }
      ctx.lineWidth = lw * 0.9;
      ctx.beginPath(); ctx.arc(0, 0, s * 0.31, 0, Math.PI * 2); ctx.stroke();
      /* sol em relevo */
      ctx.fillStyle = lin(ctx, -s * 0.2, -s * 0.2, s * 0.2, s * 0.2, [[0, '#fff3c0'], [1, '#b47714']]);
      ctx.beginPath();
      for (var i = 0; i < 24; i++) {
        var aa = (i / 24) * Math.PI * 2, rr2 = i % 2 ? s * 0.13 : s * 0.25;
        ctx.lineTo(Math.cos(aa) * rr2, Math.sin(aa) * rr2);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rad(ctx, -s * 0.03, -s * 0.03, 0, 0, 0, s * 0.11, [[0, '#fffbe6'], [1, '#d9a032']]);
      ctx.beginPath(); ctx.arc(0, 0, s * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#7a4a0c';
      ctx.beginPath(); ctx.arc(-s * 0.035, -s * 0.02, s * 0.012, 0, Math.PI * 2); ctx.arc(s * 0.035, -s * 0.02, s * 0.012, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#7a4a0c'; ctx.lineWidth = lw * 0.7;
      ctx.beginPath(); ctx.arc(0, s * 0.01, s * 0.04, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      ctx.beginPath(); ctx.ellipse(-s * 0.16, -s * 0.2, s * 0.12, s * 0.05, -0.7, 0, Math.PI * 2); ctx.fill();
    } else if (kind === 'pau') {
      ctx.rotate(-0.32);
      var wood = lin(ctx, -s * 0.13, 0, s * 0.13, 0, [[0, '#3a1d08'], [0.3, '#8a5424'], [0.55, '#c08850'], [1, '#3a1d08']]);
      ctx.fillStyle = wood;
      ctx.beginPath();
      ctx.moveTo(-s * 0.045, s * 0.5);
      ctx.bezierCurveTo(-s * 0.06, s * 0.2, -s * 0.15, -s * 0.15, -s * 0.13, -s * 0.38);
      ctx.bezierCurveTo(-s * 0.12, -s * 0.55, s * 0.12, -s * 0.55, s * 0.13, -s * 0.38);
      ctx.bezierCurveTo(s * 0.15, -s * 0.15, s * 0.06, s * 0.2, s * 0.045, s * 0.5);
      ctx.closePath(); ctx.fill(); noShadow(ctx); ctx.stroke();
      /* veios */
      ctx.save(); ctx.clip();
      ctx.strokeStyle = 'rgba(40,18,4,.55)'; ctx.lineWidth = lw * 0.6;
      for (var v = -3; v <= 3; v++) {
        ctx.beginPath(); ctx.moveTo(v * s * 0.03, s * 0.5);
        ctx.bezierCurveTo(v * s * 0.035, s * 0.1, v * s * 0.05 + s * 0.01, -s * 0.2, v * s * 0.04, -s * 0.5); ctx.stroke();
      }
      ctx.restore();
      /* nós cortados */
      [[-0.1, -0.18, 1], [0.09, -0.02, -1], [-0.07, 0.17, 1], [0.06, 0.31, -1]].forEach(function (k2) {
        ctx.save(); ctx.translate(k2[0] * s, k2[1] * s);
        ctx.fillStyle = '#e9c08a'; ctx.strokeStyle = '#140d06'; ctx.lineWidth = lw * 0.8;
        ctx.beginPath(); ctx.ellipse(0, 0, s * 0.045, s * 0.03, k2[2] * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(122,74,30,.8)'; ctx.lineWidth = lw * 0.5;
        ctx.beginPath(); ctx.ellipse(0, 0, s * 0.022, s * 0.014, k2[2] * 0.5, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      });
      /* broto */
      ctx.fillStyle = lin(ctx, s * 0.1, -s * 0.4, s * 0.24, -s * 0.3, [[0, '#9be27a'], [1, '#2f7a2c']]);
      ctx.strokeStyle = '#140d06'; ctx.lineWidth = lw * 0.8;
      ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.36); ctx.quadraticCurveTo(s * 0.22, -s * 0.46, s * 0.26, -s * 0.34); ctx.quadraticCurveTo(s * 0.18, -s * 0.3, s * 0.1, -s * 0.36); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.3)';
      ctx.beginPath(); ctx.ellipse(-s * 0.05, -s * 0.3, s * 0.025, s * 0.12, 0.05, 0, Math.PI * 2); ctx.fill();
    }
    noShadow(ctx);
    ctx.restore();
  }
  TT.drawEmblem = emblem;

  /* ---------------------------------------------------------------- cenários pintados */
  function ridge(rnd, w, rough) {
    var n = 64, pts = new Array(n + 1);
    pts[0] = rnd(); pts[n] = rnd();
    (function sub(a, b, amp) {
      if (b - a < 2) return;
      var m = (a + b) >> 1;
      pts[m] = (pts[a] + pts[b]) / 2 + (rnd() - 0.5) * amp;
      sub(a, m, amp * rough); sub(m, b, amp * rough);
    })(0, n, 1);
    return pts;
  }
  function mountains(ctx, x, y, w, h, rnd, layers) {
    layers.forEach(function (L) {
      var pts = ridge(rnd, w, L.rough || 0.55);
      ctx.fillStyle = L.fill;
      ctx.beginPath(); ctx.moveTo(x, y + h);
      pts.forEach(function (p, i) { ctx.lineTo(x + (i / (pts.length - 1)) * w, y + h * L.base - p * h * L.amp); });
      ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
      if (L.snow) {
        ctx.fillStyle = 'rgba(255,255,255,.55)';
        pts.forEach(function (p, i) {
          var px = x + (i / (pts.length - 1)) * w, py = y + h * L.base - p * h * L.amp;
          if (p > 0.72) { ctx.beginPath(); ctx.moveTo(px - 3, py + 4); ctx.lineTo(px, py); ctx.lineTo(px + 3, py + 4); ctx.fill(); }
        });
      }
    });
  }
  function stars(ctx, x, y, w, h, rnd, n, col) {
    for (var i = 0; i < n; i++) {
      var r = rnd() * 0.9 + 0.2;
      ctx.fillStyle = 'rgba(255,255,255,' + (0.3 + rnd() * 0.6) + ')';
      ctx.beginPath(); ctx.arc(x + rnd() * w, y + rnd() * h, r, 0, Math.PI * 2); ctx.fill();
    }
  }
  /* constelação em forma de rede neural: o toque de ML no céu */
  function constellation(ctx, x, y, w, h, rnd, col) {
    var cols = 4, pts = [];
    for (var c = 0; c < cols; c++) {
      var n = 2 + Math.floor(rnd() * 3), arr = [];
      for (var i = 0; i < n; i++) arr.push([x + w * (0.1 + 0.8 * c / (cols - 1)) + (rnd() - 0.5) * 8, y + h * (0.12 + 0.76 * (i + 0.5) / n) + (rnd() - 0.5) * 6]);
      pts.push(arr);
    }
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (var c2 = 0; c2 < cols - 1; c2++) {
      pts[c2].forEach(function (a) {
        pts[c2 + 1].forEach(function (b) {
          if (rnd() < 0.3) return;
          ctx.strokeStyle = hexA(col, 0.12 + rnd() * 0.22); ctx.lineWidth = 0.4 + rnd() * 1.1;
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        });
      });
    }
    pts.forEach(function (arr) { arr.forEach(function (p) { glowDisc(ctx, p[0], p[1], 5, col, 0.55); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p[0], p[1], 1.1, 0, Math.PI * 2); ctx.fill(); }); });
    ctx.restore();
  }
  function vignette(ctx, x, y, w, h, a) {
    ctx.fillStyle = rad(ctx, x + w / 2, y + h * 0.45, Math.min(w, h) * 0.25, x + w / 2, y + h / 2, Math.max(w, h) * 0.72, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,' + (a || 0.6) + ')']]);
    ctx.fillRect(x, y, w, h);
  }
  function rays(ctx, cx, cy, n, len, spread, col, a) {
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    for (var i = 0; i < n; i++) {
      var ang = -Math.PI / 2 + (i - (n - 1) / 2) * spread;
      ctx.fillStyle = lin(ctx, cx, cy, cx + Math.cos(ang) * len, cy + Math.sin(ang) * len, [[0, hexA(col, a)], [1, hexA(col, 0)]]);
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(ang - 0.05) * len, cy + Math.sin(ang - 0.05) * len);
      ctx.lineTo(cx + Math.cos(ang + 0.05) * len, cy + Math.sin(ang + 0.05) * len);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function scene(ctx, suit, x, y, w, h, rnd, opts) {
    opts = opts || {};
    var P = PAL[suit];
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, P.sky[0]], [0.55, P.sky[1]], [1, P.sky[2]]]);
    ctx.fillRect(x, y, w, h);
    if (suit === 'S') {
      stars(ctx, x, y, w, h * 0.5, rnd, 40);
      glowDisc(ctx, x + w * 0.78, y + h * 0.2, h * 0.32, '#dce9ff', 0.5);
      ctx.fillStyle = '#eef4ff'; ctx.beginPath(); ctx.arc(x + w * 0.78, y + h * 0.2, h * 0.085, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(160,180,210,.5)'; ctx.beginPath(); ctx.arc(x + w * 0.8, y + h * 0.19, h * 0.07, 0, Math.PI * 2); ctx.fill();
      mountains(ctx, x, y, w, h, rnd, [
        { fill: '#5b7593', base: 0.62, amp: 0.32, snow: true },
        { fill: '#33475f', base: 0.78, amp: 0.26 },
        { fill: '#18243a', base: 0.95, amp: 0.2, rough: 0.6 },
      ]);
      ctx.fillStyle = lin(ctx, 0, y + h * 0.55, 0, y + h * 0.8, [[0, 'rgba(200,220,240,0)'], [0.5, 'rgba(200,220,240,.22)'], [1, 'rgba(200,220,240,0)']]);
      ctx.fillRect(x, y + h * 0.55, w, h * 0.25);
    } else if (suit === 'H') {
      /* salão com arcos e velas */
      ctx.fillStyle = 'rgba(0,0,0,.25)';
      for (var a = 0; a < 3; a++) {
        var ax = x + w * (0.2 + a * 0.3), aw = w * 0.17, ay = y + h * 0.16, ah = h * 0.58;
        ctx.fillStyle = lin(ctx, 0, ay, 0, ay + ah, [[0, '#ffcf7a'], [1, '#c2533d']]);
        ctx.beginPath(); ctx.moveTo(ax - aw / 2, ay + ah); ctx.lineTo(ax - aw / 2, ay + aw / 2); ctx.arc(ax, ay + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(ax + aw / 2, ay + ah); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(40,6,8,.9)'; ctx.lineWidth = 2.2; ctx.stroke();
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, ay + ah); ctx.moveTo(ax - aw / 2, ay + ah * 0.55); ctx.lineTo(ax + aw / 2, ay + ah * 0.55); ctx.stroke();
      }
      ctx.fillStyle = lin(ctx, 0, y + h * 0.74, 0, y + h, [[0, '#3a0a0e'], [1, '#160305']]);
      ctx.fillRect(x, y + h * 0.74, w, h * 0.26);
      ctx.strokeStyle = 'rgba(255,200,140,.12)'; ctx.lineWidth = 0.8;
      for (var t = -6; t <= 6; t++) { ctx.beginPath(); ctx.moveTo(x + w / 2 + t * 6, y + h * 0.74); ctx.lineTo(x + w / 2 + t * 40, y + h); ctx.stroke(); }
      [0.08, 0.36, 0.64, 0.92].forEach(function (cx) {
        var px = x + w * cx, py = y + h * 0.7;
        glowDisc(ctx, px, py - 10, 22, '#ffb45a', 0.5);
        ctx.fillStyle = '#f2e6d0'; ctx.fillRect(px - 2.2, py - 8, 4.4, 14);
        ctx.fillStyle = '#ffd36a'; ctx.beginPath(); ctx.ellipse(px, py - 11.5, 2, 4, 0, 0, Math.PI * 2); ctx.fill();
      });
    } else if (suit === 'C') {
      rays(ctx, x + w * 0.65, y - h * 0.1, 7, h * 1.4, 0.12, '#f2ffc8', 0.22);
      for (var L = 0; L < 3; L++) {
        var col = ['#3d6b3e', '#24472a', '#0f2414'][L];
        for (var tr = 0; tr < 6 + L * 2; tr++) {
          var tx = x + rnd() * w, tw = 4 + L * 4 + rnd() * 4;
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.moveTo(tx - tw / 2, y + h); ctx.bezierCurveTo(tx - tw * 0.3, y + h * 0.5, tx + tw * 0.2, y + h * 0.3, tx - tw * 0.15, y - 5);
          ctx.lineTo(tx + tw * 0.35, y - 5); ctx.bezierCurveTo(tx + tw * 0.6, y + h * 0.3, tx + tw * 0.4, y + h * 0.5, tx + tw / 2, y + h); ctx.fill();
        }
        ctx.fillStyle = hexA(col, 0.9);
        for (var cb = 0; cb < 7; cb++) { ctx.beginPath(); ctx.ellipse(x + rnd() * w, y + h * (0.05 + L * 0.04) + rnd() * 10, 26 + rnd() * 20, 14 + rnd() * 8, 0, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.fillStyle = lin(ctx, 0, y + h * 0.82, 0, y + h, [[0, '#1d3a1f'], [1, '#081208']]);
      ctx.fillRect(x, y + h * 0.82, w, h * 0.18);
      ctx.strokeStyle = '#3f7a3a'; ctx.lineWidth = 1;
      for (var f = 0; f < 30; f++) { var fx = x + rnd() * w; ctx.beginPath(); ctx.moveTo(fx, y + h); ctx.quadraticCurveTo(fx + 4, y + h * 0.88, fx + 9 * (rnd() - 0.3), y + h * 0.84); ctx.stroke(); }
      ctx.fillStyle = 'rgba(230,255,170,.8)';
      for (var ff = 0; ff < 10; ff++) { glowDisc(ctx, x + rnd() * w, y + h * (0.4 + rnd() * 0.45), 4, '#eaffb0', 0.8); }
    } else {
      glowDisc(ctx, x + w * 0.5, y + h * 0.56, h * 0.9, '#fff0b0', 0.55);
      ctx.fillStyle = rad(ctx, x + w * 0.5, y + h * 0.56, 0, x + w * 0.5, y + h * 0.56, h * 0.22, [[0, '#fffbe6'], [1, '#ffd36a']]);
      ctx.beginPath(); ctx.arc(x + w * 0.5, y + h * 0.56, h * 0.2, 0, Math.PI * 2); ctx.fill();
      [['#c46d1e', 0.68, 0.14], ['#9a4a12', 0.8, 0.12], ['#5a2a08', 0.93, 0.1]].forEach(function (d) {
        ctx.fillStyle = d[0];
        ctx.beginPath(); ctx.moveTo(x, y + h);
        for (var i = 0; i <= 20; i++) ctx.lineTo(x + (i / 20) * w, y + h * d[1] - Math.sin(i * 0.5 + rnd() * 2) * h * d[2] * 0.4 - rnd() * 3);
        ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
      });
      for (var sp = 0; sp < 18; sp++) {
        var sx = x + rnd() * w, sy = y + h * (0.65 + rnd() * 0.3);
        ctx.fillStyle = 'rgba(255,245,200,.9)';
        ctx.beginPath(); ctx.moveTo(sx, sy - 2.5); ctx.lineTo(sx + 0.7, sy); ctx.lineTo(sx, sy + 2.5); ctx.lineTo(sx - 0.7, sy); ctx.fill();
      }
    }
    if (opts.constellation !== false) constellation(ctx, x + w * 0.04, y + h * 0.04, w * 0.92, h * 0.5, rnd, P.glow);
    if (opts.dim) { ctx.fillStyle = 'rgba(0,0,0,' + opts.dim + ')'; ctx.fillRect(x, y, w, h); }
    vignette(ctx, x, y, w, h, 0.55);
    ctx.restore();
  }

  /* ---------------------------------------------------------------- figuras ilustradas */
  var FIG = {
    K: { robe: '#2b4f9e', cape: '#a3222e', hair: '#b9b4ad', trim: '#f2c94c' },
    Q: { robe: '#a3222e', cape: '#2b4f9e', hair: '#d9a441', trim: '#f2c94c' },
    J: { robe: '#d79a2b', cape: '#2f7a46', hair: '#4a2a14', trim: '#f6efe0' },
  };
  function crownShape(ctx, rank, s, col) {
    ctx.fillStyle = lin(ctx, 0, -s * 0.4, 0, s * 0.2, [[0, '#fff3b8'], [0.5, col], [1, '#8a5a10']]);
    ctx.strokeStyle = INK; ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    if (rank === 'K') {
      ctx.moveTo(-s * 0.5, s * 0.2); ctx.lineTo(-s * 0.54, -s * 0.22); ctx.lineTo(-s * 0.27, s * 0.0);
      ctx.lineTo(0, -s * 0.4); ctx.lineTo(s * 0.27, s * 0.0); ctx.lineTo(s * 0.54, -s * 0.22); ctx.lineTo(s * 0.5, s * 0.2);
    } else {
      ctx.moveTo(-s * 0.45, s * 0.2);
      ctx.quadraticCurveTo(-s * 0.48, -s * 0.05, -s * 0.24, -s * 0.06);
      ctx.quadraticCurveTo(0, -s * 0.42, s * 0.24, -s * 0.06);
      ctx.quadraticCurveTo(s * 0.48, -s * 0.05, s * 0.45, s * 0.2);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c0283c'; ctx.beginPath(); ctx.arc(0, s * 0.06, s * 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2a7be4';
    [-0.3, 0.3].forEach(function (k) { ctx.beginPath(); ctx.arc(k * s, s * 0.1, s * 0.05, 0, Math.PI * 2); ctx.fill(); });
    if (rank === 'K') {
      ctx.fillStyle = '#fff';
      [[-0.54, -0.22], [0, -0.4], [0.54, -0.22]].forEach(function (k) { ctx.beginPath(); ctx.arc(k[0] * s, k[1] * s, s * 0.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    }
  }
  /* retrato meio-corpo; (cx, by) = base central, s = altura do retrato */
  function figure(ctx, rank, suit, cx, by, s) {
    var C = FIG[rank], P = PAL[suit];
    var u = s / 100;
    ctx.save();
    ctx.translate(cx, by); ctx.scale(u, u);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
    softShadow(ctx, 8, 3, 0.5);
    /* cabelo de trás (dama) */
    if (rank === 'Q') {
      ctx.fillStyle = lin(ctx, -20, -90, 20, -30, [[0, shade(C.hair, 0.25)], [1, shade(C.hair, -0.3)]]);
      ctx.beginPath(); ctx.moveTo(-17, -78); ctx.bezierCurveTo(-30, -60, -26, -38, -20, -30); ctx.lineTo(20, -30); ctx.bezierCurveTo(26, -38, 30, -60, 17, -78); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    /* capa */
    ctx.fillStyle = lin(ctx, -50, -60, 50, 0, [[0, shade(C.cape, 0.2)], [0.5, C.cape], [1, shade(C.cape, -0.45)]]);
    ctx.beginPath(); ctx.moveTo(-52, 2); ctx.bezierCurveTo(-50, -30, -44, -48, -18, -54); ctx.lineTo(18, -54); ctx.bezierCurveTo(44, -48, 50, -30, 52, 2); ctx.closePath(); ctx.fill();
    noShadow(ctx); ctx.stroke();
    /* túnica */
    ctx.fillStyle = lin(ctx, -28, -50, 28, 0, [[0, shade(C.robe, 0.25)], [0.55, C.robe], [1, shade(C.robe, -0.4)]]);
    ctx.beginPath(); ctx.moveTo(-31, 2); ctx.bezierCurveTo(-30, -20, -26, -44, -14, -50); ctx.lineTo(14, -50); ctx.bezierCurveTo(26, -44, 30, -20, 31, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.2;
    [[-18, -40, -22, 0], [18, -40, 22, 0], [-8, -30, -10, 0], [8, -30, 10, 0]].forEach(function (l) { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.quadraticCurveTo(l[0] * 1.2, (l[1] + l[3]) / 2, l[2], l[3]); ctx.stroke(); });
    /* faixa central bordada */
    ctx.strokeStyle = INK; ctx.lineWidth = 1.2;
    ctx.fillStyle = lin(ctx, -5, 0, 5, 0, [[0, shade(C.trim, -0.3)], [0.5, C.trim], [1, shade(C.trim, -0.3)]]);
    ctx.beginPath(); ctx.moveTo(-5, -50); ctx.lineTo(5, -50); ctx.lineTo(6, 2); ctx.lineTo(-6, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = P.gem;
    for (var d = 0; d < 4; d++) { ctx.beginPath(); ctx.arc(0, -40 + d * 11, 2, 0, Math.PI * 2); ctx.fill(); }
    /* gola */
    if (rank === 'K') {
      ctx.fillStyle = '#f6f1e6';
      ctx.beginPath(); ctx.ellipse(0, -51, 24, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK; for (var e = -3; e <= 3; e++) { ctx.beginPath(); ctx.arc(e * 6, -51 + (e % 2) * 2, 1.1, 0, Math.PI * 2); ctx.fill(); }
    } else {
      ctx.fillStyle = '#fbf6ea';
      ctx.beginPath();
      for (var sc = 0; sc <= 12; sc++) { var aa = Math.PI + (sc / 12) * Math.PI; ctx.lineTo(Math.cos(aa) * 20, -53 - Math.sin(aa) * 6 + (sc % 2 ? 2.5 : 0)); }
      for (var sc2 = 12; sc2 >= 0; sc2--) { var ab = Math.PI + (sc2 / 12) * Math.PI; ctx.lineTo(Math.cos(ab) * 20, -48 - Math.sin(ab) * 4); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    /* pescoço e rosto */
    var skin = lin(ctx, -12, -90, 12, -55, [[0, '#f7d6b6'], [1, '#d59b72']]);
    ctx.fillStyle = skin;
    ctx.fillRect(-5, -60, 10, 8); ctx.strokeRect(-5, -60, 10, 8);
    ctx.beginPath(); ctx.ellipse(0, -72, 12.5, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    /* cabelo da frente */
    ctx.fillStyle = lin(ctx, 0, -92, 0, -60, [[0, shade(C.hair, 0.3)], [1, shade(C.hair, -0.25)]]);
    if (rank === 'K') {
      ctx.beginPath(); ctx.moveTo(-13, -76); ctx.bezierCurveTo(-15, -60, -12, -48, 0, -44); ctx.bezierCurveTo(12, -48, 15, -60, 13, -76);
      ctx.bezierCurveTo(9, -64, 5, -62, 0, -62); ctx.bezierCurveTo(-5, -62, -9, -64, -13, -76); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-6, -64); ctx.quadraticCurveTo(0, -67, 6, -64); ctx.quadraticCurveTo(0, -62, -6, -64); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-13, -78); ctx.quadraticCurveTo(-14, -88, -6, -88); ctx.lineTo(6, -88); ctx.quadraticCurveTo(14, -88, 13, -78); ctx.quadraticCurveTo(0, -83, -13, -78); ctx.fill();
    } else if (rank === 'Q') {
      ctx.beginPath(); ctx.moveTo(-13, -72); ctx.bezierCurveTo(-14, -90, 14, -90, 13, -72); ctx.bezierCurveTo(8, -84, -8, -84, -13, -72); ctx.fill(); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(-13, -70); ctx.bezierCurveTo(-15, -92, 15, -92, 13, -70); ctx.bezierCurveTo(10, -80, 2, -78, -2, -82); ctx.bezierCurveTo(-6, -78, -10, -80, -13, -70); ctx.fill(); ctx.stroke();
    }
    /* feições */
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.ellipse(-4.6, -73, 1.6, 1.1, 0, 0, Math.PI * 2); ctx.ellipse(4.6, -73, 1.6, 1.1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(-7, -76.5); ctx.quadraticCurveTo(-4.5, -78, -2, -76.5); ctx.moveTo(2, -76.5); ctx.quadraticCurveTo(4.5, -78, 7, -76.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -72); ctx.quadraticCurveTo(1.6, -67.5, -0.6, -66.5); ctx.stroke();
    if (rank !== 'K') { ctx.fillStyle = '#b73a3a'; ctx.beginPath(); ctx.ellipse(0, -63.2, 2.8, 1.1, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = 'rgba(220,90,90,.25)'; ctx.beginPath(); ctx.arc(-7, -68, 2.6, 0, Math.PI * 2); ctx.arc(7, -68, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 1.6;
    /* coroa / chapéu */
    if (rank === 'J') {
      ctx.fillStyle = lin(ctx, -16, -96, 16, -84, [[0, '#c0283c'], [1, '#6a0f1a']]);
      ctx.beginPath(); ctx.moveTo(-16, -84); ctx.quadraticCurveTo(-18, -98, 0, -98); ctx.quadraticCurveTo(20, -98, 18, -86); ctx.quadraticCurveTo(0, -80, -16, -84); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lin(ctx, 6, -110, 34, -96, [[0, '#ffffff'], [1, '#d8cbb0']]);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(6, -94); ctx.bezierCurveTo(10, -112, 26, -118, 34, -110); ctx.bezierCurveTo(28, -104, 20, -98, 6, -94); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(8, -95); ctx.quadraticCurveTo(20, -106, 32, -110); ctx.stroke();
      ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
    } else {
      ctx.save(); ctx.translate(0, -89); crownShape(ctx, rank, rank === 'K' ? 30 : 22, rank === 'K' ? '#f2c94c' : '#e9d9ff'); ctx.restore();
      if (rank === 'Q') { ctx.fillStyle = '#f2c94c'; ctx.beginPath(); ctx.arc(-12.5, -66, 1.8, 0, Math.PI * 2); ctx.arc(12.5, -66, 1.8, 0, Math.PI * 2); ctx.fill(); }
    }
    /* mão + emblema do naipe */
    var em = TT.SUIT_INFO[suit].emblem;
    var hx = 26, hy = -26;
    if (em === 'espada') emblem(ctx, 'espada', 34, -46, 70, 0.12);
    else if (em === 'pau') emblem(ctx, 'pau', 34, -44, 64, 0.5);
    else if (em === 'copa') emblem(ctx, 'copa', 30, -34, 34, 0);
    else emblem(ctx, 'ouro', 30, -32, 30, 0);
    ctx.fillStyle = skin; ctx.strokeStyle = INK; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(hx + 2, hy - 2, 5.5, 4.5, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  /* ---------------------------------------------------------------- metadados */
  TT.cardMeta = function (card, deckKey) {
    var deck = TT.DECKS[deckKey];
    var key = card.r + card.s;
    var manilha = deck.manilhas && deck.manilhas[key];
    var v = TT.baseValue(card, deckKey);
    var fig = TT.isFigure(card);
    var type = manilha ? 'Manilha — Neurônio Lendário' : fig ? 'Neurônio — Figura' : card.r === 'A' ? 'Neurônio — Ás' : 'Neurônio — Numérico';
    var rules;
    if (fig) rules = 'Ativa com 0. Tunagem: +10.\nPar vizinho +10 · Trio +20 · Quadra zera a rede.';
    else rules = (manilha ? 'Manilha: ' : '') + 'Ativa com ' + v + ' pontos.\nTunagem: empilhe outro ' + card.r + ' e some o valor dele.';
    var flavor = (manilha && TT.FLAVOR[manilha]) || TT.FLAVOR[card.r];
    var rarity = manilha ? 'mitica' : fig ? 'rara' : card.r === 'A' ? 'incomum' : 'comum';
    return { name: TT.cardName(card, deckKey), v: v, fig: fig, manilha: manilha, type: type, rules: rules, flavor: flavor, rarity: rarity };
  };
  var RARITY = { comum: ['#1a1a1a', '#5a5a5a'], incomum: ['#e9eef3', '#7a8794'], rara: ['#fff0b0', '#b98a1e'], mitica: ['#ffd27a', '#d4451c'] };

  function setSymbol(ctx, x, y, s, rarity) {
    var c = RARITY[rarity];
    ctx.fillStyle = lin(ctx, x - s, y - s, x + s, y + s, [[0, c[0]], [1, c[1]]]);
    ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(x - s, y - s * 0.75); ctx.lineTo(x + s, y - s * 0.75); ctx.lineTo(x, y + s * 0.9); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.moveTo(x - s * 0.45, y - s * 0.4); ctx.lineTo(x + s * 0.45, y - s * 0.4); ctx.lineTo(x, y + s * 0.35); ctx.closePath(); ctx.fill();
  }

  function cardArt(ctx, card, meta, x, y, w, h, rnd) {
    var si = TT.SUIT_INFO[card.s], P = PAL[card.s];
    if (meta.fig) {
      scene(ctx, card.s, x, y, w, h, rnd, { dim: 0.18 });
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      /* cortina e trono */
      ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, 'rgba(60,8,12,.85)'], [0.18, 'rgba(60,8,12,0)'], [0.82, 'rgba(60,8,12,0)'], [1, 'rgba(60,8,12,.85)']]);
      ctx.fillRect(x, y, w, h);
      glowDisc(ctx, x + w / 2, y + h * 0.42, h * 0.55, P.glow, 0.45);
      ctx.fillStyle = lin(ctx, 0, y + h * 0.15, 0, y + h, [[0, '#6b3a14'], [1, '#2a1406']]);
      rr(ctx, x + w / 2 - 34, y + h * 0.12, 68, h, 8); ctx.fill();
      ctx.strokeStyle = '#e6b84a'; ctx.lineWidth = 1.5; ctx.stroke();
      figure(ctx, card.r, card.s, x + w / 2, y + h + 2, h * 0.98);
      ctx.font = '900 26px Cinzel, Georgia, serif'; ctx.textBaseline = 'top';
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.strokeText(card.r, x + 8, y + 6);
      ctx.fillStyle = '#fff6dc'; ctx.fillText(card.r, x + 8, y + 6); ctx.textBaseline = 'alphabetic';
      ctx.restore();
      return;
    }
    scene(ctx, card.s, x, y, w, h, rnd);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (card.r === 'A' || meta.manilha) {
      var cx = x + w / 2, cy = y + h * 0.52;
      rays(ctx, cx, cy + 40, 15, h * 1.2, 0.2, P.glow, 0.25);
      glowDisc(ctx, cx, cy, h * 0.55, P.glow, 0.7);
      ctx.strokeStyle = hexA(P.glow, 0.7); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(cx, cy, h * 0.4, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.arc(cx, cy, h * 0.45, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      if (meta.manilha && card.r !== 'A') {
        var n0 = parseInt(card.r, 10);
        pipLayout(n0).forEach(function (p, k) { emblem(ctx, si.emblem, x + w * p[0], y + h * p[1], n0 <= 4 ? 48 : 40, (rnd() - 0.5) * 0.3); });
        /* raio da manilha */
        ctx.strokeStyle = '#fff6b0'; ctx.lineWidth = 2.2; softShadow(ctx, 8, 0, 0.9); ctx.shadowColor = '#ffd23a';
        ctx.beginPath(); ctx.moveTo(x + w * 0.62, y + 4); ctx.lineTo(x + w * 0.52, y + h * 0.42); ctx.lineTo(x + w * 0.6, y + h * 0.44); ctx.lineTo(x + w * 0.46, y + h - 6); ctx.stroke(); noShadow(ctx);
      } else {
        emblem(ctx, si.emblem, cx, cy, h * 0.82, 0);
      }
    } else {
      var n = parseInt(card.r, 10);
      var size = n <= 3 ? 54 : n <= 5 ? 44 : n <= 8 ? 38 : 32;
      pipLayout(n).forEach(function (p, k) {
        glowDisc(ctx, x + w * p[0], y + h * p[1], size * 0.75, P.glow, 0.35);
      });
      pipLayout(n).forEach(function (p, k) {
        emblem(ctx, si.emblem, x + w * p[0], y + h * p[1], size, (rnd() - 0.5) * 0.25 + (k % 2 ? 0.08 : -0.08));
      });
    }
    ctx.restore();
  }

  /* posições dos naipes numa janela de arte paisagem */
  function pipLayout(n) {
    var row = function (k, y, x0, x1) { var a = []; for (var i = 0; i < k; i++) a.push([k === 1 ? 0.5 : x0 + (x1 - x0) * i / (k - 1), y]); return a; };
    var L = {
      1: [[0.5, 0.5]],
      2: row(2, 0.5, 0.32, 0.68),
      3: [[0.22, 0.56], [0.5, 0.42], [0.78, 0.56]],
      4: row(2, 0.3, 0.3, 0.7).concat(row(2, 0.72, 0.3, 0.7)),
      5: row(2, 0.28, 0.24, 0.76).concat([[0.5, 0.5]], row(2, 0.74, 0.24, 0.76)),
      6: row(3, 0.3, 0.22, 0.78).concat(row(3, 0.72, 0.22, 0.78)),
      7: row(4, 0.3, 0.16, 0.84).concat(row(3, 0.72, 0.28, 0.72)),
      8: row(4, 0.3, 0.16, 0.84).concat(row(4, 0.72, 0.16, 0.84)),
      9: row(3, 0.2, 0.25, 0.75).concat(row(3, 0.5, 0.25, 0.75), row(3, 0.8, 0.25, 0.75)),
      10: row(5, 0.3, 0.12, 0.88).concat(row(5, 0.72, 0.12, 0.88)),
    };
    return L[n] || L[1];
  }

  /* ---------------------------------------------------------------- carta completa */
  TT.drawFullCard = function (card, deckKey, S) {
    var o = mk(FULL_W, FULL_H, S || 1), ctx = o.ctx;
    var P = PAL[card.s];
    var meta = TT.cardMeta(card, deckKey);
    var si = TT.SUIT_INFO[card.s];
    var rnd = prng(hash(card.r + card.s + deckKey));
    frameBody(ctx, FULL_W, FULL_H, P, rnd, !!meta.manilha);

    /* barra de nome + gemas de custo */
    plate(ctx, 15, 14, 210, 28, P);
    var gx = 211;
    gem(ctx, gx, 28, 10, P.gem, null);
    ctx.fillStyle = '#fff'; ctx.font = '700 13px ' + SYMBOL_FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(si.sym, gx, 28.5);
    gem(ctx, gx - 22, 28, 10, '#8c8378', meta.fig ? '0' : String(meta.v), { color: '#fff' });
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = INK;
    fitFont(ctx, meta.name, 150, 15.5, '700', 'Cinzel, Georgia, serif', 10);
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillText(meta.name, 25, 29.3);
    ctx.fillStyle = INK; ctx.fillText(meta.name, 25, 28.5);

    /* janela de arte */
    var ax = 21, ay = 47, aw = 198, ah = 134;
    softShadow(ctx, 4, 2, 0.8);
    ctx.fillStyle = '#000'; ctx.fillRect(ax - 2, ay - 2, aw + 4, ah + 4);
    noShadow(ctx);
    cardArt(ctx, card, meta, ax, ay, aw, ah, rnd);
    ctx.lineWidth = 2; ctx.strokeStyle = '#0b0907'; ctx.strokeRect(ax - 1, ay - 1, aw + 2, ah + 2);
    ctx.lineWidth = 0.8; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.strokeRect(ax - 2.5, ay - 2.5, aw + 5, ah + 5);

    /* linha de tipo + raridade */
    plate(ctx, 15, 186, 210, 22, P);
    ctx.fillStyle = INK; ctx.textBaseline = 'middle';
    fitFont(ctx, meta.type, 170, 11, '700', 'Cinzel, Georgia, serif', 7.5);
    ctx.fillText(meta.type, 24, 197.5);
    setSymbol(ctx, 211, 197, 6.5, meta.rarity);

    /* caixa de texto com marca d'água */
    var tx = 22, ty = 212, tw = 196, th = 94;
    ctx.fillStyle = lin(ctx, 0, ty, 0, ty + th, [[0, '#f7efdb'], [1, '#e6d6b0']]);
    ctx.fillRect(tx, ty, tw, th);
    ctx.save(); ctx.beginPath(); ctx.rect(tx, ty, tw, th); ctx.clip();
    grain(ctx, tx, ty, tw, th, rnd, 0.12, 0.08);
    ctx.globalAlpha = 0.1; emblem(ctx, si.emblem, tx + tw / 2, ty + th / 2, 86, 0, { shadow: false }); ctx.globalAlpha = 1;
    ctx.restore();
    ctx.strokeStyle = shade(P.mid, -0.4); ctx.lineWidth = 1.2; ctx.strokeRect(tx, ty, tw, th);
    ctx.fillStyle = INK; ctx.font = '500 12px Alegreya, Georgia, serif'; ctx.textBaseline = 'top';
    var used = wrap(ctx, meta.rules, tx + 8, ty + 6, tw - 16, 14);
    var sepY = ty + 10 + used * 14;
    ctx.strokeStyle = 'rgba(60,40,20,.35)'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(tx + 30, sepY); ctx.lineTo(tx + tw - 30, sepY); ctx.stroke();
    ctx.font = 'italic 11px Alegreya, Georgia, serif'; ctx.fillStyle = '#4b3a26';
    wrap(ctx, meta.flavor, tx + 8, sepY + 4, tw - 70, 12.5);

    /* caixa de poder */
    plate(ctx, 168, 292, 56, 26, P, { r: 6 });
    ctx.fillStyle = INK; ctx.font = '900 16px "Alegreya Sans", Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(meta.fig ? '0' : String(meta.v), 186, 305.5);
    ctx.font = '700 14px ' + SYMBOL_FONT; ctx.fillStyle = si.red ? '#a8232f' : INK;
    ctx.fillText(si.sym, 209, 305.5);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    /* linha de colecionador */
    var idx = TT.SUITS.indexOf(card.s) * 13 + TT.RANKS.indexOf(card.r) + 1;
    ctx.font = '700 7.5px "Alegreya Sans", Arial, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.82)';
    ctx.fillText(String(idx).padStart(3, '0') + '/052 · ' + meta.rarity.charAt(0).toUpperCase() + ' · TdT · PT-BR', 17, 316);
    ctx.font = '500 7.5px "Alegreya Sans", Arial, sans-serif';
    ctx.fillText('Ilus. arte procedural · FPO 2026/2', 17, 325);
    return o.c;
  };

  /* ---------------------------------------------------------------- carta da mesa */
  TT.drawMiniCard = function (card, deckKey, S) {
    var o = mk(MINI_W, MINI_H, S || 1), ctx = o.ctx;
    var P = PAL[card.s];
    var meta = TT.cardMeta(card, deckKey);
    var si = TT.SUIT_INFO[card.s];
    var rnd = prng(hash('m' + card.r + card.s + deckKey));
    frameBody(ctx, MINI_W, MINI_H, P, rnd, !!meta.manilha);
    var fx = 9, fy = 9, fw = MINI_W - 18, fh = MINI_H - 18;
    ctx.fillStyle = lin(ctx, 0, fy, 0, fy + fh, [[0, '#fdf8ec'], [1, '#ecdcb8']]);
    rr(ctx, fx, fy, fw, fh, 7); ctx.fill();
    ctx.save(); rr(ctx, fx, fy, fw, fh, 7); ctx.clip(); grain(ctx, fx, fy, fw, fh, rnd, 0.15, 0.07); ctx.restore();
    ctx.strokeStyle = shade(P.mid, -0.3); ctx.lineWidth = 1.4; rr(ctx, fx, fy, fw, fh, 7); ctx.stroke();
    ctx.strokeStyle = hexA(shade(P.mid, -0.2), 0.45); ctx.lineWidth = 0.8; rr(ctx, fx + 4, fy + 4, fw - 8, fh - 8, 5); ctx.stroke();

    var red = si.red, col = red ? '#a8232f' : '#16120e';
    /* janela central */
    var wx = 29, wy = 32, ww = 62, wh = 100;
    ctx.save();
    ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx, wy + ww / 2); ctx.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(wx + ww, wy + wh); ctx.closePath();
    softShadow(ctx, 3, 1, 0.6); ctx.fillStyle = '#000'; ctx.fill(); noShadow(ctx);
    ctx.clip();
    if (meta.fig) {
      scene(ctx, card.s, wx, wy, ww, wh, rnd, { constellation: false, dim: 0.15 });
      glowDisc(ctx, wx + ww / 2, wy + wh * 0.4, wh * 0.5, P.glow, 0.45);
      figure(ctx, card.r, card.s, wx + ww / 2 - 3, wy + wh + 1, wh * 0.9);
    } else {
      scene(ctx, card.s, wx, wy, ww, wh, rnd, { constellation: false });
      glowDisc(ctx, wx + ww / 2, wy + wh * 0.55, ww * 0.6, P.glow, 0.7);
      emblem(ctx, si.emblem, wx + ww / 2, wy + wh * 0.55, card.r === 'A' || meta.manilha ? 70 : 60, 0.08);
    }
    ctx.restore();
    ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx, wy + ww / 2); ctx.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(wx + ww, wy + wh); ctx.closePath(); ctx.stroke();

    /* índices nos cantos */
    function index(tx, ty) {
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillStyle = col;
      ctx.font = '900 ' + (card.r === '10' ? 17 : 21) + 'px Cinzel, Georgia, serif';
      ctx.fillText(card.r, tx, ty);
      ctx.font = '700 15px ' + SYMBOL_FONT;
      ctx.fillText(si.sym, tx, ty + 21);
    }
    index(18, 13);
    ctx.save(); ctx.translate(MINI_W, MINI_H); ctx.rotate(Math.PI); index(18, 13); ctx.restore();
    /* gema de valor (canto superior direito) */
    gem(ctx, MINI_W - 21, 22, 11.5, meta.manilha ? '#e0601c' : P.gem, meta.fig ? '0' : String(meta.v));
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    return o.c;
  };

  /* ---------------------------------------------------------------- verso */
  TT.drawCardBack = function (kind, S) {
    var W = kind === 'mini' ? MINI_W : FULL_W, H = kind === 'mini' ? MINI_H : FULL_H;
    var o = mk(W, H, S || 1), ctx = o.ctx;
    var k = W / FULL_W;
    ctx.scale(k, k);
    W = FULL_W; H = FULL_H;
    var rnd = prng(77);
    ctx.fillStyle = '#0a0806'; rr(ctx, 0, 0, W, H, 13); ctx.fill();
    ctx.save(); rr(ctx, 9, 9, W - 18, H - 18, 9); ctx.clip();
    ctx.fillStyle = rad(ctx, W / 2, H / 2, 20, W / 2, H / 2, H * 0.7, [[0, '#8e1c2c'], [0.6, '#5c0e1a'], [1, '#2a050c']]);
    ctx.fillRect(0, 0, W, H);
    /* damasco */
    for (var yy = 0; yy < H + 30; yy += 26) {
      for (var xx = 0; xx < W + 30; xx += 26) {
        var ox = (yy / 26) % 2 ? 13 : 0;
        ctx.save(); ctx.translate(xx + ox, yy);
        ctx.fillStyle = 'rgba(232,190,110,.13)';
        ctx.beginPath(); ctx.moveTo(0, -9); ctx.quadraticCurveTo(6, -3, 0, 9); ctx.quadraticCurveTo(-6, -3, 0, -9); ctx.fill();
        ctx.fillStyle = 'rgba(232,190,110,.2)'; ctx.beginPath(); ctx.arc(0, -11, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
    grain(ctx, 9, 9, W - 18, H - 18, rnd, 0.06, 0.1);
    ctx.restore();
    var gold = lin(ctx, 0, 0, W, H, [[0, '#fff1b8'], [0.3, '#c99a3a'], [0.6, '#ffe7a0'], [1, '#8a5a10']]);
    ctx.strokeStyle = gold; ctx.lineWidth = 3; rr(ctx, 17, 17, W - 34, H - 34, 8); ctx.stroke();
    ctx.lineWidth = 1; rr(ctx, 23, 23, W - 46, H - 46, 6); ctx.stroke();
    /* cantoneiras */
    [[23, 23, 1, 1], [W - 23, 23, -1, 1], [23, H - 23, 1, -1], [W - 23, H - 23, -1, -1]].forEach(function (c) {
      ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(c[2], c[3]);
      ctx.strokeStyle = gold; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(4, 26); ctx.bezierCurveTo(4, 8, 8, 4, 26, 4); ctx.stroke();
      ctx.beginPath(); ctx.arc(14, 14, 4, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(14, 14, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    /* medalhão */
    softShadow(ctx, 10, 3, 0.7);
    ctx.fillStyle = rad(ctx, W / 2, H / 2 - 20, 6, W / 2, H / 2, 100, [[0, '#2b1a0e'], [1, '#0e0804']]);
    ctx.beginPath(); ctx.ellipse(W / 2, H / 2, 74, 100, 0, 0, Math.PI * 2); ctx.fill();
    noShadow(ctx);
    ctx.strokeStyle = gold; ctx.lineWidth = 3.5; ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(W / 2, H / 2, 67, 93, 0, 0, Math.PI * 2); ctx.stroke();
    /* naipes nos pontos cardeais */
    [['espada', 0, -78], ['copa', 56, 0], ['ouro', 0, 78], ['pau', -56, 0]].forEach(function (e) {
      ctx.globalAlpha = 0.85; emblem(ctx, e[0], W / 2 + e[1], H / 2 + e[2], 22, 0, { shadow: false }); ctx.globalAlpha = 1;
    });
    /* rede neural dourada */
    var cols = [[3, -30], [4, 0], [2, 30]];
    var pts = cols.map(function (cc) { var a = []; for (var j = 0; j < cc[0]; j++) a.push([W / 2 + cc[1], H / 2 - 16 + (j - (cc[0] - 1) / 2) * 18]); return a; });
    ctx.lineWidth = 1;
    for (var a2 = 0; a2 < 2; a2++) pts[a2].forEach(function (p) { pts[a2 + 1].forEach(function (q) { ctx.strokeStyle = 'rgba(232,200,120,.6)'; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }); });
    pts.forEach(function (col, ci) {
      col.forEach(function (p) {
        glowDisc(ctx, p[0], p[1], 9, ci === 1 ? '#f59322' : '#4aa3df', 0.6);
        ctx.fillStyle = ci === 1 ? '#f59322' : '#4aa3df'; ctx.beginPath(); ctx.arc(p[0], p[1], 3.8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffe7a0'; ctx.lineWidth = 1; ctx.stroke();
      });
    });
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 12.5px Cinzel, Georgia, serif'; ctx.fillStyle = '#f2d488';
    ctx.fillText('TRUCO DE', W / 2, H / 2 + 34);
    ctx.font = '900 17px Cinzel, Georgia, serif';
    ctx.fillText('TURING', W / 2, H / 2 + 52);
    return o.c;
  };

  /* ---------------------------------------------------------------- terrenos */
  TT.drawTerrainCard = function (key, S) {
    var o = mk(FULL_W, FULL_H, S || 1), ctx = o.ctx;
    var P = {
      neutro: { light: '#b7d7a8', mid: '#3f7a4c', dark: '#10281a', gem: '#2f8a4a', title: '#e3ecdc', titleD: '#a9bf9c' },
      montanha: { light: '#f3b893', mid: '#a4512c', dark: '#2e140a', gem: '#d4552a', title: '#f4e1d6', titleD: '#cfa58f' },
      pantano: { light: '#bdb6a2', mid: '#55513f', dark: '#141310', gem: '#4a4a3a', title: '#e6e2d6', titleD: '#b0aa96' },
      oceano: { light: '#a8e0f2', mid: '#2c7299', dark: '#0a2232', gem: '#2a8fd0', title: '#dfeef4', titleD: '#9dbfcc' },
    }[key];
    var t = TT.TERRAINS[key];
    var rnd = prng(hash('terrain' + key));
    frameBody(ctx, FULL_W, FULL_H, P, rnd, false);
    plate(ctx, 15, 14, 210, 28, P);
    ctx.fillStyle = INK; ctx.textBaseline = 'middle';
    fitFont(ctx, t.name, 170, 16, '700', 'Cinzel, Georgia, serif', 10);
    ctx.fillText(t.name, 25, 28.5);
    var ax = 21, ay = 47, aw = 198, ah = 162;
    softShadow(ctx, 4, 2, 0.8); ctx.fillStyle = '#000'; ctx.fillRect(ax - 2, ay - 2, aw + 4, ah + 4); noShadow(ctx);
    ctx.save(); ctx.beginPath(); ctx.rect(ax, ay, aw, ah); ctx.clip();
    if (key === 'montanha') {
      ctx.fillStyle = lin(ctx, 0, ay, 0, ay + ah, [[0, '#2c1a3a'], [0.45, '#d4683a'], [1, '#ffd08a']]);
      ctx.fillRect(ax, ay, aw, ah);
      glowDisc(ctx, ax + aw * 0.3, ay + ah * 0.55, 70, '#ffd08a', 0.7);
      mountains(ctx, ax, ay, aw, ah, rnd, [
        { fill: '#a85a3c', base: 0.62, amp: 0.45, snow: true },
        { fill: '#6e3420', base: 0.78, amp: 0.35 },
        { fill: '#3a1a10', base: 0.92, amp: 0.25 },
        { fill: '#1c0c06', base: 1.02, amp: 0.2 },
      ]);
      ctx.strokeStyle = 'rgba(255,230,170,.85)'; ctx.setLineDash([3, 4]); ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(ax + 30, ay + ah); ctx.bezierCurveTo(ax + 90, ay + ah * 0.8, ax + 60, ay + ah * 0.55, ax + 120, ay + ah * 0.35); ctx.stroke(); ctx.setLineDash([]);
      constellation(ctx, ax + 8, ay + 6, aw - 16, ah * 0.3, rnd, '#ffe6b8');
    } else if (key === 'pantano') {
      ctx.fillStyle = lin(ctx, 0, ay, 0, ay + ah, [[0, '#1c2218'], [0.6, '#4c5a40'], [1, '#1a1f14']]);
      ctx.fillRect(ax, ay, aw, ah);
      glowDisc(ctx, ax + aw * 0.7, ay + ah * 0.28, 50, '#d8e8b0', 0.4);
      ctx.fillStyle = '#e8f0d0'; ctx.beginPath(); ctx.arc(ax + aw * 0.7, ay + ah * 0.28, 11, 0, Math.PI * 2); ctx.fill();
      for (var tr = 0; tr < 9; tr++) {
        var x0 = ax + rnd() * aw, h0 = 60 + rnd() * 90, wd = 3 + rnd() * 5;
        ctx.strokeStyle = tr < 4 ? '#3a4232' : '#0f120c'; ctx.lineWidth = wd;
        ctx.beginPath(); ctx.moveTo(x0, ay + ah * 0.78); ctx.bezierCurveTo(x0 + (rnd() - 0.5) * 30, ay + ah * 0.78 - h0 * 0.5, x0 + (rnd() - 0.5) * 30, ay + ah * 0.78 - h0 * 0.8, x0 + (rnd() - 0.5) * 20, ay + ah * 0.78 - h0); ctx.stroke();
        ctx.lineWidth = wd * 0.4;
        for (var br = 0; br < 3; br++) { var by2 = ay + ah * 0.78 - h0 * (0.5 + br * 0.15); ctx.beginPath(); ctx.moveTo(x0, by2); ctx.quadraticCurveTo(x0 + (rnd() - 0.5) * 30, by2 - 10, x0 + (rnd() - 0.5) * 40, by2 - 18); ctx.stroke(); }
      }
      ctx.fillStyle = lin(ctx, 0, ay + ah * 0.76, 0, ay + ah, [[0, '#2a3324'], [1, '#0a0d08']]);
      ctx.fillRect(ax, ay + ah * 0.76, aw, ah * 0.24);
      ctx.strokeStyle = 'rgba(200,220,170,.25)'; ctx.lineWidth = 0.8;
      for (var rl = 0; rl < 8; rl++) { var ry = ay + ah * (0.8 + rnd() * 0.18); ctx.beginPath(); ctx.moveTo(ax + rnd() * aw * 0.5, ry); ctx.lineTo(ax + aw * (0.5 + rnd() * 0.5), ry); ctx.stroke(); }
      for (var mi = 0; mi < 7; mi++) { ctx.fillStyle = 'rgba(220,230,200,.12)'; ctx.beginPath(); ctx.ellipse(ax + rnd() * aw, ay + ah * (0.6 + rnd() * 0.25), 60, 9, 0, 0, Math.PI * 2); ctx.fill(); }
      for (var e = 0; e < 7; e++) glowDisc(ctx, ax + rnd() * aw, ay + ah * (0.4 + rnd() * 0.4), 5, '#c8ff8a', 0.9);
    } else if (key === 'oceano') {
      ctx.fillStyle = lin(ctx, 0, ay, 0, ay + ah, [[0, '#0b1d3a'], [0.45, '#2c6f9e'], [0.5, '#1d4f73'], [1, '#081a28']]);
      ctx.fillRect(ax, ay, aw, ah);
      stars(ctx, ax, ay, aw, ah * 0.4, rnd, 40);
      glowDisc(ctx, ax + aw * 0.3, ay + ah * 0.25, 45, '#dcefff', 0.5);
      ctx.fillStyle = '#f4f8ff'; ctx.beginPath(); ctx.arc(ax + aw * 0.3, ay + ah * 0.25, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(220,240,255,.5)';
      ctx.fillRect(ax + aw * 0.3 - 6, ay + ah * 0.48, 12, ah * 0.4);
      for (var wv = 0; wv < 9; wv++) {
        var wy = ay + ah * (0.5 + wv * 0.055);
        ctx.strokeStyle = 'rgba(200,235,255,' + (0.15 + wv * 0.06) + ')'; ctx.lineWidth = 1 + wv * 0.15;
        ctx.beginPath();
        for (var x2 = 0; x2 <= aw; x2 += 3) ctx.lineTo(ax + x2, wy + Math.sin(x2 * (0.06 + wv * 0.01) + wv * 1.3) * (1.5 + wv * 0.4));
        ctx.stroke();
      }
      ctx.save(); ctx.translate(ax + aw * 0.78, ay + ah * 0.24);
      ctx.strokeStyle = '#e8d6a0'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#c0283c'; ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(4, 0); ctx.lineTo(-4, 0); ctx.fill();
      ctx.fillStyle = '#e8eef5'; ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(4, 0); ctx.lineTo(-4, 0); ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = rad(ctx, ax + aw / 2, ay + ah * 0.5, 10, ax + aw / 2, ay + ah / 2, aw * 0.75, [[0, '#2f7a4c'], [1, '#0c2a18']]);
      ctx.fillRect(ax, ay, aw, ah);
      grain(ctx, ax, ay, aw, ah, rnd, 0.25, 0.12);
      glowDisc(ctx, ax + aw / 2, ay - 10, 120, '#ffe8b0', 0.35);
      /* cartas em leque */
      [-0.45, -0.15, 0.15, 0.45].forEach(function (a, i) {
        ctx.save(); ctx.translate(ax + aw * 0.62, ay + ah * 0.78); ctx.rotate(a);
        softShadow(ctx, 4, 2, 0.5);
        ctx.fillStyle = '#fbf5e6'; rr(ctx, -16, -62, 32, 46, 3); ctx.fill(); noShadow(ctx);
        ctx.strokeStyle = '#1d140b'; ctx.lineWidth = 0.8; ctx.stroke();
        emblem(ctx, ['espada', 'copa', 'ouro', 'pau'][i], 0, -39, 22, 0, { shadow: false });
        ctx.restore();
      });
      /* café */
      var cx = ax + aw * 0.26, cy = ay + ah * 0.7;
      softShadow(ctx, 6, 3, 0.5);
      ctx.fillStyle = '#efe7da'; ctx.beginPath(); ctx.ellipse(cx, cy + 14, 30, 9, 0, 0, Math.PI * 2); ctx.fill();
      noShadow(ctx);
      ctx.fillStyle = lin(ctx, cx - 16, 0, cx + 16, 0, [[0, '#d8cfc0'], [0.5, '#fbf7ee'], [1, '#cfc4b2']]);
      ctx.beginPath(); ctx.moveTo(cx - 16, cy - 16); ctx.lineTo(cx + 16, cy - 16); ctx.quadraticCurveTo(cx + 15, cy + 10, cx, cy + 12); ctx.quadraticCurveTo(cx - 15, cy + 10, cx - 16, cy - 16); ctx.fill();
      ctx.strokeStyle = '#d8cfc0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx + 18, cy - 4, 6, -1.2, 1.2); ctx.stroke();
      ctx.fillStyle = '#3b1f0e'; ctx.beginPath(); ctx.ellipse(cx, cy - 16, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1.6;
      [-5, 5].forEach(function (d) { ctx.beginPath(); ctx.moveTo(cx + d, cy - 22); ctx.bezierCurveTo(cx + d - 6, cy - 32, cx + d + 6, cy - 38, cx + d, cy - 48); ctx.stroke(); });
    }
    vignette(ctx, ax, ay, aw, ah, 0.5);
    ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = '#0b0907'; ctx.strokeRect(ax - 1, ay - 1, aw + 2, ah + 2);
    plate(ctx, 15, 214, 210, 22, P);
    ctx.fillStyle = INK; ctx.textBaseline = 'middle';
    fitFont(ctx, 'Terreno Básico — Distribuição de dados', 176, 11, '700', 'Cinzel, Georgia, serif', 7.5);
    ctx.fillText('Terreno Básico — Distribuição de dados', 24, 225.5);
    setSymbol(ctx, 211, 225, 6.5, 'incomum');
    var tx = 22, ty = 240, tw = 196, th = 72;
    ctx.fillStyle = lin(ctx, 0, ty, 0, ty + th, [[0, '#f7efdb'], [1, '#e6d6b0']]);
    ctx.fillRect(tx, ty, tw, th);
    ctx.strokeStyle = shade(P.mid, -0.4); ctx.lineWidth = 1.2; ctx.strokeRect(tx, ty, tw, th);
    ctx.fillStyle = INK; ctx.font = '500 12px Alegreya, Georgia, serif'; ctx.textBaseline = 'top';
    wrap(ctx, t.short, tx + 8, ty + 7, tw - 16, 14.5);
    return o.c;
  };

  /* ---------------------------------------------------------------- avatares */
  TT.drawAvatar = function (kind, colorHex, S) {
    var D = 112, o = mk(D, D, S || 1), ctx = o.ctx, c = D / 2;
    var rnd = prng(hash('av' + kind));
    /* aro metálico */
    ctx.fillStyle = lin(ctx, 0, 0, D, D, [[0, '#fff1b8'], [0.35, '#b98a2a'], [0.6, '#ffe7a0'], [1, '#6a4410']]);
    ctx.beginPath(); ctx.arc(c, c, c - 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = colorHex; ctx.beginPath(); ctx.arc(c, c, c - 6, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(c, c, c - 9, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = rad(ctx, c, c * 0.7, 4, c, c, c, [[0, '#3a2a1c'], [1, '#0e0905']]);
    ctx.fillRect(0, 0, D, D);
    if (kind === 'gradiente') {
      /* uma bolinha descendo a curva de perda */
      ctx.strokeStyle = 'rgba(245,147,34,.16)'; ctx.lineWidth = 0.6;
      for (var gl = 12; gl < D; gl += 12) { ctx.beginPath(); ctx.moveTo(gl, 0); ctx.lineTo(gl, D); ctx.moveTo(0, gl); ctx.lineTo(D, gl); ctx.stroke(); }
      var curve = function (x) { return 30 + Math.pow((x - 66) / 44, 2) * 52; };
      ctx.fillStyle = lin(ctx, 0, 30, 0, D, [[0, 'rgba(245,147,34,.35)'], [1, 'rgba(245,147,34,0)']]);
      ctx.beginPath(); ctx.moveTo(8, D);
      for (var cx2 = 8; cx2 <= 104; cx2 += 2) ctx.lineTo(cx2, D - curve(cx2) + 4);
      ctx.lineTo(104, D); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#f59322'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (var cx3 = 8; cx3 <= 104; cx3 += 2) { var yy3 = D - curve(cx3) + 4; if (cx3 === 8) ctx.moveTo(cx3, yy3); else ctx.lineTo(cx3, yy3); }
      ctx.stroke();
      /* passos do gradiente */
      [[24, 0.5], [36, 0.7], [46, 0.9]].forEach(function (pp) { glowDisc(ctx, pp[0], D - curve(pp[0]) - 2, 6, '#ffd08a', pp[1] * 0.6); ctx.fillStyle = 'rgba(255,220,160,' + pp[1] * 0.6 + ')'; ctx.beginPath(); ctx.arc(pp[0], D - curve(pp[0]) - 2, 2.2, 0, Math.PI * 2); ctx.fill(); });
      ctx.strokeStyle = '#ffe7a0'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(60, 30); ctx.lineTo(76, 46); ctx.stroke();
      ctx.fillStyle = '#ffe7a0'; ctx.beginPath(); ctx.moveTo(80, 50); ctx.lineTo(70, 47); ctx.lineTo(77, 40); ctx.closePath(); ctx.fill();
      /* a bolinha com rosto */
      var bx = 58, by = D - curve(58) - 12;
      softShadow(ctx, 6, 3, 0.6);
      ctx.fillStyle = rad(ctx, bx - 4, by - 5, 1, bx, by, 13, [[0, '#9fd6ff'], [0.6, '#4aa3df'], [1, '#1d5a86']]);
      ctx.beginPath(); ctx.arc(bx, by, 12, 0, Math.PI * 2); ctx.fill(); noShadow(ctx);
      ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(bx - 4, by - 2, 3, 3.6, 0, 0, Math.PI * 2); ctx.ellipse(bx + 4.5, by - 2, 3, 3.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0b0907'; ctx.beginPath(); ctx.arc(bx - 3, by - 1, 1.5, 0, Math.PI * 2); ctx.arc(bx + 5.5, by - 1, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(bx + 1, by + 3, 4, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(bx - 5, by - 7, 3.5, 1.8, -0.5, 0, Math.PI * 2); ctx.fill();
      ctx.font = '900 13px Cinzel, Georgia, serif'; ctx.fillStyle = '#ffe7a0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('\u2207', 30, 24);
    } else if (kind === 'mc') {
      stars(ctx, 0, 0, D, D * 0.6, rnd, 25);
      ctx.fillStyle = lin(ctx, 30, 0, 82, 0, [[0, '#2e1846'], [0.5, '#5a3290'], [1, '#2e1846']]);
      ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(56, 4); ctx.quadraticCurveTo(66, 30, 90, 62); ctx.lineTo(22, 62); ctx.quadraticCurveTo(46, 30, 56, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#3a2058'; ctx.beginPath(); ctx.ellipse(56, 62, 40, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f2c94c';
      [[46, 30], [60, 22], [52, 46], [66, 42]].forEach(function (p) { ctx.beginPath(); for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2, r = i % 2 ? 1.4 : 3.4; ctx.lineTo(p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r); } ctx.fill(); });
      [[40, 84, 0.3, '#f5efe0', '#c0283c'], [72, 86, -0.25, '#c0283c', '#ffffff']].forEach(function (d) {
        ctx.save(); ctx.translate(d[0], d[1]); ctx.rotate(d[2]);
        softShadow(ctx, 4, 2, 0.6);
        ctx.fillStyle = d[3]; rr(ctx, -14, -14, 28, 28, 5); ctx.fill(); noShadow(ctx); ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = d[4];
        [[-7, -7], [7, -7], [0, 0], [-7, 7], [7, 7]].forEach(function (q) { ctx.beginPath(); ctx.arc(q[0], q[1], 2.6, 0, Math.PI * 2); ctx.fill(); });
        ctx.restore();
      });
    } else if (kind === 'ruido') {
      /* TV antiga fora de sintonia, de chapéu de palha */
      ctx.strokeStyle = '#2a1a0e'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(50, 44); ctx.lineTo(38, 30); ctx.moveTo(62, 44); ctx.lineTo(76, 28); ctx.stroke();
      softShadow(ctx, 6, 3, 0.6);
      ctx.fillStyle = lin(ctx, 0, 44, 0, 96, [[0, '#a8682e'], [1, '#5a3010']]);
      rr(ctx, 20, 44, 72, 52, 9); ctx.fill(); noShadow(ctx);
      ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.save(); rr(ctx, 26, 50, 48, 40, 7); ctx.clip();
      for (var y = 50; y < 90; y += 2) for (var x = 26; x < 74; x += 2) {
        var v = Math.floor(rnd() * 255);
        ctx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; ctx.fillRect(x, y, 2, 2);
      }
      ctx.fillStyle = 'rgba(0,0,0,.22)'; for (var sl = 50; sl < 90; sl += 4) ctx.fillRect(26, sl, 48, 1.4);
      ctx.restore();
      ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.2; rr(ctx, 26, 50, 48, 40, 7); ctx.stroke();
      ctx.fillStyle = '#e8c878'; ctx.beginPath(); ctx.arc(83, 60, 3.5, 0, Math.PI * 2); ctx.arc(83, 72, 3.5, 0, Math.PI * 2); ctx.fill();
      /* chapéu de palha */
      ctx.fillStyle = lin(ctx, 0, 18, 0, 46, [[0, '#f6dc8f'], [1, '#c99a3a']]);
      ctx.strokeStyle = '#5a3a10'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(56, 42, 34, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(38, 41); ctx.quadraticCurveTo(38, 20, 56, 20); ctx.quadraticCurveTo(74, 20, 74, 41); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#a3222e'; ctx.fillRect(38.5, 34, 35, 5);
      ctx.strokeStyle = 'rgba(90,58,16,.45)'; ctx.lineWidth = 0.7;
      for (var st = 0; st < 6; st++) { ctx.beginPath(); ctx.moveTo(42 + st * 5.5, 24); ctx.lineTo(41 + st * 6, 34); ctx.stroke(); }
    } else {
      glowDisc(ctx, c, c, 50, colorHex, 0.35);
      ctx.fillStyle = lin(ctx, 0, 20, 0, 110, [[0, shade(colorHex, 0.3)], [1, shade(colorHex, -0.35)]]);
      ctx.beginPath(); ctx.arc(56, 44, 18, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(18, 110); ctx.quadraticCurveTo(20, 66, 56, 66); ctx.quadraticCurveTo(92, 66, 94, 110); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '900 18px Cinzel, Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(kind === 'p2' ? 'II' : 'I', 56, 45);
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.ellipse(40, 22, 22, 8, -0.5, 0, Math.PI * 2); ctx.fill();
    return o.c;
  };

  /* ---------------------------------------------------------------- mesa de feltro */
  TT.drawFelt = function (W, H, S) {
    var o = mk(W, H, S || 1), ctx = o.ctx;
    var rnd = prng(4242);
    ctx.fillStyle = rad(ctx, W * 0.47, H * 0.46, 40, W * 0.5, H * 0.5, W * 0.72, [[0, '#17573f'], [0.55, '#0f3d2b'], [1, '#05150d']]);
    ctx.fillRect(0, 0, W, H);
    /* fibras do feltro */
    ctx.lineWidth = 0.5;
    for (var i = 0; i < W * H / 90; i++) {
      var x = rnd() * W, y = rnd() * H, a = rnd() * Math.PI, l = 1.5 + rnd() * 3;
      ctx.strokeStyle = rnd() < 0.5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.08)';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
    }
    /* marca d'água: naipes e rede */
    ctx.globalAlpha = 0.045;
    emblem(ctx, 'espada', W * 0.47, H * 0.47, 260, 0.2, { shadow: false });
    ctx.globalAlpha = 1;
    ctx.fillStyle = rad(ctx, W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.75, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.55)']]);
    ctx.fillRect(0, 0, W, H);
    return o.c;
  };

  TT.drawSpark = function (S) {
    var o = mk(32, 32, S || 1), ctx = o.ctx;
    glowDisc(ctx, 16, 16, 16, '#ffffff', 1);
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(16, 16, 4, 0, Math.PI * 2); ctx.fill();
    return o.c;
  };

  TT.CARD_SIZES = { FULL_W: FULL_W, FULL_H: FULL_H, MINI_W: MINI_W, MINI_H: MINI_H };
})();
