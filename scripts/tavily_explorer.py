#!/usr/bin/env python3
"""Tavily API Explorer - Fetch news, quotes, and productivity insights."""

import os
import sys
import json
import requests
from datetime import date
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")
if not TAVILY_API_KEY:
    print("Error: TAVILY_API_KEY not set in .env")
    sys.exit(1)

BASE_URL = "https://api.tavily.com/search"


def search_tavily(query: str, max_results: int = 5) -> dict:
    """Search Tavily API with a query."""
    try:
        response = requests.post(
            BASE_URL,
            json={
                "api_key": TAVILY_API_KEY,
                "query": query,
                "max_results": max_results,
            },
            timeout=10,
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error querying Tavily: {e}")
        return {}


def print_results(title: str, data: dict) -> None:
    """Print search results in a nice format."""
    print(f"\n{'='*60}")
    print(f"📌 {title}")
    print(f"{'='*60}")

    results = data.get("results", [])
    if not results:
        print("  No results found.")
        return

    for i, result in enumerate(results, 1):
        print(f"\n{i}. {result.get('title', 'No title')}")
        print(f"   URL: {result.get('url', 'N/A')}")
        print(f"   Score: {result.get('score', 'N/A'):.2f}")
        content = result.get("content", "No content")
        if len(content) > 200:
            content = content[:200] + "..."
        print(f"   Content: {content}")


def main():
    """Main function to explore Tavily."""
    today = date.today().isoformat()

    print("\n🔍 TAVILY API EXPLORER")
    print(f"📅 Date: {today}\n")

    searches = [
        ("Latest tech news today", "tech news today"),
        ("Productivity tips for developers", f"productivity tips for developers {today}"),
        ("AI news today", "artificial intelligence news today"),
        ("Startup news and funding", "startup news funding today"),
        ("Programming best practices", "programming best practices 2026"),
        ("Web development trends", "web development trends 2026"),
        ("Motivational quotes", "motivational quotes for success"),
        ("Daily productivity hacks", "daily productivity hacks for developers"),
    ]

    for title, query in searches:
        print(f"\n🔎 Searching: {query}...")
        data = search_tavily(query, max_results=3)
        print_results(title, data)

    # Save results to file
    all_results = {}
    for title, query in searches:
        data = search_tavily(query, max_results=5)
        all_results[title] = data.get("results", [])

    output_file = os.path.join(
        os.path.dirname(__file__), "..", "backend", "data", "tavily_cache.json"
    )
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"\n✅ Results saved to {output_file}")


if __name__ == "__main__":
    main()
