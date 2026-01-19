import type { Meetup, Participant, Venue, OptimizationMode, TransportMode, Coordinates } from '../types';

const API_BASE_URL = '/api';

export const api = {
  // Meetup Management
  async createMeetup(name: string): Promise<Meetup> {
    const response = await fetch(`${API_BASE_URL}/meetups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create meetup');
    return response.json();
  },

  async getMeetup(id: string): Promise<Meetup> {
    const response = await fetch(`${API_BASE_URL}/meetups/${id}`);
    if (!response.ok) throw new Error('Failed to fetch meetup');
    return response.json();
  },

  async updateMeetup(
    id: string,
    updates: { name?: string; optimizationMode?: OptimizationMode; transportMode?: TransportMode }
  ): Promise<Meetup> {
    const response = await fetch(`${API_BASE_URL}/meetups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update meetup');
    return response.json();
  },

  // Participant Management
  async addParticipant(
    meetupId: string,
    displayName: string,
    location: { address: string; coordinates: Coordinates }
  ): Promise<Participant> {
    const response = await fetch(`${API_BASE_URL}/meetups/${meetupId}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, location }),
    });
    if (!response.ok) throw new Error('Failed to add participant');
    return response.json();
  },

  async updateParticipant(
    meetupId: string,
    participantId: string,
    location: { address: string; coordinates: Coordinates }
  ): Promise<Participant> {
    const response = await fetch(`${API_BASE_URL}/meetups/${meetupId}/participants/${participantId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location }),
    });
    if (!response.ok) throw new Error('Failed to update participant');
    return response.json();
  },

  async removeParticipant(meetupId: string, participantId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/meetups/${meetupId}/participants/${participantId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove participant');
  },

  // Venue Search
  async searchVenues(meetupId: string, type?: string, radius?: number): Promise<Venue[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (radius) params.append('radius', radius.toString());

    const response = await fetch(`${API_BASE_URL}/meetups/${meetupId}/venues?${params}`);
    if (!response.ok) throw new Error('Failed to search venues');
    return response.json();
  },

  // Geocoding
  async geocodeAddress(address: string): Promise<Coordinates> {
    const response = await fetch(`${API_BASE_URL}/geocode?address=${encodeURIComponent(address)}`);
    if (!response.ok) throw new Error('Failed to geocode address');
    return response.json();
  },
};
