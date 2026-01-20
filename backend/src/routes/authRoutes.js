import express from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { z } from "zod";

const router = express.Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([
    "admin",
    "zone_manager",
    "subzone_manager",
    "resident",
  ]).optional(),
});

router.post("/signup", async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create(data);
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedZones: user.assignedZones || [],
      },
      token,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedZones: user.assignedZones || [],
      },
      token,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors });
    }
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
