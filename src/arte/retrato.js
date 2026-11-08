/**
 * @file Moldura medieval do retrato do professor no quadro de conquistas.
 */

/** Caminho de retângulo arredondado. */
function caminhoArredondado(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
/** Caminho de arco gótico (janela da moldura). */
function arcoGotico(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + w * 0.55);
  ctx.quadraticCurveTo(x, y, x + w / 2, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + w * 0.55);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}
/** Degradê dourado da moldura. */
function dourado(ctx, x0, y0, x1, y1) {
  let g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, '#fff3c4'); g.addColorStop(0.25, '#d6a23a'); g.addColorStop(0.5, '#fff1b0'); g.addColorStop(0.75, '#a87516'); g.addColorStop(1, '#f6dc8f');
  return g;
}
/**
 * Desenha a foto numa moldura medieval (arco gótico dourado, brasão e fita com o nome).
 * A foto carrega de forma assíncrona; `pronto(canvas)` é chamado quando o desenho termina.
 * @param {string} src Endereço da imagem (aceita data URI).
 * @param {number} S Densidade.
 * @param {string} nome Texto da fita.
 * @param {string} titulo Legenda abaixo da fita.
 * @param {(canvas: HTMLCanvasElement) => void} pronto
 */
export function desenharRetratoEmMoldura(src, S, nome, titulo, pronto) {
  let W = 240, H = 330;
  let c = document.createElement('canvas');
  c.width = Math.round(W * S); c.height = Math.round(H * S);
  let ctx = c.getContext('2d');
  ctx.scale(S, S);
  let img = new Image();
  img.onload = function () {
    /* pedra de fundo */
    let stone = ctx.createLinearGradient(0, 0, 0, H);
    stone.addColorStop(0, '#5b4a36'); stone.addColorStop(1, '#2c2116');
    ctx.fillStyle = stone; caminhoArredondado(ctx, 6, 14, W - 12, H - 40, 14); ctx.fill();
    ctx.strokeStyle = '#0d0a08'; ctx.lineWidth = 2; ctx.stroke();
    /* moldura em arco gótico */
    let ax = 30, ay = 30, aw = W - 60, ah = 214;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
    arcoGotico(ctx, ax - 14, ay - 14, aw + 28, ah + 28); ctx.fillStyle = dourado(ctx, ax, ay, ax + aw, ay + ah); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#3d2a08'; ctx.lineWidth = 1.6; arcoGotico(ctx, ax - 14, ay - 14, aw + 28, ah + 28); ctx.stroke();
    /* contas na moldura */
    ctx.fillStyle = '#fff6c8';
    for (let i = 0; i < 26; i++) {
      let t = i / 25, px, py;
      if (t < 0.3) { px = ax - 7; py = ay + ah - (t / 0.3) * (ah - aw * 0.45); }
      else if (t > 0.7) { px = ax + aw + 7; py = ay + aw * 0.45 + ((t - 0.7) / 0.3) * (ah - aw * 0.45); }
      else { let a = Math.PI + ((t - 0.3) / 0.4) * Math.PI; px = ax + aw / 2 + Math.cos(a) * (aw / 2 + 7); py = ay + aw * 0.5 + Math.sin(a) * (aw * 0.5 + 7); }
      ctx.beginPath(); ctx.arc(px, py, 1.7, 0, Math.PI * 2); ctx.fill();
    }
    /* foto */
    ctx.save(); arcoGotico(ctx, ax, ay, aw, ah); ctx.clip();
    let side = Math.min(img.width, img.height);
    let scale = Math.max(aw / side, ah / side);
    let dw = side * scale, dh = side * scale;
    ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, ax + (aw - dw) / 2, ay + (ah - dh) / 2 + 6, dw, dh);
    /* pátina */
    let v = ctx.createRadialGradient(ax + aw / 2, ay + ah * 0.45, ah * 0.25, ax + aw / 2, ay + ah / 2, ah * 0.75);
    v.addColorStop(0, 'rgba(60,30,0,0)'); v.addColorStop(1, 'rgba(40,20,0,.55)');
    ctx.fillStyle = v; ctx.fillRect(ax, ay, aw, ah);
    ctx.restore();
    ctx.strokeStyle = '#3d2a08'; ctx.lineWidth = 2; arcoGotico(ctx, ax, ay, aw, ah); ctx.stroke();
    /* brasão no topo */
    ctx.save(); ctx.translate(W / 2, ay - 12);
    ctx.fillStyle = '#7a1626'; ctx.strokeStyle = '#3d2a08'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-14, -12); ctx.lineTo(14, -12); ctx.lineTo(14, 2); ctx.quadraticCurveTo(14, 14, 0, 18); ctx.quadraticCurveTo(-14, 14, -14, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#f2c94c'; ctx.lineWidth = 1.2;
    [[-7, -5], [0, -5], [7, -5], [-4, 4], [4, 4]].forEach(function (p, k, arr) { if (k < 3) { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(-4, 4); ctx.moveTo(p[0], p[1]); ctx.lineTo(4, 4); ctx.stroke(); } });
    ctx.fillStyle = '#4aa3df'; [[-7, -5], [0, -5], [7, -5]].forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 2.2, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#f59322'; [[-4, 4], [4, 4]].forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 2.2, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
    /* fita com o nome */
    let ry = ay + ah + 20;
    ctx.fillStyle = '#5a0e1a';
    ctx.beginPath(); ctx.moveTo(4, ry - 4); ctx.lineTo(24, ry - 4); ctx.lineTo(24, ry + 22); ctx.lineTo(4, ry + 22); ctx.lineTo(12, ry + 9); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(W - 4, ry - 4); ctx.lineTo(W - 24, ry - 4); ctx.lineTo(W - 24, ry + 22); ctx.lineTo(W - 4, ry + 22); ctx.lineTo(W - 12, ry + 9); ctx.closePath(); ctx.fill();
    let rib = ctx.createLinearGradient(0, ry - 8, 0, ry + 28);
    rib.addColorStop(0, '#c0303e'); rib.addColorStop(1, '#7a1626');
    ctx.fillStyle = rib; ctx.strokeStyle = '#2a0508'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(18, ry - 10); ctx.quadraticCurveTo(W / 2, ry - 18, W - 18, ry - 10); ctx.lineTo(W - 18, ry + 18); ctx.quadraticCurveTo(W / 2, ry + 10, 18, ry + 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff1c8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let fs = 15; ctx.font = '700 ' + fs + 'px Cinzel, Georgia, serif';
    while (ctx.measureText(nome).width > W - 60 && fs > 9) { fs -= 0.5; ctx.font = '700 ' + fs + 'px Cinzel, Georgia, serif'; }
    ctx.fillText(nome, W / 2, ry + 1);
    ctx.fillStyle = '#e8d6a8'; ctx.font = 'italic 500 11.5px Spectral, Georgia, serif';
    ctx.fillText(titulo, W / 2, ry + 36);
    pronto(c);
  };
  img.src = src;
}
