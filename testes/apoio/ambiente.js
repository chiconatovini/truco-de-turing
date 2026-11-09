/**
 * @file Navegador de mentira para os testes de unidade no Node.
 *
 * Os módulos de arte, interface e aplicação usam `document`, `localStorage`, canvas e WebAudio.
 * `instalarNavegadorFalso()` cria um DOM com o jsdom, troca o canvas do jsdom por um canvas real
 * (@napi-rs/canvas, que desenha de verdade) e instala um WebAudio de mentira que registra os nós
 * criados. Deve ser chamado ANTES de importar os módulos do jogo (use `await import(...)`).
 */
import { JSDOM } from 'jsdom';
import { createCanvas, Image } from '@napi-rs/canvas';

/** Registro de tudo que o WebAudio de mentira criou (para os testes de som conferirem). */
export const registroDeAudio = { osciladores: [], ganhos: [], filtros: [], buffers: [], fontes: [], retomadas: 0 };

/** Limpa o registro de áudio. */
export function limparRegistroDeAudio() {
  for (const chave of Object.keys(registroDeAudio)) registroDeAudio[chave] = Array.isArray(registroDeAudio[chave]) ? [] : 0;
}

/** Parâmetro de áudio (frequency, gain…) que guarda as automações pedidas. */
function parametro(valor = 0) {
  const p = { value: valor, eventos: [] };
  for (const metodo of ['setValueAtTime', 'linearRampToValueAtTime', 'exponentialRampToValueAtTime', 'cancelScheduledValues', 'setTargetAtTime']) {
    p[metodo] = (...args) => { p.eventos.push([metodo, ...args]); return p; };
  }
  return p;
}

/** Nó de áudio genérico com connect/disconnect. */
function no(extra) {
  return { context: contextoAtual, conexoes: [], connect(destino) { this.conexoes.push(destino); return destino; }, disconnect() { this.desconectado = true; }, ...extra };
}

/** Último contexto criado (os nós guardam uma referência a ele, como no WebAudio de verdade). */
let contextoAtual = null;

/** Contexto de áudio de mentira: cria nós e guarda no `registroDeAudio`. */
export class ContextoDeAudioFalso {
  constructor() { contextoAtual = this; this.currentTime = 0; this.sampleRate = 8000; this.state = 'suspended'; this.destination = no({ tipo: 'destino' }); }
  resume() { this.state = 'running'; registroDeAudio.retomadas++; return Promise.resolve(); }
  createOscillator() {
    const o = no({ type: 'sine', frequency: parametro(440), detune: parametro(0), start(t) { this.inicio = t; }, stop(t) { this.fim = t; } });
    registroDeAudio.osciladores.push(o); return o;
  }
  createGain() { const g = no({ gain: parametro(1) }); registroDeAudio.ganhos.push(g); return g; }
  createBiquadFilter() { const f = no({ type: 'lowpass', frequency: parametro(350), Q: parametro(1) }); registroDeAudio.filtros.push(f); return f; }
  createBuffer(canais, tamanho, taxa) {
    const dados = new Float32Array(tamanho);
    const b = { numberOfChannels: canais, length: tamanho, sampleRate: taxa, getChannelData: () => dados };
    registroDeAudio.buffers.push(b); return b;
  }
  createBufferSource() { const f = no({ buffer: null, start(t) { this.inicio = t; }, stop(t) { this.fim = t; } }); registroDeAudio.fontes.push(f); return f; }
}

/**
 * Instala o navegador de mentira no `globalThis`.
 * @param {{url?: string, largura?: number, altura?: number, toque?: boolean, retrato?: boolean}} [opcoes]
 * @returns {JSDOM}
 */
export function instalarNavegadorFalso(opcoes = {}) {
  const { url = 'http://localhost/', largura = 1280, altura = 720, toque = false, retrato = false } = opcoes;
  const dom = new JSDOM('<!doctype html><html><body><div id="jogo"></div><div id="paineis"></div><div id="avisos"></div></body></html>', { url, pretendToBeVisual: true });
  const janela = dom.window;
  /* canvas de verdade no lugar do canvas sem desenho do jsdom */
  const criarOriginal = janela.document.createElement.bind(janela.document);
  janela.document.createElement = (tag, ...resto) => (String(tag).toLowerCase() === 'canvas' ? createCanvas(1, 1) : criarOriginal(tag, ...resto));
  /* o canvas de verdade não é um nó do jsdom: ao ser posto na página, vira um <canvas> do jsdom do mesmo tamanho */
  const anexarOriginal = janela.Node.prototype.appendChild;
  janela.Node.prototype.appendChild = function (filho) {
    if (filho && typeof filho.getContext === 'function' && !(filho instanceof janela.Node)) {
      const marcador = criarOriginal('canvas');
      marcador.width = filho.width; marcador.height = filho.height; marcador.dataset.desenhado = 'sim';
      return anexarOriginal.call(this, marcador);
    }
    return anexarOriginal.call(this, filho);
  };
  Object.defineProperty(janela.screen, 'width', { value: largura, configurable: true });
  Object.defineProperty(janela.screen, 'height', { value: altura, configurable: true });
  janela.matchMedia = (consulta) => ({
    matches: (consulta.includes('coarse') && toque) || (consulta.includes('portrait') && retrato),
    media: consulta, addEventListener() {}, removeEventListener() {},
  });
  janela.AudioContext = ContextoDeAudioFalso;
  const globais = {
    window: janela, document: janela.document, localStorage: janela.localStorage, location: janela.location,
    screen: janela.screen, matchMedia: janela.matchMedia, innerWidth: largura, innerHeight: altura,
    HTMLElement: janela.HTMLElement, Event: janela.Event, KeyboardEvent: janela.KeyboardEvent, MouseEvent: janela.MouseEvent,
    AudioContext: ContextoDeAudioFalso, Image, devicePixelRatio: 2,
  };
  for (const [nome, valor] of Object.entries(globais)) Object.defineProperty(globalThis, nome, { value: valor, configurable: true, writable: true });
  return dom;
}

/**
 * Proporção de pixels não transparentes de um canvas (0 a 1). Usado para conferir que a arte
 * desenhou alguma coisa.
 */
export function pixelsPintados(canvas) {
  const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  let pintados = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 0) pintados++;
  return pintados / (canvas.width * canvas.height);
}

/** Espera os temporizadores pendentes (setTimeout curtos) rodarem. */
export const esperar = (ms = 0) => new Promise((r) => setTimeout(r, ms));
