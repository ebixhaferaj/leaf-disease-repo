import numpy as np
import requests
from typing import List
from app.core import ENDPOINT, MAX_BATCH_SIZE
from sqlalchemy.orm import Session
from fastapi import File, UploadFile, APIRouter, Depends, HTTPException
from app.database.database import get_db
from app.models import Users, Predictions, Leaf_Diseases
from app.services import read_files_as_images, RoleChecker


router = APIRouter(
    prefix="/batch-predict",
    tags=["batch-predict"]
)


farmer_only = RoleChecker(allowed_roles=["farmer"])

@router.post("/", dependencies=[Depends(farmer_only)])
async def predict(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    ):
    
    if len(files)>MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum file number exceeded. You may upload up to {MAX_BATCH_SIZE} "
        )

    image_bytes_list = [await file.read() for file in  files]
    img_batch = read_files_as_images(image_bytes_list)

    json_data = {
        "instances": img_batch.tolist()
    }
    
    response = requests.post(ENDPOINT, json=json_data)

    predictions = response.json()["predictions"]

    results = []
    for prediction in predictions:
        predicted_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))
        
        disease = db.query(Leaf_Diseases).filter(Leaf_Diseases.index == predicted_index).first()
        if disease:
            results.append({
                "disease": disease.name,
                "confidence": confidence,
                "description": disease.description,
                "pesticides": disease.pesticides
            })
    return results
