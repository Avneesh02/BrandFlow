import enum
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CampaignStatus(str, enum.Enum):
    draft = "draft"
    approved = "approved"
    rejected = "rejected"


class ValidationVerdict(str, enum.Enum):
    pass_ = "pass"
    fail = "fail"


class BrandSourceType(str, enum.Enum):
    pdf = "pdf"
    quick_form = "quick_form"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    company_name: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    brand_contexts: Mapped[list["BrandContext"]] = relationship(back_populates="user")
    campaigns: Mapped[list["Campaign"]] = relationship(back_populates="user")


class BrandContext(Base):
    __tablename__ = "brand_contexts"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    source_type: Mapped[BrandSourceType] = mapped_column(
        Enum(BrandSourceType, values_callable=lambda e: [x.value for x in e], native_enum=False),
        nullable=False,
    )
    file_path: Mapped[str | None] = mapped_column(String(512))
    quick_form_data: Mapped[dict | None] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="brand_contexts")


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    product: Mapped[str] = mapped_column(String(255), nullable=False)
    audience: Mapped[str] = mapped_column(Text, nullable=False)
    objective: Mapped[str] = mapped_column(Text, nullable=False)
    platform: Mapped[str] = mapped_column(String(100), nullable=False)
    tone: Mapped[str] = mapped_column(String(100), nullable=False)
    additional_requirements: Mapped[str | None] = mapped_column(Text)
    strategy: Mapped[dict | None] = mapped_column(JSON)
    content: Mapped[dict | None] = mapped_column(JSON)
    creative_assets: Mapped[dict | None] = mapped_column(JSON)
    used_rag: Mapped[bool] = mapped_column(Boolean, default=False)
    validation_result: Mapped[dict | None] = mapped_column(JSON)
    status: Mapped[CampaignStatus] = mapped_column(
        Enum(CampaignStatus, values_callable=lambda e: [x.value for x in e], native_enum=False),
        default=CampaignStatus.draft,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="campaigns")
    validation_logs: Mapped[list["ValidationLog"]] = relationship(back_populates="campaign")


class ValidationLog(Base):
    __tablename__ = "validation_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("campaigns.id"), nullable=False, index=True)
    rule_check_result: Mapped[dict | None] = mapped_column(JSON)
    llm_judge_result: Mapped[dict | None] = mapped_column(JSON)
    final_verdict: Mapped[ValidationVerdict] = mapped_column(
        Enum(ValidationVerdict, values_callable=lambda e: [x.value for x in e], native_enum=False),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    campaign: Mapped["Campaign"] = relationship(back_populates="validation_logs")
