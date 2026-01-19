# Meet in the Middle

A web-based service that calculates the optimal meeting point for groups based on participant locations. Find the perfect place where everyone can gather with minimal travel time for all.

## Features

- **Interactive Google Maps Interface**: Add participants by clicking on the map or typing addresses with autocomplete
- **Dual Input Methods**:
  - Click anywhere on the map to drop a pin and add a participant
  - Use the form with Google Places Autocomplete for address search
- **Smart Center Point Optimization**: Choose between two calculation modes:
  - **Distance Mode**: Finds the geometric centroid that minimizes total distance
  - **Travel Time Mode**: Uses Google Distance Matrix API to find a point that balances actual travel times
  - Support for 4 transport modes: walking (🚶), transit (🚇), driving (🚗), cycling (🚴)
- **Participant Initials on Markers**: Each pin shows the participant's initials for easy identification
- **Venue Discovery**: Search for cafes, restaurants, bars, parks, and other meeting spots near the center point
- **Shareable Links**: Create a meetup and share the link with your group - no sign-up required
- **Real-time Updates**: See the center point update automatically as participants join or settings change
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Google Maps JavaScript API** with @react-google-maps/api
- **Google Places Autocomplete** for address search
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **In-memory storage** (for MVP - easily upgradeable to PostgreSQL/MongoDB)
- **Mock geocoding & venue APIs** (fallback when API key not provided)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meet-in-the-middle
```

2. Install dependencies:
```bash
npm install
```

This will install dependencies for both frontend and backend workspaces.

### Development

Start both frontend and backend servers concurrently:

```bash
npm run dev
```

This will start:
- Frontend development server on http://localhost:3000
- Backend API server on http://localhost:3001

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### Building for Production

Build both frontend and backend:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
meet-in-the-middle/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/               # Express backend API
│   ├── src/
│   │   ├── models/       # Data models and storage
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic (centroid, geocoding, venues)
│   │   └── index.ts      # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── package.json          # Root workspace configuration
```

## API Endpoints

### Meetups
- `POST /api/meetups` - Create a new meetup
- `GET /api/meetups/:id` - Get meetup details with participants
- `PUT /api/meetups/:id` - Update meetup settings
- `DELETE /api/meetups/:id` - Delete a meetup

### Participants
- `POST /api/meetups/:id/participants` - Add a participant
- `GET /api/meetups/:id/participants` - List all participants
- `PUT /api/meetups/:id/participants/:participantId` - Update participant location
- `DELETE /api/meetups/:id/participants/:participantId` - Remove a participant

### Venues
- `GET /api/meetups/:id/venues?type=cafe&radius=1000` - Search venues near center point

### Geocoding
- `GET /api/geocode?address=<address>` - Convert address to coordinates

## Configuration

### Environment Variables

#### Backend Configuration

Create a `.env` file in the backend directory (see `backend/.env.example`):

```env
PORT=3001
NODE_ENV=development

# Optional: Add Google Maps API key for server-side geocoding and venue data
# GOOGLE_MAPS_API_KEY=your_api_key_here
```

#### Frontend Configuration (Required)

Create a `.env` file in the frontend directory (see `frontend/.env.example`):

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_URL=http://localhost:3001
```

**Important**: The frontend requires a Google Maps API key to display the map. To set this up:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API (required for map display)
   - Places API (required for address autocomplete)
   - Geocoding API (optional - for reverse geocoding)
3. Add the key to `frontend/.env` as `VITE_GOOGLE_MAPS_API_KEY`
4. Optionally add the same key to `backend/.env` as `GOOGLE_MAPS_API_KEY` for real venue data

**Note**: Without a frontend API key, the map will not load. The backend can still work with mock data if no API key is provided there.

## How It Works

### Center Point Optimization Modes

The app offers two sophisticated algorithms for finding the optimal meeting point:

#### Distance Mode (Geometric Centroid)
- Fast calculation requiring no API calls
- Calculates the geographic centroid (average latitude/longitude)
- Minimizes total straight-line distance for all participants
- Best for: Groups meeting in walkable areas, quick calculations

#### Travel Time Mode (API-Powered)
- Uses Google Distance Matrix API for real-world travel times
- Creates a 5×5 grid of candidate points within participant area
- Queries actual travel times for each transport mode:
  - 🚶 **Walking**: Pedestrian routes and timing
  - 🚇 **Transit**: Public transportation schedules and transfers
  - 🚗 **Driving**: Road routes accounting for traffic
  - 🚴 **Cycling**: Bike-friendly paths
- Uses minimax strategy: 70% weight on maximum travel time, 30% on average
- Ensures no participant has an excessively long journey
- Best for: Public transit users, large distances, traffic concerns

Both modes update automatically when participants join, leave, or change locations.

### Implemented Features

The current implementation includes:
- ✅ Interactive Google Maps interface with pin dropping
- ✅ Google Places Autocomplete for address search
- ✅ Two optimization modes: Distance and Travel Time
- ✅ Four transport modes: Walking, Transit, Driving, Cycling
- ✅ Participant initials displayed on map markers
- ✅ Add/remove participants with display names
- ✅ Venue search with filtering by type
- ✅ Shareable meetup links (no authentication required)
- ✅ Real-time center point recalculation
- ✅ Mobile-responsive design

### Future Enhancements

Potential features for future releases:
- User accounts and authentication
- Saved location profiles (home, office, etc.)
- Historical meetup data and analytics
- Weather integration at meeting point
- Accessibility information for venues
- Calendar integration
- Email/SMS notifications
- Native mobile apps
- Cost estimates for different transport modes

## Usage Example

1. **Create a Meetup**: Go to the homepage and create a new meetup with a name
2. **Share the Link**: Copy the link and share it with your group
3. **Add Participants** - Two ways:
   - **Method 1**: Click anywhere on the Google Map to drop a pin → popover form appears → enter name → submit
   - **Method 2**: Click "Add Participant" button → type address with autocomplete suggestions → select from dropdown → enter name → submit
4. **Choose Optimization Mode** (appears after 2+ participants):
   - Select **Distance** for fast geometric center
   - Select **Travel Time** to optimize by actual journey times
   - If using Travel Time, choose transport mode: 🚶 Walking, 🚇 Transit, 🚗 Driving, or 🚴 Cycling
5. **View Center Point**: The red marker shows the optimal meeting point, recalculated based on your selected mode
6. **Find Venues**: Search for cafes, restaurants, or other venues near the center point
7. **Select a Venue**: Click on markers to see participant names (initials shown) or venue details

## Development Notes

- The app uses **Google Maps JavaScript API** for the map interface (API key required)
- **Google Places Autocomplete** provides real-time address suggestions as you type
- **Reverse geocoding** automatically fetches addresses when clicking map pins
- In-memory storage means data is lost on server restart (suitable for MVP)
- Real-time updates use polling (5-second interval) - can be upgraded to WebSockets
- Temporary marker bounces on map when dropping a pin before adding participant details
- Map popover is positioned intelligently to stay within viewport bounds

## Contributing

This is an MVP implementation. Contributions are welcome for:
- Database integration (PostgreSQL/MongoDB)
- Real-time updates with WebSockets (currently uses polling)
- Cost estimates and route details for each transport mode
- Enhanced UI/UX and accessibility improvements
- User authentication and saved profiles
- Additional features from the PRD

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
