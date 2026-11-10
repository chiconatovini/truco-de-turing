/**
 * @file Versionamento do jogo (versionamento semântico MAIOR.MENOR.CORREÇÃO).
 *
 * Roda no GitHub Actions a cada merge (ou push) na main — ver .github/workflows/versao.yml — e
 * também à mão. Atualiza, de uma vez:
 * - package.json e package-lock.json (`version`);
 * - src/versao.js (mostrada na tela "Sobre");
 * - README.md (a linha entre os marcadores `<!-- versao -->` e `<!-- /versao -->`);
 * - CHANGELOG.md (uma entrada nova no topo, com o título do pull request).
 *
 * Que parte da versão sobe é decidido pelo pull request (ou pela mensagem do commit, sem PR):
 * - rótulo `versao:maior`, ou título com `!:`/"BREAKING" → MAIOR (2.0.0);
 * - rótulo `versao:menor`, ou título começando com `feat`, `nova` ou `novo` → MENOR (1.1.0);
 * - qualquer outro caso → CORREÇÃO (1.0.1).
 *
 * Uso:
 *   node ferramentas/versionar.js --tipo auto --titulo "feat: dicas" --rotulos "versao:menor" --pr 12
 *   node ferramentas/versionar.js --tipo correcao
 *   node ferramentas/versionar.js --atual            (publica a versão atual sem subir; 1ª versão)
 *   node ferramentas/versionar.js --simular ...      (só mostra a próxima versão, sem gravar)
 * O título e os rótulos também podem vir das variáveis de ambiente TITULO e ROTULOS (mais seguro no CI).
 * A versão final é impressa na última linha da saída.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Pasta do projeto. `TRUCO_RAIZ` permite rodar sobre uma cópia (usado nos testes). */
const raiz = process.env.TRUCO_RAIZ || join(dirname(fileURLToPath(import.meta.url)), '..');
const caminho = (arquivo) => join(raiz, arquivo);

/** Lê os argumentos `--chave valor` (e `--chave` sozinho como verdadeiro). */
function lerArgumentos(lista) {
  const args = {};
  for (let i = 0; i < lista.length; i++) {
    if (!lista[i].startsWith('--')) continue;
    const chave = lista[i].slice(2), proximo = lista[i + 1];
    if (proximo === undefined || proximo.startsWith('--')) args[chave] = true;
    else { args[chave] = proximo; i++; }
  }
  return args;
}

/**
 * Decide que parte da versão sobe.
 * @returns {'maior'|'menor'|'correcao'}
 */
export function tipoDeMudanca(titulo = '', rotulos = []) {
  const r = rotulos.map((x) => x.trim().toLowerCase());
  if (r.includes('versao:maior') || /^[a-z]+(\(.+\))?!:/i.test(titulo) || /BREAKING/.test(titulo)) return 'maior';
  if (r.includes('versao:menor') || /^(feat|nova|novo)\b/i.test(titulo)) return 'menor';
  return 'correcao';
}

/** Soma uma versão: '1.4.2' + 'menor' → '1.5.0'. */
export function proximaVersao(versao, tipo) {
  const [maior, menor, correcao] = versao.split('.').map(Number);
  if (tipo === 'maior') return (maior + 1) + '.0.0';
  if (tipo === 'menor') return maior + '.' + (menor + 1) + '.0';
  return maior + '.' + menor + '.' + (correcao + 1);
}

/** Data de hoje (AAAA-MM-DD) no horário de Brasília. */
export function dataEmBrasilia(agora = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(agora);
}

/** Grava a versão em src/versao.js. */
function gravarModuloDeVersao(versao, data) {
  writeFileSync(caminho('src/versao.js'),
    '/**\n * @file Versão do jogo, mostrada na tela "Sobre".\n *\n' +
    ' * Gerado por ferramentas/versionar.js a cada merge na main (GitHub Actions). Não edite à mão.\n */\n\n' +
    '/** Número da versão (MAIOR.MENOR.CORREÇÃO). */\n' +
    "export const VERSAO = '" + versao + "';\n\n" +
    '/** Data da versão (AAAA-MM-DD). */\n' +
    "export const DATA_DA_VERSAO = '" + data + "';\n");
}

