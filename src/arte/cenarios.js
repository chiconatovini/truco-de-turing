/**
 * @file Cenários pintados das janelas de arte: montanhas ao luar (espadas), salão de banquete (copas), floresta (paus) e deserto dourado (ouros), com uma constelação em forma de rede neural.
 *
 * Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas
 * resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.
 */
import { PALETA_NAIPE } from './paleta.js';
import { brilho, comAlfa, degradeLinear, degradeRadial } from './pincel.js';

/** Gera o perfil de uma serra (alturas de 0 a 1) por subdivisão aleatória; `aspereza` controla o serrilhado. */
export function perfilDeSerra(aleatorio, w, aspereza) {
  let n = 64, pts = new Array(n + 1);
  pts[0] = aleatorio(); pts[n] = aleatorio();
  (function sub(a, b, amp) {
    if (b - a < 2) return;
    let m = (a + b) >> 1;
    pts[m] = (pts[a] + pts[b]) / 2 + (aleatorio() - 0.5) * amp;
    sub(a, m, amp * aspereza); sub(m, b, amp * aspereza);
  })(0, n, 1);
  return pts;
}
/** Desenha camadas de montanhas, da mais distante à mais próxima, com neve opcional nos picos. */
export function montanhas(ctx, x, y, w, h, aleatorio, camadas) {
  camadas.forEach(function (L) {
    let pts = perfilDeSerra(aleatorio, w, L.aspereza || 0.55);
    ctx.fillStyle = L.preenchimento;
    ctx.beginPath(); ctx.moveTo(x, y + h);
    pts.forEach(function (p, i) { ctx.lineTo(x + (i / (pts.length - 1)) * w, y + h * L.base - p * h * L.amplitude); });
    ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
    if (L.neve) {
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      pts.forEach(function (p, i) {
        let px = x + (i / (pts.length - 1)) * w, py = y + h * L.base - p * h * L.amplitude;
        if (p > 0.72) { ctx.beginPath(); ctx.moveTo(px - 3, py + 4); ctx.lineTo(px, py); ctx.lineTo(px + 3, py + 4); ctx.fill(); }
      });
    }
  });
}
/** Espalha `n` estrelas pequenas na área. */
export function estrelas(ctx, x, y, w, h, aleatorio, n, cor) {
  for (let i = 0; i < n; i++) {
    let r = aleatorio() * 0.9 + 0.2;
    ctx.fillStyle = 'rgba(255,255,255,' + (0.3 + aleatorio() * 0.6) + ')';
    ctx.beginPath(); ctx.arc(x + aleatorio() * w, y + aleatorio() * h, r, 0, Math.PI * 2); ctx.fill();
  }
}
/** Constelação em forma de rede neural: o toque de ML no céu */
export function constelacao(ctx, x, y, w, h, aleatorio, cor) {
  let cols = 4, pts = [];
  for (let c = 0; c < cols; c++) {
    let n = 2 + Math.floor(aleatorio() * 3), arr = [];
    for (let i = 0; i < n; i++) arr.push([x + w * (0.1 + 0.8 * c / (cols - 1)) + (aleatorio() - 0.5) * 8, y + h * (0.12 + 0.76 * (i + 0.5) / n) + (aleatorio() - 0.5) * 6]);
    pts.push(arr);
  }
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let c2 = 0; c2 < cols - 1; c2++) {
    pts[c2].forEach(function (a) {
      pts[c2 + 1].forEach(function (b) {
        if (aleatorio() < 0.3) return;
        ctx.strokeStyle = comAlfa(cor, 0.12 + aleatorio() * 0.22); ctx.lineWidth = 0.4 + aleatorio() * 1.1;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      });
    });
  }
  pts.forEach(function (arr) { arr.forEach(function (p) { brilho(ctx, p[0], p[1], 5, cor, 0.55); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p[0], p[1], 1.1, 0, Math.PI * 2); ctx.fill(); }); });
  ctx.restore();
}
/** Escurece as bordas da área (efeito de vinheta) com intensidade `a`. */
export function vinheta(ctx, x, y, w, h, a) {
  ctx.fillStyle = degradeRadial(ctx, x + w / 2, y + h * 0.45, Math.min(w, h) * 0.25, x + w / 2, y + h / 2, Math.max(w, h) * 0.72, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,' + (a || 0.6) + ')']]);
  ctx.fillRect(x, y, w, h);
}
/** Desenha `n` raios de luz saindo de (cx, cy). */
export function raios(ctx, cx, cy, n, comprimento, abertura, cor, a) {
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < n; i++) {
    let ang = -Math.PI / 2 + (i - (n - 1) / 2) * abertura;
    ctx.fillStyle = degradeLinear(ctx, cx, cy, cx + Math.cos(ang) * comprimento, cy + Math.sin(ang) * comprimento, [[0, comAlfa(cor, a)], [1, comAlfa(cor, 0)]]);
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang - 0.05) * comprimento, cy + Math.sin(ang - 0.05) * comprimento);
    ctx.lineTo(cx + Math.cos(ang + 0.05) * comprimento, cy + Math.sin(ang + 0.05) * comprimento);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

