const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Student = sequelize.define(
    "Student",
    {
      student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      year: {
        type: DataTypes.ENUM("1st", "2nd", "3rd", "4th"),
        allowNull: false,
      },
      class: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      section: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "students",
      timestamps: true,
    }
  );
  return Student;
};
