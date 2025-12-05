// CRUD for Contact messages (Contact Me form).

import Contact from "../models/contact.model.js";
import errorHandler from "./error.controller.js";

// POST /api/contacts
// Public endpoint: store contact message from any visitor.
const create = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const saved = await contact.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// GET /api/contacts
// Admin-only list of all contact messages, newest first.
const list = async (_req, res) => {
  try {
    // .lean() returns plain JS objects instead of full Mongoose documents
    // which is slightly more performant for read-only data.
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json(contacts);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Param middleware: loads contact by ID and attaches it to req.contact
const contactByID = async (req, res, next, id) => {
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    req.contact = contact;
    next();
  } catch (err) {
    res.status(400).json({ error: "Could not retrieve contact" });
  }
};

// GET /api/contacts/:contactId
const read = (req, res) => {
  res.json(req.contact);
};

// PUT /api/contacts/:contactId
const update = async (req, res) => {
  try {
    Object.assign(req.contact, req.body);
    const updated = await req.contact.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// DELETE /api/contacts/:contactId
const remove = async (req, res) => {
  try {
    const deleted = await req.contact.deleteOne();
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// DELETE /api/contacts
// Dangerous operation, admin-only (see routes).
const removeAll = async (_req, res) => {
  try {
    await Contact.deleteMany({});
    res.json({ message: "All contacts removed" });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, list, contactByID, read, update, remove, removeAll };