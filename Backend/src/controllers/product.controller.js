// We need the ImageKit instance you configured
const imagekit = require('../config/imagekit.js');
const productService = require('../services/product.service');

// Controller to handle product creation
const addProduct = async (req, res) => {
    try {
        // 1. Extract text data from req.body (sent via FormData)
        const { name, price, quantity } = req.body;

        // 2. Get the user ID from your auth middleware
        const userId = req.user._id;

        // 3. Check if a file was uploaded. 
        // 'req.file' is added by the 'multer' middleware.
        if (!req.file) {
            return res.status(400).json({ error: 'Product image is required' });
        }

        // 4. Upload the file buffer to ImageKit
        const uploadResponse = await imagekit.upload({
            file: req.file.buffer, // The file data
            fileName: req.file.originalname, // The original file name
            folder: 'products' // (Optional) Organize files in ImageKit
        });

        // 5. Create the productData object for your service.
        // This now includes the URL from ImageKit.
        const productData = {
            name,
            price: Number(price), // Good to ensure it's a number
            quantity: Number(quantity), // Good to ensure it's a number
            imageUrl: uploadResponse.url // <-- Save the ImageKit URL
        };

        // 6. Call your service with the new productData and the userId.
        // This matches your original function's logic.
        const product = await productService.createProduct(productData, userId);

        res.status(201).json(product);

    } catch (error) {
        // Add more detailed logging for upload errors
        console.error("Error during product creation or upload:", error);
        res.status(400).json({ error: error.message });
    }
};

// Controller to get all of a user's products
// (No changes needed here)
const getProducts = async (req, res) => {
    try {
        const products = await productService.getProductsByUser(req.user._id);
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to update a product
// (No changes needed *yet*)
const updateExistingProduct = async (req, res) => {
    /**
     * NOTE: This function currently only updates text fields (name, price, etc.).
     * If you want to allow users to *change* the product image,
     * you will need to apply a similar logic as 'addProduct':
     * 1. Check if 'req.file' exists.
     * 2. If it does, upload the new file to ImageKit.
     * 3. Add the new 'imageUrl' to 'req.body' before passing it to the service.
     * 4. (Optional) You might also want to delete the *old* image from ImageKit.
     */
    try {
        const { id } = req.params;
        const product = await productService.updateProduct(id, req.body, req.user._id);
        res.status(200).json(product);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

// Controller to delete a product
// (No changes needed here)
const deleteExistingProduct = async (req, res) => {
    /**
     * NOTE: When you delete a product, you might also want to
     * delete its corresponding image from ImageKit to save space.
     * This would require an additional call to the ImageKit SDK.
     */
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