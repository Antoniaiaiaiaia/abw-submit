// Generates SCHEMA.md from the snapshot JSON files in ../schemas/.
// Re-run whenever the Notion databases change.
//
//   node scripts/generate-schema-doc.mjs
//
// Input:  ./schemas/talent_raw.json, ./schemas/recruit_raw.json
// Output: ./SCHEMA.md

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const TALENT_MAP = {
  name: { prop: 'Name', type: 'title', desc: 'Candidate name or handle (required)' },
  contact: { prop: '联系方式', type: 'rich_text', desc: 'How to reach them — Telegram / Twitter / email / WeChat' },
  web3_experience: { prop: 'web3经验', type: 'select', desc: 'Years of web3 experience' },
  roles: { prop: '求职意向', type: 'multi_select', desc: 'Roles the candidate is open to' },
  skills: { prop: '擅长', type: 'rich_text', desc: 'Free-text strengths, e.g. "Solidity, React, fuzz testing"' },
  experience: { prop: '经历', type: 'rich_text', desc: 'Career highlights in prose' },
  education_level: { prop: '学位（选填）', type: 'select', desc: 'Highest degree (optional)' },
  education: { prop: '教育背景（选填）', type: 'rich_text', desc: 'School / program (optional)' },
  major: { prop: '专业（选填）', type: 'rich_text', desc: 'Major / field of study (optional)' },
  graduation: { prop: '毕业时间（选填）', type: 'rich_text', desc: 'Graduation year or range (optional)' },
  languages: { prop: '语言', type: 'multi_select', desc: 'Spoken languages' },
  looking_for: { prop: '合作心态', type: 'select', desc: 'How actively they are looking' },
  salary_expectation: { prop: '待遇期待', type: 'rich_text', desc: 'Free-text salary expectation' },
  more_links: { prop: '更多链接', type: 'rich_text', desc: 'GitHub, personal site, past work — one per line' },
  fulltime: { prop: '全职', type: 'checkbox', desc: 'Open to full-time' },
  parttime: { prop: '兼职', type: 'checkbox', desc: 'Open to part-time' },
  internship: { prop: '实习', type: 'checkbox', desc: 'Open to internships' },
  remote_only: { prop: '只看远程', type: 'checkbox', desc: 'Only wants remote work' },
  is_student: { prop: '在校/应届', type: 'checkbox', desc: 'Currently a student or new grad' },
  open_to_recruiters: { prop: '猎头对接', type: 'checkbox', desc: 'OK with recruiter outreach' },
};

const RECRUIT_MAP = {
  company: { prop: 'Company', type: 'title', desc: 'Company or project name (required)' },
  contact_email: { prop: '企业邮箱', type: 'rich_text', desc: 'Company contact email' },
  source_url: { prop: '来源', type: 'url', desc: 'Original job posting URL (where you found it)' },
  apply_link: { prop: 'link', type: 'url', desc: 'Direct apply link, if different from source' },
  job_description: { prop: '岗位描述', type: 'rich_text', desc: 'What the role does' },
  requirements: { prop: '岗位需求', type: 'rich_text', desc: 'What the company is looking for' },
  salary: { prop: '薪酬', type: 'rich_text', desc: 'Salary info, free-text' },
  benefits: { prop: '待遇/工作环境', type: 'rich_text', desc: 'Benefits and work environment, free-text' },
  apply_info: { prop: '投递', type: 'rich_text', desc: 'How to apply — contact info, process, etc.' },
  roles: { prop: '求职意向', type: 'multi_select', desc: 'Role tags / target candidate roles' },
  job_types: { prop: '涉及工种', type: 'multi_select', desc: 'Granular job categories for this posting' },
  experience_required: { prop: '经验', type: 'multi_select', desc: 'Required years of experience' },
  ecosystem: { prop: '生态', type: 'multi_select', desc: 'Blockchain ecosystems relevant to the role (note: casing is inconsistent; use exactly the values below)' },
  company_type: { prop: '类型', type: 'multi_select', desc: 'Company category / sector' },
  locations: { prop: '办公区域', type: 'multi_select', desc: 'Office locations or time zones' },
  languages: { prop: '语言', type: 'multi_select', desc: 'Required spoken languages' },
  web3_experience: { prop: 'web3经验', type: 'select', desc: 'Required years of web3 experience' },
  education_level: { prop: '学位（选填）', type: 'select', desc: 'Required education level (optional)' },
  looking_for: { prop: '合作心态', type: 'select', desc: 'Hiring posture' },
  fulltime: { prop: '全职', type: 'checkbox', desc: 'Full-time role' },
  parttime: { prop: '兼职', type: 'checkbox', desc: 'Part-time role' },
  internship: { prop: '实习', type: 'checkbox', desc: 'Internship role' },
  remote: { prop: '远程', type: 'checkbox', desc: 'Remote allowed' },
  open_to_recruiters: { prop: '猎头对接', type: 'checkbox', desc: 'Recruiter outreach welcome' },
  token_equity: { prop: '币权/NFT', type: 'checkbox', desc: 'Compensation includes token / NFT equity' },
};

