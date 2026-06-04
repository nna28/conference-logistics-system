import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result =
        await authService.login(
          username,
          password
        );

      localStorage.setItem(
        "token",
        result.access_token
      );

      localStorage.setItem(
        "user_id",
        result.user_id
      );

      localStorage.setItem(
        "full_name",
        result.full_name
      );

      localStorage.setItem(
        "role",
        result.role
      );

      navigate("/workshops");
    } catch (error) {
      alert(
        error.response?.data?.detail ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>
          Conference Logistics System
        </h1>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>
              Username
            </label>

            <input
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

        </form>

      </div>

    </div>
  );
}