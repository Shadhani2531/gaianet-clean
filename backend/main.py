from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from nasa_client import NASAClient
from data_models import EnvironmentalData, NASAImagery, WeatherData, GaiaNetStatus
from static_data import get_region_environmental_data, get_environmental_trends

app = FastAPI(title="GaiaNet API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nasa_client = NASAClient()


@app.get("/")
async def root():
    return {
        "message": "GaiaNet Planetary Intelligence API",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/environment/data", response_model=EnvironmentalData)
async def get_environmental_data():
    try:
        return await nasa_client.get_environmental_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching environmental data: {str(e)}")


@app.get("/api/nasa/imagery", response_model=NASAImagery)
async def get_nasa_imagery(lat: float = 40.7128, lon: float = -74.0060, date: str = None):
    try:
        return await nasa_client.get_earth_imagery(lat, lon, date)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching NASA imagery: {str(e)}")


@app.get("/api/nasa/weather", response_model=WeatherData)
async def get_weather_data():
    try:
        return await nasa_client.get_weather_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")


@app.get("/api/environment/regions")
async def get_region_data():
    return {
        "regions": get_region_environmental_data(),
        "last_updated": datetime.now().isoformat()
    }


@app.get("/api/environment/trends")
async def get_trend_data():
    return {
        "trends": get_environmental_trends(),
        "last_updated": datetime.now().isoformat()
    }


@app.get("/api/gaianet/status", response_model=GaiaNetStatus)
async def get_gaianet_status():
    return {
        "system": "GaiaNet Planetary Intelligence",
        "status": "operational",
        "earth_visualization": "active",
        "data_streams": ["environmental", "imagery", "weather", "regions", "trends"],
        "last_data_update": datetime.now().isoformat(),
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
