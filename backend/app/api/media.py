from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models import User

router = APIRouter(prefix="/api/media", tags=["media"])


@router.get("/health")
def media_health(current_user: User = Depends(get_current_user)):
    return {"status": "ok", "user_id": current_user.id}
