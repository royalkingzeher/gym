require("dotenv").config(); // Load environment variables
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const GymAndGymMember = require("../models/gymAndGymMember");
const Gym = require("../models/gym");

/**
 * @swagger
 * /api/signup/admin:
 *   post:
 *     summary: Sign up a new admin user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The admin user was successfully created
 *       400:
 *         description: Bad request
 */
exports.signupAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }

    if (password.length < 8) {
      return res
        .status(400)
        .send("Password must be at least 8 characters long.");
    }

    let user = await User.findOne({ where: { username } });
    if (user) return res.status(400).send("User already exists.");

    user = await User.create({
      username,
      password: await bcrypt.hash(password, 10),
      firstName: "Admin",
      type: "admin",
    });

    const response = {
      message: "Admin user created successfully",
      user: {
        id: user.id,
        username: user.username,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

/**
 * @swagger
 * /api/signup/gymadmin:
 *   post:
 *     summary: Sign up a new gym admin user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *               country:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               profilePicture:
 *                 type: string
 *               emergencyContactName:
 *                 type: string
 *               emergencyContactRelationship:
 *                 type: string
 *               emergencyContactPhone:
 *                 type: string
 *               emergencyContactEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: The gym admin user was successfully created
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden, only admin user can create gym admin user
 */
exports.signupGymAdmin = async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      dateOfBirth,
      gender,
      profilePicture,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
      emergencyContactEmail,
    } = req.body;
    const currentUser = req.user; // Assuming the user object is attached by middleware

    // Check if the current user is an admin
    if (currentUser.type !== "admin") {
      return res
        .status(403)
        .send("Forbidden, only admin user can create gym admin user");
    }

    if (!username || !password || !firstName) {
      return res
        .status(400)
        .send("Username, password, and first name are required.");
    }

    if (password.length < 8) {
      return res
        .status(400)
        .send("Password must be at least 8 characters long.");
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).send("Phone number should be 10 digits long.");
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).send("Invalid email format.");
    }

    let user = await User.findOne({ where: { username } });
    if (user) return res.status(400).send("User already exists.");

    user = await User.create({
      username,
      password: await bcrypt.hash(password, 10),
      type: "gym_admin",
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      dateOfBirth,
      gender,
      profilePicture,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
      emergencyContactEmail,
    });

    const response = {
      message: "Gym admin user created successfully",
      user: {
        id: user.id,
        username: user.username,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send("Internal server error" + error);
  }
};

/**
 * @swagger
 * /api/signup/gymmember:
 *   post:
 *     summary: Sign up a new gym member user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *               country:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               profilePicture:
 *                 type: string
 *               emergencyContactName:
 *                 type: string
 *               emergencyContactRelationship:
 *                 type: string
 *               emergencyContactPhone:
 *                 type: string
 *               emergencyContactEmail:
 *                 type: string
 *                 format: email
 *               gymId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The gym member user was successfully created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
exports.signupGymMember = async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      dateOfBirth,
      gender,
      profilePicture,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
      emergencyContactEmail,
      gymId,
    } = req.body;

    if (!username || !password || !firstName || !gymId) {
      return res
        .status(400)
        .send("Username, password, first name, and gym ID are required.");
    }

    if (password.length < 8) {
      return res
        .status(400)
        .send("Password must be at least 8 characters long.");
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).send("Phone number should be 10 digits long.");
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).send("Invalid email format.");
    }

    // Check if the gymId exists in the Gym table
    const gym = await Gym.findByPk(gymId);
    if (!gym) return res.status(400).send("Gym does not exist.");

    let user = await User.findOne({ where: { username } });
    if (user) return res.status(400).send("User already exists.");

    user = await User.create({
      username,
      password: await bcrypt.hash(password, 10),
      type: "gym_member",
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      dateOfBirth,
      gender,
      profilePicture,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
      emergencyContactEmail,
    });

    // Update the GymAndGymMember table
    await GymAndGymMember.create({ gymId, memberId: user.id });

    const response = {
      message: "Gym member user created successfully",
      user: {
        id: user.id,
        username: user.username,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *       400:
 *         description: Bad request
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).send("Invalid username or password.");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid username or password.");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.send({ token });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

/**
 * @swagger
 * /api/userDetails:
 *   post:
 *     summary: Get user details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user details are successfully retrieved
 *       500:
 *         description: Internal server error
 */
exports.userDetails = async (req, res) => {
  try {
    const currentUser = req.user; // Assuming the user object is attached by middleware

    const user = await User.findByPk(currentUser.id, {
      attributes: { exclude: ["password"] },
    });

    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};