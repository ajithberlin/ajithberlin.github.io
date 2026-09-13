# Ajith Berlin · A curious mind. A builder at heart.

[Visit the portfolio](https://ajithberlin.github.io) · [AlphBerlin](https://github.com/AlphBerlin) · [Bytamilan](https://github.com/bytamilan)

A personal portfolio and public repository explorer, built with **Astro** and TypeScript. It brings together creative products, on-device AI, and community projects across `ajithberlin`, `AlphBerlin`, and `bytamilan`.

## Features

- Responsive editorial design, custom project illustrations, and persistent light/dark themes.
- Featured LangCity, Bixel, and Local AI Kit projects, plus a Bytamilan community section.
- Search, account and language filters, sorting, and optional forks/archived repositories.
- Repository cards rendered into HTML, so content remains available without JavaScript.
- Daily GitHub data refresh, semantic HTML, keyboard navigation, reduced-motion support, social preview, sitemap, and a custom 404.

## Local development

Requires Node.js 24 (Node 22.12+ supported).

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

`npm run sync` refreshes public repository metadata. Set `GITHUB_TOKEN` in your local environment for higher API limits; never commit it. The site builds offline from `src/data/repos.json` when you do not run sync. A failed refresh leaves that snapshot untouched and fails the deployment, preserving the previously deployed site.

## GitHub Pages deployment

In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions** once. The `Build and deploy portfolio` workflow builds and deploys on pushes to `master`, daily at 01:17 UTC, and manual dispatch. Pull requests run tests and build without deployment. No custom token or hosting service is required.

The site is configured for `https://ajithberlin.github.io/` with no repository base path. For a custom domain, update `site` in `astro.config.mjs`, canonical metadata, robots/sitemap, and the Pages custom-domain setting together.

## Edit content

| Content | File |
| --- | --- |
| Profile, featured projects, contact, community | `src/pages/index.astro` |
| Design, responsiveness, theme | `src/styles/global.css` |
| Public repository snapshot | `src/data/repos.json` |
| Account list, safe data refresh | `scripts/sync-github.mjs` |
| Build and deployment | `.github/workflows/deploy.yml` |
| Social preview | `public/social.svg`, `public/social.png` |

The repository explorer includes public projects from all three accounts and labels forks separately. Private repositories are excluded explicitly, even when a token can access them. This repository deploys the portfolio website; GitHub's special profile README lives in the separate `ajithberlin/ajithberlin` repository.
