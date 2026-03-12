from typing import Any, Dict, List

from connectors.base import fetch_json

WORLD_BANK_API = "https://api.worldbank.org/v2/country/{country}/indicator/{indicator}"


def fetch_indicator(country: str, indicator: str, *, per_page: int = 200, page: int = 1) -> List[Dict[str, Any]]:
    url = WORLD_BANK_API.format(country=country, indicator=indicator)
    params = {"format": "json", "per_page": per_page, "page": page}
    data = fetch_json(url, params=params)
    # World Bank returns [metadata, data]
    return data[1] if isinstance(data, list) and len(data) > 1 else []
