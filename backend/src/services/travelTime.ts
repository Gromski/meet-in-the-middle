import type { Coordinates, TransportMode } from '../models/types.js';

/**
 * Calculate travel time and distance using Google Maps Distance Matrix API
 */
export async function calculateTravelTimes(
  origins: Coordinates[],
  destinations: Coordinates[],
  mode: TransportMode = 'transit'
): Promise<{ durations: number[][]; distances: number[][] }> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    // Return mock data when API key is not available
    return {
      durations: origins.map(() => destinations.map(() => Math.random() * 3600)), // Random times up to 1 hour
      distances: origins.map(() => destinations.map(() => Math.random() * 10000)), // Random distances up to 10km
    };
  }

  try {
    // Convert mode to Google Maps API format
    const googleMode = mode === 'cycling' ? 'bicycling' : mode;

    // Build origin and destination strings
    const originStr = origins.map(c => `${c.lat},${c.lng}`).join('|');
    const destStr = destinations.map(c => `${c.lat},${c.lng}`).join('|');

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destStr}&mode=${googleMode}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Distance Matrix API error:', data.status, data.error_message);
      throw new Error(`Distance Matrix API error: ${data.status}`);
    }

    const durations: number[][] = [];
    const distances: number[][] = [];

    data.rows.forEach((row: any) => {
      const rowDurations: number[] = [];
      const rowDistances: number[] = [];

      row.elements.forEach((element: any) => {
        if (element.status === 'OK') {
          rowDurations.push(element.duration.value); // in seconds
          rowDistances.push(element.distance.value); // in meters
        } else {
          // If route not available, use a very large value
          rowDurations.push(999999);
          rowDistances.push(999999);
        }
      });

      durations.push(rowDurations);
      distances.push(rowDistances);
    });

    return { durations, distances };
  } catch (error) {
    console.error('Travel time calculation failed:', error);
    // Return mock data on error
    return {
      durations: origins.map(() => destinations.map(() => Math.random() * 3600)),
      distances: origins.map(() => destinations.map(() => Math.random() * 10000)),
    };
  }
}

/**
 * Find the optimal center point that minimizes total or maximum travel time
 * Uses a grid search approach to find the best point
 */
export async function findOptimalCenterByTravelTime(
  participants: Coordinates[],
  mode: TransportMode = 'transit'
): Promise<Coordinates> {
  if (participants.length === 0) {
    return { lat: 0, lng: 0 };
  }

  if (participants.length === 1) {
    return participants[0];
  }

  // Start with geometric centroid as initial guess
  const geometricCenter = {
    lat: participants.reduce((sum, p) => sum + p.lat, 0) / participants.length,
    lng: participants.reduce((sum, p) => sum + p.lng, 0) / participants.length,
  };

  // Calculate bounding box
  const minLat = Math.min(...participants.map(p => p.lat));
  const maxLat = Math.max(...participants.map(p => p.lat));
  const minLng = Math.min(...participants.map(p => p.lng));
  const maxLng = Math.max(...participants.map(p => p.lng));

  // Create a grid of candidate points
  const gridSize = 5; // 5x5 grid for performance
  const candidatePoints: Coordinates[] = [];

  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      candidatePoints.push({
        lat: minLat + (maxLat - minLat) * (i / gridSize),
        lng: minLng + (maxLng - minLng) * (j / gridSize),
      });
    }
  }

  // Add geometric center as a candidate
  candidatePoints.push(geometricCenter);

  // Calculate travel times from each candidate to all participants
  const { durations } = await calculateTravelTimes(candidatePoints, participants, mode);

  // Find the candidate with minimum maximum travel time (minimax)
  let bestIndex = 0;
  let bestScore = Infinity;

  durations.forEach((candidateDurations, index) => {
    // Use maximum travel time as the score (minimax approach)
    // This ensures the furthest participant isn't too far
    const maxTime = Math.max(...candidateDurations);
    const avgTime = candidateDurations.reduce((a, b) => a + b, 0) / candidateDurations.length;

    // Combined score: 70% weight on max time, 30% on average time
    const score = maxTime * 0.7 + avgTime * 0.3;

    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return candidatePoints[bestIndex];
}
