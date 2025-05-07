import os
import uuid
import numpy as np
from pathlib import Path
import requests
from app.core import ENDPOINT, PREDICTION_IMAGE_PATH
from sqlalchemy.orm import Session
from fastapi import File, UploadFile, APIRouter, Depends, HTTPException
from app.database.database import get_db
from app.models import Users, Predictions, Leaf_Diseases
from app.services import get_current_user, read_file_as_image
from app.schemas import ConfirmPredictionRequest
from fastapi.responses import FileResponse

router = APIRouter(
    prefix='/predict',
    tags=['predict']
)



@router.post("/")
async def predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # Step 1: Extract file extension and create a unique filename
    original_filename = file.filename
    file_extension = Path(original_filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"

    # Step 2: Define the save path
    save_dir = PREDICTION_IMAGE_PATH
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, unique_filename)

    # Step 3: Save the uploaded file
    with open(save_path, "wb") as f:
        f.write(await file.read())

    # Step 4: Process the image and send prediction request
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

    # Step 5: Save the prediction to the database
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


@router.post("/confirm-prediction")
async def confirm_prediction(
    data: ConfirmPredictionRequest,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    prediction = db.query(Predictions).filter(Predictions.id == data.prediction_id, Predictions.user_id_fk == current_user.id).first()

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    prediction.confirmed = True

    db.commit()
    db.refresh(prediction)

    return {"message": "Prediction confirmed successfully.", "prediction_id": prediction.id}


@router.get("/image/{prediction_id}")
async def get_prediction_image(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    prediction = db.query(Predictions).filter(
        Predictions.id == prediction_id,
        Predictions.user_id_fk == current_user.id
    ).first()

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    image_path = os.path.join(PREDICTION_IMAGE_PATH, prediction.image_url)

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found on server")

    return FileResponse(image_path, media_type="image/jpeg")