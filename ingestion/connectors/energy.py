import os
from typing import Any, Dict, List

from connectors.base import ApiError, fetch_json

EIA_API = "https://api.eia.gov/v2"


def fetch_energy_series(dataset: str, series_id: str, *, start: str | None = None, end: str | None = None, limit: int = 2000) -> List[Dict[str, Any]]:
    """
    Generic EIA v2 fetcher.
    dataset example: 'petroleum/pri/gnd'
    """
    api_key = os.getenv("EIA_API_KEY")
    if not api_key:
        raise ApiError("EIA_API_KEY env var is required")

    url = f"{EIA_API}/{dataset}/data/"
    params: Dict[str, Any] = {"api_key": api_key, "frequency": "monthly", "data[0]": "value", "sort[0][column]": "period", "sort[0][direction]": "desc", "offset": 0, "length": limit}
    params["series"] = series_id
    if start:
        params["start"] = start
    if end:
        params["end"] = end

    data = fetch_json(url, params=params)
    return data.get("response", {}).get("data", [])
