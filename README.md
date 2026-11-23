# remark-mkdocs-material-admonitions

Plugin Remark pour conserver les encadrés MkDocs Material dans les fichiers Markdown
migrés vers Astro Starlight. Il produit du HTML standard et fournit une feuille
de style optionnelle.

## Essayer la démonstration

Depuis la racine de ce dépôt, avec Node.js 22.23.4 ou une version ultérieure
compatible avec Astro 7 :

```sh
npm ci
npm test
npm run test:starlight
npm run demo
```

Ouvrir `http://localhost:4321/demo/`. Cette route charge directement
[`demo.md`](examples/starlight/src/content/docs/demo.md), le fichier de référence
fourni, avec ses fins de ligne CRLF. Le projet de démonstration résout le package
local via son nom npm et utilise la feuille de style exportée.

## Installer le package localement

```sh
# Depuis le dépôt du plugin
npm pack

# Depuis le projet qui utilise le plugin
npm install /chemin/remark-mkdocs-material-admonitions-0.1.0.tgz
```

### Astro 7 et Starlight

Installer le processeur Markdown Unified si nécessaire :

```sh
npm install @astrojs/markdown-remark
```

Dans `astro.config.mjs`, ajouter le plugin à la liste `remarkPlugins` et la
feuille de style à la liste `customCss` de la configuration Starlight existante.

```js
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import remarkMkdocs from 'remark-mkdocs-material-admonitions';

export default defineConfig({
  markdown: {
    processor: unified({ remarkPlugins: [remarkMkdocs] }),
  },
  integrations: [
    starlight({
      title: 'Documentation',
      customCss: ['remark-mkdocs-material-admonitions/style.css'],
    }),
  ],
});
```

Le plugin Remark génère les éléments et leurs attributs, y compris
`details[open]` et `summary`.

### Unified

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkMkdocs from 'remark-mkdocs-material-admonitions';

const html = await unified()
  .use(remarkParse)
  .use(remarkMkdocs)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process('!!! tip "Conseil"\n    Pensez à sauvegarder.');
```

## Syntaxes prises en charge

```markdown
!!! note
    Le titre par défaut est « Note ».

??? info "Cliquez pour afficher"
    Cet encadré est fermé par défaut.

???+ warning "Attention"
    Cet encadré est ouvert par défaut.

    !!! tip ""
        Cet encadré imbriqué a un titre vide.
```

| Type | Alias |
| --- | --- |
| `note` | |
| `abstract` | `summary`, `tldr` |
| `info` | |
| `tip` | `hint`, `important` |
| `success` | `check`, `done` |
| `question` | `help`, `faq` |
| `warning` | `caution`, `attention` |
| `failure` | `fail`, `missing` |
| `danger` | `error` |
| `bug` | |
| `example` | |
| `quote` | `cite` |

Les déclarations commencent en début de ligne au niveau du document ou du
corps d'une admonition. Indenter le corps de quatre espaces ou d'une tabulation.
Le corps accepte notamment les paragraphes, listes, liens, styles en ligne,
blocs de code et admonitions imbriquées. Les titres sont du texte simple. Un
titre explicite vide conserve l'icône et un texte de titre vide, comme dans
le prototype fourni. Un type inconnu ou une déclaration malformée reste dans
le flux Markdown ordinaire.

Placer une ligne vide entre un paragraphe Markdown ordinaire et une déclaration
qui le suit. Les déclarations à l'intérieur de listes ou de citations Markdown
sortent du périmètre du plugin. Les liens Markdown de référence peuvent être
résolus dans un même corps d'admonition. Pour un lien dont la définition réside
ailleurs dans la page, utiliser un lien en ligne dans l'admonition.

## Vérifications

- `npm test` vérifie l'empreinte SHA-256 du Markdown et compare le HTML produit
  au [rendu enregistré du prototype](test/fixtures/demo.initial.html). Les tests
  ciblés couvrent aussi les délimitations, les blocs de code littéraux, les
  types inconnus, l'échappement et l'application d'une extension Markdown.
- `npm run test:starlight` compile la vraie route avec Astro Starlight. Il
  contrôle les 40 encadrés, l'absence de transformation du cas invalide, le HTML
  des blocs repliables, le contenu riche, le code et le CSS généré.
- `npm pack --dry-run` donne le contenu de l'archive npm. La démo et les tests
  restent dans les sources du projet.

Le champ `license` est actuellement `UNLICENSED`. Le propriétaire du code peut
choisir une licence avant publication publique.
