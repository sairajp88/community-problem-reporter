import express from "express";
import {
  createIssue,
  getIssues,
  getIssueById,
} from "../controllers/issueController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { addComment, getComments } from "../controllers/issueController.js";


const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("images", 5),
  createIssue
);

router.get("/", protect, getIssues);
router.get("/:id", protect, getIssueById);
router.get("/:id/comments", protect, getComments);
router.post("/:id/comments", protect, addComment);


export default router;
