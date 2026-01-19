import type { Participant } from '../types';
import './ParticipantList.css';

interface ParticipantListProps {
  participants: Participant[];
  onRemove: (participantId: string) => void;
}

function ParticipantList({ participants, onRemove }: ParticipantListProps) {
  if (participants.length === 0) {
    return (
      <div className="participant-list empty">
        <p>No participants yet. Add someone to get started!</p>
      </div>
    );
  }

  return (
    <div className="participant-list">
      <h2>Participants ({participants.length})</h2>
      <div className="participants">
        {participants.map((participant) => (
          <div key={participant.id} className="participant-item">
            <div className="participant-info">
              <div className="participant-name">{participant.displayName}</div>
              <div className="participant-location">
                {participant.location.address || 'Custom location'}
              </div>
            </div>
            <button
              onClick={() => onRemove(participant.id)}
              className="danger remove-btn"
              title="Remove participant"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParticipantList;
