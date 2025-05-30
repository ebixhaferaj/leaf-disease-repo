from fastapi import Depends, HTTPException, APIRouter
from app.database.database import db_dependency
from app.models import Users, Predictions
from app.services import get_current_user

router = APIRouter(
    prefix='/confirm-prediction',
    tags=['/confirm-prediction']
)

# Confirm prediction
@router.post("/{prediction_id}")
async def confirm_prediction(
    prediction_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    prediction = db.query(Predictions).filter(
        Predictions.id == prediction_id,
        Predictions.user_id_fk == current_user.id
    ).first()

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    prediction.confirmed = True
    db.commit()
    db.refresh(prediction)

    return {"message": "Prediction confirmed successfully.", "prediction_id": prediction.id}

