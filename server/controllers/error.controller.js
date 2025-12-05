// Central place to convert Mongoose/other errors into friendly messages.

const getErrorMessage = (err) => {
  let message = "";

  // Handle MongoDB duplicate key error (e.g. unique email)
  if (err.code && err.code === 11000) {
    message = "Duplicate key error";
  } else if (err.errors) {
    // For validation errors, pick the first message
    for (const errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  }

  // Fallback message
  return message || "Something went wrong.";
};

// Generic fallback handler (not heavily used, but available)
const handleError = (_req, res) => {
  res.status(500).json({ error: "Server error" });
};

export default {
  handleError,
  getErrorMessage,
};