/**
 * @file Textos de ambientação das cartas e falas dos oponentes.
 */

/** Frase em itálico na caixa de texto de cada carta (por valor, ou pelo nome da manilha). */
export const AMBIENTACAO = {
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

/** Falas dos oponentes por situação. */
export const PROVOCACOES = {
  truco: ['TRUCO, marreco!', 'Vem pro gradiente, vem!', 'Truco! Minha loss tá lá embaixo.', 'Truco! Já simulei esse final.'],
  aceitar: ['Desce!', 'Cai dentro, que eu converjo.', 'Aceito. Tá com medo do backprop?'],
  correr: ['Corro. Volto com mais dados.', 'Essa eu deixo passar. Early stop estratégico.', 'Corri, mas foi regularização.'],
  aumentar: ['Pois eu peço SEIS!', 'Vai mais alto que meu learning rate!'],
  overfit: ['Decorou o dataset, foi?', 'Overfit! Generaliza isso aí.'],
  earlystop: ['Parou de aprender, campeão.', 'Validação diz: chega por hoje.'],
  stackoverflow: ['Segmentation fault na tua mão!', 'Estourou a pilha, perdeu as cartas!'],
  sofreuOverfit: ['Ei! Eu ia generalizar...', 'Meu neurônio favorito...'],
  sofreuParada: ['Nãããão, minha época!', 'Tá bom, congelo os pesos.'],
  vanishing: ['O gradiente sumiu mais rápido que café na copa.'],
  venceu: ['Convergi.', 'Loss zero, tentos no bolso.', 'GG, ótimo dataset.'],
  perdeu: ['Bom jogo. Vou retreinar.', 'Overfitei na mão errada.', 'Próxima época é minha.'],
};

/** Sorteia uma fala da situação. */
export function provocar(situacao) {
  const lista = PROVOCACOES[situacao] || [''];
  return lista[Math.floor(Math.random() * lista.length)];
}
