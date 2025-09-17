import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import '../styles/GenerateInvoice.css';

/**
 * Renders a printable and saveable invoice from cart data.
 */
const GenerateInvoice = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Fallback for state to prevent errors on direct navigation.
    const { items = [], totalItems = 0, billAmount = 0 } = location.state || {};
    
    // Memoize user info to avoid re-parsing on every render.
    const userInfo = useMemo(() => {
        const info = localStorage.getItem('userInfo');
        return info ? JSON.parse(info) : null;
    }, []);
    
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');

    /**
     * Triggers the browser's print dialog.
     */
    const handlePrint = () => {
        window.print();
    };

    /**
     * Saves the generated invoice to the database.
     */
    const handleSaveInvoice = async () => {
        setIsSaving(true);
        setSaveError('');
        setSaveSuccess('');

        try {
            const invoiceData = { items, totalAmount: billAmount };
            const response = await axiosInstance.post('/invoices', invoiceData);
            setSaveSuccess(response.data.message || 'Invoice saved successfully!');
            setIsSaved(true); // Disable save button after success.
        } catch (err) {
            setSaveError(err.response?.data?.error || "Failed to save invoice.");
        } finally {
            setIsSaving(false);
        }
    };

    // Renders an error state if no invoice data is available.
    if (items.length === 0) {
        return (
            <div className="invoice-page-container">
                <div className="invoice-card error-state">
                    <h2>No Invoice Data</h2>
                    <p>Please generate an invoice from the cart page first.</p>
                    <button className="action-btn" onClick={() => navigate('/cart')}>
                        &larr; Back to Cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="invoice-page-container">
            <div className="invoice-card">
                <header className="invoice-header">
                    <div className="shop-details">
                        <h1>{userInfo?.username || 'Your Store'}</h1>
                        <p>Invoice</p>
                    </div>
                    <div className="invoice-meta">
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                        <p><strong>Invoice #:</strong> INV-{Date.now().toString().slice(-6)}</p>
                    </div>
                </header>

                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th className="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>₹{item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td className="text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2"></td>
                            <td className="summary-label">Total Items:</td>
                            <td className="summary-value text-right">{totalItems}</td>
                        </tr>
                        <tr className="grand-total-row">
                            <td colSpan="2"></td>
                            <td className="summary-label">Grand Total:</td>
                            <td className="summary-value text-right">₹{billAmount.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                
                <div className="status-messages">
                    {saveError && <p className="message error">{saveError}</p>}
                    {saveSuccess && <p className="message success">{saveSuccess}</p>}
                </div>
            </div>
            
            <div className="invoice-actions">
                <button className="action-btn secondary" onClick={() => navigate('/cart')} disabled={isSaving}>
                    &larr; Back to Cart
                </button>
                <button className="action-btn secondary" onClick={handlePrint}>
                    🖨️ Print
                </button>
                <button 
                    className="action-btn primary" 
                    onClick={handleSaveInvoice} 
                    disabled={isSaving || isSaved}
                >
                    {isSaving ? 'Saving...' : (isSaved ? '✔ Saved' : 'Save Invoice')}
                </button>
            </div>
        </div>
    );
};

export default GenerateInvoice;