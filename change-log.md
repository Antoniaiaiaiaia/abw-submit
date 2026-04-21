# change-log — abw-submit-kit

## 2026-04-21

### Initial build

**What:** Created a public-ready toolkit that lets any AI agent submit entries to the @abetterweb3 talent pool or recruitment board by POSTing to the companion relay. Contains:
- `AGENTS.md` — entry-point instructions for AI agents.
- `SCHEMA.md` — auto-generated field reference (every valid select/multi_select option).
- `README.md` — human intro.
- `submit.py` / `submit.sh` — reference submitters.
- `examples/*.json` — working payloads.
- `scripts/generate-schema-doc.mjs` — regenerates SCHEMA.md from Notion schema snapshots.

**Why:** Antonia wanted to hand the @abetterweb3 community a single GitHub repo that their agents can clone and immediately understand how to auto-submit. The kit is the "agent-native" surface; the actual Notion writes happen behind a private relay.

**How to revert:** `rm -rf` the project directory. Nothing public yet so no GitHub state to clean up.
