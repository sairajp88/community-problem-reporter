const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: ["city", "sector", "area", "society"],
      required: true,
    },

    parentZone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      default: null,
    },

    geometry: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true,
      },
      coordinates: {
        type: [[[Number]]], // GeoJSON Polygon
        required: true,
      },
    },

    inCharges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // future sprint
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 🔥 REQUIRED for geospatial queries
ZoneSchema.index({ geometry: "2dsphere" });

module.exports = mongoose.model("Zone", ZoneSchema);
