from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

connect_args = {}
if settings.is_sqlite:
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.database_url,
    pool_pre_ping=not settings.is_sqlite,
    connect_args=connect_args,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def init_db():
    # import models so metadata is populated
    from app.models import BrandContext, Campaign, User, ValidationLog  # noqa: F401

    if settings.is_sqlite:
        db_file = settings.database_url.replace("sqlite:///", "", 1)
        if db_file.startswith("./"):
            db_file = db_file[2:]
        Path(db_file).parent.mkdir(parents=True, exist_ok=True)

    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
