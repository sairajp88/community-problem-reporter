import Issue from "../models/Issue.js";
import Zone from "../models/Zone.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { booleanPointInPolygon } from "@turf/turf";

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

    // 🔹 GeoJSON point
    const point = {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
    };

    // 🔹 Find matching zone
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

    // 🔹 Upload images (optional)
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
