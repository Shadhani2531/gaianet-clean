import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import './EnvironmentalDashboard.css';

const EnvironmentalDashboard = () => {
  const [environmentData, setEnvironmentData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [
          environmentResponse,
          weatherResponse,
          statusResponse,
          regionsResponse,
          trendsResponse,
        ] = await Promise.all([
          apiService.getEnvironmentalData(),
          apiService.getWeatherData(),
          apiService.getSystemStatus(),
          apiService.getRegionData(),
          apiService.getTrendData(),
        ]);

        setEnvironmentData(environmentResponse);
        setWeatherData(weatherResponse);
        setStatusData(statusResponse);
        setRegionData(regionsResponse);
        setTrendData(trendsResponse);
      } catch (err) {
        console.error('Dashboard data fetch failed:', err);
        setError('Failed to load live backend data. Showing fallback data.');

        const fallbackEnvironment = apiService.getFallbackEnvironmentalData();
        const fallbackRegions = apiService.getFallbackRegionData();
        const fallbackTrends = apiService.getFallbackTrendData();

        setEnvironmentData(fallbackEnvironment);
        setWeatherData(fallbackEnvironment.weather);
        setStatusData({
          system: 'GaiaNet Planetary Intelligence',
          status: 'fallback mode',
          earth_visualization: 'active',
          data_streams: ['environmental', 'weather', 'regions', 'trends'],
          last_data_update: new Date().toISOString(),
          version: '1.0.0',
        });
        setRegionData(fallbackRegions);
        setTrendData(fallbackTrends);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="environmental-dashboard">
        <h2>🌍 Environmental Dashboard</h2>
        <p>Loading planetary data...</p>
      </div>
    );
  }

  return (
    <div className="environmental-dashboard">
      <h2>🌍 Environmental Dashboard</h2>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-section">
        <h3>Global Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Temperature</span>
            <span className="metric-value">
              {environmentData?.temperature?.global_average ?? '--'}°C
            </span>
            <span className="metric-subtext">
              Anomaly: {environmentData?.temperature?.anomaly ?? '--'}°C
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-label">CO₂</span>
            <span className="metric-value">
              {environmentData?.co2?.value ?? '--'} ppm
            </span>
            <span className="metric-subtext">
              Trend: {environmentData?.co2?.trend ?? '--'}
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Vegetation</span>
            <span className="metric-value">
              {environmentData?.vegetation?.health_index ?? '--'}
            </span>
            <span className="metric-subtext">
              NDVI: {environmentData?.vegetation?.ndvi_global ?? '--'}
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Biodiversity</span>
            <span className="metric-value">
              {environmentData?.biodiversity?.species_richness ?? '--'}
            </span>
            <span className="metric-subtext">
              Threat: {environmentData?.biodiversity?.threat_level ?? '--'}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Weather Snapshot</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Conditions</span>
            <span className="metric-value">
              {weatherData?.current?.conditions ?? '--'}
            </span>
            <span className="metric-subtext">
              {weatherData?.current?.location ?? 'Global'}
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Humidity</span>
            <span className="metric-value">
              {weatherData?.current?.humidity ?? '--'}%
            </span>
            <span className="metric-subtext">
              Pressure: {weatherData?.current?.pressure ?? '--'} hPa
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Wind Speed</span>
            <span className="metric-value">
              {weatherData?.current?.wind_speed ?? '--'}
            </span>
            <span className="metric-subtext">m/s</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Air Quality</span>
            <span className="metric-value">
              {weatherData?.alerts?.air_quality ?? '--'}
            </span>
            <span className="metric-subtext">
              Forecast: {weatherData?.forecast?.trend ?? '--'}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Regional Overview</h3>
        <div className="regions-list">
          {regionData?.regions?.slice(0, 5).map((region) => (
            <div key={region.region} className="region-card">
              <strong>{region.region}</strong>
              <div>Temp: {region.temperature}°C</div>
              <div>AQI: {region.aqi}</div>
              <div>Risk: {region.risk_level}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Trend Summary</h3>
        <div className="trend-summary">
          <div>
            <strong>Temperature:</strong>{' '}
            {trendData?.trends?.temperature_last_6_months?.join(', ') || '--'}
          </div>
          <div>
            <strong>CO₂:</strong>{' '}
            {trendData?.trends?.co2_last_6_months?.join(', ') || '--'}
          </div>
          <div>
            <strong>Vegetation:</strong>{' '}
            {trendData?.trends?.vegetation_last_6_months?.join(', ') || '--'}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>System Status</h3>
        <div className="status-card">
          <div><strong>System:</strong> {statusData?.system}</div>
          <div><strong>Status:</strong> {statusData?.status}</div>
          <div><strong>Version:</strong> {statusData?.version}</div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalDashboard;
