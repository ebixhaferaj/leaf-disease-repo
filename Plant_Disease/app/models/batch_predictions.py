#from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
#from app.database.database import Base
#from datetime import datetime, timezone
#
#class Batch_Predictions(Base):
#    __tablename__ = 'batch_predictions'
#
#    id = Column(Integer, primary_key=True, index=True)
#    user_id_fk = Column(Integer, ForeignKey('users.id'), nullable=False)
#    name_fk = Column(String, ForeignKey('leaf_diseases.name'), nullable=False)
#    prediction_confidence = Column(Float, nullable=False)
#    description = C