// Public sign-up form with password policy validation.
// On success, shows a dialog and routes user to Signin.

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { createUser } from "../api/userApi.js";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
  });
  const [open, setOpen] = useState(false);

  // Password: at least 8 chars and at least one special character
  const isPasswordValid = (password) => {
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasSpecialChar;
  };

  // Very simple email format check – matches "something@something.something"
  const isEmailValid = (email) => /.+@.+\..+/.test(email);

  // Name: letters & spaces only (no numbers or symbols)
  const isNameValid = (name) => /^[A-Za-z\s]+$/.test(name);

  const handleChange = (field) => (event) => {
    // Clear previous error when user edits any field
    setValues((prev) => ({
      ...prev,
      [field]: event.target.value,
      error: "",
    }));
  };

  const clickSubmit = async () => {
    const trimmedName = values.name.trim();
    const trimmedEmail = values.email.trim();

    // Required fields check
    if (!trimmedName || !trimmedEmail || !values.password) {
      setValues((prev) => ({ ...prev, error: "All fields are required." }));
      return;
    }

    // Name validation: no numbers or symbols
    if (!isNameValid(trimmedName)) {
      setValues((prev) => ({
        ...prev,
        error: "Name must not contain numbers or special characters.",
      }));
      return;
    }

    // Email format validation
    if (!isEmailValid(trimmedEmail)) {
      setValues((prev) => ({
        ...prev,
        error: "Please enter a valid email address.",
      }));
      return;
    }

    // Password policy validation
    if (!isPasswordValid(values.password)) {
      setValues((prev) => ({
        ...prev,
        error:
          "Password must be at least 8 characters and include at least one special character.",
      }));
      return;
    }

    const user = {
      name: trimmedName,
      email: trimmedEmail.toLowerCase(),
      password: values.password,
    };

    try {
      const data = await createUser(user);

      if (data.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        setValues((prev) => ({ ...prev, error: "" }));
        setOpen(true);
      }
    } catch (err) {
      console.error("Signup error", err);
      setValues((prev) => ({
        ...prev,
        error: "Could not create account. Please try again.",
      }));
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Card
        sx={{
          maxWidth: 420,
          margin: "32px auto",
          p: 2,
          textAlign: "center",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sign Up
          </Typography>
          <TextField
            id="name"
            label="Name"
            fullWidth
            margin="normal"
            value={values.name}
            onChange={handleChange("name")}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={values.email}
            onChange={handleChange("email")}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            helperText="At least 8 characters with 1 special character."
            value={values.password}
            onChange={handleChange("password")}
          />
          {values.error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ flexDirection: "column", gap: 1, pb: 2 }}>
          <Button
            variant="contained"
            onClick={clickSubmit}
            sx={{ width: "80%" }}
          >
            Submit
          </Button>
          <Typography variant="body2">
            Already have an account?{" "}
            <RouterLink
              to="/signin"
              style={{ color: "#005d55", textDecoration: "none" }}
            >
              Sign In.
            </RouterLink>
          </Typography>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created. You can now sign in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            component={RouterLink}
            to="/signin"
            variant="contained"
            onClick={handleClose}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Signup;