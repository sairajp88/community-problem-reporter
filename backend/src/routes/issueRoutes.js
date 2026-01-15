import express from "express";
import {
  createIssue,
  getIssues,
  getIssueById,
} from "../controllers/issueController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("images", 5),
  createIssue
);

router.get("/", protect, getIssues);
router.get("/:id", protect, getIssueById);

export default router;
