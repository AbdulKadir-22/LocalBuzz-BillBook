import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';
import axiosInstance from '../api/axios'; 

// ProductCard component can remain the same
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
        <span>${price.toFixed(2)} • {quantity}</span>
        <button onClick={() => onQuantityChange(id, quantity + 1)}>+</button>
      </div>
    </div>
  );
};

function CartPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); 
  const [cart, setCart] = useState({});
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  // ✨ REFINEMENT 1: Add loading and error states for better UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✨ REFINEMENT 2: Get user info from localStorage to make the component dynamic
  const userInfo = useMemo(() => {
    const info = localStorage.getItem('userInfo');
    return info ? JSON.parse(info) : null;
  }, []);

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

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 0) return; // Prevent negative quantity
    setCart(prevCart => ({
      ...prevCart,
      [productId]: newQuantity,
    }));
  };

  const handleSelectionChange = (productId, isChecked) => {
    setSelectedProducts(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (isChecked) {
        newSelected.add(productId);
        // If product is selected and quantity is 0, set it to 1
        if (!cart[productId]) {
          handleQuantityChange(productId, 1);
        }
      } else {
        newSelected.delete(productId);
      }
      return newSelected;
    });
  };

  const { totalItems, billAmount } = useMemo(() => {
    let items = 0;
    let amount = 0;
    selectedProducts.forEach(productId => {
      const product = products.find(p => p._id === productId); 
      if (product && cart[productId] > 0) {
        items += cart[productId];
        amount += product.price * cart[productId];
      }
    });
    return { totalItems: items, billAmount: amount };
  }, [cart, selectedProducts, products]);

  const handleGenerateInvoice = async () => {
    const invoiceItems = Array.from(selectedProducts)
      .map(productId => {
        const product = products.find(p => p._id === productId);
        const quantity = cart[productId];
        if (!product || !quantity || quantity === 0) return null;
        return {
          productId: productId,
          name: product.name,
          price: product.price,
          quantity: quantity,
        };
      })
      .filter(Boolean); // Remove any null items

    if (invoiceItems.length === 0) {
        setError("Please select items with a quantity greater than zero.");
        return;
    }

    try {
      await axiosInstance.post('/invoices', { items: invoiceItems, totalAmount: billAmount });
      
      navigate('/generate-invoice', { 
        state: { 
          items: invoiceItems, 
          totalItems, 
          billAmount 
        } 
      });

    } catch (err) {
      console.error("Failed to create invoice:", err);
      // ✨ REFINEMENT 3: Use the state for error messages instead of alert()
      setError(err.response?.data?.error || "Error creating invoice.");
    }
  };

  return (
    <div className="main-content">
      <div className="header">
        {/* ✨ REFINEMENT 4: Use the dynamic shop name */}
        <div className="header-title"><strong>{userInfo?.username || 'My Shop'}</strong></div>
        <div className="header-actions">
          <button className="header-btn add-product-btn" onClick={() => navigate('/add-product')}>
            Add Product
          </button>
          <button className="header-btn history-btn" onClick={() => navigate('/history')}>
            History
          </button>
        </div>
      </div>

      {error && <p className="cart-error-message">{error}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : (
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
      )}

      <div className="footer-bar">
        <span>Total Items: {totalItems}</span>
        <span>Bill Amount: ${billAmount.toFixed(2)}</span>
        <button 
          className="generate-invoice-btn" 
          onClick={handleGenerateInvoice}
          disabled={totalItems === 0}
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
}

export default CartPage;