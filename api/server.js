const express = require("express");
const sequelize = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const gymRoutes = require("./routes/gymRoutes");
const gymAndGymAdminRoutes = require("./routes/gymAndGymAdminRoutes");
const gymAndGymMemberRoutes = require("./routes/gymAndGymMemberRoutes");
const gymMembershipPlanRoutes = require("./routes/gymMembershipPlanRoutes");
const membershipPlansPriceRoutes = require("./routes/membershipPlansPriceRoutes");
const membersMembershipRoutes = require("./routes/membersMembershipRoutes");
const paymentsRoutes = require("./routes/paymentsRoutes");
const swaggerConfig = require("./config/swaggerConfig");
require("dotenv").config();

const app = express();

// Allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gym", gymRoutes);
app.use("/api/gymAndGymAdmin", gymAndGymAdminRoutes);
app.use("/api/gymAndGymMember", gymAndGymMemberRoutes);
app.use("/api/gymMembershipPlans", gymMembershipPlanRoutes);
app.use("/api/membershipPlansPrices", membershipPlansPriceRoutes);
app.use("/api/membersMemberships", membersMembershipRoutes);
app.use("/api/payments", paymentsRoutes);

app.get("/", (req, res) => {
  // res.send("Welcome to Gym Management API 1.0");
  //redirect to docs
  res.redirect("/api-docs");
});

// Swagger configuration
swaggerConfig(app);

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");

    // Sync database models with Sequelize
    sequelize.sync().then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
