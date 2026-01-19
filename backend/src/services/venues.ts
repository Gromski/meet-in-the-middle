import type { Coordinates, Venue } from '../models/types.js';
import { calculateDistance } from './centroid.js';

/**
 * Mock venue search service for development
 * In production, this would call Google Places API or similar
 */

// Mock venue data
const MOCK_VENUES = {
  cafe: [
    { name: 'The Coffee House', type: 'cafe', rating: 4.5 },
    { name: 'Espresso Corner', type: 'cafe', rating: 4.3 },
    { name: 'Bean & Brew', type: 'cafe', rating: 4.7 },
    { name: 'Morning Glory Cafe', type: 'cafe', rating: 4.2 },
    { name: 'The Daily Grind', type: 'cafe', rating: 4.6 },
  ],
  restaurant: [
    { name: 'The Dining Room', type: 'restaurant', rating: 4.4 },
    { name: 'Pasta Paradise', type: 'restaurant', rating: 4.5 },
    { name: 'Burger Joint', type: 'restaurant', rating: 4.1 },
    { name: 'Sushi Master', type: 'restaurant', rating: 4.8 },
    { name: 'Pizza Palace', type: 'restaurant', rating: 4.3 },
  ],
  bar: [
    { name: 'The Local Pub', type: 'bar', rating: 4.2 },
    { name: 'Cocktail Lounge', type: 'bar', rating: 4.6 },
    { name: 'Sports Bar & Grill', type: 'bar', rating: 4.0 },
    { name: 'Wine & Dine', type: 'bar', rating: 4.4 },
  ],
  park: [
    { name: 'Central Park', type: 'park', rating: 4.7 },
    { name: 'Green Gardens', type: 'park', rating: 4.5 },
    { name: 'Riverside Park', type: 'park', rating: 4.3 },
  ],
  library: [
    { name: 'Public Library', type: 'library', rating: 4.4 },
    { name: 'Community Library', type: 'library', rating: 4.2 },
  ],
};

export async function searchVenues(
  center: Coordinates,
  type: string = 'cafe',
  radius: number = 1000
): Promise<Venue[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    // Use mock data
    const venues = MOCK_VENUES[type as keyof typeof MOCK_VENUES] || MOCK_VENUES.cafe;

    return venues.map((venue, index) => {
      // Generate random location within radius
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;
      const latOffset = (distance / 111320) * Math.cos(angle);
      const lngOffset = (distance / (111320 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(angle);

      const coordinates = {
        lat: center.lat + latOffset,
        lng: center.lng + lngOffset,
      };

      return {
        placeId: `mock_${type}_${index}`,
        name: venue.name,
        address: `${Math.floor(Math.random() * 500) + 1} Main Street`,
        coordinates,
        type: venue.type,
        rating: venue.rating,
        distanceFromCenter: calculateDistance(center, coordinates),
      };
    });
  }

  // Real Google Places API call
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${center.lat},${center.lng}&radius=${radius}&type=${type}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.results.slice(0, 10).map((place: any) => ({
        placeId: place.place_id,
        name: place.name,
        address: place.vicinity,
        coordinates: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        type,
        rating: place.rating || 0,
        distanceFromCenter: calculateDistance(center, {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        }),
      }));
    }

    return [];
  } catch (error) {
    console.error('Venue search failed:', error);
    return [];
  }
}
