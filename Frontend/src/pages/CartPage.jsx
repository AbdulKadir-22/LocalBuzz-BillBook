import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import '../styles/CartPage.css';

/**
 * A reusable card component to display a single product.
 */
const ProductCard = ({ product, quantity, isSelected, onQuantityChange, onSelectionChange }) => {
  const id = product._id;
  const price = product.price || 0;

  return (
    <div className="product-card">
      <input 
        type="checkbox" 
        checked={isSelected}
        onChange={(e) => onSelectionChange(id, e.target.checked)}
      />
      <img src={product.imageUrl || `https://via.placeholder.com/150?text=${product.name}`} alt={product.name} />
      <p>{product.name}</p>
      <div className="controls">
        <button onClick={() => onQuantityChange(id, quantity - 1)}>-</button>
        <span>₹{price.toFixed(2)} • {quantity}</span>
        <button onClick={() => onQuantityChange(id, quantity + 1)}>+</button>
      </div>
    </div>
  );
};

/**
 * Main page for displaying products and creating an invoice.
 */
const CartPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Memoize user info to avoid re-parsing on every render.
  const userInfo = useMemo(() => {
    const info = localStorage.getItem('userInfo');
    return info ? JSON.parse(info) : null;
  }, []);

  // Fetch all products on component mount.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError('');
        setLoading(true);
        const { data } = await axiosInstance.get('/products');
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Couldn't load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /**
   * Updates the quantity for a specific product in the cart.
   */
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 0) return;
    setCart(prevCart => ({
      ...prevCart,
      [productId]: newQuantity,
    }));
  };

  /**
   * Toggles the selection state of a product.
   */
  const handleSelectionChange = (productId, isChecked) => {
    setSelectedProducts(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (isChecked) {
        newSelected.add(productId);
        // Add to cart with quantity 1 if not already present
        if (!cart[productId]) {
          handleQuantityChange(productId, 1);
        }
      } else {
        newSelected.delete(productId);
      }
      return newSelected;
    });
  };

  // Memoize cart calculations for performance.
  const { totalItems, billAmount } = useMemo(() => {
    let items = 0;
    let amount = 0;
    selectedProducts.forEach(productId => {
      const product = products.find(p => p._id === productId); 
      const quantity = cart[productId];
      if (product && quantity > 0) {
        items += quantity;
        amount += product.price * quantity;
      }
    });
    return { totalItems: items, billAmount: amount };
  }, [cart, selectedProducts, products]);

  /**
   * Prepares and navigates to the invoice generation page.
   */
  const handleGenerateInvoice = async () => {
    const invoiceItems = Array.from(selectedProducts)
      .map(productId => {
        const product = products.find(p => p._id === productId);
        const quantity = cart[productId];
        if (!product || !quantity || quantity <= 0) return null;
        return {
          productId: productId,
          name: product.name,
          price: product.price,
          quantity: quantity,
        };
      })
      .filter(Boolean);

    if (invoiceItems.length === 0) {
        setError("Please select one or more items to generate an invoice.");
        return;
    }

    // Pass invoice data to the next route via state
    navigate('/generate-invoice', { 
      state: { 
        items: invoiceItems, 
        totalItems, 
        billAmount 
      } 
    });
  };
  
  const renderContent = () => {
    if (loading) {
      return <div className="status-message">Loading products...</div>;
    }
    if (error) {
      return <div className="status-message error">{error}</div>;
    }
    if (products.length === 0) {
      return <div className="status-message">No products found. Add a product to get started!</div>;
    }
    return (
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            quantity={cart[product._id] || 0}
            isSelected={selectedProducts.has(product._id)}
            onQuantityChange={handleQuantityChange}
            onSelectionChange={handleSelectionChange}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="page-container">
      <header className="app-header">
        <h1 className="shop-name">{userInfo?.username || 'My Shop'}</h1>
        <div className="header-actions">
          <button className="header-btn secondary" onClick={() => navigate('/history')}>History</button>
          <button className="header-btn primary" onClick={() => navigate('/add-product')}>Add Product</button>
        </div>
      </header>

      <main className="content-area">
        {renderContent()}
      </main>

      <footer className="summary-bar">
        <div className="summary-details">
          <span>Total Items: <strong>{totalItems}</strong></span>
          <span>Bill Amount: <strong>₹{billAmount.toFixed(2)}</strong></span>
        </div>
        <button 
          className="generate-invoice-btn" 
          onClick={handleGenerateInvoice}
          disabled={totalItems === 0}
        >
          Generate Invoice
        </button>
      </footer>
    </div>
  );
};

export default CartPage;  