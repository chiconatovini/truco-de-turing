/**
 * @file Música de fundo sintetizada com WebAudio, uma para cada terreno:
 *
 * | Terreno  | Estilo                         | Andamento |
 * |----------|--------------------------------|-----------|
 * | neutro   | blues com balanço (shuffle) em Mi | 92 bpm |
 * | oceano   | valsa lenta em Sol, com ondas  | 66 bpm (3/4) |
 * | montanha | épica em Lá menor, com tambores | 88 bpm |
 * | pantano  | sombria e gótica em Ré menor, órgão e sino | 56 bpm |
 *
 * Cada música é um laço de compassos com acordes, baixo, acompanhamento, melodia e percussão.
 * A melodia é sorteada por compasso com uma semente fixa, então o laço sempre se repete igual.
 * Um agendador olha 0,4 s à frente e marca as notas no relógio do WebAudio (sem atrasos).
 */
import { contextoDeAudio } from './som.js';

/** Volume geral da música (baixo, para não brigar com os efeitos). */
const VOLUME = 0.55;
/** Quanto tempo à frente as notas são agendadas, em segundos. */
const ANTECEDENCIA = 0.4;

/** Frequência de uma nota MIDI (69 = Lá 440 Hz). */
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

/** Gerador reprodutível (mesmo compasso, mesma melodia). */
function sorteador(semente) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ======================================================================== vozes */

/**
 * Toca uma nota com envelope (ataque, sustentação, liberação), filtro passa-baixa opcional e
 * vibrato opcional.
 */
function voz(saida, tempo, midi, duracao, { forma = 'triangle', volume = 0.1, ataque = 0.01, liberacao = 0.15, filtro = 0, vibrato = 0, desafinar = 0 } = {}) {
  const a = saida.context;
  const osc = a.createOscillator(), ganho = a.createGain();
  osc.type = forma;
  osc.frequency.setValueAtTime(hz(midi), tempo);
  osc.detune.setValueAtTime(desafinar, tempo);
  let no = osc;
  if (filtro) {
    const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filtro; f.Q.value = 0.7;
    osc.connect(f); no = f;
  }
  if (vibrato) {
    const lfo = a.createOscillator(), profundidade = a.createGain();
    lfo.frequency.value = 5; profundidade.gain.value = vibrato;
    lfo.connect(profundidade); profundidade.connect(osc.detune);
    lfo.start(tempo); lfo.stop(tempo + duracao + liberacao + 0.05);
  }
  ganho.gain.setValueAtTime(0.0001, tempo);
  ganho.gain.exponentialRampToValueAtTime(volume, tempo + ataque);
  ganho.gain.setValueAtTime(volume, tempo + Math.max(ataque, duracao - 0.02));
  ganho.gain.exponentialRampToValueAtTime(0.0001, tempo + duracao + liberacao);
  no.connect(ganho); ganho.connect(saida);
  osc.start(tempo); osc.stop(tempo + duracao + liberacao + 0.05);
}

/** Ruído filtrado: chimbal, prato, ondas do mar. */
function chiado(saida, tempo, duracao, { volume = 0.05, filtro = 8000, tipo = 'highpass', ataque = 0.002 } = {}) {
  const a = saida.context;
  const buffer = a.createBuffer(1, Math.max(1, Math.floor(a.sampleRate * duracao)), a.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < dados.length; i++) dados[i] = Math.random() * 2 - 1;
  const fonte = a.createBufferSource(); fonte.buffer = buffer;
  const f = a.createBiquadFilter(); f.type = tipo; f.frequency.value = filtro;
  const ganho = a.createGain();
  ganho.gain.setValueAtTime(0.0001, tempo);
  ganho.gain.exponentialRampToValueAtTime(volume, tempo + ataque);
  ganho.gain.exponentialRampToValueAtTime(0.0001, tempo + duracao);
  fonte.connect(f); f.connect(ganho); ganho.connect(saida);
  fonte.start(tempo); fonte.stop(tempo + duracao + 0.02);
}

