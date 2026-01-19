import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../models/storage.js';
import { calculateCentroid } from '../services/centroid.js';
import type { Meetup } from '../models/types.js';

const router = Router();

// Create a new meetup
router.post('/', (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const meetup: Meetup = {
      id: uuidv4(),
      name,
      createdAt: new Date().toISOString(),
      optimizationMode: 'distance',
      transportMode: 'driving',
      centerPoint: { lat: 51.5074, lng: -0.1278 }, // Default to London
    };

    storage.createMeetup(meetup);

    res.status(201).json(meetup);
  } catch (error) {
    console.error('Error creating meetup:', error);
    res.status(500).json({ error: 'Failed to create meetup' });
  }
});

// Get a meetup by ID (includes participants)
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const meetup = storage.getMeetup(id);

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    const participants = storage.getParticipants(id);

    res.json({
      ...meetup,
      participants,
    });
  } catch (error) {
    console.error('Error fetching meetup:', error);
    res.status(500).json({ error: 'Failed to fetch meetup' });
  }
});

// Update a meetup
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, optimizationMode, transportMode } = req.body;

    const updates: Partial<Meetup> = {};
    if (name) updates.name = name;
    if (optimizationMode) updates.optimizationMode = optimizationMode;
    if (transportMode) updates.transportMode = transportMode;

    const updated = storage.updateMeetup(id, updates);

    if (!updated) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    const participants = storage.getParticipants(id);

    res.json({
      ...updated,
      participants,
    });
  } catch (error) {
    console.error('Error updating meetup:', error);
    res.status(500).json({ error: 'Failed to update meetup' });
  }
});

// Delete a meetup
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteMeetup(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting meetup:', error);
    res.status(500).json({ error: 'Failed to delete meetup' });
  }
});

// Recalculate center point for a meetup
function recalculateCenterPoint(meetupId: string): void {
  const participants = storage.getParticipants(meetupId);
  if (participants.length > 0) {
    const centerPoint = calculateCentroid(participants);
    storage.updateMeetup(meetupId, { centerPoint });
  }
}

export { router as meetupsRouter, recalculateCenterPoint };
