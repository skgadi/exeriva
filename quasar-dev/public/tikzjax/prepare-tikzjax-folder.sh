
#!/usr/bin/env bash
set -euo pipefail

# Run from the quasar-dev project root.
SOURCE="node_modules/@rod2ik/tikzjax/dist"
DEST="public/tikzjax/prepared/dist"

if [[ ! -f "$SOURCE/tikzjax.min.js" ]]; then
  echo "ERROR: TikZJax source not found: $SOURCE"
  echo "Run pnpm install first."
  exit 1
fi

rm -rf "$DEST"
mkdir -p "$DEST"
cp -a "$SOURCE/." "$DEST/"

# Development server sends .gz files with Content-Encoding: gzip.
# Double-compress so the browser removes one layer and TikZJax
# receives the original gzip-compressed bytes.
while IFS= read -r -d '' file; do
  gzip -t "$file"
  temp="${file}.tmp"
  gzip -c "$file" > "$temp"
  mv "$temp" "$file"
done < <(find "$DEST" -type f -name '*.gz' -print0)

echo "Development TikZJax prepared: $DEST"
