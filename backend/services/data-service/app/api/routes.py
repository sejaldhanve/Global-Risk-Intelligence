from fastapi import APIRouter

from .v1 import events

router = APIRouter()
router.include_router(events.router, prefix="/v1/events", tags=["events"])
