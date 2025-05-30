from fastapi import APIRouter, Depends, Query

from app.database.database import db_dependency
from app.models import Users
from app.services import (
    get_current_user,
    get_predictions_by_confirmation_status

)


router = APIRouter(
    prefix="/confirmed-predictions",
    tags=["confirmed-predictions"]
)


# Filter confirmed predictions
@router.get("/")
async def get_confirmed_predictions(
    db: db_dependency,
    current_user: Users = Depends(get_current_user),
    order: str = Query("desc", enum=["asc", "desc"])
):
    return get_predictions_by_confirmation_status(db, current_user.id, confirmed=True, order=order)
