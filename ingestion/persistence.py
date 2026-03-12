import json
import logging
import os
from pathlib import Path
from typing import Iterable, List

import pandas as pd
from sqlalchemy import text

from db import get_session, engine
from models import Base, Event

logger = logging.getLogger(__name__)


def write_jsonl(events: Iterable[dict], path: Path) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        for ev in events:
            f.write(json.dumps(ev, default=str) + "\n")
    return path


def write_parquet(events: Iterable[dict], path: Path) -> Path:
    df = pd.DataFrame(list(events))
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(path, index=False)
    return path


def init_db():
    Base.metadata.create_all(bind=engine)


def upsert_events(events: List[dict]) -> int:
    """Upsert events into Postgres using SQLAlchemy Core."""
    if not events:
        return 0
    with get_session() as session:
        for ev in events:
            session.execute(
                text(
                    """
                    INSERT INTO events (id,title,source,source_reliability,location,latitude,longitude,event_type,
                                        severity,date,trust_score,raw,created_at,updated_at)
                    VALUES (:id,:title,:source,:source_reliability,:location,:latitude,:longitude,:event_type,
                            :severity,:date,:trust_score,CAST(:raw AS JSONB), NOW(), NOW())
                    ON CONFLICT (id) DO UPDATE SET
                        title = EXCLUDED.title,
                        location = EXCLUDED.location,
                        latitude = EXCLUDED.latitude,
                        longitude = EXCLUDED.longitude,
                        event_type = EXCLUDED.event_type,
                        severity = EXCLUDED.severity,
                        date = EXCLUDED.date,
                        trust_score = EXCLUDED.trust_score,
                        raw = EXCLUDED.raw,
                        updated_at = NOW();
                    """
                ),
                {**ev, "raw": json.dumps(ev.get("raw", {}), default=str)},
            )
    return len(events)
