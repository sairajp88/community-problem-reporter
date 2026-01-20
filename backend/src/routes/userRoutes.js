import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/users
 * Admin: fetch all users (for zone assignment UI)
 */
router.get(
  "/",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select(
        "_id name email role assignedZones"
      );

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * PATCH /api/users/:id/assign-zones
 * Admin assigns zones to a zone manager
 */
router.patch(
  "/:id/assign-zones",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { zoneIds } = req.body;

      // ✅ Validate user id
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }

      // ✅ Validate payload
      if (!Array.isArray(zoneIds)) {
        return res
          .status(400)
          .json({ message: "zoneIds must be an array" });
      }

      // ✅ Ensure all zoneIds are valid ObjectIds
      const invalidZone = zoneIds.find(
        (id) => !mongoose.Types.ObjectId.isValid(id)
      );

      if (invalidZone) {
        return res
          .status(400)
          .json({ message: "Invalid zone id detected" });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ⚠️ Only allow assignment to zone managers
      if (user.role !== "zone_manager") {
        return res.status(400).json({
          message: "Zones can only be assigned to zone managers",
        });
      }

      user.assignedZones = zoneIds;
      await user.save();

      res.json({
        message: "Zones assigned successfully",
        assignedZones: user.assignedZones,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
