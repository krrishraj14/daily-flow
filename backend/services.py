from datetime import datetime, date
import json
import os
import sys
import uuid
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq
import requests

load_dotenv()

_client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
_tavily_enabled = os.getenv("TAVILY_ENABLED", "false").lower() == "true"
_tavily_api_key = os.getenv("TAVILY_API_KEY", "")

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

TASKS_FILE = DATA_DIR / "tasks.json"
BRIEFING_FILE = DATA_DIR / "briefing.json"

if not TASKS_FILE.exists():
    TASKS_FILE.write_text("[]")
if not BRIEFING_FILE.exists():
    BRIEFING_FILE.write_text("{}")


def get_today_date() -> str:
    return date.today().isoformat()


def load_tasks() -> list[dict]:
    content = TASKS_FILE.read_text()
    return json.loads(content) if content else []


def save_tasks(tasks: list[dict]) -> None:
    TASKS_FILE.write_text(json.dumps(tasks, indent=2))


def load_briefing() -> dict:
    content = BRIEFING_FILE.read_text()
    return json.loads(content) if content else {}


def save_briefing(briefing: dict) -> None:
    BRIEFING_FILE.write_text(json.dumps(briefing, indent=2))


def get_today_tasks(tasks: list[dict]) -> list[dict]:
    today = get_today_date()
    return [t for t in tasks if t["created_at"].startswith(today)]


def _call_ai(prompt: str) -> str:
    response = _client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    text = response.choices[0].message.content.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return text.strip()


def generate_subtasks(title: str) -> list[str]:
    prompt = f"""Break down this task into 3-5 concrete, actionable subtasks:
Task: {title}

Return only a JSON array of subtask strings, like ["subtask 1", "subtask 2", "subtask 3"]
No markdown, no explanation, just the JSON array."""

    try:
        subtasks = json.loads(_call_ai(prompt))
        return subtasks if isinstance(subtasks, list) else ["Break this task down manually"]
    except Exception as e:
        print(f"AI error in generate_subtasks: {e}")
        return ["Break this task down manually"]


def get_ai_news() -> list[dict]:
    """Fetch latest AI news and developments from Tavily."""
    if not _tavily_enabled or not _tavily_api_key:
        return []

    try:
        sys.stderr.write("[DEBUG] Fetching AI news from Tavily\n")
        sys.stderr.flush()

        # Search for latest AI news and developments
        response = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": _tavily_api_key,
                "query": "latest AI news machine learning LLM models breakthroughs 2024 2025",
                "max_results": 8,
                "include_domains": ["arxiv.org", "techcrunch.com", "theverge.com", "aiweekly.co", "infoq.com"],
            },
            timeout=5,
        )
        response.raise_for_status()
        results = response.json().get("results", [])
        return [
            {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "content": r.get("content", "")[:180] + "...",
            }
            for r in results
        ]
    except Exception as e:
        sys.stderr.write(f"[ERROR] Failed to fetch AI news: {e}\n")
        sys.stderr.flush()
        return []


def get_web_tip() -> str | None:
    """Fetch a productivity tip from Tavily. Returns None if unavailable."""
    sys.stderr.write(f"[DEBUG] get_web_tip called: enabled={_tavily_enabled}, key_set={bool(_tavily_api_key)}\n")
    sys.stderr.flush()
    if not _tavily_enabled or not _tavily_api_key:
        sys.stderr.write("[DEBUG] Tavily disabled or no API key\n")
        sys.stderr.flush()
        return None

    try:
        today = get_today_date()
        sys.stderr.write(f"[DEBUG] Calling Tavily API with query: productivity tip for developers {today}\n")
        sys.stderr.flush()
        response = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": _tavily_api_key,
                "query": f"productivity tip for developers {today}",
                "max_results": 1,
            },
            timeout=5,
        )
        sys.stderr.write(f"[DEBUG] Tavily response status: {response.status_code}\n")
        sys.stderr.flush()
        response.raise_for_status()
        results = response.json().get("results", [])
        sys.stderr.write(f"[DEBUG] Tavily results count: {len(results)}\n")
        sys.stderr.flush()
        if results:
            tip = results[0].get("content") or results[0].get("title")
            sys.stderr.write(f"[DEBUG] Extracted tip: {tip[:50]}...\n")
            sys.stderr.flush()
            return tip
        sys.stderr.write("[DEBUG] No results from Tavily\n")
        sys.stderr.flush()
        return None
    except Exception as e:
        sys.stderr.write(f"[ERROR] Tavily error in get_web_tip: {e}\n")
        sys.stderr.flush()
        import traceback
        traceback.print_exc()
        return None


def generate_briefing() -> dict:
    prompt = """Generate an inspiring daily briefing with:
1. A motivational quote (under 20 words)
2. A productivity focus tip for the day (under 30 words)
3. An encouraging message (under 50 words)

Format as JSON: {"quote": "...", "tip": "...", "message": "..."}"""

    try:
        briefing_data = json.loads(_call_ai(prompt))
        briefing_data["generated_at"] = get_today_date()

        web_tip = get_web_tip()
        if web_tip:
            briefing_data["web_tip"] = web_tip

        return briefing_data
    except Exception as e:
        print(f"AI error in generate_briefing: {e}")
        result = {
            "quote": "Every day is a chance to grow.",
            "tip": "Break large tasks into smaller subtasks.",
            "message": "You've got this! Focus on progress, not perfection.",
            "generated_at": get_today_date(),
        }

        web_tip = get_web_tip()
        if web_tip:
            result["web_tip"] = web_tip

        return result


def get_or_generate_briefing() -> dict:
    briefing = load_briefing()
    today = get_today_date()

    if today in briefing:
        return briefing[today]

    generated = generate_briefing()
    briefing[today] = generated
    save_briefing(briefing)
    return generated


