// Defines all routes for the SPA.
// - Landing + auth routes are public
// - Portfolio pages are protected by PrivateRoute
// - Root ("/") redirects logged-in users to /home.

import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./core/Navbar.jsx";
import Landing from "./core/Landing.jsx";
import Home from "./core/Home.jsx";
import About from "./core/About.jsx";
import Projects from "./core/Projects.jsx";
import Credentials from "./core/Credentials.jsx";
import Services from "./core/Services.jsx";
import Contact from "./core/Contact.jsx";
import Signup from "./user/Signup.jsx";
import Signin from "./user/Signin.jsx";
import PrivateRoute from "./lib/PrivateRoute.jsx";
import auth from "./lib/auth-helper.js";
import AdminUsers from "./core/AdminUsers.jsx";

const MainRouter = () => {
  // Call isAuthenticated once per render for the root route decision
  const isAuthed = auth.isAuthenticated();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Admin-only user management page (still uses PrivateRoute) */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AdminUsers />
            </PrivateRoute>
          }
        />

        {/* Root route:
            - If authenticated, skip the Landing and go straight to /home
            - Otherwise show the Landing page
        */}
        <Route
          path="/"
          element={
            isAuthed ? (
              <Navigate to="/home" replace />
            ) : (
              <Landing />
            )
          }
        />

        {/* Public auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Protected portfolio routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/credentials"
          element={
            <PrivateRoute>
              <Credentials />
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute>
              <Services />
            </PrivateRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <PrivateRoute>
              <Contact />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default MainRouter;