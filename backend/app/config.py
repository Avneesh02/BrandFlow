from pathlib import Path

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = f"sqlite:///{(_BACKEND_DIR / 'brandflow.db').as_posix()}"

    jwt_secret: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.5-flash"

    chroma_persist_dir: str = str(_BACKEND_DIR / "chroma_data")
    chroma_host: str | None = None
    chroma_port: int = 8001

    frontend_origin: str = "http://localhost:5173"
    upload_dir: str = str(_BACKEND_DIR / "uploads")
    max_upload_size_mb: int = 10

    @property
    def frontend_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_origin.split(",") if origin.strip()]

    login_rate_limit: int = 10
    campaign_rate_limit: int = 5

    pollinations_base_url: str = "https://image.pollinations.ai/prompt"

    @model_validator(mode="after")
    def _normalize(self):
        url = self.database_url.strip().strip('"').strip("'")
        object.__setattr__(self, "database_url", url)
        object.__setattr__(self, "jwt_secret", self.jwt_secret.strip().strip('"').strip("'"))
        object.__setattr__(self, "gemini_api_key", self.gemini_api_key.strip().strip('"').strip("'"))
        object.__setattr__(self, "gemini_model", self.gemini_model.strip().strip('"').strip("'"))

        if url.startswith("sqlite"):
            db_path = (_BACKEND_DIR / "brandflow.db").as_posix()
            object.__setattr__(self, "database_url", f"sqlite:///{db_path}")

        # Resolve relative chroma and upload dirs to absolute paths anchored at the
        # backend directory so uvicorn can be started from any working directory.
        chroma = self.chroma_persist_dir.strip().strip('"').strip("'")
        if not Path(chroma).is_absolute():
            chroma = str((_BACKEND_DIR / chroma.lstrip("./\\")).resolve())
        object.__setattr__(self, "chroma_persist_dir", chroma)

        updir = self.upload_dir.strip().strip('"').strip("'")
        if not Path(updir).is_absolute():
            updir = str((_BACKEND_DIR / updir.lstrip("./\\")).resolve())
        object.__setattr__(self, "upload_dir", updir)

        return self

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024


settings = Settings()
