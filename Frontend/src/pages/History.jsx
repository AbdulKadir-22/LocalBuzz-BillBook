import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import '../styles/History.css';

/**
 * Displays a history of previously saved invoices.
 */
const History = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);

    // Fetch invoice history on component mount.
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/invoices');
                // Sort invoices by most recent first
                const sortedInvoices = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setInvoices(sortedInvoices);
            } catch (err) {
                setError('Failed to load invoice history. Please try again later.');
                console.error("Fetch history error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    /**
     * Toggles the visibility of an invoice's detailed item list.
     * @param {string} invoiceId - The ID of the invoice to expand or collapse.
     */
    const toggleDetails = (invoiceId) => {
        setExpandedInvoiceId(prevId => (prevId === invoiceId ? null : invoiceId));
    };

    const renderContent = () => {
        if (loading) {
            return <p className="status-message">Loading history...</p>;
        }
        if (error) {
            return <p className="status-message error">{error}</p>;
        }
        if (invoices.length === 0) {
            return <p className="status-message">No saved invoices found.</p>;
        }
        return (
            <div className="invoice-list">
                {invoices.map((invoice) => (
                    <div key={invoice._id} className="invoice-item">
                        <div className="invoice-summary" onClick={() => toggleDetails(invoice._id)}>
                            <div className="summary-group">
                                <span className="summary-label">Date</span>
                                <span className="summary-value">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="summary-group">
                                <span className="summary-label">Items</span>
                                <span className="summary-value">{invoice.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                            </div>
                            <div className="summary-group">
                                <span className="summary-label">Total Amount</span>
                                <span className="summary-value amount">₹{invoice.totalAmount.toFixed(2)}</span>
                            </div>
                            <button className="details-toggle-btn">
                                {expandedInvoiceId === invoice._id ? '▲' : '▼'}
                            </button>
                        </div>
                        
                        {expandedInvoiceId === invoice._id && (
                            <div className="invoice-details">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Price</th>
                                            <th>Qty</th>
                                            <th className="text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>₹{item.price.toFixed(2)}</td>
                                                <td>{item.quantity}</td>
                                                <td className="text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="page-container history-page">
            <header className="app-header">
                <h1>Invoice History</h1>
                <button className="header-btn secondary" onClick={() => navigate('/cart')}>
                    &larr; Back to Cart
                </button>
            </header>
            <main className="content-area">
                {renderContent()}
            </main>
        </div>
    );
};

export default History;