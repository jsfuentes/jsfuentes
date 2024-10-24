#!/bin/bash

# Define source and destination directories
SOURCE_DIR="/Users/jfuentes/Notes/Notes/Daily Notes"
DEST_DIR="./data/daily_notes"  # Change this to your desired destination path

rm -rf $DEST_DIR  
mkdir -p $DEST_DIR

# Loop through all .md files in the source directory
quote_count=0  # Initialize a counter for quotes
find "$SOURCE_DIR" -type f -name "*.md" | while read -r file; do
  # Check if the file contains "#quote"
  if grep -q "#quote" "$file"; then
    # Extract lines containing "#quote" and write them to a new file in the destination directory
    grep "#quote" "$file" > "$DEST_DIR/$(basename "$file" .md).mdx"
    count=$(grep -c "#quote" "$file")  # Count quotes extracted
    echo "Extracted $count quotes from $file"
    quote_count=$((quote_count + count))  # Accumulate the total count of quotes
  fi
done

chmod -R 777 $DEST_DIR


