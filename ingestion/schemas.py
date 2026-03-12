from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class SourceMeta(BaseModel):
    name: str
    reliability_prior: float = Field(ge=0, le=1)
    country_code: Optional[str] = None


class EventNormalized(BaseModel):
    id: str
    title: str
    source: str
    source_reliability: float
    location: str
    latitude: Optional[float]
    longitude: Optional[float]
    event_type: str
    severity: float
    date: datetime
    trust_score: float
    raw_source_url: Optional[HttpUrl] = None
    raw: dict = Field(default_factory=dict)


class GdeltRawRow(BaseModel):
    GLOBALEVENTID: int
    SQLDATE: int
    Actor1Name: Optional[str] = None
    Actor2Name: Optional[str] = None
    Actor1CountryCode: Optional[str] = None
    Actor2CountryCode: Optional[str] = None
    EventRootCode: Optional[str] = None
    GoldsteinScale: float
    NumSources: int
    AvgTone: float
    ActionGeo_FullName: Optional[str] = None
    ActionGeo_Lat: Optional[float] = None
    ActionGeo_Long: Optional[float] = None
    SOURCEURL: Optional[str] = None
