/**
 * @file Terrenos (seção "Extensões" da especificação). O efeito de cada um é aplicado em
 * `pontuacao.js`; aqui ficam só nome e descrição.
 */
export const TERRENOS = {
  neutro: { nome: 'Mesa neutra', resumo: 'Sem efeito. Feltro verde, café e truco.' },
  montanha: { nome: 'Montanha', resumo: 'A trilha sobe: cada neurônio vale 1 ponto a menos por camada alcançada.' },
  pantano: { nome: 'Pântano', resumo: 'Neurônios sem tunagem afundam e perdem 1 ponto por rodada até a rede ser finalizada.' },
  oceano: { nome: 'Oceano', resumo: 'A cada rodada o vento escolhe um naipe, que pontua em dobro.' },
};
