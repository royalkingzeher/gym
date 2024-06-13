const { Op } = require("sequelize");
const GymAdminAndGym = require("../models/gymAdminAndGym");
const User = require("../models/user");
const Gyms = require("../models/gym");

/**
 * @swagger
 * components:
 *   schemas:
 *     GymAdminAndGym:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         gymAdminId:
 *           type: integer
 *         gymId:
 *           type: integer
 *         gymAdmin:
 *           type: string
 *           description: Username of the gym admin
 *         gym:
 *           type: string
 *           description: Name of the gym
 */

/**
 * @swagger
 * /api/gymAdminAndGym:
 *   post:
 *     summary: Create a relationship between gym and gymAdmin
 *     tags: [GymAdminAndGyms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gymAdminId:
 *                 type: integer
 *                 description: ID of the gymAdmin
 *               gymId:
 *                 type: integer
 *                 description: ID of the gym
 *     responses:
 *       200:
 *         description: Relationship created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GymAdminAndGym'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized, only admin user can create the relationship
 *       500:
 *         description: Internal server error
 */
exports.createGymAdminAndGym = async (req, res) => {
  const currentUser = req.user;

  // Check if the current user is an admin
  if (currentUser.type !== "admin") {
    return res
      .status(401)
      .json({
        error: "Unauthorized, only admin user can create the relationship",
      });
  }

  const { gymAdminId, gymId } = req.body;

  // Check for required fields
  if (!gymAdminId || !gymId) {
    return res.status(400).json({
      error: "Validation error",
      details: ["gymAdminId and gymId are required"],
    });
  }

  try {
    // Ensure the gymAdminId refers to a user of type gym_admin and the gymId exists
    const [gymAdmin, gym] = await Promise.all([
      User.findOne({ where: { id: gymAdminId, type: "gym_admin" } }),
      Gym.findByPk(gymId),
    ]);

    const errors = [];
    if (!gymAdmin) {
      errors.push("The gymAdminId must refer to a user of type 'gym_admin'");
    }
    if (!gym) {
      errors.push("The gymId must refer to an existing gym");
    }
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation error",
        details: errors,
      });
    }

    // Validate if the relationship already exists
    const existingRelationship = await GymAdminAndGym.findOne({
      where: { [Op.and]: [{ gymAdminId }, { gymId }] },
    });
    if (existingRelationship) {
      return res.status(400).json({
        error: "Validation error",
        details: ["The relationship already exists"],
      });
    }

    const relationship = await GymAdminAndGym.create({ gymAdminId, gymId });

    // Create a response object including gymAdmin username and gym name
    const response = {
      ...relationship.get({ plain: true }),
      gymAdmin: gymAdmin.username,
      gym: gym.name,
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};

/**
 * @swagger
 * /api/gymAdminAndGym:
 *   get:
 *     summary: Get all gymAdminAndGym relationships
 *     tags: [GymAdminAndGyms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: GymAdminAndGym relationships retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GymAdminAndGym'
 *       401:
 *         description: Unauthorized, only admin user can fetch the relationships
 *       500:
 *         description: Internal server error
 */
exports.getAllGymAdminAndGyms = async (req, res) => {
  const currentUser = req.user;

  // Check if the current user is an admin
  if (currentUser.type !== "admin") {
    return res
      .status(401)
      .json({
        error: "Unauthorized, only admin user can fetch the relationships",
      });
  }

  try {
    const relationships = await GymAdminAndGym.findAll();
    // Create a response object including gymAdmin and gym details
    const response = await Promise.all(
      relationships.map(async (relationship) => {
        const gymAdmin = await User.findByPk(relationship.gymAdminId);
        const gym = await Gyms.findByPk(relationship.gymId);

        return {
          ...relationship.get({ plain: true }),
          gymAdmin: gymAdmin.username,
          gym: gym.name,
        };
      })
    );
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};

/**
 * @swagger
 * /api/gymAdminAndGym/gymAdmins/{gymId}:
 *   get:
 *     summary: Get the gymAdmins of a gym
 *     tags: [GymAdminAndGyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gymId
 *         required: true
 *         description: ID of the gym
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: GymAdmins retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   gymAdminId:
 *                     type: integer
 *                   gymAdmin:
 *                     type: string
 *                     description: Username of the gymAdmin
 *       401:
 *         description: Unauthorized, only admin user can fetch the gymAdmins
 *       404:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */
exports.getGymAdminsOfGym = async (req, res) => {
  const currentUser = req.user;

  // Check if the current user is an admin
  if (currentUser.type !== "admin") {
    return res
      .status(401)
      .json({ error: "Unauthorized, only admin user can fetch the gymAdmins" });
  }

  const { gymId } = req.params;

  if (!gymId) {
    return res.status(400).json({
      error: "Validation error",
      details: ["gymId is required"],
    });
  }

  try {
    const relationships = await GymAdminAndGym.findAll({ where: { gymId } });
    if (relationships.length === 0) {
      return res.status(404).json({ error: "Gym not found" });
    }

    const gymAdmins = await Promise.all(
      relationships.map(async (relationship) => {
        const gymAdmin = await User.findByPk(relationship.gymAdminId);
        return { gymAdminId: gymAdmin.id, gymAdmin: gymAdmin.username };
      })
    );

    res.status(200).send(gymAdmins);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};

/**
 * @swagger
 * /api/gymAdminAndGym/gyms/{gymAdminId}:
 *   get:
 *     summary: Get the gyms of a gymAdmin
 *     tags: [GymAdminAndGyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gymAdminId
 *         required: true
 *         description: ID of the gymAdmin
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gyms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   gymId:
 *                     type: integer
 *                   gym:
 *                     type: string
 *                     description: Name of the gym
 *       401:
 *         description: Unauthorized, only admin user can fetch the gyms
 *       404:
 *         description: GymAdmin not found
 *       500:
 *         description: Internal server error
 */
exports.getGymsOfGymAdmin = async (req, res) => {
  const currentUser = req.user;

  // Check if the current user is an admin
  if (currentUser.type !== "admin") {
    return res
      .status(401)
      .json({ error: "Unauthorized, only admin user can fetch the gyms" });
  }

  const { gymAdminId } = req.params;

  if (!gymAdminId) {
    return res.status(400).json({
      error: "Validation error",
      details: ["gymAdminId is required"],
    });
  }

  try {
    const relationships = await GymAdminAndGym.findAll({
      where: { gymAdminId },
    });
    if (relationships.length === 0) {
      return res.status(404).json({ error: "GymAdmin not found" });
    }

    const gyms = await Promise.all(
      relationships.map(async (relationship) => {
        const gym = await Gyms.findByPk(relationship.gymId);
        return { gymId: gym.id, gym: gym.name };
      })
    );

    res.status(200).send(gyms);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};
