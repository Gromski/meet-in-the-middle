import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import type { Coordinates, Participant, Venue } from '../types';

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

interface MapViewProps {
  center: Coordinates;
  participants: Participant[];
  centerPoint: Coordinates | null;
  venues: Venue[];
  onMapClick?: (coordinates: Coordinates, event?: any) => void;
  tempMarker?: Coordinates | null;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

/**
 * Extract initials from a display name
 * Examples: "John Doe" -> "JD", "Alice" -> "A", "Bob Smith Jones" -> "BJ"
 */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  // Take first letter of first word and first letter of last word
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Create a custom marker icon with initials
 */
function createMarkerWithInitials(initials: string, color: string = '#3b82f6'): google.maps.Icon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="3"/>
      <text x="20" y="20" text-anchor="middle" dominant-baseline="central"
            font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">
        ${initials}
      </text>
    </svg>
  `;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 20),
  };
}

function MapView({ center, participants, centerPoint, venues, onMapClick, tempMarker }: MapViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '40px',
        textAlign: 'center',
        background: '#f9fafb'
      }}>
        <div>
          <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Google Maps API Key Required</h2>
          <p style={{ color: '#6b7280' }}>
            Please add your Google Maps API key to <code>.env</code> file:<br/>
            <code>VITE_GOOGLE_MAPS_API_KEY=your_api_key</code>
          </p>
        </div>
      </div>
    );
  }

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng && onMapClick) {
      onMapClick({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }, e);
    }
  };

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {/* Participant markers */}
        {participants.map((participant) => {
          const initials = getInitials(participant.displayName);
          return (
            <Marker
              key={participant.id}
              position={{
                lat: participant.location.coordinates.lat,
                lng: participant.location.coordinates.lng
              }}
              title={participant.displayName}
              onClick={() => setSelectedMarker(participant.id)}
              icon={createMarkerWithInitials(initials, '#3b82f6')}
            >
              {selectedMarker === participant.id && (
                <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <div>
                    <strong>{participant.displayName}</strong>
                    <br />
                    {participant.location.address || 'Custom location'}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}

        {/* Temporary marker while adding participant */}
        {tempMarker && (
          <Marker
            position={{ lat: tempMarker.lat, lng: tempMarker.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#f59e0b',
              fillOpacity: 0.8,
              strokeColor: 'white',
              strokeWeight: 3,
            }}
            animation={google.maps.Animation.BOUNCE}
          />
        )}

        {/* Center point marker */}
        {centerPoint && (
          <Marker
            position={{ lat: centerPoint.lat, lng: centerPoint.lng }}
            title="Meeting Center Point"
            onClick={() => setSelectedMarker('center')}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#ef4444',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 3,
            }}
          >
            {selectedMarker === 'center' && (
              <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                <div>
                  <strong>Meeting Center Point</strong>
                  <br />
                  Optimal location for all participants
                </div>
              </InfoWindow>
            )}
          </Marker>
        )}

        {/* Venue markers */}
        {venues.map((venue) => (
          <Marker
            key={venue.placeId}
            position={{ lat: venue.coordinates.lat, lng: venue.coordinates.lng }}
            title={venue.name}
            onClick={() => setSelectedMarker(venue.placeId)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#10b981',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2,
            }}
          >
            {selectedMarker === venue.placeId && (
              <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                <div>
                  <strong>{venue.name}</strong>
                  <br />
                  {venue.address}
                  <br />
                  {venue.rating && <span>Rating: {venue.rating} ⭐</span>}
                  <br />
                  <small>Distance: {Math.round(venue.distanceFromCenter)}m</small>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapView;