/** Troca a linha de versão do README (entre os marcadores). */
function gravarNoReadme(versao, data) {
  const readme = readFileSync(caminho('README.md'), 'utf8');
  const linha = '<!-- versao -->\n**Versão ' + versao + '** (' + data + ') · [histórico de versões](CHANGELOG.md)\n<!-- /versao -->';
  const novo = /<!-- versao -->[\s\S]*?<!-- \/versao -->/.test(readme)
    ? readme.replace(/<!-- versao -->[\s\S]*?<!-- \/versao -->/, linha)
    : readme.replace(/\n\n/, '\n\n' + linha + '\n\n'); /* primeira vez: logo depois do título */
  writeFileSync(caminho('README.md'), novo);
}

/** Acrescenta a entrada da versão no topo do CHANGELOG.md. */
function gravarNoHistorico(versao, data, titulo, pr, repositorio) {
  const arquivo = caminho('CHANGELOG.md');
  const cabecalho = '# Histórico de versões\n\nCada merge na `main` gera uma versão nova (ver `ferramentas/versionar.js`).\n';
  let atual = existsSync(arquivo) ? readFileSync(arquivo, 'utf8') : cabecalho;
  if (atual.includes('## ' + versao + ' ')) return; /* já registrada */
  const link = pr && repositorio ? ' ([#' + pr + '](https://github.com/' + repositorio + '/pull/' + pr + '))' : pr ? ' (#' + pr + ')' : '';
  const entrada = '\n## ' + versao + ' — ' + data + '\n\n- ' + (titulo || 'Atualização') + link + '\n';
  const corpo = atual.startsWith(cabecalho) ? atual.slice(cabecalho.length) : atual.replace(/^# .*\n+(.*\n)?/, '');
  writeFileSync(arquivo, cabecalho + entrada + corpo);
}

/* ------------------------------------------------------------------ execução pela linha de comando */

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = lerArgumentos(process.argv.slice(2));
  const titulo = (args.titulo !== true && args.titulo) || process.env.TITULO || '';
  const rotulos = ((args.rotulos !== true && args.rotulos) || process.env.ROTULOS || '').split(',').filter(Boolean);
  const pacote = JSON.parse(readFileSync(caminho('package.json'), 'utf8'));
  const tipo = args.tipo && args.tipo !== 'auto' ? args.tipo : tipoDeMudanca(titulo.split('\n')[0], rotulos);
  const versao = args.atual ? pacote.version : proximaVersao(pacote.version, tipo);
  if (args.simular) {
    console.log('Próxima versão: ' + versao + ' (' + (args.atual ? 'atual' : tipo) + ')');
    console.log(versao);
    process.exit(0);
  }
  /* data no horário de Brasília (o CI roda em UTC, o que adiantava o dia depois das 21h) */
  const data = process.env.DATA_DA_VERSAO || dataEmBrasilia();
  pacote.version = versao;
  writeFileSync(caminho('package.json'), JSON.stringify(pacote, null, 2) + '\n');
  if (existsSync(caminho('package-lock.json'))) {
    const trava = JSON.parse(readFileSync(caminho('package-lock.json'), 'utf8'));
    trava.version = versao;
    if (trava.packages && trava.packages['']) trava.packages[''].version = versao;
    writeFileSync(caminho('package-lock.json'), JSON.stringify(trava, null, 2) + '\n');
  }
  gravarModuloDeVersao(versao, data);
  gravarNoReadme(versao, data);
  gravarNoHistorico(versao, data, titulo.split('\n')[0], args.pr !== true ? args.pr : '', process.env.GITHUB_REPOSITORY);
  console.log(versao);
}
