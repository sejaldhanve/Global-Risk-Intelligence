from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn

from forecast import ForecastEngine
from impact_model import ImpactModel

app = FastAPI(
    title="Global Intel ML Service",
    description="Machine Learning service for geopolitical forecasting",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

forecast_engine = ForecastEngine()
impact_model = ImpactModel()

class ForecastRequest(BaseModel):
    event: str
    eventType: str
    country: str
    commodity: str
    severity: str = "medium"
    historicalData: Optional[List[float]] = None

class ImpactRequest(BaseModel):
    event: str
    eventType: str
    country: str
    region: str
    sectors: List[str] = []

@app.get("/")
async def root():
    return {
        "service": "Global Intel ML Service",
        "version": "1.0.0",
        "endpoints": {
            "forecast": "/forecast",
            "impact": "/impact",
            "health": "/health"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "ml-forecast"}

@app.post("/forecast")
async def generate_forecast(request: ForecastRequest):
    try:
        result = forecast_engine.predict(
            event=request.event,
            event_type=request.eventType,
            country=request.country,
            commodity=request.commodity,
            severity=request.severity,
            historical_data=request.historicalData
        )
        
        return {
            "success": True,
            "forecast": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/impact")
async def analyze_impact(request: ImpactRequest):
    try:
        result = impact_model.analyze(
            event=request.event,
            event_type=request.eventType,
            country=request.country,
            region=request.region,
            sectors=request.sectors
        )
        
        return {
            "success": True,
            "impact": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting ML Forecast Service on port 8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
