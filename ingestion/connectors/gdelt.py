import os
from typing import Any, Dict, List

from connectors.base import ApiError, fetch_json

GDELT_DOC_API = "https://api.gdeltproject.org/api/v2/doc/doc"


def fetch_gdelt_events(query: str, *, timespan: str = "6 hours", max_records: int = 250) -> List[Dict[str, Any]]:
    """
    Uses the GDELT 2.1 DOC API (geojson) to pull recent events/articles.
    """
    params = {
        "query": query,
        "format": "geojson",
        "timespan": timespan,
        "maxrecords": max_records,
    }
    data = fetch_json(GDELT_DOC_API, params=params)
    return data.get("features", [])
