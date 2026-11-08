/**
 * @file Naipes espanhóis do truco desenhados à mão: espada, copa, ouro e pau (bastão).
 */
import { caminhoArredondado, degradeLinear, degradeRadial, semSombra, sombraSuave } from './pincel.js';

/** Desenha o emblema do naipe espanhol: 'espada', 'copa', 'ouro' ou 'pau'. Opção `sombra` (falso para desenhar sem sombra). */
export function desenharEmblema(ctx, tipo, cx, cy, s, rot, opcoes) {
  opcoes = opcoes || {};
  ctx.save();
  ctx.translate(cx, cy);
  if (rot) ctx.rotate(rot);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  let lw = Math.max(0.8, s * 0.028);
  ctx.lineWidth = lw; ctx.strokeStyle = '#140d06';
  if (opcoes.sombra !== false) sombraSuave(ctx, s * 0.08, s * 0.03, 0.55);
  if (tipo === 'espada') {
    /* lâmina com sulco central */
    ctx.fillStyle = degradeLinear(ctx, -s * 0.07, 0, s * 0.07, 0, [[0, '#9fb0c4'], [0.45, '#ffffff'], [0.55, '#e8eef5'], [1, '#6c7d92']]);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.52); ctx.lineTo(s * 0.068, -s * 0.4); ctx.lineTo(s * 0.058, s * 0.16); ctx.lineTo(-s * 0.058, s * 0.16); ctx.lineTo(-s * 0.068, -s * 0.4);
    ctx.closePath(); ctx.fill(); semSombra(ctx); ctx.stroke();
    ctx.strokeStyle = 'rgba(70,90,115,.7)'; ctx.lineWidth = lw * 0.8;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.42); ctx.lineTo(0, s * 0.13); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = lw * 0.5;
    ctx.beginPath(); ctx.moveTo(-s * 0.03, -s * 0.38); ctx.lineTo(-s * 0.026, s * 0.12); ctx.stroke();
    ctx.strokeStyle = '#140d06'; ctx.lineWidth = lw;
    /* guarda com volutas */
    let gold = degradeLinear(ctx, 0, s * 0.15, 0, s * 0.24, [[0, '#fff0b0'], [0.5, '#d6a23a'], [1, '#7a4f0e']]);
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
    caminhoArredondado(ctx, -s * 0.042, s * 0.235, s * 0.084, s * 0.19, s * 0.02); ctx.fill(); ctx.stroke();
    ctx.save(); caminhoArredondado(ctx, -s * 0.042, s * 0.235, s * 0.084, s * 0.19, s * 0.02); ctx.clip();
    ctx.strokeStyle = '#c98a4a'; ctx.lineWidth = lw * 0.9;
    for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(-s * 0.05, s * (0.245 + k * 0.032)); ctx.lineTo(s * 0.05, s * (0.27 + k * 0.032)); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = gold;
    ctx.beginPath(); ctx.arc(0, s * 0.46, s * 0.055, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c0283c'; ctx.beginPath(); ctx.arc(0, s * 0.46, s * 0.022, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4ad1ff'; ctx.beginPath(); ctx.arc(0, s * 0.195, s * 0.022, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (tipo === 'copa') {
    let goldC = degradeLinear(ctx, -s * 0.3, 0, s * 0.3, 0, [[0, '#7a4a0c'], [0.3, '#f2c75c'], [0.48, '#fff6c8'], [0.7, '#d29a2a'], [1, '#6a3e08']]);
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
    ctx.closePath(); ctx.fill(); semSombra(ctx); ctx.stroke();
    /* vinho na boca */
    ctx.fillStyle = degradeRadial(ctx, 0, -s * 0.3, 0, 0, -s * 0.3, s * 0.3, [[0, '#d8364a'], [1, '#5a0a16']]);
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
  } else if (tipo === 'ouro') {
    ctx.fillStyle = degradeRadial(ctx, -s * 0.12, -s * 0.14, s * 0.02, 0, 0, s * 0.42, [[0, '#fffbe0'], [0.35, '#f6cf5a'], [0.75, '#c88a1e'], [1, '#6e4208']]);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill(); semSombra(ctx); ctx.stroke();
    /* serrilha */
    ctx.fillStyle = '#fff1b0';
    for (let b = 0; b < 28; b++) {
      let a = (b / 28) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * s * 0.35, Math.sin(a) * s * 0.35, s * 0.014, 0, Math.PI * 2); ctx.fill();
    }
    ctx.lineWidth = lw * 0.9;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.31, 0, Math.PI * 2); ctx.stroke();
    /* sol em relevo */
    ctx.fillStyle = degradeLinear(ctx, -s * 0.2, -s * 0.2, s * 0.2, s * 0.2, [[0, '#fff3c0'], [1, '#b47714']]);
    ctx.beginPath();
    for (let i = 0; i < 24; i++) {
      let aa = (i / 24) * Math.PI * 2, rr2 = i % 2 ? s * 0.13 : s * 0.25;
      ctx.lineTo(Math.cos(aa) * rr2, Math.sin(aa) * rr2);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = degradeRadial(ctx, -s * 0.03, -s * 0.03, 0, 0, 0, s * 0.11, [[0, '#fffbe6'], [1, '#d9a032']]);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#7a4a0c';
    ctx.beginPath(); ctx.arc(-s * 0.035, -s * 0.02, s * 0.012, 0, Math.PI * 2); ctx.arc(s * 0.035, -s * 0.02, s * 0.012, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7a4a0c'; ctx.lineWidth = lw * 0.7;
    ctx.beginPath(); ctx.arc(0, s * 0.01, s * 0.04, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.beginPath(); ctx.ellipse(-s * 0.16, -s * 0.2, s * 0.12, s * 0.05, -0.7, 0, Math.PI * 2); ctx.fill();
  } else if (tipo === 'pau') {
    ctx.rotate(-0.32);
    let wood = degradeLinear(ctx, -s * 0.13, 0, s * 0.13, 0, [[0, '#3a1d08'], [0.3, '#8a5424'], [0.55, '#c08850'], [1, '#3a1d08']]);
    ctx.fillStyle = wood;
    ctx.beginPath();
    ctx.moveTo(-s * 0.045, s * 0.5);
    ctx.bezierCurveTo(-s * 0.06, s * 0.2, -s * 0.15, -s * 0.15, -s * 0.13, -s * 0.38);
    ctx.bezierCurveTo(-s * 0.12, -s * 0.55, s * 0.12, -s * 0.55, s * 0.13, -s * 0.38);
    ctx.bezierCurveTo(s * 0.15, -s * 0.15, s * 0.06, s * 0.2, s * 0.045, s * 0.5);
    ctx.closePath(); ctx.fill(); semSombra(ctx); ctx.stroke();
    /* veios */
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(40,18,4,.55)'; ctx.lineWidth = lw * 0.6;
    for (let v = -3; v <= 3; v++) {
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
    ctx.fillStyle = degradeLinear(ctx, s * 0.1, -s * 0.4, s * 0.24, -s * 0.3, [[0, '#9be27a'], [1, '#2f7a2c']]);
    ctx.strokeStyle = '#140d06'; ctx.lineWidth = lw * 0.8;
    ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.36); ctx.quadraticCurveTo(s * 0.22, -s * 0.46, s * 0.26, -s * 0.34); ctx.quadraticCurveTo(s * 0.18, -s * 0.3, s * 0.1, -s * 0.36); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.3)';
    ctx.beginPath(); ctx.ellipse(-s * 0.05, -s * 0.3, s * 0.025, s * 0.12, 0.05, 0, Math.PI * 2); ctx.fill();
  }
  semSombra(ctx);
  ctx.restore();
}
