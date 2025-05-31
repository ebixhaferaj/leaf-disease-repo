from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.database.database import db_dependency
from app.models import Users, Report
from app.schemas import ReportRenameRequest
from app.services import get_current_user,delete_pdf_report, RoleChecker
from fastapi.responses import FileResponse
from typing import Literal
from sqlalchemy import or_, func
from typing import Optional
import os 


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
    limit: int = Query(6, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search by report name or creation date"),
    current_user: Users = Depends(get_current_user)
):
    query = db.query(Report).filter(Report.farmer_id == current_user.id)

    if search:
        search_lower = f"%{search.lower()}%"
        query = query.filter(
            or_(
                func.lower(Report.report_name).like(search_lower),
            )
        )

    total_count = query.count()

    # Apply ordering
    if order == "asc":
        query = query.order_by(Report.created_at.asc())
    else:
        query = query.order_by(Report.created_at.desc())

    # Apply pagination
    reports = query.offset(skip).limit(limit).all()

    return {
        "total": total_count,
        "skip": skip,
        "limit": limit,
        "reports": reports
    }

@router.delete("/delete/{report_id}", dependencies=[Depends(farmer_only)])
async def delete_report(
    report_id: int,
    db: db_dependency,
    current_user: Users = Depends(get_current_user)
):
    return delete_pdf_report(db=db, user_id=current_user.id, report_id=report_id)

@router.put("/rename-report", dependencies=[Depends(farmer_only)])
async def rename_report(
    db: db_dependency,
    payload: ReportRenameRequest,
    current_user=Depends(get_current_user),
):
    report = db.query(Report).filter(
        Report.id == payload.report_id,
        Report.farmer_id == current_user.id
    ).first()

    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found.")

    report.report_name = payload.new_name
    db.commit()
    db.refresh(report)

    return {"message": "Report name updated successfully", "report_id": report.id, "new_name": report.report_name}



@router.get("/download/{filename}", dependencies=[Depends(farmer_only)])
async def download_report_pdf(filename: str, current_user=Depends(get_current_user)):
    safe_filename = os.path.basename(filename)

    file_path = os.path.join("app", "static", "reports", safe_filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        media_type='application/pdf',
        filename=safe_filename
    )