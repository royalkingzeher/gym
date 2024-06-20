const MembersMembership = require("../models/MembersMembership");
const User = require("../models/user");
const MembershipPlan = require("../models/gymMembershipPlan");
const { Op } = require("sequelize");

/**
 * @swagger
 * components:
 *   schemas:
 *     MembersMembership:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         gym_member_id:
 *           type: integer
 *         membership_plan_id:
 *           type: integer
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/membersMemberships:
 *   post:
 *     summary: Create a new membership for a gym member
 *     tags: [MembersMemberships]
 *     description: Create a new membership for a gym member.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MembersMembership'
 *     responses:
 *       201:
 *         description: Membership created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembersMembership'
 *       400:
 *         description: Bad request. Validation errors or overlapping dates.
 *       500:
 *         description: Internal server error
 */
exports.createMembersMembership = async (req, res) => {
  const { gym_member_id, membership_plan_id, start_date, end_date } = req.body;

  try {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Validate required fields and date order
    if (
      !gym_member_id ||
      !membership_plan_id ||
      isNaN(startDate) ||
      isNaN(endDate)
    ) {
      return res.status(400).send("Invalid or missing fields.");
    }

    if (startDate >= endDate) {
      return res.status(400).send("Start date must be before end date.");
    }

    // Check for overlapping memberships
    const overlaps = await MembersMembership.findOne({
      where: {
        gym_member_id,
        start_date: { [Op.lt]: end_date },
        end_date: { [Op.gt]: start_date },
      },
    });

    if (overlaps) {
      return res
        .status(400)
        .send("Membership period overlaps with an existing membership.");
    }

    // Create the new members membership
    const newMembership = await MembersMembership.create({
      gym_member_id,
      membership_plan_id,
      start_date,
      end_date,
    });

    // Send the created membership details in the response
    res.status(201).json(newMembership);
  } catch (error) {
    // Handle errors
    console.error("Error creating members membership:", error);
    res.status(500).send("Internal server error.");
  }
};

/**
 * @swagger
 * /api/membersMemberships/{membershipId}:
 *   get:
 *     summary: Get membership details by ID
 *     tags: [MembersMemberships]
 *     description: Retrieve details of a membership by its ID.
 *     parameters:
 *       - in: path
 *         name: membershipId
 *         required: true
 *         description: Numeric ID of the membership to fetch.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A membership object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembersMembership'
 *       401:
 *         description: Unauthorized. Only admin or authorized users can fetch membership details.
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
exports.getMembersMembershipById = async (req, res) => {
  const membershipId = req.params.membershipId;

  try {
    // Fetch the membership from the database by ID
    const membership = await MembersMembership.findByPk(membershipId, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "email", "firstName", "lastName"],
        },
        {
          model: MembershipPlan,
          attributes: ["id", "plan_name", "plan_description", "category"],
        },
      ],
    });

    // Check if membership exists
    if (!membership) {
      return res.status(404).send("Membership not found.");
    }

    // Send the membership details in the response
    res.status(200).json(membership);
  } catch (error) {
    // Handle errors
    console.error("Error fetching membership by ID:", error);
    res.status(500).send("Internal server error.");
  }
};

/**
 * @swagger
 * /api/membersMemberships/update/{membershipId}:
 *   put:
 *     summary: Update membership details by ID
 *     tags: [MembersMemberships]
 *     description: Update details of a membership by its ID.
 *     parameters:
 *       - in: path
 *         name: membershipId
 *         required: true
 *         description: Numeric ID of the membership to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gym_member_id:
 *                 type: integer
 *               membership_plan_id:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Membership updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembersMembership'
 *       400:
 *         description: Bad request. Validation errors or overlapping dates.
 *       401:
 *         description: Unauthorized. Only admin or authorized users can update membership details.
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
exports.updateMembersMembershipById = async (req, res) => {
  const membershipId = req.params.membershipId;
  const { gym_member_id, membership_plan_id, start_date, end_date } = req.body;

  try {
    // Fetch the membership from the database by ID
    let membershipToUpdate = await MembersMembership.findByPk(membershipId);

    // Check if membership exists
    if (!membershipToUpdate) {
      return res.status(404).send("Membership not found.");
    }

    // Parse dates
    const startDate = start_date ? new Date(start_date) : undefined;
    const endDate = end_date ? new Date(end_date) : undefined;

    // Check for date order
    if (startDate && endDate && startDate >= endDate) {
      return res.status(400).send("Start date must be before end date.");
    }

    // Check for overlapping memberships if dates are provided
    if (startDate || endDate) {
      const overlappingMembership = await MembersMembership.findOne({
        where: {
          gym_member_id:
            gym_member_id !== undefined
              ? gym_member_id
              : membershipToUpdate.gym_member_id,
          start_date: { [Op.lt]: end_date || membershipToUpdate.end_date },
          end_date: { [Op.gt]: start_date || membershipToUpdate.start_date },
          id: { [Op.ne]: membershipId },
        },
      });

      if (overlappingMembership) {
        return res
          .status(400)
          .send("Membership period overlaps with an existing membership.");
      }
    }

    // Update the membership object with the provided data
    if (gym_member_id !== undefined) {
      membershipToUpdate.gym_member_id = gym_member_id;
    }
    if (membership_plan_id !== undefined) {
      membershipToUpdate.membership_plan_id = membership_plan_id;
    }
    if (start_date !== undefined) {
      membershipToUpdate.start_date = startDate;
    }
    if (end_date !== undefined) {
      membershipToUpdate.end_date = endDate;
    }

    // Save the updated membership
    membershipToUpdate = await membershipToUpdate.save();

    // Send the updated membership details in the response
    res.status(200).json(membershipToUpdate);
  } catch (error) {
    // Handle errors
    console.error("Error updating membership:", error);
    res.status(500).send("Internal server error.");
  }
};

/**
 * @swagger
 * /api/membersMemberships/delete/{membershipId}:
 *   delete:
 *     summary: Delete membership by ID
 *     tags: [MembersMemberships]
 *     description: Delete a membership by its ID.
 *     parameters:
 *       - in: path
 *         name: membershipId
 *         required: true
 *         description: Numeric ID of the membership to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Membership deleted successfully
 *       401:
 *         description: Unauthorized. Only admin or authorized users can delete membership.
 *       404:
 *         description: Membership not found
 *       500:
 *         description: Internal server error
 */
exports.deleteMembersMembershipById = async (req, res) => {
  const membershipId = req.params.membershipId;

  try {
    // Fetch the membership from the database by ID
    const membershipToDelete = await MembersMembership.findByPk(membershipId);

    // Check if membership exists
    if (!membershipToDelete) {
      return res.status(404).send("Membership not found.");
    }

    // Delete the membership from the database
    await membershipToDelete.destroy();

    // Send a success response
    res.sendStatus(204);
  } catch (error) {
    // Handle errors
    console.error("Error deleting membership:", error);
    res.status(500).send("Internal server error.");
  }
};