# web

The Nuzlocke tracker app — React + Vite, no backend, all state persisted in `localStorage`.

See the [root README](../README.md) for overall project context, prerequisites, and the `scripts/` data pipeline this app depends on.

## Setup

```bash
cd web
yarn install
```

## Development

```bash
yarn dev
```

Starts the Vite dev server (default: http://localhost:5173).

## Deploy

```bash
yarn deploy
```

Uses gh-pages to deploy the project to Github pages.

## Architecture

Follows [Bulletproof React](https://github.com/alan2207/bulletproof-react) conventions:

```
src/
├── app/          # app entry, routes, providers
├── features/     # feature-based modules (colocated components/hooks/api/types)
├── components/   # shared/reusable UI components
├── hooks/        # shared hooks
├── lib/          # shared utilities/config
└── types/        # shared types
```

<!-- Adjust the tree above to match your actual structure once it settles. -->
