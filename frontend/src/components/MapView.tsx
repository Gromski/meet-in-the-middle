import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { Coordinates, Participant, Venue } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const centerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="3"/>
      <circle cx="16" cy="16" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const venueIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
      <circle cx="15" cy="15" r="10" fill="#10b981" stroke="white" stroke-width="2"/>
      <text x="15" y="20" text-anchor="middle" font-size="16" fill="white">☕</text>
    </svg>
  `),
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

interface MapViewProps {
  center: Coordinates;
  participants: Participant[];
  centerPoint: Coordinates | null;
  venues: Venue[];
  onMapClick?: (coordinates: Coordinates) => void;
}

function MapClickHandler({ onClick }: { onClick?: (coordinates: Coordinates) => void }) {
  useMapEvents({
    click: (e) => {
      if (onClick) {
        onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

function MapView({ center, participants, centerPoint, venues, onMapClick }: MapViewProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onClick={onMapClick} />

      {/* Participant markers */}
      {participants.map((participant) => (
        <Marker
          key={participant.id}
          position={[participant.location.coordinates.lat, participant.location.coordinates.lng]}
        >
          <Popup>
            <div>
              <strong>{participant.displayName}</strong>
              <br />
              {participant.location.address || 'Custom location'}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Center point marker */}
      {centerPoint && (
        <Marker position={[centerPoint.lat, centerPoint.lng]} icon={centerIcon}>
          <Popup>
            <div>
              <strong>Meeting Center Point</strong>
              <br />
              Optimal location for all participants
            </div>
          </Popup>
        </Marker>
      )}

      {/* Venue markers */}
      {venues.map((venue) => (
        <Marker
          key={venue.placeId}
          position={[venue.coordinates.lat, venue.coordinates.lng]}
          icon={venueIcon}
        >
          <Popup>
            <div>
              <strong>{venue.name}</strong>
              <br />
              {venue.address}
              <br />
              {venue.rating && <span>Rating: {venue.rating} ⭐</span>}
              <br />
              <small>Distance: {Math.round(venue.distanceFromCenter)}m</small>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
