import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MyClubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubsRes, regRes] = await Promise.all([
          fetch('http://localhost:5000/api/student/clubs/followed', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5000/api/student/events/registered', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);
        const clubsData = await clubsRes.json();
        const regData = await regRes.json();
        setClubs(clubsData);
        setRegisteredEvents(regData.map(e => e.event_id));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Clubs</h1>
        <p className="text-gray-600 mt-2">
          Clubs you're following and their events
        </p>
      </div>

      {clubs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">You're not following any clubs yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Browse clubs to find ones that interest you!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club.club_id} club={club} onViewDetails={setSelectedEvent} />
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          clubName={selectedEvent.club_name}
          isRegistered={registeredEvents.includes(selectedEvent.event_id)}
          onClose={() => {
            setSelectedEvent(null);
            setRegisterMessage("");
          }}
          onRegister={async (eventId) => {
            setRegistering(true);
            setRegisterMessage("");
            try {
              const response = await fetch('http://localhost:5000/api/student/events/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ event_id: eventId })
              });
              const data = await response.json();
              if (response.ok) {
                setRegisterMessage("Successfully registered for event!");
                setRegisteredEvents(prev => [...prev, eventId]);
              } else {
                setRegisterMessage(data.error || "Registration failed.");
              }
            } catch {
              setRegisterMessage("Registration failed. Please try again.");
            } finally {
              setRegistering(false);
            }
          }}
          registering={registering}
          registerMessage={registerMessage}
        />
      )}
    </div>
  );
};


const ClubCard = ({ club, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {club.club_name}
      </h3>
      <p className="text-gray-600 mb-4">
        {club.description || 'No description available'}
      </p>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Upcoming Events:</h4>
        {club.upcoming_events && club.upcoming_events.length > 0 ? (
          <div className="space-y-2">
            {club.upcoming_events.map((event) => (
              <EventRow key={event.event_id} event={event} onViewDetails={onViewDetails} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No upcoming events</p>
        )}

        <h4 className="font-medium text-gray-900 mt-4">Past Events:</h4>
        {club.past_events && club.past_events.length > 0 ? (
          <div className="space-y-2">
            {club.past_events.map((event) => (
              <EventRow key={event.event_id} event={event} onViewDetails={onViewDetails} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No past events</p>
        )}
      </div>
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

const EventDetailsDialog = ({ event, clubName, isRegistered, onClose, onRegister, registering, registerMessage }) => (
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
      {clubName && (
        <div className="mb-2">
          <span className="font-semibold">Club:</span> {clubName}
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
      {isRegistered ? (
        <div className="mt-4 w-full text-center text-green-700 font-semibold">Registered</div>
      ) : (
        <button
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-60"
          onClick={() => onRegister(event.event_id)}
          disabled={registering}
        >
          {registering ? 'Registering...' : 'Register for Event'}
        </button>
      )}
      {registerMessage && (
        <div className="mt-2 text-center text-sm text-blue-600">{registerMessage}</div>
      )}
    </div>
  </div>
);

export default MyClubs;