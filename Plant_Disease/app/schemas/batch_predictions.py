from pydantic import BaseModel
from typing import List

class ConfirmBatchPredictionRequest(BaseModel):
    prediction_id: List[int]