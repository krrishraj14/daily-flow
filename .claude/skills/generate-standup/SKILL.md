---
name: generate-standup
description: Generates a professional standup from today's DailyPulse tasks. Use before your daily standup meeting to get a formatted summary of what you completed, what's next, and any blockers.
effort: low
---

# Generate Standup Skill

Creates a professional daily standup summary from your completed tasks, with option to copy directly to clipboard.

## How it works

When you run `/generate-standup`:

1. Calls `GET /standup` to fetch your standup data from completed tasks
2. Formats it as a professional three-section standup:
   - **✅ Yesterday / Today's completed work** — List of finished tasks
   - **🔨 What I'm working on next** — Tasks still in progress
   - **🚧 Any blockers** — Asks you if you have blockers to add
3. Displays the formatted standup
4. Prompts: "Copy this to clipboard? (y/n)"
5. If yes, automatically copies to clipboard using the right tool for your OS

## What you'll see

```
═══════════════════════════════════════════════════════════════
                    YOUR DAILY STANDUP
═══════════════════════════════════════════════════════════════

✅ COMPLETED TODAY:
Implemented user authentication with JWT tokens
Fixed critical bug in task creation endpoint
Reviewed and merged 3 pull requests

🔨 WORKING ON NEXT:
Build dashboard UI for analytics
Write integration tests for payment flow

🚧 BLOCKERS:
None

═══════════════════════════════════════════════════════════════

Copy this to clipboard? (y/n): 
```

## Requirements

- DailyPulse backend running on `http://localhost:8000`
- `curl` command available
- One of these clipboard tools:
  - **Mac:** `pbcopy` (built-in)
  - **Linux:** `xclip` (install with `sudo apt install xclip`)
  - **Windows:** `clip.exe` (built-in)

## Blocker Handling

If you have blockers, the script will prompt you to enter them. You can:
- Type your blocker and press Enter
- Press Ctrl+D (or Ctrl+Z on Windows) to finish entering blockers
- Just press Enter to skip if you have no blockers

## Backend API

Requires `GET /standup` endpoint that returns `{standup: "formatted standup text"}`

## Execution

The skill runs a bash script that handles API calls, formatting, user prompts, and clipboard operations automatically.
