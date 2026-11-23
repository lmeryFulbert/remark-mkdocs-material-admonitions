// Les alias pointent vers un type canonique, utilisé pour le titre,
// l'icône et la classe CSS. Par exemple, « caution » devient « warning ».
const TYPES = {
  note: 'note',
  abstract: 'abstract',
  summary: 'abstract',
  tldr: 'abstract',
  info: 'info',
  tip: 'tip',
  hint: 'tip',
  important: 'tip',
  success: 'success',
  check: 'success',
  done: 'success',
  question: 'question',
  help: 'question',
  faq: 'question',
  warning: 'warning',
  caution: 'warning',
  attention: 'warning',
  failure: 'failure',
  fail: 'failure',
  missing: 'failure',
  danger: 'danger',
  error: 'danger',
  bug: 'bug',
  example: 'example',
  quote: 'quote',
  cite: 'quote',
};

const LABELS = {
  note: 'Note',
  abstract: 'Résumé',
  info: 'Information',
  tip: 'Conseil',
  success: 'Succès',
  question: 'Question',
  warning: 'Attention',
  failure: 'Échec',
  danger: 'Danger',
  bug: 'Anomalie',
  example: 'Exemple',
  quote: 'Citation',
};

const ICONS = {
  note: '✎',
  abstract: '☷',
  info: 'ℹ',
  tip: '✦',
  success: '✓',
  question: '?',
  warning: '⚠',
  failure: '✕',
  danger: '⚡',
  bug: '◆',
  example: '▣',
  quote: '❝',
};

// La ligne entière doit contenir un marqueur, un type et éventuellement
// un titre entre guillemets. Les trois captures suivent cet ordre.
const DECLARATION =
  /^(!!!|\?\?\?\+?)[ \t]+([\w-]+)(?:[ \t]+"([^"]*)")?[ \t]*$/;

function getDeclaration(line) {
  const match = DECLARATION.exec(line);
  if (!match) return null;

  const keyword = match[2].toLowerCase();
  if (!Object.hasOwn(TYPES, keyword)) return null;

  const type = TYPES[keyword];

  return {
    type,
    // ?? conserve "" comme titre explicite et utilise le libellé par défaut
    // uniquement si la capture du titre est absente.
    title: match[3] ?? LABELS[type],
    collapsible: match[1].startsWith('?'),
    opened: match[1] === '???+',
  };
}

// Les lignes du fichier font foi pour l'indentation. L'arbre de Remark
// peut regrouper différemment les paragraphes et les blocs de code.
function readBlock(lines, start) {
  const declaration = getDeclaration(lines[start]);
  if (!declaration) return null;

  const body = [];
  let blanks = 0;
  let end = start;

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '') {
      // Confirmer que ces lignes vides sont internes en attendant la
      // prochaine ligne indentée. Sinon, elles séparent deux blocs.
      blanks++;
      continue;
    }

    const indent = /^(?: {4}|\t)/.exec(line);

    if (!indent) break;

    for (; blanks > 0; blanks--) body.push('');

    // Retirer un seul niveau d'indentation. Les niveaux restants servent
    // aux listes, au code et aux admonitions imbriquées.
    body.push(line.slice(indent[0].length));
    end = i;
  }

  return {
    ...declaration,
    body,
    end,
  };
}

// Remark conserve un nœud Markdown. Lors du passage au HTML,
// remark-rehype applique data.hName et data.hProperties.
function makeHeading(block) {
  return {
    type: 'paragraph',
    data: {
      hName: block.collapsible ? 'summary' : 'div',
      hProperties: {
        className: ['mkdocs-title'],
      },
    },
    children: [
      {
        type: 'text',
        value: ICONS[block.type],
        data: {
          hName: 'span',
          hProperties: {
            className: ['mkdocs-icon'],
            ariaHidden: 'true',
          },
        },
      },
      {
        type: 'text',
        value: block.title,
        data: {
          hName: 'span',
        },
      },
    ],
  };
}

// <details> attend un <summary> en premier enfant. Le navigateur gère
// le repliement et l'attribut open détermine l'état initial.
function makeAdmonition(block, children) {
  return {
    type: 'blockquote',
    children: [
      makeHeading(block),
      ...children,
    ],
    data: {
      hName: block.collapsible ? 'details' : 'div',
      hProperties: {
        className: [
          'mkdocs-admonition',
          `mkdocs-${block.type}`,
        ],
        'data-mkdocs-title': block.title,
        'data-mkdocs-type': block.type,
        ...(block.opened ? { open: true } : {}),
      },
    },
  };
}

// Réutiliser le parseur configuré dans Unified pour conserver ses
// extensions Markdown. Le corps désindenté devient un nouveau fragment
// sur lequel la conversion détecte aussi les admonitions imbriquées.
function parseBody(lines, parser) {
  const tree = parser.parse(lines.join('\n'));
  convertAdmonitions(tree, lines, parser);
  return tree.children;
}

function convertAdmonitions(tree, lines, parser) {
  for (let index = 0; index < tree.children.length; index++) {
    const node = tree.children[index];
    const start = node.position?.start;

    // Chercher une déclaration au début d'un paragraphe de ce fragment.
    // Les blocs de code sont déjà des nœuds distincts et restent intacts.
    if (node.type !== 'paragraph' || start?.column !== 1) continue;

    // Remark numérote les lignes à partir de 1, le tableau à partir de 0.
    const block = readBlock(lines, start.line - 1);
    if (!block) continue;

    // Repérer tous les nœuds qui commencent dans l'encadré. Un même
    // encadré peut couvrir plusieurs nœuds de l'arbre Markdown initial.
    const lastBlockLine = block.end + 1;
    let nextIndex = index + 1;
    while (tree.children[nextIndex]?.position?.start.line <= lastBlockLine) {
      nextIndex++;
    }

    const consumedEnd = tree.children[nextIndex - 1].position.end.line;
    const admonition = makeAdmonition(block, parseBody(block.body, parser));
    const replacement = [admonition];

    // CommonMark peut absorber une ligne non indentée dans le paragraphe
    // précédent. Réanalyser la portion qui dépasse pour la remettre hors
    // de l'encadré, à sa place dans le document.
    if (consumedEnd > lastBlockLine) {
      replacement.push(...parseBody(lines.slice(lastBlockLine, consumedEnd), parser));
    }

    tree.children.splice(index, nextIndex - index, ...replacement);
    // Les fragments insérés ont déjà été convertis. Reprendre la boucle
    // au premier nœud d'origine qui suit le remplacement.
    index += replacement.length - 1;
  }
}

export default function remarkMkdocs() {
  // Unified lie « this » au processeur lors de l'enregistrement du plugin.
  const parser = this;
  return (tree, file) => {
    const lines = String(file).split(/\r\n?|\n/);
    convertAdmonitions(tree, lines, parser);
  };
}
