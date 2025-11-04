import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EventDetails = ({ event, onClose, onRegister }) => {
  const { user, isStudent } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!password) {
      setError('Please enter your password to confirm registration');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`http://localhost:5000/api/events/${event.event_id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        onRegister && onRegister();
        onClose && onClose();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{event.event_name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Club</h3>
              <p className="text-gray-600">{event.club_name}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Date & Time</h3>
              <p className="text-gray-600">
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Venue</h3>
              <p className="text-gray-600">{event.venue}</p>
            </div>

            {event.motive && (
              <div>
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600">{event.motive}</p>
              </div>
            )}

            {isStudent && (
              <div className="border-t pt-4 mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Register for Event</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Enter your password to confirm registration
                </p>

                <div className="space-y-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={handleRegister}
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Registering...' : 'Register'}
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;