/**
 * @file Testes de unidade do motor da mão (partida.js): criação, consultas, cada tipo de jogada,
 * erros de jogadas inválidas, fim da mão e desempates.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  FORMAS_DE_INICIO, NOME_EFEITO, novaMao, copiarMao, fronteira, alvosDeAtivacao, alvosDeEmpilhamento,
  efeitoDoEmpilhamento, podeEmpilhar, camadasDesfaziveis, valorParaTransfer, podePassar, jogadasLegais, aplicarJogada,
} from '../../src/nucleo/partida.js';
import { TOTAL_CAMADAS, TAMANHO_MAO } from '../../src/nucleo/rede.js';
import { JOGADORES, maoNova, maoJogada, maoAteOFim, procurarSituacao } from '../apoio/estados.js';

/** Ativa o primeiro neurônio livre para quem está na vez. */
const ativarQualquer = (mao) => aplicarJogada(mao, jogadasLegais(mao, mao.vez).find((x) => x.tipo === 'ativar'));

/** Coloca na mão do jogador cartas com os valores dados (ids novos). */
function darCartas(mao, j, valores, naipe = 'O') {
  mao.jogadores[j].mao = valores.map((valor, i) => ({ id: 'T' + j + valor + i, valor, naipe: ['E', 'C', 'P', 'O'][i % 4] || naipe }));
}

describe('novaMao', () => {
  it('monta a mesa 3-5-5-5-5-5-4, distribui 5 cartas e queima 10 no limbo', () => {
    const mao = novaMao({ semente: 5, jogadores: JOGADORES });
    assert.equal(mao.camadas.length, TOTAL_CAMADAS);
    assert.equal(Object.keys(mao.neuronios).length, 32);
    for (const j of mao.jogadores) assert.equal(j.mao.length, TAMANHO_MAO);
    assert.equal(mao.limbo.length, 10);
    assert.equal(mao.fase, 'inicio'); /* padrão: revela e volta */
    assert.deepEqual(mao.historico, [[0, 0]]);
  });
  it('início por sorteio já começa a fase de jogo e emite o evento', () => {
    const mao = maoNova();
    assert.equal(mao.fase, 'jogo');
    assert.equal(mao.eventos[0].tipo, 'inicio');
  });
  it('oceano sorteia o vento; mesma semente, mesma mesa', () => {
    const a = maoNova({ terreno: 'oceano' }), b = maoNova({ terreno: 'oceano' });
    assert.ok(['E', 'C', 'P', 'O'].includes(a.vento));
    assert.deepEqual(a.camadas.map((c) => c.map((n) => n.cartas[0].id)), b.camadas.map((c) => c.map((n) => n.cartas[0].id)));
  });
  it('sem semente usa uma semente nova', () => {
    assert.ok(Number.isInteger(novaMao({ jogadores: JOGADORES }).semente));
  });
  it('constantes de apoio', () => {
    assert.ok(FORMAS_DE_INICIO['revela-volta'] && FORMAS_DE_INICIO.sorteio);
    assert.ok(NOME_EFEITO.tunagem && NOME_EFEITO.stackoverflow);
  });
});

describe('copiarMao', () => {
  it('cópia independente, sem eventos, em modo simulação', () => {
    const mao = maoJogada(4), copia = copiarMao(mao);
    assert.equal(copia.simulacao, true);
    assert.deepEqual(copia.eventos, []);
    ativarQualquer(copia);
    assert.notEqual(copia.turno, mao.turno);
    assert.equal(copia.neuronios[copia.camadas[0][0].id], copia.camadas[0][0]);
  });
});

