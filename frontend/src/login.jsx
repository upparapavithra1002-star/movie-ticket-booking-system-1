
import { useState } from "react";
import "./login.css";

const API = "http://localhost:5000/api/auth";

function Login({ onLogin }) {
  const params = new URLSearchParams(window.location.search);
  const resetToken = params.get("resetToken") || "";
  const resetEmail = params.get("email") || "";

  const [mode, setMode] = useState(
    resetToken && resetEmail ? "reset" : "login"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState(resetEmail);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function request(path, body) {
    const response = await fetch(`${API}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    return data;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      if (mode === "signup" || mode === "login") {
        const path = mode === "signup" ? "signup" : "login";
        const body =
          mode === "signup"
            ? { name, email, password }
            : { email, password };

        const data = await request(path, body);

        sessionStorage.setItem("moviebookToken", data.token);
        sessionStorage.setItem("moviebookUser", JSON.stringify(data.user));

        if (onLogin) onLogin();
        return;
      }

      if (mode === "forgot") {
        const data = await request("forgot-password", { email });
        setMessage(data.message);
        setSuccess(true);
        return;
      }

      if (mode === "reset") {
        const data = await request("reset-password", {
          email,
          token: resetToken,
          password: newPassword,
        });

        setMessage(data.message);
        setSuccess(true);
        setPassword("");
        setNewPassword("");
        window.history.replaceState({}, "", window.location.pathname);
        setMode("login");
      }
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setSuccess(false);
    setPassword("");
    setNewPassword("");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">MovieBook 🎬</h1>

        {mode === "signup" && (
          <>
            <h2>Create your account</h2>
            <p className="login-subtitle">Join MovieBook today.</p>
          </>
        )}

        {mode === "login" && (
          <>
            <h2>Welcome back!</h2>
            <p className="login-subtitle">Log in to book your tickets.</p>
          </>
        )}

        {mode === "forgot" && (
          <>
            <h2>Forgot password?</h2>
            <p className="login-subtitle">
              Enter your email to receive a password-reset link.
            </p>
          </>
        )}

        {mode === "reset" && (
          <>
            <h2>Create a new password</h2>
            <p className="login-subtitle">
              Choose a new password for your account.
            </p>
          </>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </>
          )}

          {(mode === "signup" ||
            mode === "login" ||
            mode === "forgot") && (
            <>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </>
          )}

          {(mode === "signup" || mode === "login") && (
            <>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                minLength={8}
                required
              />
            </>
          )}

          {mode === "reset" && (
            <>
              <p className="reset-email">Email: {email}</p>
              <label htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Create a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </>
          )}

          {mode === "login" && (
            <button
              type="button"
              className="resend-button"
              onClick={() => changeMode("forgot")}
            >
              Forgot Password?
            </button>
          )}

          <button className="login-button" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create Account"
                : mode === "login"
                  ? "Login"
                  : mode === "forgot"
                    ? "Send Reset Link"
                    : "Save New Password"}
          </button>
        </form>

        {message && (
          <p
            className={`login-message ${success ? "success-message" : ""}`}
            role="status"
          >
            {message}
          </p>
        )}

        {mode === "login" && (
          <p className="auth-switch">
            New to MovieBook?{" "}
            <button type="button" onClick={() => changeMode("signup")}>
              Sign Up
            </button>
          </p>
        )}

        {mode === "signup" && (
          <p className="auth-switch">
            Already have an account?{" "}
            <button type="button" onClick={() => changeMode("login")}>
              Login
            </button>
          </p>
        )}

        {(mode === "forgot" || mode === "reset") && (
          <p className="auth-switch">
            Remember your password?{" "}
            <button type="button" onClick={() => changeMode("login")}>
              Back to Login
            </button>
          </p>
        )}

        <p className="login-footer">
          Your next movie experience starts here 🍿
        </p>
      </div>
    </div>
  );
}

export default Login;