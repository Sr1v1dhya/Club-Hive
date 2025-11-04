const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Club = sequelize.define(
    "Club",
    {
      club_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      club_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      club_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "clubs",
      timestamps: true,
    }
  );
  return Club;
};
