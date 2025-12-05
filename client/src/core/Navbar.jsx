// Top navigation bar with logo, links, and auth-aware actions.

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import LogoHexagon from "./LogoHexagon.jsx";
import auth from "../lib/auth-helper.js";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jwt = auth.isAuthenticated();
  const isLoggedIn = !!jwt;
  const isAdmin = jwt?.user?.role === "admin";

  // Guests: home icon goes to Landing (/)
  // Logged-in users: home icon goes to /home (Admin dashboard or user home)
  const homePath = isLoggedIn ? "/home" : "/";
  const currentPath = location.pathname;

  const isActive = (path) =>
    currentPath === path ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)";

  return (
    <AppBar position="static" sx={{ backgroundColor: "#005d55" }}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Logo + title, anchored to the left */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
          <LogoHexagon />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Katrina Wong | Portfolio
          </Typography>
        </Box>

        {/* Starting page / Home icon
           - Shown for guests (landing page)
           - Shown for admin (admin dashboard)
           - Hidden for normal logged-in users as requested
        */}
        {(!isLoggedIn || isAdmin) && (
          <IconButton
            component={RouterLink}
            to={homePath}
            aria-label="Home"
            sx={{ color: isActive(homePath) }}
          >
            <HomeIcon />
          </IconButton>
        )}

        {/* Public auth links */}
        {!isLoggedIn && (
          <>
            <Button
              component={RouterLink}
              to="/signin"
              sx={{ color: isActive("/signin") }}
            >
              Sign In
            </Button>
            <Button
              component={RouterLink}
              to="/signup"
              sx={{ color: isActive("/signup") }}
            >
              Sign Up
            </Button>
          </>
        )}

        {/* Authenticated navigation */}
        {isLoggedIn && (
          <>
            <Button
              component={RouterLink}
              to="/home"
              sx={{ color: isActive("/home") }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/about"
              sx={{ color: isActive("/about") }}
            >
              About
            </Button>
            <Button
              component={RouterLink}
              to="/projects"
              sx={{ color: isActive("/projects") }}
            >
              Projects
            </Button>
            <Button
              component={RouterLink}
              to="/credentials"
              sx={{ color: isActive("/credentials") }}
            >
              Credentials
            </Button>
            <Button
              component={RouterLink}
              to="/services"
              sx={{ color: isActive("/services") }}
            >
              Services
            </Button>
            <Button
              component={RouterLink}
              to="/contact"
              sx={{ color: isActive("/contact") }}
            >
              Contact
            </Button>

            {/* Admin-only elements */}
            {isAdmin && (
              <>
                <Typography variant="body2" sx={{ color: "#fff", mx: 1 }}>
                  Admin
                </Typography>
                <Button
                  component={RouterLink}
                  to="/admin/users"
                  sx={{ color: isActive("/admin/users") }}
                >
                  Users
                </Button>
              </>
            )}

            <Button
              sx={{ color: "#ffffff" }}
              onClick={() => {
                // Clear JWT and send user back to Landing
                auth.clearJWT(() => navigate("/"));
              }}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;