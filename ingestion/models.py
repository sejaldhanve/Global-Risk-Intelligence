from datetime import datetime
from typing import Optional

from sqlalchemy import Column, Date, Float, String, Text, TIMESTAMP, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True)
    title = Column(Text, nullable=False)
    source = Column(String, nullable=False)
    source_reliability = Column(Float, nullable=False)
    location = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    event_type = Column(String)
    severity = Column(Float)
    date = Column(TIMESTAMP(timezone=True), nullable=False)
    trust_score = Column(Float, nullable=False)
    raw = Column(JSON, default={})
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)


class Indicator(Base):
    __tablename__ = "indicators"

    id = Column(String, primary_key=True)
    name = Column(Text, nullable=False)
    source = Column(String, nullable=False)
    country = Column(String)
    value = Column(Float)
    date = Column(Date)
    raw = Column(JSON, default={})
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)


class Narrative(Base):
    __tablename__ = "narratives"

    id = Column(UUID(as_uuid=True), primary_key=True)
    title = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    event_ids = Column(ARRAY(String), default=list)
    confidence = Column(Float)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)


class Claim(Base):
    __tablename__ = "claims"

    id = Column(UUID(as_uuid=True), primary_key=True)
    claim_text = Column(Text, nullable=False)
    source = Column(String)
    event_id = Column(String)
    validity_score = Column(Float)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)


class RiskForecast(Base):
    __tablename__ = "risk_forecasts"

    id = Column(UUID(as_uuid=True), primary_key=True)
    horizon_days = Column(Integer, nullable=False)
    region = Column(String)
    sector = Column(String)
    narrative_id = Column(UUID(as_uuid=True))
    probability = Column(Float, nullable=False)
    impact = Column(Float)
    rationale = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)
