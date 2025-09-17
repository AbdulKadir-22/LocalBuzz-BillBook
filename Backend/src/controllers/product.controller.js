const productService = require('../services/product.service');

// Controller to handle product creation
const addProduct = async (req, res) => {
    try {
        // req.user._id comes from the requireAuth middleware
        const product = await productService.createProduct(req.body, req.user._id);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to get all of a user's products
const getProducts = async (req, res) => {
    try {
        const products = await productService.getProductsByUser(req.user._id);
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to update a product
const updateExistingProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.updateProduct(id, req.body, req.user._id);
        res.status(200).json(product);
    } catch (error) {
        // Handle specific "not found" errors
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

// Controller to delete a product
const deleteExistingProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.deleteProduct(id, req.user._id);
        res.status(200).json({ message: 'Product deleted successfully', product });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addProduct,
    getProducts,
    updateExistingProduct,
    deleteExistingProduct,
};