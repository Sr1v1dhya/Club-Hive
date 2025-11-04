import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MyClubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:5000/api/student/clubs/followed', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      setClubs(data);
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
        <h1 className="text-3xl font-bold text-gray-900">My Clubs</h1>
        <p className="text-gray-600 mt-2">
          Clubs you're following and their upcoming events
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
            <ClubCard key={club.club_id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
};

const ClubCard = ({ club }) => {
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
            {club.upcoming_events.slice(0, 2).map((event) => (
              <div key={event.event_id} className="bg-gray-50 p-3 rounded">
                <p className="font-medium text-sm">{event.event_name}</p>
                <p className="text-xs text-gray-600">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No upcoming events</p>
        )}

        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default MyClubs;