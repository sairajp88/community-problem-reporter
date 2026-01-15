import mongoose from "mongoose";

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
        type: [[[Number]]],
        required: true,
      },
    },

    inCharges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

ZoneSchema.index({ geometry: "2dsphere" });

const Zone = mongoose.model("Zone", ZoneSchema);
export default Zone;
