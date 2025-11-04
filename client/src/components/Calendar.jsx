import { useState } from 'react';

const Calendar = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    return events.filter(event => new Date(event.date).toDateString() === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          ‹
        </button>
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth(currentDate).map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isToday = day === new Date().getDate() &&
                         currentDate.getMonth() === new Date().getMonth() &&
                         currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={index}
              className={`min-h-[80px] p-2 border border-gray-200 hover:bg-gray-50 cursor-pointer ${
                isToday ? 'bg-blue-50 border-blue-300' : ''
              }`}
              onClick={() => day && setSelectedDate(day)}
            >
              <div className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                {day}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate"
                    title={event.event_name}
                  >
                    {event.event_name}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">
            Events on {monthNames[currentDate.getMonth()]} {selectedDate}
          </h3>
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500 text-sm">No events scheduled</p>
          ) : (
            <div className="space-y-2">
              {getEventsForDate(selectedDate).map((event) => (
                <div key={event.event_id} className="bg-white p-3 rounded border">
                  <h4 className="font-medium">{event.event_name}</h4>
                  <p className="text-sm text-gray-600">
                    {event.time} at {event.venue}
                  </p>
                  <p className="text-sm text-gray-600">
                    Organized by {event.club_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;