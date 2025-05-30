from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.database.database import db_dependency
from app.models import Users
from app.services import get_current_user,delete_pdf_report, RoleChecker
from typing import Literal
from app.services import get_reports
router = APIRouter(
    prefix="/get-report",
    tags=["get-report"]
)

farmer_only = RoleChecker(allowed_roles=["farmer"])

@router.get("/", dependencies=[Depends(farmer_only)])
async def fetch_reports(
    db: db_dependency,
    order: Literal["asc", "desc"] = Query("desc", description="Sort order: asc or desc"),
    skip: int = Query(0, ge=0),
    limit: int = Query(3, ge=1, le=100),
    current_user: Users = Depends(get_current_user)

):
    reports = get_reports(db=db, user_id=current_user.id, order=order, skip=skip, limit=limit)
    return reports

@router.delete("/delete/{report_id}", dependencies=[Depends(farmer_only)])
async def delete_report(
    report_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    return delete_pdf_report(db=db, user_id=current_user.id, report_id=report_id)
