#!/bin/bash

# Generate Standup Script
# Fetches standup from DailyPulse backend and handles clipboard operations

set -e

API_URL="http://localhost:8000"
STANDUP_ENDPOINT="/standup"

# Colors for formatting
BOLD='\033[1m'
RESET='\033[0m'
SECTION='\033[1;36m'
DIVIDER='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'

echo -e "${DIVIDER}═══════════════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}                    YOUR DAILY STANDUP${RESET}"
echo -e "${DIVIDER}═══════════════════════════════════════════════════════════════${RESET}"
echo ""

# Fetch standup from backend
echo "Generating standup from completed tasks..."
STANDUP=$(curl -s "$API_URL$STANDUP_ENDPOINT" 2>/dev/null || echo '{"standup":""}')

# Extract standup text
STANDUP_TEXT=$(echo "$STANDUP" | jq -r '.standup // "No completed tasks yet."' 2>/dev/null || echo "No completed tasks yet.")

# Display standup with formatting
echo -e "${GREEN}${STANDUP_TEXT}${RESET}"
echo ""

# Ask about blockers
echo -e "${YELLOW}🚧 Do you have any blockers to add?${RESET}"
echo "Enter blockers (press Ctrl+D or Ctrl+Z when done, or just press Enter to skip):"
BLOCKERS=""
while IFS= read -r -t 5 line || [[ -n "$line" ]]; do
    if [ -z "$line" ]; then
        break
    fi
    if [ -z "$BLOCKERS" ]; then
        BLOCKERS="$line"
    else
        BLOCKERS="$BLOCKERS
$line"
    fi
done 2>/dev/null || true

# Add blockers to standup text if provided
FINAL_STANDUP="$STANDUP_TEXT"
if [ -n "$BLOCKERS" ]; then
    FINAL_STANDUP="$STANDUP_TEXT

🚧 BLOCKERS:
$BLOCKERS"
fi

# Display complete standup
echo ""
echo -e "${DIVIDER}═══════════════════════════════════════════════════════════════${RESET}"
echo -e "${GREEN}${FINAL_STANDUP}${RESET}"
echo -e "${DIVIDER}═══════════════════════════════════════════════════════════════${RESET}"
echo ""

# Ask to copy to clipboard
read -p "Copy this to clipboard? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Detect OS and use appropriate clipboard command
    if command -v pbcopy &> /dev/null; then
        # macOS
        echo "$FINAL_STANDUP" | pbcopy
        echo -e "${GREEN}✓ Copied to clipboard!${RESET}"
    elif command -v xclip &> /dev/null; then
        # Linux
        echo "$FINAL_STANDUP" | xclip -selection clipboard
        echo -e "${GREEN}✓ Copied to clipboard!${RESET}"
    elif command -v clip.exe &> /dev/null; then
        # Windows (Git Bash or WSL)
        echo "$FINAL_STANDUP" | clip.exe
        echo -e "${GREEN}✓ Copied to clipboard!${RESET}"
    else
        echo -e "${YELLOW}⚠ Clipboard tool not found. Install xclip (Linux) or check your OS.${RESET}"
    fi
else
    echo "Standup not copied."
fi

echo ""
