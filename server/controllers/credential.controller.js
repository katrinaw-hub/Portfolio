// CRUD for education / professional qualifications.

import Credential from "../models/credential.model.js";
import errorHandler from "./error.controller.js";

// POST /api/qualifications
// Admin-only: create a new credential.
// createdBy is populated from req.auth._id if available.
const create = async (req, res) => {
  try {
    const credential = new Credential({
      ...req.body,
      createdBy: req.auth?._id || undefined,
    });
    const saved = await credential.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// GET /api/qualifications
// Public: list all credentials, sorted by completion date (most recent first).
const list = async (_req, res) => {
  try {
    const creds = await Credential.find().sort({ completion: -1 });
    res.json(creds);
  } catch (err) {
    console.error("Credential list error:", err);
    res.status(400).json({ error: "Unable to load credentials." });
  }
};


// Param middleware: loads credential by ID into req.credential
const credentialByID = async (req, res, next, id) => {
  try {
    const credential = await Credential.findById(id);
    if (!credential) {
      return res.status(404).json({ error: "Credential not found" });
    }
    req.credential = credential;
    next();
  } catch (err) {
    res.status(400).json({ error: "Could not retrieve credential" });
  }
};

// GET /api/qualifications/:credentialId
const read = (req, res) => {
  res.json(req.credential);
};

// PUT /api/qualifications/:credentialId
const update = async (req, res) => {
  try {
    Object.assign(req.credential, req.body);
    const updated = await req.credential.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// DELETE /api/qualifications/:credentialId
const remove = async (req, res) => {
  try {
    const deleted = await req.credential.deleteOne();
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// DELETE /api/qualifications
const removeAll = async (_req, res) => {
  try {
    await Credential.deleteMany({});
    res.json({ message: "All credentials removed" });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default {
  create,
  list,
  credentialByID,
  read,
  update,
  remove,
  removeAll,
};