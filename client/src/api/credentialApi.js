import auth from "../lib/auth-helper.js";

const API_BASE = "/api/qualifications";

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

const listCredentials = async (signal) => {
  const res = await fetch(API_BASE, { method: "GET", signal });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
};

const createCredential = async (cred) => {
  const jwt = auth.isAuthenticated();
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
    body: JSON.stringify(cred),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to create credential");
  return data;
};

const updateCredential = async (id, cred) => {
  const jwt = auth.isAuthenticated();
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
    body: JSON.stringify(cred),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to update credential");
  return data;
};

const deleteCredential = async (id) => {
  const jwt = auth.isAuthenticated();
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to delete credential");
  return data;
};

export { listCredentials, createCredential, updateCredential, deleteCredential };