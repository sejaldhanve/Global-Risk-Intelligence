import re
from collections import OrderedDict
from datetime import datetime
from typing import Iterable, List, Optional

import pandas as pd
from dateutil import parser


def drop_duplicates(events: List[dict], key: str = "id") -> List[dict]:
    seen = OrderedDict()
    for ev in events:
        k = ev.get(key)
        if k not in seen:
            seen[k] = ev
    return list(seen.values())


def normalize_date(value: str | datetime | None) -> Optional[datetime]:
    if value is None or value == "":
        return None
    if isinstance(value, datetime):
        return value
    try:
        return parser.parse(str(value))
    except Exception:
        return None


def normalize_text(text: Optional[str]) -> Optional[str]:
    if text is None:
        return None
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def parse_location(name: Optional[str]) -> Optional[str]:
    if not name:
        return None
    return normalize_text(name)


def fill_missing(events: List[dict], defaults: dict) -> List[dict]:
    for ev in events:
        for key, val in defaults.items():
            if ev.get(key) in (None, "", [], {}):
                ev[key] = val
    return events


def clean_dataframe(df: pd.DataFrame, date_cols: Iterable[str] = ("date",)) -> pd.DataFrame:
    for col in date_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")
    df = df.drop_duplicates()
    return df
