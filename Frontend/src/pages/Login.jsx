import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/login.css"; // Ensure this path is correct

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
      // ✨ FIX 1: Using the correct API endpoint
      const response = await axiosInstance.post("/user/login", formData);
      const data = response.data;

      if (data.token) {
        const userInfo = {
          token: data.token,
          username: data.shopName, // ✨ FIX: Read from data.shopName
          email: data.email,
          id: data._id || data.id,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

      navigate("/landing"); // Navigate to the main application page after login
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Please check your credentials."
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
          <img
            src="https://i.pinimg.com/736x/c4/a3/1e/c4a31e950b3dc16250f7c56519515e80.jpg"
            alt="Storefront"
          />
        </div>

        {/* Right form section */}
        <div className="login-form-section">
          <h2>Welcome Back!</h2>
          <p className="sub-text">Enter your credentials to access your dashboard.</p>

          <div className="register-link">
            Don’t have an account? <NavLink to="/">Register</NavLink>
          </div>

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