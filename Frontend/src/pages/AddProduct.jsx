import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/AddProduct.css";

/**
 * A form for adding a new product to the store.
 */
const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Updates form data state on user input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles form submission to create a new product.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.name || !formData.price || !formData.quantity) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post("/products", formData);
      setSuccess("Product added successfully! Redirecting...");
      
      setTimeout(() => {
        navigate("/cart"); // Navigate back to the main product list
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Failed to add product.");
      console.error("Add product error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-header">
          <h2>Add New Product</h2>
          <button type="button" className="secondary-btn" onClick={() => navigate("/cart")}>
            &larr; Back to Cart
          </button>
        </div>

        {error && <div className="form-message error">{error}</div>}
        {success && <div className="form-message success">{success}</div>}

        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g., Chocolate Cake"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="e.g., 25.50"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Stock Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="e.g., 10"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (Optional)</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        {formData.imageUrl && (
          <div className="form-group">
            <label>Image Preview</label>
            <img 
              src={formData.imageUrl} 
              alt="Product Preview" 
              className="image-preview"
              onError={(e) => e.target.style.display = 'none'} // Hide if image URL is broken
              onLoad={(e) => e.target.style.display = 'block'} // Show if image loads
            />
          </div>
        )}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;