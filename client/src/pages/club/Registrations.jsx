
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Registrations = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventsAndRegistrations = async () => {
      setLoading(true);
      setError('');
      try {
        // Get all events for this club
        const eventsRes = await fetch('http://localhost:5000/api/club/events', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const eventsData = await eventsRes.json();
        // For each event, get registrations
        const registrationsList = await Promise.all(
          eventsData.map(async (event) => {
            const regRes = await fetch(`http://localhost:5000/api/club/events/${event.event_id}/registrations`, {
              headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const regData = await regRes.json();
            return { ...event, registrations: regData };
          })
        );
        setEvents(registrationsList);
      } catch (err) {
        setError('Failed to load registrations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventsAndRegistrations();
  }, [user.token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Event Registrations</h1>
      <p className="text-gray-600 mt-2">View students registered for your events</p>
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {events.length === 0 ? (
          <div className="text-gray-500 text-center">No events found.</div>
        ) : (
          <div className="space-y-6">
            {events.map(event => (
              <div key={event.event_id} className="border-b pb-4">
                <div className="font-semibold text-lg text-gray-900 mb-2">{event.event_name}</div>
                {event.registrations.length === 0 ? (
                  <div className="text-gray-500 text-sm ml-2">No students registered.</div>
                ) : (
                  <div className="space-y-1 ml-2">
                    {event.registrations.map(reg => (
                      <div key={reg.Student.student_id} className="flex items-center space-x-4 text-sm">
                        <span className="font-medium">{reg.Student.name}</span>
                        <span className="text-gray-600">Class: {reg.Student.class}</span>
                        <span className="text-gray-600">Year: {reg.Student.year}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Registrations;