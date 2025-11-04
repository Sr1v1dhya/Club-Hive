const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EventRegistration = sequelize.define(
    "EventRegistration",
    {
      student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      registration_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "event_registrations",
      timestamps: true,
    }
  );
  return EventRegistration;
};
