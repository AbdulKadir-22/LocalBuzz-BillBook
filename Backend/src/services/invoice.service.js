const Invoice = require('../models/invoice.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// Service to create a new invoice and update product stock
const createInvoice = async (items, userId) => {
    // Basic validation
    if (!items || items.length === 0) {
        throw new Error('Invoice must have at least one item.');
    }

    // --- Start Transaction (for more advanced setups) ---
    // For a minimal project, we will perform operations sequentially.
    // In a production app, you'd use a MongoDB transaction here
    // to ensure that either all operations succeed or all fail.

    let totalAmount = 0;
    const invoiceItems = [];

    // 1. Validate products and calculate total amount
    for (const item of items) {
        const product = await Product.findOne({ _id: item.productId, user: userId });
        if (!product) {
            throw new Error(`Product with ID ${item.productId} not found.`);
        }
        if (product.quantity < item.quantity) {
            throw new Error(`Not enough stock for ${product.name}. Available: ${product.quantity}`);
        }
        totalAmount += item.quantity * product.price;

        // Prepare item for invoice schema
        invoiceItems.push({
            productId: item.productId,
            name: product.name,
            quantity: item.quantity,
            price: product.price,
        });
    }

    // 2. Create the invoice
    const invoice = new Invoice({
        user: userId,
        items: invoiceItems,
        totalAmount,
    });
    await invoice.save();

    // 3. Update the stock for each product
    for (const item of items) {
        await Product.updateOne(
            { _id: item.productId },
            { $inc: { quantity: -item.quantity } } // Decrement quantity
        );
    }

    // --- End Transaction ---

    return invoice;
};

// Service to get all invoices for a specific user
const getInvoicesByUser = async (userId) => {
    return await Invoice.find({ user: userId }).sort({ createdAt: -1 });
};

module.exports = {
    createInvoice,
    getInvoicesByUser,
};