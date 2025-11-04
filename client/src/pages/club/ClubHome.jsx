import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ClubHome = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      
      const response = await fetch('http://localhost:5000/api/club/events', {
        headers: {
          'Authorization': `Bearer ${user.token}` 
        }
      });
      const data = await response.json();
      setUpcomingEvents(data);
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
          Welcome back, {user.club_name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your club events and view registrations
        </p>
      </div>

      {/* Club Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Club Information</h2>
        <div className="flex justify-start gap-4">
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Club Name:</span> {user.club_name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {user.club_email}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Description:</span> {user.description || 'No description provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Your Upcoming Events
        </h2>
        {upcomingEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No upcoming events</p>
            <p className="text-sm text-gray-400 mt-2">
              Create your first event to get started!
            </p>
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
        <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">
        <span className="font-medium">Time:</span> {event.time}
      </p>
      <p className="text-gray-600 mb-4">
        <span className="font-medium">Venue:</span> {event.venue}
      </p>

    </div>
  );
};

export default ClubHome;