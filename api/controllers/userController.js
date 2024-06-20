const { Op } = require("sequelize");
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
 *           description: The auto-generated ID of the user
 *           example: 1
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: johndoe
 *         type:
 *           type: string
 *           description: The type of user (admin, gym_admin, gym_member)
 *           example: gym_member
 *         email:
 *           type: string
 *           description: The email address of the user
 *           example: johndoe@example.com
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *           example: 1234567890
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *           example: John
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *           example: Doe
 *         address:
 *           type: string
 *           description: The address of the user
 *           example: 123 Main St
 *         city:
 *           type: string
 *           description: The city where the user resides
 *           example: Springfield
 *         state:
 *           type: string
 *           description: The state where the user resides
 *           example: IL
 *         pincode:
 *           type: string
 *           description: The pincode of the user's location
 *           example: 62704
 *         country:
 *           type: string
 *           description: The country where the user resides
 *           example: USA
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: The date of birth of the user
 *           example: 1990-01-01
 *         gender:
 *           type: string
 *           description: The gender of the user
 *           example: male
 *         profilePicture:
 *           type: string
 *           description: URL to the user's profile picture
 *           example: https://example.com/profile.jpg
 *         emergencyContactName:
 *           type: string
 *           description: The name of the user's emergency contact
 *           example: Jane Doe
 *         emergencyContactPhone:
 *           type: string
 *           description: The phone number of the user's emergency contact
 *           example: 9876543210
 *         emergencyContactRelation:
 *           type: string
 *           description: The relation of the user's emergency contact to the user
 *           example: Parent
 *         status:
 *           type: string
 *           description: The status of the user (active or inactive)
 *           example: active
 *     UserWithoutID:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: johndoe
 *         type:
 *           type: string
 *           description: The type of user (admin, gym_admin, gym_member)
 *           example: gym_member
 *         email:
 *           type: string
 *           description: The email address of the user
 *           example: johndoe@example.com
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *           example: 1234567890
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *           example: John
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *           example: Doe
 *         address:
 *           type: string
 *           description: The address of the user
 *           example: 123 Main St
 *         city:
 *           type: string
 *           description: The city where the user resides
 *           example: Springfield
 *         state:
 *           type: string
 *           description: The state where the user resides
 *           example: IL
 *         pincode:
 *           type: string
 *           description: The pincode of the user's location
 *           example: 62704
 *         country:
 *           type: string
 *           description: The country where the user resides
 *           example: USA
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: The date of birth of the user
 *           example: 1990-01-01
 *         gender:
 *           type: string
 *           description: The gender of the user
 *           example: male
 *         profilePicture:
 *           type: string
 *           description: URL to the user's profile picture
 *           example: https://example.com/profile.jpg
 *         emergencyContactName:
 *           type: string
 *           description: The name of the user's emergency contact
 *           example: Jane Doe
 *         emergencyContactPhone:
 *           type: string
 *           description: The phone number of the user's emergency contact
 *           example: 9876543210
 *         emergencyContactRelation:
 *           type: string
 *           description: The relation of the user's emergency contact to the user
 *           example: Parent
 *         status:
 *           type: string
 *           description: The status of the user (active or inactive)
 *           example: active
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get list of all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: The number of items to return per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, username, firstName, lastName, email, type, status]
 *           default: id
 *         description: The field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: The sort order (ascending or descending)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter users by username, firstName, lastName, or email
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized, only admin user can view users
 *       500:
 *         description: Internal server error
 */
exports.getAllUsers = async (req, res) => {
  const currentUser = req.user;

  if (currentUser.type !== "admin") {
    return res.status(401).send("Unauthorized, only admin user can view users");
  }

  // Extract query parameters and provide sensible defaults
  const {
    page = 1,
    limit = 10,
    sortBy = "id",
    order = "asc",
    search = "",
    ...filters
  } = req.query;

  // Convert page and limit to numbers and validate them
  const pageNumber = isNaN(parseInt(page, 10))
    ? 1
    : Math.max(1, parseInt(page, 10));
  const limitNumber = isNaN(parseInt(limit, 10))
    ? 10
    : Math.max(1, parseInt(limit, 10));
  const offset = (pageNumber - 1) * limitNumber;

  // Construct sorting condition
  const validColumns = [
    "id",
    "username",
    "firstName",
    "lastName",
    "email",
    "type",
    "status",
  ];
  const sanitizedSortBy = validColumns.includes(sortBy) ? sortBy : "id";
  const orderCondition = [
    [sanitizedSortBy, order.toLowerCase() === "desc" ? "desc" : "asc"],
  ];

  // Create filters condition
  const filterConditions = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value && validColumns.includes(key)) {
        acc[key] = { [Op.like]: `%${value}%` };
      }
      return acc;
    },
    {}
  );

  // Create search condition for specific columns (only if search is not empty)
  let searchCondition = {};
  if (search) {
    searchCondition = {
      [Op.or]: validColumns
        .filter((col) => col !== "password")
        .map((field) => ({
          [field]: { [Op.like]: `%${search}%` },
        })),
    };
  }

  try {
    const { rows: users, count } = await User.findAndCountAll({
      where: {
        ...filterConditions,
        ...searchCondition,
      },
      order: orderCondition,
      limit: limitNumber,
      offset,
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    // Remove sensitive data from each user object
    users.forEach((user) => {
      delete user.dataValues.password;
    });

    res.status(200).json({
      data: users,
      meta: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
      },
    });
  } catch (error) {
    console.error(`Error fetching users: ${error.message}`);
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: A single user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, user does not have permission
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.getUserById = async (req, res) => {
  const currentUser = req.user;
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the current user has permission to access this user's information
    if (currentUser.type !== "admin" && currentUser.id !== user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Remove sensitive data from the user object
    delete user.dataValues.password;

    res.status(200).json(user);
  } catch (error) {
    console.error(`Error fetching user: ${error.message}`);
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserWithoutID'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, validation failed
 *       401:
 *         description: Unauthorized, user does not have permission
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.updateUser = async (req, res) => {
  const currentUser = req.user;
  const userId = req.params.userId;
  const updatedUserData = req.body;

  try {
    let user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the current user has permission to update this user's information
    if (currentUser.type !== "admin" && currentUser.id !== user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update user data
    user.set(updatedUserData);
    await user.save();

    // Remove sensitive data from the user object
    delete user.dataValues.password;

    res.status(200).json(user);
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized, user does not have permission
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.deleteUser = async (req, res) => {
  const currentUser = req.user;
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (currentUser.type !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await user.destroy();

    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};