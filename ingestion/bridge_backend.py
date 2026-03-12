"""
Adapter to turn our normalized GDELT events into the data-service schema
(`backend/services/data-service/app/schemas/event.py`) without touching backend code.

Usage:
    python bridge_backend.py \
        --source ingestion/output/gdelt_events.jsonl \
        --out ingestion/output/events_for_backend.jsonl
"""
import argparse
import json
from datetime import datetime
from pathlib import Path


def load_events(path: Path):
    with path.open() as f:
        for line in f:
            yield json.loads(line)


def map_event(ev: dict) -> dict:
    raw = ev.get("raw", {}) or {}
    return {
        "gdelt_id": ev.get("id"),
        "title": ev.get("title"),
        "summary": raw.get("summary"),  # not present in v2 feed; left for parity
        "event_date": ev.get("date"),
        "latitude": ev.get("latitude"),
        "longitude": ev.get("longitude"),
        "country": raw.get("ActionGeo_CountryCode") or raw.get("Actor1CountryCode"),
        "location_name": ev.get("location"),
        "source_url": ev.get("raw_source_url"),
        "source_name": ev.get("source"),
        "source_reliability": ev.get("source_reliability"),
        "severity": ev.get("severity"),
        "trust_score": ev.get("trust_score"),
        # categories expected as comma-separated string in backend EventBase
        "categories": raw.get("EventRootCode") or ev.get("event_type"),
    }


def normalize_event_date(payload: dict) -> dict:
    dt = payload.get("event_date")
    if isinstance(dt, str):
        try:
            payload["event_date"] = datetime.fromisoformat(dt)
        except ValueError:
            payload["event_date"] = None
    return payload


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=Path("ingestion/output/gdelt_events.jsonl"))
    parser.add_argument("--out", type=Path, default=Path("ingestion/output/events_for_backend.jsonl"))
    args = parser.parse_args()

    mapped = []
    for ev in load_events(args.source):
        payload = map_event(ev)
        payload = normalize_event_date(payload)
        mapped.append(payload)

    with args.out.open("w", encoding="utf-8") as f:
        for ev in mapped:
            # ensure JSON-serializable (datetime -> isoformat)
            if isinstance(ev.get("event_date"), datetime):
                ev["event_date"] = ev["event_date"].isoformat()
            f.write(json.dumps(ev) + "\n")

    print(f"Wrote {len(mapped)} events to {args.out}")


if __name__ == "__main__":
    main()
