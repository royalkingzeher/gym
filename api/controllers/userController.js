const User = require("../models/user");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         type:
 *           type: string
 *           enum: [admin, gym_admin, gym_member]
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         pincode:
 *           type: string
 *         country:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         profilePicture:
 *           type: string
 *         emergencyContactName:
 *           type: string
 *         emergencyContactPhone:
 *           type: string
 *         emergencyContactRelation:
 *           type: string
 */

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Numeric ID of the user to get
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, only admin user can fetch the user details
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  // Validate user ID
  if (!userId || isNaN(userId)) {
    return res.status(400).json({
      error: "Validation error",
      details: ["User ID must be a valid number"],
    });
  }

  // Ensure only admin can fetch user details
  if (req.user.type !== "admin") {
    return res
      .status(401)
      .send("Unauthorized, only admin user can fetch the user details");
  }

  try {
    // Fetch the user from the database by ID
    const user = await User.findByPk(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found.");
    }

    user.password = undefined; // Remove password from the response

    // Send the user details in the response
    res.status(200).json(user);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user by ID:", error);
    res.status(500).send("Internal server error.");
  }
};
