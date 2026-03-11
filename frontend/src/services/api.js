const API_BASE_URL = 'https://symmetrical-space-halibut-pjwqqrp9j495h6rw-8000.app.github.dev';

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
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Environmental data
  async getCurrentEnvironment() {
    return this.request('/api/environment/current');
  }

  async getEnvironmentMetrics() {
    return this.request('/api/environment/metrics');
  }

  // Data layers
  async getAvailableLayers() {
    return this.request('/api/layers');
  }

  // Satellite data
  async getSatelliteImagery() {
    return this.request('/api/satellite/imagery');
  }

  // Fallback data for offline development
  getFallbackMetrics() {
    return {
      metrics: {
        global_temperature: { value: 15.2, unit: '°C', change: '+1.1', trend: 'rising' },
        co2_concentration: { value: 417.5, unit: 'ppm', change: '+2.5', trend: 'rising' },
        sea_level_rise: { value: 3.4, unit: 'mm/year', change: '+0.3', trend: 'rising' },
        forest_cover_loss: { value: 10.1, unit: 'M hectares/year', change: '-0.2', trend: 'improving' },
        biodiversity_index: { value: 76.0, unit: '%', change: '-2.1', trend: 'declining' }
      },
      last_updated: new Date().toISOString()
    };
  }

  getFallbackEnvironment() {
    return {
      temperature: 15.2,
      co2_levels: 417.5,
      deforestation_rate: 0.08,
      biodiversity_index: 0.76,
      air_quality: 85.2,
      sea_level_rise: 3.4,
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
export const apiService = new ApiService();
