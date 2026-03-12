# Ingestion Pipelines

Python utilities to pull external data into the Global Risk Intelligence platform. Start with GDELT events; other sources follow the same pattern.

## Quick start

```bash
cd ingestion
python -m venv .venv
. .venv/Scripts/activate  # Windows
pip install -r requirements.txt
python gdelt_pipeline.py
```

Outputs land in `ingestion/output/` as JSONL (for APIs) and Parquet (for analytics).

## Structure
- `gdelt_pipeline.py` – fetch latest GDELT 2.1 events, normalize, trust-score.
- `schemas.py` – Pydantic models for normalized events and raw rows.
- `trust.py` – trust scoring helpers.
- `config.py` – endpoints, constants, and column definitions.
