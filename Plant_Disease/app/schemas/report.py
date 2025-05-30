from pydantic import BaseModel

class ReportRenameRequest(BaseModel):
    report_id: int
    new_name: str