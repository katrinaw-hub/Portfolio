// Admin-only page for full CRUD on users:
// - Lists all users from /api/users
// - Allows admin to create new users
// - Allows admin to update name/email/role and optionally password
// - Allows admin to delete users

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userApi.js";

// Initial empty state for the form
const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  role: "user",
};

// Simple password policy helper used by both Signup and Admin
const isPasswordValid = (password) => {
  if (!password) return false;
  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasMinLength && hasSpecialChar;
};

const AdminUsers = () => {
  const jwt = auth.isAuthenticated();
  const isAdmin = jwt?.user?.role === "admin";

  const [users, setUsers] = useState([]);
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const isEditing = Boolean(editingId);

  // Load all users on mount for admins
  useEffect(() => {
    if (!isAdmin) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    listUsers(signal)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (Array.isArray(data)) {
          setUsers(data);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("listUsers error", err);
        setError("Unable to load users.");
      });

    return () => abortController.abort();
  }, [isAdmin]);

  // Non-admins should never reach this page; redirect just in case
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  const handleChange = (field) => (event) =>
    setFormValues({ ...formValues, [field]: event.target.value });

  const resetForm = () => {
    setFormValues(INITIAL_FORM);
    setEditingId(null);
    setError("");
  };

  // Populate the form with the selected user for editing
  const handleEdit = (user) => {
    setEditingId(user._id);
    setFormValues({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role || "user",
    });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formValues.name || !formValues.email) {
      setError("Name and email are required.");
      return;
    }

    // For a new user, password is required and must meet the policy
    if (!isEditing) {
      if (!isPasswordValid(formValues.password)) {
        setError(
          "Password must be at least 8 characters and include at least one special character."
        );
        return;
      }
    }

    // Build payload; only include password on update if user typed a new one
    const payload = {
      name: formValues.name,
      email: formValues.email,
      role: formValues.role,
    };

    if (formValues.password) {
      if (!isPasswordValid(formValues.password)) {
        setError(
          "Password must be at least 8 characters and include at least one special character."
        );
        return;
      }
      payload.password = formValues.password;
    }

    let data;
    if (isEditing) {
      data = await updateUser(editingId, payload);
    } else {
      data = await createUser(payload);
    }

    if (data?.error) {
      setError(data.error);
      return;
    }

    // Update local list without refetching from server
    if (isEditing) {
      setUsers((prev) =>
        prev.map((u) => (u._id === editingId ? data : u))
      );
    } else {
      setUsers((prev) => [...prev, data]);
    }
    resetForm();
  };

  const handleDelete = async (id) => {
    setError("");
    const data = await deleteUser(id);
    if (data?.error) {
      setError(data.error);
      return;
    }
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mb: 2, color: "primary.main" }}
      >
        User Management
      </Typography>

      {/* Create / update form */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 600, mx: "auto", p: 3, mb: 3 }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isEditing ? "Edit User" : "Create User"}
        </Typography>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={formValues.name}
          onChange={handleChange("name")}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={formValues.email}
          onChange={handleChange("email")}
        />
        <TextField
          label={isEditing ? "New Password (optional)" : "Password"}
          type="password"
          fullWidth
          margin="normal"
          value={formValues.password}
          onChange={handleChange("password")}
          helperText="At least 8 characters with 1 special character."
        />
        <TextField
          select
          label="Role"
          fullWidth
          margin="normal"
          value={formValues.role}
          onChange={handleChange("role")}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {isEditing && (
            <Button variant="text" onClick={resetForm}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained">
            {isEditing ? "Update" : "Create"}
          </Button>
        </Box>
      </Paper>

      {/* User list table */}
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          All Users
        </Typography>
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    {u.created ? new Date(u.created).toLocaleDateString() : ""}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(u)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminUsers;