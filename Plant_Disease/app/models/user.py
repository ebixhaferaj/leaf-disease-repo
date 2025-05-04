from sqlalchemy import Column, Integer, String, Text, Boolean
from app.database.database import Base

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(Text, nullable=False)
    role = Column(String(10), nullable=False)
    is_verified = Column(Boolean, nullable=False, default=False)

