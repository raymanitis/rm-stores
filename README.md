# RM-STORES

Custom shop system built on top of the [`ef_shops`](https://github.com/jellyton255/ef_shops) base, with a UI redesigned for this project.

## Features
- Shop stock with server-side tracking and restock on restart
- Cash and bank payments with cart-based checkout
- Category filtering, sorting, and favorites
- Mantine v7 React UI rebuilt for this fork
- Supports qbx-core/ox_inventory setups

## Installation
1) Ensure dependencies from the base project (`qbx-core`, `ox_inventory`) are installed.  
2) Place `rm-stores` in your resources directory.  
3) Install frontend deps in `web/` (pnpm/npm/yarn), then build:
   - `cd web`
   - `pnpm install` (or `npm install`)
   - `pnpm run build` (or `npm run build`)
4) Start the resource in your server config: `ensure rm-stores`.

## Configuration
- Edit `config/config.lua` for framework settings and shop behavior.
- Adjust shop items and locations in `config/shop_items.lua` and `config/locations.lua`.

## Credits
- Base logic and structure inspired by `ef_shops`.
- UI design and integration by Reinis for RM-STORES.

