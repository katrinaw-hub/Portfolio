// Displays portfolio projects.
// - Everyone can view project cards
// - Admin can create, update, delete projects
// - If the DB has no projects, three local sample projects are shown
// - Admin can upload a project image (stored as base64 in MongoDB)

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  CardMedia,
} from "@mui/material";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projectApi.js";
import auth from "../lib/auth-helper.js";

import project1Img from "../assets/project1.png";
import project2Img from "../assets/project2.png";
import project3Img from "../assets/project3.png";

// IDs of the three local sample projects (not in MongoDB)
const isLocalSampleProject = (projectId) =>
  projectId === "p1" || projectId === "p2" || projectId === "p3";

const INITIAL_FORM = {
  title: "",
  role: "",
  outcome: "",
  image: "",
  completion: "",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const jwt = auth.isAuthenticated();
  const isAdmin = jwt?.user?.role === "admin";
  const isEditing = Boolean(editingId);

  // Load projects on mount.
  // In dev, StrictMode causes double-mount, so we ignore AbortError here.
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listProjects(signal)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (Array.isArray(data) && data.length) {
          setProjects(data);
        } else {
          // Seed local projects if DB returns an empty array.
          setProjects([
            {
              _id: "p1",
              title: "Centennial Connect — Student Portal UI",
              image: project1Img,
              role: "Frontend Developer",
              outcome:
                "Built a responsive React/Tailwind UI to view courses and events. Created reusable components, dark mode, and basic accessibility checks.",
              completion: new Date().toISOString(),
            },
            {
              _id: "p2",
              title: "CampusHub API — Microservices Backend",
              image: project2Img,
              role: "Backend Developer",
              outcome:
                "Implemented a Node.js/Express REST API with PostgreSQL, JWT login, role checks, and a small CI pipeline.",
              completion: new Date().toISOString(),
            },
            {
              _id: "p3",
              title: "XN — eXplainable Notes (MERN)",
              image: project3Img,
              role: "Full-Stack Developer (MERN)",
              outcome:
                "MERN course project for note-taking with AI summaries and search. Built REST endpoints, React pages, MongoDB models, and OAuth login.",
              completion: new Date().toISOString(),
            },
          ]);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // ignore unmount aborts
        console.error("listProjects error", err);
        setError("Unable to load projects.");
      });

    return () => abortController.abort();
  }, []);

  const handleChange = (field) => (event) => {
    setFormValues({ ...formValues, [field]: event.target.value });
  };

  // Handle local file selection and turn it into a base64 data URL
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setFormValues((prev) => ({ ...prev, image: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Populate form with existing project for editing
  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormValues({
      title: project.title,
      role: project.role,
      outcome: project.outcome,
      image: project.image || "",
      completion: project.completion ? project.completion.substring(0, 10) : "",
    });
    setImagePreview(project.image || "");
    setError("");
  };

  const resetForm = () => {
    setFormValues(INITIAL_FORM);
    setEditingId(null);
    setImagePreview("");
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

    try {
      // Sample projects are only edited locally (not persisted)
      if (isEditing && isLocalSampleProject(editingId)) {
        setProjects((prev) =>
          prev.map((p) => (p._id === editingId ? { ...p, ...payload } : p))
        );
        resetForm();
        return;
      }

      let data;
      if (isEditing) {
        data = await updateProject(editingId, payload);
      } else {
        data = await createProject(payload);
      }

      if (data?.error) {
        setError(data.error);
      } else {
        if (isEditing) {
          setProjects((prev) =>
            prev.map((p) => (p._id === editingId ? data : p))
          );
        } else {
          setProjects((prev) => [...prev, data]);
        }
        resetForm();
      }
    } catch (err) {
      console.error("save project error", err);
      setError("Failed to save project.");
    }
  };

  const handleDelete = async (id) => {
    setError("");

    // Deleting a local sample project only affects local state
    if (isLocalSampleProject(id)) {
      setProjects((prev) => prev.filter((p) => p._id !== id));
      return;
    }

    try {
      const data = await deleteProject(id);
      if (data?.error) setError(data.error);
      else setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("delete project error", err);
      setError("Failed to delete project.");
    }
  };

  return (
    <Box sx={{ px: 2, mt: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 2, textAlign: "center", color: "primary.main" }}
      >
        Featured Projects
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}

      {/* Admin form for creating/updating a project */}
      {isAdmin && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 600,
            mx: "auto",
            mb: 4,
            p: 3,
            bgcolor: "#ffffff",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {isEditing ? "Edit Project" : "Add Project"}
          </Typography>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={formValues.title}
            onChange={handleChange("title")}
            required
          />
          <TextField
            label="Role"
            fullWidth
            margin="normal"
            value={formValues.role}
            onChange={handleChange("role")}
            required
          />
          <TextField
            label="Outcome"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={formValues.outcome}
            onChange={handleChange("outcome")}
            required
          />

          {/* Image upload */}
          <Box sx={{ mt: 2, mb: 1 }}>
            <Button variant="outlined" component="label">
              Upload Project Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
              The image will be stored with the project and displayed in the
              card.
            </Typography>
          </Box>
          {imagePreview && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption">Preview:</Typography>
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                sx={{
                  display: "block",
                  mt: 0.5,
                  maxHeight: 150,
                  borderRadius: 1,
                }}
              />
            </Box>
          )}

          <TextField
            label="Completion Date"
            type="date"
            fullWidth
            margin="normal"
            value={formValues.completion}
            onChange={handleChange("completion")}
            InputLabelProps={{ shrink: true }}
          />
          <Box
            sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}
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
        </Box>
      )}

      {/* Project cards */}
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: "auto", mb: 4 }}>
        {projects.map((project) => (
          <Grid item xs={12} md={4} key={project._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {project.image && (
                <CardMedia
                  component="img"
                  height="160"
                  image={project.image}
                  alt={project.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {project.title}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Role: {project.role}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {project.outcome}
                </Typography>
                {project.completion && (
                  <Typography variant="caption">
                    Completed on{" "}
                    {new Date(project.completion).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
              {isAdmin && (
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button size="small" onClick={() => handleEdit(project)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Projects;