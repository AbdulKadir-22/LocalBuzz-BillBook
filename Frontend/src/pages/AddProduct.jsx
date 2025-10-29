import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/AddProduct.css";

/**
 * A form for adding a new product to the store.
 */
const AddProduct = () => {
  const navigate = useNavigate();

  // --> 1. Updated state
  // We removed 'imageUrl' since we are now uploading a file.
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  // We add new state to hold the actual file object.
  const [imageFile, setImageFile] = useState(null);
  // We add state to show a local preview of the selected image.
  const [previewSource, setPreviewSource] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Updates form data state for TEXT inputs.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --> 2. New handler for FILE input
  /**
   * Updates the file state and sets a preview.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the file object

      // Create a local URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSource(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setPreviewSource("");
    }
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

    // --> 3. Updated validation
    if (!formData.name || !formData.price || !formData.quantity || !imageFile) {
      setError("Please fill in all fields and upload an image.");
      setLoading(false);
      return;
    }

    // --> 4. Use FormData to send the file
    // We must use FormData to send files (multipart/form-data)
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("image", imageFile); // 'image' MUST match the backend middleware name

    try {
      // --> 5. Send the FormData object
      // 'axiosInstance' will automatically set the 'Content-Type'
      // to 'multipart/form-data' when you pass it a FormData object.
      await axiosInstance.post("/products", data);
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
        {/* ... (Header and error/success messages are the same) ... */}
        <div className="form-header">
          <h2>Add New Product</h2>
          <button type="button" className="secondary-btn" onClick={() => navigate("/cart")}>
            &larr; Back to Cart
          </button>
        </div>

        {error && <div className="form-message error">{error}</div>}
        {success && <div className="form-message success">{success}</div>}

        {/* ... (Name, Price, Quantity inputs are the same) ... */}
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
              g min="0"
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
              _ />
          </div>
        </div>

        {/* --> 6. Replaced text input with file input */}
        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg, image/jpg, image/webp" // Good practice
            onChange={handleFileChange} // Use the new file handler
            required
          />
        </div>

        {/* --> 7. Updated preview logic */}
        {previewSource && (
          <div className="form-group">
            <label>Image Preview</label>
            <img
              src={previewSource} // Show the local preview
              alt="Product Preview"
              className="image-preview"
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