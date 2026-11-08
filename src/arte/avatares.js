/**
 * @file Retratos redondos dos participantes: os três oponentes e o jogador (rosto com chapéu de palha).
 *
 * Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas
 * resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.
 */
import { brilho, caminhoArredondado, criarTela, degradeLinear, degradeRadial, geradorComSemente, hashDoTexto, semSombra, sombraSuave, tonalizar } from './pincel.js';
import { estrelas } from './cenarios.js';

/**
 * Desenha um avatar redondo de 112x112 (base).
 * @param {'gradiente'|'mc'|'ruido'|'p1'|'p2'} tipo Oponente ou jogador 1/2.
 * @param {string} cor Cor do aro e da roupa.
 * @param {number} S Densidade.
 */
export function desenharAvatar(tipo, cor, S) {
  let D = 112, o = criarTela(D, D, S || 1), ctx = o.ctx, c = D / 2;
  let aleatorio = geradorComSemente(hashDoTexto('av' + tipo));
  /* aro metálico */
  ctx.fillStyle = degradeLinear(ctx, 0, 0, D, D, [[0, '#fff1b8'], [0.35, '#b98a2a'], [0.6, '#ffe7a0'], [1, '#6a4410']]);
  ctx.beginPath(); ctx.arc(c, c, c - 1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(c, c, c - 6, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(c, c, c - 9, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = degradeRadial(ctx, c, c * 0.7, 4, c, c, c, [[0, '#3a2a1c'], [1, '#0e0905']]);
  ctx.fillRect(0, 0, D, D);
  if (tipo === 'gradiente') {
    /* uma bolinha descendo a curva de perda */
    ctx.strokeStyle = 'rgba(245,147,34,.16)'; ctx.lineWidth = 0.6;
    for (let gl = 12; gl < D; gl += 12) { ctx.beginPath(); ctx.moveTo(gl, 0); ctx.lineTo(gl, D); ctx.moveTo(0, gl); ctx.lineTo(D, gl); ctx.stroke(); }
    let curve = function (x) { return 30 + Math.pow((x - 66) / 44, 2) * 52; };
    ctx.fillStyle = degradeLinear(ctx, 0, 30, 0, D, [[0, 'rgba(245,147,34,.35)'], [1, 'rgba(245,147,34,0)']]);
    ctx.beginPath(); ctx.moveTo(8, D);
    for (let cx2 = 8; cx2 <= 104; cx2 += 2) ctx.lineTo(cx2, D - curve(cx2) + 4);
    ctx.lineTo(104, D); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#f59322'; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let cx3 = 8; cx3 <= 104; cx3 += 2) { let yy3 = D - curve(cx3) + 4; if (cx3 === 8) ctx.moveTo(cx3, yy3); else ctx.lineTo(cx3, yy3); }
    ctx.stroke();
    /* passos do gradiente */
    [[24, 0.5], [36, 0.7], [46, 0.9]].forEach(function (pp) { brilho(ctx, pp[0], D - curve(pp[0]) - 2, 6, '#ffd08a', pp[1] * 0.6); ctx.fillStyle = 'rgba(255,220,160,' + pp[1] * 0.6 + ')'; ctx.beginPath(); ctx.arc(pp[0], D - curve(pp[0]) - 2, 2.2, 0, Math.PI * 2); ctx.fill(); });
    ctx.strokeStyle = '#ffe7a0'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(60, 30); ctx.lineTo(76, 46); ctx.stroke();
    ctx.fillStyle = '#ffe7a0'; ctx.beginPath(); ctx.moveTo(80, 50); ctx.lineTo(70, 47); ctx.lineTo(77, 40); ctx.closePath(); ctx.fill();
    /* a bolinha com rosto */
    let bx = 58, by = D - curve(58) - 12;
    sombraSuave(ctx, 6, 3, 0.6);
    ctx.fillStyle = degradeRadial(ctx, bx - 4, by - 5, 1, bx, by, 13, [[0, '#9fd6ff'], [0.6, '#4aa3df'], [1, '#1d5a86']]);
    ctx.beginPath(); ctx.arc(bx, by, 12, 0, Math.PI * 2); ctx.fill(); semSombra(ctx);
    ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(bx - 4, by - 2, 3, 3.6, 0, 0, Math.PI * 2); ctx.ellipse(bx + 4.5, by - 2, 3, 3.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0b0907'; ctx.beginPath(); ctx.arc(bx - 3, by - 1, 1.5, 0, Math.PI * 2); ctx.arc(bx + 5.5, by - 1, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(bx + 1, by + 3, 4, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(bx - 5, by - 7, 3.5, 1.8, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.font = '900 13px Cinzel, Georgia, serif'; ctx.fillStyle = '#ffe7a0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('\u2207', 30, 24);
  } else if (tipo === 'mc') {
    estrelas(ctx, 0, 0, D, D * 0.6, aleatorio, 25);
    ctx.fillStyle = degradeLinear(ctx, 30, 0, 82, 0, [[0, '#2e1846'], [0.5, '#5a3290'], [1, '#2e1846']]);
    ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(56, 4); ctx.quadraticCurveTo(66, 30, 90, 62); ctx.lineTo(22, 62); ctx.quadraticCurveTo(46, 30, 56, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3a2058'; ctx.beginPath(); ctx.ellipse(56, 62, 40, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f2c94c';
    [[46, 30], [60, 22], [52, 46], [66, 42]].forEach(function (p) { ctx.beginPath(); for (let i = 0; i < 10; i++) { let a = i / 10 * Math.PI * 2, r = i % 2 ? 1.4 : 3.4; ctx.lineTo(p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r); } ctx.fill(); });
    [[40, 84, 0.3, '#f5efe0', '#c0283c'], [72, 86, -0.25, '#c0283c', '#ffffff']].forEach(function (d) {
      ctx.save(); ctx.translate(d[0], d[1]); ctx.rotate(d[2]);
      sombraSuave(ctx, 4, 2, 0.6);
      ctx.fillStyle = d[3]; caminhoArredondado(ctx, -14, -14, 28, 28, 5); ctx.fill(); semSombra(ctx); ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = d[4];
      [[-7, -7], [7, -7], [0, 0], [-7, 7], [7, 7]].forEach(function (q) { ctx.beginPath(); ctx.arc(q[0], q[1], 2.6, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();
    });
  } else if (tipo === 'ruido') {
    /* TV antiga fora de sintonia, de boné */
    ctx.strokeStyle = '#2a1a0e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(50, 44); ctx.lineTo(38, 30); ctx.moveTo(62, 44); ctx.lineTo(76, 28); ctx.stroke();
    sombraSuave(ctx, 6, 3, 0.6);
    ctx.fillStyle = degradeLinear(ctx, 0, 44, 0, 96, [[0, '#a8682e'], [1, '#5a3010']]);
    caminhoArredondado(ctx, 20, 44, 72, 52, 9); ctx.fill(); semSombra(ctx);
    ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.save(); caminhoArredondado(ctx, 26, 50, 48, 40, 7); ctx.clip();
    for (let y = 50; y < 90; y += 2) for (let x = 26; x < 74; x += 2) {
      let v = Math.floor(aleatorio() * 255);
      ctx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; ctx.fillRect(x, y, 2, 2);
    }
    ctx.fillStyle = 'rgba(0,0,0,.22)'; for (let sl = 50; sl < 90; sl += 4) ctx.fillRect(26, sl, 48, 1.4);
    ctx.restore();
    ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.2; caminhoArredondado(ctx, 26, 50, 48, 40, 7); ctx.stroke();
    ctx.fillStyle = '#e8c878'; ctx.beginPath(); ctx.arc(83, 60, 3.5, 0, Math.PI * 2); ctx.arc(83, 72, 3.5, 0, Math.PI * 2); ctx.fill();
    /* boné de aba torta */
    ctx.fillStyle = degradeLinear(ctx, 0, 22, 0, 44, [[0, '#f59322'], [1, '#b85e0e']]);
    ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(38, 44); ctx.quadraticCurveTo(38, 24, 56, 24); ctx.quadraticCurveTo(74, 24, 74, 44); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c96a12';
    ctx.beginPath(); ctx.moveTo(68, 41); ctx.quadraticCurveTo(84, 36, 92, 42); ctx.quadraticCurveTo(82, 47, 70, 45); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(56, 24.5, 2.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else {
    /* jogador: truqueiro de chapéu de palha */
    let two = tipo === 'p2';
    brilho(ctx, c, c + 8, 54, cor, 0.4);
    /* camisa e lenço */
    ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.5;
    ctx.fillStyle = degradeLinear(ctx, 0, 84, 0, 112, [[0, tonalizar(cor, 0.15)], [1, tonalizar(cor, -0.45)]]);
    ctx.beginPath(); ctx.moveTo(10, 112); ctx.quadraticCurveTo(14, 86, 56, 84); ctx.quadraticCurveTo(98, 86, 102, 112); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f6efe0';
    ctx.beginPath(); ctx.moveTo(42, 86); ctx.lineTo(56, 102); ctx.lineTo(70, 86); ctx.lineTo(62, 85); ctx.lineTo(56, 92); ctx.lineTo(50, 85); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = two ? '#2f7a46' : '#c0283c';
    ctx.beginPath(); ctx.moveTo(46, 83); ctx.quadraticCurveTo(56, 90, 66, 83); ctx.lineTo(62, 92); ctx.lineTo(56, 88); ctx.lineTo(50, 92); ctx.closePath(); ctx.fill(); ctx.stroke();
    /* pescoço, orelhas e rosto */
    let skin = degradeLinear(ctx, 36, 40, 76, 84, [[0, two ? '#e8b48c' : '#f7d6b6'], [1, two ? '#b9805a' : '#d59b72']]);
    ctx.fillStyle = skin;
    ctx.fillRect(49, 74, 14, 12); ctx.strokeRect(49, 74, 14, 12);
    ctx.beginPath(); ctx.ellipse(36, 60, 4.5, 6.5, 0, 0, Math.PI * 2); ctx.ellipse(76, 60, 4.5, 6.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(56, 59, 20, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    /* cabelo saindo do chapéu */
    ctx.fillStyle = two ? '#2a1a0e' : '#5a3418';
    ctx.beginPath(); ctx.moveTo(36, 50); ctx.quadraticCurveTo(38, 42, 46, 42); ctx.lineTo(40, 56); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(76, 50); ctx.quadraticCurveTo(74, 42, 66, 42); ctx.lineTo(72, 56); ctx.closePath(); ctx.fill();
    /* olhos, sobrancelhas e nariz */
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(48.5, 58, 4.2, 3.6, 0, 0, Math.PI * 2); ctx.ellipse(63.5, 58, 4.2, 3.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a1a0e'; ctx.beginPath(); ctx.arc(49.3, 58.5, 2.2, 0, Math.PI * 2); ctx.arc(64.3, 58.5, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(50, 57.6, 0.8, 0, Math.PI * 2); ctx.arc(65, 57.6, 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = two ? '#2a1a0e' : '#4a2a12'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(43.5, 52); ctx.quadraticCurveTo(48.5, 49.5, 53, 51.5); ctx.moveTo(59, 51.5); ctx.quadraticCurveTo(63.5, 49, 68.5, 52.5); ctx.stroke();
    ctx.strokeStyle = 'rgba(120,60,30,.8)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(56, 60); ctx.quadraticCurveTo(59.5, 66, 55.5, 67); ctx.stroke();
    ctx.fillStyle = 'rgba(230,100,100,.3)'; ctx.beginPath(); ctx.arc(42, 66, 4, 0, Math.PI * 2); ctx.arc(70, 66, 4, 0, Math.PI * 2); ctx.fill();
    /* sorriso maroto (e bigode no jogador 2) */
    ctx.fillStyle = '#7a1e1e'; ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(46, 70); ctx.quadraticCurveTo(56, 80, 67, 69); ctx.quadraticCurveTo(56, 74, 46, 70); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(48.5, 71); ctx.quadraticCurveTo(56, 74.5, 64.5, 70.5); ctx.lineTo(63.5, 72.3); ctx.quadraticCurveTo(56, 75.5, 49.5, 72.5); ctx.closePath(); ctx.fill();
    if (two) {
      ctx.fillStyle = '#2a1a0e';
      ctx.beginPath(); ctx.moveTo(56, 67); ctx.quadraticCurveTo(48, 65, 43, 70); ctx.quadraticCurveTo(50, 68, 56, 69.5); ctx.quadraticCurveTo(62, 68, 69, 70); ctx.quadraticCurveTo(64, 65, 56, 67); ctx.fill();
    }
    /* capim no canto da boca */
    ctx.strokeStyle = '#c9b04a'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(65, 71); ctx.quadraticCurveTo(76, 70, 88, 64); ctx.stroke();
    ctx.strokeStyle = '#8fae3a'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(85, 65.5); ctx.lineTo(90, 60); ctx.moveTo(85, 65.5); ctx.lineTo(92, 64); ctx.stroke();
    /* chapéu de palha */
    ctx.strokeStyle = '#5a3a10'; ctx.lineWidth = 1.3;
    sombraSuave(ctx, 5, 3, 0.45);
    ctx.fillStyle = degradeLinear(ctx, 0, 34, 0, 50, [[0, '#fbe7a6'], [1, '#c99a3a']]);
    ctx.beginPath(); ctx.ellipse(56, 43, 44, 10, -0.04, 0, Math.PI * 2); ctx.fill();
    semSombra(ctx); ctx.stroke();
    ctx.fillStyle = degradeLinear(ctx, 0, 10, 0, 42, [[0, '#fff0c0'], [1, '#d9a944']]);
    ctx.beginPath(); ctx.moveTo(34, 42); ctx.bezierCurveTo(34, 18, 42, 12, 56, 12); ctx.bezierCurveTo(70, 12, 78, 18, 78, 42); ctx.quadraticCurveTo(56, 47, 34, 42); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(90,58,16,.4)'; ctx.lineWidth = 0.8;
    for (let sx = 0; sx < 8; sx++) { ctx.beginPath(); ctx.moveTo(39 + sx * 5, 15 + Math.abs(sx - 3.5) * 1.2); ctx.lineTo(37 + sx * 5.6, 38); ctx.stroke(); }
    for (let bx = 0; bx < 14; bx++) { ctx.beginPath(); ctx.moveTo(14 + bx * 6.2, 41 + Math.sin(bx) * 1.5); ctx.lineTo(16 + bx * 6.2, 47 - Math.cos(bx) * 1.5); ctx.stroke(); }
    ctx.fillStyle = cor; ctx.strokeStyle = '#0b0907'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(34.5, 34); ctx.quadraticCurveTo(56, 39, 77.5, 34); ctx.lineTo(78, 40); ctx.quadraticCurveTo(56, 45, 34, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff6dc'; ctx.font = '900 7px Cinzel, Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(two ? 'II' : 'I', 56, 39);
  }
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.ellipse(40, 22, 22, 8, -0.5, 0, Math.PI * 2); ctx.fill();
  return o.c;
}
