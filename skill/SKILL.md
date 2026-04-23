---
name: abw-submit
description: Submit a candidate profile or job posting to the abetterweb3 community (Telegram channel t.me/abetterweb3_cn, Twitter @abetterweb3). Posts go to a Notion-backed review queue; admin approves and publishes to Telegram. Explicit trigger — slash command `/abw-submit` (optionally with a URL or description as arg, e.g. `/abw-submit https://jobs.solana.com/...` or `/abw-submit 帮我发这个简历`). Natural-language triggers — user mentions abetterweb3, abw, web3 job board submission, web3 talent pool, or asks to post a candidate / job / role to a web3 community. Also triggers on Chinese intents like 帮我提交到 abetterweb3 / 投递简历到 abw / 发一个招聘到 abw / 把这个候选人加到 abw人才库.
---

# abw-submit

You're helping the user submit to one of the abetterweb3 Notion databases via a small HTTP relay. No Notion token needed — the relay holds it server-side.

## How this skill is triggered

1. **Slash command**: the user types `/abw-submit`, optionally with an inline argument:
   - `/abw-submit` (no arg) — ask the user what they want to submit.
   - `/abw-submit <URL>` — treat the URL as the source and run the URL-first flow below.
   - `/abw-submit <free-text description>` — take the description as the submission content directly.
2. **Natural language**: "帮我提交到 abw", "submit my resume to abetterweb3", "post this job to abw人才库", etc. (see the description field for the full trigger set).

Either path lands you in the same workflow below.

## Community canonical links

