import json
import logging
import os
from pathlib import Path
from typing import Iterable, List

import pandas as pd
from sqlalchemy import text
from sqlalchemy.engine import Engine
from sqlalchemy import create_engine

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


def _engine() -> Engine:
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise ValueError("DATABASE_URL env var must be set to persist into PostgreSQL")
    return create_engine(db_url)


def upsert_postgres(events: List[dict], table: str = "events") -> int:
    if not events:
        return 0
    engine = _engine()
    with engine.begin() as conn:
        for ev in events:
            # Basic upsert using INSERT ... ON CONFLICT (requires unique constraint on id)
            stmt = text(
                f"""
                INSERT INTO {table} (id, title, source, source_reliability, location, latitude, longitude,
                                     event_type, severity, date, trust_score, raw)
                VALUES (:id, :title, :source, :source_reliability, :location, :latitude, :longitude,
                        :event_type, :severity, :date, :trust_score, CAST(:raw AS JSONB))
                ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    location = EXCLUDED.location,
                    latitude = EXCLUDED.latitude,
                    longitude = EXCLUDED.longitude,
                    event_type = EXCLUDED.event_type,
                    severity = EXCLUDED.severity,
                    date = EXCLUDED.date,
                    trust_score = EXCLUDED.trust_score,
                    raw = EXCLUDED.raw;
                """
            )
            conn.execute(stmt, {**ev, "raw": json.dumps(ev.get("raw", {}), default=str)})
    return len(events)
