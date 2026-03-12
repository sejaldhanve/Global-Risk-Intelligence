from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = Field(default="global-risk-intelligence-data-service", alias="APP_NAME")
    app_port: int = Field(default=8001, alias="APP_PORT")
    database_url: str = Field(..., alias="DATABASE_URL")
    gdelt_base_url: str = Field(..., alias="GDELT_BASE_URL")
    gdelt_query: str = Field(default="conflict OR war", alias="GDELT_QUERY")
    default_event_limit: int = Field(default=100, alias="DEFAULT_EVENT_LIMIT")
    ingestion_interval_minutes: int = Field(default=30, alias="INGESTION_INTERVAL_MINUTES")

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        case_sensitive=False,
        extra="allow",
    )


settings = Settings()
