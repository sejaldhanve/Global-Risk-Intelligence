import os
from typing import Any, Dict, List, Optional

from connectors.base import ApiError, fetch_json

ACLED_API = "https://api.acleddata.com/acled/read"


def fetch_acled_events(
    *,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 200,
) -> List[Dict[str, Any]]:
    """
    Fetch events from ACLED. Dates should be 'YYYY-MM-DD'.
    """
    api_key = os.getenv("ACLED_API_KEY")
    params: Dict[str, Any] = {"limit": limit}
    if api_key:
        params["key"] = api_key
    if start_date:
        params["event_date"] = start_date
    if end_date:
        params["event_date_where"] = end_date

    data = fetch_json(ACLED_API, params=params)
    return data.get("data", [])
