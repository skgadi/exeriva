
#!/usr/bin/env bash
set -euo pipefail

# Run from the quasar-dev project root.
SOURCE="node_modules/@rod2ik/tikzjax/dist"
DEST="public/tikzjax/prepared-prod/dist"
INDEX="index.html"
DOCS="../docs"

if [[ ! -f "$SOURCE/tikzjax.min.js" ]]; then
  echo "ERROR: TikZJax source not found: $SOURCE"
  echo "Run pnpm install first."
  exit 1
fi

# Prepare a separate production copy; never recompress its files.
rm -rf "$DEST"
mkdir -p "$DEST"
cp -a "$SOURCE/." "$DEST/"

for file in tikzjax.min.js run-tex.js fonts.min.css core.dump.gz tex.wasm.gz; do
  if [[ ! -f "$DEST/$file" ]]; then
    echo "ERROR: Missing production asset: $DEST/$file"
    exit 1
  fi
done

gzip -t "$DEST/core.dump.gz"
gzip -t "$DEST/tex.wasm.gz"

# Back up index.html and restore it automatically on exit.
BACKUP="$(mktemp)"
cp "$INDEX" "$BACKUP"
restore_index() {
  cp "$BACKUP" "$INDEX"
  rm -f "$BACKUP"
}
trap restore_index EXIT

# Switch asset paths for the production build only.
node -e '
const fs = require("fs");
const file = process.argv[1];
let html = fs.readFileSync(file, "utf8");
const oldPath = "/tikzjax/prepared/dist/";
const newPath = "/tikzjax/prepared-prod/dist/";

if (!html.includes(oldPath)) {
  console.error("ERROR: Expected development TikZJax path not found in index.html");
  process.exit(1);
}

html = html.split(oldPath).join(newPath);
fs.writeFileSync(file, html);
' "$INDEX"

echo "Building production PWA..."
pnpm exec quasar build -m pwa

echo "Updating docs..."
rm -rf "$DOCS"
mkdir -p "$DOCS"
cp -a dist/pwa/. "$DOCS/"
touch "$DOCS/.nojekyll"

echo "Production site prepared in $DOCS"
