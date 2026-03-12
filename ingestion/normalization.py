from datetime import datetime
from typing import Any, Dict, List, Optional

from cleaning import normalize_date, normalize_text, parse_location
from schemas import EventNormalized, SourceMeta
from trust import compute_trust_score

SOURCE_PRIORS = {
    "GDELT": 0.70,
    "ACLED": 0.82,
    "NEWSAPI": 0.65,
    "WORLD_BANK": 0.88,
    "FRED": 0.90,
    "ENERGY": 0.80,
}


def _meta(source: str, country: Optional[str] = None) -> SourceMeta:
    return SourceMeta(name=source, reliability_prior=SOURCE_PRIORS.get(source, 0.5), country_code=country)


def normalize_gdelt(feature: Dict[str, Any]) -> EventNormalized:
    props = feature.get("properties", {})
    geom = feature.get("geometry", {})
    coords = geom.get("coordinates") or [None, None]
    lon, lat = (coords + [None, None])[:2]

    event_date = normalize_date(props.get("eventDate"))
    event = EventNormalized(
        id=str(props.get("sourceid") or props.get("url")),
        title=normalize_text(props.get("action1")) or normalize_text(props.get("title")) or "Untitled event",
        source="GDELT",
        source_reliability=SOURCE_PRIORS["GDELT"],
        location=parse_location(props.get("location")) or props.get("country") or "Unknown",
        latitude=lat,
        longitude=lon,
        event_type=str(props.get("eventRootCode") or "Event"),
        severity=float(props.get("goldstein") or 0.0),
        date=event_date or datetime.utcnow(),
        trust_score=0.0,
        raw_source_url=props.get("url"),
        raw=props,
    )
    event.trust_score = compute_trust_score(event, _meta("GDELT", props.get("country")))
    return event


def normalize_acled(row: Dict[str, Any]) -> EventNormalized:
    event_date = normalize_date(row.get("event_date"))
    location = parse_location(row.get("location")) or parse_location(row.get("admin1"))
    event = EventNormalized(
        id=str(row.get("event_id_cnty") or row.get("event_id_no_cnty") or row.get("data_id")),
        title=normalize_text(row.get("event_type")) or "ACLED event",
        source="ACLED",
        source_reliability=SOURCE_PRIORS["ACLED"],
        location=location or "Unknown",
        latitude=float(row.get("latitude") or 0) if row.get("latitude") else None,
        longitude=float(row.get("longitude") or 0) if row.get("longitude") else None,
        event_type=normalize_text(row.get("sub_event_type")) or normalize_text(row.get("event_type")) or "Event",
        severity=float(row.get("fatalities") or 0),
        date=event_date or datetime.utcnow(),
        trust_score=0.0,
        raw_source_url=None,
        raw=row,
    )
    event.trust_score = compute_trust_score(event, _meta("ACLED", row.get("country")))
    return event


def normalize_newsapi(article: Dict[str, Any]) -> EventNormalized:
    source_name = (article.get("source") or {}).get("name")
    published_at = normalize_date(article.get("publishedAt"))
    event = EventNormalized(
        id=str(article.get("url")),
        title=normalize_text(article.get("title")) or "News article",
        source="NEWSAPI",
        source_reliability=SOURCE_PRIORS["NEWSAPI"],
        location="Unknown",
        latitude=None,
        longitude=None,
        event_type="news",
        severity=0.0,
        date=published_at or datetime.utcnow(),
        trust_score=0.0,
        raw_source_url=article.get("url"),
        raw=article,
    )
    event.trust_score = compute_trust_score(event, _meta("NEWSAPI"), corroborating_sources=[source_name] if source_name else None)
    return event


def normalize_worldbank(row: Dict[str, Any]) -> EventNormalized:
    country = (row.get("country") or {}).get("id") or (row.get("countryiso3code"))
    indicator = normalize_text(row.get("indicator", {}).get("id") if isinstance(row.get("indicator"), dict) else row.get("indicator"))
    date_val = normalize_date(row.get("date"))
    value = row.get("value")
    event = EventNormalized(
        id=f"WB-{indicator}-{country}-{row.get('date')}",
        title=f"World Bank {indicator} {country}",
        source="WORLD_BANK",
        source_reliability=SOURCE_PRIORS["WORLD_BANK"],
        location=country or "GLOBAL",
        latitude=None,
        longitude=None,
        event_type="indicator",
        severity=float(value or 0.0),
        date=date_val or datetime.utcnow(),
        trust_score=0.0,
        raw_source_url=None,
        raw=row,
    )
    event.trust_score = compute_trust_score(event, _meta("WORLD_BANK", country))
    return event


def normalize_fred(obs: Dict[str, Any]) -> EventNormalized:
    series_id = obs.get("series_id") or obs.get("id") or "fred"
    date_val = normalize_date(obs.get("date"))
    value = obs.get("value")
    event = EventNormalized(
        id=f"FRED-{series_id}-{obs.get('date')}",
        title=f"FRED {series_id}",
        source="FRED",
        source_reliability=SOURCE_PRIORS["FRED"],
        location="UNITED_STATES",
        latitude=None,
        longitude=None,
        event_type="economic_indicator",
        severity=float(value) if str(value).replace(".", "", 1).isdigit() else 0.0,
        date=date_val or datetime.utcnow(),
        trust_score=0.0,
        raw_source_url=None,
        raw=obs,
    )
    event.trust_score = compute_trust_score(event, _meta("FRED"))
    return event


def normalize_energy(row: Dict[str, Any]) -> EventNormalized:
    date_val = normalize_date(row.get("period"))
    value = row.get("value")
    event = EventNormalized(
        id=f"EIA-{row.get('series')}-{row.get('period')}",
        title=f"Energy series {row.get('series')}",
        source="ENERGY",
        source_reliability=SOURCE_PRIORS["ENERGY"],
        location=row.get("area-name") or "GLOBAL",
        latitude=None,
        longitude=None,
        event_type="energy_indicator",
        severity=float(value or 0.0),
        date=date_val or datetime.utcnow(),
        trust_score=0.0,
        raw_source_url=None,
        raw=row,
    )
    event.trust_score = compute_trust_score(event, _meta("ENERGY"))
    return event


def normalize_events(source: str, records: List[Dict[str, Any]]) -> List[EventNormalized]:
    if source == "GDELT":
        return [normalize_gdelt(r) for r in records]
    if source == "ACLED":
        return [normalize_acled(r) for r in records]
    if source == "NEWSAPI":
        return [normalize_newsapi(r) for r in records]
    if source == "WORLD_BANK":
        return [normalize_worldbank(r) for r in records]
    if source == "FRED":
        return [normalize_fred(r) for r in records]
    if source == "ENERGY":
        return [normalize_energy(r) for r in records]
    raise ValueError(f"Unknown source {source}")
