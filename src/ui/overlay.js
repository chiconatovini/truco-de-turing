/* Painéis HTML sobre o canvas: menu, regras, grimório, conquistas, modais e avisos. */
var TT = (globalThis.TT = globalThis.TT || {});

TT.UI = (function () {
  function $(sel) { return document.querySelector(sel); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function open(html, opts) {
    opts = opts || {};
    var ov = document.createElement('div');
    ov.className = 'overlay' + (opts.clear ? ' clear' : '');
    ov.innerHTML = html;
    $('#ui').appendChild(ov);
    var api = {
      el: ov,
      close: function () { if (ov.parentNode) ov.parentNode.removeChild(ov); if (opts.onClose) opts.onClose(); },
    };
    ov.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', api.close); });
    if (opts.dismissable) {
      ov.addEventListener('click', function (e) { if (e.target === ov) api.close(); });
    }
    var focus = ov.querySelector('[autofocus], .btn');
    if (focus) setTimeout(function () { focus.focus({ preventScroll: true }); }, 30);
    return api;
  }
  function closeAll() { $('#ui').innerHTML = ''; }

  function toast(title, body, kind, ms) {
    var t = document.createElement('div');
    t.className = 'toast' + (kind ? ' ' + kind : '');
    t.innerHTML = '<b>' + esc(title) + '</b>' + esc(body || '');
    var box = $('#toasts');
    while (box.children.length >= 2) box.removeChild(box.firstChild);
    box.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; }, (ms || 5200) - 400);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, ms || 5200);
    t.addEventListener('click', function () { if (t.parentNode) t.parentNode.removeChild(t); });
  }

  /* ---------- Menu principal ---------- */
  function menu(app) {
    var o = app.opts;
    function options(obj, sel) {
      return Object.keys(obj).map(function (k) { return '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + esc(obj[k].name || obj[k]) + '</option>'; }).join('');
    }
    var opp = {
      montecarlo: { name: 'Mestre Monte Carlo · difícil' }, guloso: { name: 'Gradiente Guloso · médio' },
      aleatorio: { name: 'Zé do Ruído · fácil' }, hotseat: { name: '2 humanos no mesmo aparelho' },
    };
    var starters = { 'revela-volta': { name: 'Revela carta da mão (volta para a mão)' }, 'revela-descarta': { name: 'Revela carta da mão (vai para o cemitério)' }, sorteio: { name: 'Par ou ímpar (sorteio)' } };
    var modes = { '12': { name: 'Partida até 12 tentos, com truco' }, '1': { name: 'Mão única, sem truco' } };
    var html =
      '<div class="menu">' +
      '<section class="menu-hero">' +
      '<h1><span>O JOGO DO</span>Truco de Turing</h1>' +
      '<p>Monte uma rede neural carta por carta, da entrada à saída. Tune seus neurônios, aplique overfit no adversário, fuja do vanishing gradient e, quando sentir a mão boa, grite TRUCO.</p>' +
      '<div class="legend"><span><i class="dot" style="background:var(--blue)"></i><b>Azul</b> é a sua rede</span><span><i class="dot" style="background:var(--orange)"></i><b>Laranja</b> é a do adversário</span></div>' +
      '<div class="menu-actions">' +
      '<button class="btn wine" id="m-play" autofocus>Jogar</button>' +
      '<button class="btn" id="m-rules">Como jogar</button>' +
      '<button class="btn" id="m-codex">Grimório</button>' +
      '<button class="btn" id="m-ach">Conquistas</button>' +
      '</div>' +
      '<div class="credits">Regras originais: prof. Peng Yaohao (FPO 2026/2, PPCA/UnB). Feito com Phaser. Código aberto sob a licença <a href="https://github.com/welyngton/truco-de-turing#GPL-3.0-1-ov-file" target="_blank" rel="noopener">GPL-3.0</a>.</div>' +
      '</section>' +
      '<section class="sheet menu-panel">' +
      '<h3 style="margin-top:0">Configurar a mesa</h3>' +
      '<div class="field"><label for="m-opp">Oponente</label><select id="m-opp">' + options(opp, o.bot) + '</select><div class="hint" id="m-opp-h"></div></div>' +
      '<div class="field"><label for="m-deck">Baralho</label><select id="m-deck">' + options(TT.DECKS, o.deck) + '</select><div class="hint" id="m-deck-h"></div></div>' +
      '<div class="field"><label for="m-terrain">Terreno</label><select id="m-terrain">' + options(TT.TERRAINS, o.terrain) + '</select><div class="hint" id="m-terrain-h"></div></div>' +
      '<div class="field"><label for="m-start">Quem começa</label><select id="m-start">' + options(starters, o.starter) + '</select></div>' +
      '<div class="field" style="margin-bottom:0"><label for="m-mode">Partida</label><select id="m-mode">' + options(modes, String(o.target)) + '</select></div>' +
      '</section></div>';
    var m = open(html, { clear: true });
    var el = m.el;
    function sync() {
      var bot = el.querySelector('#m-opp').value;
      el.querySelector('#m-opp-h').textContent = bot === 'hotseat' ? 'Dois jogadores se revezam no mesmo aparelho. A mão de quem não joga fica escondida.' : 'Nível ' + TT.BOTS[bot].level.toLowerCase() + ', ' + TT.BOTS[bot].method + '. ' + TT.BOTS[bot].style;
      el.querySelector('#m-deck-h').textContent = TT.DECKS[el.querySelector('#m-deck').value].short;
      el.querySelector('#m-terrain-h').textContent = TT.TERRAINS[el.querySelector('#m-terrain').value].short;
    }
    el.querySelectorAll('select').forEach(function (s) { s.addEventListener('change', sync); });
    sync();
    function read() {
      app.opts = {
        bot: el.querySelector('#m-opp').value, deck: el.querySelector('#m-deck').value,
        terrain: el.querySelector('#m-terrain').value, starter: el.querySelector('#m-start').value,
        target: parseInt(el.querySelector('#m-mode').value, 10),
      };
      app.saveOpts();
    }
    el.querySelector('#m-play').addEventListener('click', function () { TT.Sfx.unlock(); read(); m.close(); app.play(); });
    el.querySelector('#m-rules').addEventListener('click', function () { read(); rules(app); });
    el.querySelector('#m-codex').addEventListener('click', function () { read(); codex(app); });
    el.querySelector('#m-ach').addEventListener('click', function () { read(); achievements(app); });
    return m;
  }

  /* ---------- Regras ---------- */
  function rules(app, onClose) {
    var html =
      '<div class="sheet"><button class="close-x" data-close aria-label="Fechar">×</button>' +
      '<h2>Como jogar</h2>' +
      '<p>Dois jogadores disputam quem constrói a rede neural de maior soma, ligando a <b>camada de entrada</b> à <b>camada de saída</b> com um neurônio em cada uma das 5 camadas ocultas. A sua rede é <span class="chip blue">azul</span>, a do adversário é <span class="chip orange">laranja</span>.</p>' +
      '<h3>Preparação</h3>' +
      '<ul><li>Baralho de 52 cartas, sem coringas. Na mesa, viradas: 3 na entrada, 5 em cada uma das 5 camadas ocultas e 4 na saída.</li>' +
      '<li>Cada jogador recebe 5 cartas na mão. Elas <b>não são repostas</b>: são seu estoque de ações para a mão inteira.</li>' +
      '<li>As 10 restantes vão para o <b>limbo</b> sem serem vistas (ruído).</li></ul>' +
      '<h3>Seu turno</h3>' +
      '<p>Faça uma destas coisas: <b>ative um neurônio</b> virado na próxima camada da sua rede (clique nele), ou use cartas da mão numa ação. Cada neurônio pertence a um só jogador. Só pode passar quem não tem neurônio para ativar.</p>' +
      '<h3>Pontuação</h3>' +
      '<ul><li>2 a 10 valem o número, Ás vale 11, J, Q e K valem 0.</li>' +
      '<li>Figuras iguais em camadas vizinhas: par vale +10, trio +20. Quatro figuras iguais seguidas (contando as empilhadas) causam <b>vanishing gradient</b> e zeram a rede.</li></ul>' +
      '<h3>Ações com a mão</h3>' +
      '<p>Selecione cartas da mão de mesma figura do neurônio e clique no alvo. Entrada e saída são imunes. O alvo é sempre o neurônio oculto mais recente de uma rede.</p>' +
      '<ul><li><b>Tunagem</b> (1 carta no seu neurônio): a carta soma à rede; em figuras, +10.</li>' +
      '<li><b>Overfit</b> (1 carta no neurônio do adversário): o neurônio vai para o cemitério e a rede dele recua uma camada.</li>' +
      '<li><b>Early stop</b> (o neurônio fica com 3 cartas): a rede atingida é finalizada na hora.</li>' +
      '<li><b>Stack overflow</b> (4 cartas): early stop e a vítima perde a mão inteira.</li>' +
      '<li><b>Dropout / GatoNet</b>: desvire seus últimos neurônios ocultos pagando 1 carta por camada. Não gasta o turno.</li>' +
      '<li><b>Transfer learning</b>: com quatro cartas iguais na mão, troque-as por quatro do limbo (uma vez por mão).</li></ul>' +
      '<p>Exemplo do enunciado: a rede 8-K-K-3 com tunagem num K soma 8 + (trio de Reis 20) + (tunagem 10) + 3 = <b>41</b>.</p>' +
      '<h3>Fim da mão e desempates</h3>' +
      '<p>A mão acaba quando todas as redes estão finalizadas (chegaram à saída, ou sofreram early stop ou stack overflow) ou quando todos passam em seguida. Vence a maior soma. Empate: menos dropouts; depois a maior soma das melhores cartas da mão; depois a carta mais alta (espadas &gt; copas &gt; paus &gt; ouros); por fim, quem jogou primeiro.</p>' +
      '<h3>Truco</h3>' +
      '<p>Na partida até 12 tentos cada mão vale 1. Na sua vez, peça <b>TRUCO</b> (3). O outro aceita, corre (você leva o valor atual) ou aumenta: SEIS, NOVE, DOZE. Com alguém a um tento da vitória é <b>mão de onze</b> e ninguém truca.</p>' +
      '<h3>Baralhos e terrenos</h3>' +
      '<ul>' + Object.keys(TT.DECKS).map(function (k) { return '<li><b>' + TT.DECKS[k].name + ':</b> ' + esc(TT.DECKS[k].short) + '</li>'; }).join('') +
      Object.keys(TT.TERRAINS).filter(function (k) { return k !== 'neutro'; }).map(function (k) { return '<li><b>' + TT.TERRAINS[k].name + ':</b> ' + esc(TT.TERRAINS[k].short) + '</li>'; }).join('') + '</ul>' +
      '<div class="row end" style="margin-top:14px"><button class="btn" data-close>Entendi</button></div></div>';
    if (app) { app.store.seenTutorial = true; app.persist(); }
    return open(html, { dismissable: true, onClose: onClose });
  }

  /* ---------- Grimório ---------- */
  function codex(app, startId, onClose) {
    var store = app.store;
    var html = '<div class="sheet"><button class="close-x" data-close aria-label="Fechar">×</button>' +
      '<h2>Grimório de conceitos</h2><p>Cada mecânica do jogo é um conceito de aprendizado de máquina. Os verbetes aparecem destacados quando acontecem na mesa.</p>' +
      '<div class="codex"><nav class="codex-list" id="cx-list"></nav><article class="codex-entry" id="cx-entry"></article></div></div>';
    var m = open(html, { dismissable: true, onClose: onClose });
    var list = m.el.querySelector('#cx-list'), entry = m.el.querySelector('#cx-entry');
    function show(id) {
      var e = TT.CODEX.find(function (x) { return x.id === id; }) || TT.CODEX[0];
      if (!store.read[e.id]) { store.read[e.id] = true; store.codexRead = Object.keys(store.read).length; app.persist(); app.checkMetaAchievements(); }
      entry.innerHTML = '<div class="tag">' + esc(e.tag) + '</div><h2>' + esc(e.title) + '</h2><p>' + esc(e.concept) + '</p><p class="ingame"><b>No jogo:</b> ' + esc(e.game) + '</p>';
      render(e.id);
    }
    function render(active) {
      list.innerHTML = TT.CODEX.map(function (e) {
        return '<button data-id="' + e.id + '" aria-current="' + (e.id === active) + '">' + esc(e.title) + (store.read[e.id] ? '<span class="seen">lido</span>' : '') + '</button>';
      }).join('');
      list.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.id); }); });
    }
    show(startId || TT.CODEX[0].id);
    return m;
  }

  /* ---------- Conquistas ---------- */
  function achievements(app) {
    var store = app.store;
    var got = TT.ACHIEVEMENTS.filter(function (a) { return store.unlocked[a.id]; }).length;
    var html = '<div class="sheet"><button class="close-x" data-close aria-label="Fechar">×</button>' +
      '<h2>Conquistas</h2><p>' + got + ' de ' + TT.ACHIEVEMENTS.length + ' desbloqueadas · ' + store.wins + ' mãos vencidas · ' + store.dropouts + ' dropouts. Contam nas partidas contra bots.</p>' +
      '<div class="ach-grid">' + TT.ACHIEVEMENTS.map(function (a) {
        var t = TT.TIERS[a.tier];
        var on = store.unlocked[a.id];
        return '<div class="ach' + (on ? '' : ' locked') + '"><div class="medal" style="background:' + t.color + '">' + (on ? '✓' : '?') + '</div><div><span class="tier">' + t.name + '</span><b>' + esc(a.name) + '</b><small>' + esc(a.desc) + '</small></div></div>';
      }).join('') + '</div></div>';
    return open(html, { dismissable: true });
  }

  function confirm(title, text, buttons, opts) {
    opts = opts || {};
    var html = '<div class="sheet narrow' + (opts.shout ? ' shout' : '') + '">' + (opts.top || '') + '<h2>' + esc(title) + '</h2>' + (text ? '<p>' + text + '</p>' : '') +
      '<div class="row end" style="margin-top:16px">' + buttons.map(function (b, i) { return '<button class="btn ' + (b.cls || '') + '" data-i="' + i + '">' + esc(b.label) + '</button>'; }).join('') + '</div></div>';
    var m = open(html);
    m.el.querySelectorAll('[data-i]').forEach(function (btn) {
      btn.addEventListener('click', function () { m.close(); var b = buttons[+btn.dataset.i]; if (b.cb) b.cb(); });
    });
    return m;
  }

  return { open: open, closeAll: closeAll, toast: toast, menu: menu, rules: rules, codex: codex, achievements: achievements, confirm: confirm, esc: esc };
})();