describe('consultas', () => {
  it('fronteira: null sem rede; depois o último neurônio do caminho', () => {
    const mao = maoNova();
    const j = mao.vez;
    assert.equal(fronteira(mao, j), null);
    ativarQualquer(mao);
    assert.equal(fronteira(mao, j).camada, 0);
  });
  it('alvosDeAtivacao: livres da próxima camada; vazio para rede finalizada', () => {
    const mao = maoNova();
    assert.equal(alvosDeAtivacao(mao, 0).length, 3);
    mao.jogadores[0].situacao = 'concluida';
    assert.deepEqual(alvosDeAtivacao(mao, 0), []);
  });
  it('alvosDeEmpilhamento: só fronteiras ocultas de redes em construção', () => {
    const mao = maoJogada(4);
    for (const n of alvosDeEmpilhamento(mao)) assert.ok(n.camada >= 1 && n.camada <= 5);
    assert.equal(alvosDeEmpilhamento(maoNova()).length, 0);
  });
  it('efeitoDoEmpilhamento: pela pilha final (2, 3, 4) e por quem é o dono', () => {
    const n = { cartas: [{}], dono: 0 };
    assert.deepEqual(efeitoDoEmpilhamento(null, 0, n, 1), { tipo: 'tunagem', proprio: true });
    assert.deepEqual(efeitoDoEmpilhamento(null, 1, n, 1), { tipo: 'overfit', proprio: false });
    assert.equal(efeitoDoEmpilhamento(null, 1, n, 2).tipo, 'earlystop');
    assert.equal(efeitoDoEmpilhamento(null, 1, n, 3).tipo, 'stackoverflow');
    assert.equal(efeitoDoEmpilhamento(null, 1, n, 4), null);
  });
  it('podeEmpilhar: exige vez, alvo válido, mesma figura e pilha ≤ 4', () => {
    const { mao, jogada } = procurarSituacao((m, x) => x.tipo === 'empilhar');
    assert.ok(podeEmpilhar(mao, jogada.jogador, jogada.neuronio, jogada.cartas));
    assert.ok(!podeEmpilhar(mao, 1 - jogada.jogador, jogada.neuronio, jogada.cartas));
    assert.ok(!podeEmpilhar(mao, jogada.jogador, jogada.neuronio, []));
    assert.ok(!podeEmpilhar(mao, jogada.jogador, 'inexistente', jogada.cartas));
    assert.ok(!podeEmpilhar(mao, jogada.jogador, jogada.neuronio, ['carta-fora-da-mao']));
  });
  it('camadasDesfaziveis: camadas ocultas do caminho', () => {
    const mao = maoNova();
    assert.equal(camadasDesfaziveis(mao, 0), 0);
    for (let i = 0; i < 6; i++) ativarQualquer(mao);
    assert.equal(camadasDesfaziveis(mao, 0), 2);
  });
  it('valorParaTransfer: quatro iguais na mão, uma vez por mão', () => {
    const mao = maoNova();
    darCartas(mao, 0, ['7', '7', '7', '7', '2']);
    assert.equal(valorParaTransfer(mao, 0), '7');
    mao.jogadores[0].transferUsado = true;
    assert.equal(valorParaTransfer(mao, 0), null);
    darCartas(mao, 1, ['7', '8', '9', '2', '3']);
    assert.equal(valorParaTransfer(mao, 1), null);
  });
  it('podePassar: só sem neurônio para ativar', () => {
    const mao = maoNova();
    assert.equal(podePassar(mao, mao.vez), false);
    mao.camadas[0].forEach((n) => { n.dono = 9; });
    assert.equal(podePassar(mao, mao.vez), true);
  });
});

describe('jogadasLegais', () => {
  it('fase de início: uma jogada por carta da mão', () => {
    const mao = novaMao({ semente: 2, jogadores: JOGADORES });
    assert.equal(jogadasLegais(mao, 0).length, 5);
    assert.ok(jogadasLegais(mao, 0).every((x) => x.tipo === 'inicio'));
  });
  it('fora da vez: nenhuma jogada', () => {
    const mao = maoNova();
    assert.deepEqual(jogadasLegais(mao, 1 - mao.vez), []);
  });
  it('inclui dropout só com a opção comDropout', () => {
    const mao = maoJogada(6);
    const j = mao.vez;
    if (camadasDesfaziveis(mao, j)) {
      assert.ok(!jogadasLegais(mao, j).some((x) => x.tipo === 'dropout'));
      assert.ok(jogadasLegais(mao, j, { comDropout: true }).some((x) => x.tipo === 'dropout'));
    }
  });
  it('com manilhas de pontos diferentes, considera cada combinação de cartas', () => {
    const { mao, jogada } = procurarSituacao((m, x) => x.tipo === 'empilhar', { opcoes: { baralho: 'truco' } });
    const alvo = mao.neuronios[jogada.neuronio];
    mao.jogadores[mao.vez].mao = [
      { id: 'X1', valor: alvo.cartas[0].valor, naipe: 'E' }, { id: 'X2', valor: alvo.cartas[0].valor, naipe: 'C' },
      { id: 'X3', valor: alvo.cartas[0].valor, naipe: 'P' },
    ];
    const pilhas = jogadasLegais(mao, mao.vez).filter((x) => x.tipo === 'empilhar' && x.neuronio === alvo.id);
    assert.ok(pilhas.length >= 1);
  });
});

