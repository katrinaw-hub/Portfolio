// Represents an education or professional qualification.

import mongoose from "mongoose";

const CredentialSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: "Type is required", // e.g., Education / Qualification
      trim: true,
    },
    name: {
      type: String,
      required: "Name is required",
      trim: true,
    },
    organization: {
      type: String,
      required: "Organization is required",
      trim: true,
    },
    completion: {
      type: Date,
      required: "Completion date is required",
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index completion for sorted queries
CredentialSchema.index({ completion: -1 });

export default mongoose.model("Credential", CredentialSchema);