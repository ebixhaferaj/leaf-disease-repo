# Standard Library
import os
import uuid
from pathlib import Path
from typing import List

# Third-Party Libraries
import numpy as np
import requests
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

# Local Application Imports
from app.core import ENDPOINT, MAX_BATCH_SIZE, PREDICTION_IMAGE_PATH
from app.database.database import get_db, db_dependency
from app.models import Users, Predictions, Leaf_Diseases
from app.schemas import ConfirmBatchPredictionRequest
from app.services import (
    get_current_user,
    read_files_as_images,
    RoleChecker,
    get_predictions_by_confirmation_status,
    get_prediction_by_id,
    delete_prediction
)



router = APIRouter(
    prefix="/batch-predict",
    tags=["batch-predict"]
)


farmer_only = RoleChecker(allowed_roles=["farmer"])

# Batch Prediction
@router.post("/", dependencies=[Depends(farmer_only)])
async def predict(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
    ):
    
    # Check if batch gets exceeded
    if len(files) > MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum file number exceeded. You may upload up to {MAX_BATCH_SIZE} "
        )

    save_dir = PREDICTION_IMAGE_PATH    
    os.makedirs(save_dir, exist_ok=True)

    image_bytes_list = []
    filenames = []

    # Save uploaded files and store the bytes
    for file in files:
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        save_path = os.path.join(save_dir, unique_filename)

        file_bytes = await file.read()
        image_bytes_list.append(file_bytes)
        filenames.append(unique_filename)

        with open(save_path, "wb") as f:
            f.write(file_bytes)

    # Images to numpy arrays for prediction
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

            prediction_ids.append(prediction_entry.id)

            results.append({
                "disease": disease.name,
                "confidence": confidence,
                "description": disease.description,
                "pesticides": disease.pesticides
            })

    return {
        "results": results,
        "prediction_ids": prediction_ids
    }


# Confirm batch prediction
@router.post("/confirm-batch-prediction", dependencies=[Depends(farmer_only)])
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



# Filter unconfirmed predictions
@router.get("/unconfirmed-predictions", dependencies=[Depends(farmer_only)])
async def get_unconfirmed_predictions(
    db: db_dependency,
    current_user: Users = Depends(get_current_user),
    order: str = Query("desc", enum=["asc", "desc"])
):
    return get_predictions_by_confirmation_status(db, current_user.id, confirmed=False, order=order)



# Filter confirmed predictions
@router.get("/confirmed-predictions", dependencies=[Depends(farmer_only)])
async def get_confirmed_predictions(
    db: db_dependency,
    current_user: Users = Depends(get_current_user),
    order: str = Query("desc", enum=["asc", "desc"])
):
    return get_predictions_by_confirmation_status(db, current_user.id, confirmed=True, order=order)


# Get Prediction image
@router.get("/image/{prediction_id}", dependencies=[Depends(farmer_only)])
async def get_prediction_image(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    prediction = get_prediction_by_id(db=db, user_id=current_user.id, prediction_id=prediction_id)

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    image_path = os.path.join(PREDICTION_IMAGE_PATH, prediction.image_url)

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found on server")

    return FileResponse(image_path, media_type="image/jpeg")



# Detailed information on single prediction
@router.get("/prediction/{prediction_id}", dependencies=[Depends(farmer_only)])
async def get_prediction(
    prediction_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    
    prediction = get_prediction_by_id(db=db, user_id=current_user.id, prediction_id=prediction_id)

    return prediction



# Delete prediction
@router.delete("/delete/{prediction_id}", dependencies=[Depends(farmer_only)])
async def delete_farmer_prediction(
    prediction_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    
    prediction = delete_prediction(db=db, user_id=current_user.id, prediction_id=prediction_id)

    return prediction