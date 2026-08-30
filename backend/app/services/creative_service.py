import logging
from abc import ABC, abstractmethod
from urllib.parse import quote

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


class CreativeService(ABC):
    @abstractmethod
    async def generate_image(self, prompt: str) -> dict:
        pass


class PollinationsProvider(CreativeService):
    def __init__(self, timeout_seconds: float = 15.0):
        self.timeout = timeout_seconds
        self.base_url = settings.pollinations_base_url

    async def generate_image(self, prompt: str) -> dict:
        try:
            url = f"{self.base_url.rstrip('/')}/{quote(prompt)}"
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    return {"status": "ok", "url": str(resp.url), "prompt": prompt}
                return {"status": "failed", "error": f"HTTP {resp.status_code}"}
        except httpx.TimeoutException:
            logger.warning("Pollinations timed out for prompt: %s", prompt[:80])
            return {"status": "unavailable", "error": "timeout"}
        except Exception as e:
            logger.warning("Image generation failed: %s", e)
            return {"status": "unavailable", "error": str(e)}


creative_service: CreativeService = PollinationsProvider()
