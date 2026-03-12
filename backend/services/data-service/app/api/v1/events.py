from collections.abc import Sequence

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.database import get_session
from ...models import Event
from ...schemas.event import EventQuery, EventResponse

router = APIRouter()


@router.get("/", response_model=Sequence[EventResponse])
async def list_events(
    country: str | None = Query(default=None, description="Filter by ISO country name"),
    limit: int = Query(default=100, ge=1, le=500, description="Maximum records to return"),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Event).order_by(Event.event_date.desc().nullslast()).limit(limit)
    if country:
        stmt = stmt.where(Event.country == country)

    result = await session.execute(stmt)
    events = result.scalars().all()
    return events
