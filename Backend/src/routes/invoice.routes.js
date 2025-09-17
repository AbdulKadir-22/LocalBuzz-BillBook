const express = require('express');
const {
    addInvoice,
    getInvoices,
} = require('../controllers/invoice.controller');
const requireAuth = require('../middlewares/requireAuth.middleware');

const router = express.Router();

// Protect all routes in this file
router.use(requireAuth);

// GET invoice history for the user
// Corresponds to: GET /api/invoices/
router.get('/', getInvoices);

// POST a new invoice
// Corresponds to: POST /api/invoices/
router.post('/', addInvoice);

module.exports = router;