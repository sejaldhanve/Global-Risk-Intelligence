import os
from typing import Any, Dict, List

from connectors.base import ApiError, fetch_json

FRED_SERIES_API = "https://api.stlouisfed.org/fred/series/observations"


def fetch_fred_series(series_id: str, *, start_date: str | None = None, end_date: str | None = None) -> List[Dict[str, Any]]:
    api_key = os.getenv("FRED_API_KEY")
    if not api_key:
        raise ApiError("FRED_API_KEY env var is required")

    params: Dict[str, Any] = {"series_id": series_id, "api_key": api_key, "file_type": "json"}
    if start_date:
        params["observation_start"] = start_date
    if end_date:
        params["observation_end"] = end_date

    data = fetch_json(FRED_SERIES_API, params=params)
    return data.get("observations", [])
