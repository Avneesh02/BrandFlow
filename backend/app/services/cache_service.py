import hashlib
import json
import logging
import time
from typing import Any

logger = logging.getLogger(__name__)


class CacheService:
    """In-memory cache — structured so Redis can drop in later."""

    def __init__(self, default_ttl_seconds: int = 3600):
        self._store: dict[str, dict[str, Any]] = {}
        self.default_ttl = default_ttl_seconds

    def _is_expired(self, entry: dict) -> bool:
        return time.time() > entry["expires_at"]

    def get(self, key: str) -> Any | None:
        entry = self._store.get(key)
        if not entry:
            return None
        if self._is_expired(entry):
            del self._store[key]
            return None
        return entry["value"]

    def set(self, key: str, value: Any, ttl_seconds: int | None = None) -> None:
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl
        self._store[key] = {"value": value, "expires_at": time.time() + ttl}

    def delete(self, key: str) -> None:
        self._store.pop(key, None)

    @staticmethod
    def make_key(*parts: Any) -> str:
        raw = json.dumps(parts, sort_keys=True, default=str)
        return hashlib.sha256(raw.encode()).hexdigest()


cache_service = CacheService()
