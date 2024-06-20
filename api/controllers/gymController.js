const { Op } = require("sequelize");
const Gym = require("../models/gym");
const GymAndGymAdmin = require("../models/gymAndGymAdmin");

/**
 * @swagger
 * components:
 *   schemas:
 *     Gym:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the gym
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the gym
 *           example: Fit Gym
 *         address:
 *           type: string
 *           description: The address of the gym
 *           example: 123 Main St
 *         city:
 *           type: string
 *           description: The city where the gym is located
 *           example: Springfield
 *         state:
 *           type: string
 *           description: The state where the gym is located
 *           example: IL
 *         country:
 *           type: string
 *           description: The country where the gym is located
 *           example: USA
 *         pincode:
 *           type: string
 *           description: The pincode of the gym's location
 *           example: 62704
 *         phone_number:
 *           type: string
 *           description: The phone number of the gym
 *           example: 1234567890
 *         email:
 *           type: string
 *           description: The email address of the gym
 *           example: contact@fitgym.com
 *         website:
 *           type: string
 *           description: The website URL of the gym
 *           example: https://www.fitgym.com
 *         contact_person:
 *           type: string
 *           description: The name of the contact person at the gym
 *           example: John Doe
 *         currency:
 *           type: string
 *           description: The currency used by the gym
 *           example: USD
 *         latitude:
 *           type: number
 *           description: The latitude coordinate of the gym's location
 *           example: 39.7817
 *         longitude:
 *           type: number
 *           description: The longitude coordinate of the gym's location
 *           example: -89.6501
 *         status:
 *           type: string
 *           description: The status of the gym
 *           example: active
 */

/**
 * @swagger
 * /api/gym:
 *   post:
 *     summary: Create a new gym
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               pincode:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               contact_person:
 *                 type: string
 *               currency:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Gym created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gym'
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
 *         description: Unauthorized, only admin user can create gym
 *       500:
 *         description: Internal server error
 */
