from contextlib import asynccontextmanager

from fastapi import FastAPI

from .api.routes import router as api_router
from .core.config import settings
from .services import IngestionService

ingestion_service = IngestionService()


@asynccontextmanager
async def lifespan(app: FastAPI):  # pragma: no cover - integration lifecycle
    await ingestion_service.start()
    yield
    await ingestion_service.stop()


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, lifespan=lifespan)
    app.include_router(api_router)
    return app


app = create_app()
