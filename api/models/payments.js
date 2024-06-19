const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig"); // Your database configuration

const Payments = sequelize.define(
  "Payments",
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
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_type: {
      type: DataTypes.ENUM("calculated_fee", "discounted_fee", "topup"),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calculation_breakup: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
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
    tableName: "Payments",
    timestamps: true,
  }
);

module.exports = Payments;