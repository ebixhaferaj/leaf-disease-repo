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


def get_reports(db, user_id: int, order: str = "desc", skip: int = 0, limit: int = 3):
    reports_query = db.query(Report).filter(
        Report.farmer_id == user_id
    )

    reports_query = reports_query.order_by(
        desc(Report.created_at) if order == "desc" else asc(Report.created_at)
    ).offset(skip).limit(limit)

    reports = reports_query.all()

    if not reports:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not find reports.")
    
    return reports