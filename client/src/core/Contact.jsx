// Contact page:
// - Everyone sees static contact info
// - Normal users can submit a "Send me a message" form
// - Admin sees a table of received messages and can delete them
//   (no form for admin, as requested)

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createContact, listContacts, deleteContact } from "../api/contactApi.js";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import auth from "../lib/auth-helper.js";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  contactNumber: "",
  email: "",
  message: "",
};

const Contact = () => {
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const jwt = auth.isAuthenticated();
  const isAdmin = jwt?.user?.role === "admin";
  const loginEmail = jwt?.user?.email;

  // Admin: load all messages
  useEffect(() => {
    if (!isAdmin) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    listContacts(signal)
      .then((data) => {
        if (data?.error) setError(data.error);
        else setContacts(data);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("listContacts error", err);
        setError("Unable to load contacts.");
      });

    return () => abortController.abort();
  }, [isAdmin]);

  const handleChange = (field) => (event) =>
    setFormValues({ ...formValues, [field]: event.target.value });

const handleSubmit = async (event) => {
  event.preventDefault();
  setSubmitting(true);
  setError("");

  try {
    const payload = {
      ...formValues,
      userEmail: loginEmail, // store the login email along with contact email
      createdAt: new Date().toISOString(),
    };

    // 1) Save to the existing Node/Express + Mongo API
    const data = await createContact(payload);
    if (data?.error) {
      setError(data.error);
      return;
    }

    // 2) ALSO save to Firestore (cloud NoSQL / serverless DB)
    await addDoc(collection(db, "contacts"), payload);

    // redirect back to Home with captured info
    navigate("/home", {
      state: { contact: { firstName: formValues.firstName } },
    });
  } catch (err) {
    console.error("Contact submit error", err);
    setError("Failed to send message.");
  } finally {
    setSubmitting(false);
  }
};


  const handleDelete = async (id) => {
    const data = await deleteContact(id);
    if (data?.error) setError(data.error);
    else setContacts((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mb: 2, color: "primary.main" }}
      >
        Contact Me
      </Typography>

      <Grid container spacing={3} sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* Static contact info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Contact Information
            </Typography>
            <Typography>Name: Katrina Wong</Typography>
            <Typography>Email: hs.wng2@gmail.com</Typography>
          </Paper>
        </Grid>

        {/* Public contact form (hidden for Admin) */}
        {!isAdmin && (
          <Grid item xs={12} md={8}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              sx={{ p: 3, mb: 3 }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Send me a message
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    fullWidth
                    required
                    value={formValues.firstName}
                    onChange={handleChange("firstName")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    required
                    value={formValues.lastName}
                    onChange={handleChange("lastName")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact Number"
                    fullWidth
                    value={formValues.contactNumber}
                    onChange={handleChange("contactNumber")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={formValues.email}
                    onChange={handleChange("email")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Message"
                    fullWidth
                    multiline
                    rows={3}
                    required
                    value={formValues.message}
                    onChange={handleChange("message")}
                  />
                </Grid>
              </Grid>
              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send"}
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Admin view of stored contacts */}
      {isAdmin && (
        <Box sx={{ maxWidth: 1100, mx: "auto", mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Received Messages (Admin)
          </Typography>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Login Email</TableCell>
                  <TableCell>Contact Email</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>
                      {c.firstName} {c.lastName}
                    </TableCell>
                    <TableCell>{c.userEmail}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.contactNumber}</TableCell>
                    <TableCell>{c.message}</TableCell>
                    <TableCell>
                      {new Date(c.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Contact;