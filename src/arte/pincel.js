/**
 * @file Pincel: utilitários de desenho em canvas 2D (telas com densidade, caminhos, degradês, texto, texturas, sombras e cores). Todo o resto da arte é construído sobre estas funções.
 *
 * Convenção da arte: cada função desenha em coordenadas-base e recebe `S` (densidade). O canvas
 * resultante tem (tamanho-base × S) pixels, o que mantém a arte nítida em qualquer tela.
 */

/** Cria um canvas de w×h unidades na densidade S e devolve `{ c: canvas, ctx }` já escalado. */
export function criarTela(w, h, S) {
  let c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * S));
  c.height = Math.max(1, Math.round(h * S));
  let ctx = c.getContext('2d');
  ctx.scale(c.width / w, c.height / h);
  ctx.imageSmoothingQuality = 'high';
  return { c: c, ctx: ctx };
}
/** Traça (sem preencher) um retângulo de cantos arredondados. */
export function caminhoArredondado(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
/** Número inteiro derivado do texto (para sementes estáveis por carta). */
export function hashDoTexto(texto) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) { h ^= texto.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
/** Gerador de números aleatórios reprodutível (mulberry32) a partir da semente. */
export function geradorComSemente(semente) {
  return function () {
    semente = (semente + 0x6d2b79f5) | 0;
    let t = Math.imul(semente ^ (semente >>> 15), semente | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Cria um degradê linear a partir de uma lista de paradas `[posição, cor]`. */
export function degradeLinear(ctx, x0, y0, x1, y1, paradas) {
  let g = ctx.createLinearGradient(x0, y0, x1, y1);
  paradas.forEach(function (s) { g.addColorStop(s[0], s[1]); });
  return g;
}
/** Cria um degradê radial a partir de uma lista de paradas `[posição, cor]`. */
export function degradeRadial(ctx, x0, y0, r0, x1, y1, r1, paradas) {
  let g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  paradas.forEach(function (s) { g.addColorStop(s[0], s[1]); });
  return g;
}
/** Escreve o texto quebrando linhas em `larguraMax`; respeita "\n". Devolve o número de linhas usadas. */
export function escreverComQuebra(ctx, texto, x, y, larguraMax, alturaLinha) {
  let lines = [];
  texto.split('\n').forEach(function (para) {
    let line = '';
    para.split(' ').forEach(function (w) {
      let t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > larguraMax && line) { lines.push(line); line = w; } else line = t;
    });
    lines.push(line);
  });
  lines.forEach(function (l, i) { ctx.fillText(l, x, y + i * alturaLinha); });
  return lines.length;
}
/** Define a fonte no maior tamanho (até `tamanho`, no mínimo `min`) em que o texto cabe em `larguraMax`. */
export function ajustarFonte(ctx, texto, larguraMax, tamanho, peso, familia, min) {
  do { ctx.font = peso + ' ' + tamanho + 'px ' + familia; tamanho -= 0.25; } while (ctx.measureText(texto).width > larguraMax && tamanho > (min || 7));
}
/** Textura de grão: pontinhos claros e escuros */
export function granulado(ctx, x, y, w, h, aleatorio, intensidade, alfa) {
  let n = Math.floor(w * h * (intensidade || 0.06));
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = aleatorio() < 0.5 ? 'rgba(255,255,255,' + (alfa || 0.06) * aleatorio() + ')' : 'rgba(0,0,0,' + (alfa || 0.06) * 1.4 * aleatorio() + ')';
    ctx.fillRect(x + aleatorio() * w, y + aleatorio() * h, 0.6 + aleatorio() * 0.8, 0.6 + aleatorio() * 0.8);
  }
}
/** Linhas de escova (metal/pedra da moldura) */
export function escovado(ctx, x, y, w, h, aleatorio, alfa) {
  ctx.lineWidth = 0.5;
  for (let i = 0; i < (w * h) / 55; i++) {
    let px = x + aleatorio() * w, py = y + aleatorio() * h, comprimento = 3 + aleatorio() * 9, a = -0.6 + aleatorio() * 0.25;
    ctx.strokeStyle = aleatorio() < 0.5 ? 'rgba(255,255,255,' + alfa * aleatorio() + ')' : 'rgba(0,0,0,' + alfa * aleatorio() + ')';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a) * comprimento, py + Math.sin(a) * comprimento); ctx.stroke();
  }
}
/** Liga uma sombra preta suave para os próximos desenhos. */
export function sombraSuave(ctx, desfoque, deslocY, alfa) {
  ctx.shadowColor = 'rgba(0,0,0,' + (alfa == null ? 0.55 : alfa) + ')';
  ctx.shadowBlur = desfoque; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = deslocY || 0;
}
/** Desliga a sombra. */
export function semSombra(ctx) { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
/** Desenha um brilho radial (halo) de raio r e opacidade a. */
export function brilho(ctx, x, y, r, cor, a) {
  ctx.fillStyle = degradeRadial(ctx, x, y, 0, x, y, r, [[0, comAlfa(cor, a == null ? 0.75 : a)], [0.45, comAlfa(cor, (a == null ? 0.75 : a) * 0.35)], [1, comAlfa(cor, 0)]]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
/** Converte uma cor #rrggbb em rgba() com opacidade a. */
export function comAlfa(hex, a) {
  let n = parseInt(hex.slice(1), 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}
/** Clareia (f > 0) ou escurece (f < 0) uma cor #rrggbb. */
export function tonalizar(hex, f) {
  let n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  let m = f < 0 ? 0 : 255, t = Math.abs(f);
  r = Math.round(r + (m - r) * t); g = Math.round(g + (m - g) * t); b = Math.round(b + (m - b) * t);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
