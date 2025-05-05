import os
import uuid
import numpy as np
from pathlib import Path
from typing import List
import requests
from app.core import ENDPOINT, MAX_BATCH_SIZE, PREDICTION_IMAGE_PATH
from sqlalchemy.orm import Session
from fastapi import File, UploadFile, APIRouter, Depends, HTTPException
from app.database.database import get_db
from app.models import Users, Predictions, Leaf_Diseases
from app.services import get_current_user, read_files_as_images, RoleChecker, get_batch_predictions
from app.schemas import ConfirmBatchPredictionRequest


router = APIRouter(
    prefix="/batch-predict",
    tags=["batch-predict"]
)


farmer_only = RoleChecker(allowed_roles=["farmer"])

@router.post("/", dependencies=[Depends(farmer_only)])
async def predict(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
    ):
    
    if len(files) > MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum file number exceeded. You may upload up to {MAX_BATCH_SIZE} "
        )

    save_dir = PREDICTION_IMAGE_PATH    
    os.makedirs(save_dir, exist_ok=True)

    image_bytes_list = []
    filenames = []

    # Save the uploaded files and store the bytes
    for file in files:
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        save_path = os.path.join(save_dir, unique_filename)

        file_bytes = await file.read()
        image_bytes_list.append(file_bytes)
        filenames.append(unique_filename)

        with open(save_path, "wb") as f:
            f.write(file_bytes)

    # Convert images to a batch of numpy arrays for prediction
    img_batch = read_files_as_images(image_bytes_list)

    json_data = {
        "instances": img_batch.tolist()
    }
    
    # Send prediction request to the model API
    response = requests.post(ENDPOINT, json=json_data)
    predictions = response.json().get("predictions", [])

    results = []
    prediction_ids = []

    # Process the prediction results and store them in the database
    for prediction in predictions:
        predicted_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))
        
        disease = db.query(Leaf_Diseases).filter(Leaf_Diseases.index == predicted_index).first()

        # Skip if no disease is found for the prediction
        if disease:
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

            # Store the prediction ID for later use (for reports or confirmation)
            prediction_ids.append(prediction_entry.id)

            results.append({
                "disease": disease.name,
                "confidence": confidence,
                "description": disease.description,
                "pesticides": disease.pesticides
            })

    # Return the results of the batch prediction
    return {
        "results": results,
        "prediction_ids": prediction_ids  # You can return the prediction IDs if needed
    }


@router.post("/confirm-batch-prediction")
async def confirm_prediction(
    data: ConfirmBatchPredictionRequest,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    predictions = db.query(Predictions).filter(
        Predictions.id.in_(data.prediction_id),
        Predictions.user_id_fk == current_user.id
    ).all()

    if not predictions:
        raise HTTPException(status_code=404, detail="No matching predictions found")

    for prediction in predictions:
        prediction.confirmed = True

    db.commit()

    return {
        "message": "Predictions confirmed successfully.",
        "confirmed_ids": [p.id for p in predictions]
    }
