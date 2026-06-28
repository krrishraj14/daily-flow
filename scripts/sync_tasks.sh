#!/bin/bash
REPO="$HOME/practices/daily-flow"
cd "$REPO" || exit 1

git diff --quiet backend/data/tasks.json briefing.json 2>/dev/null
[[ $? -eq 0 ]] && exit 0

git add backend/data/tasks.json backend/data/briefing.json
git commit -m "auto-sync: tasks $(date '+%Y-%m-%d %H:%M')"
git push origin main
