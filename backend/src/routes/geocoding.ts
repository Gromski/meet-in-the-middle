import { Router } from 'express';
import { geocodeAddress } from '../services/geocoding.js';

const router = Router();

// Geocode an address to coordinates
router.get('/', async (req, res) => {
  try {
    const { address } = req.query;

    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address is required' });
    }

    const coordinates = await geocodeAddress(address);
    res.json(coordinates);
  } catch (error) {
    console.error('Error geocoding address:', error);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

export { router as geocodingRouter };
