# Nuzlocke Tracker

A tool for tracking Pokémon Emerald Nuzlocke runs, encounters, catches, gym and route progress.

**Project board:** [Linear project](https://linear.app/andresns/project/nuzlocke-tracker-c216a4a66095)

## Repo structure

This is a monorepo with two parts:

```
.
├── web/        # React + Vite app — the actual tracker UI
└── scripts/    # Node scripts that scrape/compile Pokémon Emerald data (e.g. from Serebii) into the JSON encounter database used by the app
```

- **`web/`** — the tracker itself. See [`web/README.md`](./web/README.md) for setup and usage.
- **`scripts/`** — standalone data-gathering scripts, not part of the app's runtime. Their output feeds the encounter database consumed by `web`. See [`scripts/README.md`](./scripts/README.md) for usage.

## Prerequisites

| Tool    | Version  |
| ------- | -------- |
| Node.js | v24.20.0 |
| yarn    | v4.18.0  |

> Both `web` and `scripts` are Node projects and share these prerequisites; each subfolder's README covers its own install/run steps.

## Architecture notes

- `web` follows the [Bulletproof React](https://github.com/alan2207/bulletproof-react) architecture — feature-based folder structure, colocated components/hooks/types, etc.
- No backend — all run data is persisted in `localStorage`.
- Emerald encounter data lives as a JSON database, generated/maintained via the `scripts/` scrapers.

## License

Personal project, not licensed for reuse.
