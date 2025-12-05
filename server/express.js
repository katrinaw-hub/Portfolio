// Configures Express app:
// - JSON/body parsing (with larger limit for base64 images)
// - Security + compression middleware
// - All API routes
// - Central error handler for auth + other errors.

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import credentialRoutes from "./routes/credential.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();

// Allow larger JSON payloads (for base64-encoded images)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// Mount routes
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", projectRoutes);
app.use("/", credentialRoutes);
app.use("/", contactRoutes);

// Global error handler: mainly catches UnauthorizedError from express-jwt
app.use((err, _req, res, _next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    console.error("Express error:", err);
    res.status(400).json({ error: err.name + ": " + err.message });
  }
});

export default app;