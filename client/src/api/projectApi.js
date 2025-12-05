// REST helpers for portfolio Projects.
import auth from "../lib/auth-helper.js";

const API_BASE = "/api/projects";

// Small helper to parse JSON safely and give useful errors
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

const listProjects = async (signal) => {
  try {
    const res = await fetch(API_BASE, { method: "GET", signal });
    const data = await parseJson(res);

    if (!res.ok) {
      // Bubble up a human-readable message
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    // Let components decide whether to ignore AbortError
    throw err;
  }
};

const createProject = async (project) => {
  const jwt = auth.isAuthenticated();
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
    body: JSON.stringify(project),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to create project");
  return data;
};

const updateProject = async (id, project) => {
  const jwt = auth.isAuthenticated();
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
    body: JSON.stringify(project),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to update project");
  return data;
};

const deleteProject = async (id) => {
  const jwt = auth.isAuthenticated();
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to delete project");
  return data;
};

export { listProjects, createProject, updateProject, deleteProject };