import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Coordinates } from '../types';
import './AddParticipantForm.css';

interface AddParticipantFormProps {
  onSubmit: (displayName: string, location: { address: string; coordinates: Coordinates }) => void;
  onCancel: () => void;
  prefilledLocation?: Coordinates | null;
}

function AddParticipantForm({ onSubmit, onCancel, prefilledLocation }: AddParticipantFormProps) {
  const [displayName, setDisplayName] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(prefilledLocation || null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [useMapLocation, setUseMapLocation] = useState(!!prefilledLocation);

  useEffect(() => {
    if (prefilledLocation) {
      setCoordinates(prefilledLocation);
      setUseMapLocation(true);
      setAddress(`${prefilledLocation.lat.toFixed(6)}, ${prefilledLocation.lng.toFixed(6)}`);
    }
  }, [prefilledLocation]);

  const handleGeocodeAddress = async () => {
    if (!address.trim()) return;

    setIsGeocoding(true);
    try {
      const coords = await api.geocodeAddress(address);
      setCoordinates(coords);
      setUseMapLocation(false);
    } catch (err) {
      alert('Failed to find location. Please try a different address.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      alert('Please enter a name');
      return;
    }

    if (!coordinates) {
      alert('Please select a location');
      return;
    }

    onSubmit(displayName, {
      address: useMapLocation ? `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}` : address,
      coordinates,
    });
  };

  return (
    <div className="add-participant-form">
      <h3>Add Participant</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="displayName">Name</label>
          <input
            id="displayName"
            type="text"
            placeholder="Enter name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Location</label>
          <div className="location-input-group">
            <input
              id="address"
              type="text"
              placeholder={useMapLocation ? "Using map location" : "Enter address"}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setUseMapLocation(false);
              }}
              disabled={isGeocoding}
            />
            <button
              type="button"
              onClick={handleGeocodeAddress}
              className="secondary"
              disabled={isGeocoding || !address.trim() || useMapLocation}
            >
              {isGeocoding ? '...' : '📍'}
            </button>
          </div>
          {useMapLocation && (
            <small className="hint">Using location from map click</small>
          )}
          {!useMapLocation && !coordinates && (
            <small className="hint">Click the 📍 button to find the location, or click on the map</small>
          )}
          {coordinates && !useMapLocation && (
            <small className="success">✓ Location found</small>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="secondary">
            Cancel
          </button>
          <button type="submit" className="primary" disabled={!coordinates}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddParticipantForm;
