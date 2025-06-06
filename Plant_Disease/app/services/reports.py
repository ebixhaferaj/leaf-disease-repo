import os
from app.models import Report
from fastapi import HTTPException, status
from sqlalchemy import asc, desc


def delete_pdf_report(db, user_id: int, report_id: int):
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.farmer_id == user_id
    ).first()

    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not find report.")

    file_path = report.pdf_path 

    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(report)
    db.commit()

    return {"detail": "Report deleted successfully."}


def get_reports(db, user_id: int):
    
    reports = db.query(Report).filter(Report.farmer_id == user_id).all()

    if not reports:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not find reports.")
    
    return reports