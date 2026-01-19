import type { Coordinates } from '../models/types.js';

/**
 * Mock geocoding service for development
 * In production, this would call Google Maps Geocoding API or similar
 */

// Mock data for common addresses
const MOCK_ADDRESSES: Record<string, Coordinates> = {
  'london': { lat: 51.5074, lng: -0.1278 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'madrid': { lat: 40.4168, lng: -3.7038 },
  'rome': { lat: 41.9028, lng: 12.4964 },
};

export async function geocodeAddress(address: string): Promise<Coordinates> {
  // Check if we have an API key
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    // Use mock data
    const normalized = address.toLowerCase().trim();

    // Check if it's a coordinate pair
    const coordMatch = normalized.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
      return {
        lat: parseFloat(coordMatch[1]),
        lng: parseFloat(coordMatch[2]),
      };
    }

    // Check mock addresses
    for (const [city, coords] of Object.entries(MOCK_ADDRESSES)) {
      if (normalized.includes(city)) {
        // Add small random offset for variety
        return {
          lat: coords.lat + (Math.random() - 0.5) * 0.05,
          lng: coords.lng + (Math.random() - 0.5) * 0.05,
        };
      }
    }

    // Default to London with random offset
    return {
      lat: 51.5074 + (Math.random() - 0.5) * 0.1,
      lng: -0.1278 + (Math.random() - 0.5) * 0.1,
    };
  }

  // Real Google Maps Geocoding API call
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    }

    throw new Error('Address not found');
  } catch (error) {
    throw new Error('Geocoding failed');
  }
}
