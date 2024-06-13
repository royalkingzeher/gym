const express = require("express");
const sequelize = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const gymRoutes = require("./routes/gymRoutes");
const gymAdminAndGymRoutes = require("./routes/gymAdminAndGymRoutes");
const gymMembershipPlanRoutes = require("./routes/gymMembershipPlanRoutes");
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
app.use("/api/gymAdminAndGym", gymAdminAndGymRoutes);
app.use("/api/gymMembershipPlans", gymMembershipPlanRoutes);

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
