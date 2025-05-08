from sqlalchemy import Column, Integer, String, Text
from app.database.database import Base

class Leaf_Diseases(Base):
    __tablename__ = 'leaf_diseases'

    id = Column(Integer, primary_key=True, index=True)
    index = Column(Integer, unique=True, nullable=False) 
    name = Column(String(150), unique=True, nullable=False)  
    raw_class = Column(String(150), unique=True, nullable=False)  
    description = Column(Text, nullable=False)
    pesticides = Column(Text, nullable=False)
