from fastapi import APIRouter, Depends, Query

from app.database.database import db_dependency
from app.models import Users
from app.services import (
    get_current_user,
    get_predictions_by_confirmation_status

)


router = APIRouter(
    prefix="/unconfirmed-predictions",
    tags=["unconfirmed-predictions"]
)

@router.get("/")

async def get_unconfirmed_predictions(
    db: db_dependency,
    current_user: Users = Depends(get_current_user),
    order: str = Query("desc", enum=["asc", "desc"])
):
    return get_predictions_by_confirmation_status(db, current_user.id, confirmed=False, order=order)

