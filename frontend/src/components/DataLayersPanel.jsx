import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import './DataLayersPanel.css';

const DataLayersPanel = ({
  activeLayers,
  onLayersChange,
  layerOpacities,
  onOpacityChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [environmentData, setEnvironmentData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const MAX_ACTIVE_LAYERS = 3;

  const availableLayers = [
    {
      id: 'temperature',
      name: 'Temperature Heatmap',
      icon: '🌡️',
      description: 'Global temperature distribution',
    },
    {
      id: 'vegetation',
      name: 'Vegetation Index',
      icon: '🌿',
      description: 'NDVI vegetation health',
    },
    {
      id: 'co2',
      name: 'CO2 Concentration',
      icon: '🏭',
      description: 'Atmospheric CO2 levels',
    },
    {
      id: 'air_quality',
      name: 'Air Quality',
      icon: '🌫️',
      description: 'Air quality and pollution conditions',
    },
    {
      id: 'fires',
      name: 'Active Fires',
      icon: '🔥',
      description: 'Thermal anomaly and fire detection',
    },
    {
      id: 'night_lights',
      name: 'Night Lights',
      icon: '💡',
      description: 'Human activity at night',
    },
  ];

  useEffect(() => {
    const fetchPanelData = async () => {
      try {
        const [environmentResponse, weatherResponse] = await Promise.all([
          apiService.getEnvironmentalData(),
          apiService.getWeatherData(),
        ]);

        setEnvironmentData(environmentResponse);
        setWeatherData(weatherResponse);
      } catch (error) {
        console.error('Failed to load layer panel data:', error);
        const fallback = apiService.getFallbackEnvironmentalData();
        setEnvironmentData(fallback);
        setWeatherData(fallback.weather);
      }
    };

    fetchPanelData();
  }, []);

  const handleLayerToggle = (layerId) => {
    if (activeLayers.includes(layerId)) {
      onLayersChange(activeLayers.filter((id) => id !== layerId));
    } else if (activeLayers.length < MAX_ACTIVE_LAYERS) {
      onLayersChange([...activeLayers, layerId]);

      if (layerOpacities[layerId] === undefined) {
        onOpacityChange(layerId, 0.7);
      }
    }
  };

  const handleLayerOpacityChange = (layerId, opacity) => {
    onOpacityChange(layerId, parseFloat(opacity));
  };

  const isLayerDisabled = (layerId) => {
    return !activeLayers.includes(layerId) && activeLayers.length >= MAX_ACTIVE_LAYERS;
  };

  if (isCollapsed) {
    return (
      <button
        className="panel-toggle"
        onClick={() => setIsCollapsed(false)}
        title="Show Data Layers"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div className="data-layers-panel">
      <button
        className="panel-toggle"
        onClick={() => setIsCollapsed(true)}
        title="Hide Panel"
      >
        ✕
      </button>

      <h3>🛰️ Data Layers</h3>

      <div className="layers-list">
        {availableLayers.map((layer) => {
          const isActive = activeLayers.includes(layer.id);
          const isDisabled = isLayerDisabled(layer.id);
          const opacity = layerOpacities[layer.id] || 0.7;

          return (
            <div key={layer.id} className="layer-container">
              <div
                className={`layer-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => !isDisabled && handleLayerToggle(layer.id)}
                title={layer.description}
              >
                <div className="layer-background"></div>

                <input
                  type="checkbox"
                  className="layer-checkbox"
                  checked={isActive}
                  onChange={() => !isDisabled && handleLayerToggle(layer.id)}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isDisabled && !isActive}
                />

                <span className="layer-icon">{layer.icon}</span>
                <span className="layer-label">{layer.name}</span>
              </div>

              {environmentData && (
                <div
                  className="layer-value"
                  style={{ fontSize: '0.8em', color: '#88aacc', marginTop: '5px' }}
                >
                  {layer.id === 'temperature' &&
                    `Current: ${environmentData.temperature?.global_average ?? '--'}°C`}
                  {layer.id === 'vegetation' &&
                    `Health: ${environmentData.vegetation?.health_index ?? '--'}/100`}
                  {layer.id === 'co2' &&
                    `Level: ${environmentData.co2?.value ?? '--'} ppm`}
                  {layer.id === 'air_quality' &&
                    `Quality: ${weatherData?.alerts?.air_quality || 'moderate'}`}
                  {layer.id === 'fires' && 'Status: Monitoring'}
                  {layer.id === 'night_lights' && 'Status: Static demo layer'}
                </div>
              )}

              {isActive && (
                <div className="opacity-control">
                  <label className="opacity-label">
                    Opacity: {(opacity * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) =>
                      handleLayerOpacityChange(layer.id, e.target.value)
                    }
                    className="opacity-slider"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="controls-section">
        <div className="active-layers-count">
          {activeLayers.length} of {MAX_ACTIVE_LAYERS} layers active
        </div>

        {activeLayers.length >= MAX_ACTIVE_LAYERS && (
          <div className="layer-limit-warning">
            ⚠️ Maximum {MAX_ACTIVE_LAYERS} layers allowed
          </div>
        )}
      </div>
    </div>
  );
};

export default DataLayersPanel;
