# scripts

Node scripts for scraping/compiling Pokémon Emerald data (routes, encounter methods, trades, gifts) from sites like Serebii into the JSON encounter database used by the `web` app.

These scripts are standalone tooling — not part of the app's runtime, run manually/on-demand to (re)generate data.

See the [root README](../README.md) for overall project context.

## Setup

```bash
cd scripts
yarn install
```

## Usage

TODO!

```bash
node scrape-routes.js
node build-encounter-db.js
```

<!-- What each script does, in order if there's a pipeline, e.g.:
1. `scrape-routes.js` — pulls raw route/encounter data from Serebii into `raw/`
2. `build-encounter-db.js` — normalizes `raw/` into the final JSON consumed by `web`
-->

## Output

Generated data lands at `<!-- e.g. ../web/src/data/encounters.json -->` — commit this after regenerating so `web` always has a checked-in copy.

## Notes

- Update Output section of this readme and consider changing the output of the scripts, or create a script to move the outputs from `scripts` to `web`
