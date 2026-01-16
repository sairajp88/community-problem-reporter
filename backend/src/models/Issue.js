import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
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
      default: "general",
    },

    severity: {
      type: String,
      enum: ["normal", "emergency"],
      default: "normal",
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
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
        type: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

IssueSchema.index({ location: "2dsphere" });

const Issue = mongoose.model("Issue", IssueSchema);
export default Issue;
