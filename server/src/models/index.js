const { Sequelize } = require("sequelize");
const config =
  require("../config/config")[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const Student = require("./student")(sequelize);
const Club = require("./club")(sequelize);
const Event = require("./event")(sequelize);
const EventRegistration = require("./eventRegistration")(sequelize);
const ClubFollower = require("./clubFollower")(sequelize);

// Associations
Club.hasMany(Event, { foreignKey: "club_id" });
Event.belongsTo(Club, { foreignKey: "club_id" });

Student.belongsToMany(Event, {
  through: EventRegistration,
  foreignKey: "student_id",
  otherKey: "event_id",
});
Event.belongsToMany(Student, {
  through: EventRegistration,
  foreignKey: "event_id",
  otherKey: "student_id",
});

EventRegistration.belongsTo(Student, { foreignKey: "student_id" });
EventRegistration.belongsTo(Event, { foreignKey: "event_id" });

Student.belongsToMany(Club, {
  through: ClubFollower,
  foreignKey: "student_id",
  otherKey: "club_id",
});
Club.belongsToMany(Student, {
  through: ClubFollower,
  foreignKey: "club_id",
  otherKey: "student_id",
});

module.exports = {
  sequelize,
  Student,
  Club,
  Event,
  EventRegistration,
  ClubFollower,
};
