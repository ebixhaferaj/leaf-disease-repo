from fastapi import FastAPI
from app.routes import (predict, 
                        batch_predict, 
                        generate_report, 
                        users, 
                        report, 
                        guest_predict, 
                        confirmed_predictions, 
                        unconfirmed_predictions,
                        delete_prediction,
                        prediction_details, 
                        confirm_prediction,
                        prediction_image)
from app.routes.auth import router as auth_router
from contextlib import asynccontextmanager
from app.database import create_tables, seed_leaf_diseases, SessionLocal
from app.scheduler.scheduler import scheduler
from app.scheduler.scheduler import delete_old_unconfirmed_predictions
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.core import PREDICTION_IMAGE_PATH

scheduler.add_job(delete_old_unconfirmed_predictions, 'interval', hours=1)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    
    db = SessionLocal()
    try:
        seed_leaf_diseases(db)

        scheduler.start()
        print("Scheduler started")

        yield

    finally:
        scheduler.shutdown()
        print("Scheduler stopped")
        db.close()

app = FastAPI(lifespan=lifespan)

app.include_router(predict.router)
app.include_router(auth_router)
app.include_router(batch_predict.router)
app.include_router(guest_predict.router)
app.include_router(generate_report.router)
app.include_router(confirmed_predictions.router)
app.include_router(unconfirmed_predictions.router)
app.include_router(delete_prediction.router)
app.include_router(prediction_details.router)
app.include_router(confirm_prediction.router)
app.include_router(prediction_image.router)
app.include_router(users.router)
app.include_router(report.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "hello world"}


