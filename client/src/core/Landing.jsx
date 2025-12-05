// Public landing page shown before login.
// Encourages user to sign in or create an account.

import { Box, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8, px: 2 }}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 800,
          textAlign: "left",
          background: "#ffffff",
        }}
      >
        <Typography
          variant="h3"
          sx={{ mb: 2, color: "primary.main", fontWeight: 700 }}
        >
          Welcome! Sign in to see my profile
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Hi, I&apos;m Katrina 👋. This portfolio shows how I use the MERN stack
          and AI tools to build secure, accessible web apps. Sign in to explore
          my projects, credentials, and services.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/signin")}
          sx={{ mr: 2 }}
        >
          Sign In
        </Button>
        <Button variant="outlined" onClick={() => navigate("/signup")}>
          Create an account
        </Button>
      </Paper>
    </Box>
  );
};

export default Landing;