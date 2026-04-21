# URL-fetching tools for agents

The user pastes a URL. Your job is to turn it into structured fields. Pick a fetch method by this priority:

> **Tier 1: efficient content extractors** (markdown / clean text in one HTTP call)
> **Tier 2: headless browser control** (when the page needs real JS execution)
> **Tier 3: ask the user** (if nothing else works, don't invent)

Do not reach for Tier 2 until Tier 1 has actually failed on the specific URL. Browsers are heavy; most job postings don't need one.

---

## Tier 1 — efficient extractors (preferred)

Zero-install, single HTTP call, returns LLM-ready content. Use these first.

### Jina AI Reader ⭐ recommended first

- **Usage:** `curl https://r.jina.ai/https://example.com/page`
- **Returns:** clean markdown
- **Auth:** none for typical volumes; register for higher limits
- **Repo:** [jina-ai/reader](https://github.com/jina-ai/reader)
- **Good for:** 90% of pages — static sites, job boards, blogs, docs. Handles moderate JS rendering server-side. **Also handles PDFs natively** — `curl https://r.jina.ai/https://example.com/resume.pdf` returns extracted markdown from the PDF. Useful for candidate résumés and PDF job listings.

### OpenCLI ⭐ also recommended

- **Usage:** `npm i -g @jackwener/opencli` then `opencli <site> <command>` (e.g. `opencli hackernews top --limit 5`)
- **Returns:** deterministic structured output from the user's **already-logged-in Chrome** session
- **Auth:** uses whatever you're already logged into in Chrome — great for pages behind auth (LinkedIn, internal ATSes)
- **Repo:** [jackwener/OpenCLI](https://github.com/jackwener/OpenCLI)
- **Good for:** pages Jina can't reach (login-gated, tracking-blocked, SPA-heavy). Bridges the gap between "HTTP-only extractors" and "spin up a headless browser" — you already have Chrome, this is a thin CLI over it.

### Firecrawl

- **Usage:** `POST https://api.firecrawl.dev/v1/scrape` with `{"url": "..."}`
- **Returns:** markdown, HTML, or LLM-structured data
- **Auth:** free tier + paid
- **Repo:** [mendableai/firecrawl](https://github.com/mendableai/firecrawl) *(also self-hostable)*
- **Good for:** JS-heavy pages Jina chokes on; when you want a built-in structured extraction.

### Crawl4AI (self-hosted CLI / Python)

- **Usage:** `pip install crawl4ai` + `crawl4ai-cli <url>` or the Python SDK
- **Returns:** LLM-ready markdown, supports CSS-selector extraction and async batch
- **Repo:** [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai)
- **Good for:** bespoke agent loops running locally; batch processing.

### Exa (search + contents)

- **Usage:** `POST https://api.exa.ai/contents`
- **Returns:** full text + metadata
- **Auth:** API key, free tier
- **Repo:** [exa-labs/exa-js](https://github.com/exa-labs/exa-js), [exa-labs/exa-py](https://github.com/exa-labs/exa-py)
- **Good for:** when you also want to find *similar* pages (e.g. "other roles at this company") in one call.

### Tavily

- **Usage:** `POST https://api.tavily.com/extract` with `{"urls": [...]}`
- **Returns:** main content extraction, agent-optimized
- **Auth:** API key, free tier
- **Repo:** [tavily-ai/tavily-python](https://github.com/tavily-ai/tavily-python)
- **Good for:** agent pipelines that already use Tavily for search.

### Native runtime tool

If your runtime has one, it's usually a Tier-1-equivalent wrapper around one of the above.

| Runtime | Tool |
|---|---|
| Claude Code | `WebFetch` (built-in) |
| Cursor | `@Web` / browser tool |
| Aider | `/web <url>` — [Aider-AI/aider](https://github.com/Aider-AI/aider) |
| Cline | `web_fetch` — [cline/cline](https://github.com/cline/cline) |
| OpenHands | Browsing tool — [All-Hands-AI/OpenHands](https://github.com/All-Hands-AI/OpenHands) |
| Continue.dev | `@url` — [continuedev/continue](https://github.com/continuedev/continue) |

---

## Tier 2 — headless browser control (use when Tier 1 fails)

For sites that fight simpler fetchers: LinkedIn, Indeed, heavy SPAs, pages with login walls or anti-bot checks.

Slower and heavier — only reach for these after Tier 1 has actually returned an empty / blocked / wrong page.

### Browserbase *(hosted)*

- **Usage:** API-driven cloud browsers; connect via Playwright / Puppeteer over CDP
- **Auth:** paid (with free tier)
- **Repo / SDK:** [browserbase/sdk-node](https://github.com/browserbase/sdk-node), [browserbase/sdk-python](https://github.com/browserbase/sdk-python)
- **Good for:** production agents that need reliable headless Chrome without managing infra. Handles anti-bot footprints better than local Playwright.

### Chrome DevTools MCP *(if your agent is MCP-enabled)*

- **Usage:** connect via the Chrome DevTools MCP server; your agent gets a `take_snapshot`, `navigate_page`, `click`, etc. toolbox
- **Repo:** [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- **Good for:** Claude Desktop / Cursor users who already run MCP; drive a real Chrome attached to the user's profile (handles logins for free).

### Playwright

- **Install:** `pip install playwright` / `npm i playwright`
- **Repo:** [microsoft/playwright](https://github.com/microsoft/playwright), [microsoft/playwright-python](https://github.com/microsoft/playwright-python)
- **Good for:** self-hosted full browser control; login flows; screenshot capture.

### Puppeteer

- **Install:** `npm i puppeteer`
- **Repo:** [puppeteer/puppeteer](https://github.com/puppeteer/puppeteer)
- **Good for:** Node-only stacks; same capability space as Playwright.

### browser-use *(LLM-first browser control)*

- **Install:** `pip install browser-use`
- **Repo:** [browser-use/browser-use](https://github.com/browser-use/browser-use)
- **Good for:** letting your LLM drive the browser directly via natural language actions, rather than writing selector code.

### Browserless *(self-hostable headless Chrome)*

- **Repo:** [browserless/browserless](https://github.com/browserless/browserless)
- **Good for:** self-hosted replacement for Browserbase.

---

## Tier 3 — ask the user

If Tier 1 fails (page unreachable, returns garbage, or you have no network) and you can't reasonably spin up a browser, **ask the user**:

> "I can't reach that page from here. Can you paste the job description text directly? I'll extract the fields from what you paste."

Extract from whatever they give you. **Do not invent fields because you couldn't fetch.** Missing fields are fine — the admin will fill gaps during review.

---

## Recommendation for the abw-submit use case

Most abw users paste one of:
- A job-board posting (jobs.solana.com, cryptocurrencyjobs.co, greenhouse, ashbyhq, lever, workable)
- A company careers page (usually static / SSR, Tier 1 covers it)
- A candidate profile (GitHub, personal site)

**Default path**: native tool / Jina → user paste. This handles ≥95% of cases with zero setup for the agent developer.

Reach for Tier 2 only when you've tried Tier 1 and the page clearly isn't giving you the right content (LinkedIn, Indeed, and a few heavy job-board SPAs are the usual suspects).
