import os
from typing import Any, Dict, List

from connectors.base import ApiError, fetch_json

NEWSAPI_URL = "https://newsapi.org/v2/everything"


def fetch_news(query: str, *, language: str = "en", page_size: int = 100, sort_by: str = "publishedAt") -> List[Dict[str, Any]]:
    api_key = os.getenv("NEWSAPI_KEY")
    if not api_key:
        raise ApiError("NEWSAPI_KEY env var is required")

    params = {
        "q": query,
        "language": language,
        "pageSize": page_size,
        "sortBy": sort_by,
        "apiKey": api_key,
    }
    data = fetch_json(NEWSAPI_URL, params=params)
    return data.get("articles", [])
