const { Op } = require("sequelize");
const Gym = require("../models/gym");

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
    res.status(200).send(gym);
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
 *     responses:
 *       200:
 *         description: List of gyms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gym'
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

  try {
    const gyms = await Gym.findAll();
    res.status(200).send(gyms);
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
 *   get:
 *     summary: Get a gym by ID
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gym details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gym'
 *       401:
 *         description: Unauthorized, only admin user can view gyms
 *       404:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */
exports.getGymById = async (req, res) => {
  const currentUser = req.user;

  if (currentUser.type !== "admin") {
    return res.status(401).send("Unauthorized, only admin user can view gyms");
  }

  const { id } = req.params;

  try {
    const gym = await Gym.findByPk(id);
    if (!gym) {
      return res.status(404).send("Gym not found");
    }
    res.status(200).send(gym);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};

/**
 * @swagger
 * /api/gym/search:
 *   post:
 *     summary: Get a gym by performing a search on a parameter
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
 *               parameter:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gym details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gym'
 *       401:
 *         description: Unauthorized, only admin user can view gyms
 *       404:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */
exports.getGymByParameter = async (req, res) => {
  const currentUser = req.user;

  if (currentUser.type !== "admin") {
    return res.status(401).send("Unauthorized, only admin user can view gyms");
  }

  const { parameter, value } = req.body;

  const validColumns = [
    "name",
    "address",
    "city",
    "state",
    "country",
    "pincode",
    "phone_number",
    "email",
    "website",
    "contact_person",
    "currency",
    "latitude",
    "longitude",
  ];

  if (!parameter || !value) {
    return res.status(400).json({
      error: "Validation error",
      details: ["parameter and value are required"],
    });
  }

  if (!validColumns.includes(parameter)) {
    return res.status(400).json({
      error: "Validation error",
      details: ["Invalid parameter"],
    });
  }

  try {
    const gyms = await Gym.findAll({
      where: { [parameter]: { [Op.like]: `%${value}%` } },
    });
    if (gyms.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        details: ["No gyms found matching the criteria"],
      });
    }
    res.status(200).send(gyms);
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
 *     summary: Update a gym by ID
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
  const updateFields = [
    "name",
    "address",
    "city",
    "state",
    "country",
    "pincode",
    "phone_number",
    "email",
    "website",
    "contact_person",
    "currency",
    "latitude",
    "longitude",
  ];

  const providedFields = updateFields.filter((field) =>
    req.body.hasOwnProperty(field)
  );

  if (providedFields.length === 0) {
    return res.status(400).json({
      error: "Validation error",
      details: ["At least one field is required to update the gym"],
    });
  }

  const validationErrors = [];

  if (
    (req.body.latitude && typeof req.body.latitude !== "number") ||
    (req.body.longitude && typeof req.body.longitude !== "number")
  ) {
    validationErrors.push("latitude and longitude must be numbers");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (req.body.email && !emailRegex.test(req.body.email)) {
    validationErrors.push("email format is invalid");
  }

  const phoneNumberRegex = /^\d{10}$/;
  if (req.body.phone_number && !phoneNumberRegex.test(req.body.phone_number)) {
    validationErrors.push("phone number must be 10 digits");
  }

  const pincodeRegex = /^\d{6}$/;
  if (req.body.pincode && !pincodeRegex.test(req.body.pincode)) {
    validationErrors.push("pincode must be 6 digits");
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: "Validation error",
      details: validationErrors,
    });
  }

  try {
    const [updated] = await Gym.update(req.body, { where: { id } });
    if (updated) {
      const updatedGym = await Gym.findByPk(id);
      if (!updatedGym) throw new Error("Gym not found");
      return res.status(200).send(updatedGym);
    }
    throw new Error("Gym not found");
  } catch (error) {
    if (error.message === "Gym not found") {
      return res.status(404).json({
        error: "Not Found",
        details: [error.message],
      });
    }
    res.status(500).json({
      error: "Internal server error",
      details: [error.message],
    });
  }
};
