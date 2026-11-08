/**
 * @file Retratos das figuras (Rei, Dama e Valete) no estilo do baralho espanhol.
 *
 * Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas
 * resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.
 */
import { PALETA_NAIPE, TINTA } from './paleta.js';
import { degradeLinear, semSombra, sombraSuave, tonalizar } from './pincel.js';
import { desenharEmblema } from './emblemas.js';
import { NAIPE } from '../nucleo/cartas.js';

const TRAJES = {
  K: { robe: '#2b4f9e', cape: '#a3222e', hair: '#b9b4ad', trim: '#f2c94c' },
  Q: { robe: '#a3222e', cape: '#2b4f9e', hair: '#d9a441', trim: '#f2c94c' },
  J: { robe: '#d79a2b', cape: '#2f7a46', hair: '#4a2a14', trim: '#f6efe0' },
};
/** Desenha a coroa (ou chapéu) da figura conforme o valor J, Q ou K. */
export function coroa(ctx, valor, s, cor) {
  ctx.fillStyle = degradeLinear(ctx, 0, -s * 0.4, 0, s * 0.2, [[0, '#fff3b8'], [0.5, cor], [1, '#8a5a10']]);
  ctx.strokeStyle = TINTA; ctx.lineWidth = s * 0.05;
  ctx.beginPath();
  if (valor === 'K') {
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
  if (valor === 'K') {
    ctx.fillStyle = '#fff';
    [[-0.54, -0.22], [0, -0.4], [0.54, -0.22]].forEach(function (k) { ctx.beginPath(); ctx.arc(k[0] * s, k[1] * s, s * 0.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
  }
}
/** Retrato meio-corpo; (cx, by) = base central, s = altura do retrato */
export function desenharFigura(ctx, valor, naipe, cx, by, s) {
  let C = TRAJES[valor], P = PALETA_NAIPE[naipe];
  let u = s / 100;
  ctx.save();
  ctx.translate(cx, by); ctx.scale(u, u);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = TINTA; ctx.lineWidth = 1.6;
  sombraSuave(ctx, 8, 3, 0.5);
  /* cabelo de trás (dama) */
  if (valor === 'Q') {
    ctx.fillStyle = degradeLinear(ctx, -20, -90, 20, -30, [[0, tonalizar(C.hair, 0.25)], [1, tonalizar(C.hair, -0.3)]]);
    ctx.beginPath(); ctx.moveTo(-17, -78); ctx.bezierCurveTo(-30, -60, -26, -38, -20, -30); ctx.lineTo(20, -30); ctx.bezierCurveTo(26, -38, 30, -60, 17, -78); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  /* capa */
  ctx.fillStyle = degradeLinear(ctx, -50, -60, 50, 0, [[0, tonalizar(C.cape, 0.2)], [0.5, C.cape], [1, tonalizar(C.cape, -0.45)]]);
  ctx.beginPath(); ctx.moveTo(-52, 2); ctx.bezierCurveTo(-50, -30, -44, -48, -18, -54); ctx.lineTo(18, -54); ctx.bezierCurveTo(44, -48, 50, -30, 52, 2); ctx.closePath(); ctx.fill();
  semSombra(ctx); ctx.stroke();
  /* túnica */
  ctx.fillStyle = degradeLinear(ctx, -28, -50, 28, 0, [[0, tonalizar(C.robe, 0.25)], [0.55, C.robe], [1, tonalizar(C.robe, -0.4)]]);
  ctx.beginPath(); ctx.moveTo(-31, 2); ctx.bezierCurveTo(-30, -20, -26, -44, -14, -50); ctx.lineTo(14, -50); ctx.bezierCurveTo(26, -44, 30, -20, 31, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.2;
  [[-18, -40, -22, 0], [18, -40, 22, 0], [-8, -30, -10, 0], [8, -30, 10, 0]].forEach(function (l) { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.quadraticCurveTo(l[0] * 1.2, (l[1] + l[3]) / 2, l[2], l[3]); ctx.stroke(); });
  /* faixa central bordada */
  ctx.strokeStyle = TINTA; ctx.lineWidth = 1.2;
  ctx.fillStyle = degradeLinear(ctx, -5, 0, 5, 0, [[0, tonalizar(C.trim, -0.3)], [0.5, C.trim], [1, tonalizar(C.trim, -0.3)]]);
  ctx.beginPath(); ctx.moveTo(-5, -50); ctx.lineTo(5, -50); ctx.lineTo(6, 2); ctx.lineTo(-6, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = P.gema;
  for (let d = 0; d < 4; d++) { ctx.beginPath(); ctx.arc(0, -40 + d * 11, 2, 0, Math.PI * 2); ctx.fill(); }
  /* gola */
  if (valor === 'K') {
    ctx.fillStyle = '#f6f1e6';
    ctx.beginPath(); ctx.ellipse(0, -51, 24, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = TINTA; for (let e = -3; e <= 3; e++) { ctx.beginPath(); ctx.arc(e * 6, -51 + (e % 2) * 2, 1.1, 0, Math.PI * 2); ctx.fill(); }
  } else {
    ctx.fillStyle = '#fbf6ea';
    ctx.beginPath();
    for (let escala = 0; escala <= 12; escala++) { let aa = Math.PI + (escala / 12) * Math.PI; ctx.lineTo(Math.cos(aa) * 20, -53 - Math.sin(aa) * 6 + (escala % 2 ? 2.5 : 0)); }
    for (let sc2 = 12; sc2 >= 0; sc2--) { let ab = Math.PI + (sc2 / 12) * Math.PI; ctx.lineTo(Math.cos(ab) * 20, -48 - Math.sin(ab) * 4); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  /* pescoço e rosto */
  let skin = degradeLinear(ctx, -12, -90, 12, -55, [[0, '#f7d6b6'], [1, '#d59b72']]);
  ctx.fillStyle = skin;
  ctx.fillRect(-5, -60, 10, 8); ctx.strokeRect(-5, -60, 10, 8);
  ctx.beginPath(); ctx.ellipse(0, -72, 12.5, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  /* cabelo da frente */
  ctx.fillStyle = degradeLinear(ctx, 0, -92, 0, -60, [[0, tonalizar(C.hair, 0.3)], [1, tonalizar(C.hair, -0.25)]]);
  if (valor === 'K') {
    ctx.beginPath(); ctx.moveTo(-13, -76); ctx.bezierCurveTo(-15, -60, -12, -48, 0, -44); ctx.bezierCurveTo(12, -48, 15, -60, 13, -76);
    ctx.bezierCurveTo(9, -64, 5, -62, 0, -62); ctx.bezierCurveTo(-5, -62, -9, -64, -13, -76); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-6, -64); ctx.quadraticCurveTo(0, -67, 6, -64); ctx.quadraticCurveTo(0, -62, -6, -64); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-13, -78); ctx.quadraticCurveTo(-14, -88, -6, -88); ctx.lineTo(6, -88); ctx.quadraticCurveTo(14, -88, 13, -78); ctx.quadraticCurveTo(0, -83, -13, -78); ctx.fill();
  } else if (valor === 'Q') {
    ctx.beginPath(); ctx.moveTo(-13, -72); ctx.bezierCurveTo(-14, -90, 14, -90, 13, -72); ctx.bezierCurveTo(8, -84, -8, -84, -13, -72); ctx.fill(); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(-13, -70); ctx.bezierCurveTo(-15, -92, 15, -92, 13, -70); ctx.bezierCurveTo(10, -80, 2, -78, -2, -82); ctx.bezierCurveTo(-6, -78, -10, -80, -13, -70); ctx.fill(); ctx.stroke();
  }
  /* feições */
  ctx.fillStyle = TINTA;
  ctx.beginPath(); ctx.ellipse(-4.6, -73, 1.6, 1.1, 0, 0, Math.PI * 2); ctx.ellipse(4.6, -73, 1.6, 1.1, 0, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(-7, -76.5); ctx.quadraticCurveTo(-4.5, -78, -2, -76.5); ctx.moveTo(2, -76.5); ctx.quadraticCurveTo(4.5, -78, 7, -76.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -72); ctx.quadraticCurveTo(1.6, -67.5, -0.6, -66.5); ctx.stroke();
  if (valor !== 'K') { ctx.fillStyle = '#b73a3a'; ctx.beginPath(); ctx.ellipse(0, -63.2, 2.8, 1.1, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(220,90,90,.25)'; ctx.beginPath(); ctx.arc(-7, -68, 2.6, 0, Math.PI * 2); ctx.arc(7, -68, 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = 1.6;
  /* coroa / chapéu */
  if (valor === 'J') {
    ctx.fillStyle = degradeLinear(ctx, -16, -96, 16, -84, [[0, '#c0283c'], [1, '#6a0f1a']]);
    ctx.beginPath(); ctx.moveTo(-16, -84); ctx.quadraticCurveTo(-18, -98, 0, -98); ctx.quadraticCurveTo(20, -98, 18, -86); ctx.quadraticCurveTo(0, -80, -16, -84); ctx.fill(); ctx.stroke();
    ctx.fillStyle = degradeLinear(ctx, 6, -110, 34, -96, [[0, '#ffffff'], [1, '#d8cbb0']]);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(6, -94); ctx.bezierCurveTo(10, -112, 26, -118, 34, -110); ctx.bezierCurveTo(28, -104, 20, -98, 6, -94); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(8, -95); ctx.quadraticCurveTo(20, -106, 32, -110); ctx.stroke();
    ctx.strokeStyle = TINTA; ctx.lineWidth = 1.6;
  } else {
    ctx.save(); ctx.translate(0, -89); coroa(ctx, valor, valor === 'K' ? 30 : 22, valor === 'K' ? '#f2c94c' : '#e9d9ff'); ctx.restore();
    if (valor === 'Q') { ctx.fillStyle = '#f2c94c'; ctx.beginPath(); ctx.arc(-12.5, -66, 1.8, 0, Math.PI * 2); ctx.arc(12.5, -66, 1.8, 0, Math.PI * 2); ctx.fill(); }
  }
  /* mão + emblema do naipe */
  let em = NAIPE[naipe].emblem;
  let hx = 26, hy = -26;
  if (em === 'espada') desenharEmblema(ctx, 'espada', 34, -46, 70, 0.12);
  else if (em === 'pau') desenharEmblema(ctx, 'pau', 34, -44, 64, 0.5);
  else if (em === 'copa') desenharEmblema(ctx, 'copa', 30, -34, 34, 0);
  else desenharEmblema(ctx, 'ouro', 30, -32, 30, 0);
  ctx.fillStyle = skin; ctx.strokeStyle = TINTA; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(hx + 2, hy - 2, 5.5, 4.5, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
