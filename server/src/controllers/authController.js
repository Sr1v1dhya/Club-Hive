const { Student, Club } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Student Registration
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, year, class: className, section, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name,
      email,
      year,
      class: className,
      section,
      password: hash,
    });
    res.status(201).json({ message: "Student registered", student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Student Login
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ where: { email } });
    if (!student) return res.status(404).json({ error: "Student not found" });
    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: student.student_id, role: "student" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Club Registration
exports.registerClub = async (req, res) => {
  try {
    const { club_name, description, club_email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const club = await Club.create({
      club_name,
      description,
      club_email,
      password: hash,
    });
    res.status(201).json({ message: "Club registered", club });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Club Login
exports.loginClub = async (req, res) => {
  try {
    const { club_email, password } = req.body;
    const club = await Club.findOne({ where: { club_email } });
    if (!club) return res.status(404).json({ error: "Club not found" });
    const match = await bcrypt.compare(password, club.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: club.club_id, role: "club" }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, club });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
