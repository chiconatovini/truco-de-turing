/**
 * @file Cartas de terreno exibidas na inspeção (estilo "terreno básico").
 *
 * Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas
 * resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.
 */
import { CARTA_A, CARTA_L, TINTA } from './paleta.js';
import { ajustarFonte, brilho, caminhoArredondado, criarTela, degradeLinear, degradeRadial, escreverComQuebra, geradorComSemente, granulado, hashDoTexto, semSombra, sombraSuave, tonalizar } from './pincel.js';
import { corpoDaMoldura, placa } from './moldura.js';
import { simboloDeColecao } from './cartas.js';
import { desenharEmblema } from './emblemas.js';
import { constelacao, estrelas, montanhas, vinheta } from './cenarios.js';
import { TERRENOS } from '../nucleo/terrenos.js';

/** Desenha a carta de terreno mostrada na inspeção (paisagem do terreno, linha de tipo e caixa de regras). */
export function desenharCartaDeTerreno(terreno, S) {
  let o = criarTela(CARTA_L, CARTA_A, S || 1), ctx = o.ctx;
  let P = {
    neutro: { clara: '#b7d7a8', media: '#3f7a4c', escura: '#10281a', gema: '#2f8a4a', titulo: '#e3ecdc', tituloEscuro: '#a9bf9c' },
    montanha: { clara: '#f3b893', media: '#a4512c', escura: '#2e140a', gema: '#d4552a', titulo: '#f4e1d6', tituloEscuro: '#cfa58f' },
    pantano: { clara: '#bdb6a2', media: '#55513f', escura: '#141310', gema: '#4a4a3a', titulo: '#e6e2d6', tituloEscuro: '#b0aa96' },
    oceano: { clara: '#a8e0f2', media: '#2c7299', escura: '#0a2232', gema: '#2a8fd0', titulo: '#dfeef4', tituloEscuro: '#9dbfcc' },
  }[terreno];
  let t = TERRENOS[terreno];
  let aleatorio = geradorComSemente(hashDoTexto('terrain' + terreno));
  corpoDaMoldura(ctx, CARTA_L, CARTA_A, P, aleatorio, false);
  placa(ctx, 15, 14, 210, 28, P);
  ctx.fillStyle = TINTA; ctx.textBaseline = 'middle';
  ajustarFonte(ctx, t.nome, 170, 16, '700', 'Cinzel, Georgia, serif', 10);
  ctx.fillText(t.nome, 25, 28.5);
  let ax = 21, ay = 47, aw = 198, ah = 162;
  sombraSuave(ctx, 4, 2, 0.8); ctx.fillStyle = '#000'; ctx.fillRect(ax - 2, ay - 2, aw + 4, ah + 4); semSombra(ctx);
  ctx.save(); ctx.beginPath(); ctx.rect(ax, ay, aw, ah); ctx.clip();
  if (terreno === 'montanha') {
    ctx.fillStyle = degradeLinear(ctx, 0, ay, 0, ay + ah, [[0, '#2c1a3a'], [0.45, '#d4683a'], [1, '#ffd08a']]);
    ctx.fillRect(ax, ay, aw, ah);
    brilho(ctx, ax + aw * 0.3, ay + ah * 0.55, 70, '#ffd08a', 0.7);
    montanhas(ctx, ax, ay, aw, ah, aleatorio, [
      { preenchimento: '#a85a3c', base: 0.62, amplitude: 0.45, neve: true },
      { preenchimento: '#6e3420', base: 0.78, amplitude: 0.35 },
      { preenchimento: '#3a1a10', base: 0.92, amplitude: 0.25 },
      { preenchimento: '#1c0c06', base: 1.02, amplitude: 0.2 },
    ]);
    ctx.strokeStyle = 'rgba(255,230,170,.85)'; ctx.setLineDash([3, 4]); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(ax + 30, ay + ah); ctx.bezierCurveTo(ax + 90, ay + ah * 0.8, ax + 60, ay + ah * 0.55, ax + 120, ay + ah * 0.35); ctx.stroke(); ctx.setLineDash([]);
    constelacao(ctx, ax + 8, ay + 6, aw - 16, ah * 0.3, aleatorio, '#ffe6b8');
  } else if (terreno === 'pantano') {
    ctx.fillStyle = degradeLinear(ctx, 0, ay, 0, ay + ah, [[0, '#1c2218'], [0.6, '#4c5a40'], [1, '#1a1f14']]);
    ctx.fillRect(ax, ay, aw, ah);
    brilho(ctx, ax + aw * 0.7, ay + ah * 0.28, 50, '#d8e8b0', 0.4);
    ctx.fillStyle = '#e8f0d0'; ctx.beginPath(); ctx.arc(ax + aw * 0.7, ay + ah * 0.28, 11, 0, Math.PI * 2); ctx.fill();
    for (let tr = 0; tr < 9; tr++) {
      let x0 = ax + aleatorio() * aw, h0 = 60 + aleatorio() * 90, wd = 3 + aleatorio() * 5;
      ctx.strokeStyle = tr < 4 ? '#3a4232' : '#0f120c'; ctx.lineWidth = wd;
      ctx.beginPath(); ctx.moveTo(x0, ay + ah * 0.78); ctx.bezierCurveTo(x0 + (aleatorio() - 0.5) * 30, ay + ah * 0.78 - h0 * 0.5, x0 + (aleatorio() - 0.5) * 30, ay + ah * 0.78 - h0 * 0.8, x0 + (aleatorio() - 0.5) * 20, ay + ah * 0.78 - h0); ctx.stroke();
      ctx.lineWidth = wd * 0.4;
      for (let br = 0; br < 3; br++) { let by2 = ay + ah * 0.78 - h0 * (0.5 + br * 0.15); ctx.beginPath(); ctx.moveTo(x0, by2); ctx.quadraticCurveTo(x0 + (aleatorio() - 0.5) * 30, by2 - 10, x0 + (aleatorio() - 0.5) * 40, by2 - 18); ctx.stroke(); }
    }
    ctx.fillStyle = degradeLinear(ctx, 0, ay + ah * 0.76, 0, ay + ah, [[0, '#2a3324'], [1, '#0a0d08']]);
    ctx.fillRect(ax, ay + ah * 0.76, aw, ah * 0.24);
    ctx.strokeStyle = 'rgba(200,220,170,.25)'; ctx.lineWidth = 0.8;
    for (let rl = 0; rl < 8; rl++) { let ry = ay + ah * (0.8 + aleatorio() * 0.18); ctx.beginPath(); ctx.moveTo(ax + aleatorio() * aw * 0.5, ry); ctx.lineTo(ax + aw * (0.5 + aleatorio() * 0.5), ry); ctx.stroke(); }
    for (let mi = 0; mi < 7; mi++) { ctx.fillStyle = 'rgba(220,230,200,.12)'; ctx.beginPath(); ctx.ellipse(ax + aleatorio() * aw, ay + ah * (0.6 + aleatorio() * 0.25), 60, 9, 0, 0, Math.PI * 2); ctx.fill(); }
    for (let e = 0; e < 7; e++) brilho(ctx, ax + aleatorio() * aw, ay + ah * (0.4 + aleatorio() * 0.4), 5, '#c8ff8a', 0.9);
  } else if (terreno === 'oceano') {
    ctx.fillStyle = degradeLinear(ctx, 0, ay, 0, ay + ah, [[0, '#0b1d3a'], [0.45, '#2c6f9e'], [0.5, '#1d4f73'], [1, '#081a28']]);
    ctx.fillRect(ax, ay, aw, ah);
    estrelas(ctx, ax, ay, aw, ah * 0.4, aleatorio, 40);
    brilho(ctx, ax + aw * 0.3, ay + ah * 0.25, 45, '#dcefff', 0.5);
    ctx.fillStyle = '#f4f8ff'; ctx.beginPath(); ctx.arc(ax + aw * 0.3, ay + ah * 0.25, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(220,240,255,.5)';
    ctx.fillRect(ax + aw * 0.3 - 6, ay + ah * 0.48, 12, ah * 0.4);
    for (let wv = 0; wv < 9; wv++) {
      let wy = ay + ah * (0.5 + wv * 0.055);
      ctx.strokeStyle = 'rgba(200,235,255,' + (0.15 + wv * 0.06) + ')'; ctx.lineWidth = 1 + wv * 0.15;
      ctx.beginPath();
      for (let x2 = 0; x2 <= aw; x2 += 3) ctx.lineTo(ax + x2, wy + Math.sin(x2 * (0.06 + wv * 0.01) + wv * 1.3) * (1.5 + wv * 0.4));
      ctx.stroke();
    }
    ctx.save(); ctx.translate(ax + aw * 0.78, ay + ah * 0.24);
    ctx.strokeStyle = '#e8d6a0'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#c0283c'; ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(4, 0); ctx.lineTo(-4, 0); ctx.fill();
    ctx.fillStyle = '#e8eef5'; ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(4, 0); ctx.lineTo(-4, 0); ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = degradeRadial(ctx, ax + aw / 2, ay + ah * 0.5, 10, ax + aw / 2, ay + ah / 2, aw * 0.75, [[0, '#2f7a4c'], [1, '#0c2a18']]);
    ctx.fillRect(ax, ay, aw, ah);
    granulado(ctx, ax, ay, aw, ah, aleatorio, 0.25, 0.12);
    brilho(ctx, ax + aw / 2, ay - 10, 120, '#ffe8b0', 0.35);
    /* cartas em leque */
    [-0.45, -0.15, 0.15, 0.45].forEach(function (a, i) {
      ctx.save(); ctx.translate(ax + aw * 0.62, ay + ah * 0.78); ctx.rotate(a);
      sombraSuave(ctx, 4, 2, 0.5);
      ctx.fillStyle = '#fbf5e6'; caminhoArredondado(ctx, -16, -62, 32, 46, 3); ctx.fill(); semSombra(ctx);
      ctx.strokeStyle = '#1d140b'; ctx.lineWidth = 0.8; ctx.stroke();
      desenharEmblema(ctx, ['espada', 'copa', 'ouro', 'pau'][i], 0, -39, 22, 0, { sombra: false });
      ctx.restore();
    });
    /* café */
    let cx = ax + aw * 0.26, cy = ay + ah * 0.7;
    sombraSuave(ctx, 6, 3, 0.5);
    ctx.fillStyle = '#efe7da'; ctx.beginPath(); ctx.ellipse(cx, cy + 14, 30, 9, 0, 0, Math.PI * 2); ctx.fill();
    semSombra(ctx);
    ctx.fillStyle = degradeLinear(ctx, cx - 16, 0, cx + 16, 0, [[0, '#d8cfc0'], [0.5, '#fbf7ee'], [1, '#cfc4b2']]);
    ctx.beginPath(); ctx.moveTo(cx - 16, cy - 16); ctx.lineTo(cx + 16, cy - 16); ctx.quadraticCurveTo(cx + 15, cy + 10, cx, cy + 12); ctx.quadraticCurveTo(cx - 15, cy + 10, cx - 16, cy - 16); ctx.fill();
    ctx.strokeStyle = '#d8cfc0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx + 18, cy - 4, 6, -1.2, 1.2); ctx.stroke();
    ctx.fillStyle = '#3b1f0e'; ctx.beginPath(); ctx.ellipse(cx, cy - 16, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1.6;
    [-5, 5].forEach(function (d) { ctx.beginPath(); ctx.moveTo(cx + d, cy - 22); ctx.bezierCurveTo(cx + d - 6, cy - 32, cx + d + 6, cy - 38, cx + d, cy - 48); ctx.stroke(); });
  }
  vinheta(ctx, ax, ay, aw, ah, 0.5);
  ctx.restore();
  ctx.lineWidth = 2; ctx.strokeStyle = '#0b0907'; ctx.strokeRect(ax - 1, ay - 1, aw + 2, ah + 2);
  placa(ctx, 15, 214, 210, 22, P);
  ctx.fillStyle = TINTA; ctx.textBaseline = 'middle';
  ajustarFonte(ctx, 'Terreno Básico — Distribuição de dados', 176, 11, '700', 'Cinzel, Georgia, serif', 7.5);
  ctx.fillText('Terreno Básico — Distribuição de dados', 24, 225.5);
  simboloDeColecao(ctx, 211, 225, 6.5, 'incomum');
  let tx = 22, ty = 240, tw = 196, th = 72;
  ctx.fillStyle = degradeLinear(ctx, 0, ty, 0, ty + th, [[0, '#f7efdb'], [1, '#e6d6b0']]);
  ctx.fillRect(tx, ty, tw, th);
  ctx.strokeStyle = tonalizar(P.media, -0.4); ctx.lineWidth = 1.2; ctx.strokeRect(tx, ty, tw, th);
  ctx.fillStyle = TINTA; ctx.font = '500 11.5px Spectral, Georgia, serif'; ctx.textBaseline = 'top';
  escreverComQuebra(ctx, t.resumo, tx + 8, ty + 7, tw - 16, 14.5);
  return o.c;
}
