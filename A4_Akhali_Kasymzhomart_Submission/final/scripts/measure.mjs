// Counts the measures used in the quality comparison, the same way for any version of the project.
// Usage: node scripts/measure.mjs <project-dir>
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? '.';
const src = join(root, 'src');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const all = walk(src);
const isTest = (f) => /\.test\.tsx?$/.test(f) || f.includes(`${'/'}test${'/'}`);
const code = all.filter((f) => /\.(ts|tsx)$/.test(f) && !isTest(f) && !f.endsWith('vite-env.d.ts'));
const tests = all.filter((f) => /\.test\.tsx?$/.test(f));
const read = (f) => readFileSync(f, 'utf8');
const lines = (f) => read(f).split('\n').length - (read(f).endsWith('\n') ? 1 : 0);

// A "rule copy" = one place where the same rule/literal is written out again (references to a named constant do not count).
const RULES = [
  { id: 'D1', name: 'day limit 1440 written as a literal', re: /\b1440\b/, skip: /^\s*\/\// },
  { id: 'D2', name: 'booking limit 120 written as a literal (rule data excluded)', re: /\b120\b/, skipFile: /data\/rooms\.ts$/ },
  // filter.ts is skipped for D3: its integer check belongs to the NEW attendees field, it is not a copy of the time rule.
  { id: 'D3', name: 'whole-number check for time input, Number.isInteger (lines)', re: /Number\.isInteger/, skipFile: /domain\/filter\.ts$/ },
  { id: 'D4', name: 'time-field hint text "Hint:" written out', re: /Hint:/ },
  // D5 counts places that hide an existing result: baseline setResult(null) calls, final reducer updates (the INITIAL state line is not one).
  { id: 'D5', name: 'places that hide the old result (setResult(null) / reducer "...state, checked: false")', re: /setResult\(null\)|\.\.\.state, .*checked: false/ },
  { id: 'D6', name: 'result.ok ok/error branches', re: /result\.ok/ },
];

const out = { files: [], rules: [] };
for (const f of code) out.files.push({ file: relative(root, f), lines: lines(f) });
out.totalLines = out.files.reduce((n, f) => n + f.lines, 0);
out.largest = out.files.reduce((a, b) => (b.lines > a.lines ? b : a));
out.testFiles = tests.length;
for (const r of RULES) {
  const hits = [];
  for (const f of code) {
    if (r.skipFile && r.skipFile.test(f)) continue;
    read(f).split('\n').forEach((line, i) => {
      if (r.skip && r.skip.test(line)) return;
      if (r.re.test(line)) hits.push(`${relative(root, f)}:${i + 1}`);
    });
  }
  out.rules.push({ id: r.id, name: r.name, count: hits.length, extraCopies: Math.max(0, hits.length - 1), at: hits });
}
out.totalExtraCopies = out.rules.reduce((n, r) => n + r.extraCopies, 0);

console.log(JSON.stringify(out, null, 2));
