from __future__ import annotations

from collections.abc import Sequence
from typing import Iterable

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Event


class EventRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def upsert_events(self, events: Iterable[dict]) -> int:
        insert_stmt = insert(Event).values(list(events))
        stmt = insert_stmt.on_conflict_do_update(
            index_elements=[Event.gdelt_id],
            set_={
                "title": getattr(insert_stmt.excluded, "title"),
                "summary": getattr(insert_stmt.excluded, "summary"),
                "event_date": getattr(insert_stmt.excluded, "event_date"),
                "latitude": getattr(insert_stmt.excluded, "latitude"),
                "longitude": getattr(insert_stmt.excluded, "longitude"),
                "country": getattr(insert_stmt.excluded, "country"),
                "location_name": getattr(insert_stmt.excluded, "location_name"),
                "source_url": getattr(insert_stmt.excluded, "source_url"),
                "source_name": getattr(insert_stmt.excluded, "source_name"),
                "source_reliability": getattr(insert_stmt.excluded, "source_reliability"),
                "severity": getattr(insert_stmt.excluded, "severity"),
                "trust_score": getattr(insert_stmt.excluded, "trust_score"),
                "categories": getattr(insert_stmt.excluded, "categories"),
            },
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount or 0

    async def list_events(self, limit: int = 100) -> Sequence[Event]:
        stmt = select(Event).order_by(Event.event_date.desc().nullslast()).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all()
