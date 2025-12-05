// Handles authentication (signin/signout) and auth-related middleware.

import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import User from "../models/user.model.js";
import config from "../config/config.js";

// POST /auth/signin
// 1. Look up user by email
// 2. Verify password via User.authenticate()
// 3. Issue signed JWT with _id + role
const signin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "Email and password don't match." });
    }

    // Include only what is needed in the token payload
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: "2h" } // token expiry for better security
    );

    // Send token in cookie as well (optional, but useful for some flows)
    res.cookie("t", token, { expire: new Date() + 9999 });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("signin error:", err);
    return res.status(401).json({ error: "Could not sign in" });
  }
};

// GET /auth/signout
// Clears the auth cookie and returns a simple success message.
const signout = (_req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ message: "signed out" });
};

// Middleware that verifies JWT and attaches decoded payload as req.auth.
// Used to protect routes that require login.
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

// Middleware for user-specific authorization:
// Allows access if:
//  - the logged-in user matches the profile being accessed, OR
//  - the logged-in user is an admin.
const hasAuthorization = (req, res, next) => {
  const isSameUser =
    req.profile &&
    req.auth &&
    String(req.profile._id) === String(req.auth._id);

  const isAdmin = req.auth && req.auth.role === "admin";

  if (!isSameUser && !isAdmin) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();
};

// Middleware that only allows admin users.
const requireAdmin = (req, res, next) => {
  if (req.auth && req.auth.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Admin privileges required" });
};

export default { signin, signout, requireSignin, hasAuthorization, requireAdmin };