- Main public channel: <https://t.me/abetterweb3_cn> (Telegram — approved entries publish here)
- Twitter / X: [@abetterweb3](https://x.com/abetterweb3)

## If the user gives you a URL, use it

The user will often paste a URL — a job posting on another site (jobs.solana.com, cryptocurrencyjobs.co, a company careers page), a personal GitHub / LinkedIn / Twitter, a portfolio page, etc. **Fetch the URL first.** Extract everything you can from the page content, map it to the payload fields, and only ask the user for what you cannot determine.

**PDFs work the same way.** If the user attaches a PDF file or pastes a PDF URL (common for resumes and some job listings), treat it as a URL source — use your runtime's native PDF reader (Claude / ChatGPT / Cursor handle attached PDFs natively) or Jina Reader for PDF URLs (it handles PDFs), then continue with the same extraction flow.

Rules for URL-first submissions:

1. **Always fetch the URL** before asking the user for fields. Pick by tier, stop at the first that works:
    - **Tier 1 — efficient extractors (try first):** your native web tool (Claude Code `WebFetch`, Cursor `@Web`, Cline `web_fetch`, Aider `/web`), **[Jina Reader](https://github.com/jina-ai/reader)** (`curl https://r.jina.ai/<URL>` — zero-config, no API key), **[OpenCLI](https://github.com/jackwener/OpenCLI)** (uses your logged-in Chrome session — great for auth-walled pages), [Firecrawl](https://github.com/mendableai/firecrawl), [Crawl4AI](https://github.com/unclecode/crawl4ai). Handles ≥95% of job postings.
    - **Tier 2 — headless browser (only if Tier 1 fails):** [Browserbase](https://github.com/browserbase/sdk-node), [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp), [Playwright](https://github.com/microsoft/playwright), [browser-use](https://github.com/browser-use/browser-use). Slower — don't default to these.
    - **Tier 3 — ask the user:** *"I can't reach that page from here. Can you paste the job description?"* Extract from what they paste. **Never invent fields because you couldn't fetch.**
    - Full tradeoffs: [FETCH_TOOLS.md](https://github.com/Antoniaiaiaiaia/abw-submit/blob/main/FETCH_TOOLS.md).
2. For **recruit**, two URLs matter:
    - `source_url` = the URL you fetched (aggregator page: jobs.solana.com, ashbyhq, greenhouse, lever, workable…). Put the user's pasted URL here.
    - `apply_link` = the **company's own official website** (e.g. `lightcone.trade`, `trustwallet.com`). Find it on the aggregator page or search the web for the company name. **If no official company website exists, tell the user upfront**: *"The admin won't approve submissions without a company official website — do you have one?"* Don't submit without it.
   For **talent**, put the source URL in `more_links`.
3. **Extract aggressively.** Company / job title / description / requirements / salary / location / remote status / employment type / required tech → all usually on the page.
4. **Omit fields you cannot confidently determine.** Leave them blank rather than guessing. The admin reviewer will fill in what's missing.
5. **Map extracted values onto the legal option lists** from `GET /api/schema`. Be careful with casing — `solana` lowercase for `ecosystem`, `Solana` capitalized for `roles`.
6. **Show the user a dry-run first** when submitting from a URL (add `"dry_run": true` to the body). Let them spot anything you mis-extracted before the real submission.
7. **Only ask the user for genuinely missing critical info** — typically: contact / apply channel if not on the page, or salary expectation for a candidate submission (can't be inferred from a profile URL).

## What gets published publicly

Not every submitted field shows up in the public Telegram post that readers actually see. See [`PUBLIC_MAPPING.md`](https://github.com/Antoniaiaiaiaia/abw-submit/blob/main/PUBLIC_MAPPING.md) in the upstream repo for the full breakdown. Short version — spend extraction effort in this order:

1. `company` / `name` (always shown, required).
2. **recruit**: `requirements` = **list of job titles** the company is hiring for (one per line — a single posting often has multiple roles; put each title on its own line). Routed to the Notion page body, so a 10-title list is fine. The narrative/responsibilities/requirements prose goes in `job_description` (a separate field).  **talent**: `skills` + `experience` — the main text body the reader reads.
3. Employment-type checkboxes (`fulltime` / `parttime` / `internship` / `remote`) — become the leading hashtags.
4. For **recruit**: `job_types` feeds the hashtag row. For **talent**: `roles` feeds the hashtag row. (Note: recruit does NOT have a `roles` field, and does not have `languages`/`education_level`/`looking_for` either — those are talent-only. Don't include them in a recruit payload; validation will reject.)
5. `apply_link` + `apply_info` (recruit) / `contact` (talent) — how the reader acts.
6. `source_url` — the "更多在招" link at the bottom.

Everything else (locations, experience_required, education, languages, salary expectation) is filter/internal and rarely appears in the Telegram post — include when easy to extract, skip when not.

## Decide which one

| Kind | When | Title field |
|---|---|---|
| `talent` | The user is submitting a **candidate profile** (themselves or someone else) to the talent pool | `name` |
| `recruit` | The user is submitting a **job posting** (hiring announcement) | `company` |

### Classify from page signals when the user only gives a URL

Fetch the page, then match against these. **User's explicit verb wins** ("submit me" / "post this job") — only use page signals when the user's sentence is ambiguous ("提交到 abw").

**Recruit signals** (company is hiring):
- URL on a jobs ATS: `greenhouse.io`, `ashbyhq.com`, `lever.co`, `workable.com`, `jobs.*`, `boards.*`, `careers.*`, `/careers`, `/jobs`, `linkedin.com/jobs/view/...`
- Page title = "Job title — Company" pattern
- Salary range (`$180k–$260k`, `USD xx / year`)
- "Apply" / "Submit application" / "投递" button or form
- Headings: "Responsibilities", "Requirements", "What you'll do", "岗位要求", "We are hiring"
- Multiple open roles listed under one company
- Full-time / part-time / contract / intern keywords

**Talent signals** (person is job-hunting):
- Personal profile URLs: `github.com/<user>` (user page, not a repo), `twitter.com/<user>`, `x.com/<user>`, `linkedin.com/in/<user>`, personal site, portfolio
- PDF **résumé** — almost always talent
- Page describes one person: bio, projects, experience, "About me"
- Phrases: "Looking for", "Open to opportunities", "Available for", "求职", "找工作", "接单"
- Contact row framed as "reach me", not "apply here"

**Ambiguous — ask the user**:
- Company homepage with no `/careers` content
- `linkedin.com/company/...` (company profile, not a job listing)
- Pages that are partially both (founder site that also says "we're hiring") — ask which half

## Workflow

**Relay endpoint.** The default base is `https://abw-submit-relay.vercel.app`, used in every command below as `$RELAY_URL`. If the user has set `RELAY_URL` in their shell to override it (e.g. for staging), respect that; otherwise just use the default.

1. **Fetch the current field schema at runtime**:
   ```
   curl -sS "$RELAY_URL/api/schema?type=talent"
   curl -sS "$RELAY_URL/api/schema?type=recruit"
   ```
   This returns the authoritative list of fields and every valid `select` / `multi_select` option. **Always fetch this** — do not guess values. The option lists are large and contain inconsistent casing (e.g. `solana` lowercase but `Ethereum` capitalized).

2. **Collect values from the user.** You must have the title field (`name` or `company`). Everything else is optional — include what the user tells you, omit the rest. Don't invent.

3. **Normalize** user answers onto the allowed options:
    - For `select`: pick the closest exact string. E.g. user says "3 years web3" → `web3_experience: "2-4年"`.
    - For `multi_select`: same, can include multiple. Match casing exactly.
    - For `checkbox`: booleans. E.g. "I want remote" → `remote_only: true`.
    - Skip fields the user didn't mention — do not send `null` or `""`.

4. **Dry-run first** if the user wants to review, otherwise submit directly:
   ```bash
   curl -sS -X POST "$RELAY_URL/api/submit" \
     -H 'Content-Type: application/json' \
     -d '{
       "type": "talent",
       "data": { "name": "...", "roles": ["..."], ... }
     }'
   ```
   Add `"dry_run": true` inside the body to preview the Notion payload without writing.

5. **Handle the response.**
    - `200 ok:true` → share the returned `url` and **clearly tell the user the submission is pending admin review, not yet public**. See "Always communicate this" below.
    - `400 validation_failed` → read `details[]`, **fix the payload yourself**, retry. Don't bounce raw validation errors to the user unless you've already tried to fix them once.
    - `5xx` / network error → tell the user the relay is temporarily down.

## ⚠️ Always communicate this to your human

**Submissions are NOT published immediately.** Every entry goes to a private Notion review queue and is manually reviewed by the abetterweb3 admin (Antonia) before it appears on the [public Telegram channel](https://t.me/abetterweb3_cn).

Mention this:
- before submitting, so they know what to expect;
- right after a successful submission, so they don't assume it went live;
- if they ask "why don't I see my entry yet" — the answer is almost always "still pending admin review."

Typical phrasing:
> "Your submission has been received and is now in the abetterweb3 review queue. It will be published to the [Telegram channel](https://t.me/abetterweb3_cn) after admin Antonia reviews it manually, so there may be a delay before it shows up publicly. You can verify the entry was received at the Notion URL above."

## Payload shape quick reference

```json
{
  "type": "talent" | "recruit",
  "data": {
    // talent fields:
    "name": "string (required)",
    "contact": "string — TG / email / Twitter / WeChat",
    "web3_experience": "one of < 1年 | 1-2年 | 2-4年 | > 4年",
    "roles": ["multi_select"],
    "skills": "string",
    "experience": "string",
    "education_level": "one of 学士/本科 | 硕士/研究生 | 博士/博士后 | 大专 | 辍学大佬 | 其他",
    "languages": ["multi_select"],
    "looking_for": "one of 随时合作 | 看看机会 | 交友拓展",
    "salary_expectation": "string",
    "more_links": "string",
    "fulltime": true,
    "parttime": false,
    "internship": false,
    "remote_only": false,
    "is_student": false,
    "open_to_recruiters": true
    // …and for recruit, see the schema endpoint — it has
    // company, contact_email, source_url, job_description,
    // requirements, salary, ecosystem, locations, job_types, etc.
  }
}
```

Full field list + every valid option: `GET /api/schema?type=...` or see the upstream repo at <https://github.com/Antoniaiaiaiaia/abw-submit>.

## Rules

- Don't invent `select` values. Pick the closest legal option or omit.
- Don't batch many submissions. One request per user intent.
- Always share the Notion `url` on success so the user can verify.
- Always tell the user the submission is **pending admin review**, not immediately public. Repeat this if they follow up asking when it will appear.
- Never try to call the Notion API directly. The relay is the only supported path.
