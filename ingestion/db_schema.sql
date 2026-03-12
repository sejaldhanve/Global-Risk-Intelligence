-- PostgreSQL schema for Global Risk Intelligence

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    source_reliability NUMERIC(4,3) NOT NULL,
    location TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    event_type TEXT,
    severity DOUBLE PRECISION,
    date TIMESTAMPTZ NOT NULL,
    trust_score DOUBLE PRECISION NOT NULL,
    raw JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events (date DESC);
CREATE INDEX IF NOT EXISTS idx_events_location ON events (location);
CREATE INDEX IF NOT EXISTS idx_events_type ON events (event_type);

CREATE TABLE IF NOT EXISTS indicators (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    country TEXT,
    value DOUBLE PRECISION,
    date DATE,
    raw JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_indicators_date ON indicators (date DESC);
CREATE INDEX IF NOT EXISTS idx_indicators_country ON indicators (country);

CREATE TABLE IF NOT EXISTS narratives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    event_ids TEXT[] DEFAULT '{}',
    confidence DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_text TEXT NOT NULL,
    source TEXT,
    event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
    validity_score DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    horizon_days INTEGER NOT NULL,
    region TEXT,
    sector TEXT,
    narrative_id UUID REFERENCES narratives(id) ON DELETE SET NULL,
    probability DOUBLE PRECISION NOT NULL,
    impact DOUBLE PRECISION,
    rationale TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_forecasts_region ON risk_forecasts (region);
CREATE INDEX IF NOT EXISTS idx_risk_forecasts_sector ON risk_forecasts (sector);
