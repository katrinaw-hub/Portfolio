// REST helpers for the Contact resource.
// - createContact: public (no auth) for "Contact Me" form
// - listContacts/deleteContact: admin-only, require JWT

import auth from "../lib/auth-helper.js";

const API_BASE = "/api/contacts";

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

const createContact = async (contact) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to send message");
  return data;
};

const listContacts = async (signal) => {
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

const deleteContact = async (id) => {
  const jwt = auth.isAuthenticated();
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to delete contact");
  return data;
};

export { createContact, listContacts, deleteContact };
