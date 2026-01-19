import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './HomePage.css';

function HomePage() {
  const [meetupName, setMeetupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateMeetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetupName.trim()) return;

    setIsCreating(true);
    try {
      const meetup = await api.createMeetup(meetupName);
      navigate(`/meetup/${meetup.id}`);
    } catch (error) {
      console.error('Failed to create meetup:', error);
      alert('Failed to create meetup. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1>Meet in the Middle</h1>
          <p className="tagline">Find the perfect meeting point for your group</p>
        </div>

        <div className="home-content">
          <div className="feature-list">
            <div className="feature">
              <span className="feature-icon">📍</span>
              <h3>Pin Your Locations</h3>
              <p>Everyone adds their starting point on the map</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <h3>Find the Center</h3>
              <p>Automatically calculates the optimal meeting point</p>
            </div>
            <div className="feature">
              <span className="feature-icon">☕</span>
              <h3>Discover Venues</h3>
              <p>Search for cafes, restaurants, and meeting spots nearby</p>
            </div>
          </div>

          <form onSubmit={handleCreateMeetup} className="create-form">
            <h2>Create a New Meetup</h2>
            <div className="form-group">
              <label htmlFor="meetupName">Meetup Name</label>
              <input
                id="meetupName"
                type="text"
                placeholder="e.g., Team Lunch, Friends Catchup"
                value={meetupName}
                onChange={(e) => setMeetupName(e.target.value)}
                disabled={isCreating}
                required
              />
            </div>
            <button type="submit" className="primary" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Meetup'}
            </button>
          </form>
        </div>

        <footer className="home-footer">
          <p>No sign-up required. Share the link with your group to get started.</p>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
