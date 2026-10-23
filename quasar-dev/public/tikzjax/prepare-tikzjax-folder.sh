
#!/usr/bin/env bash
set -euo pipefail

# Run from the Quasar project root.
PACKAGE="node_modules/@rod2ik/tikzjax"
DEST="public/tikzjax/prepared/dist"

# Locate the original distribution.
if [[ -f "$PACKAGE/dist/tikzjax.min.js" ]]; then
    SOURCE_DIST="$PACKAGE/dist"
elif [[ -f "$PACKAGE/tikzjax.min.js" ]]; then
    SOURCE_DIST="$PACKAGE"
else
    echo "ERROR: TikZJax distribution not found in $PACKAGE"
    echo "Check that @rod2ik/tikzjax@1.6.0 is installed."
    exit 1
fi

# Recreate the prepared folder without modifying node_modules.
rm -rf "$DEST"
mkdir -p "$DEST"
cp -a "$SOURCE_DIST/." "$DEST/"

# Verify the required runtime assets.
for file in tikzjax.min.js run-tex.js fonts.min.css core.dump.gz tex.wasm.gz; do
    if [[ ! -f "$DEST/$file" ]]; then
        echo "ERROR: Missing runtime asset: $DEST/$file"
        exit 1
    fi
done

# Verify that the original gzip files are valid.
gzip -t "$DEST/core.dump.gz"
gzip -t "$DEST/tex.wasm.gz"

echo "TikZJax runtime prepared from $SOURCE_DIST"
echo "Destination: $DEST"
