import time
from collections import defaultdict

from fastapi import HTTPException, status

from app.config import settings


class RateLimiter:
    """Simple in-memory rate limiter — swap for Redis later if needed."""

    def __init__(self, max_requests: int, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits: dict[str, list[float]] = defaultdict(list)

    def check(self, key: str) -> None:
        now = time.time()
        window_start = now - self.window_seconds
        hits = [t for t in self._hits[key] if t > window_start]
        self._hits[key] = hits

        if len(hits) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Try again later.",
            )

        self._hits[key].append(now)


login_limiter = RateLimiter(max_requests=settings.login_rate_limit, window_seconds=60)
campaign_limiter = RateLimiter(max_requests=settings.campaign_rate_limit, window_seconds=60)
