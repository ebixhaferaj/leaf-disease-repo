from fastapi import APIRouter, Depends, Query
from collections import Counter
from app.database.database import db_dependency
from app.models import Users
from datetime import datetime
from app.services import (
    get_current_user,
    get_predictions_by_confirmation_status
)

DISEASE_COLORS = {
  "Background without leaves": "#A0AEC0",  
  "Corn Gray Leaf Spot": "#FF6384",      
  "Corn Healthy": "#68D391",             
  "Corn Northern Leaf_Blight": "#F6AD55",
  "Grape Downey Mildew": "#63B3ED",      
  "Grape Healthy": "#38A169",           
  "Grape Powdery Mildew": "#9F7AEA",     
  "Olive Healthy": "#276749",             
  "Olive Peacock Spot": "#ECC94B",     
  "Olive Rust Mite": "#D69E2E",           
  "Potato Early Blight": "#ED8936",       
  "Potato Healthy": "#48BB78",            
  "Potato Late blight": "#E53E3E",      
  "Tomato Early blight": "#FA5151",       
  "Tomato Healthy": "#38A169",           
  "Tomato Late Blight": "#C53030",      
  "Wheat Healthy": "#68D391",           
  "Wheat Septoria": "#D69E2E",            
  "Wheat Yellow Rust": "#ECC94B",      
}

router = APIRouter(
    prefix="/confirmed-predictions",
    tags=["confirmed-predictions"]
)


# Filter confirmed predictions
@router.get("/")
async def get_confirmed_predictions(
    db: db_dependency,
    current_user: Users = Depends(get_current_user),
    order: str = Query("desc", enum=["asc", "desc"])
):
    return get_predictions_by_confirmation_status(db, current_user.id, confirmed=True, order=order)


@router.get("/common-diseases")
async def get_common_diseases(
    db: db_dependency,
    current_user: Users = Depends(get_current_user),
    order: str = Query("desc", enum=["asc", "desc"])
):
    confirmed_predictions = get_predictions_by_confirmation_status(db, current_user.id, confirmed=True, order=order)
    
    # Count occurrences of each disease name
    counts = Counter(pred.name_fk for pred in confirmed_predictions)
    
    # Build response list with colors
    response = []
    for disease, count in counts.items():
        response.append({
            "disease": disease,
            "value": count,
            "color": DISEASE_COLORS.get(disease, "#888888")
        })
    
    return response

@router.get("/statistics")
async def get_prediction_statistics(
    db: db_dependency,
    current_user: Users = Depends(get_current_user),
    order: str = Query("desc", enum=["asc", "desc"])
):
    confirmed_predictions = get_predictions_by_confirmation_status(db, current_user.id, confirmed=True, order=order)
    
    if not confirmed_predictions:
        return{
            "total": 0,
            "most_common": None,
            "last_upload": None
        }
    
    total = len(confirmed_predictions)

    disease_counter = Counter(pred.name_fk for pred in confirmed_predictions)
    most_common = disease_counter.most_common(1)[0][0]

    last_upload = max(pred.timestamp for pred in confirmed_predictions)

    return {
        "total": total,
        "most_common": most_common,
        "last_upload": last_upload
    }