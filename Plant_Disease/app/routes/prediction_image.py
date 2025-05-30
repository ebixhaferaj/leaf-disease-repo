import os
from app.core import PREDICTION_IMAGE_PATH
from fastapi import APIRouter, Depends, HTTPException
from app.database.database import db_dependency
from app.models import Users
from app.services import get_current_user, get_prediction_by_id
from fastapi.responses import FileResponse


router = APIRouter(
    prefix='/prediction-image',
    tags=['prediction-image']
)
# Prediction Image
@router.get("/{prediction_id}")
async def get_prediction_image(
    prediction_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    prediction = get_prediction_by_id(db=db, user_id=current_user.id, prediction_id=prediction_id)

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    image_path = os.path.join(PREDICTION_IMAGE_PATH, prediction['image_url'])

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found on server")

    return FileResponse(image_path, media_type="image/jpeg")
