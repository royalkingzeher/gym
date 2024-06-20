const { Op } = require("sequelize");
const MembershipPlan = require("../models/gymMembershipPlan");

/**
 * @swagger
 * components:
 *   schemas:
 *     MembershipPlan:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         gym_id:
 *           type: integer
 *         plan_name:
 *           type: string
 *         plan_description:
 *           type: string
 *         duration_type:
 *           type: string
 *           enum: [days, months, years]
 *         duration_value:
 *           type: integer
 *         category:
 *           type: string
 */

/**
 * @swagger
 * /api/gymMembershipPlans/{planId}:
 *   get:
 *     summary: Get a membership plan by ID
 *     tags: [MembershipPlans]
 *     description: Retrieve details of a membership plan by its ID.
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         description: Numeric ID of the membership plan to fetch.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A membership plan object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipPlan'
 *       401:
 *         description: Unauthorized. Only admin or gym_admin can fetch membership plan details.
 *       404:
 *         description: Membership plan not found
 *       500:
 *         description: Internal server error
 */
exports.getMembershipPlanById = async (req, res) => {
  const planId = req.params.planId;

  // Ensure only admin or gym_admin can fetch membership plan details
  if (req.user.type !== "admin" && req.user.type !== "gym_admin") {
    return res
      .status(401)
      .send(
        "Unauthorized, only admin or gym_admin can fetch membership plan details."
      );
  }

  try {
    // Fetch the membership plan from the database by ID
    const plan = await MembershipPlan.findByPk(planId);

    // Check if plan exists
    if (!plan) {
      return res.status(404).send("Membership plan not found.");
    }

    // Send the plan details in the response
    res.status(200).json(plan);
  } catch (error) {
    // Handle errors
    console.error("Error fetching membership plan by ID:", error);
    res.status(500).send("Internal server error.");
  }
};

/**
 * @swagger
 * /api/gymMembershipPlans:
 *   post:
 *     summary: Create a new membership plan
 *     tags: [MembershipPlans]
 *     description: Create a new membership plan.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MembershipPlan'
 *     responses:
 *       201:
 *         description: Membership plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipPlan'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
exports.createGymMembershipPlan = async (req, res) => {
  const {
    gym_id,
    plan_name,
    plan_description,
    duration_type,
    duration_value,
    category,
  } = req.body;

  // Ensure only admin or gym_admin can create membership plans
  if (req.user.type !== "admin" && req.user.type !== "gym_admin") {
    return res
      .status(401)
      .send(
        "Unauthorized, only admin or gym_admin can create membership plans."
      );
  }

  // Ensure that gym_admin could only create membership plans for their gym
  if (req.user.type === "gym_admin" && req.user.gym_id !== gym_id) {
    return res
      .status(401)
      .send(
        "Unauthorized, gym_admin can only create membership plans for their gym."
      );
  }

  try {
    // Validate required fields
    if (
      !gym_id ||
      !plan_name ||
      !duration_type ||
      !duration_value ||
      !category
    ) {
      return res.status(400).send("All required fields must be provided.");
    }

    // Create the new membership plan
    const newPlan = await MembershipPlan.create({
      gym_id,
      plan_name,
      plan_description,
      duration_type,
      duration_value,
      category,
    });

    // Send the created plan details in the response
    res.status(201).json(newPlan);
  } catch (error) {
    // Handle errors
    console.error("Error creating membership plan:", error);
    res.status(500).send("Internal server error.");
  }
};

/**
 * @swagger
 * /api/gymMembershipPlans/allByGym/{gymId}:
 *   get:
 *     summary: Get all membership plans of a gym
 *     tags: [MembershipPlans]
 *     description: Retrieve all membership plans of a gym by gym ID.
 *     parameters:
 *       - in: path
 *         name: gymId
 *         required: true
 *         description: Numeric ID of the gym to fetch membership plans.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An array of membership plan objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MembershipPlan'
 *       404:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */

