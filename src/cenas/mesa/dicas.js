/**
 * @file Parte da CenaMesa: o modo "dicas".
 *
 * Com as dicas ligadas, o jogador recebe:
 * - uma **sugestão de jogada** a cada vez (calculada pela mesma busca gulosa do Gradiente Guloso),
 *   marcada com uma estrela no neurônio e nas cartas da mão e escrita na dica do turno;
 * - **dicas flutuantes** no estilo do Grimório nos botões de ação (Dropout, Transfer, Passar e
 *   TRUCO): ao passar o mouse ou, no celular, ao segurar o botão. Elas explicam a ação, o conceito
 *   de ML por trás e o que vale fazer agora (no truco, a chance estimada de vencer a mão);
 * - a chance de vitória também na caixa de resposta ao truco.
 *
 * Em troca, a mão jogada com dicas (ligadas em algum momento) não vale conquistas nem conta nas
 * estatísticas. O aviso aparece ao ligar.
 */
import { rotuloCarta } from '../../nucleo/cartas.js';
import { nomeCamada } from '../../nucleo/rede.js';
import {
  camadasDesfaziveis, valorParaTransfer, podePassar, alvosDeAtivacao, efeitoDoEmpilhamento, NOME_EFEITO,
} from '../../nucleo/partida.js';
import { podeTrucar, proximoValor, GRITO_TRUCO, ehMaoDeOnze } from '../../nucleo/truco.js';
import { jogadaGulosa } from '../../nucleo/oponentes/estrategias.js';
import { chanceDeVitoria } from '../../nucleo/oponentes/index.js';
import { VERBETES } from '../../conteudo/grimorio.js';
import { confirmar, mostrarAviso, mostrarDicaFlutuante, esconderDicaFlutuante, escaparHtml } from '../../interface/paineis.js';
import { retanguloNaTela } from '../recursos.js';
import { colunaX, linhaY } from './layout.js';

/** Simulações usadas para estimar a chance de vitória mostrada nas dicas. */
const SIMULACOES_DA_DICA = 40;

/** Primeira frase do conceito de um verbete (para a linha "conceito" das dicas). */
function conceitoCurto(id) {
  const verbete = VERBETES.find((v) => v.id === id);
  return verbete ? verbete.conceito.split(/(?<=\.)\s/)[0] : '';
}

