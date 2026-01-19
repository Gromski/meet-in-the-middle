import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MapView from './MapView';
import ParticipantList from './ParticipantList';
import AddParticipantForm from './AddParticipantForm';
import VenueSearch from './VenueSearch';
import { api } from '../services/api';
import type { Meetup, Participant, Venue, Coordinates } from '../types';
import './MeetupPage.css';

function MeetupPage() {
  const { meetupId } = useParams<{ meetupId: string }>();
  const navigate = useNavigate();
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebarForm, setShowSidebarForm] = useState(false);
  const [mapPopoverLocation, setMapPopoverLocation] = useState<Coordinates | null>(null);
  const [mapPopoverPosition, setMapPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!meetupId) {
      navigate('/');
      return;
    }

    loadMeetup();
    // Poll for updates every 5 seconds
    const interval = setInterval(loadMeetup, 5000);
    return () => clearInterval(interval);
  }, [meetupId]);

  const loadMeetup = async () => {
    if (!meetupId) return;

    try {
      const data = await api.getMeetup(meetupId);
      setMeetup(data);
      setError(null);
    } catch (err) {
      setError('Failed to load meetup');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddParticipant = async (displayName: string, location: { address: string; coordinates: Coordinates }) => {
    if (!meetupId) return;

    try {
      await api.addParticipant(meetupId, displayName, location);
      await loadMeetup();
      setShowSidebarForm(false);
      setMapPopoverLocation(null);
      setMapPopoverPosition(null);
    } catch (err) {
      console.error('Failed to add participant:', err);
      alert('Failed to add participant. Please try again.');
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    if (!meetupId) return;

    try {
      await api.removeParticipant(meetupId, participantId);
      await loadMeetup();
    } catch (err) {
      console.error('Failed to remove participant:', err);
      alert('Failed to remove participant. Please try again.');
    }
  };

  const handleMapClick = (coordinates: Coordinates, event?: any) => {
    // Close sidebar form if open
    setShowSidebarForm(false);

    // Set map popover location
    setMapPopoverLocation(coordinates);

    // Calculate popover position relative to map container
    if (event && mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = event.domEvent.clientX - rect.left;
      const y = event.domEvent.clientY - rect.top;

      // Adjust position to keep popover in view
      const adjustedX = Math.min(x, rect.width - 350); // 350 is approx form width
      const adjustedY = Math.max(20, Math.min(y, rect.height - 300)); // 300 is approx form height

      setMapPopoverPosition({ x: adjustedX, y: adjustedY });
    }
  };

  const handleSearchVenues = async (type: string) => {
    if (!meetupId) return;

    try {
      const results = await api.searchVenues(meetupId, type, 1000);
      setVenues(results);
    } catch (err) {
      console.error('Failed to search venues:', err);
      alert('Failed to search venues. Please try again.');
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleAddButtonClick = () => {
    setShowSidebarForm(true);
    setMapPopoverLocation(null);
    setMapPopoverPosition(null);
  };

  const handleCancelForm = () => {
    setShowSidebarForm(false);
    setMapPopoverLocation(null);
    setMapPopoverPosition(null);
  };

  if (loading) {
    return (
      <div className="meetup-page loading">
        <div className="loading-spinner">Loading meetup...</div>
      </div>
    );
  }

  if (error || !meetup) {
    return (
      <div className="meetup-page error">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error || 'Meetup not found'}</p>
          <button onClick={() => navigate('/')} className="primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const mapCenter = meetup.participants.length > 0
    ? meetup.centerPoint
    : { lat: 51.5074, lng: -0.1278 }; // Default to London

  return (
    <div className="meetup-page">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>{meetup.name}</h1>
          <button onClick={handleCopyLink} className="secondary copy-link-btn">
            📋 Copy Link
          </button>
        </div>

        <div className="sidebar-content">
          <ParticipantList
            participants={meetup.participants}
            onRemove={handleRemoveParticipant}
          />

          <button
            onClick={handleAddButtonClick}
            className="primary add-participant-btn"
          >
            + Add Participant
          </button>

          {showSidebarForm && (
            <AddParticipantForm
              onSubmit={handleAddParticipant}
              onCancel={handleCancelForm}
              prefilledLocation={null}
              isMapPopover={false}
            />
          )}

          {meetup.participants.length >= 2 && (
            <div className="center-point-info">
              <h3>Center Point</h3>
              <p>
                Lat: {meetup.centerPoint.lat.toFixed(6)}<br />
                Lng: {meetup.centerPoint.lng.toFixed(6)}
              </p>
            </div>
          )}

          {meetup.participants.length >= 2 && (
            <VenueSearch onSearch={handleSearchVenues} />
          )}
        </div>
      </div>

      <div className="map-container" ref={mapContainerRef}>
        <MapView
          center={mapCenter}
          participants={meetup.participants}
          centerPoint={meetup.participants.length >= 2 ? meetup.centerPoint : null}
          venues={venues}
          onMapClick={handleMapClick}
          tempMarker={mapPopoverLocation}
        />

        {!showSidebarForm && !mapPopoverLocation && (
          <div className="map-hint">
            💡 Click anywhere on the map to drop a pin and add a participant
          </div>
        )}

        {mapPopoverLocation && mapPopoverPosition && (
          <div
            style={{
              position: 'absolute',
              left: `${mapPopoverPosition.x}px`,
              top: `${mapPopoverPosition.y}px`,
              zIndex: 1001,
            }}
          >
            <AddParticipantForm
              onSubmit={handleAddParticipant}
              onCancel={handleCancelForm}
              prefilledLocation={mapPopoverLocation}
              isMapPopover={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetupPage;
