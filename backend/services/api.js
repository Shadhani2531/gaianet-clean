const API_BASE_URL = 'YOUR_FORWARDED_CODESPACES_BACKEND_URL';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Basic health/system routes
  async healthCheck() {
    return this.request('/health');
  }

  async getSystemStatus() {
    return this.request('/api/gaianet/status');
  }

  // Main environmental data
  async getEnvironmentalData() {
    return this.request('/api/environment/data');
  }

  async getWeatherData() {
    return this.request('/api/nasa/weather');
  }

  async getNASAImagery(lat = 40.7128, lon = -74.0060, date = null) {
    let endpoint = `/api/nasa/imagery?lat=${lat}&lon=${lon}`;
    if (date) {
      endpoint += `&date=${date}`;
    }
    return this.request(endpoint);
  }

  // Region and trend datasets
  async getRegionData() {
    return this.request('/api/environment/regions');
  }

  async getTrendData() {
    return this.request('/api/environment/trends');
  }

  // Optional static fallback data
  getFallbackEnvironmentalData() {
    return {
      temperature: {
        global_average: 15.0,
        anomaly: 1.1,
        trend: 'increasing',
        unit: '°C',
        last_measured: new Date().toISOString(),
      },
      co2: {
        value: 417.0,
        unit: 'ppm',
        trend: 'rising',
        source: 'Fallback Data',
      },
      vegetation: {
        ndvi_global: 0.4,
        health_index: 75.0,
        trend: 'stable',
        source: 'Fallback Data',
      },
      biodiversity: {
        species_richness: 8.0,
        threat_level: 'moderate',
        protected_areas: 15.0,
        alert_level: 'normal',
      },
      weather: {
        current: {
          temperature: 20.0,
          humidity: 60,
          pressure: 1013,
          wind_speed: 5.0,
          conditions: 'clear',
          location: 'Global',
          source: 'Fallback Data',
        },
        forecast: {
          trend: 'stable',
          confidence: 0.8,
        },
        alerts: {
          heat_wave: false,
          storm_watch: false,
          air_quality: 'good',
        },
      },
      last_updated: new Date().toISOString(),
      data_sources: ['Fallback Data'],
      is_live: false,
    };
  }

  getFallbackRegionData() {
    return {
      regions: [
        {
          region: 'India',
          temperature: 24.6,
          aqi: 128,
          vegetation_index: 0.52,
          co2: 420.3,
          rainfall: 118,
          risk_level: 'moderate',
        },
        {
          region: 'Europe',
          temperature: 10.8,
          aqi: 65,
          vegetation_index: 0.58,
          co2: 414.7,
          rainfall: 84,
          risk_level: 'low',
        },
      ],
      last_updated: new Date().toISOString(),
    };
  }

  getFallbackTrendData() {
    return {
      trends: {
        temperature_last_6_months: [14.2, 14.4, 14.6, 14.8, 15.0, 15.1],
        co2_last_6_months: [414.1, 414.8, 415.5, 416.1, 416.6, 417.0],
        vegetation_last_6_months: [0.43, 0.42, 0.41, 0.4, 0.4, 0.39],
      },
      last_updated: new Date().toISOString(),
    };
  }
}

// Create singleton instance
export const apiService = new ApiService();
