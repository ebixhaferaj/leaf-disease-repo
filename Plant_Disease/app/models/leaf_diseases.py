from sqlalchemy import Column, Integer, String, Text
from app.database.database import Base

class Leaf_Diseases(Base):
    __tablename__ = 'leaf_diseases'

    id = Column(Integer, primary_key=True, index=True)
    index = Column(Integer, unique=True, nullable=False)  # This links to model output index
    name = Column(String(150), unique=True, nullable=False)  # Human-readable name
    raw_class = Column(String(150), unique=True, nullable=False)  # e.g., 'Corn__Gray_Leaf_Spot'
    description = Column(Text, nullable=False)
    pesticides = Column(Text, nullable=False)
