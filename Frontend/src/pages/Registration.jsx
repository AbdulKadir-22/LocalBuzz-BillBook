import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/registration.css"; // Ensure this path points to the new CSS below

const Registration = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.shopName || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/users/signup", formData);
      setSuccess(res.data.message || "Account created successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        {/* Left Image Section */}
        <div className="registration-image-section">
          {/* ✨ NEW: Swapped image to match the theme */}
          <img
            src="https://i.pinimg.com/736x/c4/a3/1e/c4a31e950b3dc16250f7c56519515e80.jpg"
            alt="Modern storefront"
          />
        </div>

        {/* Right Form Section */}
        <div className="registration-form-section">
          <h2>Create Your Account</h2>
          <p className="sub-text">Set up your store in just a few minutes.</p>

          <div className="login-link">
            Already have an account? <NavLink to="/login">Log In</NavLink>
          </div>
          
          {/* ✨ NEW: Moved messages outside the form for better structure */}
          {error && <p className="message-container error-message">{error}</p>}
          {success && <p className="message-container success-message">{success}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-input-wrapper">
              {/* ✨ NEW: Added label for accessibility */}
              <label htmlFor="shopName">Shop Name</label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                placeholder="e.g., 5 Star Bakery"
                className="form-input"
                value={formData.shopName}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Create a strong password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              // ✨ NEW: Updated class name for consistency
              className="register-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;