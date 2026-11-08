/**
 * @file Moldura das cartas no estilo de card game de fantasia: corpo texturizado, placas de nome/tipo/poder e gemas de custo.
 *
 * Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas
 * resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.
 */
import { caminhoArredondado, degradeLinear, degradeRadial, escovado, granulado, semSombra, sombraSuave, tonalizar } from './pincel.js';

/** Corpo da carta: borda preta, moldura texturizada na cor do naipe e, nas lendárias, acabamento dourado. */
export function corpoDaMoldura(ctx, W, H, P, aleatorio, lendaria) {
  ctx.fillStyle = '#0a0806';
  caminhoArredondado(ctx, 0, 0, W, H, W * 0.052); ctx.fill();
  let m = W * 0.034, x = m, y = m, w = W - 2 * m, h = H - 2 * m, r = W * 0.03;
  ctx.save();
  caminhoArredondado(ctx, x, y, w, h, r); ctx.clip();
  if (lendaria) {
    ctx.fillStyle = degradeLinear(ctx, x, y, x + w, y + h, [[0, '#fff3c4'], [0.2, '#d6a23a'], [0.42, '#fff8dc'], [0.6, '#b9801b'], [0.8, '#f9e08f'], [1, '#8a5a10']]);
  } else {
    ctx.fillStyle = degradeLinear(ctx, x, y, x + w * 0.7, y + h, [[0, P.clara], [0.32, P.media], [0.75, tonalizar(P.media, -0.35)], [1, P.escura]]);
  }
  ctx.fillRect(x, y, w, h);
  escovado(ctx, x, y, w, h, aleatorio, 0.16);
  granulado(ctx, x, y, w, h, aleatorio, 0.05, 0.1);
  /* brilho diagonal */
  ctx.fillStyle = degradeLinear(ctx, x, y, x + w, y + h * 0.6, [[0, 'rgba(255,255,255,.28)'], [0.35, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']]);
  ctx.fillRect(x, y, w, h);
  if (lendaria) {
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = degradeLinear(ctx, x, y, x + w, y + h, [[0, 'rgba(255,60,190,.45)'], [0.33, 'rgba(60,220,255,.4)'], [0.66, 'rgba(255,240,60,.45)'], [1, 'rgba(160,80,255,.45)']]);
    ctx.fillRect(x, y, w, h);
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
  /* bisel */
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255,255,255,.45)'; caminhoArredondado(ctx, x + 0.8, y + 0.8, w - 1.6, h - 1.6, r); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,.55)'; caminhoArredondado(ctx, x + 2.2, y + 2.2, w - 4.4, h - 4.4, r * 0.8); ctx.stroke();
}

/** Placa (barra de nome / linha de tipo / caixa de poder) */
export function placa(ctx, x, y, w, h, P, opcoes) {
  opcoes = opcoes || {};
  let r = opcoes.raio != null ? opcoes.raio : h * 0.42;
  sombraSuave(ctx, 3, 1.5, 0.6);
  ctx.fillStyle = '#000'; caminhoArredondado(ctx, x, y, w, h, r); ctx.fill();
  semSombra(ctx);
  ctx.fillStyle = degradeLinear(ctx, x, y, x, y + h, [[0, '#fffaf0'], [0.18, P.titulo], [0.85, P.tituloEscuro], [1, tonalizar(P.tituloEscuro, -0.25)]]);
  caminhoArredondado(ctx, x, y, w, h, r); ctx.fill();
  ctx.lineWidth = 1.3; ctx.strokeStyle = '#120c07'; ctx.stroke();
  ctx.lineWidth = 0.8; ctx.strokeStyle = 'rgba(255,255,255,.75)';
  ctx.beginPath(); ctx.moveTo(x + r * 0.7, y + 1.4); ctx.lineTo(x + w - r * 0.7, y + 1.4); ctx.stroke();
}

/** Gema redonda (símbolo de custo) */
export function gema(ctx, cx, cy, r, cor, rotulo, opcoes) {
  opcoes = opcoes || {};
  sombraSuave(ctx, 2.5, 1.2, 0.7);
  ctx.fillStyle = '#0b0907'; ctx.beginPath(); ctx.arc(cx, cy, r + 0.9, 0, Math.PI * 2); ctx.fill();
  semSombra(ctx);
  ctx.fillStyle = degradeRadial(ctx, cx - r * 0.35, cy - r * 0.45, r * 0.05, cx, cy, r, [[0, '#ffffff'], [0.25, tonalizar(cor, 0.45)], [0.7, cor], [1, tonalizar(cor, -0.45)]]);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.beginPath(); ctx.ellipse(cx - r * 0.25, cy - r * 0.5, r * 0.45, r * 0.22, -0.35, 0, Math.PI * 2); ctx.fill();
  if (rotulo != null) {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let fs = r * (String(rotulo).length > 1 ? 1.05 : 1.25);
    ctx.font = (opcoes.peso || '800') + ' ' + fs + 'px ' + (opcoes.familia || 'Spectral, Georgia, serif');
    ctx.lineWidth = r * 0.28; ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.strokeText(rotulo, cx, cy + r * 0.06);
    ctx.fillStyle = opcoes.cor || '#ffffff'; ctx.fillText(rotulo, cx, cy + r * 0.06);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
}
