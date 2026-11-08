/* Efeitos sonoros sintetizados com WebAudio (nenhum arquivo de áudio). */
var TT = (globalThis.TT = globalThis.TT || {});

TT.Sfx = (function () {
  var ctx = null;
  var muted = false;
  function ac() {
    if (!ctx) {
      var AC = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type, vol, when, slide) {
    var a = ac(); if (!a || muted) return;
    var t = a.currentTime + (when || 0);
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol, when, lp) {
    var a = ac(); if (!a || muted) return;
    var t = a.currentTime + (when || 0);
    var buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    var src = a.createBufferSource(); src.buffer = buf;
    var f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp || 3000;
    var g = a.createGain(); g.gain.value = vol || 0.2;
    src.connect(f); f.connect(g); g.connect(a.destination);
    src.start(t);
  }
  return {
    unlock: function () { ac(); },
    setMuted: function (m) { muted = m; },
    isMuted: function () { return muted; },
    flip: function () { noise(0.06, 0.18, 0, 5000); tone(880, 0.05, 'triangle', 0.05, 0.02); },
    place: function () { noise(0.09, 0.25, 0, 900); },
    select: function () { tone(660, 0.05, 'triangle', 0.06); },
    tune: function () { [523, 659, 784].forEach(function (f, i) { tone(f, 0.16, 'triangle', 0.08, i * 0.06); }); },
    hit: function () { tone(220, 0.25, 'sawtooth', 0.09, 0, 90); noise(0.2, 0.2, 0, 1200); },
    boom: function () { tone(110, 0.6, 'sawtooth', 0.14, 0, 40); noise(0.6, 0.35, 0, 600); },
    dropout: function () { tone(740, 0.12, 'square', 0.04); tone(990, 0.12, 'square', 0.04, 0.08); },
    truco: function () { tone(392, 0.18, 'square', 0.08); tone(523, 0.32, 'square', 0.08, 0.16); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.22, 'triangle', 0.09, i * 0.1); }); },
    lose: function () { [392, 330, 262].forEach(function (f, i) { tone(f, 0.3, 'triangle', 0.08, i * 0.14); }); },
    badge: function () { [880, 1175].forEach(function (f, i) { tone(f, 0.18, 'sine', 0.08, i * 0.09); }); },
  };
})();
