// CRUD for portfolio Projects.

import Project from "../models/project.model.js";
import errorHandler from "./error.controller.js";

// POST /api/projects
// Admin-only: create a new project, optionally with base64 image.
const create = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.auth?._id || undefined,
    });
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// GET /api/projects
// Public: list all projects, sorted by completion date (most recent first).
const list = async (_req, res) => {
  try {
    const projects = await Project.find().sort({ completion: -1 });
    res.json(projects);
  } catch (err) {
    console.error("Project list error:", err);
    res.status(400).json({ error: "Unable to load projects." });
  }
};


// Param middleware: loads project into req.project
const projectByID = async (req, res, next, id) => {
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    req.project = project;
    next();
  } catch (err) {
    res.status(400).json({ error: "Could not retrieve project" });
  }
};

// GET /api/projects/:projectId
const read = (req, res) => {
  res.json(req.project);
};

// PUT /api/projects/:projectId
const update = async (req, res) => {
  try {
    Object.assign(req.project, req.body);
    const updated = await req.project.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// DELETE /api/projects/:projectId
const remove = async (req, res) => {
  try {
    const deleted = await req.project.deleteOne();
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// DELETE /api/projects
const removeAll = async (_req, res) => {
  try {
    await Project.deleteMany({});
    res.json({ message: "All projects removed" });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, list, projectByID, read, update, remove, removeAll };