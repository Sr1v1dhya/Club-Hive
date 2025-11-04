import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const StudentHome = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [followedEvents, setFollowedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API calls
      const [upcomingRes, followedRes] = await Promise.all([
        fetch('http://localhost:5000/api/events/upcoming'),
        fetch('http://localhost:5000/api/events/followed', {
          headers: {
            'Authorization': `Bearer ${user.token}` // Assuming token-based auth
          }
        })
      ]);

      const upcomingData = await upcomingRes.json();
      const followedData = await followedRes.json();

      setUpcomingEvents(upcomingData);
      setFollowedEvents(followedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* All Upcoming Events */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          All Upcoming Events
        </h2>
        {upcomingEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No upcoming events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {event.event_name}
      </h3>
      <p className="text-gray-600 mb-2">
        <span className="font-medium">Club:</span> {event.club_name}
      </p>
      <p className="text-gray-600 mb-2">
        <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">
        <span className="font-medium">Time:</span> {event.time}
      </p>
      <p className="text-gray-600 mb-4">
        <span className="font-medium">Venue:</span> {event.venue}
      </p>
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
        View Details
      </button>
    </div>
  );
};

export default StudentHome;