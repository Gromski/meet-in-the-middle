import { Router } from 'express';
import { storage } from '../models/storage.js';
import { searchVenues } from '../services/venues.js';

const router = Router();

// Search for venues near a meetup's center point
router.get('/:meetupId/venues', async (req, res) => {
  try {
    const { meetupId } = req.params;
    const { type = 'cafe', radius = '1000' } = req.query;

    // Validate meetup exists
    const meetup = storage.getMeetup(meetupId);
    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    const venues = await searchVenues(
      meetup.centerPoint,
      type as string,
      parseInt(radius as string, 10)
    );

    res.json(venues);
  } catch (error) {
    console.error('Error searching venues:', error);
    res.status(500).json({ error: 'Failed to search venues' });
  }
});

export { router as venuesRouter };
