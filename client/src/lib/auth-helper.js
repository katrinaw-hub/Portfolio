import { signout } from "./api-auth.js";

const auth = {
  // Read JWT payload from sessionStorage.
  // Returns false if not available (used by PrivateRoute, Navbar, etc.)
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    const stored = sessionStorage.getItem("jwt");
    return stored ? JSON.parse(stored) : false;
  },

  // Persist JWT after successful login
  authenticate(jwt, cb) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
    }
    cb();
  },

  // Clear local JWT + tell backend to clear cookie/session
  clearJWT(cb) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("jwt");
    }
    cb();

    // Fire-and-forget signout; we don't block UI on this
    signout().then(() => {
      document.cookie =
        "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  },
};

export default auth;