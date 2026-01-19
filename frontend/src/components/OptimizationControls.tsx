import { useState } from 'react';
import type { OptimizationMode, TransportMode } from '../types';
import './OptimizationControls.css';

interface OptimizationControlsProps {
  optimizationMode: OptimizationMode;
  transportMode: TransportMode;
  onUpdate: (optimizationMode: OptimizationMode, transportMode: TransportMode) => void;
  disabled?: boolean;
}

function OptimizationControls({
  optimizationMode,
  transportMode,
  onUpdate,
  disabled = false
}: OptimizationControlsProps) {
  const [localOptMode, setLocalOptMode] = useState<OptimizationMode>(optimizationMode);
  const [localTransMode, setLocalTransMode] = useState<TransportMode>(transportMode);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOptModeChange = async (mode: OptimizationMode) => {
    setLocalOptMode(mode);
    setIsUpdating(true);
    try {
      await onUpdate(mode, localTransMode);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTransModeChange = async (mode: TransportMode) => {
    setLocalTransMode(mode);
    setIsUpdating(true);
    try {
      await onUpdate(localOptMode, mode);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="optimization-controls">
      <h3>Optimization Settings</h3>

      <div className="control-group">
        <label>Optimize By</label>
        <div className="button-group">
          <button
            className={`mode-btn ${localOptMode === 'distance' ? 'active' : ''}`}
            onClick={() => handleOptModeChange('distance')}
            disabled={disabled || isUpdating}
          >
            📏 Distance
          </button>
          <button
            className={`mode-btn ${localOptMode === 'travelTime' ? 'active' : ''}`}
            onClick={() => handleOptModeChange('travelTime')}
            disabled={disabled || isUpdating}
          >
            ⏱️ Travel Time
          </button>
        </div>
        {localOptMode === 'distance' && (
          <small className="hint">Finds geographic center point</small>
        )}
        {localOptMode === 'travelTime' && (
          <small className="hint">Balances actual travel times</small>
        )}
      </div>

      {localOptMode === 'travelTime' && (
        <div className="control-group">
          <label>Transport Mode</label>
          <div className="transport-buttons">
            <button
              className={`transport-btn ${localTransMode === 'walking' ? 'active' : ''}`}
              onClick={() => handleTransModeChange('walking')}
              disabled={disabled || isUpdating}
              title="Walking"
            >
              🚶
            </button>
            <button
              className={`transport-btn ${localTransMode === 'transit' ? 'active' : ''}`}
              onClick={() => handleTransModeChange('transit')}
              disabled={disabled || isUpdating}
              title="Public Transit"
            >
              🚇
            </button>
            <button
              className={`transport-btn ${localTransMode === 'driving' ? 'active' : ''}`}
              onClick={() => handleTransModeChange('driving')}
              disabled={disabled || isUpdating}
              title="Driving"
            >
              🚗
            </button>
            <button
              className={`transport-btn ${localTransMode === 'cycling' ? 'active' : ''}`}
              onClick={() => handleTransModeChange('cycling')}
              disabled={disabled || isUpdating}
              title="Cycling"
            >
              🚴
            </button>
          </div>
        </div>
      )}

      {isUpdating && (
        <div className="updating-indicator">
          ⏳ Recalculating center point...
        </div>
      )}
    </div>
  );
}

export default OptimizationControls;
