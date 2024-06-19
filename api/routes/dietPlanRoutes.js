const { Op } = require("sequelize");
const express = require("express");
const { DietPlans } = require("../models/dietPlan"); 
const { check, validationResult } = require('express-validator');
const router = express.Router();

// Get all diet plans
router.get("/api/diet-plans", async (req, res) => {
  try {
    const dietPlans = await DietPlans.findAll();
    res.json(dietPlans);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a diet plan by ID
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

// Create a new diet plan
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

// Update a diet plan by ID
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

// Delete a diet plan by ID
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
