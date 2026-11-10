/**
 * @file Testes das ferramentas de linha de comando: versionar, empacotar, documentar e simular.
 * As que gravam arquivos rodam sobre uma cópia do projeto (variável TRUCO_RAIZ).
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tipoDeMudanca, proximaVersao, dataEmBrasilia } from '../../ferramentas/versionar.js';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
let copia;

/** Roda uma ferramenta do projeto sobre a cópia e devolve a saída. */
function rodar(ferramenta, args = [], env = {}) {
  return execFileSync(process.execPath, [join(raiz, 'ferramentas', ferramenta), ...args], {
    env: { ...process.env, TRUCO_RAIZ: copia, ...env }, encoding: 'utf8',
  });
}
const ler = (arquivo) => readFileSync(join(copia, arquivo), 'utf8');

before(() => {
  copia = mkdtempSync(join(tmpdir(), 'truco-'));
  for (const item of ['src', 'ferramentas', 'index.html', 'package.json', 'package-lock.json', 'README.md']) {
    if (existsSync(join(raiz, item))) cpSync(join(raiz, item), join(copia, item), { recursive: true });
  }
});
after(() => rmSync(copia, { recursive: true, force: true }));

describe('versionar.js', () => {
  it('tipoDeMudanca: rótulos e título decidem maior, menor ou correção', () => {
    assert.equal(tipoDeMudanca('feat: modo torneio'), 'menor');
    assert.equal(tipoDeMudanca('Nova tela de ranking'), 'menor');
    assert.equal(tipoDeMudanca('Corrige o truco'), 'correcao');
    assert.equal(tipoDeMudanca('qualquer', ['versao:maior']), 'maior');
    assert.equal(tipoDeMudanca('qualquer', [' Versao:Menor ']), 'menor');
    assert.equal(tipoDeMudanca('feat!: muda as regras'), 'maior');
    assert.equal(tipoDeMudanca('Muda tudo BREAKING'), 'maior');
    assert.equal(tipoDeMudanca(), 'correcao');
  });
  it('proximaVersao', () => {
    assert.equal(proximaVersao('1.4.2', 'maior'), '2.0.0');
    assert.equal(proximaVersao('1.4.2', 'menor'), '1.5.0');
    assert.equal(proximaVersao('1.4.2', 'correcao'), '1.4.3');
  });
  it('dataEmBrasilia: o dia no horário de Brasília, não em UTC', () => {
    /* 01:21 UTC do dia 10 ainda é 22:21 do dia 9 em Brasília */
    assert.equal(dataEmBrasilia(new Date('2026-11-10T01:21:00Z')), '2026-11-09');
    assert.equal(dataEmBrasilia(new Date('2026-11-10T03:30:00Z')), '2026-11-10');
    assert.match(dataEmBrasilia(), /^\d{4}-\d{2}-\d{2}$/);
  });
  it('--simular só mostra a próxima versão', () => {
    const antes = ler('package.json');
    const saida = rodar('versionar.js', ['--simular', '--tipo', 'auto'], { TITULO: 'feat: algo' });
    assert.match(saida, /Próxima versão: \d+\.\d+\.0 \(menor\)/);
    assert.equal(ler('package.json'), antes);
  });
  it('sobe a versão em package.json, package-lock, src/versao.js, README e CHANGELOG', () => {
    const atual = JSON.parse(ler('package.json')).version;
    const nova = proximaVersao(atual, 'menor');
    const saida = rodar('versionar.js', ['--tipo', 'menor', '--titulo', 'Tela nova', '--pr', '7'], { DATA_DA_VERSAO: '2030-01-02', GITHUB_REPOSITORY: 'dono/repo' });
    assert.equal(saida.trim().split('\n').pop(), nova);
    assert.equal(JSON.parse(ler('package.json')).version, nova);
    assert.equal(JSON.parse(ler('package-lock.json')).version, nova);
    assert.match(ler('src/versao.js'), new RegExp("VERSAO = '" + nova.replace(/\./g, '\\.') + "'"));
    assert.match(ler('README.md'), new RegExp('\\*\\*Versão ' + nova.replace(/\./g, '\\.') + '\\*\\* \\(2030-01-02\\)'));
    assert.match(ler('CHANGELOG.md'), /## .* — 2030-01-02\n\n- Tela nova \(\[#7\]\(https:\/\/github.com\/dono\/repo\/pull\/7\)\)/);
  });
  it('--atual publica a versão sem subir e não duplica a entrada do histórico', () => {
    const atual = JSON.parse(ler('package.json')).version;
    const saida = rodar('versionar.js', ['--atual', '--titulo', 'Repetida'], { DATA_DA_VERSAO: '2030-01-02' });
    assert.equal(saida.trim(), atual);
    assert.equal(ler('CHANGELOG.md').split('## ' + atual + ' ').length, 2);
  });
  it('sem PR nem título: correção, com "Atualização" no histórico', () => {
    const atual = JSON.parse(ler('package.json')).version;
    rodar('versionar.js', ['--titulo'], { DATA_DA_VERSAO: '2030-01-03', TITULO: '', GITHUB_REPOSITORY: '' });
    assert.equal(JSON.parse(ler('package.json')).version, proximaVersao(atual, 'correcao'));
    assert.match(ler('CHANGELOG.md'), /- Atualização\n/);
  });
});

describe('empacotar.js', () => {
  it('gera o HTML completo e a versão para artifact, com CSS e JS embutidos', () => {
    rodar('empacotar.js');
    const pagina = ler('dist/truco-de-turing.html'), artifact = ler('dist/artifact.html');
    assert.match(pagina, /<style>[\s\S]*#girar/);
    assert.ok(!pagina.includes('<script type="module"'));
    assert.ok(!artifact.includes('<html'));
    assert.match(artifact, /claude:viewport-fit-sides/);
  });
});

describe('documentar.js', () => {
  it('gera a referência com os módulos e as funções documentadas', () => {
    rodar('documentar.js');
    const ref = ler('docs/REFERENCIA.md');
    assert.match(ref, /## `src\/nucleo\/partida.js`/);
    assert.match(ref, /`aplicarJogada\(mao, jogada\)` \| função \(exportada\)/);
    assert.match(ref, /`atualizarPilha\(pilha, nome, quantidade, texturaDoTopo\)` \| método/);
  });
});

describe('simular.js', () => {
  it('roda mãos entre dois oponentes e mostra o placar', () => {
    const saida = execFileSync(process.execPath, [join(raiz, 'ferramentas/simular.js'), '6', 'guloso', 'aleatorio', 'truco', 'oceano'], { encoding: 'utf8' });
    assert.match(saida, /guloso/i);
    assert.match(saida, /\d+%|\d+ vit/i);
  });
});
