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
    "mongodb+srv://hswng2_db_user:<Abcd1234!>@cluster0.belbt2l.mongodb.net/?appName=Cluster0",
};

export default config;
