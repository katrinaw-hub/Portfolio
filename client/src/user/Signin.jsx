// Sign-in form with simple client-side validation and clear error messages.

import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Navigate, useLocation, Link as RouterLink } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import { signin } from "../lib/api-auth.js";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Signin = () => {
  const location = useLocation();
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  });

  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = () => {
    // Front-end validation for required fields
    if (!values.email || !values.password) {
      setValues({
        ...values,
        error: "Email and password are required.",
      });
      return;
    }

    const user = {
      email: values.email,
      password: values.password,
    };

    signin(user).then((data) => {
      if (data?.error) {
        // Backend error (invalid credentials, user not found, etc.)
        setValues({ ...values, error: data.error });
      } else {
        auth.authenticate(data, () => {
          setValues({
            ...values,
            error: "",
            redirectToReferrer: true,
          });
        });
      }
    });
  };

  // Redirect to the original protected page if provided; otherwise /home
  const { from } = location.state || { from: { pathname: "/home" } };

  if (values.redirectToReferrer) {
    return <Navigate to={from} replace />;
  }

  return (
    <Card
      sx={{
        maxWidth: 420,
        margin: "32px auto",
        textAlign: "center",
        pb: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Sign In
        </Typography>
        <TextField
          id="email"
          type="email"
          label="Email"
          sx={{ width: "80%", mt: 2 }}
          value={values.email}
          onChange={handleChange("email")}
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          sx={{ width: "80%", mt: 2 }}
          value={values.password}
          onChange={handleChange("password")}
        />
        {values.error && (
          <Typography
            component="p"
            color="error"
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ErrorOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
            {values.error}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ flexDirection: "column", gap: 1, pb: 2 }}>
        <Button variant="contained" onClick={clickSubmit} sx={{ width: "80%" }}>
          Submit
        </Button>
        <Typography variant="body2">
          Don&apos;t have an account?{" "}
          <RouterLink
            to="/signup"
            style={{ color: "#005d55", textDecoration: "none" }}
          >
            Sign Up.
          </RouterLink>
        </Typography>
      </CardActions>
    </Card>
  );
};

export default Signin;