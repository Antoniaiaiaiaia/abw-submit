# URL-fetching tools for agents

Picking a way to fetch the page the user pasted. Ordered from least-setup to most.

## 0. Native tool in your runtime (zero setup if you have one)

Before reaching for anything else, check if your runtime already gives you a web-fetcher:

| Runtime | Tool |
|---|---|
| Claude Code (CLI) | Built-in `WebFetch` tool |
| Claude Desktop / Projects | Built-in web search / browsing |
| Cursor | Built-in `@Web` / browser tool |
| ChatGPT (browsing enabled) | Built-in browser |
| Aider | `/web <url>` — [Aider-AI/aider](https://github.com/Aider-AI/aider) |
| Cline | `web_fetch` tool — [cline/cline](https://github.com/cline/cline) |
| OpenHands | Browsing tool — [All-Hands-AI/OpenHands](https://github.com/All-Hands-AI/OpenHands) |
| Continue.dev | `@url` context provider — [continuedev/continue](https://github.com/continuedev/continue) |

## 1. Hosted HTTP services (works from any `curl`-capable agent)

Zero install — just hit a URL. Good for agents that can send HTTP but have no native page-reader.

### Jina AI Reader *(recommended first choice)*

- **Usage:** `curl https://r.jina.ai/https://example.com/page`
- **Returns:** clean markdown, ready to feed into an LLM
- **Auth:** none for typical volumes; register for higher rate limits
- **Repo:** [jina-ai/reader](https://github.com/jina-ai/reader)
- **Good for:** 90% of pages — static sites, job postings, blog posts, docs. Handles most JS rendering.

### Firecrawl

- **Usage:** `POST https://api.firecrawl.dev/v1/scrape` with `{"url": "..."}`
- **Returns:** markdown, HTML, or structured data (LLM extraction as an option)
- **Auth:** free tier + paid plans
- **Repo:** [mendableai/firecrawl](https://github.com/mendableai/firecrawl) *(also self-hostable)*
- **Good for:** JS-heavy SPAs, sites that fight Jina, when you want a structured-data extraction API in one call.

### Exa (search + contents)

- **Usage:** `POST https://api.exa.ai/contents` with an array of URLs or search queries
- **Returns:** full page text + metadata
- **Auth:** API key required, paid with free tier
- **Repo:** [exa-labs/exa-js](https://github.com/exa-labs/exa-js), [exa-labs/exa-py](https://github.com/exa-labs/exa-py)
- **Good for:** when you also want to *find* similar pages (e.g. "other openings at this company"), not just read one.

### Tavily

- **Usage:** `POST https://api.tavily.com/extract` with `{"urls": [...]}`
- **Returns:** extracted main content + metadata
- **Auth:** API key, free tier
- **Repo:** [tavily-ai/tavily-python](https://github.com/tavily-ai/tavily-python)
- **Good for:** agent-optimized search + content extraction combo.

### Browserless *(paid / self-hostable)*

- **Usage:** `POST https://chrome.browserless.io/content?token=...`
- **Returns:** rendered HTML from a real Chrome instance
- **Auth:** API key (cloud) or self-host
- **Repo:** [browserless/browserless](https://github.com/browserless/browserless)
- **Good for:** pages that require JS execution, login flows, or heavy interaction. Overkill for job postings, useful for LinkedIn-style sites.

## 2. Self-hosted libraries / CLIs (for bespoke agents)

If you're running your own agent loop and can install dependencies.

### Crawl4AI

- **Install:** `pip install crawl4ai`
- **Returns:** LLM-ready markdown with CSS-selector extraction options
- **Repo:** [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai)
- **Good for:** agents specifically designed to feed LLM pipelines; supports async batch crawling.

### Playwright

- **Install:** `pip install playwright` or `npm i playwright`
- **Returns:** whatever you code — HTML, text, screenshots, PDFs
- **Repo:** [microsoft/playwright](https://github.com/microsoft/playwright), [microsoft/playwright-python](https://github.com/microsoft/playwright-python)
- **Good for:** full browser control, login flows, pages with heavy interaction. Highest effort, highest capability.

### Puppeteer

- **Install:** `npm i puppeteer`
- **Repo:** [puppeteer/puppeteer](https://github.com/puppeteer/puppeteer)
- **Good for:** same space as Playwright, Node-only; slightly older ecosystem.

### trafilatura *(Python, lightweight)*

- **Install:** `pip install trafilatura`
- **Usage:** `trafilatura.extract(downloaded_html)`
- **Repo:** [adbar/trafilatura](https://github.com/adbar/trafilatura)
- **Good for:** when you already have the HTML and want clean article text without a full browser.

### Mozilla Readability *(JS, Firefox's Reader View algorithm)*

- **Install:** `npm i @mozilla/readability`
- **Repo:** [mozilla/readability](https://github.com/mozilla/readability)
- **Good for:** Node-based agents that want the same "Reader view" extraction Firefox uses.

### newspaper3k *(Python, article-focused)*

- **Install:** `pip install newspaper3k`
- **Repo:** [codelucas/newspaper](https://github.com/codelucas/newspaper)
- **Good for:** news/blog articles specifically (detects author, date, title cleanly).

## 3. Last-resort fallback: ask the user

If none of the above works (sandboxed agent with no network at all, CORS wall, paywall, heavy anti-bot), the right move is not to give up or invent data — it's to ask the user:

> "I can't reach that page from here. Can you paste the job description text directly? I'll extract the fields from what you paste."

Extract from whatever they paste. Never invent fields because you couldn't fetch.

## Recommendation for the abw-submit use case

Most abw users will paste one of:
- A job-board posting (jobs.solana.com, cryptocurrencyjobs.co, greenhouse.io, ashbyhq.com, lever.co, workable.com)
- A company careers page (usually static, SSR-rendered)
- A candidate profile (GitHub, Twitter/X, personal site)

**Default**: native tool → Jina Reader → user paste. This covers ≥95% of cases with zero dependencies for the agent developer.

Reach for Firecrawl / Playwright only when the default fails on a specific site (typically LinkedIn, Indeed, or heavy SPA job boards that block simpler fetchers).
