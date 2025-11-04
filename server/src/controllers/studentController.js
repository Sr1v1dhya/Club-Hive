// Unregister from an event
exports.unregisterEvent = async (req, res) => {
  try {
    const { id: student_id } = req.user;
    const { event_id } = req.body;
    const registration = await EventRegistration.findOne({
      where: { student_id, event_id },
    });
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }
    await registration.destroy();
    res.json({ message: "Registration cancelled" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const {
  Club,
  Event,
  ClubFollower,
  EventRegistration,
  Student,
} = require("../models");
const { Op } = require("sequelize");

// Get all clubs
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.findAll();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Follow a club
exports.followClub = async (req, res) => {
  try {
    const { id: student_id } = req.user; // from auth middleware
    const { club_id } = req.body;
    console.log(req.body);
    await ClubFollower.findOrCreate({ where: { student_id, club_id } });
    res.json({ message: "Club followed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Unfollow a club
exports.unfollowClub = async (req, res) => {
  try {
    const { id: student_id } = req.user; // from auth middleware
    const { club_id } = req.body;
    const followRecord = await ClubFollower.findOne({
      where: { student_id, club_id },
    });
    if (!followRecord) {
      return res.status(404).json({ error: "Follow record not found" });
    }
    await followRecord.destroy();
    res.json({ message: "Club unfollowed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get followed clubs
exports.getFollowedClubs = async (req, res) => {
  try {
    const { id: student_id } = req.user;
    const clubs = await Club.findAll({
      include: [
        {
          model: Student,
          where: { student_id },
          through: { attributes: [] },
        },
        {
          model: Event,
          required: false,
        },
      ],
    });

    // For each club, split events into upcoming and past
    const today = new Date();
    const clubsWithEvents = clubs.map((club) => {
      const events = club.Events || [];
      const upcoming_events = events.filter(
        (event) => new Date(event.date) >= today
      );
      const past_events = events.filter(
        (event) => new Date(event.date) < today
      );
      return {
        club_id: club.club_id,
        club_name: club.club_name,
        description: club.description,
        upcoming_events,
        past_events,
      };
    });
    res.json(clubsWithEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register for an event
exports.registerEvent = async (req, res) => {
  try {
    const { id: student_id } = req.user;
    const { event_id } = req.body;
    await EventRegistration.findOrCreate({ where: { student_id, event_id } });
    res.json({ message: "Registered for event" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get registered events
exports.getRegisteredEvents = async (req, res) => {
  try {
    const { id: student_id } = req.user;
    const events = await Event.findAll({
      include: [
        {
          model: Student,
          where: { student_id },
          through: { attributes: [] },
        },
        {
          model: Club,
          attributes: ["club_id", "club_name"],
        },
      ],
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
