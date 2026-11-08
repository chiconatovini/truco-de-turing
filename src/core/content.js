/* Conteúdo educativo (Grimório), conquistas, textos de carta e provocações dos bots. */
var TT = (globalThis.TT = globalThis.TT || {});

TT.CODEX = [
  { id: 'neuronio', title: 'Neurônio', tag: 'Fundamento',
    concept: 'Um neurônio artificial recebe entradas, multiplica cada uma por um peso, soma tudo com um viés e passa o resultado por uma função de ativação (ReLU, sigmoide, tanh). É a unidade mínima de uma rede neural.',
    game: 'Cada carta na mesa é um neurônio. O valor da carta faz o papel da ativação: é quanto aquele neurônio contribui para a saída.' },
  { id: 'camadas', title: 'Camadas', tag: 'Arquitetura',
    concept: 'Redes densas organizam neurônios em camadas: a de entrada recebe os dados, as ocultas aprendem representações intermediárias e a de saída entrega a predição. "Profunda" quer dizer muitas camadas ocultas.',
    game: 'A mesa tem 1 camada de entrada (3 neurônios), 5 ocultas (5 cada) e 1 de saída (4). Entrada e saída são imunes a ações, como dados e rótulos que não se alteram durante o treino.' },
  { id: 'forward', title: 'Propagação direta', tag: 'Treino',
    concept: 'No forward pass o sinal atravessa a rede da entrada até a saída, camada por camada. Cada camada só recebe o que a anterior produziu.',
    game: 'Você constrói um caminho com um neurônio por camada, sempre avançando para a camada seguinte. A soma das cartas desse caminho é a saída da sua rede.' },
  { id: 'pesos', title: 'Pesos e conexões', tag: 'Fundamento',
    concept: 'Os pesos dizem quanto cada conexão importa. No TensorFlow Playground, a espessura das linhas mostra o tamanho do peso e a cor mostra o sinal.',
    game: 'As linhas entre seus neurônios engrossam conforme o valor das cartas. Azul é você, laranja é o adversário, como no Playground.' },
  { id: 'perda', title: 'Curva de treino', tag: 'Treino',
    concept: 'Durante o treino acompanhamos a função de perda época a época. Uma curva que cai e estabiliza indica convergência; uma que oscila indica taxa de aprendizado alta ou dados ruidosos.',
    game: 'O gráfico no painel mostra a soma de cada rede turno a turno. Quedas bruscas são overfits e early stops sofridos.' },
  { id: 'tunagem', title: 'Tunagem (ajuste fino)', tag: 'Ação',
    concept: 'Fine-tuning é continuar treinando um modelo para reforçar o que ele já sabe fazer. Ajustar demais um mesmo componente, porém, deixa o modelo frágil e especializado.',
    game: 'Empilhe uma carta de mesma figura no seu último neurônio oculto: a carta soma à rede (figuras ganham +10). O risco: um neurônio com 2 cartas fica a uma carta do early stop.' },
  { id: 'overfit', title: 'Overfitting', tag: 'Ação',
    concept: 'Sobreajuste é quando o modelo decora o conjunto de treino, inclusive o ruído, e generaliza mal para dados novos. É combatido com regularização, mais dados e dropout.',
    game: 'Coloque uma carta de mesma figura sobre o último neurônio oculto do adversário: ele sofre dropout forçado, o neurônio vai para o cemitério e a rede dele recua uma camada.' },
  { id: 'dropout', title: 'Dropout', tag: 'Ação',
    concept: 'Dropout (Srivastava et al., 2014) desliga neurônios aleatórios durante o treino. A rede deixa de depender de poucos caminhos e generaliza melhor.',
    game: 'GatoNet: pague 1 carta da mão por camada oculta para desvirar seus últimos neurônios e tentar outro caminho. Não gasta o turno. Os neurônios desvirados ficam marcados, e todos lembram o valor deles.' },
  { id: 'earlystop', title: 'Early stopping', tag: 'Ação',
    concept: 'Parada antecipada interrompe o treino quando o erro de validação para de cair. Bom para evitar sobreajuste, ruim se acontecer cedo demais.',
    game: 'Faça um neurônio da fronteira do adversário ter 3 cartas empilhadas: ele vai para o cemitério e a rede do adversário é finalizada ali mesmo, com a soma que tiver.' },
  { id: 'stackoverflow', title: 'Stack overflow', tag: 'Ação',
    concept: 'Estouro de pilha é quando uma recursão nunca termina. Em redes profundas, o primo é a explosão de gradientes: valores crescem até virar NaN. A cura costuma ser gradient clipping.',
    game: 'Quatro cartas no mesmo neurônio: além do early stop, a vítima perde todas as cartas da mão. O jogo acaba para ela.' },
  { id: 'vanishing', title: 'Vanishing gradient', tag: 'Combo',
    concept: 'Em redes profundas com ativações saturantes, o gradiente é multiplicado por números pequenos a cada camada e some antes de chegar ao início. ReLU, normalização e conexões residuais ajudam.',
    game: 'Quatro figuras iguais em camadas adjacentes (contando as empilhadas) zeram a rede inteira. Pares valem +10 e trios +20, então a cobiça tem limite.' },
  { id: 'transfer', title: 'Transfer learning', tag: 'Ação',
    concept: 'Aprendizado por transferência reaproveita um modelo pré-treinado em outra tarefa, trocando só o que precisa. Economiza dados e tempo de treino.',
    game: 'Com quatro cartas iguais na mão, troque-as por quatro cartas do limbo. Uma vez por mão.' },
  { id: 'ruido', title: 'Ruído e limbo', tag: 'Dados',
    concept: 'Dados reais têm ruído. Injetar ruído de propósito (data augmentation, inicialização aleatória) torna o modelo mais robusto.',
    game: 'As 10 cartas que sobram vão para o limbo sem serem vistas. Elas tiram a certeza de qualquer contagem de cartas e só voltam via transfer learning.' },
  { id: 'montecarlo', title: 'Simulação de Monte Carlo', tag: 'Métodos',
    concept: 'Monte Carlo estima uma quantidade gerando muitas realizações aleatórias de um processo e agregando os resultados. Busca em árvore de Monte Carlo (MCTS) usa isso para escolher jogadas.',
    game: 'O Mestre Monte Carlo, oponente de nível difícil, sorteia o que não vê (sua mão, as cartas viradas, o limbo), joga centenas de partidas até o fim e escolhe a jogada que mais venceu.' },
  { id: 'terrenos', title: 'Mudança de distribuição', tag: 'Dados',
    concept: 'Modelos sofrem quando os dados de uso diferem dos de treino (dataset shift) ou mudam com o tempo (concept drift). Regularizações como weight decay encolhem pesos a cada passo.',
    game: 'Montanha cobra pela profundidade. Pântano é weight decay: neurônios não tunados perdem 1 ponto por rodada. Oceano é concept drift: o vento muda o naipe que vale dobro.' },
  { id: 'truco', title: 'Decisão sob incerteza', tag: 'Métodos',
    concept: 'Escolher com informação incompleta é estimar probabilidades e comparar valores esperados. Blefar funciona porque o outro lado também só estima.',
    game: 'Peça TRUCO quando achar que vence: a mão passa a valer 3, depois 6, 9 e 12. Quem corre entrega o valor atual. Os bots estimam a chance de vitória simulando a mão.' },
];

