import requests
import os
import logging
from datetime import datetime, timedelta
from typing import Dict, Any
from static_data import (
    get_static_environmental_data,
    get_static_imagery_data,
    get_static_weather_data
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class NASAClient:
    def __init__(self):
        self.base_url = "https://api.nasa.gov"
        self.api_key = os.getenv("NASA_API_KEY", "DEMO_KEY")
        self.open_weather_url = "https://api.openweathermap.org/data/2.5"

    async def get_environmental_data(self) -> Dict[str, Any]:
        """
        Phase 1:
        Return static structured environmental data.
        Later this can be replaced with real data sources.
        """
        return get_static_environmental_data()

    async def get_weather_data(self) -> Dict[str, Any]:
        """
        Phase 1:
        Return static weather data.
        Later this can combine real API + forecast + alerts.
        """
        return get_static_weather_data()

    async def get_earth_imagery(self, lat: float = 40.7128, lon: float = -74.0060, date: str = None) -> Dict[str, Any]:
        """
        Try NASA EPIC imagery first.
        If it fails, return static fallback imagery.
        """
        try:
            if not date:
                date = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')

            url = f"{self.base_url}/EPIC/api/natural/date/{date}"
            params = {"api_key": self.api_key}

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()

            if data and len(data) > 0:
                image_data = data[0]
                image_url = f"https://epic.gsfc.nasa.gov/epic-archive/jpg/{image_data['image']}.jpg"

                return {
                    "date": date,
                    "image_url": image_url,
                    "coordinates": {
                        "lat": float(image_data.get("centroid_coordinates", {}).get("lat", lat)),
                        "lon": float(image_data.get("centroid_coordinates", {}).get("lon", lon))
                    },
                    "caption": f"Earth imagery from {date}",
                    "source": "NASA EPIC",
                    "is_live": True
                }

            return get_static_imagery_data()

        except Exception as e:
            logger.error(f"Error fetching NASA imagery: {e}")
            return get_static_imagery_data()

    async def get_satellite_imagery_layers(self) -> Dict[str, Any]:
        return {
            "available_layers": [
                {
                    "id": "true_color",
                    "name": "True Color",
                    "description": "Natural color imagery",
                    "source": "MODIS/Terra",
                    "resolution": "250m"
                },
                {
                    "id": "vegetation",
                    "name": "Vegetation Index",
                    "description": "NDVI vegetation health",
                    "source": "MODIS/Aqua",
                    "resolution": "500m"
                },
                {
                    "id": "temperature",
                    "name": "Land Surface Temperature",
                    "description": "Thermal infrared data",
                    "source": "MODIS/Terra",
                    "resolution": "1km"
                },
                {
                    "id": "fires",
                    "name": "Active Fires",
                    "description": "Thermal anomalies detection",
                    "source": "VIIRS",
                    "resolution": "375m"
                }
            ],
            "last_updated": datetime.now().isoformat()
        }
