# abw-submit-kit — Agent Context

## What this is

**Public** repository to be published under the @abetterweb3 org (or Antonia's account). Community members — or, more importantly, their AI agents — clone this repo and get everything they need to submit to the @abetterweb3 talent pool or recruitment board.

The kit itself contains no secrets. It tells agents where to POST and in what shape. The actual Notion writes happen on the relay (`abw/submit-relay/`).

## Status (2026-04-21)

- Content complete.
- **Not yet pushed to GitHub.**
- README and AGENTS.md contain a `<RELAY_URL>` placeholder that must be replaced with the real Vercel URL after the relay is deployed.

## Key files

- `AGENTS.md` — primary instructions for AI agents. Entry point.
- `README.md` — human-facing intro.
- `SCHEMA.md` — auto-generated field reference with every valid option. Re-generate with `node scripts/generate-schema-doc.mjs`.
- `submit.py`, `submit.sh` — reference submitters.
- `examples/{talent,recruit}.json` — working example payloads (both have `dry_run: true` by default).
- `schemas/*.json` — raw Notion schema snapshots. Stay in sync with `../submit-relay/lib/schemas/`.
- `scripts/generate-schema-doc.mjs` — rebuilds SCHEMA.md from the snapshots.

## When to update

- **Notion column renamed / new option added** →
    1. Re-snapshot both DBs (see `submit-relay/context.md` instructions).
    2. Copy updated JSONs here.
    3. `node scripts/generate-schema-doc.mjs`.
    4. Commit + push.
    5. Also update `submit-relay/lib/mappings.ts` if the new field needs an english key.

- **Relay URL changes** → update README.md and AGENTS.md (search for `<RELAY_URL>`).

## How to publish to GitHub

```bash
cd ~/Documents/claude\ works/abw/submit-kit
git init
git config user.email ylyantonia@gmail.com
git config user.name antonia
git add .
git commit -m "Initial abw-submit-kit"
gh repo create abetterweb3/abw-submit-kit --public --source=. --remote=origin --push
```

(Use `ylyantonia@gmail.com` as the commit author per the auto-memory rule.)

## Gotchas

- `AGENTS.md` is the real entry point for agents. If you rename it, update every other file that references it.
- The SCHEMA.md file is **generated**. Do not hand-edit — changes will be overwritten.
- Keep descriptions in `scripts/generate-schema-doc.mjs` (the `desc` fields) in sync with the semantics the mapping in `submit-relay/lib/mappings.ts` enforces.
