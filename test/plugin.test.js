import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { load } from 'cheerio';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import remarkMkdocs from 'remark-mkdocs-material-admonitions';


const reference = new URL('../examples/starlight/src/content/docs/demo.md', import.meta.url);
const initialRendering = new URL('./fixtures/demo.initial.html', import.meta.url);

async function render(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMkdocs)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}

test('the original Starlight document retains the same bytes and initial HTML', async () => {
  const source = await readFile(reference);
  assert.equal(
    createHash('sha256').update(source).digest('hex'),
    '31285e71105d6b4cdb2229ed695009fd71c849b19ba768f714ccb647e7777de4',
  );
  assert.equal(await render(source), await readFile(initialRendering, 'utf8'));
});

test('unindented continuations and consecutive admonitions end the preceding block', async () => {
  const $ = load(await render([
    '!!! note',
    '    Inside the note.',
    'Outside the note.',
    '',
    '!!! warning',
    '    Inside the warning.',
    '!!! tip',
    '    Inside the tip.',
  ].join('\n')));

  assert.deepEqual($('body').children().map((_, node) => node.attribs.class ?? node.name).get(), [
    'mkdocs-admonition mkdocs-note',
    'p',
    'mkdocs-admonition mkdocs-warning',
    'mkdocs-admonition mkdocs-tip',
  ]);
  assert.equal($('body > p').text(), 'Outside the note.');
});

test('declarations remain literal inside backtick and tilde code fences', async () => {
  const $ = load(await render([
    '~~~~markdown',
    '!!! danger',
    '    Literal content',
    '~~~~',
    '',
    '!!! example',
    '    ```markdown',
    '    ??? note',
    '        More literal content',
    '    ```',
  ].join('\n')));

  assert.equal($('.mkdocs-admonition').length, 1);
  assert.match($('body > pre').text(), /!!! danger/);
  assert.match($('.mkdocs-example pre').text(), /\?\?\? note/);
});

test('supports tab indentation, CRLF and case-insensitive aliases', async () => {
  const $ = load(await render('???+ CAUTION\r\n\tWatch out.'));
  assert.equal($('details[open] > summary span:last-child').text(), 'Attention');
  assert.equal($('details.mkdocs-warning > p').text(), 'Watch out.');
});

test('unknown types stay literal and titles are escaped as text', async () => {
  const $ = load(await render([
    '!!! constructor',
    '    Keep this literal.',
    '',
    '!!! note "<em>& title</em>"',
    '    Body.',
  ].join('\n')));

  assert.equal($('.mkdocs-admonition').length, 1);
  assert.match($('body').text(), /!!! constructor/);
  assert.equal($('.mkdocs-title span:last-child').text(), '<em>& title</em>');
  assert.equal($('.mkdocs-title em').length, 0);
});

test('configured Markdown extensions apply inside admonitions', async () => {
  const $ = load(await render('!!! note\n    Here is ~~struck text~~.'));
  assert.equal($('.mkdocs-note del').text(), 'struck text');
});

/*
 * UTILITAIRE DE MAINTENANCE — RÉGÉNÉRATION DU SNAPSHOT HTML
 *
 * À utiliser uniquement lorsque le fichier de démonstration demo.md
 * ou le rendu HTML du plugin a été volontairement modifié.
 *
 * Procédure :
 * 1. Décommenter le test ci-dessous.
 * 2. Ajouter writeFile à l'import de node:fs/promises.
 * 3. Exécuter :
 *    node --test --test-name-pattern="regenerate HTML snapshot" test/plugin.test.js
 * 4. Vérifier le contenu du fichier demo.initial.html généré.
 * 5. Actualiser le SHA-256 de demo.md dans le test de référence si nécessaire.
 * 6. Commenter à nouveau ce bloc et retirer l'import writeFile.
 * 7. Exécuter npm test pour vérifier les tests de non-régression.
 *
 * ATTENTION : ne jamais laisser ce test actif en fonctionnement normal.
 * Il écrase le snapshot de référence et peut masquer une régression.
 *
test('regenerate HTML snapshot', async () => {
  const source = await readFile(reference, 'utf8');
  const html = await render(source);
  await writeFile(initialRendering, html, 'utf8');
});
*/
