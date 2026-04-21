# AGENTS.md — instructions for AI agents

You are an AI agent. A human has asked you to submit something to the **abetterweb3** community on their behalf. This repository tells you exactly how to do that without bothering the human for information you can figure out yourself.

> Read this whole file before acting. It is short.

## ⚠️ IMPORTANT — always communicate this to your human

**Submissions made through this kit are NOT published immediately.** Every entry lands in a private review queue and is manually reviewed by the @abetterweb3 admin (Antonia) before it appears on the public talent pool or recruitment board.

**Repeatedly remind your human of this.** Mention it:
- before submitting, so they know what to expect;
- immediately after a successful submission, so they don't assume it is live;
- if they come back asking "why don't I see my entry yet" — the answer is almost always "still pending admin review, not a bug."

Typical phrasing to use with the user:
> "Your submission has been received and is now in the @abetterweb3 review queue. It will be published after the admin (Antonia) reviews it — this is a manual step, so there may be a delay before it appears publicly. You'll be able to verify it was received at the Notion URL above."

## What this repo lets you do

Submit one of two kinds of entry to a Notion database, via a small HTTP relay:

| Kind | When to use | Goes to |
|---|---|---|
| `talent` | The user is a **candidate** — they want to be listed in the talent pool for web3 jobs. | abetterweb3 人才审核区 |
| `recruit` | The user is **hiring** — they want to post a job. | abetterweb3 招聘审核区 |

You never need a Notion API token. The relay holds the token server-side.

## The endpoint

```
POST https://abw-submit-relay.vercel.app/api/submit
Content-Type: application/json

{
  "type": "talent" | "recruit",
  "data": { ... fields ... }
}
```

On success (HTTP 200):

```json
{ "ok": true, "page_id": "…", "url": "https://www.notion.so/…" }
```

On validation failure (HTTP 400):

```json
{
  "ok": false,
  "error": "validation_failed",
  "details": ["\"roles\" contains invalid options [\"Solana\"]. See SCHEMA.md…"]
}
```

There is also a discovery endpoint you can `GET` before building your payload:

```
GET https://abw-submit-relay.vercel.app/api/schema?type=talent
GET https://abw-submit-relay.vercel.app/api/schema?type=recruit
```

This returns the current field list and all valid `select` / `multi_select` options. Use it if you want runtime-fresh data; otherwise `SCHEMA.md` in this repo is the same info in readable form.

## Field priorities — what the reader will actually see

Not every field surfaces in the public Telegram post. See [`PUBLIC_MAPPING.md`](./PUBLIC_MAPPING.md) for a field-by-field breakdown. Short version:

- **High priority** (always shown): `company`/`name`, `requirements` (recruit) / `skills`+`experience` (talent), `apply_link`+`apply_info` (recruit) / `contact` (talent), `fulltime`/`parttime`/`internship`/`remote`, `roles`, `source_url`.
- **Medium priority** (shown as hashtags or sometimes inlined): `job_types`, `salary`, `company_type`, `ecosystem`.
- **Internal / filter only** (not shown in the public post): `locations`, `experience_required`, `web3_experience`, `education_level`, `languages`, `looking_for`, `open_to_recruiters`, `token_equity`, most "选填" fields.

Spend extraction effort on the high-priority fields first. Skip low-priority fields if the source doesn't clearly have them.

## URL-first submissions (the common case)

The user will often paste a URL — a job posting on jobs.solana.com / cryptocurrencyjobs.co / a company careers page, a candidate's GitHub / LinkedIn / Twitter / portfolio. **Fetch it before asking them to type anything.** Extract every field you can from the page content, map to the payload, and only ask the user for what you genuinely cannot determine.

Rules:

