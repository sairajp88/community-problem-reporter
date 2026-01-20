import Issue from "../models/Issue.js";
import Zone from "../models/Zone.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { booleanPointInPolygon } from "@turf/turf";
import mongoose from "mongoose";
import { io } from "../server.js";

/**
 * POST /api/issues
 * Create new issue
 */
export const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      severity,
      latitude,
      longitude,
    } = req.body;

    if (!title || !description || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // GeoJSON point
    const point = {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
    };

    // Find matching zone
    const zones = await Zone.find();
    let matchedZone = null;

    for (const zone of zones) {
      if (booleanPointInPolygon(point, zone.geometry)) {
        matchedZone = zone;
        break;
      }
    }

    if (!matchedZone) {
      return res
        .status(400)
        .json({ message: "Location does not fall within any zone" });
    }

    // Upload images (optional)
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      severity,
      location: point,
      zone: matchedZone._id,
      images: imageUrls,
      createdBy: req.user._id,
    });

    // 🔔 Real-time: new issue
    io.to(`zone:${issue.zone}`).emit("issue:new", issue);

    if (issue.severity === "emergency") {
      io.to("admin").emit("issue:emergency", issue);
    }

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/issues
 * Visibility rules:
 * - admin → all issues
 * - resident → all issues
 * - zone_manager / subzone_manager → assigned zones only
 */
export const getIssues = async (req, res) => {
  try {
    let filter = {};

    if (
      req.user.role === "zone_manager" ||
      req.user.role === "subzone_manager"
    ) {
      filter.zone = { $in: req.user.assignedZones || [] };
    }

    const issues = await Issue.find(filter)
      .populate("zone", "name level")
      .populate("createdBy", "_id name role"); // ✅ FIXED

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/issues/:id
 */
export const getIssueById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid issue id" });
    }

    const issue = await Issue.findById(req.params.id)
      .populate("zone", "name level")
      .populate("createdBy", "_id name role"); // ✅ FIXED

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/issues/:id/comments
 */
export const addComment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid issue id" });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.comments.push({
      user: req.user._id,
      text,
    });

    await issue.save();

    const newComment = issue.comments[issue.comments.length - 1];

    io.to(`zone:${issue.zone}`).emit("comment:new", {
      issueId: issue._id,
      comment: newComment,
    });

    res.status(201).json(issue.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/issues/:id/comments
 */
export const getComments = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid issue id" });
    }

    const issue = await Issue.findById(req.params.id).populate(
      "comments.user",
      "name"
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
