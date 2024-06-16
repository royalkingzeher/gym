require("dotenv").config(); // Load environment variables
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assuming you have a User model

module.exports = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).send("Access denied. No token provided.");

  // Split the token from the 'Bearer ' prefix
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Access denied. Invalid token format.");

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database based on the decoded id
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).send("User not found.");

    // Attach the user information to the request object
    req.user = {
      id: user.id,
      username: user.username,
      type: user.type,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      country: user.country,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      profilePicture: user.profilePicture,
      emergencyContactName: user.emergencyContactName,
      emergencyContactRelationship: user.emergencyContactRelationship,
      emergencyContactPhone: user.emergencyContactPhone,
      emergencyContactEmail: user.emergencyContactEmail,
    };

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(400).send("Invalid token.");
  }
};
