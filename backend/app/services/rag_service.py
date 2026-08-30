import logging
import os
import uuid
from pathlib import Path

import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.config import settings

logger = logging.getLogger(__name__)

CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


def _require_gemini_api_key() -> str:
    key = (settings.gemini_api_key or "").strip()
    if not key:
        raise RuntimeError(
            "GEMINI_API_KEY is missing. Add it to backend/.env before using RAG and generation features."
        )
    return key


def _get_embeddings():
    return GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=_require_gemini_api_key(),
    )


def _get_chroma_client():
    os.makedirs(settings.chroma_persist_dir, exist_ok=True)
    return chromadb.PersistentClient(
        path=settings.chroma_persist_dir,
        settings=ChromaSettings(anonymized_telemetry=False),
    )


def _collection_name(user_id: int) -> str:
    return f"brand_user_{user_id}"


def chunk_text(text: str) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunks.append(text[start:end])
        start = end - CHUNK_OVERLAP
        if start >= len(text):
            break
    return [c.strip() for c in chunks if c.strip()]


def user_has_brand_context(user_id: int) -> bool:
    client = _get_chroma_client()
    try:
        col = client.get_collection(_collection_name(user_id))
        return col.count() > 0
    except Exception:
        return False


def get_brand_context_version(user_id: int) -> str:
    """Version string for cache invalidation when brand context changes."""
    client = _get_chroma_client()
    try:
        col = client.get_collection(_collection_name(user_id))
        return str(col.count())
    except Exception:
        return "0"


def ingest_text(user_id: int, text: str, metadata: dict | None = None) -> int:
    """Shared path for PDF and quick-form ingestion."""
    from app.services.sanitizer_service import sanitize_text

    cleaned, flagged = sanitize_text(text)
    if not cleaned:
        return 0

    chunks = chunk_text(cleaned)
    if not chunks:
        return 0

    embeddings_model = _get_embeddings()
    vectors = embeddings_model.embed_documents(chunks)

    client = _get_chroma_client()
    col_name = _collection_name(user_id)

    try:
        collection = client.get_collection(col_name)
    except Exception:
        collection = client.create_collection(col_name)

    base_meta = metadata or {}
    if flagged:
        base_meta["sanitizer_flagged"] = True

    ids = [f"{user_id}_{i}_{uuid.uuid4().hex}" for i in range(len(chunks))]
    metadatas = [{**base_meta, "chunk_index": i} for i in range(len(chunks))]

    collection.add(ids=ids, embeddings=vectors, documents=chunks, metadatas=metadatas)
    logger.info("Ingested %d chunks for user %s", len(chunks), user_id)
    return len(chunks)


def retrieve_chunks(user_id: int, query: str, top_k: int = 4) -> list[str]:
    client = _get_chroma_client()
    try:
        collection = client.get_collection(_collection_name(user_id))
    except Exception:
        return []

    if collection.count() == 0:
        return []

    embeddings_model = _get_embeddings()
    query_vec = embeddings_model.embed_query(query)

    results = collection.query(query_embeddings=[query_vec], n_results=min(top_k, collection.count()))
    docs = results.get("documents", [[]])
    return docs[0] if docs else []


def extract_pdf_text(file_path: str) -> str:
    import pdfplumber

    text_parts = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)
