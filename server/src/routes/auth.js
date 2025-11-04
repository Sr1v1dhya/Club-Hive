const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Student
router.post("/student/register", authController.registerStudent);
router.post("/student/login", authController.loginStudent);

// Club
router.post("/club/register", authController.registerClub);
router.post("/club/login", authController.loginClub);

module.exports = router;
