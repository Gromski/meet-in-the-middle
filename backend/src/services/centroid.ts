import type { Coordinates, Participant } from '../models/types.js';

/**
 * Calculate the geographic centroid (center point) of multiple coordinates
 * Uses the geometric mean of latitude and longitude
 */
export function calculateCentroid(participants: Participant[]): Coordinates {
  if (participants.length === 0) {
    return { lat: 0, lng: 0 };
  }

  if (participants.length === 1) {
    return participants[0].location.coordinates;
  }

  // Calculate the average latitude and longitude
  let totalLat = 0;
  let totalLng = 0;

  for (const participant of participants) {
    totalLat += participant.location.coordinates.lat;
    totalLng += participant.location.coordinates.lng;
  }

  return {
    lat: totalLat / participants.length,
    lng: totalLng / participants.length,
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
