const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ClubFollower = sequelize.define(
    "ClubFollower",
    {
      student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      club_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      tableName: "club_followers",
      timestamps: true,
    }
  );
  return ClubFollower;
};
