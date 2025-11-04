const { Event, Club } = require("../models");
const { Op } = require("sequelize");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: Club, attributes: ["club_id", "club_name"] }],
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    const events = await Event.findAll({
      where: { date: { [Op.gte]: today } },
      include: [{ model: Club, attributes: ["club_id", "club_name"] }],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get calendar data (all events, grouped by date)
exports.getCalendar = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: Club, attributes: ["club_id", "club_name"] }],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });
    // Group by date
    const calendar = events.reduce((acc, event) => {
      const date = event.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    }, {});
    res.json(calendar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
