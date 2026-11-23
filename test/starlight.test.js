import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { load } from 'cheerio';

const dist = new URL('../examples/starlight/dist/', import.meta.url);
const html = await readFile(new URL('demo/index.html', dist), 'utf8');
const $ = load(html);

const canonicalTypes = [
  'note', 'abstract', 'info', 'tip', 'success', 'question', 'warning',
  'failure', 'danger', 'bug', 'example', 'quote',
];
const aliases = [
  'abstract', 'abstract', 'tip', 'tip', 'success', 'success', 'question',
  'question', 'warning', 'warning', 'failure', 'failure', 'danger', 'quote',
];

test('production page renders every valid declaration with the correct type', () => {
  const blocks = $('.mkdocs-admonition');
  assert.equal(blocks.length, 40);
  assert.deepEqual(
    blocks.slice(0, 26).map((_, node) => $(node).attr('data-mkdocs-type')).get(),
    [...canonicalTypes, ...aliases],
  );
  assert.equal($('h1').first().text(), 'Tes mkdocs');
  assert.equal($('[data-mkdocs-title=""] > .mkdocs-title span:last-child').text(), '');
  assert.equal($('[data-mkdocs-title="Note"] > .mkdocs-title span:last-child').text(), 'Note');
  assert.ok($('p').toArray().some((p) =>
    $(p).text().startsWith('!!! warnin,g ') &&
    $(p).text().includes('Type incorrect') &&
    !$(p).closest('.mkdocs-admonition').length,
  ));
});

test('production page preserves rich content, block boundaries and nesting', () => {
  const rich = $('[data-mkdocs-title="Texte enrichi"]');
  assert.equal(rich.find('strong').text(), 'gras');
  assert.equal(rich.find('em').text(), 'italique');
  assert.equal(rich.find('code').text(), 'code inline');
  assert.equal(rich.find('a').attr('href'), 'https://astro.build');
  assert.equal($('[data-mkdocs-title="Plusieurs paragraphes"] > p').length, 4);
  assert.equal($('[data-mkdocs-title="Liste à puces"] li').length, 4);
  assert.equal($('[data-mkdocs-title="Liste numérotée"] li').length, 4);
  const code = $('[data-mkdocs-title="Bloc de code"]');
  assert.match(code.find('.expressive-code pre').text(), /ip addr show/);
  assert.match(code.children('p').last().text(), /après le bloc de code/);
  const parent = $('[data-mkdocs-title="Admonition principale"]');
  assert.equal(parent.children('.mkdocs-warning').length, 1);
  assert.equal(parent.children('p').last().text(), 'Retour au premier niveau.');
  for (const text of [
    'Ce paragraphe ne doit PAS être dans l’encadré.',
    'Ce paragraphe doit également rester à l’extérieur.',
  ]) {
    const paragraph = $('p').filter((_, node) => $(node).text().replaceAll("'", '’') === text);
    assert.equal(paragraph.length, 1);
    assert.equal(paragraph.closest('.mkdocs-admonition').length, 0);
  }
});

test('production page ships styled and native disclosure elements', async () => {
  assert.equal($('details.mkdocs-admonition').length, 2);
  assert.equal($('details[data-mkdocs-title="Cliquez pour afficher"]:not([open]) > summary').length, 1);
  assert.equal($('details[data-mkdocs-title="Attention — ouverte par défaut"][open] > summary').length, 1);

  const assets = new URL('_astro/', dist);
  const styles = (await readdir(assets)).filter((file) => file.endsWith('.css'));
  const css = (await Promise.all(styles.map((file) => readFile(new URL(file, assets), 'utf8')))).join('\n');
  assert.match(css, /\.mkdocs-admonition/);
  assert.match(css, /summary\.mkdocs-title:after|summary\.mkdocs-title::after/);
});
