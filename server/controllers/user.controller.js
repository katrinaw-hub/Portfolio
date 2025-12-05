// CRUD for users (signup + admin management).

import User from "../models/user.model.js";
import errorHandler from "./error.controller.js";

// POST /api/users
// Public: sign up a new user (used by Signup).
// Also used by admin to create new users from the dashboard.
const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();

    // Return a sanitized user object (no password fields)
    const { _id, name, email, role, created, updated } = user;
    return res.status(201).json({ _id, name, email, role, created, updated });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// GET /api/users
// Admin-only: list all users with basic fields.
const list = async (_req, res) => {
  try {
    const users = await User.find()
      .select("name email role updated created");
    res.json(users);
  } catch (err) {
    console.error("User list error:", err);
    return res.status(400).json({ error: "Unable to load users." });
  }
};


// Param middleware: load user by ID into req.profile
const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user)
      return res.status(400).json({ error: "User not found" });

    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

// GET /api/users/:userId
// Sanitize hashed password + salt before sending.
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// PUT /api/users/:userId
// Allows user (or admin) to update their profile.
// If password is included in body, the virtual will handle hashing.
const update = async (req, res) => {
  try {
    let user = req.profile;
    user = Object.assign(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// DELETE /api/users/:userId
const remove = async (req, res) => {
  try {
    const user = req.profile;
    const deletedUser = await user.deleteOne();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// DELETE /api/users
// Admin-only: hard delete all users (used very carefully).
const removeAll = async (_req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "All users removed" });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, userByID, read, list, remove, removeAll, update };