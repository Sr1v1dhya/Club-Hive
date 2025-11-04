const { Event, EventRegistration, Student } = require("../models");

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const { id: club_id } = req.user;
    const { event_name, date, time, venue, motive } = req.body;

    // Check if an event already exists with the same date and time
    const existingEvent = await Event.findOne({
      where: { date, time },
    });
    if (existingEvent) {
      return res
        .status(409)
        .json({ error: "An event already exists at this date and time" });
    }

    const event = await Event.create({
      event_name,
      club_id,
      date,
      time,
      venue,
      motive,
    });
    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Edit event
exports.editEvent = async (req, res) => {
  try {
    const { id: club_id } = req.user;
    const { event_id } = req.params;
    const { event_name, date, time, venue, motive } = req.body;
    const event = await Event.findOne({ where: { event_id, club_id } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    await event.update({ event_name, date, time, venue, motive });
    res.json({ message: "Event updated", event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id: club_id } = req.user;
    const { event_id } = req.params;
    const event = await Event.findOne({ where: { event_id, club_id } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    await event.destroy();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// View student registrations for an event
exports.getEventRegistrations = async (req, res) => {
  try {
    const { id: club_id } = req.user;
    const { event_id } = req.params;
    const event = await Event.findOne({ where: { event_id, club_id } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    const registrations = await EventRegistration.findAll({
      where: { event_id },
      include: [
        {
          model: Student,
          attributes: [
            "student_id",
            "name",
            "email",
            "year",
            "class",
            "section",
          ],
        },
      ],
    });
    res.json(registrations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
