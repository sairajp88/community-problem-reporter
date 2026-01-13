const express = require("express");
const Zone = require("../models/Zone");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/zones
 * Access: Any authenticated user
 */
router.get("/", protect, async (req, res) => {
  const zones = await Zone.find();
  res.json(zones);
});

/**
 * POST /api/zones
 * Access: Admin only
 */
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const zone = await Zone.create(req.body);
    res.status(201).json(zone);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
