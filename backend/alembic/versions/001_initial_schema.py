"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-08-29
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    brand_source = postgresql.ENUM("pdf", "quick_form", name="brandsourcetype", create_type=False)
    brand_source.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "brand_contexts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("source_type", brand_source, nullable=False),
        sa.Column("file_path", sa.String(length=512), nullable=True),
        sa.Column("quick_form_data", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_brand_contexts_user_id"), "brand_contexts", ["user_id"], unique=False)

    campaign_status = postgresql.ENUM("draft", "approved", "rejected", name="campaignstatus", create_type=False)
    campaign_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "campaigns",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("product", sa.String(length=255), nullable=False),
        sa.Column("audience", sa.Text(), nullable=False),
        sa.Column("objective", sa.Text(), nullable=False),
        sa.Column("platform", sa.String(length=100), nullable=False),
        sa.Column("tone", sa.String(length=100), nullable=False),
        sa.Column("additional_requirements", sa.Text(), nullable=True),
        sa.Column("strategy", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("content", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("creative_assets", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("used_rag", sa.Boolean(), nullable=True),
        sa.Column("validation_result", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("status", campaign_status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_campaigns_user_id"), "campaigns", ["user_id"], unique=False)

    validation_verdict = postgresql.ENUM("pass", "fail", name="validationverdict", create_type=False)
    validation_verdict.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "validation_logs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("campaign_id", sa.Integer(), nullable=False),
        sa.Column("rule_check_result", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("llm_judge_result", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("final_verdict", validation_verdict, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["campaign_id"], ["campaigns.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_validation_logs_campaign_id"), "validation_logs", ["campaign_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_validation_logs_campaign_id"), table_name="validation_logs")
    op.drop_table("validation_logs")
    op.drop_index(op.f("ix_campaigns_user_id"), table_name="campaigns")
    op.drop_table("campaigns")
    op.drop_index(op.f("ix_brand_contexts_user_id"), table_name="brand_contexts")
    op.drop_table("brand_contexts")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")

    op.execute("DROP TYPE IF EXISTS validationverdict")
    op.execute("DROP TYPE IF EXISTS campaignstatus")
    op.execute("DROP TYPE IF EXISTS brandsourcetype")
