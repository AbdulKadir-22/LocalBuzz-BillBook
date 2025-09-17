const Product = require('../models/product.model');

// Service to create a new product
const createProduct = async (productData, userId) => {
    // ✨ FIX: Use the spread syntax (...) to accept all fields from the form.
    // This is more flexible and automatically includes imageUrl.
    const product = new Product({
        ...productData,
        user: userId, // Link the product to the logged-in user
    });
    return await product.save();
};

// Service to get all products for a specific user
const getProductsByUser = async (userId) => {
    // Sort by creation date in descending order (newest first)
    return await Product.find({ user: userId }).sort({ createdAt: -1 });
};

// Service to update a product (No changes needed, it's already flexible)
const updateProduct = async (productId, updateData, userId) => {
    const product = await Product.findOne({ _id: productId, user: userId });

    if (!product) {
        throw new Error('Product not found or user not authorized');
    }

    Object.assign(product, updateData);
    return await product.save();
};

// Service to delete a product
const deleteProduct = async (productId, userId) => {
    const product = await Product.findOneAndDelete({ _id: productId, user: userId });

    if (!product) {
        throw new Error('Product not found or user not authorized');
    }

    return product;
};

module.exports = {
    createProduct,
    getProductsByUser,
    updateProduct,
    deleteProduct,
};