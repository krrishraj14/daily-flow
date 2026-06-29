---
name: morning-briefing
description: Fetch and display your DailyPulse morning briefing at the start of each work session. Shows today's motivational quote, focus tip, task summary (pending vs completed), and suggested focus areas. Run this whenever you need to see your daily briefing or check what tasks are pending. Use before standup meetings or when planning your day.
effort: low
---

# Morning Briefing Skill

Fetches and displays your DailyPulse morning briefing from the backend, showing:

1. **Daily Briefing** — Motivational quote, focus tip, and encouraging message
2. **Task Summary** — Pending tasks, completed tasks, and suggested focus for the day

This skill requires the DailyPulse backend to be running on `http://localhost:8000`.

## How it works

When you run `/morning-briefing`:

1. Calls `GET /briefing` to fetch today's briefing
2. Calls `GET /tasks` to get your task list
3. Filters tasks by today's date
4. Counts pending vs completed tasks
5. Extracts task titles to suggest focus areas
6. Displays everything in a formatted, colorful output

## What you'll see

```
═══════════════════════════════════════════════════════════════
                    TODAY'S DAILY BRIEFING
═══════════════════════════════════════════════════════════════

✨ Quote: "Every day is a chance to grow."
📌 Focus Tip: "Break large tasks into smaller subtasks."
💪 Message: "You've got this! Focus on progress, not perfection."

───────────────────────────────────────────────────────────────
TASK SUMMARY
───────────────────────────────────────────────────────────────
Pending Tasks (today): 3
Completed Tasks (today): 1
Suggested Focus: Build homepage, Fix typos
═══════════════════════════════════════════════════════════════
```

## Requirements

- DailyPulse backend running on `http://localhost:8000`
- `curl` command available
- `jq` command available (for JSON parsing)

## Backend API Endpoints

- `GET /briefing` — Returns `{quote, tip, message, generated_at}`
- `GET /tasks` — Returns array of task objects with `title`, `completed`, `created_at`

## Execution

The skill runs a bash script that handles all the fetching, filtering, and formatting automatically.
