"""
Lightweight ingestion orchestrator that runs every 6 hours.
"""
import asyncio
import logging
from pathlib import Path
from typing import Callable, List

from cleaning import drop_duplicates
from connectors import (
    fetch_acled_events,
    fetch_energy_series,
    fetch_fred_series,
    fetch_gdelt_events,
    fetch_indicator,
    fetch_news,
)
from debugging import log_ingestion_results
from normalization import normalize_events
from persistence import write_jsonl, write_parquet, upsert_events, init_db

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

OUTPUT_DIR = Path("ingestion/output")


def run_pipeline(name: str, fetch_fn: Callable, normalize_source: str, *fetch_args, **fetch_kwargs) -> List[dict]:
    try:
        raw = fetch_fn(*fetch_args, **fetch_kwargs)
        normalized = [ev.model_dump() for ev in normalize_events(normalize_source, raw)]
        cleaned = drop_duplicates(normalized)
        write_jsonl(cleaned, OUTPUT_DIR / f"{name}.jsonl")
        write_parquet(cleaned, OUTPUT_DIR / f"{name}.parquet")
        log_ingestion_results(normalize_source, len(raw), len(cleaned), len(raw) - len(cleaned))
        try:
            upsert_events(cleaned)
        except Exception as exc:
            logger.warning("PostgreSQL upsert skipped/failed", exc_info=exc)
        return cleaned
    except Exception as exc:
        logger.exception("Pipeline failed", extra={"pipeline": name})
        return []


async def main_loop(interval_hours: int = 6):
    init_db()
    while True:
        logger.info("Starting scheduled ingestion cycle")
        await asyncio.gather(
            asyncio.to_thread(run_pipeline, "gdelt", fetch_gdelt_events, "GDELT", "conflict OR protest", "6 hours"),
            asyncio.to_thread(run_pipeline, "acled", fetch_acled_events, "ACLED"),
            asyncio.to_thread(run_pipeline, "newsapi", fetch_news, "NEWSAPI", "geopolitics"),
            asyncio.to_thread(run_pipeline, "worldbank", fetch_indicator, "WORLD_BANK", "all", "SP.POP.TOTL"),
            asyncio.to_thread(run_pipeline, "fred", fetch_fred_series, "FRED", "DGS10"),
            asyncio.to_thread(run_pipeline, "energy", fetch_energy_series, "ENERGY", "petroleum/pri/gnd", "RWTC.D"),
        )
        logger.info("Cycle complete; sleeping")
        await asyncio.sleep(interval_hours * 3600)


if __name__ == "__main__":
    asyncio.run(main_loop())