TT.TIERS = {
  bronze: { name: 'Bronze', color: '#c0834a' },
  prata: { name: 'Prata', color: '#b8c2cc' },
  ouro: { name: 'Ouro', color: '#e7c35a' },
  platina: { name: 'Platina', color: '#9fe3e0' },
  adamantium: { name: 'Adamantium', color: '#b48cff' },
  antimateria: { name: 'Antimatéria', color: '#ff6fb1' },
};

/* ctx: { st (estado final), me, won, match, matchWon, stats (acumuladas), trucoWon, botRan, opts } */
TT.ACHIEVEMENTS = [
  { id: 'primeira', name: 'Primeira época', desc: 'Vença sua primeira mão.', tier: 'bronze', test: (c) => c.won },
  { id: 'dez', name: 'Convergiu', desc: 'Vença 10 mãos.', tier: 'prata', test: (c) => c.stats.wins >= 10 },
  { id: 'cinquenta', name: 'Estado da arte', desc: 'Vença 50 mãos.', tier: 'ouro', test: (c) => c.stats.wins >= 50 },
  { id: 'gato10', name: 'Gato curioso', desc: 'Faça 10 dropouts somando todas as mãos.', tier: 'bronze', test: (c) => c.stats.dropouts >= 10 },
  { id: 'gato100', name: 'Sete vidas não bastam', desc: 'Faça 100 dropouts.', tier: 'platina', test: (c) => c.stats.dropouts >= 100 },
  { id: 'zen', name: 'Inferência pura', desc: 'Vença uma mão sem executar nenhuma ação, só ativando neurônios.', tier: 'prata', test: (c) => c.won && c.st.players[c.me].actionsUsed === 0 },
  { id: 'zen10', name: 'Monge do forward pass', desc: 'Vença 10 mãos sem executar nenhuma ação.', tier: 'adamantium', test: (c) => c.stats.zenWins >= 10 },
  { id: 'desk', name: 'Desk rejection', desc: 'Aplique early stop ou stack overflow na sua própria rede.', tier: 'prata', test: (c) => c.st.players[c.me].stats.selfStops > 0 },
  { id: 'patos', name: 'Marcha dos patos', desc: 'Perca para um jogador que ficou travado numa camada oculta.', tier: 'ouro', test: (c) => !c.won && c.st.result.stuck[c.st.result.winner] },
  { id: 'contra', name: 'Contra tudo e contra todos', desc: 'Vença com uma rede que sofreu stack overflow.', tier: 'antimateria', test: (c) => c.won && c.st.players[c.me].status === 'overflow' },
  { id: 'artilheiro', name: 'Artilheiro dos gols inúteis', desc: 'Faça transfer learning e perca a mão mesmo assim.', tier: 'ouro', test: (c) => !c.won && c.st.players[c.me].transferUsed },
  { id: 'transfer', name: 'Pré-treinado', desc: 'Faça um transfer learning.', tier: 'prata', test: (c) => c.st.players[c.me].transferUsed },
  { id: 'vanishing', name: 'Gradiente evaporado', desc: 'Termine uma mão com alguma rede zerada por vanishing gradient.', tier: 'ouro', test: (c) => c.st.players.some((_, i) => TT.scoreNetwork(c.st, i).vanishing) },
  { id: 'overfit', name: 'Regularizador', desc: 'Aplique overfit no adversário.', tier: 'bronze', test: (c) => c.st.players[c.me].stats.overfits > 0 },
  { id: 'earlystop', name: 'Paciência de validação', desc: 'Aplique early stop no adversário.', tier: 'prata', test: (c) => c.st.players[c.me].stats.earlyStops > 0 },
  { id: 'overflow', name: 'Segmentation fault', desc: 'Aplique stack overflow no adversário.', tier: 'ouro', test: (c) => c.st.players[c.me].stats.overflows > 0 },
  { id: 'trio', name: 'Atenção multi-cabeça', desc: 'Termine com um trio de figuras na sua rede.', tier: 'prata', test: (c) => TT.scoreNetwork(c.st, c.me).combos.some((k) => k.count === 3) },
  { id: 'sessenta', name: 'Rede profunda', desc: 'Termine uma mão com 60 pontos ou mais.', tier: 'ouro', test: (c) => c.st.result.scores[c.me] >= 60 },
  { id: 'truco', name: 'Truco, marreco!', desc: 'Vença uma mão trucada.', tier: 'bronze', test: (c) => c.won && c.handValue >= 3 },
  { id: 'doze', name: 'Vale a partida', desc: 'Vença uma mão valendo 12 tentos.', tier: 'platina', test: (c) => c.won && c.handValue >= 12 },
  { id: 'correu', name: 'Corre que é cilada', desc: 'Faça o bot correr do truco.', tier: 'prata', test: (c) => c.botRan },
  { id: 'campeao', name: 'Campeão da mesa', desc: 'Vença uma partida de 12 tentos.', tier: 'ouro', test: (c) => c.matchWon },
  { id: 'maquina', name: 'Venceu a máquina', desc: 'Vença o Mestre Monte Carlo numa partida de 12 tentos.', tier: 'adamantium', test: (c) => c.matchWon && c.opts.bot === 'montecarlo' },
  { id: 'cartografo', name: 'Cartógrafo', desc: 'Vença mãos em todos os terrenos.', tier: 'platina', test: (c) => Object.keys(TT.TERRAINS).every((t) => c.stats.terrains[t]) },
  { id: 'colecionador', name: 'Colecionador', desc: 'Vença mãos com todos os baralhos.', tier: 'platina', test: (c) => Object.keys(TT.DECKS).every((d) => c.stats.decks[d]) },
  { id: 'zap', name: 'Zap na saída', desc: 'Vença com o Zap (4♣) na rede, no baralho de truco.', tier: 'ouro', test: (c) => c.won && c.st.cfg.deck === 'truco' && c.st.players[c.me].path.some((id) => { var s = c.st.slotIndex[id]; return s.cards[0].r === '4' && s.cards[0].s === 'C'; }) },
  { id: 'biblio', name: 'Bibliotecário', desc: 'Leia todos os verbetes do Grimório.', tier: 'prata', test: (c) => c.stats.codexRead >= TT.CODEX.length },
];

