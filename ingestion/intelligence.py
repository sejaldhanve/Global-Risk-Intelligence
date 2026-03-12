"""
Rule + heuristic based intelligence layer over normalized data.
Detects:
 - conflict escalation
 - supply chain risk
 - economic disruption signals
Designed to run on normalized events/indicators already produced by the pipelines.
"""
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Iterable, List, Optional

from schemas import EventNormalized


@dataclass
class Signal:
    type: str
    severity: float
    confidence: float
    summary: str
    related_event_ids: List[str]
    generated_at: datetime = datetime.now(timezone.utc)


# Simple keyword buckets for quick rules
CONFLICT_KEYWORDS = {"attack", "airstrike", "shelling", "missile", "clash", "assault", "riot", "protest", "bomb"}
SUPPLY_CHAIN_KEYWORDS = {"port", "shipping", "strait", "canal", "pipeline", "refinery", "rail", "bridge", "logistics"}
ECONOMIC_KEYWORDS = {"inflation", "tariff", "sanction", "export ban", "import ban", "default", "currency"}


def _has_keyword(text: str, keywords: set[str]) -> bool:
    low = text.lower()
    return any(k in low for k in keywords)


def detect_conflict_escalation(events: Iterable[EventNormalized], lookback_hours: int = 48) -> List[Signal]:
    cutoff = datetime.now(timezone.utc) - timedelta(hours=lookback_hours)
    bucket = defaultdict(list)
    for ev in events:
        if ev.date < cutoff:
            continue
        key = ev.location or "UNKNOWN"
        if _has_keyword(ev.title, CONFLICT_KEYWORDS) or (ev.event_type and ev.event_type.startswith("1") or ev.event_type.startswith("17") or ev.event_type.startswith("18")):
            bucket[key].append(ev)

    signals: List[Signal] = []
    for loc, evs in bucket.items():
        severity = min(1.0, sum(abs(e.severity) for e in evs) / (10 * len(evs)))
        confidence = min(1.0, 0.5 + 0.05 * len(evs))
        summary = f"Conflict escalation detected in {loc}: {len(evs)} events in {lookback_hours}h."
        signals.append(Signal("conflict_escalation", severity, confidence, summary, [e.id for e in evs]))
    return signals


def detect_supply_chain_risk(events: Iterable[EventNormalized], lookback_hours: int = 72) -> List[Signal]:
    cutoff = datetime.now(timezone.utc) - timedelta(hours=lookback_hours)
    bucket = defaultdict(list)
    for ev in events:
        if ev.date < cutoff:
            continue
        if _has_keyword(ev.title, SUPPLY_CHAIN_KEYWORDS) or _has_keyword(ev.location or "", SUPPLY_CHAIN_KEYWORDS):
            key = ev.location or "UNKNOWN"
            bucket[key].append(ev)

    signals = []
    for loc, evs in bucket.items():
        severity = min(1.0, 0.6 + 0.05 * len(evs))
        confidence = min(1.0, 0.4 + 0.08 * len(evs))
        summary = f"Supply chain disruption risk near {loc}: {len(evs)} recent incidents."
        signals.append(Signal("supply_chain_risk", severity, confidence, summary, [e.id for e in evs]))
    return signals


def detect_economic_disruption(events: Iterable[EventNormalized], indicators: Optional[Iterable[dict]] = None, lookback_hours: int = 168) -> List[Signal]:
    cutoff = datetime.now(timezone.utc) - timedelta(hours=lookback_hours)
    econ_events = [ev for ev in events if ev.date >= cutoff and _has_keyword(ev.title, ECONOMIC_KEYWORDS)]
    signals = []
    if econ_events:
        severity = min(1.0, 0.5 + 0.05 * len(econ_events))
        confidence = min(1.0, 0.5 + 0.05 * len(econ_events))
        summary = f"Economic disruption signals: {len(econ_events)} pertinent events in last {lookback_hours}h."
        signals.append(Signal("economic_disruption", severity, confidence, summary, [e.id for e in econ_events]))

    if indicators:
        drops = [row for row in indicators if row.get("delta") and row["delta"] < 0]
        if drops:
            severity = min(1.0, 0.4 + 0.1 * len(drops))
            confidence = min(1.0, 0.4 + 0.05 * len(drops))
            summary = f"{len(drops)} macro indicators trending down."
            signals.append(Signal("economic_disruption", severity, confidence, summary, []))
    return signals


def run_intelligence(events: List[EventNormalized], indicators: Optional[List[dict]] = None) -> List[Signal]:
    signals = []
    signals.extend(detect_conflict_escalation(events))
    signals.extend(detect_supply_chain_risk(events))
    signals.extend(detect_economic_disruption(events, indicators))
    return signals
