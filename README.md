# Nuzlocke Tracker

A tool for tracking Pokémon Emerald Nuzlocke runs, encounters, catches, gym and route progress.

**Project board:** [Linear project](https://linear.app/andresns/project/nuzlocke-tracker-c216a4a66095)

## Prerequisites

| Tool    | Version  |
| ------- | -------- |
| Node.js | v24.20.0 |
| yarn    | v4.18.0  |

## Setup

```bash
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
├── assets/       # images
├── components/   # shared/reusable UI components
├── features/     # feature-based modules (colocated components/hooks/api/types)
├── hooks/        # shared hooks
├── lib/          # shared utilities/config
├── types/        # shared types
└── constants.ts  # shared constants
```

## Scrapper

The `scripts` folder contains Node scripts for scraping/compiling Pokémon Emerald data (routes, encounter methods, trades, gifts) from sites like Serebii into a JSON file in the `scripts/outputs` folder.

## License

Personal project, not licensed for reuse.
