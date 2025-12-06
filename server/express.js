import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import credentialRoutes from "./routes/credential.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", projectRoutes);
app.use("/", credentialRoutes);
app.use("/", contactRoutes);

// --- serve the built React app ---
const clientDistPath = path.join(__dirname, "../client/dist"); // use "../client/dist" if folder is lowercase

app.use(express.static(clientDistPath));

app.get("*", (req, res) => {
  // keep API routes separate
  if (req.path.startsWith("/api") || req.path.startsWith("/auth")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.sendFile(path.join(clientDistPath, "index.html"));
});
// ----------------------------------

app.use((err, _req, res, _next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.error(err);
  }
});

export default app;
