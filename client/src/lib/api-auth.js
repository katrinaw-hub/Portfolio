// Low-level auth API helpers (used by Signin + auth-helper).

const signin = async (user) => {
  try {
    const response = await fetch("/auth/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include", // allow server to set cookie if needed
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.error("signin error", err);
    return { error: "Unable to sign in." };
  }
};

const signout = async () => {
  try {
    const response = await fetch("/auth/signout", { method: "GET" });
    return await response.json();
  } catch (err) {
    console.error("signout error", err);
    return { error: "Unable to sign out." };
  }
};

export { signin, signout };