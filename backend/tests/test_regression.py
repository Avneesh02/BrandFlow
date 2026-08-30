"""
Tests for features that didn't have explicit unit test coverage:
- skip_cache=True bypasses cache and overwrites with new result
- Config paths are absolute (Bug #1 regression test)
- Chunk ID uniqueness (Bug #6 regression test)
"""
from unittest.mock import AsyncMock, MagicMock, patch
from pathlib import Path

import pytest

from app.services.cache_service import CacheService
from app.services.llm_service import CampaignContent, CampaignStrategy

FAKE_STRATEGY = CampaignStrategy(
    campaign_name="Spring Hydration",
    objective="Drive trial",
    audience="Millennials",
    key_message="Lightweight glow",
    positioning="Clean everyday",
    theme="dew morning",
)

FAKE_CONTENT = CampaignContent(
    instagram_captions=["Glow."],
    linkedin_posts=["Real routines."],
    ad_copy=["Hydration."],
    headlines=["Dew not grease"],
    ctas=["Shop now"],
    hashtags=["#Glow"],
    email_copy="Meet the serum.",
    product_descriptions=["A water-based hydrator."],
)

FAKE_STORYBOARD = {"title": "Spring Hydration", "scenes": []}


def _auth(client):
    client.post(
        "/api/auth/register",
        json={"email": "skipcache@brandflow-e2e.com", "password": "securepass123"},
    )
    login = client.post(
        "/api/auth/login",
        json={"email": "skipcache@brandflow-e2e.com", "password": "securepass123"},
    )
    return {"Authorization": f"Bearer {login.json()['access_token']}"}


@patch("app.api.campaigns.run_llm_judge", return_value={"score": 8, "tone_fit": "ok", "positioning_fit": "ok", "issues": [], "passed": True})
@patch("app.api.campaigns.generate_video_storyboard", return_value=FAKE_STORYBOARD)
@patch("app.api.campaigns.generate_content", return_value=FAKE_CONTENT)
@patch("app.api.campaigns.generate_strategy", return_value=FAKE_STRATEGY)
@patch("app.api.campaigns.rag_service")
def test_skip_cache_bypasses_and_overwrites(mock_rag, _s, _c, _v, _j, client):
    """skip_cache=True must return cached=False even when a cache entry exists."""
    from app.services.cache_service import cache_service
    from app.utils.rate_limit import campaign_limiter

    cache_service._store.clear()
    campaign_limiter._hits.clear()  # prevent 429 from prior test runs in same process

    mock_rag.get_brand_context_version.return_value = "0"
    mock_rag.user_has_brand_context.return_value = False

    headers = _auth(client)
    payload = {
        "product": "Glow Serum",
        "audience": "Millennials",
        "objective": "Awareness",
        "platform": "Instagram",
        "tone": "Warm",
    }

    with patch(
        "app.api.campaigns.creative_service.generate_image",
        new=AsyncMock(return_value={"status": "unavailable", "error": "timeout"}),
    ):
        # First call populates cache
        r1 = client.post("/api/campaigns/generate", json=payload, headers=headers)
        assert r1.status_code == 200
        assert r1.json()["cached"] is False

        # Second identical call hits cache
        r2 = client.post("/api/campaigns/generate", json=payload, headers=headers)
        assert r2.status_code == 200
        assert r2.json()["cached"] is True, "Expected cache hit on second identical call"

        # Third call with skip_cache=True bypasses cache
        r3 = client.post(
            "/api/campaigns/generate",
            json={**payload, "skip_cache": True},
            headers=headers,
        )
        assert r3.status_code == 200
        assert r3.json()["cached"] is False, "skip_cache=True must bypass cache"

        # Fourth call (no skip_cache) should now hit the freshly written cache entry
        r4 = client.post("/api/campaigns/generate", json=payload, headers=headers)
        assert r4.status_code == 200
        assert r4.json()["cached"] is True, "Post-regen result should be in cache"


def test_config_paths_are_absolute():
    """Bug #1 regression: chroma_persist_dir and upload_dir must be absolute."""
    from app.config import settings

    assert Path(settings.chroma_persist_dir).is_absolute(), (
        f"chroma_persist_dir should be absolute, got: {settings.chroma_persist_dir}"
    )
    assert Path(settings.upload_dir).is_absolute(), (
        f"upload_dir should be absolute, got: {settings.upload_dir}"
    )
    assert settings.database_url.startswith("sqlite:///") and not settings.database_url.endswith(
        "./brandflow.db"
    ), f"database_url should be an absolute path: {settings.database_url}"


def test_chunk_ids_are_unique_on_repeat_ingest():
    """Bug #6 regression: chunk IDs use uuid4, so re-ingesting same text produces unique IDs."""
    from app.services import rag_service

    with patch.object(rag_service, "_get_embeddings") as mock_emb:
        mock_emb.return_value.embed_documents.return_value = [[0.1] * 768]

        with patch.object(rag_service, "_get_chroma_client") as mock_chroma:
            mock_col = MagicMock()
            mock_chroma.return_value.get_collection.side_effect = Exception("no col")
            mock_chroma.return_value.create_collection.return_value = mock_col

            # Ingest same text twice
            rag_service.ingest_text(1, "Brand tone: calm. Target: millennials.", metadata={"source": "test"})
            rag_service.ingest_text(1, "Brand tone: calm. Target: millennials.", metadata={"source": "test"})

    # Collect all IDs from both add() calls
    assert mock_col.add.call_count == 2
    call1_ids = set(mock_col.add.call_args_list[0].kwargs.get("ids") or mock_col.add.call_args_list[0][1].get("ids", []))
    call2_ids = set(mock_col.add.call_args_list[1].kwargs.get("ids") or mock_col.add.call_args_list[1][1].get("ids", []))

    overlap = call1_ids & call2_ids
    assert not overlap, f"Chunk IDs collided across two ingestions: {overlap}"
