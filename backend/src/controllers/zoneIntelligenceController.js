import Zone from "../models/Zone.js";
import Issue from "../models/Issue.js";

/**
 * GET /api/zones/intelligence
 * Returns per-zone issue statistics
 */
export const getZoneIntelligence = async (req, res) => {
  try {
    const { role, assignedZones } = req.user;

    let zoneFilter = {};

    // 🔐 Role-based zone filtering
    if (role === "zone_manager" || role === "subzone_manager") {
      zoneFilter._id = { $in: assignedZones || [] };
    }

    if (role === "resident") {
      return res
        .status(403)
        .json({ message: "Access denied" });
    }

    const zones = await Zone.find(zoneFilter).select(
      "_id name level"
    );

    const results = [];

    for (const zone of zones) {
      const issues = await Issue.find({ zone: zone._id });

      const stats = {
        total: issues.length,
        open: issues.filter(
          (i) => i.status !== "resolved"
        ).length,
        resolved: issues.filter(
          (i) => i.status === "resolved"
        ).length,
        emergency: issues.filter(
          (i) => i.severity === "emergency"
        ).length,
      };

      results.push({
        _id: zone._id,
        name: zone.name,
        level: zone.level,
        stats,
      });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
