'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', '.vercel', 'dist', 'build', '.turbo']);
const EXT_OK = new Set(['.ts', '.tsx', '.js', '.json']);

const MARKERS = [
  /git apply --3way/,
  /git rev-parse --show-toplevel/,
  /^<<'[^']+'$/m,
  /^EOF\s*$/m,
  /^cat > .* <<'[^']+'$/m,
  /# Overwrite the script with valid JS/
];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith('.DS_Store')) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (!IGNORE_DIRS.has(name)) walk(p);
    } else {
      const ext = path.extname(name);
      if (EXT_OK.has(ext)) maybeFix(p, ext);
    }
  }
}

function hasMarker(s) { return MARKERS.some((re) => re.test(s)); }

function fixCode(content) {
  // Drop everything before the first plausible code line
  const re = /^(import|export|const|let|var|function|type|interface|'use strict'|"use strict"|\/\*|\/\/|\s*\/\/)/m;
  const m = content.match(re);
  if (m && m.index > 0) return content.slice(m.index);
  return content;
}

function fixJSON(content) {
  // Keep from first { or [ onward
  const i1 = content.indexOf('{');
  const i2 = content.indexOf('[');
  let i = -1;
  if (i1 >= 0 && i2 >= 0) i = Math.min(i1, i2);
  else i = (i1 >= 0 ? i1 : i2);
  if (i > 0) return content.slice(i);
  return content;
}

function maybeFix(file, ext) {
  let s = fs.readFileSync(file, 'utf8');
  if (!hasMarker(s)) return;

  const orig = s;
  if (ext === '.json') s = fixJSON(s);
  else s = fixCode(s);

  // Also strip stray heredoc markers anywhere
  s = s
    .replace(/^<<'[^']+'\s*$\n?/mg, '')
    .replace(/^EOF\s*$/mg, '')
    .replace(/^\(cd "\$\(git rev-parse --show-toplevel\)".*$/mg, '')
    .replace(/^diff --git .*$/mg, '')
    .replace(/^index [0-9a-f]+\.\.[0-9a-f]+ .*$/mg, '')
    .replace(/^--- a\/.*$/mg, '')
    .replace(/^\+\+\+ b\/.*$/mg, '')
    .replace(/^@@ .* @@.*$/mg, '')
    .replace(/^# Overwrite the script with valid JS.*$/mg, '')
    .replace(/^cat > .* <<'[^']+'.*$/mg, '');

  if (s !== orig) {
    fs.writeFileSync(file, s, 'utf8');
    console.log('cleaned:', file);
  }
}

walk(ROOT);
console.log('Scrub complete.');
