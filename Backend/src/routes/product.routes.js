const express = require('express');
const {
    addProduct,
    getProducts,
    updateExistingProduct,
    deleteExistingProduct,
} = require('../controllers/product.controller');
const requireAuth = require('../middlewares/requireAuth.middleware');

const router = express.Router();

// This middleware will protect all subsequent routes in this file
router.use(requireAuth);

// GET all products for a user
// Corresponds to: GET /api/products/
router.get('/', getProducts);

// POST a new product
// Corresponds to: POST /api/products/
router.post('/', addProduct);

// UPDATE a product by ID
// Corresponds to: PUT /api/products/:id
router.put('/:id', updateExistingProduct);

// DELETE a product by ID
// Corresponds to: DELETE /api/products/:id
router.delete('/:id', deleteExistingProduct);

module.exports = router;