/** Tambor grave (bumbo, taiko): seno que despenca de frequência. */
function tambor(saida, tempo, { volume = 0.35, de = 110, para = 42, duracao = 0.45 } = {}) {
  const a = saida.context;
  const osc = a.createOscillator(), ganho = a.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(de, tempo);
  osc.frequency.exponentialRampToValueAtTime(para, tempo + duracao * 0.8);
  ganho.gain.setValueAtTime(volume, tempo);
  ganho.gain.exponentialRampToValueAtTime(0.0001, tempo + duracao);
  osc.connect(ganho); ganho.connect(saida);
  osc.start(tempo); osc.stop(tempo + duracao + 0.05);
}

/** Sino: parciais inarmônicas que somem devagar. */
function sino(saida, tempo, midi, volume = 0.06) {
  for (const [razao, peso, dur] of [[1, 1, 3.5], [2.76, 0.5, 2.2], [5.4, 0.25, 1.2], [0.5, 0.4, 4]]) {
    const a = saida.context, osc = a.createOscillator(), ganho = a.createGain();
    osc.type = 'sine'; osc.frequency.value = hz(midi) * razao;
    ganho.gain.setValueAtTime(0.0001, tempo);
    ganho.gain.exponentialRampToValueAtTime(volume * peso, tempo + 0.01);
    ganho.gain.exponentialRampToValueAtTime(0.0001, tempo + dur);
    osc.connect(ganho); ganho.connect(saida);
    osc.start(tempo); osc.stop(tempo + dur + 0.05);
  }
}

/* ======================================================================== músicas */

/*
 * Cada música define: `bpm`, `tempos` por compasso, `subdivisao` (passos por tempo),
 * `balanco` (atraso dos contratempos, para o shuffle), `acordes` (um por compasso, em notas MIDI:
 * [fundamental, ...]) e `tocar(saida, t, compasso, passo, acorde, sortear, duracaoDoPasso)`,
 * chamada a cada passo.
 */
