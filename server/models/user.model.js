// User model with salted + hashed passwords and role field.

import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
});

// Virtual field for plaintext password.
// Setting password automatically generates salt + hashed_password.
UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Validate password length + special character.
UserSchema.path("hashed_password").validate(function () {
  if (this._password) {
    if (this._password.length < 8) {
      this.invalidate(
        "password",
        "Password must be at least 8 characters."
      );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this._password)) {
      this.invalidate(
        "password",
        "Password must contain at least one special character."
      );
    }
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);

UserSchema.methods = {
  // Compare a candidate password with hashed_password
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  // Hash the password using SHA-1 + salt
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  // Generate a salt value
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

export default mongoose.model("User", UserSchema);