export const metodosDeDicas = {
  /** Botão "Ativar dicas": avisa sobre as conquistas antes de ligar; desliga direto. */
  alternarDicas() {
    if (this.app.dicasLigadas) {
      this.app.dicasLigadas = false;
      this.sugestao = null;
      esconderDicaFlutuante();
      this.atualizarChaves();
      if (this.mao) this.redesenhar();
      return;
    }
    confirmar('Ativar dicas?',
      'Com as dicas ligadas você vê uma <b>sugestão de jogada</b> a cada vez e explicações nos botões de ação ' +
      '(passe o mouse ou, no celular, segure o botão apertado).<br><br>' +
      '<b>Atenção:</b> as mãos jogadas com dicas <b>não valem conquistas</b> nem contam nas estatísticas. ' +
      'A mão atual já fica marcada, mesmo que você desligue as dicas depois.',
      [
        { rotulo: 'Agora não', classe: 'discreto' },
        { rotulo: 'Ativar dicas', classe: 'vinho', acao: () => {
          this.app.dicasLigadas = true;
          this.dicasNaMao = true;
          this.atualizarChaves();
          this.calcularSugestao();
          if (this.mao) this.redesenhar();
          mostrarAviso('Dicas ligadas', 'Esta mão não vale conquistas. Segure um botão de ação (ou passe o mouse) para ver a dica dele.', null, 4500);
        } },
      ]);
  },

  /* ------------------------------------------------------------------ sugestão de jogada */

  /** Calcula a sugestão para o humano da vez (guardada em `this.sugestao`). */
  calcularSugestao() {
    this.sugestao = null;
    if (!this.app.dicasLigadas || !this.mao || !this.ehVezDoHumano()) return;
    try {
      const jogada = jogadaGulosa(this.mao, this.quemVe);
      if (jogada.tipo === 'dropout' && jogada.n > 1) jogada.n = 1; /* sugere o dropout mais barato */
      this.sugestao = jogada;
    } catch (e) { this.sugestao = null; }
  },

  /** Frase da sugestão para a dica do turno. */
  textoDaSugestao() {
    const s = this.sugestao, mao = this.mao;
    if (!s || !this.app.dicasLigadas || !this.ehVezDoHumano()) return '';
    const n = s.neuronio ? mao.neuronios[s.neuronio] : null;
    if (s.tipo === 'ativar') {
      return 'ative o neurônio marcado com ★ na camada ' + nomeCamada(n.camada) + (n.conhecido ? ' (é um ' + rotuloCarta(n.cartas[0]) + ')' : '') + '.';
    }
    if (s.tipo === 'empilhar') {
      const efeito = efeitoDoEmpilhamento(mao, this.quemVe, n, s.cartas.length);
      const cartas = s.cartas.map((id) => rotuloCarta(mao.jogadores[this.quemVe].mao.find((c) => c.id === id))).join(' ');
      return NOME_EFEITO[efeito.tipo] + ': coloque ' + cartas + ' sobre ' + rotuloCarta(n.cartas[0]) + (efeito.proprio ? ' da sua rede.' : ' do adversário.');
    }
    if (s.tipo === 'dropout') return 'faça dropout de 1 camada: a rede está num caminho fraco.';
    if (s.tipo === 'transfer') return 'faça transfer learning e renove a mão.';
    if (s.tipo === 'passar') return 'passe a vez.';
    return '';
  },

  /** Estrela pulsante no neurônio e nas cartas sugeridas (desenhada a cada quadro). */
  desenharSugestao(g, tempo) {
    const s = this.sugestao;
    if (!s || !this.app.dicasLigadas || !this.ehVezDoHumano()) return;
    const brilho = 0.6 + 0.4 * Math.sin(tempo / 200);
    const estrela = (x, y, r) => {
      const pontos = [];
      for (let i = 0; i < 10; i++) {
        const ang = -Math.PI / 2 + (i * Math.PI) / 5, raio = i % 2 ? r * 0.45 : r;
        pontos.push({ x: x + Math.cos(ang) * raio, y: y + Math.sin(ang) * raio });
      }
      g.fillStyle(0xfff1a8, brilho); g.fillPoints(pontos, true);
      g.lineStyle(1.5, 0x5a3a08, 1); g.strokePoints(pontos, true);
    };
    if (s.neuronio) {
      const n = this.mao.neuronios[s.neuronio];
      const x = colunaX(n.camada), y = linhaY(n.camada, n.posicao);
      g.lineStyle(3, 0xfff1a8, brilho); g.strokeRoundedRect(x - 39, y - 51, 78, 103, 10);
      estrela(x + 30, y - 42, 11);
    }
    for (const imagem of this.cartasDaMao) {
      if (s.cartas && s.cartas.includes(imagem.idCarta) && s.tipo !== 'transfer') estrela(imagem.x + 40, imagem.y - 60, 10);
    }
  },

  /* ------------------------------------------------------------------ dicas flutuantes */

  /** Mostra a dica do botão `chave` ao lado do retângulo (x, y, l, a) do mundo do jogo. */
  mostrarDicaDoBotao(chave, x, y, l, a) {
    if (!this.mao) return;
    const { titulo, corpo, agora, conceito } = this.conteudoDaDica(chave);
    const html = escaparHtml(corpo) +
      (agora ? '<span class="agora">' + escaparHtml(agora) + '</span>' : '') +
      (conceito ? '<span class="conceito">' + escaparHtml(conceito) + '</span>' : '');
    mostrarDicaFlutuante(titulo, html, retanguloNaTela(this, x, y, l, a));
  },

  /** Esconde a dica flutuante. */
  esconderDicaDoBotao() { esconderDicaFlutuante(); },

  /**
   * Texto da dica de cada botão: o que faz, o que vale fazer agora e o conceito de ML.
   * @param {'dropout'|'transfer'|'passar'|'truco'} chave
   */
  conteudoDaDica(chave) {
    const mao = this.mao, eu = this.quemVe >= 0 ? this.quemVe : 0, jogador = mao.jogadores[eu];
    const minhaVez = this.ehVezDoHumano();
    const naoEhAVez = 'Agora: espere a sua vez.';
    if (chave === 'dropout') {
      const n = camadasDesfaziveis(mao, eu);
      return {
        titulo: 'Grimório · Dropout (GatoNet)',
        corpo: 'Desvira os últimos neurônios ocultos da sua rede, até a camada que você escolher. Custa 1 carta da mão por camada e não gasta o turno.',
        agora: !minhaVez ? naoEhAVez : n === 0 ? 'Agora: indisponível, não há neurônio oculto para desfazer.'
          : 'Agora: dá para desfazer até ' + Math.min(n, jogador.mao.length) + ' camada(s). Vale a pena quando a rede pegou neurônios fracos ou está perto de formar uma quadra de figuras.',
        conceito: conceitoCurto('dropout'),
      };
    }
    if (chave === 'transfer') {
      const valor = valorParaTransfer(mao, eu);
      const conta = {};
      for (const c of jogador.mao) conta[c.valor] = (conta[c.valor] || 0) + 1;
      const maior = Object.entries(conta).sort((a, b) => b[1] - a[1])[0];
      return {
        titulo: 'Grimório · Transfer learning',
        corpo: 'Troca quatro cartas de mesmo valor da mão por cartas do limbo. Uma vez por mão; gasta o turno.',
        agora: jogador.transferUsado ? 'Agora: você já usou o transfer nesta mão.'
          : valor ? 'Agora: você tem quatro ' + valor + '. Troque se eles não servem para tunar nem atacar.'
            : 'Agora: precisa de quatro cartas iguais; seu maior grupo é ' + (maior ? maior[1] + '× ' + maior[0] : 'nenhum') + '.',
        conceito: conceitoCurto('transfer'),
      };
    }
    if (chave === 'passar') {
      const livres = alvosDeAtivacao(mao, eu).length;
      return {
        titulo: 'Passar a vez',
        corpo: 'Só é permitido quando não há neurônio livre para ativar: sua rede chegou ao fim ou ficou travada. Se todos passarem em sequência, a mão termina.',
        agora: !minhaVez ? naoEhAVez : podePassar(mao, eu) ? 'Agora: pode passar. Antes, veja se algum ataque com as cartas da mão ainda vale a pena.'
          : 'Agora: ainda há ' + livres + ' neurônio(s) livre(s) para ativar, então não dá para passar.',
        conceito: conceitoCurto('camadas'),
      };
    }
    /* truco */
    const partida = this.partida, proximo = proximoValor(partida.valor);
    let agora;
    if (partida.alvo <= 1) agora = 'Agora: partida de mão única, sem truco.';
    else if (ehMaoDeOnze(partida)) agora = 'Agora: mão de onze, ninguém pode trucar.';
    else if (!minhaVez || !podeTrucar(partida, eu)) agora = 'Agora: indisponível (não é sua vez ou você foi o último a aumentar).';
    else {
      const chance = Math.round(chanceDeVitoria(mao, eu, SIMULACOES_DA_DICA) * 100);
      agora = 'Agora: sua chance estimada de vencer esta mão é ' + chance + '% (' + SIMULACOES_DA_DICA + ' simulações de Monte Carlo). ' +
        (chance >= 65 ? 'Bom momento para pedir ' + GRITO_TRUCO[proximo] : chance >= 40 ? 'Arriscado: só como blefe.' : 'Melhor não trucar agora.');
    }
    return {
      titulo: 'Grimório · Truco',
      corpo: 'Aumenta o valor da mão: 1 → 3 → 6 → 9 → 12 tentos. Quem recebe o pedido aceita, corre (e entrega o valor atual) ou pede mais.',
      agora,
      conceito: conceitoCurto('truco'),
    };
  },

  /** Linha com a chance estimada, para a caixa de resposta ao truco (só com dicas ligadas). */
  dicaDaRespostaAoTruco(quem) {
    if (!this.app.dicasLigadas || this.mao.jogadores[quem].tipo !== 'humano') return '';
    const chance = Math.round(chanceDeVitoria(this.mao, quem, SIMULACOES_DA_DICA) * 100);
    const conselho = chance >= 70 ? 'dá para aceitar e até pedir mais.' : chance >= 35 ? 'aceitar é razoável.' : 'correr limita o prejuízo.';
    return '<br><br><b>Dica:</b> sua chance estimada de vencer esta mão é ' + chance + '% (' + SIMULACOES_DA_DICA + ' simulações); ' + conselho;
  },
};
