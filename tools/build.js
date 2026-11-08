/* Gera dist/truco-de-turing.html: um único arquivo com CSS e JS embutidos (Phaser via CDN).
 * Também gera dist/artifact.html sem <html>/<head>/<body>, para publicação como artifact. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function inline(html) {
  return html
    .replace(/<link rel="stylesheet" href="(src\/[^"]+)">/g, (_, f) => `<style>\n${fs.readFileSync(path.join(root, f), 'utf8')}\n</style>`)
    .replace(/<script src="(src\/[^"]+)"><\/script>/g, (_, f) => `<script>\n${fs.readFileSync(path.join(root, f), 'utf8').replace(/<\/script/g, '<\\/script')}\n</script>`);
}
const full = inline(src);
const head = full.split('<!-- build:head -->')[1].split('<!-- /build:head -->')[0];
const body = full.split('<!-- build:body -->')[1].split('<!-- /build:body -->')[0];
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'truco-de-turing.html'), full);
fs.writeFileSync(
  path.join(root, 'dist', 'artifact.html'),
  head.replace('<title>', '<meta name="claude:viewport-fit-sides" content="cover">\n<title>') + body,
);
console.log('dist/truco-de-turing.html', (full.length / 1024).toFixed(0) + ' KB');
