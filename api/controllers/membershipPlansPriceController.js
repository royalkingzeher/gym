const MembershipPlansPrice = require("../models/membershipPlansPrice");
const MembershipPlan = require("../models/gymMembershipPlan");
const { Op } = require("sequelize");

/**
 * @swagger
 * components:
 *   schemas:
 *     MembershipPlansPrice:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         membership_plan_id:
 *           type: integer
 *         price:
 *           type: number
 *           format: float
 *         validity_start_date:
 *           type: string
 *           format: date
 *         validity_end_date:
 *           type: string
 *           format: date
 *         comments:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/membershipPlansPrices/{priceId}:
 *   get:
 *     summary: Get membership plan price by ID
 *     tags: [MembershipPlansPrices]
 *     description: Retrieve details of a membership plan price by its ID.
 *     parameters:
 *       - in: path
 *         name: priceId
 *         required: true
 *         description: Numeric ID of the membership plan price to fetch.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A membership plan price object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipPlansPrice'
 *       401:
 *         description: Unauthorized. Only admin or authorized users can fetch membership plan price details.
 *       404:
 *         description: Membership plan price not found
 *       500:
 *         description: Internal server error
 */
exports.getMembershipPlanPriceById = async (req, res) => {
  const priceId = req.params.priceId;

  try {
    // Fetch the membership plan price from the database by ID
    const price = await MembershipPlansPrice.findByPk(priceId, {
      include: {
        model: MembershipPlan,
        attributes: ["id", "plan_name", "gym_id"], // Adjust attributes as needed
      },
    });

    // Check if price exists
    if (!price) {
      return res.status(404).send("Membership plan price not found.");
    }

    // Send the price details in the response
    res.status(200).json(price);
  } catch (error) {
    // Handle errors
    console.error("Error fetching membership plan price by ID:", error);
    res.status(500).send(error.message);
  }
};

/**
 * @swagger
 * /api/membershipPlansPrices:
 *   post:
 *     summary: Create a new membership plan price
 *     tags: [MembershipPlansPrices]
 *     description: Create a new membership plan price.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MembershipPlansPrice'
 *     responses:
 *       201:
 *         description: Membership plan price created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipPlansPrice'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
exports.createMembershipPlanPrice = async (req, res) => {
  const {
    membership_plan_id,
    price,
    validity_start_date,
    validity_end_date,
    comments,
  } = req.body;

  try {
    // Validate required fields and date order
    if (
      !membership_plan_id ||
      !price ||
      !validity_start_date ||
      !validity_end_date ||
      new Date(validity_start_date) >= new Date(validity_end_date)
    ) {
      return res.status(400).send("Invalid validity dates or missing fields.");
    }

    // Check for overlapping validity periods for the same membership_plan_id
    const overlappingPrice = await MembershipPlansPrice.findOne({
      where: {
        membership_plan_id,
        [Op.or]: [
          {
            validity_start_date: {
              [Op.lte]: validity_end_date,
            },
            validity_end_date: {
              [Op.gte]: validity_start_date,
            },
          },
        ],
      },
    });

    if (overlappingPrice) {
      return res
        .status(400)
        .send("Validity period overlaps with an existing price.");
    }

    // Create the new membership plan price
    const newPrice = await MembershipPlansPrice.create({
      membership_plan_id,
      price,
      validity_start_date,
      validity_end_date,
      comments,
    });

    // Send the created price details in the response
    res.status(201).json(newPrice);
  } catch (error) {
    // Handle errors
    console.error("Error creating membership plan price:", error);
    res.status(500).send("Internal server error.");
  }
};

/**
 * @swagger
 * /api/membershipPlansPrices/update/{priceId}:
 *   put:
 *     summary: Update a membership plan price by price ID
 *     tags: [MembershipPlansPrices]
 *     description: Update details of a membership plan price by its ID.
 *     parameters:
 *       - in: path
 *         name: priceId
 *         required: true
 *         description: Numeric ID of the membership plan price to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               membership_plan_id:
 *                 type: integer
 *               price:
 *                 type: number
 *               validity_start_date:
 *                 type: string
 *                 format: date
 *               validity_end_date:
 *                 type: string
 *                 format: date
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membership plan price updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipPlansPrice'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized. Only admin or authorized users can update membership plan prices.
 *       404:
 *         description: Membership plan price not found
 *       500:
 *         description: Internal server error
 */
