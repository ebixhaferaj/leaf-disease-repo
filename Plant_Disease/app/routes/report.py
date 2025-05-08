from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.database.database import db_dependency
from app.models import Users
from app.services import get_current_user,delete_pdf_report
from typing import Literal
from app.services import get_reports
router = APIRouter(
    prefix="/report",
    tags=["report"]
)

@router.get("/")
async def fetch_reports(
    db: db_dependency,
    order: Literal["asc", "desc"] = Query("desc", description="Sort order: asc or desc"),
    current_user: Users = Depends(get_current_user)
):
    reports = get_reports(db=db, user_id=current_user.id, order=order)
    return reports

@router.delete("/delete/{report_id}")
async def delete_report(
    report_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    return delete_pdf_report(db=db, user_id=current_user.id, report_id=report_id)
