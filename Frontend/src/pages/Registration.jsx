import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/registration.css"; // Ensure this path is correct

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

  /**
   * Updates form data state on user input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission for user registration.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
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
      const res = await axiosInstance.post("/user/signup", formData);
      setSuccess(res.data.message || "Account created successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-visual-section">
          <img
            src="https://i.pinimg.com/736x/c4/a3/1e/c4a31e950b3dc16250f7c56519515e80.jpg"
            alt="Modern storefront"
          />
        </div>
        <div className="auth-form-section">
          <div className="auth-header">
            <h2>Create Your Account</h2>
            <p>Set up your store in just a few minutes.</p>
          </div>

          {error && <div className="auth-message error">{error}</div>}
          {success && <div className="auth-message success">{success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="shopName">Shop Name</label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                placeholder="e.g., The Corner Store"
                value={formData.shopName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <NavLink to="/login">Log In</NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;