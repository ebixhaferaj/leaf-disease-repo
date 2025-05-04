from pydantic import BaseModel

class ConfirmPredictionRequest(BaseModel):
    prediction_id: int