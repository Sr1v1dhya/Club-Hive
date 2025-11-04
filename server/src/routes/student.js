const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const auth = require("../middleware/auth");

router.get("/clubs", auth("student"), studentController.getAllClubs);
router.post("/clubs/follow", auth("student"), studentController.followClub);
router.delete("/clubs/follow", auth("student"), studentController.unfollowClub);
router.get(
  "/clubs/followed",
  auth("student"),
  studentController.getFollowedClubs
);
router.post(
  "/events/register",
  auth("student"),
  studentController.registerEvent
);
router.get(
  "/events/registered",
  auth("student"),
  studentController.getRegisteredEvents
);

module.exports = router;
