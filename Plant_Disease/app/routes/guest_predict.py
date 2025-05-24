import numpy as np
import requests
from fastapi import File, UploadFile, APIRouter, HTTPException, Depends
from app.core import ENDPOINT
from app.models import Leaf_Diseases
from app.services import read_file_as_image
from app.database.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(
    prefix='/guest-predict',
    tags=['guest-predict']
)

@router.post("/")
async def guest_predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    image = read_file_as_image(image_bytes)
    img_batch = np.expand_dims(image, 0)

    response = requests.post(ENDPOINT, json={"instances": img_batch.tolist()})
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Model prediction failed")

    prediction = response.json()["predictions"][0]
    predicted_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    disease = db.query(Leaf_Diseases).filter(Leaf_Diseases.index == predicted_index).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")

    return {
        "disease_name": disease.name,
        "confidence": confidence,
        "description": disease.description
    }
