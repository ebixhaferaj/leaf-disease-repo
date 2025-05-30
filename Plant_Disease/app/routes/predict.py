import os
import uuid
from fastapi import File, UploadFile, APIRouter, Depends, HTTPException
from pathlib import Path
import numpy as np
import requests
from app.core import ENDPOINT, PREDICTION_IMAGE_PATH
from app.database.database import db_dependency
from app.models import Users, Predictions, Leaf_Diseases
from app.services import get_current_user, read_file_as_image, RoleChecker


router = APIRouter(
    prefix='/predict',
    tags=['predict']
)

user_only = RoleChecker(allowed_roles=["user"])

# Prediction Route
@router.post("/", dependencies=[Depends(user_only)])
async def predict(
    db: db_dependency,
    file: UploadFile = File(...),
    current_user: Users = Depends(get_current_user)
):
    original_filename = file.filename
    file_extension = Path(original_filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"

    save_dir = PREDICTION_IMAGE_PATH
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, unique_filename)

    with open(save_path, "wb") as f:
        f.write(await file.read())

    image = read_file_as_image(open(save_path, "rb").read())
    img_batch = np.expand_dims(image, 0)

    json_data = {
        "instances": img_batch.tolist()
    }

    response = requests.post(ENDPOINT, json=json_data)
    prediction = response.json()["predictions"][0]

    predicted_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    disease = db.query(Leaf_Diseases).filter(Leaf_Diseases.index == predicted_index).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")

    prediction_entry = Predictions(
        user_id_fk=current_user.id,
        name_fk=disease.name,
        prediction_confidence=confidence,
        image_url=unique_filename, 
        confirmed=False
    )

    db.add(prediction_entry)
    db.commit()
    db.refresh(prediction_entry)

    return {
        "disease_name": disease.name,
        "confidence": confidence,
        "description": disease.description,
        "prediction_id": prediction_entry.id
    }