TT.FLAVOR = {
  A: 'Um neurônio bem treinado vale mais que mil mal inicializados.',
  '2': 'Duas entradas e um XOR impossível. Minsky avisou.',
  '3': 'Três épocas e já jura que convergiu.',
  '4': 'Quatro folds de validação cruzada, nenhum de confiança.',
  '5': 'Cinco sementes aleatórias, cinco resultados diferentes.',
  '6': 'Seis camadas e nenhuma conexão residual.',
  '7': 'Sete hiperparâmetros ajustados na base do chute.',
  '8': 'Batch de 8: barulhento, mas honesto.',
  '9': 'Nove dígitos do MNIST esperando classificação.',
  '10': 'Dez classes, uma softmax, nenhuma certeza.',
  J: 'O valete decorou o conjunto de treino inteiro.',
  Q: 'A dama distribui atenção entre todas as posições.',
  K: 'O rei reina absoluto até o gradiente sumir.',
  Zap: 'Quando o Zap entra na rede, até o gradiente pede licença.',
  Copas: 'O sete de copas não perdoa ativação morna.',
  Espadilha: 'A espadilha corta a perda pela metade.',
  'Pica-fumo': 'Fumaça na rede: ninguém vê o gradiente passar.',
};

TT.TAUNTS = {
  truco: ['TRUCO, marreco!', 'Vem pro gradiente, vem!', 'Truco! Minha loss tá lá embaixo.', 'Truco! Já simulei esse final.'],
  accept: ['Desce!', 'Cai dentro, que eu converjo.', 'Aceito. Tá com medo do backprop?'],
  run: ['Corro. Volto com mais dados.', 'Essa eu deixo passar. Early stop estratégico.', 'Corri, mas foi regularização.'],
  raise: ['Pois eu peço SEIS!', 'Vai mais alto que meu learning rate!'],
  overfit: ['Decorou o dataset, foi?', 'Overfit! Generaliza isso aí.'],
  earlystop: ['Parou de aprender, campeão.', 'Validação diz: chega por hoje.'],
  stackoverflow: ['Segmentation fault na tua mão!', 'Estourou a pilha, perdeu as cartas!'],
  sufferOverfit: ['Ei! Eu ia generalizar...', 'Meu neurônio favorito...'],
  sufferStop: ['Nãããão, minha época!', 'Tá bom, congelo os pesos.'],
  vanishing: ['O gradiente sumiu mais rápido que café na copa.'],
  win: ['Convergi.', 'Loss zero, tentos no bolso.', 'GG, ótimo dataset.'],
  lose: ['Bom jogo. Vou retreinar.', 'Overfitei na mão errada.', 'Próxima época é minha.'],
};
TT.taunt = function (key) {
  var list = TT.TAUNTS[key] || [''];
  return list[Math.floor(Math.random() * list.length)];
};

/* Armazenamento local seguro (pode falhar em janelas privadas) */
TT.Store = {
  key: 'truco-de-turing:v1',
  load: function () {
    var base = { wins: 0, hands: 0, dropouts: 0, zenWins: 0, codexRead: 0, read: {}, terrains: {}, decks: {}, unlocked: {}, muted: false, seenTutorial: false };
    try {
      var raw = globalThis.localStorage && localStorage.getItem(this.key);
      if (raw) return Object.assign(base, JSON.parse(raw));
    } catch (e) { /* sem armazenamento */ }
    return base;
  },
  save: function (data) {
    try { if (globalThis.localStorage) localStorage.setItem(this.key, JSON.stringify(data)); } catch (e) { /* ignora */ }
  },
};
