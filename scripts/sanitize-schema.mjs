// Sanitizes the Notion schema snapshots in ../schemas/ for public publication.
// Strips internal workspace metadata (user IDs, parent block IDs, request IDs,
// S3-signed cover/icon URLs) while keeping what the generator needs:
// `object`, `id`, `title`, `description`, `properties`, `is_inline`, `archived`,
// `in_trash`, `created_time`, `last_edited_time`.
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

const KEEP = new Set([
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

for (const file of readdirSync(schemasDir).filter((f) => f.endsWith('.json'))) {
  const path = resolve(schemasDir, file);
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  const clean = {};
  for (const k of Object.keys(raw)) {
    if (KEEP.has(k)) clean[k] = raw[k];
  }
  writeFileSync(path, JSON.stringify(clean, null, 2) + '\n');
  console.log(`Sanitized ${file}`);
}
