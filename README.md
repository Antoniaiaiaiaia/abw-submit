# abw-submit-kit

A toolkit for AI agents to submit entries to the [abetterweb3](https://abetterweb3.notion.site/) talent pool and recruitment board — without needing any API token.

Give this repo to your agent (Claude, Cursor, ChatGPT with browsing, Aider, etc.). The agent reads `AGENTS.md`, figures out what to do, and POSTs a small JSON payload to the relay.

> **Relay URL:** <https://abw-submit-relay.vercel.app>

## For humans

- Talent pool entries go to: [人才审核区](https://abetterweb3.notion.site/1f584271ff5580ffa0a9f9b1fadd185c)
- Job postings go to: [招聘审核区](https://www.notion.so/abetterweb3/1f784271ff5580ecba7fc2d3da928b9e)
- Both land in a review queue first; an @abetterweb3 admin publishes them.

## For AI agents

Open [AGENTS.md](./AGENTS.md). Everything you need is there.

## Install as a Claude skill (optional, for Claude Code / Claude Desktop users)

Once installed, natural-language intents like "帮我提交招聘到 abetterweb3" or "submit my profile to abw" trigger the skill automatically — no manual clone, no context-pasting.

```bash
mkdir -p ~/.claude/skills/abw-submit && \
curl -sSL https://raw.githubusercontent.com/Antoniaiaiaiaia/abw-submit/main/skill/SKILL.md \
  -o ~/.claude/skills/abw-submit/SKILL.md
```

To update later, re-run the same command. To uninstall: `rm -rf ~/.claude/skills/abw-submit`.

## Files

| File | For |
|---|---|
| [`AGENTS.md`](./AGENTS.md) | Primary instructions for AI agents (when the repo is their working context). |
| [`skill/SKILL.md`](./skill/SKILL.md) | Claude skill — install once, triggers on natural language. |
| [`SCHEMA.md`](./SCHEMA.md) | Every field, every valid `select` / `multi_select` option. |
| [`PUBLIC_MAPPING.md`](./PUBLIC_MAPPING.md) | Where each submitted field shows up in the final public Telegram post. |
| [`submit.py`](./submit.py) | Reference Python submitter. |
| [`submit.sh`](./submit.sh) | Reference `curl` one-liner. |
| [`examples/talent.json`](./examples/talent.json) | Full example talent payload. |
| [`examples/recruit.json`](./examples/recruit.json) | Full example recruit payload. |
| [`schemas/*.json`](./schemas/) | Raw Notion schema snapshots (re-run `scripts/generate-schema-doc.mjs` if they change). |

## Quick curl sanity check

```bash
curl -sS -X POST https://abw-submit-relay.vercel.app/api/submit \
  -H 'Content-Type: application/json' \
  --data @examples/talent.json | jq
```

Swap `examples/talent.json` for `examples/recruit.json` to test a job posting. Both examples include `"dry_run": true` so they won't actually write — flip it to `false` when you're ready.

## Maintainers

- Relay source: private repo, deployed to Vercel by @abetterweb3.
- If a Notion column is added/removed and breaks submissions, ping the maintainer — the relay's mapping needs a small update.

## License

MIT.
