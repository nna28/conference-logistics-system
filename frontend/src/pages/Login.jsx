import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await authService.login(username, password);

      localStorage.setItem("token", result.access_token);
      localStorage.setItem("user_id", result.user_id);
      localStorage.setItem("full_name", result.full_name);
      localStorage.setItem("role", result.role);

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.detail || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left panel */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-left-logo">🏛️</div>
          <h1>Conference Logistics System</h1>
          <p>
            Manage workshops, venues, contracts, travel schedules,
            and material shipments — all in one place.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-form-wrapper">

          <div className="login-form-header">
            <p className="welcome-text">Welcome back 👋</p>
            <h2>Sign in to your account</h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}