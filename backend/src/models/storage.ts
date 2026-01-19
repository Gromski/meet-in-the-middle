import type { Meetup, Participant } from './types.js';

// In-memory storage (for MVP - replace with database later)
class Storage {
  private meetups: Map<string, Meetup> = new Map();
  private participants: Map<string, Participant[]> = new Map();

  // Meetup operations
  createMeetup(meetup: Meetup): Meetup {
    this.meetups.set(meetup.id, meetup);
    this.participants.set(meetup.id, []);
    return meetup;
  }

  getMeetup(id: string): Meetup | undefined {
    return this.meetups.get(id);
  }

  updateMeetup(id: string, updates: Partial<Meetup>): Meetup | undefined {
    const meetup = this.meetups.get(id);
    if (!meetup) return undefined;

    const updated = { ...meetup, ...updates };
    this.meetups.set(id, updated);
    return updated;
  }

  deleteMeetup(id: string): boolean {
    this.participants.delete(id);
    return this.meetups.delete(id);
  }

  // Participant operations
  addParticipant(meetupId: string, participant: Participant): Participant {
    const participants = this.participants.get(meetupId) || [];
    participants.push(participant);
    this.participants.set(meetupId, participants);
    return participant;
  }

  getParticipants(meetupId: string): Participant[] {
    return this.participants.get(meetupId) || [];
  }

  updateParticipant(meetupId: string, participantId: string, updates: Partial<Participant>): Participant | undefined {
    const participants = this.participants.get(meetupId);
    if (!participants) return undefined;

    const index = participants.findIndex(p => p.id === participantId);
    if (index === -1) return undefined;

    const updated = { ...participants[index], ...updates };
    participants[index] = updated;
    return updated;
  }

  removeParticipant(meetupId: string, participantId: string): boolean {
    const participants = this.participants.get(meetupId);
    if (!participants) return false;

    const index = participants.findIndex(p => p.id === participantId);
    if (index === -1) return false;

    participants.splice(index, 1);
    return true;
  }
}

export const storage = new Storage();
