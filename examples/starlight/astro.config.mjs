import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import remarkMkdocs from 'remark-mkdocs-material-admonitions';

export default defineConfig({
  redirects: { '/': '/demo/' },
  markdown: {
    processor: unified({ remarkPlugins: [remarkMkdocs] }),
  },
  integrations: [
    starlight({
      title: 'Admonitions MkDocs Material',
      defaultLocale: 'root',
      locales: { root: { label: 'Français', lang: 'fr' } },
      customCss: ['remark-mkdocs-material-admonitions/style.css'],
      sidebar: [{ label: 'Page de référence', slug: 'demo' }],
    }),
  ],
});
