#!/bin/bash

# Morning Briefing Fetcher Script
# Fetches and displays the daily briefing from DailyPulse backend

set -e

API_URL="http://localhost:8000"
BRIEFING_ENDPOINT="/briefing"
TASKS_ENDPOINT="/tasks"

# Colors for formatting
BOLD='\033[1m'
RESET='\033[0m'
SECTION='\033[1;36m'
DIVIDER='\033[0;36m'
GREEN='\033[0;32m'

echo -e "${DIVIDER}═══════════════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}                    TODAY'S DAILY BRIEFING${RESET}"
echo -e "${DIVIDER}═══════════════════════════════════════════════════════════════${RESET}"
echo ""

# Fetch briefing
echo "Fetching briefing..."
BRIEFING=$(curl -s "$API_URL$BRIEFING_ENDPOINT" 2>/dev/null || echo "{}")

# Display briefing
if [ "$BRIEFING" != "{}" ] && [ -n "$BRIEFING" ]; then
    QUOTE=$(echo "$BRIEFING" | jq -r '.quote // "Every day is a chance to grow."' 2>/dev/null)
    TIP=$(echo "$BRIEFING" | jq -r '.tip // "Focus on what matters."' 2>/dev/null)
    MESSAGE=$(echo "$BRIEFING" | jq -r '.message // "You\'ve got this!"' 2>/dev/null)

    echo -e "${GREEN}✨ Quote:${RESET} $QUOTE"
    echo -e "${GREEN}📌 Focus Tip:${RESET} $TIP"
    echo -e "${GREEN}💪 Message:${RESET} $MESSAGE"
else
    echo "Briefing not yet generated. Starting backend to generate..."
fi

echo ""
echo -e "${DIVIDER}───────────────────────────────────────────────────────────────${RESET}"
echo -e "${SECTION}TASK SUMMARY${RESET}"
echo -e "${DIVIDER}───────────────────────────────────────────────────────────────${RESET}"

# Fetch tasks
TASKS=$(curl -s "$API_URL$TASKS_ENDPOINT" 2>/dev/null || echo "[]")

# Get today's date for filtering
TODAY=$(date +%Y-%m-%d)

# Count pending and completed tasks for today
PENDING_COUNT=$(echo "$TASKS" | jq "[.[] | select(.created_at | startswith(\"$TODAY\")) | select(.completed == false)] | length" 2>/dev/null || echo "0")
COMPLETED_COUNT=$(echo "$TASKS" | jq "[.[] | select(.created_at | startswith(\"$TODAY\")) | select(.completed == true)] | length" 2>/dev/null || echo "0")

# Get suggested focus from pending tasks (first 2 task titles)
SUGGESTED_FOCUS=$(echo "$TASKS" | jq -r "[.[] | select(.created_at | startswith(\"$TODAY\")) | select(.completed == false)] | .[0:2] | map(.title) | join(\", \")" 2>/dev/null || echo "Review pending tasks")

if [ -z "$SUGGESTED_FOCUS" ] || [ "$SUGGESTED_FOCUS" = "null" ] || [ "$SUGGESTED_FOCUS" = "" ]; then
    SUGGESTED_FOCUS="No pending tasks — great job!"
fi

echo "Pending Tasks (today): $PENDING_COUNT"
echo "Completed Tasks (today): $COMPLETED_COUNT"
echo "Suggested Focus: $SUGGESTED_FOCUS"

echo -e "${DIVIDER}═══════════════════════════════════════════════════════════════${RESET}"
echo ""