exports.getMembershipPlansByGymId = async (req, res) => {
  const gymId = req.params.gymId;

  try {
    // Fetch all membership plans of a gym from the database
    const plans = await MembershipPlan.findAll({
      where: {
        gym_id: gymId,
      },
    });

    // Check if gym exists
    if (!plans.length) {
      return res.status(404).send("Gym not found.");
    }

    // Send the plans details in the response
    res.status(200).json(plans);
  } catch (error) {
    // Handle errors
    console.error("Error fetching membership plans by gym ID:", error);
    res.status(500).send("Internal server error.");
  }
};

/**
 * @swagger
 * /api/gymMembershipPlans/update/{planId}:
 *   put:
 *     summary: Update a membership plan by plan ID
 *     tags: [MembershipPlans]
 *     description: Update details of a membership plan by its ID.
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         description: Numeric ID of the membership plan to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MembershipPlan'
 *     responses:
 *       200:
 *         description: Membership plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipPlan'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized. Only admin or gym_admin can update membership plans.
 *       404:
 *         description: Membership plan not found
 *       500:
 *         description: Internal server error
 */

exports.updateMembershipPlanById = async (req, res) => {
  const planId = req.params.planId;
  const {
    gym_id,
    plan_name,
    plan_description,
    duration_type,
    duration_value,
    category,
  } = req.body;

  // Ensure only admin or gym_admin can update membership plans
  if (req.user.type !== "admin" && req.user.type !== "gym_admin") {
    return res
      .status(401)
      .send(
        "Unauthorized, only admin or gym_admin can update membership plans."
      );
  }

  try {
    // Fetch the membership plan from the database by ID
    const plan = await MembershipPlan.findByPk(planId);

    // Check if plan exists
    if (!plan) {
      return res.status(404).send("Membership plan not found.");
    }

    // Ensure that gym_admin can only update their own gym's membership plans
    if (req.user.type === "gym_admin" && req.user.gym_id !== plan.gym_id) {
      return res
        .status(401)
        .send(
          "Unauthorized, gym_admin can only update their own gym's membership plans."
        );
    }

    // Update the plan with the provided data
    const updatedData = {
      plan_name,
      plan_description,
      duration_type,
      duration_value,
      category,
    };

    // Update gym_id if provided and the user is admin
    if (gym_id && req.user.type === "admin") {
      updatedData.gym_id = gym_id;
    }

    // Update the plan in the database
    await plan.update(updatedData);

    // Send the updated plan details in the response
    res.status(200).json(plan);
  } catch (error) {
    // Handle errors
    console.error("Error updating membership plan:", error);
    res.status(500).send("Internal server error.");
  }
};

/**
 * @swagger
 * /api/gymMembershipPlans/delete/{planId}:
 *   delete:
 *     summary: Delete a membership plan by plan ID
 *     tags: [MembershipPlans]
 *     description: Delete a membership plan by its ID.
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         description: Numeric ID of the membership plan to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Membership plan deleted successfully
 *       401:
 *         description: Unauthorized. Only admin or gym_admin can delete membership plans.
 *       404:
 *         description: Membership plan not found
 *       500:
 *         description: Internal server error
 */

exports.deleteMembershipPlanById = async (req, res) => {
  const planId = req.params.planId;

  // Ensure only admin or gym_admin can delete membership plans
  if (req.user.type !== "admin" && req.user.type !== "gym_admin") {
    return res
      .status(401)
      .send(
        "Unauthorized, only admin or gym_admin can delete membership plans."
      );
  }

  try {
    // Fetch the membership plan from the database by ID
    const plan = await MembershipPlan.findByPk(planId);

    // Check if plan exists
    if (!plan) {
      return res.status(404).send("Membership plan not found.");
    }

    // Ensure that gym_admin can only delete their own gym's membership plans
    if (req.user.type === "gym_admin" && req.user.gym_id !== plan.gym_id) {
      return res
        .status(401)
        .send(
          "Unauthorized, gym_admin can only delete their own gym's membership plans."
        );
    }

    // Delete the plan from the database
    await plan.destroy();

    // Send a success response
    res.sendStatus(204);
  } catch (error) {
    // Handle errors
    console.error("Error deleting membership plan:", error);
    res.status(500).send("Internal server error.");
  }
};