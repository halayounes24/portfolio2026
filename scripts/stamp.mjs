// Cache-busting: after a build, add ?v=<hash> to every CSS/JS reference in
// dist/ so browsers always fetch the latest files after a deploy instead of
// reusing stale copies. The hash changes only when CSS/JS contents change.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(DIST);
const assets = files.filter((f) => /\.(css|js)$/.test(f)).sort();

const hash = createHash("sha256");
for (const f of assets) hash.update(f).update(readFileSync(f));
const v = hash.digest("hex").slice(0, 10);

// HTML: href="x.css" / src="x.js" (local files only)
const htmlRef = /((?:href|src)=")((?!https?:|\/\/)[^"?#]+\.(?:css|js))"/g;
// JS: import … from "./x.js"
const jsImport = /(from\s+["'])(\.{1,2}\/[^"'?]+\.js)(["'])/g;

for (const f of files) {
  if (f.endsWith(".html")) {
    const s = readFileSync(f, "utf8");
    writeFileSync(f, s.replace(htmlRef, `$1$2?v=${v}"`));
  } else if (f.endsWith(".js")) {
    const s = readFileSync(f, "utf8");
    writeFileSync(f, s.replace(jsImport, `$1$2?v=${v}$3`));
  }
}

console.log(`stamped CSS/JS references with ?v=${v}`);
