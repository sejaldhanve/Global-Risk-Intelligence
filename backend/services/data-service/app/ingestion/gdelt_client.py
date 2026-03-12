from __future__ import annotations

from datetime import datetime
from typing import Any, List, Optional

import httpx
from dateutil import parser as date_parser
from pydantic import BaseModel

from ..core.config import settings


class GdeltFeature(BaseModel):
    gdelt_id: str
    title: Optional[str]
    summary: Optional[str]
    event_date: Optional[datetime]
    latitude: Optional[float]
    longitude: Optional[float]
    country: Optional[str]
    location_name: Optional[str]
    source_url: Optional[str]
    source_name: Optional[str]
    categories: List[str]
    tone: Optional[float]
    goldstein: Optional[float]
    source_count: Optional[int]


class GdeltClient:
    def __init__(self, *, base_url: str | None = None) -> None:
        self.base_url = base_url or settings.gdelt_base_url
        self._client: httpx.AsyncClient | None = None

    async def __aenter__(self) -> "GdeltClient":
        if not self._client:
            self._client = httpx.AsyncClient(timeout=30)
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        if self._client:
            await self._client.aclose()
            self._client = None

    async def close(self) -> None:
        if self._client:
            await self._client.aclose()
            self._client = None

    async def fetch_latest_events(
        self,
        *,
        query: str,
        max_records: int = 200,
        timespan: str = "24h",
    ) -> list[GdeltFeature]:
        if not self._client:
            self._client = httpx.AsyncClient(timeout=30)
        params = {
            "query": query,
            "format": "json",
            "timespan": timespan,
            "maxrecords": max_records,
        }
        response = await self._client.get(self.base_url, params=params)
        response.raise_for_status()
        data = response.json()
        features: list[GdeltFeature] = []

        for feature in data.get("features", []):
            properties: dict[str, Any] = feature.get("properties", {})
            geometry: dict[str, Any] = feature.get("geometry", {})
            coordinates = geometry.get("coordinates") or [None, None]
            lon, lat = None, None
            if isinstance(coordinates, list) and len(coordinates) >= 2:
                lon, lat = coordinates[0], coordinates[1]

            event_date = _parse_event_date(properties.get("eventDate"))
            categories = _build_categories(properties)

            features.append(
                GdeltFeature(
                    gdelt_id=str(properties.get("sourceid")) or str(properties.get("url")),
                    title=properties.get("action1"),
                    summary=properties.get("sharingimage"),
                    event_date=event_date,
                    latitude=lat,
                    longitude=lon,
                    country=properties.get("country"),
                    location_name=properties.get("location"),
                    source_url=properties.get("url"),
                    source_name=properties.get("source"),
                    categories=categories,
                    tone=_safe_float(properties.get("tone")),
                    goldstein=_safe_float(properties.get("goldstein")),
                    source_count=_safe_int(properties.get("numarticles")),
                )
            )

        return features


def _parse_event_date(value: Any) -> Optional[datetime]:
    if not value:
        return None
    try:
        return date_parser.parse(str(value))
    except (ValueError, TypeError):
        return None


def _safe_float(value: Any) -> Optional[float]:
    try:
        if value is None:
            return None
        return float(value)
    except (ValueError, TypeError):
        return None


def _safe_int(value: Any) -> Optional[int]:
    try:
        if value is None:
            return None
        return int(value)
    except (ValueError, TypeError):
        return None


def _build_categories(properties: dict[str, Any]) -> list[str]:
    categories: list[str] = []
    for key in ("eventRootCode", "eventBaseCode", "eventCode"):
        value = properties.get(key)
        if value:
            categories.append(str(value))
    return categories
