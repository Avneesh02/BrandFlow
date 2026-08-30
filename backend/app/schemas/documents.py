from pydantic import BaseModel, Field


class QuickBrandForm(BaseModel):
    tone: str = Field(min_length=1, max_length=200)
    dos: str = Field(min_length=1, max_length=1000)
    donts: str = Field(min_length=1, max_length=1000)
    audience_notes: str | None = None


class IngestResponse(BaseModel):
    chunks_stored: int
    source_type: str
    message: str
