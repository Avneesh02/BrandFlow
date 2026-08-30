import pytest
from unittest.mock import AsyncMock, patch

from app.services.cache_service import CacheService
from app.services.creative_service import PollinationsProvider
from app.services.validator_service import combine_verdicts, run_rule_check


def test_rule_check_catches_banned_phrase():
    bad = "Buy our product — 100% guaranteed to cure cancer!"
    result = run_rule_check(bad)
    assert result["passed"] is False
    assert len(result["violations"]) >= 1


def test_rule_check_passes_clean_copy():
    good = "Discover our new organic face cream for daily hydration."
    result = run_rule_check(good)
    assert result["passed"] is True


def test_combine_verdicts():
    assert combine_verdicts({"passed": False}, {"passed": True}) == "fail"
    assert combine_verdicts({"passed": True}, {"passed": False}) == "fail"
    assert combine_verdicts({"passed": True}, {"passed": True}) == "pass"


def test_cache_hit_on_identical_key():
    cache = CacheService()
    key = cache.make_key({"product": "soap"}, 1, "v1")
    cache.set(key, {"result": "cached"})
    assert cache.get(key)["result"] == "cached"


@pytest.mark.asyncio
async def test_image_timeout_graceful():
    provider = PollinationsProvider(timeout_seconds=0.001)

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        import httpx
        mock_get.side_effect = httpx.TimeoutException("timeout")
        result = await provider.generate_image("test prompt")

    assert result["status"] == "unavailable"
