// Home page after login.
// - For normal users: friendly welcome + mission statement + About button
// - For admin: dashboard-style welcome and a message panel showing whether
//   new contact messages exist.

import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import { listContacts } from "../api/contactApi.js";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jwt = auth.isAuthenticated();
  const name = jwt?.user?.name || "there";
  const isAdmin = jwt?.user?.role === "admin";

  const [hasMessages, setHasMessages] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  // When redirected from Contact form, we may receive a firstName in state
  const contactState = location.state?.contact;

  // Admin: check if any messages exist
  useEffect(() => {
    if (!isAdmin) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoadingMessages(true);
    listContacts(signal)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
          setHasMessages(false);
        } else {
          setError("");
          setHasMessages(Array.isArray(data) && data.length > 0);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          // Ignore abort caused by StrictMode/unmount
          return;
        }
        console.error("Home listContacts error", err);
        setError("Could not load messages.");
        setHasMessages(false);
      })
      .finally(() => setLoadingMessages(false));

    return () => abortController.abort();
  }, [isAdmin]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, px: 2 }}>
      <Paper sx={{ p: 4, maxWidth: 900 }}>
        {/* Success alert after sending contact form */}
        {contactState && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Thanks for your message
            {contactState.firstName ? `, ${contactState.firstName}` : ""}! I&apos;ll
            get back to you soon.
          </Alert>
        )}

        {/* Different intro for admin vs normal user */}
        {isAdmin ? (
          <>
            <Typography
              variant="h4"
              sx={{ mb: 1, color: "primary.main", fontWeight: 700 }}
            >
              Welcome, Admin {name}
            </Typography>
            <Typography sx={{ mb: 2 }}>
              This is your Admin Dashboard. From here you can manage projects,
              credentials, users, and review incoming contact messages.
            </Typography>

            {/* Message status panel */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "#f0faf8",
                border: "1px solid rgba(0,93,85,0.15)",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Messages
              </Typography>
              {loadingMessages ? (
                <Typography variant="body2">
                  Checking for new messages…
                </Typography>
              ) : error ? (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              ) : hasMessages ? (
                <Typography variant="body2">
                  You have new message(s)!
                </Typography>
              ) : (
                <Typography variant="body2">
                  You have no new messages.
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <>
            <Typography
              variant="h4"
              sx={{ mb: 1, color: "primary.main", fontWeight: 700 }}
            >
              Welcome, {name} ✨
            </Typography>
            <Typography sx={{ mb: 3 }}>
              You&apos;re in my portfolio dashboard. Use the navigation bar to
              explore my background, featured projects, services, and contact
              details.
            </Typography>
          </>
        )}

        {isAdmin && (
          <Typography sx={{ mb: 3 }}>
            Use the navigation bar to jump to Projects, Credentials, Services,
            Users, and your Contact inbox.
          </Typography>
        )}

        <Typography variant="h6" sx={{ mb: 1 }}>
          Mission Statement
        </Typography>
        <Typography sx={{ mb: 3 }}>
          To build accessible, secure, and scalable web apps that turn real-world
          problems into simple user experiences, infusing AI responsibly to add
          value, not noise.
        </Typography>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Mission Statement
        </Typography>
        <Typography sx={{ mb: 3 }}>
          To build accessible, secure, and scalable web apps that turn real-world
          problems into simple user experiences, infusing AI responsibly to add
          value, not noise.
        </Typography>

        {/* CI/CD demo paragraph – added to prove automatic deployment */}
        <Typography sx={{ mb: 3 }}>
          This paragraph was added as part of my CI/CD demonstration: once this
          change is merged into the main GitHub branch, the pipeline rebuilds
          and redeploys the portfolio app automatically.
        </Typography>

        <Button variant="contained" onClick={() => navigate("/about")}>
          About Me
        </Button>
      </Paper>
    </Box>
  );
};

export default Home;