const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig"); // Assuming you have a database configuration file

const MembershipPlan = sequelize.define("MembershipPlan", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  gym_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  plan_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  plan_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration_type: {
    type: DataTypes.ENUM("days", "months", "years"),
    allowNull: false,
  },
  duration_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = MembershipPlan;