const TITLE_KEY = { talent: 'name', recruit: 'company' };

function renderSection(type, map) {
  const raw = JSON.parse(readFileSync(resolve(root, `schemas/${type}_raw.json`), 'utf8'));
  const notionProps = raw.properties;
  const lines = [];
  lines.push(`## \`${type}\` — ${type === 'talent' ? 'Talent pool' : 'Recruitment board'}`);
  lines.push('');
  lines.push(`Title key: \`${TITLE_KEY[type]}\` (required, non-empty string)`);
  lines.push('');
  lines.push('| Key | Type | Description |');
  lines.push('|---|---|---|');

  for (const [key, m] of Object.entries(map)) {
    lines.push(`| \`${key}\` | ${m.type} | ${m.desc} |`);
  }
  lines.push('');

  const selects = Object.entries(map).filter(([, m]) => m.type === 'select');
  if (selects.length) {
    lines.push(`### ${type}: valid \`select\` options`);
    lines.push('');
    for (const [key, m] of selects) {
      const opts = notionProps[m.prop]?.select?.options?.map((o) => o.name) ?? [];
      lines.push(`- **\`${key}\`**: ${opts.map((o) => `\`${o}\``).join(', ')}`);
    }
    lines.push('');
  }

  const multis = Object.entries(map).filter(([, m]) => m.type === 'multi_select');
  if (multis.length) {
    lines.push(`### ${type}: valid \`multi_select\` options`);
    lines.push('');
    for (const [key, m] of multis) {
      const opts = notionProps[m.prop]?.multi_select?.options?.map((o) => o.name) ?? [];
      lines.push(`<details><summary><b><code>${key}</code></b> (${opts.length} options)</summary>`);
      lines.push('');
      lines.push(opts.map((o) => `\`${o}\``).join(', '));
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }
  }
  return lines.join('\n');
}

const header = `# Field schema

Source of truth for all fields accepted by the relay. Auto-generated from the live Notion schema snapshots in \`schemas/\`. If something here looks stale, re-run \`node scripts/generate-schema-doc.mjs\`.

**Payload shape:**

\`\`\`json
{
  "type": "talent" | "recruit",
  "data": { ... fields below ... }
}
\`\`\`

- Unknown keys are rejected with \`400\` — do not invent fields.
- \`select\` values must exactly match one option from the list (case-sensitive).
- \`multi_select\` values must each match one option from the list (case-sensitive).
- \`checkbox\` values must be boolean \`true\` / \`false\`.
- \`url\` values must start with \`http://\` or \`https://\`.
- \`rich_text\` and \`title\` values are plain strings.

`;

const body = [renderSection('talent', TALENT_MAP), renderSection('recruit', RECRUIT_MAP)].join('\n---\n\n');

writeFileSync(resolve(root, 'SCHEMA.md'), header + body + '\n');
console.log(`Wrote ${resolve(root, 'SCHEMA.md')}`);
