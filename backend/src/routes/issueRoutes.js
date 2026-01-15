import express from "express";
import { createIssue } from "../controllers/issueController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * POST /api/issues
 * Protected
 */
router.post(
  "/",
  protect,
  upload.array("images", 5),
  createIssue
);

export default router;
