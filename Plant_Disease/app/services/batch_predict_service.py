from io import BytesIO
import os
from PIL import Image
import numpy as np
from fastapi import HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.models import Predictions, Leaf_Diseases
from app.core import PREDICTION_IMAGE_PATH
from sqlalchemy import asc, desc

# Read Images
def read_files_as_images(data_list: List[bytes]) -> np.ndarray:
    images = []
    for data in data_list:
        image = Image.open(BytesIO(data))
        image_array = np.array(image)
        images.append(image_array)
    return np.stack(images)

# Get Batch Predictions
def get_batch_predictions(db: Session, ids: list[int], user_id: int):
    preds = (
        db.query(Predictions)
        .join(Leaf_Diseases, Predictions.name_fk == Leaf_Diseases.name)
        .filter(Predictions.id.in_(ids))
        .all()
    )
    if any(p.user_id_fk != user_id for p in preds):
        return None
    return preds

# Filter prediction by confirmation
def get_predictions_by_confirmation_status(db, user_id: int, confirmed: bool, order: str = "desc"):
    query = db.query(Predictions).filter(
        Predictions.confirmed == str(confirmed).lower(),
        Predictions.user_id_fk == user_id
    )

    query = query.order_by(
        desc(Predictions.timestamp) if order == "desc" else asc(Predictions.timestamp)
    )

    return query.all()

def get_prediction_by_id(db, user_id, prediction_id):
    result = (
        db.query(Predictions, Leaf_Diseases.pesticides)
        .join(Leaf_Diseases, Predictions.name_fk == Leaf_Diseases.name)
        .filter(Predictions.id == prediction_id)
        .first()
    )
    if not result:
        return None

    prediction, pesticides = result
    return {
        "id": prediction.id,
        "name_fk": prediction.name_fk,
        "image_url": prediction.image_url,
        "confidence": prediction.prediction_confidence,
        "timestamp": prediction.timestamp,
        "confirmed": prediction.confirmed,
        "pesticides": pesticides,
    }

# Delete prediction
def delete_prediction(db, user_id, prediction_id):

    prediction_instance = db.query(Predictions).filter(
        Predictions.id == prediction_id,
        Predictions.user_id_fk == user_id
    ).first()

    if not prediction_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found or not authorized to delete."
        )
    
    image_path = os.path.join(PREDICTION_IMAGE_PATH, prediction_instance.image_url)
    if os.path.exists(image_path):
        os.remove(image_path)

    # Delete prediction record
    db.delete(prediction_instance)
    db.commit()

    return {"detail": "Prediction deleted successfully."}