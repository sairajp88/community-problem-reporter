const express = require("express");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { z } = require("zod");

const router = express.Router();

/**
 * Signup validation schema
 */
const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "zone_manager", "subzone_manager", "resident"]).optional(),
});

/**
 * POST /api/auth/signup
 */
router.post("/signup", async (req, res) => {
  try {
    // 1️⃣ Validate input
    const data = signupSchema.parse(req.body);

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Create user (password is hashed automatically)
    const user = await User.create(data);

    // 4️⃣ Generate JWT
    const token = generateToken(user);

    // 5️⃣ Respond
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
  console.error("SIGNUP ERROR:", err);

  if (err.name === "ZodError") {
    return res.status(400).json({ message: err.errors });
  }

  res.status(500).json({ message: err.message });
}
});

module.exports = router;
