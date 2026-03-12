import json
import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


def safe_json_loads(payload: str) -> Dict[str, Any] | None:
    try:
        return json.loads(payload)
    except json.JSONDecodeError as exc:
        logger.warning("Malformed JSON encountered", extra={"error": str(exc)})
        return None


def harmonize_keys(record: Dict[str, Any], key_map: Dict[str, str]) -> Dict[str, Any]:
    """
    Fix inconsistent field names by renaming keys per key_map.
    """
    for old, new in key_map.items():
        if old in record and new not in record:
            record[new] = record.pop(old)
    return record


def log_ingestion_results(source: str, total: int, success: int, failures: int) -> None:
    logger.info(
        "Ingestion summary",
        extra={"source": source, "total": total, "success": success, "failures": failures},
    )
