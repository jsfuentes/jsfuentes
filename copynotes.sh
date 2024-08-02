#!/bin/bash

rm -rf ./data/booknotes
mkdir -p ./data/booknotes

# Copy Notes to .mdx
find /Users/jfuentes/Notes/Notes/Resources/Books -type f -name "*.md" -exec sh -c 'cp "$0" "./data/booknotes/$(basename "${0%.md}").mdx"' {} \;

for file in ./data/booknotes/*; do
  if [ -f "$file" ]; then
    temp_file=$(mktemp)
    
    # Add frontmatter of title
    echo "---
title: '$(basename "${file%.*}" | sed "s/'/''/g")'
---
" > "$temp_file"
    
    sed 's/</\&lt;/g' "$file" >> "$temp_file"
    mv "$temp_file" "$file"

    base_filename=$(basename "$file")
    # Can't have spaces or single quotes or exclaimation points, so just delete most special characters
    new_filename=$(echo "$base_filename" | tr ' ' '-' | tr -d "'\"!@#$%^&*()[]{};:,<>?\\|~+=/")
    
    # If the new filename is different, rename the file. Make sure to do this after title put at beginning
    if [ "$base_filename" != "$new_filename" ]; then
      mv "$file" "$(dirname "$file")/$new_filename"
      file="$(dirname "$file")/$new_filename"
    fi
  fi
done

chmod -R 777 ./data/booknotes

echo "All files have been processed."