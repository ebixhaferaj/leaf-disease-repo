from fastapi import APIRouter, Depends
from app.database.database import db_dependency
from app.models import Users
from app.services import get_current_user,get_prediction_by_id


router = APIRouter(
    prefix='/prediction-details',
    tags=['prediction-details']
)

# Detailed information on single prediction
@router.get("/{prediction_id}")
async def get_prediction(
    prediction_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    
    prediction = get_prediction_by_id(db=db, user_id=current_user.id, prediction_id=prediction_id)

    return prediction
