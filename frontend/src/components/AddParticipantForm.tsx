import { useState, useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import type { Coordinates } from '../types';
import './AddParticipantForm.css';

interface AddParticipantFormProps {
  onSubmit: (displayName: string, location: { address: string; coordinates: Coordinates }) => void;
  onCancel: () => void;
  prefilledLocation?: Coordinates | null;
  isMapPopover?: boolean;
}

function AddParticipantForm({ onSubmit, onCancel, prefilledLocation, isMapPopover }: AddParticipantFormProps) {
  const [displayName, setDisplayName] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(prefilledLocation || null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prefilledLocation) {
      setCoordinates(prefilledLocation);
      setIsLoadingAddress(true);
      // Reverse geocode to get address
      reverseGeocode(prefilledLocation);
    }
  }, [prefilledLocation]);

  const reverseGeocode = async (coords: Coordinates) => {
    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: coords.lat, lng: coords.lng } },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            setAddress(results[0].formatted_address);
          } else {
            setAddress(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
          }
          setIsLoadingAddress(false);
        }
      );
    } catch (error) {
      console.error('Reverse geocode failed:', error);
      setAddress(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
      setIsLoadingAddress(false);
    }
  };

  const handleAutocompleteLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        setCoordinates({
          lat: location.lat(),
          lng: location.lng()
        });
        setAddress(place.formatted_address || '');
      }
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
      address: address || `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`,
      coordinates
    });
  };

  const formClassName = isMapPopover ? 'add-participant-form map-popover' : 'add-participant-form';

  return (
    <div className={formClassName}>
      <h3>{prefilledLocation ? 'Add Participant at Pin' : 'Add Participant'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="displayName">Name</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter participant name"
            autoFocus
            required
          />
        </div>

        {!prefilledLocation ? (
          <div className="form-group">
            <label htmlFor="address">Address or Postcode</label>
            <Autocomplete
              onLoad={handleAutocompleteLoad}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                ref={inputRef}
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Start typing an address..."
                required
              />
            </Autocomplete>
            <small className="hint">Start typing to see address suggestions</small>
          </div>
        ) : (
          <div className="form-group">
            <label>Location</label>
            <div className="location-display">
              {isLoadingAddress ? (
                <span>📍 Loading address...</span>
              ) : (
                <span>📍 {address}</span>
              )}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="primary" disabled={!coordinates}>
            Add Participant
          </button>
          <button type="button" onClick={onCancel} className="secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddParticipantForm;
