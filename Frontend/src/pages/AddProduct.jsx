import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/AddProduct.css"; // We will create this CSS file next

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    imageUrl: "", // Field for the image URL
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Simple validation
    if (!formData.name || !formData.price || !formData.quantity) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post("/products", formData);
      setSuccess("Product added successfully! Redirecting...");
      
      // Clear form and redirect after a short delay
      setTimeout(() => {
        navigate("/landing"); // Navigate back to the main products/cart page
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Failed to add product.");
      console.error("Add product error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Add New Product</h2>
          <button type="button" className="back-btn" onClick={() => navigate("/landing")}>
            &larr; Back to Cart
          </button>
        </div>

        {error && <p className="message error-message">{error}</p>}
        {success && <p className="message success-message">{success}</p>}

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
            <label htmlFor="price">Price ($)</label>
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
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        {/* Live Image Preview */}
        {formData.imageUrl && (
          <div className="image-preview-box">
            <label>Image Preview</label>
            <img src={formData.imageUrl} alt="Product Preview" className="image-preview" />
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;