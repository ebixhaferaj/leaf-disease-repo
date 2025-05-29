import os
import uuid
import numpy as np
from pathlib import Path
import requests
from app.core import ENDPOINT, PREDICTION_IMAGE_PATH
from sqlalchemy.orm import Session
from fastapi import File, UploadFile, APIRouter, Depends, HTTPException, Query
from app.database.database import get_db, db_dependency
from app.models import Users, Predictions, Leaf_Diseases
from app.services import get_current_user, read_file_as_image, RoleChecker, get_prediction_by_id, delete_prediction
from app.services.batch_predict_service import get_predictions_by_confirmation_status
from app.schemas import ConfirmPredictionRequest
from fastapi.responses import FileResponse
from starlette import status

router = APIRouter(
    prefix='/predict',
    tags=['predict']
)

user_only = RoleChecker(allowed_roles=["user"])

# Prediction Route
@router.post("/", dependencies=[Depends(user_only)])
async def predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
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

# Confirm prediction
@router.post("/confirm-prediction/{prediction_id}")
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



# Unconfirmed Predictions
@router.get("/unconfirmed-predictions", dependencies=[Depends(user_only)])
async def get_unconfirmed_predictions(
    db: db_dependency,
    current_user: Users = Depends(get_current_user),
    order: str = Query("desc", enum=["asc", "desc"])
):
    return get_predictions_by_confirmation_status(db, current_user.id, confirmed=False, order=order)



# Confirmed Predictions
@router.get("/confirmed-predictions", dependencies=[Depends(user_only)])
async def get_confirmed_predictions(
    db: db_dependency,
    current_user: Users = Depends(get_current_user),
    order: str = Query("desc", enum=["asc", "desc"])
):
    return get_predictions_by_confirmation_status(db, current_user.id, confirmed=True, order=order)



# Prediction Image
@router.get("/image/{prediction_id}")
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


# Detailed information on single prediction
@router.get("/prediction/{prediction_id}")
async def get_prediction(
    prediction_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    
    prediction = get_prediction_by_id(db=db, user_id=current_user.id, prediction_id=prediction_id)

    return prediction

# Delete prediction
@router.delete("/delete/{prediction_id}")
async def delete_user_prediction(
    prediction_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    
    prediction = delete_prediction(db=db, user_id=current_user.id, prediction_id=prediction_id)

    return prediction