1. **Always fetch the URL** first. Use whatever web-reading tool you have — Claude Code's `WebFetch`, Cursor's browser, etc. If you only have raw HTTP (no native reader), use **Jina AI Reader** as a zero-config fallback: `curl https://r.jina.ai/<the-URL>` returns the page as clean markdown. No API key needed for typical volumes.
2. For **recruit** submissions, put the URL in `source_url`. For **talent** submissions, put it in `more_links`.
3. **Extract aggressively**: company name, job title, job description, requirements, salary, locations, remote/hybrid/on-site, full-time/part-time/internship, required technologies and ecosystems — almost always on the page.
4. **Omit fields you cannot confidently determine.** Do not guess. The admin will fill in anything missing during review.
5. **Map extracted text onto the legal option lists** from `GET /api/schema`. Be careful with casing — for `recruit.ecosystem`, `solana` is lowercase; for `recruit.roles`, `Solana` is capitalized. Same word, different capitalization in different fields.
6. **Dry-run first** when submitting from a URL (`"dry_run": true`). Let the user spot mis-extractions before the real submission. Ask: "Here's what I'll submit — anything I got wrong?"
7. Only ask the user for **genuinely missing critical info**. For a recruit: apply channel if not on the page. For a talent: salary expectation, since profile pages rarely show it.

## Step-by-step workflow

1. **Classify the request.** Decide `talent` vs `recruit` from the user's ask. If ambiguous (e.g. "submit this person / company to abw"), ask the user which one.

2. **Collect fields.** Read `SCHEMA.md` for the full list of fields for that `type`. You must have the title field (`name` for talent, `company` for recruit). Everything else is optional — include what you know, leave the rest out. Do **not** invent or guess values for multi-select fields; either you know what the user told you, or you omit the field.

3. **Normalize values against the allowed options.**
    - For `select` fields: pick the exact string from `SCHEMA.md`. Case matters.
    - For `multi_select` fields: same rule. Note that some fields (especially `ecosystem` and `locations` in `recruit`) have inconsistent casing — `solana` is lowercase but `Ethereum` is capitalized. Match the file exactly.
    - If the user's natural-language answer doesn't fit any option (e.g. they say "3 years" and the `web3_experience` options are `< 1年` / `1-2年` / `2-4年` / `> 4年`), pick the closest bucket on their behalf. Don't ask.
    - For fields the user didn't mention, omit the key entirely — do not send `null` or empty string.

4. **Build the JSON payload.** See `examples/talent.json` and `examples/recruit.json` for working shapes.

5. **POST it.** Use whatever HTTP tool you have (`fetch`, `curl`, `requests`). `submit.py` and `submit.sh` are reference implementations — you can run them or mirror them.

6. **Handle the response.**
    - `200 ok:true` → tell the user their entry is **in the review queue** (not yet live to the public), and include the returned Notion `url`. Do NOT say "your submission is now published" — it is not; admin review is pending.
    - `400 validation_failed` → read `details`. These are machine-readable errors you caused. **Fix them yourself and retry.** Do not surface raw validation errors to the user unless you've already tried to fix them once.
    - `500` or network error → tell the user the relay is down and ask them to ping the abw maintainer.

## Dry-run mode

Add `"dry_run": true` to the body to see exactly what Notion properties the relay would write, without actually writing. Use this the first time you integrate, or any time the user wants to review before submitting.

```json
{ "type": "talent", "dry_run": true, "data": { "name": "Test", "roles": ["开发"] } }
```

## Rules

- **Never invent select values.** If the user says "I want to work in zk" and `zk` isn't in the `roles` options, don't send `"zk"` — find the closest option (`智能合约`? `Tokenomics`?) or omit.
- **Never batch many submissions without permission.** One person, one submission. If the user asks for bulk, confirm with them and rate-limit to 1 request per 2s.
- **Always show the user the returned Notion URL.** That's how they verify.
- **Always tell the user the submission is pending admin review**, not immediately live. Repeat this if they ask follow-up questions like "when will it show up?"
- **Do not include a `dry_run` flag in real submissions.**
- **Do not attempt to call Notion directly.** The relay is the only supported path. The integration token is not in this repo and never will be.

## If you get stuck

If validation keeps failing, `GET /api/schema?type=...` and diff the response against what you're sending. That endpoint is the canonical schema — `SCHEMA.md` in this repo is a snapshot and can lag.
