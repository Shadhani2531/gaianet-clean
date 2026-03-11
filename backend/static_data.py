from datetime import datetime

def get_static_environmental_data():
    return {
        "temperature": {
            "global_average": 15.0,
            "anomaly": 1.1,
            "trend": "increasing",
            "unit": "°C",
            "last_measured": datetime.now().isoformat()
        },
        "co2": {
            "value": 417.0,
            "unit": "ppm",
            "trend": "rising",
            "source": "Static Dataset"
        },
        "vegetation": {
            "ndvi_global": 0.40,
            "health_index": 75.0,
            "trend": "stable",
            "source": "Static Dataset"
        },
        "biodiversity": {
            "species_richness": 8.0,
            "threat_level": "moderate",
            "protected_areas": 15.0,
            "alert_level": "normal"
        },
        "weather": {
            "current": {
                "temperature": 20.0,
                "humidity": 60,
                "pressure": 1013,
                "wind_speed": 5.0,
                "conditions": "clear",
                "location": "Global",
                "source": "Static Dataset"
            },
            "forecast": {
                "trend": "stable",
                "confidence": 0.80
            },
            "alerts": {
                "heat_wave": False,
                "storm_watch": False,
                "air_quality": "good"
            }
        },
        "last_updated": datetime.now().isoformat(),
        "data_sources": ["Static Dataset"],
        "is_live": False
    }


def get_static_imagery_data():
    return {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "image_url": "https://eoimages.gsfc.nasa.gov/images/imagerecords/147000/147190/eo_base_2020_clean_3600x1800.png",
        "coordinates": {
            "lat": 0.0,
            "lon": 0.0
        },
        "caption": "Global satellite imagery",
        "source": "NASA GIBS (static fallback)",
        "is_live": False
    }


def get_static_weather_data():
    return {
        "current": {
            "temperature": 20.0,
            "humidity": 60,
            "pressure": 1013,
            "wind_speed": 5.0,
            "conditions": "clear",
            "location": "Global",
            "source": "Static Dataset"
        },
        "forecast": {
            "trend": "stable",
            "confidence": 0.80
        },
        "alerts": {
            "heat_wave": False,
            "storm_watch": False,
            "air_quality": "good"
        }
    }


def get_region_environmental_data():
    return [
        {
            "region": "India",
            "temperature": 24.6,
            "aqi": 128,
            "vegetation_index": 0.52,
            "co2": 420.3,
            "rainfall": 118,
            "risk_level": "moderate"
        },
        {
            "region": "North America",
            "temperature": 12.4,
            "aqi": 74,
            "vegetation_index": 0.61,
            "co2": 416.8,
            "rainfall": 95,
            "risk_level": "low"
        },
        {
            "region": "South America",
            "temperature": 22.1,
            "aqi": 81,
            "vegetation_index": 0.73,
            "co2": 415.9,
            "rainfall": 145,
            "risk_level": "moderate"
        },
        {
            "region": "Europe",
            "temperature": 10.8,
            "aqi": 65,
            "vegetation_index": 0.58,
            "co2": 414.7,
            "rainfall": 84,
            "risk_level": "low"
        },
        {
            "region": "Africa",
            "temperature": 27.3,
            "aqi": 102,
            "vegetation_index": 0.49,
            "co2": 418.2,
            "rainfall": 76,
            "risk_level": "moderate"
        }
    ]


def get_environmental_trends():
    return {
        "temperature_last_6_months": [14.2, 14.4, 14.6, 14.8, 15.0, 15.1],
        "co2_last_6_months": [414.1, 414.8, 415.5, 416.1, 416.6, 417.0],
        "vegetation_last_6_months": [0.43, 0.42, 0.41, 0.40, 0.40, 0.39]
    }
