// Stores a single message from the Contact form.

import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: "First name is required",
      trim: true,
    },
    lastName: {
      type: String,
      required: "Last name is required",
      trim: true,
    },
    email: {
      type: String,
      required: "Email is required",
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    // Email of the logged-in user sending the message (if available)
    userEmail: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index by createdAt for efficient "newest first" queries
ContactSchema.index({ createdAt: -1 });

export default mongoose.model("Contact", ContactSchema);