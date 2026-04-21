# Where each field surfaces in the final public post

When an @abetterweb3 admin approves a submission, it gets published to the public Telegram channel in a specific format. This page shows **where each submittable field ends up in the public post**, so you and your human can prioritize what matters.

Public Telegram example (real post, April 20):

```
abetterweb3 招聘求职              April 20
#招聘
Trust Wallet - 钱包
https://trustwallet.com/
$TWT: $178M

#全职 #开发 #全栈 #区块链 #数据 #云 #产品 #运营 #市场
1. Senior Full Stack Engineer (AI/ Web3)
2. Senior Blockchain Engineer (Rust)
3. Senior Data Engineer (AWS\ Databricks\ Data Pipeline)
4. Senior Platform Engineer (Cloud Native\ K8S\ Go\ AWS)
5. Product Lead (Wallet experience)
6. Growth Director

岗位要求：
1. 中英文流利…
…

✅远程

投递
@YingCTW

✅企业邮箱已认证

更多在招
https://jobs.ashbyhq.com/trust-wallet
```

## `recruit` — field → public position

| Submission field | Appears in public post as | Visibility & notes |
|---|---|---|
| `company` | **Title line** (first word: `Trust Wallet - 钱包`) | Always shown. Keep it exact. |
| `company_type` | **Title line** (appended after the dash: `- 钱包`) | Only the first selected value is used in the title. Pick the most defining one first. |
| `apply_link` | **Link line** (`https://trustwallet.com/`) | Always shown if present. This is usually the company's main site. |
| `source_url` | **"更多在招" block at the bottom** | Shown at the bottom as `更多在招 / <url>`. Use for the external aggregator URL you found the job on (ashbyhq, greenhouse, jobs.solana.com, etc.), not the company site. |
| `requirements` | **Main text block** (the "Senior Full Stack Engineer…" body) | The whole block shown verbatim, line breaks preserved. **This is the single most important field — it's what readers actually read.** Put the roles list + requirements here, in Chinese or bilingual. |
| `job_description` | Usually merged with `requirements` by admin, or omitted | If you only have one blob of text, put it in `requirements`. Use `job_description` only if you clearly have two distinct blocks (role summary vs. requirements). |
| `fulltime` / `parttime` / `internship` | **Hashtag row** (`#全职` / `#兼职` / `#实习`) | Each `true` checkbox becomes one hashtag at the start of the hashtag row. |
| `roles` | **Hashtag row** (each value → `#开发`, `#产品`, etc.) | Admin may trim, reorder, or rename a few tags before publishing. Submit what the company listed; admin normalizes. |
| `job_types` | Hashtag row / narrower tags | Same rule. `求职意向` (roles) is the broad tag list; `涉及工种` (job_types) is granular. Both feed the hashtag row; admin decides final mix. |
| `remote` | **`✅远程` line** | Shown as a single line before the apply section iff `true`. |
| `apply_info` | **`投递` line** (`投递 / @YingCTW`) | Shown verbatim. Use for Telegram handle, contact name, or brief apply instructions. |
| `contact_email` | **`✅企业邮箱已认证` badge** | Shown as a green verified badge **only if** the admin confirms the email is a genuine corporate domain. Not shown as a raw address. |
| `salary` | Sometimes inlined into the main block (varies by post) | Admin may splice into the requirements block, or use it only for internal sorting. Include it when you have it. |
| `benefits` | Rarely shown in the public post | Visible in Notion for admins; sometimes copied into the main text block. Low priority. |
| `ecosystem` | Not usually in the hashtag row | Used for internal filtering. Include it to help admins and future readers filter. |
| `locations` | Not usually shown directly in the Telegram post | Only `✅远程` renders explicitly. For physical locations, the admin may or may not inline them. Still worth including for filter / discovery. |
| `experience_required` | Not shown in the Telegram post | Filter/internal only. |
| `web3_experience` | Not shown in the Telegram post | Filter/internal only. |
| `education_level` | Not shown in the Telegram post | Filter/internal only. |
| `languages` | Not shown in the Telegram post | Filter/internal only. |
| `looking_for` | Not shown in the Telegram post | Filter/internal only. |
| `token_equity` | Not shown directly | Occasionally noted in the main block; admin judgment. |
| `open_to_recruiters` | Not shown in public post | Filter/internal only — tells recruiters whether this company welcomes recruiter outreach. |

## Admin-added fields (not in the submission API)

The admin may add these during review — you don't submit them:

- **Ticker / market cap line** (e.g. `$TWT: $178M`) — added manually by admin for listed tokens. Don't try to fake this.
- **`✅企业邮箱已认证`** — admin flips this on after verifying the email domain.
- **Date header + `#招聘` tag** — added by the publishing pipeline automatically.

## `talent` — field → public position

(Talent posts follow a different template. Rough mapping:)

| Submission field | Public visibility |
|---|---|
| `name` | Title line (handle / name). Always shown. |
| `contact` | Apply / contact line. Always shown. |
| `roles` | Hashtag row. Always shown. |
| `skills` + `experience` | Main text body. High priority. |
| `web3_experience` | Shown as a tag (e.g. `#2-4年`). |
| `languages` | Shown as tags if non-default. |
| `fulltime` / `parttime` / `internship` / `remote_only` / `is_student` | Each `true` becomes a hashtag / badge. |
| `looking_for` | May be shown as a status tag. |
| `salary_expectation` | Optional, inlined. |
| `more_links` | Shown at the bottom ("更多链接") when present. |
| `education_level` / `education` / `major` / `graduation` | Internal/filter only, rarely in the public post. |
| `open_to_recruiters` | Internal flag for recruiters. |

## Agent priority checklist

When extracting from a URL or collecting from the user, spend your effort here, in this order:

1. **`company` / `name`** — required, always shown.
2. **`requirements`** (recruit) or **`skills` + `experience`** (talent) — the main text body; do the most extraction work here.
3. **Employment-type checkboxes** — `fulltime` / `parttime` / `internship` / `remote` — these become the leading hashtags.
4. **`roles`** + **`job_types`** — feed the hashtag row.
5. **`apply_link`** + **`apply_info`** (recruit) / **`contact`** (talent) — how the reader acts on the post.
6. **`source_url`** — drop in the aggregator URL so the "更多在招" block links back.
7. **Company/role metadata** (`company_type`, `ecosystem`, `experience_required`, `locations`, `salary`) — improves discovery and review; include when easy to extract, skip when not obvious.
8. Everything else — submit only what the user explicitly gave you.
