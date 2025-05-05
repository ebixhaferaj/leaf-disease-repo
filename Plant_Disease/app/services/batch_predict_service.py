from io import BytesIO
from PIL import Image
import numpy as np
from typing import List
from sqlalchemy.orm import joinedload,Session
from app.models import Predictions, Leaf_Diseases

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
        .join(Leaf_Diseases, Predictions.name_fk == Leaf_Diseases.name)  # Adjusted join
        .filter(Predictions.id.in_(ids))
        .all()
    )
    if any(p.user_id_fk != user_id for p in preds):
        return None
    return preds