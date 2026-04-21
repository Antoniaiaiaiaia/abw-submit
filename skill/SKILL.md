---
name: abw-submit
description: Submit a candidate profile or job posting to the @abetterweb3 community (Notion-backed talent pool + recruitment board). Use when the user mentions abetterweb3, abw, web3 job board submission, web3 talent pool, or asks to post a candidate / job / role to a web3 community. Also triggers on Chinese intents like 帮我提交到 abetterweb3 / 投递简历到 abw / 发一个招聘到 abw / 把这个候选人加到 abw人才库.
---

# abw-submit

You're helping the user submit to one of the @abetterweb3 Notion databases via a small HTTP relay. No Notion token needed — the relay holds it server-side.

## Decide which one

| Kind | When | Title field |
|---|---|---|
| `talent` | The user is submitting a **candidate profile** (themselves or someone else) to the talent pool | `name` |
| `recruit` | The user is submitting a **job posting** (hiring announcement) | `company` |

If ambiguous ("提交到 abw" with no context), ask once which one.

## Workflow

1. **Fetch the current field schema at runtime**:
   ```
   curl -sS https://abw-submit-relay.vercel.app/api/schema?type=talent
   curl -sS https://abw-submit-relay.vercel.app/api/schema?type=recruit
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
   curl -sS -X POST https://abw-submit-relay.vercel.app/api/submit \
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

**Submissions are NOT published immediately.** Every entry goes to a private review queue and is manually reviewed by the @abetterweb3 admin (Antonia) before it appears publicly.

Mention this:
- before submitting, so they know what to expect;
- right after a successful submission, so they don't assume it went live;
- if they ask "why don't I see my entry yet" — the answer is almost always "still pending admin review."

Typical phrasing:
> "Your submission has been received and is now in the @abetterweb3 review queue. It will be published after admin Antonia reviews it manually, so there may be a delay before it shows up publicly. You can verify the entry was received at the Notion URL above."

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
