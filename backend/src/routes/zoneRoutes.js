const express = require("express");
const Zone = require("../models/Zone");

const router = express.Router();

/**
 * @route   POST /api/zones
 * @desc    Create a new zone
 */
router.post("/", async (req, res) => {
  try {
    const zone = await Zone.create(req.body);
    res.status(201).json(zone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   GET /api/zones
 * @desc    Get all zones
 */
router.get("/", async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
