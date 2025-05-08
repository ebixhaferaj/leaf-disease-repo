from fastapi import APIRouter, HTTPException, Depends
from app.schemas import ConfirmBatchPredictionRequest
from app.services import get_current_user, get_batch_predictions, generate_pdf, RoleChecker
from app.database import get_db
from sqlalchemy.orm import Session
from app.models import Users, Report, Leaf_Diseases, ReportPredictionAssociation
import os
import uuid
from datetime import datetime, timezone


router = APIRouter(
    prefix="/generate-report",
    tags=["generate-report"]
)

farmer_only = RoleChecker(allowed_roles=["farmer"])

@router.post("/", dependencies=[Depends(farmer_only)])
async def generate_report(
    data: ConfirmBatchPredictionRequest,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    predictions = get_batch_predictions(db, data.prediction_id, current_user.id)

    if not predictions:
        raise HTTPException(
            status_code=404, 
            detail="No matching predictions found for the user"
        )

     # Prepare data for PDF generation
    report_data = []
    for prediction in predictions:
        disease = db.query(Leaf_Diseases).filter(Leaf_Diseases.name == prediction.name_fk).first()
        if disease:
            report_data.append({
                "disease": disease.name,
                "description": disease.description,
                "pesticides": disease.pesticides,
                "confidence": prediction.prediction_confidence,
                "timestamp": prediction.timestamp,
                "image_url": prediction.image_url
            })

    # Generate the PDF
    report_filename = f"report_{uuid.uuid4()}.pdf"
    report_path = os.path.join(os.getcwd(), 'Plant_Disease', 'app', 'static', 'reports', report_filename)

    # Ensure the directory exists before saving
    os.makedirs(os.path.dirname(report_path), exist_ok=True)

    generate_pdf(report_data, report_path)

    # Save report info to the database
    report_entry = Report(
        farmer_id=current_user.id,
        pdf_path=report_path,
        created_at=datetime.now(timezone.utc)
    )

    db.add(report_entry)
    db.commit()
    db.refresh(report_entry)

    # Link the report with the predictions
    for prediction in predictions:
        association = ReportPredictionAssociation(report_id=report_entry.id, prediction_id=prediction.id)
        db.add(association)

    db.commit()

    return {
        "message": "Report generated successfully",
        "report_path": report_path
    }


#@router.post("/get-reports", dependencies=[Depends(farmer_only)])
#async def get_reports(
#    data: ConfirmBatchPredictionRequest,
#    db: Session = Depends(get_db),
#    current_user: Users = Depends(get_current_user)
#):
#    
#