# change-log — abw-submit-kit

## 2026-04-21

### Initial build

**What:** Created a public-ready toolkit that lets any AI agent submit entries to the abetterweb3 talent pool or recruitment board by POSTing to the companion relay. Contains:
- `AGENTS.md` — entry-point instructions for AI agents.
- `SCHEMA.md` — auto-generated field reference (every valid select/multi_select option).
- `README.md` — human intro.
- `submit.py` / `submit.sh` — reference submitters.
- `examples/*.json` — working payloads.
- `scripts/generate-schema-doc.mjs` — regenerates SCHEMA.md from Notion schema snapshots.

**Why:** Antonia wanted to hand the abetterweb3 community a single GitHub repo that their agents can clone and immediately understand how to auto-submit. The kit is the "agent-native" surface; the actual Notion writes happen behind a private relay.

**How to revert:** `rm -rf` the project directory. Nothing public yet so no GitHub state to clean up.

---

## 2026-04-22

### Pushed to GitHub *(commit `9655fba`)*

**What:** Initial push to <https://github.com/Antoniaiaiaiaia/abw-submit>. Repo is public.

**Why:** So abetterweb3 community members (and their agents) can discover, clone, and use it.

**How to revert:** `gh repo delete Antoniaiaiaiaia/abw-submit`. Local copy remains intact.

### Added Claude skill *(commit `3621517`)*

**What:** New `skill/SKILL.md` — a self-contained Claude skill that triggers on natural-language abw submission intents (Chinese + English). Install: copy the file into `~/.claude/skills/abw-submit/`. The skill embeds the minimal payload shape and references `GET /api/schema` for authoritative option lists, so it stays in sync without bundling SCHEMA.md.

**Why:** Without a skill, users have to manually clone the repo or paste AGENTS.md for their agent to know about abw. The skill makes "帮我提交招聘到 abetterweb3" just work for Claude Code / Claude Desktop users.

**How to revert:** `rm -rf skill/`, remove the "Install as a Claude skill" section from README.md. Existing installs remain but become orphan files (harmless).

### Stress admin-review step to end users *(commit `4f0cbdf`)*

**What:** AGENTS.md got a prominent "IMPORTANT" callout near the top, reinforced in the response-handling section and in the final rules list. The skill mirrors the same language.

**Why:** Submissions go to a private Notion review queue first. The admin (Antonia) manually publishes approved entries to Telegram. Agents were previously free to imply "your entry is now live" — they must not. Users who don't see their entry in Telegram immediately need to understand it's pending review, not a bug.

**How to revert:** Delete the callout sections in AGENTS.md and SKILL.md.

### Added URL-first extraction flow *(commit `c6c843f`)*

**What:** When the user pastes a URL (job post, candidate profile), agents should fetch the page first and extract as many fields as they can before asking the user for anything. Added a new "URL-first submissions" section to AGENTS.md; mirrored in SKILL.md.

**Why:** Antonia flagged that typing out every field is UX death — agents with web-read capability should just accept a URL and auto-fill. "Paste URL → dry-run → confirm → submit" is the happy path.

**How to revert:** Remove the "URL-first submissions" section in both files.

### Recommended Jina AI Reader as zero-config web fetcher *(commit `026f2c4`)*

**What:** Documented `curl https://r.jina.ai/<url>` as a fallback for agents with no native web-reading tool.

**Why:** Not every agent has `WebFetch` / `@Web`. Jina is a free public reader that works from any HTTP client.

**How to revert:** Remove the Jina line from the URL-first rules block.

### Route `recruit.requirements` to Notion page body *(commit `41aed2b`)*

**What:** The relay now writes `recruit.requirements` as page-body paragraph blocks instead of the `岗位需求` rich_text property. The doc updates explain this to agents and to the admin.

**Why:** Antonia's admin workflow puts the real job listing body in the Notion page contents, not the property cell. Property cells cap ~2000 chars and render poorly. Matching the admin's actual workflow means submissions land in the right place without manual moving.

**How to revert:** See `submit-relay/change-log.md` — delete the `BODY_FIELDS` routing logic and revert the doc notes.

### Added PUBLIC_MAPPING.md *(commit `a6f8cdc`)*

**What:** New field-by-field breakdown of where each submitted field surfaces in the public Telegram post. Includes an annotated real example (Trust Wallet, April 20 post) and a "what the admin adds manually" section covering ticker / market-cap / verified-email badge.

