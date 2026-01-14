import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["road", "garbage", "water", "electricity", "other"],
      default: "other",
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
    },

    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },

    severity: {
      type: String,
      enum: ["normal", "emergency"],
      default: "normal",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Geo index for map queries
issueSchema.index({ location: "2dsphere" });

// Fast zone filtering
issueSchema.index({ zone: 1 });

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
