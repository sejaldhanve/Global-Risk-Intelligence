from __future__ import annotations

from datetime import datetime, timezone

from ..core.config import settings


def normalize(value: float | None, *, min_val: float = 0.0, max_val: float = 1.0) -> float:
    if value is None:
        return 0.0
    if max_val == min_val:
        return min_val
    clamped = max(min(value, max_val), min_val)
    return (clamped - min_val) / (max_val - min_val)


def compute_recency_score(event_date: datetime | None) -> float:
    if not event_date:
        return 0.5
    now = datetime.now(timezone.utc)
    diff_hours = (now - event_date).total_seconds() / 3600
    if diff_hours <= 1:
        return 1.0
    if diff_hours >= 72:
        return 0.1
    return max(0.1, 1 - (diff_hours / 72))


def compute_source_rank(source_name: str | None) -> float:
    if not source_name:
        return 0.2
    priority_sources = {
        "Reuters": 0.95,
        "BBC": 0.95,
        "Financial Times": 0.93,
        "Bloomberg": 0.92,
        "Al Jazeera": 0.9,
        "Associated Press": 0.9,
    }
    return priority_sources.get(source_name, 0.6)


def compute_trust_score(
    *,
    source_reliability: float,
    source_count: int | None,
    source_name: str | None,
    event_date: datetime | None,
) -> float:
    normalized_source_count = normalize(float(source_count or 1), min_val=0, max_val=10)
    source_rank = compute_source_rank(source_name)
    recency = compute_recency_score(event_date)

    score = (
        0.35 * source_reliability
        + 0.30 * normalized_source_count
        + 0.20 * source_rank
        + 0.15 * recency
    )
    return round(min(max(score, 0.0), 1.0), 3)


def compute_severity(goldstein: float | None, tone: float | None) -> float:
    goldstein_score = normalize(abs(goldstein or 0.0), min_val=0, max_val=10)
    tone_score = normalize(50 - (tone or 0.0), min_val=0, max_val=50)
    severity = 0.6 * goldstein_score + 0.4 * tone_score
    return round(min(max(severity, 0.0), 1.0), 3)
