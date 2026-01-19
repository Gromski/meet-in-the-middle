export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  address: string;
  coordinates: Coordinates;
}

export type LocationType = 'home' | 'office' | 'transport' | 'custom';
export type OptimizationMode = 'distance' | 'travelTime';
export type TransportMode = 'driving' | 'transit' | 'walking' | 'cycling';

export interface Participant {
  id: string;
  meetupId: string;
  displayName: string;
  location: Location;
  locationType: LocationType;
  joinedAt: string;
}

export interface Venue {
  placeId: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  type: string;
  rating: number;
  distanceFromCenter: number;
  travelTimeFromCenter?: number;
}

export interface Meetup {
  id: string;
  name: string;
  createdAt: string;
  createdBy?: string;
  optimizationMode: OptimizationMode;
  transportMode: TransportMode;
  selectedVenue?: Venue;
  centerPoint: Coordinates;
  expiresAt?: string;
  participants: Participant[];
}
