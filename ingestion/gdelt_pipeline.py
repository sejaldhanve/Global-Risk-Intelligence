import io
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import List

import pandas as pd
import requests
from dateutil import parser
from tenacity import retry, stop_after_attempt, wait_exponential

from config import (
    DATA_DIR,
    EVENT_ROOT_MAP,
    GDELT_BASE_URL,
    GDELT_COLUMNS,
    GDELT_LASTUPDATE_URL,
    SOURCE_BASE_RELIABILITY,
)
from schemas import EventNormalized, GdeltRawRow, SourceMeta
from trust import compute_trust_score


@retry(wait=wait_exponential(multiplier=1, min=1, max=8), stop=stop_after_attempt(3))
def fetch_lastupdate_text() -> str:
    resp = requests.get(GDELT_LASTUPDATE_URL, timeout=20)
    resp.raise_for_status()
    return resp.text


def parse_lastupdate(text: str, limit: int = 2) -> List[str]:
    """
    lastupdate.txt lines look like:
    <filesize> <md5> http://data.gdeltproject.org/gdeltv2/20260312090000.export.CSV.zip
    We want the newest N .export.CSV.zip URLs.
    """
    urls = []
    for line in text.strip().splitlines():
        parts = line.split()
        # URL is usually the last token
        for token in reversed(parts):
            if token.endswith(".export.CSV.zip"):
                # token is already absolute URL
                urls.append(token if token.startswith("http") else f"{GDELT_BASE_URL}/{token}")
                break
    return urls[:limit]


@retry(wait=wait_exponential(multiplier=1, min=1, max=8), stop=stop_after_attempt(3))
def fetch_gdelt_file(url: str) -> pd.DataFrame:
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    with zipfile.ZipFile(io.BytesIO(resp.content)) as zf:
        inner = zf.namelist()[0]
        with zf.open(inner) as f:
            df = pd.read_csv(
                f,
                sep="\t",
                header=None,
                names=GDELT_COLUMNS,
                dtype={"SQLDATE": str, "EventRootCode": str},
                low_memory=False,
            )
    return df


def to_datetime(sql_date: str) -> datetime:
    # SQLDATE is yyyymmdd
    return datetime.strptime(sql_date, "%Y%m%d").replace(tzinfo=timezone.utc)


def build_title(row: GdeltRawRow) -> str:
    actors = [a for a in [row.Actor1Name, row.Actor2Name] if a]
    actors_part = " vs ".join(actors) if actors else "Unspecified actors"
    action = EVENT_ROOT_MAP.get(row.EventRootCode or "", "Event")
    return f"{actors_part} — {action}"


def normalize_row(row_dict: dict) -> EventNormalized:
    raw = GdeltRawRow(**row_dict)
    event_dt = to_datetime(raw.SQLDATE)
    event_type = EVENT_ROOT_MAP.get(raw.EventRootCode or "", "Event")
    location = raw.ActionGeo_FullName or "Unknown location"

    event = EventNormalized(
        id=str(raw.GLOBALEVENTID),
        title=build_title(raw),
        source="GDELT",
        source_reliability=SOURCE_BASE_RELIABILITY["GDELT"],
        location=location,
        latitude=raw.ActionGeo_Lat,
        longitude=raw.ActionGeo_Long,
        event_type=event_type,
        severity=raw.GoldsteinScale,
        date=event_dt,
        trust_score=0.0,  # placeholder until computed
        raw_source_url=raw.SOURCEURL,
        raw=row_dict,
    )

    source_meta = SourceMeta(
        name="GDELT",
        reliability_prior=SOURCE_BASE_RELIABILITY["GDELT"],
        country_code=raw.Actor1CountryCode or raw.Actor2CountryCode,
    )
    event.trust_score = compute_trust_score(event, source_meta)
    return event


def normalize_df(df: pd.DataFrame) -> List[EventNormalized]:
    normalized = []
    for row in df.to_dict(orient="records"):
        try:
            normalized.append(normalize_row(row))
        except Exception:
            # Skip malformed rows but keep going
            continue
    return normalized


def persist_events(events: List[EventNormalized], basename: str = "gdelt_events") -> Path:
    jsonl_path = DATA_DIR / f"{basename}.jsonl"
    parquet_path = DATA_DIR / f"{basename}.parquet"

    # JSONL for quick API consumption
    with jsonl_path.open("w", encoding="utf-8") as f:
        for ev in events:
            f.write(ev.model_dump_json() + "\n")

    # Parquet for analytics
    pd.DataFrame([ev.model_dump(mode="json") for ev in events]).to_parquet(parquet_path, index=False)
    return jsonl_path


def run(limit_files: int = 1) -> List[EventNormalized]:
    text = fetch_lastupdate_text()
    urls = parse_lastupdate(text, limit=limit_files)
    frames = [fetch_gdelt_file(u) for u in urls]
    df = pd.concat(frames, ignore_index=True)
    events = normalize_df(df)
    persist_events(events)
    return events


if __name__ == "__main__":
    events = run(limit_files=1)
    print(f"Ingested {len(events)} GDELT events; sample:")
    for ev in events[:3]:
        print(ev.model_dump())
