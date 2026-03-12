import math
from datetime import datetime, timezone
from typing import Iterable, Optional

from schemas import EventNormalized, SourceMeta


def recency_decay(event_dt: datetime, half_life_hours: float = 72.0) -> float:
    """Half-life decay to down-weight stale events."""
    now = datetime.now(timezone.utc)
    age_hours = max((now - event_dt).total_seconds() / 3600, 0)
    return 0.5 ** (age_hours / half_life_hours)


def corroboration_bonus(corroborating_sources: Optional[Iterable[str]]) -> float:
    if not corroborating_sources:
        return 0.0
    unique_sources = len(set(corroborating_sources))
    return min(0.15 * unique_sources, 0.45)


def severity_weight(severity: float) -> float:
    # Goldstein scale ranges roughly -10 to +10; map absolute value to 0-0.2
    return min(abs(severity) / 50.0, 0.2)


def compute_trust_score(
    event: EventNormalized,
    source_meta: SourceMeta,
    corroborating_sources: Optional[Iterable[str]] = None,
) -> float:
    """
    Combine source prior, recency, corroboration, and severity into a trust score.
    Score is bounded 0..1 and biased to be conservative.
    """
    base = source_meta.reliability_prior
    recency = recency_decay(event.date)
    corroboration = corroboration_bonus(corroborating_sources)
    severity_adj = severity_weight(event.severity)

    # Weighted geometric mean to penalize low components
    score = (base * 0.55) + (recency * 0.25) + corroboration + severity_adj
    return max(0.0, min(score, 1.0))