describe('aplicarJogada', () => {
  it('início "revela e volta": a carta mais forte começa e volta para a mão', () => {
    const mao = novaMao({ semente: 4, jogadores: JOGADORES });
    mao.jogadores[0].mao[0] = { id: 'AE', valor: 'A', naipe: 'E' };
    mao.jogadores[1].mao[0] = { id: '2O', valor: '2', naipe: 'O' };
    aplicarJogada(mao, { tipo: 'inicio', jogador: 0, carta: 'AE' });
    assert.equal(mao.fase, 'inicio');
    aplicarJogada(mao, { tipo: 'inicio', jogador: 1, carta: '2O' });
    assert.equal(mao.fase, 'jogo');
    assert.equal(mao.vez, 0);
    assert.equal(mao.jogadores[0].mao.length, 5);
  });
  it('início "revela e descarta": as cartas vão para o cemitério; empate vai para o sorteio', () => {
    const mao = novaMao({ semente: 4, inicio: 'revela-descarta', jogadores: JOGADORES });
    mao.jogadores[0].mao[0] = { id: 'K1', valor: 'K', naipe: 'E' };
    mao.jogadores[1].mao[0] = { id: 'K2', valor: 'K', naipe: 'E' };
    aplicarJogada(mao, { tipo: 'inicio', jogador: 0, carta: 'K1' });
    aplicarJogada(mao, { tipo: 'inicio', jogador: 1, carta: 'K2' });
    assert.equal(mao.cemiterio.length, 2);
    assert.equal(mao.jogadores[0].mao.length, 4);
    assert.ok(mao.eventos.some((e) => e.tipo === 'inicio' && e.empate));
  });
  it('ativar: revela, liga à rede e passa a vez', () => {
    const mao = maoNova(), j = mao.vez;
    const alvo = alvosDeAtivacao(mao, j)[0];
    aplicarJogada(mao, { tipo: 'ativar', jogador: j, neuronio: alvo.id });
    assert.ok(alvo.revelado && alvo.dono === j);
    assert.equal(mao.vez, 1 - j);
    assert.equal(mao.jogadores[j].estatisticas.ativacoes, 1);
  });
  it('ativar na camada de saída conclui a rede', () => {
    const mao = maoNova();
    for (let i = 0; i < 14 && mao.fase === 'jogo'; i++) ativarQualquer(mao);
    assert.ok(mao.jogadores.some((j) => j.situacao === 'concluida'));
    assert.ok(mao.eventos.some((e) => e.tipo === 'completa'));
  });
  it('tunagem, overfit, early stop e stack overflow', () => {
    for (const tipo of ['tunagem', 'overfit', 'earlystop', 'stackoverflow']) {
      const { mao, jogada } = procurarSituacao((m, x) => x.tipo === 'empilhar' && efeitoDoEmpilhamento(m, x.jogador, m.neuronios[x.neuronio], x.cartas.length).tipo === tipo, { sementes: 3000 });
      const dono = mao.neuronios[jogada.neuronio].dono;
      aplicarJogada(mao, jogada);
      assert.ok(mao.eventos.some((e) => e.tipo === tipo), tipo);
      if (tipo === 'earlystop') assert.equal(mao.jogadores[dono].situacao, 'earlystop');
      if (tipo === 'stackoverflow') assert.deepEqual(mao.jogadores[dono].mao, []);
    }
  });
  it('dropout: desvira, paga com cartas e não gasta o turno', () => {
    const mao = maoNova();
    for (let i = 0; i < 4; i++) ativarQualquer(mao);
    const j = mao.vez, pagamento = [mao.jogadores[j].mao[0].id];
    aplicarJogada(mao, { tipo: 'dropout', jogador: j, n: 1, pagamento });
    assert.equal(mao.vez, j);
    assert.equal(mao.jogadores[j].dropouts, 1);
    assert.throws(() => aplicarJogada(mao, { tipo: 'dropout', jogador: j, n: 3, pagamento: [] }), /Dropout inválido/);
  });
  it('transfer learning: troca quatro iguais por cartas do limbo', () => {
    const mao = maoNova(), j = mao.vez;
    darCartas(mao, j, ['9', '9', '9', '9', '2']);
    const ids = mao.jogadores[j].mao.slice(0, 4).map((c) => c.id);
    aplicarJogada(mao, { tipo: 'transfer', jogador: j, cartas: ids });
    assert.ok(mao.jogadores[j].transferUsado);
    assert.equal(mao.jogadores[j].mao.length, 5);
    assert.equal(mao.limbo.length, 6);
    assert.throws(() => aplicarJogada(mao, { tipo: 'transfer', jogador: mao.vez, cartas: [] }), /indisponível/);
  });
  it('Power BI troca a mão depois de uma ação', () => {
    const mao = maoNova({ baralho: 'powerbi' }), j = mao.vez;
    darCartas(mao, j, ['5', '5', '5', '5', '3']);
    aplicarJogada(mao, { tipo: 'transfer', jogador: j, cartas: mao.jogadores[j].mao.slice(0, 4).map((c) => c.id) });
    assert.ok(mao.eventos.some((e) => e.tipo === 'powerbi'));
    assert.ok(mao.jogadores[j].mao.every((c) => c.id.includes('~')));
  });
  it('passar: só sem neurônio livre; dois passes seguidos encerram a mão', () => {
    const mao = maoNova();
    assert.throws(() => aplicarJogada(mao, { tipo: 'passar', jogador: mao.vez }), /Só passa/);
    mao.camadas[0].forEach((n) => { n.dono = 9; });
    aplicarJogada(mao, { tipo: 'passar', jogador: mao.vez });
    aplicarJogada(mao, { tipo: 'passar', jogador: mao.vez });
    assert.equal(mao.fase, 'fim');
    assert.ok(mao.resultado.travados.every(Boolean));
  });
  it('erros: fora da vez, mão não iniciada, jogada desconhecida, carta fora da mão', () => {
    const mao = maoNova();
    assert.throws(() => aplicarJogada(mao, { tipo: 'ativar', jogador: 1 - mao.vez, neuronio: 'C0N0' }), /Não é a vez/);
    assert.throws(() => aplicarJogada(mao, { tipo: 'voar', jogador: mao.vez }), /desconhecida/);
    assert.throws(() => aplicarJogada(mao, { tipo: 'ativar', jogador: mao.vez, neuronio: 'C3N0' }), /indisponível/);
    const parada = novaMao({ semente: 1, jogadores: JOGADORES });
    assert.throws(() => aplicarJogada(parada, { tipo: 'ativar', jogador: 0, neuronio: 'C0N0' }), /não está em andamento/);
    const { mao: m2, jogada } = procurarSituacao((m, x) => x.tipo === 'dropout');
    assert.throws(() => aplicarJogada(m2, { ...jogada, pagamento: ['nao-existe'] }), /fora da mão/);
  });
  it('rede travada antes da saída pode ser finalizada por early stop no próprio neurônio', () => {
    const { mao, jogada } = procurarSituacao((m, x) => x.tipo === 'empilhar' && m.neuronios[x.neuronio].dono === x.jogador && m.neuronios[x.neuronio].cartas.length + x.cartas.length === 3, { sementes: 3000 });
    aplicarJogada(mao, jogada);
    assert.equal(mao.jogadores[jogada.jogador].estatisticas.autoParadas, 1);
  });
});

