from datetime import datetime, timezone, timedelta

from intelligence import detect_conflict_escalation, detect_supply_chain_risk, detect_economic_disruption, Signal
from schemas import EventNormalized


def ev(id: str, title: str, location: str, event_type: str = "17", severity: float = 5.0):
    return EventNormalized(
        id=id,
        title=title,
        source="GDELT",
        source_reliability=0.7,
        location=location,
        latitude=None,
        longitude=None,
        event_type=event_type,
        severity=severity,
        date=datetime.now(timezone.utc) - timedelta(hours=1),
        trust_score=0.5,
        raw={},
    )


def test_conflict_escalation_detects():
    signals = detect_conflict_escalation([ev("1", "missile attack near port", "Haifa")])
    assert signals and signals[0].type == "conflict_escalation"


def test_supply_chain_risk_detects():
    signals = detect_supply_chain_risk([ev("2", "Port closed due to strike", "Rotterdam")])
    assert signals and signals[0].type == "supply_chain_risk"


def test_economic_disruption_detects():
    signals = detect_economic_disruption([ev("3", "new tariff imposed on imports", "USA")])
    assert any(s.type == "economic_disruption" for s in signals)