const MUSICAS = {
  /* Blues em Mi, 12 compassos, com baixo "boogie" e balanço */
  neutro: {
    bpm: 92, tempos: 4, subdivisao: 2, balanco: 0.33,
    acordes: [40, 40, 40, 40, 45, 45, 40, 40, 47, 45, 40, 47].map((r) => [r, r + 4, r + 7, r + 10]),
    tocar(s, t, compasso, passo, acorde, sortear, d) {
      const r = acorde[0];
      const boogie = [0, 4, 7, 9, 10, 9, 7, 4];
      voz(s, t, r + boogie[passo], d * 0.9, { forma: 'triangle', volume: 0.13, liberacao: 0.05 });
      if (passo === 2 || passo === 6) {
        for (const n of acorde.slice(1)) voz(s, t, n + 12, d * 0.6, { forma: 'square', volume: 0.018, filtro: 1800, liberacao: 0.08 });
      }
      if (passo % 2 === 1) chiado(s, t, 0.05, { volume: 0.025, filtro: 7000 });
      if (passo === 0 || passo === 4) tambor(s, t, { volume: 0.12, de: 90, para: 50, duracao: 0.25 });
      /* frase de gaita/guitarra na escala de blues, em metade dos compassos */
      if (compasso % 2 === 1 && passo % 2 === 0 && sortear() < 0.7) {
        const blues = [0, 3, 5, 6, 7, 10, 12];
        const nota = 64 + blues[Math.floor(sortear() * blues.length)];
        voz(s, t, nota, d * (sortear() < 0.3 ? 2 : 1), { forma: 'sawtooth', volume: 0.03, filtro: 2200, vibrato: 12, liberacao: 0.12 });
      }
    },
  },

  /* Valsa lenta em Sol, compasso 3/4: baixo no 1, acordes no 2 e no 3, melodia cantada e o mar ao fundo */
  oceano: {
    bpm: 66, tempos: 3, subdivisao: 1, balanco: 0,
    acordes: [[43, 55, 59, 62], [40, 55, 59, 64], [36, 55, 60, 64], [38, 54, 57, 62], [43, 55, 59, 62], [47, 54, 59, 62], [36, 55, 60, 64], [38, 54, 57, 60]],
    tocar(s, t, compasso, passo, acorde, sortear, d) {
      if (passo === 0) {
        voz(s, t, acorde[0], d * 1.2, { forma: 'sine', volume: 0.2, ataque: 0.02, liberacao: 0.5 });
        if (compasso % 2 === 0) chiado(s, t, d * 5, { volume: 0.025, filtro: 600, tipo: 'lowpass', ataque: d * 2.2 }); /* onda */
      } else {
        for (const n of acorde.slice(1)) voz(s, t, n, d * 0.8, { forma: 'triangle', volume: 0.035, ataque: 0.03, liberacao: 0.3 });
      }
      /* melodia: notas longas nos tempos fortes, às vezes uma passagem */
      if (passo === 0 || (passo === 2 && sortear() < 0.45)) {
        const escolhidas = acorde.slice(1).map((n) => n + 12);
        const nota = escolhidas[Math.floor(sortear() * escolhidas.length)];
        voz(s, t, nota, passo === 0 ? d * 1.9 : d * 0.9, { forma: 'sine', volume: 0.07, ataque: 0.06, liberacao: 0.6, vibrato: 8 });
      }
    },
  },

  /* Épica em Lá menor: tambores taiko, cordas em ostinato e metais em notas longas */
  montanha: {
    bpm: 88, tempos: 4, subdivisao: 2, balanco: 0,
    acordes: [[45, 57, 60, 64], [41, 57, 60, 65], [48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 57, 60, 65], [43, 55, 59, 62], [40, 56, 59, 64]],
    tocar(s, t, compasso, passo, acorde, sortear, d) {
      const r = acorde[0];
      /* ostinato das cordas: fundamental e quinta, em colcheias */
      voz(s, t, (passo % 2 ? r + 7 : r) + 12, d * 0.85, { forma: 'sawtooth', volume: 0.04, filtro: 900, liberacao: 0.06 });
      /* tambores: 1, 3, 3 e meio e um rufar no fim de cada 4 compassos */
      if ([0, 4, 5].includes(passo)) tambor(s, t, { volume: passo === 0 ? 0.4 : 0.28, de: 120, para: 40, duracao: 0.6 });
      if (compasso % 4 === 3 && passo >= 6) { tambor(s, t, { volume: 0.25, de: 180, para: 80, duracao: 0.2 }); tambor(s, t + d / 2, { volume: 0.25, de: 180, para: 80, duracao: 0.2 }); }
      /* metais: acorde sustentado no início do compasso */
      if (passo === 0) {
        for (const n of acorde.slice(1)) voz(s, t, n, d * 7.5, { forma: 'sawtooth', volume: 0.022, filtro: 1400, ataque: 0.25, liberacao: 0.4 });
        voz(s, t, r - 12, d * 7.5, { forma: 'triangle', volume: 0.16, ataque: 0.05, liberacao: 0.3 });
      }
      /* tema heroico nos tempos 1 e 3 */
      if ((passo === 0 || passo === 4) && sortear() < 0.85) {
        const nota = acorde[1 + Math.floor(sortear() * 3)] + 12;
        voz(s, t, nota, d * (passo === 0 ? 3.5 : 3), { forma: 'square', volume: 0.03, filtro: 2600, ataque: 0.04, liberacao: 0.2, vibrato: 6 });
      }
      if (compasso % 8 === 0 && passo === 0) chiado(s, t, 2.2, { volume: 0.05, filtro: 5000 }); /* prato */
    },
  },

  /* Sombria e gótica em Ré menor harmônico: órgão, sino a cada dois compassos e um lamento */
  pantano: {
    bpm: 56, tempos: 4, subdivisao: 1, balanco: 0,
    acordes: [[38, 50, 53, 57], [34, 50, 53, 58], [31, 50, 55, 58], [33, 49, 52, 57], [38, 50, 53, 57], [34, 50, 53, 58], [36, 48, 52, 55], [33, 49, 52, 57]],
    tocar(s, t, compasso, passo, acorde, sortear, d) {
      if (passo === 0) {
        /* órgão: cada nota do acorde com o 1º e 2º harmônicos */
        for (const n of acorde.slice(1)) {
          for (const [oitava, vol] of [[0, 0.03], [12, 0.012], [19, 0.006]]) voz(s, t, n + oitava, d * 3.8, { forma: 'sine', volume: vol, ataque: 0.4, liberacao: 0.8, desafinar: oitava ? 4 : 0 });
        }
        voz(s, t, acorde[0], d * 3.9, { forma: 'sawtooth', volume: 0.04, filtro: 300, ataque: 0.5, liberacao: 0.8 }); /* zumbido grave */
        if (compasso % 2 === 0) sino(s, t, 62, 0.05);
      }
      /* lamento: notas lentas da escala de Ré menor harmônico */
      if ((passo === 1 || passo === 3) && sortear() < 0.6) {
        const escala = [62, 64, 65, 67, 69, 70, 73, 74];
        const nota = escala[Math.floor(sortear() * escala.length)];
        voz(s, t, nota, d * 1.8, { forma: 'triangle', volume: 0.05, ataque: 0.15, liberacao: 0.9, vibrato: 14 });
      }
      if (passo === 2 && sortear() < 0.3) tambor(s, t, { volume: 0.18, de: 70, para: 35, duracao: 1.2 });
    },
  },
};

