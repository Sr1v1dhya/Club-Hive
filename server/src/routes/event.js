const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/all", eventController.getAllEvents);
router.get("/upcoming", eventController.getUpcomingEvents);
router.get("/calendar", eventController.getCalendar);

module.exports = router;
