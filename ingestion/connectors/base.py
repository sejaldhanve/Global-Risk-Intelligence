import logging
from typing import Any, Dict, Optional

import requests
from requests import Response
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)


class ApiError(Exception):
    """Raised when an API call fails after retries."""


@retry(wait=wait_exponential(multiplier=1, min=1, max=20), stop=stop_after_attempt(3))
def _request(method: str, url: str, *, params: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None) -> Response:
    resp = requests.request(method=method, url=url, params=params, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp


def fetch_json(url: str, *, params: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
    try:
        resp = _request("GET", url, params=params, headers=headers)
        return resp.json()
    except Exception as exc:
        logger.error("API request failed", extra={"url": url, "params": params, "error": str(exc)})
        raise ApiError(str(exc)) from exc
