import express from "express";
import Zone from "../models/Zone.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/zones
 * Access: Any authenticated user
 */
router.get("/", protect, async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/zones
 * Access: Admin only
 */
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const zone = await Zone.create(req.body);
    res.status(201).json(zone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
