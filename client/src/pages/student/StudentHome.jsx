import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const StudentHome = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [followedEvents, setFollowedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all upcoming events (all clubs)
        const upcomingRes = await fetch('http://localhost:5000/api/events/upcoming', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const upcomingData = await upcomingRes.json();

        // Get followed clubs and their events
        const clubsRes = await fetch('http://localhost:5000/api/student/clubs/followed', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const clubsData = await clubsRes.json();

        // For followedEvents, show only the next upcoming event per club
        const today = new Date();
        const nextEvents = clubsData
          .map(club => {
            if (club.upcoming_events && club.upcoming_events.length > 0) {
              // Find the soonest upcoming event for this club
              const soonest = club.upcoming_events.reduce((min, e) =>
                new Date(e.date) < new Date(min.date) ? e : min
              );
              return { ...soonest, club_name: club.club_name, club_id: club.club_id };
            }
            return null;
          })
          .filter(Boolean);

        setUpcomingEvents(upcomingData.map(e => ({
          ...e,
          club_name: e.Club?.club_name || e.club_name,
          club_id: e.Club?.club_id || e.club_id
        })));
        setFollowedEvents(nextEvents);
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

  // Get club_ids of followed clubs
  const followedClubIds = new Set(followedEvents.map(e => e.club_id));
  // Filter upcomingEvents to only those not in followedClubIds
  const otherEvents = upcomingEvents.filter(e => !followedClubIds.has(e.club_id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening in your college clubs
        </p>
      </div>

      {/* Upcoming Events from Followed Clubs */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Events from Clubs You Follow
        </h2>
        {followedEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No upcoming events from followed clubs</p>
            <p className="text-sm text-gray-400 mt-2">
              Follow some clubs to see their events here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedEvents.map((event) => (
              <EventCard key={event.event_id} event={event} onViewDetails={setSelectedEvent} />
            ))}
          </div>
        )}
      </div>

      {/* Other Exciting Upcoming Events */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Other exciting upcoming events
        </h2>
        {otherEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No upcoming events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherEvents.map((event) => (
              <EventCard key={event.event_id} event={event} onViewDetails={setSelectedEvent} />
            ))}
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailsDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};


const EventCard = ({ event, onViewDetails }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex items-center justify-between">
    <span className="font-medium text-sm">{event.event_name}</span>
    <button
      className="ml-4 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors text-xs"
      onClick={() => onViewDetails(event)}
    >
      View Details
    </button>
  </div>
);

const EventDetailsDialog = ({ event, onClose }) => (
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
      <div className="mb-2">
        <span className="font-semibold">Club:</span> {event.club_name}
      </div>
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
    </div>
  </div>
);

export default StudentHome;