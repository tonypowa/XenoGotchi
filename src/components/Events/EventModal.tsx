import { useGameStore } from '@/stores/petStore';

export function EventModal() {
  const activeEvent = useGameStore((s) => s.activeEvent);
  const eventResultText = useGameStore((s) => s.eventResultText);
  const handleEventChoice = useGameStore((s) => s.handleEventChoice);
  const dismissEvent = useGameStore((s) => s.dismissEvent);

  if (!activeEvent) return null;

  const { event } = activeEvent;

  return (
    <div className="event-overlay">
      <div className="event-modal">
        <div className="event-header">
          <div className="event-alert">⚠ ALERT</div>
          <h2 className="event-title">{event.name}</h2>
        </div>
        <p className="event-description">{event.description}</p>

        {eventResultText ? (
          <div className="event-result">
            <p className="event-result-text">{eventResultText}</p>
            <button className="action-btn event-dismiss" onClick={dismissEvent}>
              Continue
            </button>
          </div>
        ) : (
          <div className="event-choices">
            {event.choices.map((choice, i) => (
              <button
                key={i}
                className="action-btn event-choice"
                onClick={() => handleEventChoice(i)}
              >
                {choice.label}
                {choice.statCheck && (
                  <span className="choice-check">
                    ({choice.statCheck.stat} ≥ {choice.statCheck.threshold})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
