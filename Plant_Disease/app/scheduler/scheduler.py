from datetime import datetime, timedelta, timezone
from app.database.database import SessionLocal
from app.models import Predictions
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()

def delete_old_unconfirmed_predictions():
    db = SessionLocal()
    try:
        twenty_four_hours_ago = datetime.now(timezone.utc) - timedelta(hours=24)

        deleted = db.query(Predictions).filter(
            Predictions.confirmed == False,
            Predictions.timestamp < twenty_four_hours_ago
        ).delete()

        db.commit()
        print(f"Deleted {deleted} unconfirmed predictions older than 24 hours.")
    except Exception as e:
        print("Error while deleting old predictions:", e)
    finally:
        db.close()
