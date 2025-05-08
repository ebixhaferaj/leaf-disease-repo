from datetime import datetime, timedelta, timezone
from app.database.database import SessionLocal
from app.models import Predictions
from apscheduler.schedulers.background import BackgroundScheduler
import os
from app.core import PREDICTION_IMAGE_PATH

scheduler = BackgroundScheduler()

def delete_old_unconfirmed_predictions():
    db = SessionLocal()
    try:
        twenty_four_hours_ago = datetime.now(timezone.utc) - timedelta(hours=24)

        # Query predictions older than 24 hours and unconfirmed
        old_predictions = db.query(Predictions).filter(
            Predictions.confirmed == False,
            Predictions.timestamp < twenty_four_hours_ago
        ).all()

        folder_path = PREDICTION_IMAGE_PATH

        # Iterate through old unconfirmed predictions and delete its image
        for prediction in old_predictions:
            image_filename = prediction.image_url
            image_path = os.path.join(folder_path, image_filename)
            if os.path.exists(image_path):
                try:
                    os.remove(image_path)
                    print(f"Deleted image: {image_filename}")
                except Exception as esc:
                    print(f"Error deleting image {image_filename}: {esc}")

        # Deletion of the records from Predictions
        deleted = db.query(Predictions).filter(
            Predictions.confirmed == False,
            Predictions.timestamp < twenty_four_hours_ago
        ).delete(synchronize_session=False)

        db.commit()
        print(f"Deleted {deleted} unconfirmed predictions older than 24h.")
    except Exception as e:
        print("Error while deleting old predictions:", e)
    finally:
        db.close()