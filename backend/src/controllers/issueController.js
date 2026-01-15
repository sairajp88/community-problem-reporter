import Issue from "../models/Issue.js";
import Zone from "../models/Zone.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { booleanPointInPolygon } from "@turf/turf";

/**
 * POST /api/issues
 * Create a new issue
 */
export const createIssue = async (req, res) => {
  try {
    const { title, description, category, severity, latitude, longitude } =
      req.body;

    if (!title || !description || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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

    // Upload images (if any)
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

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/issues
 * Get issues (admin = all, others = assigned zones)
 */
export const getIssues = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== "admin") {
      filter.zone = { $in: req.user.assignedZones || [] };
    }

    const issues = await Issue.find(filter)
      .populate("zone", "name level")
      .populate("createdBy", "name");

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
    const issue = await Issue.findById(req.params.id)
      .populate("zone", "name level")
      .populate("createdBy", "name");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/issues/:id/status
 */
export const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["open", "in-progress", "resolved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = status;
    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
