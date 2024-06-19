const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig"); // Your database configuration

const MembersMembership = sequelize.define(
  "MembersMembership",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gym_member_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
      allowNull: false,
    },
    membership_plan_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "MembershipPlan",
        key: "id",
      },
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "MembersMemberships",
    timestamps: true,
  }
);

module.exports = MembersMembership;