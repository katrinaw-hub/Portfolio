// Central place for environment configuration.
// Uses sensible defaults for local development.

const config = {
  // Node environment: "development" | "production" | "test"
  env: process.env.NODE_ENV || "development",

  // Port for Express to listen on
  port: process.env.PORT || 3000,

  // Secret key used to sign JWT tokens
  // In real deployments, always set JWT_SECRET in the environment.
  jwtSecret: process.env.JWT_SECRET || "super_secret_change_me",

  // MongoDB connection string
  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/Portfolio",
};

export default config;