from pydantic import BaseModel, Field

from app.services.llm_service import CampaignContent


class CampaignGenerateRequest(BaseModel):
    product: str = Field(min_length=1, max_length=255)
    audience: str = Field(min_length=1)
    objective: str = Field(min_length=1)
    platform: str = Field(min_length=1, max_length=100)
    tone: str = Field(min_length=1, max_length=100)
    additional_requirements: str | None = None
    skip_cache: bool = False


class CampaignOut(BaseModel):
    id: int
    product: str
    audience: str
    objective: str
    platform: str
    tone: str
    additional_requirements: str | None
    strategy: dict | None
    content: dict | None
    creative_assets: dict | None
    used_rag: bool
    validation_result: dict | None
    status: str
    cached: bool = False

    model_config = {"from_attributes": True}


class CampaignStatusUpdate(BaseModel):
    status: str = Field(pattern="^(draft|approved|rejected)$")


class CampaignContentUpdate(BaseModel):
    content: CampaignContent
