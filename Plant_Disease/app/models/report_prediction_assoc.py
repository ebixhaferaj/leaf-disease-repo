from sqlalchemy import Table, Column, Integer, ForeignKey
from app.database.database import Base

class ReportPredictionAssociation(Base):
    __tablename__ = "report_prediction_association"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    prediction_id = Column(Integer, ForeignKey("predictions.id", ondelete="CASCADE"), nullable=False)