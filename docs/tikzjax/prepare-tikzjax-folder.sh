#!/bin/bash

# Define relative paths based on script location in public/tikzjax
SRC_DIR="1.6.0"
DEST_DIR="prepared-1.6.0"
TEMP_DIR="temp"

# Ensure temporary and destination directories exist
mkdir -p "$DEST_DIR"
mkdir -p "$TEMP_DIR"

# Enable recursive globbing for subfolders
shopt -s globstar nullglob

# Iterate recursively through all files in the source directory
for file in "$SRC_DIR"/**; do
  # Check if it's a regular file (skip directories)
  if [ -f "$file" ]; then
    
    # Calculate relative path to preserve subfolder structure
    rel_path="${file#"$SRC_DIR"/}"
    target_dir="$DEST_DIR/$(dirname "$rel_path")"
    
    # Ensure target subfolder exists in destination
    mkdir -p "$target_dir"
    
    if [[ "$file" == *.gz ]]; then
      # 1. Copy to temporary directory
      temp_file="$TEMP_DIR/$(basename "$file")"
      cp "$file" "$temp_file"
      
      # 2. Compress again with gzip (creates temp_file.gz)
      gzip -f "$temp_file"
      
      # 3. Move double-zipped file to destination while keeping the original filename
      mv "${temp_file}.gz" "$DEST_DIR/$rel_path"
      
      # 4. Remove original source file
      rm "$file"
    else
      # Move non-gz file directly (automatically deletes original from source)
      mv "$file" "$DEST_DIR/$rel_path"
    fi
  fi
done

# Clean up remaining empty subdirectories in source and the temp folder
find "$SRC_DIR" -type d -empty -delete
rm -rf "$TEMP_DIR"

echo "Processing and cleanup complete."