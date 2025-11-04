import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisteredEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/student/events/registered', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        setEvents(data);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user.token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Split events into upcoming and past
  const today = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) >= today);
  const pastEvents = events.filter(e => new Date(e.date) < today);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Registered Events</h1>
      <p className="text-gray-600 mt-2">Events you've registered for</p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
            <p className="text-gray-500">No upcoming registered events</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {upcomingEvents.map(event => (
              <EventRow key={event.event_id} event={event} onViewDetails={setSelectedEvent} />
            ))}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-2 mt-8">Past Events</h2>
        {pastEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No past registered events</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastEvents.map(event => (
              <EventRow key={event.event_id} event={event} onViewDetails={setSelectedEvent} />
            ))}
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          onClose={() => {
            setSelectedEvent(null);
            setCancelMessage("");
          }}
          onCancel={async (eventId) => {
            setCanceling(true);
            setCancelMessage("");
            try {
              const response = await fetch('http://localhost:5000/api/student/events/register', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ event_id: eventId })
              });
              const data = await response.json();
              if (response.ok) {
                setCancelMessage("Registration cancelled.");
                setEvents(prev => prev.filter(e => e.event_id !== eventId));
              } else {
                setCancelMessage(data.error || "Cancellation failed.");
              }
            } catch {
              setCancelMessage("Cancellation failed. Please try again.");
            } finally {
              setCanceling(false);
            }
          }}
          canceling={canceling}
          cancelMessage={cancelMessage}
          isUpcoming={upcomingEvents.some(e => e.event_id === selectedEvent.event_id)}
        />
      )}
    </div>
  );
};

const EventRow = ({ event, onViewDetails }) => (
  <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
    <span className="font-medium text-sm">{event.event_name}</span>
    <button
      className="ml-4 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors text-xs"
      onClick={() => onViewDetails(event)}
    >
      View Details
    </button>
  </div>
);

const EventDetailsDialog = ({ event, onClose, onCancel, canceling, cancelMessage, isUpcoming }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-2">{event.event_name}</h2>
      {event.Club && (
        <div className="mb-2">
          <span className="font-semibold">Club:</span> {event.Club.club_name}
        </div>
      )}
      <div className="mb-2">
        <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Time:</span> {event.time}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Venue:</span> {event.venue}
      </div>
      {event.motive && (
        <div className="mb-2">
          <span className="font-semibold">Motive:</span> {event.motive}
        </div>
      )}
      {isUpcoming && (
        <button
          className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:opacity-60"
          onClick={() => onCancel(event.event_id)}
          disabled={canceling}
        >
          {canceling ? 'Cancelling...' : 'Cancel Registration'}
        </button>
      )}
      {cancelMessage && (
        <div className="mt-2 text-center text-sm text-blue-600">{cancelMessage}</div>
      )}
    </div>
  </div>
);

export default RegisteredEvents;