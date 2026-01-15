import express from "express";
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
} from "../controllers/issueController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
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

router.put(
  "/:id/status",
  protect,
  authorize("admin", "zone_manager"),
  updateIssueStatus
);

export default router;
