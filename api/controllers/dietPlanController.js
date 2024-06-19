const { Op } = require("sequelize");
const express = require("express");
const { DietPlans } = require("../models/dietPlan"); 
const Gym = require("../models/gym");
const router = express.Router();
const { check, validationResult } = require('express-validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     DietPlan:
 *       type: object
 *       required:
 *         - gym_member_id
 *         - diet_plan_name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the diet plan
 *         gym_member_id:
 *           type: integer
 *           description: ID of the gym member
 *         diet_plan_name:
 *           type: string
 *           description: Name of the diet plan
 *         comments:
 *           type: string
 *           description: Comments on the diet plan
 *         diet_plan_chart:
 *           type: string
 *           description: Detailed diet plan chart
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date the diet plan was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date the diet plan was last updated
 */


/**
 * @swagger
 * /api/diet-plans:
 *   get:
 *     summary: Get all diet plans
 *     tags: [DietPlans]
 *     responses:
 *       200:
 *         description: List of all diet plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DietPlan'
 */
router.get("/api/diet-plans", async (req, res) => {
  try {
    const dietPlans = await DietPlans.findAll();
    res.json(dietPlans);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/diet-plans/{id}:
 *   get:
 *     summary: Get a diet plan by ID
 *     tags: [DietPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The diet plan ID
 *     responses:
 *       200:
 *         description: Diet plan details by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DietPlan'
 *       404:
 *         description: Diet plan not found
 */
router.get("/api/diet-plans/:id", async (req, res) => {
  try {
    const dietPlan = await DietPlans.findByPk(req.params.id);
    if (dietPlan) {
      res.json(dietPlan);
    } else {
      res.status(404).send("Diet plan not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/diet-plans:
 *   post:
 *     summary: Create a new diet plan
 *     tags: [DietPlans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DietPlan'
 *     responses:
 *       201:
 *         description: Diet plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DietPlan'
 *       400:
 *         description: Invalid input
 */
router.post("/api/diet-plans", [
  check('gym_member_id').isInt().withMessage('Gym member ID must be an integer'),
  check('diet_plan_name').notEmpty().withMessage('Diet plan name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const dietPlan = await DietPlans.create(req.body);
    res.status(201).json(dietPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/diet-plans/{id}:
 *   put:
 *     summary: Update a diet plan by ID
 *     tags: [DietPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The diet plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DietPlan'
 *     responses:
 *       200:
 *         description: Diet plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DietPlan'
 *       404:
 *         description: Diet plan not found
 *       400:
 *         description: Invalid input
 */
router.put("/api/diet-plans/:id", [
  check('gym_member_id').isInt().withMessage('Gym member ID must be an integer'),
  check('diet_plan_name').notEmpty().withMessage('Diet plan name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const dietPlan = await DietPlans.findByPk(req.params.id);
    if (dietPlan) {
      await dietPlan.update(req.body);
      res.json(dietPlan);
    } else {
      res.status(404).send("Diet plan not found");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/diet-plans/{id}:
 *   delete:
 *     summary: Delete a diet plan by ID
 *     tags: [DietPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The diet plan ID
 *     responses:
 *       204:
 *         description: Diet plan deleted successfully
 *       404:
 *         description: Diet plan not found
 */
router.delete("/api/diet-plans/:id", async (req, res) => {
  try {
    const dietPlan = await DietPlans.findByPk(req.params.id);
    if (dietPlan) {
      await dietPlan.destroy();
      res.status(204).send();
    } else {
      res.status(404).send("Diet plan not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