exports.createGym = async (req, res) => {
  const currentUser = req.user;

  if (currentUser.type !== "admin") {
    return res.status(401).send("Unauthorized, only admin user can create gym");
  }

  const requiredFields = [
    "name",
    "address",
    "city",
    "state",
    "country",
    "pincode",
    "phone_number",
    "email",
    "contact_person",
    "currency",
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Validation error",
      details: missingFields.map((field) => `${field} is required`),
    });
  }

  const validationErrors = [];

  if (
    typeof req.body.latitude !== "number" ||
    typeof req.body.longitude !== "number"
  ) {
    validationErrors.push("latitude and longitude must be numbers");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    validationErrors.push("email format is invalid");
  }

  const phoneNumberRegex = /^\d{10}$/;
  if (!phoneNumberRegex.test(req.body.phone_number)) {
    validationErrors.push("phone number must be 10 digits");
  }

  const pincodeRegex = /^\d{6}$/;
  if (!pincodeRegex.test(req.body.pincode)) {
    validationErrors.push("pincode must be 6 digits");
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: "Validation error",
      details: validationErrors,
    });
  }

  try {
    const gym = await Gym.create(req.body);
    const response = {
      message: "Gym created successfully",
      gym: gym,
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
 * /api/gym:
 *   get:
 *     summary: Get list of all gyms
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of gyms per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: name
 *           enum: [name, address, city, state, country, phone_number, email, contact_person]
 *         description: Column to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           default: asc
 *           enum: [asc, desc]
 *         description: Order of sorting (ascending or descending)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter gyms by name, address, city, state, country, phone_number, email, or contact_person
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Filter gyms by address
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter gyms by city
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter gyms by state
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter gyms by country
 *       - in: query
 *         name: phone_number
 *         schema:
 *           type: string
 *         description: Filter gyms by phone number
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter gyms by email
 *       - in: query
 *         name: contact_person
 *         schema:
 *           type: string
 *         description: Filter gyms by contact person
 *     responses:
 *       200:
 *         description: List of gyms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gym'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *       401:
 *         description: Unauthorized, only admin user can view gyms
 *       500:
 *         description: Internal server error
 */
exports.getAllGyms = async (req, res) => {
  const currentUser = req.user;

  if (currentUser.type !== "admin") {
    return res.status(401).send("Unauthorized, only admin user can view gyms");
  }

  const {
    page = 1,
    limit = 10,
    sortBy = "name",
    order = "asc",
    search,
  } = req.query;

  const options = {
    offset: (page - 1) * limit,
    limit: +limit,
    order: [[sortBy, order.toUpperCase()]],
    where: {},
  };

  if (search) {
    options.where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { address: { [Op.iLike]: `%${search}%` } },
      { city: { [Op.iLike]: `%${search}%` } },
      { state: { [Op.iLike]: `%${search}%` } },
      { country: { [Op.iLike]: `%${search}%` } },
      { phone_number: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { contact_person: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (currentUser.type === "gym_admin") {
    const gymAndGymAdmins = await GymAndGymAdmin.findAll({
      where: {
        gymAdminId: currentUser.id,
      },
    });

    const gymIds = gymAndGymAdmins.map((g) => g.gymId);

    options.where.id = {
      [Op.in]: gymIds,
    };
  }

  const gyms = await Gym.findAndCountAll(options);
  const totalPages = Math.ceil(gyms.count / limit);

  const response = {
    data: gyms.rows,
    meta: {
      totalItems: gyms.count,
      totalPages: totalPages,
      currentPage: +page,
    },
  };

  res.status(200).json(response);
};

/**
 * @swagger
 * /api/gym/{id}:
 *   get:
 *     summary: Get gym by ID
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the gym to get
 *     responses:
 *       200:
 *         description: Gym found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gym'
 *       404:
 *         description: Gym not found
 *       401:
 *         description: Unauthorized, only admin user can view gyms
 *       500:
 *         description: Internal server error
 */
exports.getGymById = async (req, res) => {
  const currentUser = req.user;

  if (currentUser.type !== "admin") {
    return res.status(401).send("Unauthorized, only admin user can view gyms");
  }

  if (currentUser.type === "gym_admin") {
    const gymAndGymAdmin = await GymAndGymAdmin.findOne({
      where: {
        gymAdminId: currentUser.id,
        gymId: req.params.id,
      },
    });

    if (!gymAndGymAdmin) {
      return res
        .status(401)
        .send("Unauthorized, gym admin does not have access to this gym");
    }
  }

  const { id } = req.params;

  try {
    const gym = await Gym.findByPk(id);

    if (!gym) {
      return res.status(404).json({
        error: `Gym with ID ${id} not found`,
      });
    }

    res.status(200).json(gym);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};

/**
 * @swagger
 * /api/gym/{id}:
 *   put:
 *     summary: Update gym by ID
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the gym to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gym'
 *     responses:
 *       200:
 *         description: Gym updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gym'
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
 *         description: Unauthorized, only admin user can update gyms
 *       404:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */
exports.updateGymById = async (req, res) => {
  const currentUser = req.user;

  if (currentUser.type !== "admin") {
    return res
      .status(401)
      .send("Unauthorized, only admin user can update gyms");
  }

  const { id } = req.params;

  try {
    const gym = await Gym.findByPk(id);

    if (!gym) {
      return res.status(404).json({
        error: `Gym with ID ${id} not found`,
      });
    }

    await gym.update(req.body);

    res.status(200).json(gym);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const details = error.errors.map((e) => e.message);
      return res.status(400).json({
        error: "Validation error",
        details: details,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};

/**
 * @swagger
 * /api/gym/{id}:
 *   delete:
 *     summary: Delete gym by ID
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the gym to delete
 *     responses:
 *       200:
 *         description: Gym deleted successfully
 *       401:
 *         description: Unauthorized, only admin user can delete gyms
 *       404:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */
exports.deleteGymById = async (req, res) => {
  const currentUser = req.user;

  if (currentUser.type !== "admin") {
    return res
      .status(401)
      .send("Unauthorized, only admin user can delete gyms");
  }

  const { id } = req.params;

  try {
    const gym = await Gym.findByPk(id);

    if (!gym) {
      return res.status(404).json({
        error: `Gym with ID ${id} not found`,
      });
    }

    await gym.destroy();

    res.status(200).json({
      message: `Gym with ID ${id} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};