describe('fim da mão e desempates', () => {
  it('mão jogada até o fim tem vencedor, somas e motivo', () => {
    const mao = maoAteOFim();
    assert.equal(mao.fase, 'fim');
    assert.ok([0, 1].includes(mao.resultado.vencedor));
    assert.equal(mao.resultado.somas.length, 2);
    assert.ok(mao.resultado.motivo);
  });
  /** Força uma mão empatada na soma e encerra com dois passes. */
  function empatada(ajuste) {
    const mao = maoNova();
    ajuste(mao);
    mao.camadas[0].forEach((n) => { n.dono = 9; });
    aplicarJogada(mao, { tipo: 'passar', jogador: mao.vez });
    aplicarJogada(mao, { tipo: 'passar', jogador: mao.vez });
    return mao.resultado;
  }
  it('1º desempate: menos dropouts', () => {
    const r = empatada((m) => { m.jogadores[0].dropouts = 2; });
    assert.equal(r.vencedor, 1);
    assert.match(r.motivo, /dropouts/);
  });
  it('2º: quem ficou sem cartas perde', () => {
    const r = empatada((m) => { m.jogadores[1].mao = []; });
    assert.equal(r.vencedor, 0);
    assert.match(r.motivo, /sem cartas/);
  });
  it('3º: soma das melhores cartas da mão', () => {
    const r = empatada((m) => { darCartas(m, 0, ['2', '3']); darCartas(m, 1, ['9', '8', '7']); });
    assert.equal(r.vencedor, 1);
    assert.match(r.motivo, /melhores cartas/);
  });
  it('4º: carta mais alta; 5º: quem jogou primeiro', () => {
    const r1 = empatada((m) => { m.jogadores[0].mao = [{ id: 'a', valor: '5', naipe: 'E' }]; m.jogadores[1].mao = [{ id: 'b', valor: '5', naipe: 'O' }]; });
    assert.equal(r1.vencedor, 0);
    assert.match(r1.motivo, /carta mais alta/);
    const r2 = empatada((m) => { m.jogadores[0].mao = [{ id: 'a', valor: '5', naipe: 'E' }]; m.jogadores[1].mao = [{ id: 'b', valor: '5', naipe: 'E' }]; });
    assert.match(r2.motivo, /primeiro/);
  });
});
