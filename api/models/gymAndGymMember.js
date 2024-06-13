const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const GymAndGymMember = sequelize.define("GymAndGymMember", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  gymId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true, // Ensure gymId is an integer
    },
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true, // Ensure memberId is an integer
    },
  },
});

module.exports = GymAndGymMember;
