import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/login.css"; // Ensure this path points to the new CSS below

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/login", formData);
      const data = response.data;

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: data.username,
            email: data.email,
            id: data._id || data.id,
          })
        );
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;
      }

      navigate("/landing");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Something went wrong. Please try again later."
      );
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left image section */}
        <div className="login-image-section">
          {/* ✨ NEW: Using the same image as the registration page for consistency */}
          <img
            src="https://i.pinimg.com/736x/c4/a3/1e/c4a31e950b3dc16250f7c56519515e80.jpg"
            alt="Supermarket aisle"
          />
        </div>

        {/* Right form section */}
        <div className="login-form-section">
          <h2>Welcome Back!</h2>
          {/* ✨ NEW: Added sub-text to match registration page structure */}
          <p className="sub-text">Enter your credentials to access your dashboard.</p>
          
          <div className="register-link">
            Don’t have an account? <NavLink to="/">Register</NavLink>
          </div>

          {/* ✨ NEW: Updated error message structure for consistency */}
          {error && <p className="message-container error-message">{error}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-input-wrapper">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="forgot-password-link">
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;