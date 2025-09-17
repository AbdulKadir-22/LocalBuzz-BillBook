const invoiceService = require('../services/invoice.service');

// Controller to handle invoice creation
const addInvoice = async (req, res) => {
    try {
        const { items } = req.body;
        // req.user._id comes from the requireAuth middleware
        const invoice = await invoiceService.createInvoice(items, req.user._id);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to get invoice history for a user
const getInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService.getInvoicesByUser(req.user._id);
        res.status(200).json(invoices);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addInvoice,
    getInvoices,
};