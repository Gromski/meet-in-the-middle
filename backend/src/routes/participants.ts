import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../models/storage.js';
import { recalculateCenterPoint } from './meetups.js';
import type { Participant } from '../models/types.js';

const router = Router();

// Add a participant to a meetup
router.post('/:meetupId/participants', async (req, res) => {
  try {
    const { meetupId } = req.params;
    const { displayName, location } = req.body;

    // Validate meetup exists
    const meetup = storage.getMeetup(meetupId);
    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    // Validate input
    if (!displayName || typeof displayName !== 'string') {
      return res.status(400).json({ error: 'Display name is required' });
    }

    if (!location || !location.coordinates || !location.coordinates.lat || !location.coordinates.lng) {
      return res.status(400).json({ error: 'Valid location with coordinates is required' });
    }

    const participant: Participant = {
      id: uuidv4(),
      meetupId,
      displayName,
      location,
      locationType: 'custom',
      joinedAt: new Date().toISOString(),
    };

    storage.addParticipant(meetupId, participant);

    // Recalculate center point
    await recalculateCenterPoint(meetupId);

    res.status(201).json(participant);
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ error: 'Failed to add participant' });
  }
});

// Get all participants for a meetup
router.get('/:meetupId/participants', (req, res) => {
  try {
    const { meetupId } = req.params;

    // Validate meetup exists
    const meetup = storage.getMeetup(meetupId);
    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    const participants = storage.getParticipants(meetupId);
    res.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// Update a participant's location
router.put('/:meetupId/participants/:participantId', async (req, res) => {
  try {
    const { meetupId, participantId } = req.params;
    const { location } = req.body;

    // Validate meetup exists
    const meetup = storage.getMeetup(meetupId);
    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    // Validate input
    if (!location || !location.coordinates) {
      return res.status(400).json({ error: 'Valid location is required' });
    }

    const updated = storage.updateParticipant(meetupId, participantId, { location });

    if (!updated) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    // Recalculate center point
    await recalculateCenterPoint(meetupId);

    res.json(updated);
  } catch (error) {
    console.error('Error updating participant:', error);
    res.status(500).json({ error: 'Failed to update participant' });
  }
});

// Remove a participant from a meetup
router.delete('/:meetupId/participants/:participantId', async (req, res) => {
  try {
    const { meetupId, participantId } = req.params;

    // Validate meetup exists
    const meetup = storage.getMeetup(meetupId);
    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    const removed = storage.removeParticipant(meetupId, participantId);

    if (!removed) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    // Recalculate center point
    await recalculateCenterPoint(meetupId);

    res.status(204).send();
  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(500).json({ error: 'Failed to remove participant' });
  }
});

export { router as participantsRouter };
