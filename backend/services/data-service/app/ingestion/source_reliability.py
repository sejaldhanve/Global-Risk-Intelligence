SOURCE_RELIABILITY: dict[str, float] = {
    "Reuters": 0.95,
    "BBC": 0.95,
    "Financial Times": 0.93,
    "Associated Press": 0.92,
    "Al Jazeera": 0.9,
    "Bloomberg": 0.94,
    "The Guardian": 0.88,
    "CNN": 0.87,
    "New York Times": 0.92,
    "Washington Post": 0.9,
    "Unknown": 0.2,
}


def get_source_reliability(source_name: str | None) -> float:
    if not source_name:
        return SOURCE_RELIABILITY["Unknown"]
    return SOURCE_RELIABILITY.get(source_name, 0.5)
