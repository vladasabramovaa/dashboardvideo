#!/bin/bash
# Stop Verify — Stop hook
# Checks for uncommitted changes before session ends

WARNINGS=""

# Check for uncommitted git changes in common project dirs
for dir in ~/Projects/*/; do
  if [ -d "${dir}.git" ]; then
    CHANGES=$(cd "$dir" && git status --porcelain 2>/dev/null | head -5)
    if [ -n "$CHANGES" ]; then
      DIRNAME=$(basename "$dir")
      COUNT=$(cd "$dir" && git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
      WARNINGS="${WARNINGS}UNCOMMITTED: ${DIRNAME} has ${COUNT} uncommitted change(s)\n"
    fi
  fi
done

if [ -n "$WARNINGS" ]; then
  echo -e "=== Session End Verification ===" >&2
  echo -e "$WARNINGS" >&2
  echo -e "Consider committing before ending." >&2
fi

exit 0