def build_task(title: str) -> dict:
    subtask_texts = generate_subtasks(title)
    return {
        "id": str(uuid.uuid4()),
        "title": title,
        "subtasks": [{"text": s, "completed": False} for s in subtask_texts],
        "completed": False,
        "completed_at": None,
        "created_at": datetime.now().isoformat(),
    }


def complete_task_by_id(task_id: str) -> dict | None:
    tasks = load_tasks()
    task = next((t for t in tasks if t["id"] == task_id), None)
    if not task:
        return None
    task["completed"] = True
    task["completed_at"] = datetime.now().isoformat()
    save_tasks(tasks)
    return task


def uncomplete_task_by_id(task_id: str) -> dict | None:
    """Mark a completed task as incomplete again."""
    tasks = load_tasks()
    task = next((t for t in tasks if t["id"] == task_id), None)
    if not task:
        return None
    task["completed"] = False
    task["completed_at"] = None
    save_tasks(tasks)
    return task


def toggle_subtask_by_id(task_id: str, subtask_index: int) -> dict | None:
    """Toggle a subtask's completion status."""
    tasks = load_tasks()
    task = next((t for t in tasks if t["id"] == task_id), None)
    if not task or not task.get("subtasks") or subtask_index < 0 or subtask_index >= len(task["subtasks"]):
        return None

    # Ensure subtask is in new format (dict with text and completed)
    subtask = task["subtasks"][subtask_index]
    if isinstance(subtask, str):
        subtask = {"text": subtask, "completed": False}
        task["subtasks"][subtask_index] = subtask

    subtask["completed"] = not subtask.get("completed", False)
    save_tasks(tasks)
    return task


def delete_task_by_id(task_id: str) -> bool:
    tasks = load_tasks()
    task = next((t for t in tasks if t["id"] == task_id), None)
    if not task:
        return False
    save_tasks([t for t in tasks if t["id"] != task_id])
    return True


def generate_standup() -> str:
    tasks = load_tasks()
    completed_tasks = [t for t in get_today_tasks(tasks) if t["completed"]]
    in_progress_tasks = [t for t in get_today_tasks(tasks) if not t["completed"]]

    if not completed_tasks:
        return "No tasks completed today yet. Let's get started!"

    def format_task(t: dict) -> str:
        subtasks = t.get("subtasks", [])
        lines = [f"- {t['title']}"]
        for s in subtasks:
            lines.append(f"    • {s}")
        return "\n".join(lines)

    completed_block = "\n".join(format_task(t) for t in completed_tasks)
    next_block = "\n".join(f"- {t['title']}" for t in in_progress_tasks) or "None"

    prompt = f"""Write a short, professional daily standup update based on the tasks below.

COMPLETED TODAY:
{completed_block}

STILL IN PROGRESS:
{next_block}

Format it as:
✅ Done: [what was accomplished, referencing specific tasks/subtasks]
🔜 Next: [what's being worked on next]
⚠️ Blockers: [any blockers, or "None"]

Keep it under 80 words. Be specific, not generic."""

    try:
        return _call_ai(prompt)
    except Exception as e:
        print(f"AI error in generate_standup: {e}")
        titles = "\n".join(f"• {t['title']}" for t in completed_tasks)
        return f"Completed today:\n{titles}\n\nIn progress: {len(in_progress_tasks)} task(s) remaining."


def generate_detailed_breakdown(task_description: str) -> dict:
    """Generate a detailed task breakdown with time estimates for each subtask."""
    prompt = f"""Break down this task into 3-5 concrete, actionable subtasks with time estimates.
Task: {task_description}

For each subtask, provide:
1. The subtask description (starts with action verb)
2. Estimated time in hours (30 mins, 1 hour, 2 hours, etc.)

Return ONLY a JSON array with this format:
[
  {{"subtask": "Create database schema", "time_estimate": "1 hour"}},
  {{"subtask": "Write API endpoints", "time_estimate": "2 hours"}},
  {{"subtask": "Add error handling", "time_estimate": "1 hour"}}
]

No markdown, no explanation, just the JSON array."""

    try:
        breakdown = json.loads(_call_ai(prompt))
        if isinstance(breakdown, list) and len(breakdown) > 0:
            return {"breakdown": breakdown, "task": task_description}
        else:
            return {
                "breakdown": [
                    {"subtask": "Break this task down manually", "time_estimate": "Variable"}
                ],
                "task": task_description,
            }
    except Exception as e:
        print(f"AI error in generate_detailed_breakdown: {e}")
        return {
            "breakdown": [
                {"subtask": "Break this task down manually", "time_estimate": "Variable"}
            ],
            "task": task_description,
        }


def generate_insights() -> str:
    tasks = load_tasks()
    today_tasks = get_today_tasks(tasks)

    if not today_tasks:
        return "No tasks yet. Start adding tasks to see insights!"

    total = len(today_tasks)
    completed = len([t for t in today_tasks if t["completed"]])
    rate = (completed / total * 100) if total > 0 else 0

    prompt = f"""Analyze these task completion patterns and provide insights:

Total tasks: {total}, Completed: {completed}, Rate: {rate:.1f}%

Provide:
1. Peak productivity observation
2. Completion rate assessment
3. One suggestion for improvement

Keep it brief and actionable (under 80 words)."""

    try:
        return _call_ai(prompt)
    except Exception as e:
        print(f"AI error in generate_insights: {e}")
        remaining = total - completed
        return (
            f"Completion rate: {rate:.1f}% ({completed}/{total} tasks done).\n"
            f"{remaining} task(s) still in progress.\n"
            f"{'Great momentum — you\'re past halfway!' if rate >= 50 else 'Keep going — every completed task counts!'}"
        )
