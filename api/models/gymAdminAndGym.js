const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const GymAdminAndGym = sequelize.define("GymAdminAndGym", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  gymAdminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true, // Ensure gymAdminId is an integer
    },
  },
  gymId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // This ensures a gym can only be linked to one gymAdmin
    validate: {
      isInt: true, // Ensure gymId is an integer
    },
  },
});

module.exports = GymAdminAndGym;
