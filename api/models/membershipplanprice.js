const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

// Define the MembershipPlansPrices model
const MembershipPlansPrices = sequelize.define(
  "MembershipPlansPrices",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    membership_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    validity_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    validity_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "MembershipPlansPrices",
    timestamps: true,
  }
);

// Attempt to synchronize the model with the database
(async () => {
  try {
    await MembershipPlansPrices.sync();
    console.log("MembershipPlansPrices model synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing MembershipPlansPrices model:", error);
  }
})();

module.exports = MembershipPlansPrices;