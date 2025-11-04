const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");
const auth = require("../middleware/auth");

router.post("/events", auth("club"), clubController.createEvent);
router.get("/events", auth("club"), clubController.getClubEvents);
router.put("/events/:event_id", auth("club"), clubController.editEvent);
router.delete("/events/:event_id", auth("club"), clubController.deleteEvent);
router.get(
  "/events/:event_id/registrations",
  auth("club"),
  clubController.getEventRegistrations
);

module.exports = router;
