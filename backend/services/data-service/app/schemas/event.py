from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class EventBase(BaseModel):
    gdelt_id: str
    title: Optional[str] = None
    summary: Optional[str] = None
    event_date: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    country: Optional[str] = None
    location_name: Optional[str] = None
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    source_reliability: Optional[float] = None
    severity: Optional[float] = None
    trust_score: Optional[float] = None
    categories: Optional[str] = None


class EventResponse(EventBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EventQuery(BaseModel):
    country: Optional[str] = Field(default=None)
    limit: int = Field(default=100, ge=1, le=500)
