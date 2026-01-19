# Meet in the Middle

A web-based service that calculates the optimal meeting point for groups based on participant locations. Find the perfect place where everyone can gather with minimal travel time for all.

## Features

- **Interactive Map Interface**: Add participants by clicking on the map or entering addresses
- **Automatic Center Calculation**: Finds the geographic centroid that minimizes travel for everyone
- **Venue Discovery**: Search for cafes, restaurants, bars, parks, and other meeting spots near the center point
- **Shareable Links**: Create a meetup and share the link with your group - no sign-up required
- **Real-time Updates**: See the center point update automatically as participants join
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Leaflet.js** for interactive maps (using OpenStreetMap)
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **In-memory storage** (for MVP - easily upgradeable to PostgreSQL/MongoDB)
- **Mock geocoding & venue APIs** (configurable to use Google Maps APIs)

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

Create a `.env` file in the backend directory (see `backend/.env.example`):

```env
PORT=3001
NODE_ENV=development

# Optional: Add Google Maps API key for real geocoding and venue data
# GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Note**: The application works out of the box with mock data. To use real Google Maps APIs:
1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Geocoding API
   - Places API
3. Add the key to your `.env` file

## How It Works

### Geographic Centroid Calculation

The app calculates the meeting point using a simple geographic centroid algorithm:

1. Collects all participant coordinates (latitude/longitude)
2. Calculates the average latitude and longitude
3. Updates in real-time as participants join or update locations

This gives a fair meeting point that minimizes total travel distance for all participants.

### MVP Scope

The current implementation includes:
- ✅ Basic map interface with manual location pin placement
- ✅ Simple geographic centroid calculation (distance-based)
- ✅ Add/remove participants with display names
- ✅ Venue search with filtering by type
- ✅ Shareable meetup links
- ✅ Mobile-responsive design

### Future Enhancements

Potential features for future releases:
- User accounts and authentication
- Travel time optimization (accounting for traffic, public transit)
- Saved location profiles (home, office, etc.)
- Historical meetup data
- Weather integration
- Calendar integration
- Email/SMS notifications
- Native mobile apps

## Usage Example

1. **Create a Meetup**: Go to the homepage and create a new meetup with a name
2. **Share the Link**: Copy the link and share it with your group
3. **Add Participants**: Each person clicks on the map to add their location, or enters an address
4. **View Center Point**: The red marker shows the optimal meeting point (appears after 2+ participants)
5. **Find Venues**: Search for cafes, restaurants, or other venues near the center point
6. **Select a Venue**: Click on green venue markers to see details

## Development Notes

- The app uses OpenStreetMap tiles for the map (free, no API key required)
- In-memory storage means data is lost on server restart (suitable for MVP)
- Mock geocoding includes several major cities and can parse coordinate pairs
- Real-time updates use polling (5-second interval) - can be upgraded to WebSockets

## Contributing

This is an MVP implementation. Contributions are welcome for:
- Database integration (PostgreSQL/MongoDB)
- Real-time updates with WebSockets
- Google Maps API integration
- Enhanced UI/UX
- Additional features from the PRD

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