**Why:** Agents were over-indexing on "submit everything" when in practice many fields are internal-only filters. The mapping tells them which fields the Telegram reader actually sees, so they prioritize extraction effort there.

**How to revert:** `rm PUBLIC_MAPPING.md`, drop the cross-references in AGENTS.md / SKILL.md / README.md.

### Added FETCH_TOOLS.md and reorganized as 3 priority tiers *(commits `c5c61d2`, `908d170`)*

**What:** New `FETCH_TOOLS.md` — catalog of URL-fetching tools with GitHub links, organized by priority:
- **Tier 1 (try first):** efficient extractors — native agent tools, Jina Reader, Firecrawl, Crawl4AI, Exa, Tavily.
- **Tier 2 (only if Tier 1 fails):** headless browser control — Browserbase, Chrome DevTools MCP, Playwright, Puppeteer, browser-use, Browserless.
- **Tier 3:** ask the user to paste the page text. Never invent fields.

`AGENTS.md` and `SKILL.md` mirror the same 3-tier ladder inline with one-line GitHub links.

**Why:** Agents had no canonical guidance on which fetcher to reach for. The priority order matters: a heavy browser for a static job page is wasteful; Jina for a login-walled page will fail silently. Also: when all network is gone, the right behavior is to ask the user for text, not to invent fields.

**How to revert:** `rm FETCH_TOOLS.md`, revert the tier ladders in AGENTS.md / SKILL.md.

### Fixed requirements/job_description field semantics *(commit `5c385d0`)*

**What:** Previously the docs implied `requirements` was the full narrative block. Corrected: `requirements` is a **list of job titles** (one per line; a single company often hires for multiple roles). `job_description` is the narrative prose (responsibilities, what the company is looking for). Updated PUBLIC_MAPPING.md, AGENTS.md, SKILL.md, and `examples/recruit.json` accordingly.

**Why:** Antonia pointed out the semantic mismatch via a screenshot — I had filled the narrative into `岗位需求`, but the Trust Wallet reference example showed `岗位需求` should be the numbered title list. Same commit adds [OpenCLI](https://github.com/jackwener/OpenCLI) to Tier 1 of FETCH_TOOLS.md — it uses the user's already-logged-in Chrome, bridging the gap between Jina (HTTP-only) and Playwright (full headless).

**How to revert:** Revert the `requirements` description in each of the four files.

### Clarified canonical links (Telegram channel + Twitter handle) *(commit `9673144`)*

**What:** Previously `@abetterweb3` was used ambiguously as a generic community shorthand. Clarified:
- `@abetterweb3` = Twitter handle: <https://x.com/abetterweb3>
- Main public channel = Telegram: <https://t.me/abetterweb3_cn>
- Submissions go to a private Notion review queue → admin publishes approved entries to Telegram.

Added a canonical-links block near the top of README.md and AGENTS.md. SKILL.md frontmatter description now mentions both the Telegram URL and Twitter handle directly (visible to agents without opening the body).

**Why:** Antonia flagged the ambiguity. Agents telling users "your post will appear at @abetterweb3" was pointing to the wrong platform.

**How to revert:** Restore the older generic "@abetterweb3 community" phrasing across the four files.

### Stripped internal metadata from public repo

**What:**
- Untracked `context.md` (agent-briefing notes that referenced a private email, a private sibling repo, and internal workflow). Added to `.gitignore`. File kept locally for internal use.
- Added `scripts/sanitize-schema.mjs` — strips `created_by` / `last_edited_by` / `parent` / `request_id` / `cover` / `icon` / `url` / `public_url` from the raw Notion snapshots, keeping only what the SCHEMA.md generator needs.
- Re-ran the sanitizer on `schemas/talent_raw.json` and `schemas/recruit_raw.json`. Removes the Notion admin user ID, workspace parent-block IDs, and snapshot request IDs that the API had returned.

**Why:** Security scrub. None of the stripped fields were credentials, but the admin's Notion user ID and internal workspace IDs don't belong in a public repo aimed at external agents. The email reference in `context.md` was a personal address that would otherwise be harvested from the public repo.

**Note:** Git history before this commit still contains the previous versions of `context.md` and the un-sanitized schemas. If you want the history nuked as well, rewrite with `git filter-repo` + force-push. Left as-is for now — the information is not credential-grade.

**How to revert:** `git revert` this commit; remove `context.md` from `.gitignore`; re-add the un-sanitized snapshots by copying from `submit-relay/lib/schemas/` (which holds the full Notion API responses internally).
