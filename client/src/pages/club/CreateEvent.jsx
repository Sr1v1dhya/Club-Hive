
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const CreateEvent = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    event_name: '',
    date: '',
    time: '',
    venue: '',
    motive: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/club/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Event created successfully!');
        setForm({ event_name: '', date: '', time: '', venue: '', motive: '' });
      } else {
        setMessage(data.error || 'Failed to create event.');
      }
    } catch {
      setMessage('Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
      <p className="text-gray-600 mt-2">Create a new event for your club</p>
      <form className="mt-8 bg-white rounded-lg shadow p-6 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Event Name</label>
          <input
            type="text"
            name="event_name"
            value={form.event_name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Venue</label>
          <input
            type="text"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Motive / Description</label>
          <textarea
            name="motive"
            value={form.motive}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
        {message && (
          <div className="text-center text-sm mt-2 text-blue-700">{message}</div>
        )}
      </form>
    </div>
  );
};

export default CreateEvent;