// Sanitizes the Notion schema snapshots in ../schemas/ for public publication.
// Strips internal workspace metadata (user IDs, parent block IDs, request IDs,
// S3-signed cover/icon URLs) while keeping what the generator needs:
// `object`, `id`, `title`, `description`, `properties`, `is_inline`, `archived`,
// `in_trash`, `created_time`, `last_edited_time`.
//
// Also recursively strips `href` and `text.link.url` from rich_text entries
// (database description + property descriptions) — Notion embeds internal
// workspace page URLs there that leak otherwise.
//
// Run after re-snapshotting the databases, before `generate-schema-doc.mjs`:
//
//   node scripts/sanitize-schema.mjs
//
// Overwrites ./schemas/*.json in place.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemasDir = resolve(__dirname, '..', 'schemas');

const KEEP_TOP_LEVEL = new Set([
  'object',
  'id',
  'title',
  'description',
  'properties',
  'is_inline',
  'archived',
  'in_trash',
  'created_time',
  'last_edited_time',
]);

// Recursively null out any embedded URL-shaped fields that could leak
// internal workspace pages (rich_text hrefs, inline link.url, etc.).
// Returns a new value; does not mutate.
function scrubLinks(value) {
  if (Array.isArray(value)) {
    return value.map(scrubLinks);
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === 'href') {
        // Null out top-level href on rich_text entries — it duplicates
        // `text.link.url` for link spans. Drop entirely.
        out[k] = null;
      } else if (k === 'link' && v && typeof v === 'object' && 'url' in v) {
        // Notion's text.link = { url: "..." } — drop the URL, keep the
        // object shape as null so downstream code that checks for `.link`
        // still sees a plain (non-linked) text span.
        out[k] = null;
      } else {
        out[k] = scrubLinks(v);
      }
    }
    return out;
  }
  return value;
}

for (const file of readdirSync(schemasDir).filter((f) => f.endsWith('.json'))) {
  const path = resolve(schemasDir, file);
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  const clean = {};
  for (const k of Object.keys(raw)) {
    if (KEEP_TOP_LEVEL.has(k)) clean[k] = scrubLinks(raw[k]);
  }
  writeFileSync(path, JSON.stringify(clean, null, 2) + '\n');
  console.log(`Sanitized ${file}`);
}