exports.updateMembershipPlanPriceById = async (req, res) => {
  const priceId = req.params.priceId;
  const {
    membership_plan_id,
    price,
    validity_start_date,
    validity_end_date,
    comments,
  } = req.body;

  try {
    // Fetch the membership plan price from the database by ID
    let priceToUpdate = await MembershipPlansPrice.findByPk(priceId);

    // Check if price exists
    if (!priceToUpdate) {
      return res.status(404).send("Membership plan price not found.");
    }

    // Check for date order and overlapping validity periods for the same membership_plan_id
    if (
      validity_start_date !== undefined &&
      validity_end_date !== undefined &&
      new Date(validity_start_date) >= new Date(validity_end_date)
    ) {
      return res
        .status(400)
        .send("Validity start date must be before validity end date.");
    }

    if (
      membership_plan_id !== undefined ||
      validity_start_date !== undefined ||
      validity_end_date !== undefined
    ) {
      const overlappingPrice = await MembershipPlansPrice.findOne({
        where: {
          membership_plan_id:
            membership_plan_id || priceToUpdate.membership_plan_id,
          id: {
            [Op.not]: priceId,
          },
          [Op.or]: [
            {
              validity_start_date: {
                [Op.lte]: validity_end_date || priceToUpdate.validity_end_date,
              },
              validity_end_date: {
                [Op.gte]:
                  validity_start_date || priceToUpdate.validity_start_date,
              },
            },
          ],
        },
      });

      if (overlappingPrice) {
        return res
          .status(400)
          .send("Validity period overlaps with an existing price.");
      }
    }

    // Update the price object with the provided data
    if (membership_plan_id !== undefined) {
      priceToUpdate.membership_plan_id = membership_plan_id;
    }
    if (price !== undefined) {
      priceToUpdate.price = price;
    }
    if (validity_start_date !== undefined) {
      priceToUpdate.validity_start_date = validity_start_date;
    }
    if (validity_end_date !== undefined) {
      priceToUpdate.validity_end_date = validity_end_date;
    }
    if (comments !== undefined) {
      priceToUpdate.comments = comments;
    }

    // Save the updated price
    priceToUpdate = await priceToUpdate.save();

    // Send the updated price details in the response
    res.status(200).json(priceToUpdate);
  } catch (error) {
    // Handle errors
    console.error("Error updating membership plan price:", error);
    res.status(500).send("Internal server error.");
  }
};

/**
 * @swagger
 * /api/membershipPlansPrices/delete/{priceId}:
 *   delete:
 *     summary: Delete a membership plan price by price ID
 *     tags: [MembershipPlansPrices]
 *     description: Delete a membership plan price by its ID.
 *     parameters:
 *       - in: path
 *         name: priceId
 *         required: true
 *         description: Numeric ID of the membership plan price to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Membership plan price deleted successfully
 *       401:
 *         description: Unauthorized. Only admin or authorized users can delete membership plan prices.
 *       404:
 *         description: Membership plan price not found
 *       500:
 *         description: Internal server error
 */
exports.deleteMembershipPlanPriceById = async (req, res) => {
  const priceId = req.params.priceId;

  try {
    // Fetch the membership plan price from the database by ID
    const priceToDelete = await MembershipPlansPrice.findByPk(priceId);

    // Check if price exists
    if (!priceToDelete) {
      return res.status(404).send("Membership plan price not found.");
    }

    // Delete the price from the database
    await priceToDelete.destroy();

    // Send a success response
    res.sendStatus(204);
  } catch (error) {
    // Handle errors
    console.error("Error deleting membership plan price:", error);
    res.status(500).send("Internal server error.");
  }
};