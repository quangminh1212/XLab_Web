const fs = require('fs');
const path = require('path');
const glob = require('glob');

const TARGET_PREFIX = '/api/products';

const isClientFile = (content) => content.includes("'use client'") || content.includes('"use client"');

function classifyEndpoint(url) {
  if (url.startsWith(`${TARGET_PREFIX}/related`)) return 'related';
  if (/^\/api\/products\/.+\/faqs/.test(url)) return 'faqs';
  if (/^\/api\/products\/(?:[^/?]+)(?:[/?]|$)/.test(url)) return 'detail';
  if (url === TARGET_PREFIX || url.startsWith(`${TARGET_PREFIX}?`)) return 'list';
  return 'unknown';
}

function findFetchCalls(content) {
  const matches = [];
  // Ensure we don't match lfetch by requiring a word boundary before 'fetch'
  const regex = /\bfetch\s*\(\s*([`'"])\s*([^`'"\n\r]+)\1/gm;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const raw = m[2].trim();
    const startIdx = m.index;
    const line = content.slice(0, startIdx).split(/\r?\n/).length;
    matches.push({ line, rawUrl: raw });
  }
  return matches;
}

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  if (!isClientFile(content)) return null; // only check client components/pages

  const issues = [];
  const calls = findFetchCalls(content);

  for (const c of calls) {
    const url = c.rawUrl;
    if (url.startsWith(TARGET_PREFIX)) {
      const kind = classifyEndpoint(url);
      issues.push({ line: c.line, url, kind });
    }
  }

  return issues.length ? issues : null;
}

function main() {
  const patterns = ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}', 'src/contexts/**/*.{ts,tsx}'];
  const files = patterns.flatMap((p) => glob.sync(p, { ignore: ['**/node_modules/**'] }));

  let totalIssues = 0;
  const report = [];

  files.forEach((file) => {
    try {
      const issues = checkFile(file);
      if (issues && issues.length) {
        totalIssues += issues.length;
        report.push({ file, issues });
      }
    } catch (e) {
      // ignore file read errors
    }
  });

  if (report.length) {
    console.log('❗ Detected direct fetch calls to product APIs. Please use useLangFetch (lfetch) instead:');
    report.forEach(({ file, issues }) => {
      console.log(`\n- ${file}`);
      issues.forEach((iss) => console.log(`  line ${iss.line} [${iss.kind}]: ${iss.url}`));
    });
    process.exitCode = 1;
  } else {
    console.log('✅ All client fetch calls to product APIs use useLangFetch.');
  }
}

main();

