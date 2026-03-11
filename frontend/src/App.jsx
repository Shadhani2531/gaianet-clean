import React, { useState } from 'react';
import Earth from './components/Earth';
import EnvironmentalDashboard from './components/EnvironmentalDashboard';
import DataLayersPanel from './components/DataLayersPanel';
import './App.css';

function App() {
  const [activeLayers, setActiveLayers] = useState([]);
  const [layerOpacities, setLayerOpacities] = useState({
    temperature: 0.7,
    vegetation: 0.6,
    co2: 0.5,
  });

  const handleOpacityChange = (layerId, opacity) => {
    setLayerOpacities((prev) => ({
      ...prev,
      [layerId]: parseFloat(opacity),
    }));
  };

  return (
    <div className="app-container">
      <Earth activeLayers={activeLayers} layerOpacities={layerOpacities} />

      <div className="ui-overlay">
        <div className="data-layers-container">
          <DataLayersPanel
            activeLayers={activeLayers}
            onLayersChange={setActiveLayers}
            layerOpacities={layerOpacities}
            onOpacityChange={handleOpacityChange}
          />
        </div>

        <div className="dashboard-container">
          <EnvironmentalDashboard />
        </div>

        <div className="bottom-left-text">
          GaiaNet Digital Earth Twin v1.0
        </div>
      </div>
    </div>
  );
}

export default App;
