/**
 * Turbopack/PostCSS cannot resolve package exports that only declare the
 * "style" condition. Add a "default" fallback after every install until
 * tw-animate-css ships this upstream.
 */
import fs from "node:fs";
import path from "node:path";

const pkgPath = path.join(
  process.cwd(),
  "node_modules",
  "tw-animate-css",
  "package.json",
);

if (!fs.existsSync(pkgPath)) {
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
let changed = false;

for (const key of Object.keys(pkg.exports ?? {})) {
  const entry = pkg.exports[key];
  if (
    entry &&
    typeof entry === "object" &&
    typeof entry.style === "string" &&
    entry.default !== entry.style
  ) {
    entry.default = entry.style;
    changed = true;
  }
}

if (changed) {
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log("patched tw-animate-css exports for Turbopack CSS resolution");
}
