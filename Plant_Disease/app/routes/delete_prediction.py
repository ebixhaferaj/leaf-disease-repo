
from fastapi import Depends, APIRouter
from app.database.database import db_dependency
from app.models import Users
from app.services import (
    get_current_user,
    RoleChecker,
    delete_prediction
)

router = APIRouter(
    prefix="/delete-prediction",
    tags=["/delete-prediction"]
)


farmer_only = RoleChecker(allowed_roles=["farmer"])

# Delete prediction
@router.delete("/{prediction_id}")
async def delete_farmer_prediction(
    prediction_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    
    prediction = delete_prediction(db=db, user_id=current_user.id, prediction_id=prediction_id)

    return prediction