from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession

from ..core.config import settings
from ..core.database import SessionLocal
from ..ingestion.gdelt_client import GdeltClient, GdeltFeature
from ..ingestion.scoring import compute_severity, compute_trust_score
from ..ingestion.source_reliability import get_source_reliability
from ..repositories import EventRepository

logger = logging.getLogger(__name__)


@asynccontextmanager
async def _get_session() -> AsyncIterator[AsyncSession]:
    session = SessionLocal()
    try:
        yield session
    finally:
        await session.close()


class IngestionService:
    def __init__(self) -> None:
        self.interval_seconds = settings.ingestion_interval_minutes * 60
        self.query = settings.gdelt_query
        self._task: asyncio.Task | None = None

    async def start(self) -> None:
        if self._task and not self._task.done():
            return
        logger.info("Starting GDELT ingestion loop", extra={"interval": self.interval_seconds})
        self._task = asyncio.create_task(self._run_forever())

    async def stop(self) -> None:
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass

    async def _run_forever(self) -> None:
        while True:
            try:
                await self.run_cycle()
            except Exception as exc:  # pragma: no cover - logging critical failure
                logger.exception("Ingestion cycle failed", exc_info=exc)
            await asyncio.sleep(self.interval_seconds)

    async def run_cycle(self) -> None:
        logger.info("Running GDELT ingestion cycle")
        async with GdeltClient() as client:
            features = await client.fetch_latest_events(query=self.query, max_records=200)
        logger.info("Fetched %d features from GDELT", len(features))

        if not features:
            return

        events_payload = [self._map_feature(feature) for feature in features]

        async with _get_session() as session:
            repo = EventRepository(session)
            upserted = await repo.upsert_events(events_payload)
            logger.info("Upserted %d events", upserted)

    def _map_feature(self, feature: GdeltFeature) -> dict:
        source_reliability = get_source_reliability(feature.source_name)
        trust_score = compute_trust_score(
            source_reliability=source_reliability,
            source_count=feature.source_count,
            source_name=feature.source_name,
            event_date=feature.event_date,
        )
        severity = compute_severity(feature.goldstein, feature.tone)

        return {
            "gdelt_id": feature.gdelt_id,
            "title": feature.title,
            "summary": feature.summary,
            "event_date": feature.event_date,
            "latitude": feature.latitude,
            "longitude": feature.longitude,
            "country": feature.country,
            "location_name": feature.location_name,
            "source_url": feature.source_url,
            "source_name": feature.source_name,
            "source_reliability": source_reliability,
            "severity": severity,
            "trust_score": trust_score,
            "categories": ",".join(feature.categories),
        }
