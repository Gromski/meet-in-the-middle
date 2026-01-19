import express from 'express';
import cors from 'cors';
import { meetupsRouter } from './routes/meetups.js';
import { participantsRouter } from './routes/participants.js';
import { venuesRouter } from './routes/venues.js';
import { geocodingRouter } from './routes/geocoding.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/meetups', meetupsRouter);
app.use('/api/meetups', participantsRouter);
app.use('/api/meetups', venuesRouter);
app.use('/api/geocode', geocodingRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🗺️  API base: http://localhost:${PORT}/api\n`);
});
