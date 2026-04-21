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

---

## 2026-04-22

### Pushed to GitHub

**What:** Initial push to <https://github.com/Antoniaiaiaiaia/abw-submit>. Repo is public.

**Why:** So @abetterweb3 community members (and their agents) can discover, clone, and use it.

**How to revert:** Delete the repo on GitHub (`gh repo delete Antoniaiaiaiaia/abw-submit`). Local copy remains intact.

### Added Claude skill

**What:** New `skill/SKILL.md` — a self-contained Claude skill that triggers on natural-language abw submission intents (Chinese + English). Install: copy the file into `~/.claude/skills/abw-submit/`. The skill embeds the minimal payload shape and references `GET /api/schema` for authoritative option lists, so it stays in sync without bundling SCHEMA.md.

**Why:** Without a skill, users have to manually clone the repo or paste AGENTS.md for their agent to know about abw. The skill makes "帮我提交招聘到 abetterweb3" just work for Claude Code / Claude Desktop users.

**How to revert:** `rm -rf skill/`, remove the "Install as a Claude skill" section from README.md. Existing installs remain but become orphan files (harmless).
