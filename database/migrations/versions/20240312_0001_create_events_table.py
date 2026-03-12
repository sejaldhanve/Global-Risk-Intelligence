"""create events table

Revision ID: 20240312_0001
Revises: 
Create Date: 2026-03-12 08:25:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20240312_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "events",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column("gdelt_id", sa.String(length=64), nullable=False, unique=True),
        sa.Column("title", sa.String(length=512)),
        sa.Column("summary", sa.Text()),
        sa.Column("event_date", sa.DateTime(timezone=True)),
        sa.Column("latitude", sa.Float()),
        sa.Column("longitude", sa.Float()),
        sa.Column("country", sa.String(length=128)),
        sa.Column("location_name", sa.String(length=256)),
        sa.Column("source_url", sa.Text()),
        sa.Column("source_name", sa.String(length=128)),
        sa.Column("source_reliability", sa.Float()),
        sa.Column("severity", sa.Float()),
        sa.Column("trust_score", sa.Float()),
        sa.Column("categories", sa.String(length=256)),
        sa.Index("ix_events_gdelt_id", "gdelt_id"),
        sa.Index("ix_events_event_date", "event_date"),
    )


def downgrade() -> None:
    op.drop_table("events")
