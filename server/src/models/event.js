const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Event = sequelize.define(
    "Event",
    {
      event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      event_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      club_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      venue: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      motive: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "events",
      timestamps: true,
    }
  );
  return Event;
};
