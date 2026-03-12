from datetime import datetime

from sqlalchemy import DateTime, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import TimestampedBase


class Event(TimestampedBase):
    __tablename__ = "events"

    gdelt_id: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    title: Mapped[str | None] = mapped_column(String(512), nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    event_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    country: Mapped[str | None] = mapped_column(String(128))
    location_name: Mapped[str | None] = mapped_column(String(256))

    source_url: Mapped[str | None] = mapped_column(Text)
    source_name: Mapped[str | None] = mapped_column(String(128))
    source_reliability: Mapped[float | None] = mapped_column(Float)

    severity: Mapped[float | None] = mapped_column(Float)
    trust_score: Mapped[float | None] = mapped_column(Float)
    categories: Mapped[str | None] = mapped_column(String(256))
