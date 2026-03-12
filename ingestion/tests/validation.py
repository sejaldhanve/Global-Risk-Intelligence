from typing import Iterable

from pydantic import ValidationError

from schemas import EventNormalized


def validate_events(events: Iterable[dict]) -> list[EventNormalized]:
    validated = []
    for ev in events:
        try:
            validated.append(EventNormalized.model_validate(ev))
        except ValidationError as exc:
            raise AssertionError(f"Event failed validation: {exc}") from exc
    return validated


def assert_unique_ids(events: Iterable[dict]) -> None:
    ids = [ev["id"] for ev in events]
    assert len(ids) == len(set(ids)), "Duplicate ids found"
