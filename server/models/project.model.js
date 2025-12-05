// Represents a portfolio project entry.

import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "Project title is required",
      trim: true,
    },
    role: {
      type: String,
      required: "Role is required",
      trim: true,
    },
    outcome: {
      type: String,
      required: "Outcome is required",
      trim: true,
    },
    // Optional base64 or URL for project image
    image: {
      type: String,
      trim: true,
    },
    completion: {
      type: Date,
      required: "Completion date is required",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index completion for sorted project lists
ProjectSchema.index({ completion: -1 });

export default mongoose.model("Project", ProjectSchema);