/** Fundo temático de cada naipe (espadas: noite e montanhas; copas: salão; paus: floresta; ouros: deserto dourado). Opções: `constelacao` (falso para omitir) e `escurecer` (0 a 1). */
export function cenarioDoNaipe(ctx, naipe, x, y, w, h, aleatorio, opcoes) {
  opcoes = opcoes || {};
  let P = PALETA_NAIPE[naipe];
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = degradeLinear(ctx, 0, y, 0, y + h, [[0, P.ceu[0]], [0.55, P.ceu[1]], [1, P.ceu[2]]]);
  ctx.fillRect(x, y, w, h);
  if (naipe === 'E') {
    estrelas(ctx, x, y, w, h * 0.5, aleatorio, 40);
    brilho(ctx, x + w * 0.78, y + h * 0.2, h * 0.32, '#dce9ff', 0.5);
    ctx.fillStyle = '#eef4ff'; ctx.beginPath(); ctx.arc(x + w * 0.78, y + h * 0.2, h * 0.085, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(160,180,210,.5)'; ctx.beginPath(); ctx.arc(x + w * 0.8, y + h * 0.19, h * 0.07, 0, Math.PI * 2); ctx.fill();
    montanhas(ctx, x, y, w, h, aleatorio, [
      { preenchimento: '#5b7593', base: 0.62, amplitude: 0.32, neve: true },
      { preenchimento: '#33475f', base: 0.78, amplitude: 0.26 },
      { preenchimento: '#18243a', base: 0.95, amplitude: 0.2, aspereza: 0.6 },
    ]);
    ctx.fillStyle = degradeLinear(ctx, 0, y + h * 0.55, 0, y + h * 0.8, [[0, 'rgba(200,220,240,0)'], [0.5, 'rgba(200,220,240,.22)'], [1, 'rgba(200,220,240,0)']]);
    ctx.fillRect(x, y + h * 0.55, w, h * 0.25);
  } else if (naipe === 'C') {
    /* salão com arcos e velas */
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    for (let a = 0; a < 3; a++) {
      let ax = x + w * (0.2 + a * 0.3), aw = w * 0.17, ay = y + h * 0.16, ah = h * 0.58;
      ctx.fillStyle = degradeLinear(ctx, 0, ay, 0, ay + ah, [[0, '#ffcf7a'], [1, '#c2533d']]);
      ctx.beginPath(); ctx.moveTo(ax - aw / 2, ay + ah); ctx.lineTo(ax - aw / 2, ay + aw / 2); ctx.arc(ax, ay + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(ax + aw / 2, ay + ah); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(40,6,8,.9)'; ctx.lineWidth = 2.2; ctx.stroke();
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, ay + ah); ctx.moveTo(ax - aw / 2, ay + ah * 0.55); ctx.lineTo(ax + aw / 2, ay + ah * 0.55); ctx.stroke();
    }
    ctx.fillStyle = degradeLinear(ctx, 0, y + h * 0.74, 0, y + h, [[0, '#3a0a0e'], [1, '#160305']]);
    ctx.fillRect(x, y + h * 0.74, w, h * 0.26);
    ctx.strokeStyle = 'rgba(255,200,140,.12)'; ctx.lineWidth = 0.8;
    for (let t = -6; t <= 6; t++) { ctx.beginPath(); ctx.moveTo(x + w / 2 + t * 6, y + h * 0.74); ctx.lineTo(x + w / 2 + t * 40, y + h); ctx.stroke(); }
    [0.08, 0.36, 0.64, 0.92].forEach(function (cx) {
      let px = x + w * cx, py = y + h * 0.7;
      brilho(ctx, px, py - 10, 22, '#ffb45a', 0.5);
      ctx.fillStyle = '#f2e6d0'; ctx.fillRect(px - 2.2, py - 8, 4.4, 14);
      ctx.fillStyle = '#ffd36a'; ctx.beginPath(); ctx.ellipse(px, py - 11.5, 2, 4, 0, 0, Math.PI * 2); ctx.fill();
    });
  } else if (naipe === 'P') {
    raios(ctx, x + w * 0.65, y - h * 0.1, 7, h * 1.4, 0.12, '#f2ffc8', 0.22);
    for (let L = 0; L < 3; L++) {
      let cor = ['#3d6b3e', '#24472a', '#0f2414'][L];
      for (let tr = 0; tr < 6 + L * 2; tr++) {
        let tx = x + aleatorio() * w, tw = 4 + L * 4 + aleatorio() * 4;
        ctx.fillStyle = cor;
        ctx.beginPath(); ctx.moveTo(tx - tw / 2, y + h); ctx.bezierCurveTo(tx - tw * 0.3, y + h * 0.5, tx + tw * 0.2, y + h * 0.3, tx - tw * 0.15, y - 5);
        ctx.lineTo(tx + tw * 0.35, y - 5); ctx.bezierCurveTo(tx + tw * 0.6, y + h * 0.3, tx + tw * 0.4, y + h * 0.5, tx + tw / 2, y + h); ctx.fill();
      }
      ctx.fillStyle = comAlfa(cor, 0.9);
      for (let nuvem = 0; nuvem < 7; nuvem++) { ctx.beginPath(); ctx.ellipse(x + aleatorio() * w, y + h * (0.05 + L * 0.04) + aleatorio() * 10, 26 + aleatorio() * 20, 14 + aleatorio() * 8, 0, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.fillStyle = degradeLinear(ctx, 0, y + h * 0.82, 0, y + h, [[0, '#1d3a1f'], [1, '#081208']]);
    ctx.fillRect(x, y + h * 0.82, w, h * 0.18);
    ctx.strokeStyle = '#3f7a3a'; ctx.lineWidth = 1;
    for (let f = 0; f < 30; f++) { let fx = x + aleatorio() * w; ctx.beginPath(); ctx.moveTo(fx, y + h); ctx.quadraticCurveTo(fx + 4, y + h * 0.88, fx + 9 * (aleatorio() - 0.3), y + h * 0.84); ctx.stroke(); }
    ctx.fillStyle = 'rgba(230,255,170,.8)';
    for (let ff = 0; ff < 10; ff++) { brilho(ctx, x + aleatorio() * w, y + h * (0.4 + aleatorio() * 0.45), 4, '#eaffb0', 0.8); }
  } else {
    brilho(ctx, x + w * 0.5, y + h * 0.56, h * 0.9, '#fff0b0', 0.55);
    ctx.fillStyle = degradeRadial(ctx, x + w * 0.5, y + h * 0.56, 0, x + w * 0.5, y + h * 0.56, h * 0.22, [[0, '#fffbe6'], [1, '#ffd36a']]);
    ctx.beginPath(); ctx.arc(x + w * 0.5, y + h * 0.56, h * 0.2, 0, Math.PI * 2); ctx.fill();
    [['#c46d1e', 0.68, 0.14], ['#9a4a12', 0.8, 0.12], ['#5a2a08', 0.93, 0.1]].forEach(function (d) {
      ctx.fillStyle = d[0];
      ctx.beginPath(); ctx.moveTo(x, y + h);
      for (let i = 0; i <= 20; i++) ctx.lineTo(x + (i / 20) * w, y + h * d[1] - Math.sin(i * 0.5 + aleatorio() * 2) * h * d[2] * 0.4 - aleatorio() * 3);
      ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
    });
    for (let sp = 0; sp < 18; sp++) {
      let sx = x + aleatorio() * w, sy = y + h * (0.65 + aleatorio() * 0.3);
      ctx.fillStyle = 'rgba(255,245,200,.9)';
      ctx.beginPath(); ctx.moveTo(sx, sy - 2.5); ctx.lineTo(sx + 0.7, sy); ctx.lineTo(sx, sy + 2.5); ctx.lineTo(sx - 0.7, sy); ctx.fill();
    }
  }
  if (opcoes.constelacao !== false) constelacao(ctx, x + w * 0.04, y + h * 0.04, w * 0.92, h * 0.5, aleatorio, P.brilho);
  if (opcoes.escurecer) { ctx.fillStyle = 'rgba(0,0,0,' + opcoes.escurecer + ')'; ctx.fillRect(x, y, w, h); }
  vinheta(ctx, x, y, w, h, 0.55);
  ctx.restore();
}
