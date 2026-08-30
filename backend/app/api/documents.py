import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config import settings
from app.core.dependencies import get_current_user
from app.database import get_db
from app.models import BrandContext, BrandSourceType, User
from app.schemas.documents import IngestResponse, QuickBrandForm
from app.services import rag_service

router = APIRouter(prefix="/api/documents", tags=["documents"])

ALLOWED_CONTENT_TYPES = {"application/pdf", "application/x-pdf"}


def _ensure_upload_dir():
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)


@router.post("/upload", response_model=IngestResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    contents = await file.read()
    if len(contents) > settings.max_upload_bytes:
        raise HTTPException(status_code=400, detail=f"File too large (max {settings.max_upload_size_mb}MB)")

    _ensure_upload_dir()
    safe_name = f"{current_user.id}_{uuid.uuid4().hex}.pdf"
    file_path = os.path.join(settings.upload_dir, safe_name)

    with open(file_path, "wb") as f:
        f.write(contents)

    try:
        text = rag_service.extract_pdf_text(file_path)
    except Exception:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail="Could not read PDF file")

    if not text.strip():
        os.remove(file_path)
        raise HTTPException(status_code=400, detail="PDF contained no extractable text")

    try:
        chunk_count = rag_service.ingest_text(
            current_user.id,
            text,
            metadata={"source": "pdf", "filename": file.filename},
        )
    except RuntimeError as exc:
        os.remove(file_path)
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    ctx = BrandContext(
        user_id=current_user.id,
        source_type=BrandSourceType.pdf,
        file_path=file_path,
    )
    db.add(ctx)
    db.commit()

    return IngestResponse(
        chunks_stored=chunk_count,
        source_type="pdf",
        message=f"Stored {chunk_count} chunks from PDF",
    )


@router.post("/quick-brand", response_model=IngestResponse)
def quick_brand_form(
    body: QuickBrandForm,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # format into a text block — same downstream path as PDF
    parts = [
        f"Brand Tone: {body.tone}",
        f"Do's: {body.dos}",
        f"Don'ts: {body.donts}",
    ]
    if body.audience_notes:
        parts.append(f"Audience Notes: {body.audience_notes}")

    text_block = "\n".join(parts)

    try:
        chunk_count = rag_service.ingest_text(
            current_user.id,
            text_block,
            metadata={"source": "quick_form"},
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    ctx = BrandContext(
        user_id=current_user.id,
        source_type=BrandSourceType.quick_form,
        quick_form_data=body.model_dump(),
    )
    db.add(ctx)
    db.commit()

    return IngestResponse(
        chunks_stored=chunk_count,
        source_type="quick_form",
        message=f"Stored {chunk_count} chunks from quick brand form",
    )
