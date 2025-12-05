// API helpers for User CRUD (used by Signup + AdminUsers).

import auth from "../lib/auth-helper.js";

const API_BASE = "/api/users";

const parseJson = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(
      `Invalid JSON from ${API_BASE} (status ${res.status}). Body starts with: ${text.slice(
        0,
        80
      )}`
    );
  }
};


// GET /api/users  (admin only)
const listUsers = async (signal) => {
  const jwt = auth.isAuthenticated();
  const res = await fetch(API_BASE, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
    signal,
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
};

// POST /api/users  (public signup + admin create)
const createUser = async (user) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to create user");
  return data;
};

// PUT /api/users/:id  (user or admin)
const updateUser = async (id, user) => {
  const jwt = auth.isAuthenticated();
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
    body: JSON.stringify(user),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to update user");
  return data;
};

// DELETE /api/users/:id  (user or admin)
const deleteUser = async (id) => {
  const jwt = auth.isAuthenticated();
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to delete user");
  return data;
};

export { listUsers, createUser, updateUser, deleteUser };