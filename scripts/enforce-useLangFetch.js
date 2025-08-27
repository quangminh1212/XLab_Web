const fs = require('fs');
const path = require('path');
const glob = require('glob');

const TARGET_ENDPOINTS = [
  '/api/products',
];

const isClientFile = (content) => content.includes("'use client'") || content.includes('"use client"');

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  if (!isClientFile(content)) return null; // only check client components/pages

  const issues = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    // simple detection of fetch calls to target endpoints
    if (/fetch\(\s*[`'"]/.test(line)) {
      const match = line.match(/fetch\(\s*([`'"])([^`'"]+)\1/);
      if (match) {
        const url = match[2];
        if (TARGET_ENDPOINTS.some((ep) => url.startsWith(ep))) {
          // Check if useLangFetch is imported or used
          const hasImport = /useLangFetch/.test(content);
          const usesLFetch = /\blfetch\s*\(/.test(content);
          if (!hasImport || !usesLFetch) {
            issues.push({ line: idx + 1, url });
          }
        }
      }
    }
  });

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
    console.log('❗ Detected direct fetch calls to product APIs without useLangFetch:');
    report.forEach(({ file, issues }) => {
      console.log(`\n- ${file}`);
      issues.forEach((iss) => console.log(`  line ${iss.line}: ${iss.url}`));
    });
    process.exitCode = 1;
  } else {
    console.log('✅ All client fetch calls to product APIs use useLangFetch.');
  }
}

main();

