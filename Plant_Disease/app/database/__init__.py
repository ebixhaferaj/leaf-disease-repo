from .database import Base, engine, SessionLocal, get_db, db_dependency
from .seed import seed_leaf_diseases
from app.models.leaf_diseases import Leaf_Diseases
from app.models.predictions import Predictions
from app.models.report import Report

def create_tables():
    Base.metadata.create_all(bind=engine)