/* ======================================================================== agendador */

let atual = null;       /* { musica, saida, compasso, passo, proximo, laco } */
let temporizador = null;

/** Agenda as notas que caem nos próximos ANTECEDENCIA segundos. */
function agendar() {
  if (!atual) return;
  const a = atual.saida.context, m = atual.musica;
  const duracaoDoTempo = 60 / m.bpm, d = duracaoDoTempo / m.subdivisao;
  const passosPorCompasso = m.tempos * m.subdivisao;
  /* se a aba ficou em segundo plano, retoma do agora em vez de despejar as notas atrasadas */
  if (atual.proximo < a.currentTime) atual.proximo = a.currentTime + 0.05;
  while (atual.proximo < a.currentTime + ANTECEDENCIA) {
    const compasso = atual.compasso % m.acordes.length;
    const sortear = sorteador(compasso * 7919 + atual.passo * 31 + 1);
    const atraso = m.balanco && atual.passo % 2 === 1 ? d * m.balanco : 0;
    m.tocar(atual.saida, atual.proximo + atraso, compasso, atual.passo, m.acordes[compasso], sortear, d);
    atual.proximo += d;
    atual.passo++;
    if (atual.passo >= passosPorCompasso) { atual.passo = 0; atual.compasso++; }
  }
}

/** Música de fundo: tocar a do terreno, parar, ligar e desligar. */
export const Musica = {
  /** Começa (ou troca para) a música do terreno, com entrada suave. */
  tocar(terreno) {
    const a = contextoDeAudio();
    if (!a) return;
    const musica = MUSICAS[terreno] || MUSICAS.neutro;
    if (atual && atual.musica === musica) return;
    this.parar();
    const saida = a.createGain();
    saida.gain.setValueAtTime(0.0001, a.currentTime);
    saida.gain.exponentialRampToValueAtTime(VOLUME, a.currentTime + 1.5);
    saida.connect(a.destination);
    atual = { musica, saida, compasso: 0, passo: 0, proximo: a.currentTime + 0.1 };
    agendar();
    temporizador = setInterval(agendar, 100);
  },

  /** Para a música com saída suave. */
  parar() {
    if (temporizador) clearInterval(temporizador);
    temporizador = null;
    if (!atual) return;
    const { saida } = atual, a = saida.context;
    saida.gain.cancelScheduledValues(a.currentTime);
    saida.gain.setValueAtTime(Math.max(0.0001, saida.gain.value), a.currentTime);
    saida.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.6);
    setTimeout(() => saida.disconnect(), 900);
    atual = null;
  },

  /** Está tocando? */
  tocando() { return !!atual; },
};
