// Shows education/qualification credentials.
// - Everyone can view the table
// - Admin can add/edit/delete credentials
// - Two initial credentials are seeded locally if DB is empty.
//   (IDs c1 / c2 are treated as local-only records.)

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  listCredentials,
  createCredential,
  updateCredential,
  deleteCredential,
} from "../api/credentialApi.js";
import auth from "../lib/auth-helper.js";

// Local seed IDs for initial credentials that don't exist in MongoDB
const isLocalSampleCredential = (credentialId) =>
  credentialId === "c1" || credentialId === "c2";

const INITIAL_FORM = {
  type: "",
  name: "",
  organization: "",
  completion: "",
  description: "",
};

const Credentials = () => {
  const [credentials, setCredentials] = useState([]);
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const jwt = auth.isAuthenticated();
  const isAdmin = jwt?.user?.role === "admin";
  const isEditing = Boolean(editingId);

  // Load credentials on mount.
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listCredentials(signal)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (Array.isArray(data) && data.length) {
          setCredentials(data);
        } else {
          // Pre-populate given credentials if DB empty or returns []
          setCredentials([
            {
              _id: "c1",
              type: "Education",
              name: "Software Engineering Technology – AI (Co-op) Advanced Diploma",
              organization: "Centennial College, Toronto, ON",
              completion: new Date("2024-09-01").toISOString(),
              description:
                "GPA: 4.36/4.5. Relevant: Advanced Database Concepts (SQL), Java, C#, Testing & QA, Software Systems Design, Web & Mobile App Development, Data Structures.",
            },
            {
              _id: "c2",
              type: "Education",
              name: "Bachelor of Business Administration - Information Management (Information Systems Auditing Stream)",
              organization: "City University of Hong Kong, Hong Kong",
              completion: new Date("2021-01-01").toISOString(),
              description:
                "Relevant: Business Programming in Python, Data Visualization, Cybersecurity for Business, Governance & Regulatory Compliance for Financial Information Systems, Information Systems Audit.",
            },
          ]);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("listCredentials error", err);
        setError("Unable to load credentials.");
      });

    return () => abortController.abort();
  }, []);

  const handleChange = (field) => (event) =>
    setFormValues({ ...formValues, [field]: event.target.value });

  // Populate form for editing
  const handleEdit = (cred) => {
    setEditingId(cred._id);
    setFormValues({
      type: cred.type,
      name: cred.name,
      organization: cred.organization,
      completion: cred.completion ? cred.completion.substring(0, 10) : "",
      description: cred.description || "",
    });
    setError("");
  };

  const resetForm = () => {
    setFormValues(INITIAL_FORM);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      ...formValues,
      completion: formValues.completion
        ? new Date(formValues.completion).toISOString()
        : new Date().toISOString(),
    };

    // Local-only sample credentials are edited only in memory
    if (isEditing && isLocalSampleCredential(editingId)) {
      setCredentials((prev) =>
        prev.map((c) => (c._id === editingId ? { ...c, ...payload } : c))
      );
      resetForm();
      return;
    }

    let data;
    if (isEditing) {
      data = await updateCredential(editingId, payload);
    } else {
      data = await createCredential(payload);
    }

    if (data?.error) {
      setError(data.error);
    } else {
      if (isEditing) {
        setCredentials((prev) =>
          prev.map((c) => (c._id === editingId ? data : c))
        );
      } else {
        setCredentials((prev) => [...prev, data]);
      }
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    setError("");

    // Delete sample credentials locally
    if (isLocalSampleCredential(id)) {
      setCredentials((prev) => prev.filter((c) => c._id !== id));
      return;
    }

    const data = await deleteCredential(id);
    if (data?.error) setError(data.error);
    else setCredentials((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mb: 2, color: "primary.main" }}
      >
        Credentials
      </Typography>

      {/* Admin-only create / update form */}
      {isAdmin && (
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 800,
            mx: "auto",
            mb: 3,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {isEditing ? "Edit Credential" : "Add Credential"}
          </Typography>
          <TextField
            label="Type (e.g. Education)"
            fullWidth
            margin="normal"
            value={formValues.type}
            onChange={handleChange("type")}
            required
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formValues.name}
            onChange={handleChange("name")}
            required
          />
          <TextField
            label="Organization"
            fullWidth
            margin="normal"
            value={formValues.organization}
            onChange={handleChange("organization")}
            required
          />
          <TextField
            label="Completion Date"
            type="date"
            fullWidth
            margin="normal"
            value={formValues.completion}
            onChange={handleChange("completion")}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formValues.description}
            onChange={handleChange("description")}
          />
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            {isEditing && (
              <Button onClick={resetForm} variant="text">
                Cancel
              </Button>
            )}
            <Button type="submit" variant="contained">
              {isEditing ? "Update" : "Create"}
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Paper>
      )}

      {/* Read-only table for everyone (admin also gets Actions column) */}
      <Box sx={{ maxWidth: 1000, mx: "auto", mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Completion</TableCell>
              <TableCell>Description</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {credentials.map((cred) => (
              <TableRow key={cred._id}>
                <TableCell>{cred.type}</TableCell>
                <TableCell>{cred.name}</TableCell>
                <TableCell>{cred.organization}</TableCell>
                <TableCell>
                  {cred.completion
                    ? new Date(cred.completion).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>{cred.description}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(cred)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(cred._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Credentials;