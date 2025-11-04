const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/student", require("./routes/student"));
app.use("/api/club", require("./routes/club"));
app.use("/api/events", require("./routes/event"));

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;
