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

  /**
   * Updates form data state on user input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission for user login.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/user/login", formData);
      const { data } = response;

      if (data.token) {
        const userInfo = {
          token: data.token,
          username: data.shopName,
          email: data.email,
          id: data._id || data.id,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
      
      // Navigate to the main application dashboard/cart page after login.
      navigate("/cart");
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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-visual-section">
          <img src="https://i.pinimg.com/736x/c4/a3/1e/c4a31e950b3dc16250f7c56519515e80.jpg" alt="A modern, organized storefront" />
        </div>
        <div className="auth-form-section">
          <div className="auth-header">
            <h2>Welcome Back!</h2>
            <p>Enter your credentials to access your dashboard.</p>
          </div>

          {error && <div className="auth-message error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don’t have an account? <NavLink to="/">Register</NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;