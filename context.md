# abw-submit-kit — Agent Context

## What this is

**Public** repository at <https://github.com/Antoniaiaiaiaia/abw-submit>. Community members — or, more importantly, their AI agents — clone this repo (or install the skill) and get everything they need to submit to the abetterweb3 talent pool or recruitment board.

The kit itself contains no secrets. It tells agents where to POST and in what shape. The actual Notion writes happen on the relay (`abw/submit-relay/`), deployed at <https://abw-submit-relay.vercel.app>.

## Canonical external links (don't confuse)

- **Telegram (main public channel, where approved posts land):** <https://t.me/abetterweb3_cn>
- **Twitter / X handle:** [@abetterweb3](https://x.com/abetterweb3)
- **Talent review queue (Notion):** <https://abetterweb3.notion.site/1f584271ff5580ffa0a9f9b1fadd185c>
- **Recruit review queue (Notion):** <https://www.notion.so/abetterweb3/1f784271ff5580ecba7fc2d3da928b9e>
- **Relay:** <https://abw-submit-relay.vercel.app>
- **GitHub (this repo):** <https://github.com/Antoniaiaiaiaia/abw-submit>

## Status (2026-04-22)

- Live and pushed to GitHub.
- Skill installed locally at `~/.claude/skills/abw-submit/SKILL.md`.
- Relay in production, end-to-end verified (talent + recruit paths, dry-run + real writes).
- All URL placeholders replaced with the live relay URL.

## Key files

| File | For |
|---|---|
| `AGENTS.md` | Primary instructions for AI agents. Entry point when the repo is their working context. |
| `skill/SKILL.md` | Claude skill — install once and natural-language triggers wire up submissions. Canonical links + URL-fetch tier ladder + field priorities all live in the frontmatter + body. |
| `README.md` | Human-facing intro + canonical-links block. |
| `SCHEMA.md` | Auto-generated field reference with every valid select / multi_select option. Regenerate via `node scripts/generate-schema-doc.mjs`. |
| `PUBLIC_MAPPING.md` | Where each submitted field surfaces in the final Telegram post (vs. internal/filter-only). Real annotated example from a Trust Wallet post. |
| `FETCH_TOOLS.md` | 3-tier ladder of URL-fetching tools agents can use: Tier 1 efficient extractors (Jina, OpenCLI, Firecrawl, Crawl4AI, Exa, Tavily) → Tier 2 headless browsers (Browserbase, Chrome DevTools MCP, Playwright, Puppeteer, browser-use) → Tier 3 ask the user. Each entry has a GitHub link. |
| `submit.py` / `submit.sh` | Reference submitters — `python submit.py examples/talent.json` or `./submit.sh examples/recruit.json`. |
| `examples/{talent,recruit}.json` | Working example payloads (dry_run by default). |
| `schemas/*.json` | Notion schema snapshots mirrored from `submit-relay/lib/schemas/`. Keep both sides in sync. |
| `scripts/generate-schema-doc.mjs` | Rebuilds SCHEMA.md from the snapshots. |

## Field semantics worth double-checking

- **`recruit.requirements`**: a **list of job titles** being hired for, one per line. Not a narrative. The relay routes this to the Notion **page body** (paragraph blocks), not to the `岗位需求` property — Notion rich_text properties cap ~2000 chars and render poorly for long listings.
- **`recruit.job_description`**: narrative prose (what the role does, what you're looking for). Goes in the `岗位描述` rich_text property.
- **`recruit.source_url`**: the page the agent fetched the job from (aggregator URL like ashbyhq / greenhouse / jobs.solana.com). Surfaces in the public post's "更多在招" block.
- **`recruit.apply_link`**: direct apply URL. Surfaces as the main link in the public post title area.
- `select` / `multi_select` values are **case-sensitive and sometimes inconsistent inside one DB** (e.g. `recruit.ecosystem` has `solana` lowercase but `Ethereum` capitalized). Validation rejects mismatches.

## When to update

- **Notion column renamed / new option added**:
    1. Re-snapshot both DBs (instructions in `submit-relay/context.md`).
    2. Copy updated JSONs to `schemas/`.
    3. `node scripts/generate-schema-doc.mjs`.
    4. Update `submit-relay/lib/mappings.ts` if a new english key is needed.
    5. Commit + push (both repos).

- **Relay URL changes**: grep for `abw-submit-relay.vercel.app` and update.

- **New fetch tool worth recommending**: edit `FETCH_TOOLS.md` directly; tier 1/2/3 structure is the contract.

- **Canonical link change** (new Telegram, re-branding): update the "Canonical links" blocks in README.md, AGENTS.md, and the SKILL.md frontmatter description.

## How to update the installed skill

```bash
# pull latest from GitHub (CDN caches; may take a minute to refresh)
mkdir -p ~/.claude/skills/abw-submit && \
  curl -sSL https://raw.githubusercontent.com/Antoniaiaiaiaia/abw-submit/main/skill/SKILL.md \
  -o ~/.claude/skills/abw-submit/SKILL.md

# or copy local working copy directly
cp ~/Documents/claude\ works/abw/submit-kit/skill/SKILL.md ~/.claude/skills/abw-submit/SKILL.md
```

## How to re-publish changes

```bash
cd ~/Documents/claude\ works/abw/submit-kit
git add <changed files>
git commit -m "..."
git push
```

Commit author must be `ylyantonia@gmail.com` (per the auto-memory rule — this repo is under `Antoniaiaiaiaia` on GitHub, tied to that email).

## Gotchas

- `AGENTS.md` is the real entry point for agents. If you rename or move it, update README.md's files table and SKILL.md's cross-references.
- `SCHEMA.md` is **generated**. Don't hand-edit — changes get overwritten by the regenerator.
- Keep field descriptions in `scripts/generate-schema-doc.mjs` (the `desc` strings) in sync with the semantics the mapping in `submit-relay/lib/mappings.ts` enforces, and with the human-readable notes in `PUBLIC_MAPPING.md`.
- `@abetterweb3` = **Twitter handle**, not the Telegram channel. The Telegram channel is `t.me/abetterweb3_cn`. Easy to confuse; the canonical-links block at the top of README / AGENTS / SKILL is the source of truth.
