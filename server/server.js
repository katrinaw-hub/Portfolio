// Entry point for the backend:
// - Connects to MongoDB
// - Seeds a default admin user if one doesn't exist
// - Starts Express server.

import mongoose from "mongoose";
import config from "./config/config.js";
import app from "./express.js";
import User from "./models/user.model.js";

mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose
  .connect(config.mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB:", config.mongoUri);

    // Seed default admin (required for the assignment)
    const adminEmail = "admin@portfolio.local";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = new User({
        name: "Portfolio Admin",
        email: adminEmail,
        password: "Admin123!", // handled by virtual; will be hashed + validated
        role: "admin",
      });
      await admin.save();
      console.log("Seeded admin user:", adminEmail);
    }
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Extra safety in case of runtime connection errors
mongoose.connection.on("error", () => {
  throw new Error("Unable to connect to database: " + config.mongoUri);
});

// Start HTTP server
app.listen(config.port, () => {
  console.log("Server running on port", config.port);
});