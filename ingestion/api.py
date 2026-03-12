"""
FastAPI app exposing dashboard-friendly read endpoints for events, indicators,
narratives, claims, and risk forecasts. This lives in the ingestion package to
avoid touching the pulled backend service.
"""
from typing import List, Optional

from fastapi import Depends, FastAPI, Query
from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from db import get_session
from models import Event, Indicator, Narrative, Claim, RiskForecast

app = FastAPI(title="GRI Ingestion API", version="0.1.0")


def get_db():
    with get_session() as session:
        yield session


@app.get("/events")
def list_events(
    limit: int = Query(200, ge=1, le=500),
    country: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    stmt = select(Event).order_by(desc(Event.date)).limit(limit)
    if country:
        stmt = stmt.where(Event.location == country)
    rows = db.execute(stmt).scalars().all()
    return rows


@app.get("/indicators")
def list_indicators(
    limit: int = Query(200, ge=1, le=500),
    country: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    stmt = select(Indicator).order_by(desc(Indicator.date)).limit(limit)
    if country:
        stmt = stmt.where(Indicator.country == country)
    return db.execute(stmt).scalars().all()


@app.get("/narratives")
def list_narratives(limit: int = Query(100, ge=1, le=500), db: Session = Depends(get_db)):
    stmt = select(Narrative).order_by(desc(Narrative.created_at)).limit(limit)
    return db.execute(stmt).scalars().all()


@app.get("/claims")
def list_claims(limit: int = Query(200, ge=1, le=500), db: Session = Depends(get_db)):
    stmt = select(Claim).order_by(desc(Claim.created_at)).limit(limit)
    return db.execute(stmt).scalars().all()


@app.get("/risk-forecasts")
def list_risk_forecasts(
    limit: int = Query(200, ge=1, le=500),
    region: Optional[str] = None,
    sector: Optional[str] = None,
    db: Session = Depends(get_db),
):
    stmt = select(RiskForecast).order_by(desc(RiskForecast.created_at)).limit(limit)
    if region:
        stmt = stmt.where(RiskForecast.region == region)
    if sector:
        stmt = stmt.where(RiskForecast.sector == sector)
    return db.execute(stmt).scalars().all()


@app.get("/health")
def health():
    return {"status": "ok"}
