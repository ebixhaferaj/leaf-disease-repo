from io import BytesIO
from PIL import Image
import numpy as np
from typing import List
from sqlalchemy.orm import Session
from app.models import Predictions, Leaf_Diseases
from sqlalchemy import asc, desc

def read_files_as_images(data_list: List[bytes]) -> np.ndarray:
    images = []
    for data in data_list:
        image = Image.open(BytesIO(data))
        image_array = np.array(image)
        images.append(image_array)
    return np.stack(images)


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
    query = (
        db.query(Predictions)
        .join(Leaf_Diseases, Predictions.name_fk == Leaf_Diseases.name)
        .filter(Predictions.id == prediction_id)).first()
    
    return query