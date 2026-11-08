/**
 * @file Efeitos sonoros sintetizados com WebAudio (nenhum arquivo de áudio).
 *
 * O navegador só libera som depois de um clique; `Som.desbloquear()` é chamado no botão "Jogar".
 */

let contexto = null;
let mudo = false;

/** Cria (ou retoma) o contexto de áudio. Devolve null se o navegador não tiver WebAudio. */
function audio() {
  if (!contexto) {
    const Contexto = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Contexto) return null;
    contexto = new Contexto();
  }
  if (contexto.state === 'suspended') contexto.resume();
  return contexto;
}

/**
 * Toca uma nota curta.
 * @param {number} frequencia Hz.
 * @param {number} duracao Segundos.
 * @param {OscillatorType} [forma='sine']
 * @param {number} [volume=0.15]
 * @param {number} [atraso=0] Segundos até começar.
 * @param {number} [deslize] Frequência final, para notas que sobem ou descem.
 */
function nota(frequencia, duracao, forma, volume, atraso, deslize) {
  const a = audio();
  if (!a || mudo) return;
  const t = a.currentTime + (atraso || 0);
  const osc = a.createOscillator(), ganho = a.createGain();
  osc.type = forma || 'sine';
  osc.frequency.setValueAtTime(frequencia, t);
  if (deslize) osc.frequency.exponentialRampToValueAtTime(deslize, t + duracao);
  ganho.gain.setValueAtTime(0.0001, t);
  ganho.gain.exponentialRampToValueAtTime(volume || 0.15, t + 0.01);
  ganho.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
  osc.connect(ganho); ganho.connect(a.destination);
  osc.start(t); osc.stop(t + duracao + 0.02);
}

/** Toca um chiado filtrado (cartas, impactos). */
function ruido(duracao, volume, atraso, filtro) {
  const a = audio();
  if (!a || mudo) return;
  const t = a.currentTime + (atraso || 0);
  const buffer = a.createBuffer(1, Math.floor(a.sampleRate * duracao), a.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < dados.length; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / dados.length);
  const fonte = a.createBufferSource(); fonte.buffer = buffer;
  const passaBaixa = a.createBiquadFilter(); passaBaixa.type = 'lowpass'; passaBaixa.frequency.value = filtro || 3000;
  const ganho = a.createGain(); ganho.gain.value = volume || 0.2;
  fonte.connect(passaBaixa); passaBaixa.connect(ganho); ganho.connect(a.destination);
  fonte.start(t);
}

/** Efeitos sonoros do jogo, um por acontecimento. */
export const Som = {
  desbloquear() { audio(); },
  definirMudo(valor) { mudo = valor; },
  estaMudo() { return mudo; },
  virarCarta() { ruido(0.06, 0.18, 0, 5000); nota(880, 0.05, 'triangle', 0.05, 0.02); },
  colocarCarta() { ruido(0.09, 0.25, 0, 900); },
  selecionar() { nota(660, 0.05, 'triangle', 0.06); },
  tunagem() { [523, 659, 784].forEach((f, i) => nota(f, 0.16, 'triangle', 0.08, i * 0.06)); },
  golpe() { nota(220, 0.25, 'sawtooth', 0.09, 0, 90); ruido(0.2, 0.2, 0, 1200); },
  explosao() { nota(110, 0.6, 'sawtooth', 0.14, 0, 40); ruido(0.6, 0.35, 0, 600); },
  dropout() { nota(740, 0.12, 'square', 0.04); nota(990, 0.12, 'square', 0.04, 0.08); },
  truco() { nota(392, 0.18, 'square', 0.08); nota(523, 0.32, 'square', 0.08, 0.16); },
  vitoria() { [523, 659, 784, 1047].forEach((f, i) => nota(f, 0.22, 'triangle', 0.09, i * 0.1)); },
  derrota() { [392, 330, 262].forEach((f, i) => nota(f, 0.3, 'triangle', 0.08, i * 0.14)); },
  medalha() { [880, 1175].forEach((f, i) => nota(f, 0.18, 'sine', 0.08, i * 0.09)); },
};
