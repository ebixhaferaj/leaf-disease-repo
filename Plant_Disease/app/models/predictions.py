from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.database import Base
from datetime import datetime, timezone

class Predictions(Base):
    __tablename__ = 'predictions'

    id = Column(Integer, primary_key=True, index=True)
    user_id_fk = Column(Integer, ForeignKey("users.id"), nullable=False)
    name_fk = Column(String(150), ForeignKey("leaf_diseases.name"), nullable=False)
    prediction_confidence = Column(Float, nullable=False)
    image_url = Column(String(300), nullable=False)
    confirmed = Column(Boolean, default=False, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    reports = relationship(
        "Report",
        secondary="report_prediction_association",
        back_populates="predictions",
        passive_deletes=True
    )