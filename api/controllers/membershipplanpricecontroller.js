const { Op } = require("sequelize");
const membershipplansprice = require('../models/membershipplanprice');
const Gym = require("../models/gym");
const MembershipPlan = require("../models/gymMembershipPlan");
const gymAdminAndGym = require("../models/gymAdminAndGym");

/**
 * @swagger
 * components:
 *   schemas:
 *     MembershipPlansPrices:
 *       type: object
 *       required:
 *         - membership_plan_id
 *         - price
 *         - validity_start_date
 *         - validity_end_date
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the membership plan price
 *         membership_plan_id:
 *           type: integer
 *           description: The ID of the membership plan
 *         price:
 *           type: number
 *           format: decimal
 *           description: The price of the membership plan
 *         validity_start_date:
 *           type: string
 *           format: date-time
 *           description: The start date of the validity period
 *         validity_end_date:
 *           type: string
 *           format: date-time
 *           description: The end date of the validity period
 *         comments:
 *           type: string
 *           description: Additional comments
 *       example:
 *         id: 1
 *         membership_plan_id: 101
 *         price: 49.99
 *         validity_start_date: '2023-01-01T00:00:00.000Z'
 *         validity_end_date: '2023-12-31T23:59:59.000Z'
 *         comments: 'Early bird discount'
 */

/**
 * @swagger
 * /api/membership-plans-prices:
 *   get:
 *     summary: Get all membership plan prices
 *     tags: [MembershipPlansPrices]
 *     responses:
 *       200:
 *         description: List of membership plan prices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MembershipPlansPrices'
 *       500:
 *         description: Server error
 */
exports.getAllMembershipPlanPrices = async (req, res) => {
  try {
    const currentUser = req.user;
    let prices;

    if (currentUser.type === "admin") {
      // Admin can see all membership plan prices
      prices = await MembershipPlanPrice.findAll();
    } else if (currentUser.type === "gymAdmin") {
      // Gym admin can only see membership plan prices for their gym
      const gymAdmin = await User.findByPk(currentUser.id);
      const gym = await Gym.findByPk(gymAdmin.gym_id);
      prices = await MembershipPlanPrice.findAll({
        where: {
          gym_id: gym.id,
        },
      });
    }

    if (!prices) {
      return res.status(404).json({ message: "No prices found" });
    }

    prices = await Promise.all(
      prices.map(async (price) => {
        if (currentUser.type === "gymAdmin") {
          return {
           ...price.get({ plain: true }),
            gym: (await Gym.findByPk(price.gym_id)).name,
            gymAdmin: (await User.findByPk(currentUser.id)).username,
          };
        }
        return price.get({ plain: true });
      })
    );

    res.status(200).json(prices);
  } catch (error) {
    console.error("Error:", error.message); // Log error message
    res.status(500).json({ message: error.message });
  }
};
/**
 * @swagger
 * /api/membership-plans-prices/{id}:
 *   get:
 *     summary: Get a membership plan price by ID
 *     tags: [MembershipPlansPrices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The membership plan price ID
 *     responses:
 *       200:
 *         description: Membership plan price details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipPlansPrices'
 *       404:
 *         description: Membership plan price not found
 *       500:
 *         description: Server error
 */
exports.getMembershipPlanPriceById = async (req, res) => {
  try {
    const price = await MembershipPlansPrices.findByPk(req.params.id);
    if (!price) {
      return res.status(404).json({ message: 'Membership plan price not found' });
    }
    res.status(200).json(price);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/membership-plans-prices:
 *   post:
 *     summary: Create a new membership plan price
 *     tags: [MembershipPlansPrices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MembershipPlansPrices'
 *     responses:
 *       201:
 *         description: The created membership plan price
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipPlansPrices'
 *       400:
 *         description: Bad request
 */
exports.createMembershipPlanPrice = async (req, res) => {
  try {
    const price = await MembershipPlansPrices.create(req.body);
    res.status(201).json(price);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/membership-plans-prices/{id}:
 *   put:
 *     summary: Update a membership plan price by ID
 *     tags: [MembershipPlansPrices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The membership plan price ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MembershipPlansPrices'
 *     responses:
 *       200:
 *         description: The updated membership plan price
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipPlansPrices'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Membership plan price not found
 */
exports.updateMembershipPlanPrice = async (req, res) => {
  try {
    const price = await MembershipPlansPrices.findByPk(req.params.id);
    if (!price) {
      return res.status(404).json({ message: 'Membership plan price not found' });
    }

    await price.update(req.body);
    res.status(200).json(price);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/membership-plans-prices/{id}:
 *   delete:
 *     summary: Delete a membership plan price by ID
 *     tags: [MembershipPlansPrices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The membership plan price ID
 *     responses:
 *       200:
 *         description: Membership plan price deleted successfully
 *       404:
 *         description: Membership plan price not found
 *       500:
 *         description: Server error
 */
exports.deleteMembershipPlanPrice = async (req, res) => {
  try {
    const price = await MembershipPlansPrices.findByPk(req.params.id);
    if (!price) {
      return res.status(404).json({ message: 'Membership plan price not found' });
    }

    await price.destroy();
    res.status(200).json({ message: 'Membership plan price deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};