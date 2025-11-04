
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ManageEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEvent, setEditEvent] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/club/events', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        setEvents(data);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user.token]);

  const handleDelete = async (event_id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setEditLoading(true);
    setMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/club/events/${event_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setEvents(events => events.filter(e => e.event_id !== event_id));
        setMessage('Event deleted successfully.');
      } else {
        setMessage(data.error || 'Failed to delete event.');
      }
    } catch {
      setMessage('Failed to delete event.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditEvent(event.event_id);
    setEditForm({
      event_name: event.event_name,
      date: event.date,
      time: event.time,
      venue: event.venue,
      motive: event.motive || '',
    });
    setMessage('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/club/events/${editEvent}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (res.ok) {
        setEvents(events => events.map(e => e.event_id === editEvent ? { ...e, ...editForm } : e));
        setMessage('Event updated successfully.');
        setEditEvent(null);
        setEditForm(null);
      } else {
        setMessage(data.error || 'Failed to update event.');
      }
    } catch {
      setMessage('Failed to update event.');
    } finally {
      setEditLoading(false);
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
      <p className="text-gray-600 mt-2">Edit and delete your club's events</p>
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        {message && <div className="mb-4 text-center text-blue-700">{message}</div>}
        {events.length === 0 ? (
          <div className="text-gray-500 text-center">No events found.</div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              editEvent === event.event_id ? (
                <form key={event.event_id} className="space-y-3 bg-gray-50 p-4 rounded" onSubmit={handleEditSubmit}>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Event Name</label>
                    <input type="text" name="event_name" value={editForm.event_name} onChange={handleEditChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Date</label>
                    <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Time</label>
                    <input type="time" name="time" value={editForm.time} onChange={handleEditChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Venue</label>
                    <input type="text" name="venue" value={editForm.venue} onChange={handleEditChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Motive / Description</label>
                    <textarea name="motive" value={editForm.motive} onChange={handleEditChange} rows={2} className="w-full border border-gray-300 rounded px-3 py-2" />
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-60" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
                    <button type="button" className="flex-1 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors" onClick={() => { setEditEvent(null); setEditForm(null); }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <EventRow key={event.event_id} event={event} onEdit={() => handleEdit(event)} onDelete={() => handleDelete(event.event_id)} loading={editLoading} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EventRow = ({ event, onEdit, onDelete, loading }) => (
  <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
    <span className="font-medium text-sm">{event.event_name}</span>
    <div className="flex space-x-2">
      <button
        className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 text-xs"
        onClick={onEdit}
        disabled={loading}
      >
        Edit
      </button>
      <button
        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 text-xs"
        onClick={onDelete}
        disabled={loading}
      >
        Delete
      </button>
    </div>
  </div>
);

export default ManageEvents;