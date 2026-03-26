import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { Alert, Snackbar, CircularProgress } from '@mui/material';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    api.get('/products?limit=3').then(({ data }) => setPopular(data.products)).catch(console.error);
  }, []);

  const getVariant = (item) => {
    if (!item.product || !item.product.variants) return null;
    return item.product.variants.find(v => v._id === item.variantId);
  };

  const items = cart.items.filter(item => item.product);
  const subtotal = items.reduce((acc, item) => {
    const v = getVariant(item);
    return acc + (v ? v.price * item.quantity : 0);
  }, 0);
  const delivery = 3.95;
  const total = subtotal + delivery;

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      const orderItems = items.map(item => {
        const v = getVariant(item);
        return {
          product: item.product._id,
          variantName: v?.name,
          quantity: item.quantity,
          price: v?.price,
        };
      });
      await api.post('/orders', {
        items: orderItems,
        totalAmount: total,
        shippingAddress: { street: '123 Tea Lane', city: 'Tea City', zipCode: '12345', country: 'IR' },
      });
      clearCart();
      setToast({ open: true, message: 'Order placed successfully!', severity: 'success' });
      setTimeout(() => navigate('/profile'), 2000);
    } catch (error) {
      setToast({ open: true, message: error.response?.data?.message || 'Checkout failed', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Progress steps
  const steps = ['1. MY BAG', '2. DELIVERY', '3. REVIEW & PAYMENT'];

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '60vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Step Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 48, gap: 8 }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <span style={{ fontSize: 12, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#1a1a1a' : '#ccc' }}>{s}</span>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 1, backgroundColor: '#e5e5e5' }} />}
            </React.Fragment>
          ))}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 16, color: '#999', marginBottom: 24 }}>Your bag is empty</p>
            <Link to="/collections">
              <button style={{ padding: '12px 32px', border: '1px solid #1a1a1a', backgroundColor: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase' }}>
                BACK TO SHOPPING
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            {/* Left — Cart Items */}
            <div style={{ flex: '1 1 54%', minWidth: 320 }}>
              {items.map(item => {
                const v = getVariant(item);
                if (!v) return null;
                return (
                  <div key={`${item.product._id}-${item.variantId}`} style={{ display: 'flex', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 4, overflow: 'hidden', flexShrink: 0, backgroundColor: '#f5f5f5' }}>
                      <img src={item.product.images?.[0] || ''} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.product.name}</div>
                      <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>{v.name}</div>
                      <button onClick={() => removeFromCart(item.product._id, item.variantId)} style={{ background: 'none', border: 'none', color: '#999', fontSize: 11, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>REMOVE</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQuantity(item.product._id, item.variantId, Math.max(1, item.quantity - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#666' }}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 600, width: 16, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.variantId, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#666' }}>+</button>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, minWidth: 60, textAlign: 'right' }}>€{(v.price * item.quantity).toFixed(2)}</div>
                  </div>
                );
              })}

              {/* Subtotal & Back */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e5e5' }}>
                <span style={{ fontSize: 13, color: '#666' }}>Subtotal</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>€{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ marginTop: 24 }}>
                <Link to="/collections" style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '12px 32px', border: '1px solid #e5e5e5', backgroundColor: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', cursor: 'pointer', textTransform: 'uppercase', color: '#666' }}>
                    BACK TO SHOPPING
                  </button>
                </Link>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div style={{ flex: '1 1 340px', maxWidth: 400 }}>
              <div style={{ border: '1px solid #e5e5e5', padding: 24, borderRadius: 4, marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Order summery</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#666' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>€{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13 }}>
                  <span style={{ color: '#666' }}>Delivery</span>
                  <span style={{ fontWeight: 600 }}>€{delivery.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 16, fontWeight: 700, paddingTop: 16, borderTop: '1px solid #e5e5e5' }}>
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <p style={{ fontSize: 11, color: '#999', marginBottom: 20 }}>Estimated shipping time: 2 days</p>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase' }}
                >
                  {loading ? 'Processing...' : 'CHECK OUT'}
                </button>
              </div>

              {/* Payment Type */}
              <div style={{ border: '1px solid #e5e5e5', padding: 24, borderRadius: 4, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Payment type</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['VISA', 'MC', 'AMEX', 'IDEAL', 'PAYPAL'].map(p => (
                    <div key={p} style={{ width: 44, height: 28, border: '1px solid #e5e5e5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#999' }}>{p}</div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div style={{ border: '1px solid #e5e5e5', padding: 24, borderRadius: 4 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Delivery and retour</h3>
                <ul style={{ paddingLeft: 16, margin: 0, fontSize: 12, color: '#666', lineHeight: 2 }}>
                  <li>Order before 12:00 and we will ship the same day.</li>
                  <li>Orders made after Friday 12:00 are processed on Monday.</li>
                  <li>To return your articles, please contact us first.</li>
                  <li>Postal charges for retour are not reimbursed.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Popular this season */}
        {popular.length > 0 && (
          <div style={{ marginTop: 64, borderTop: '1px solid #e5e5e5', paddingTop: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 400, textAlign: 'center', marginBottom: 32 }}>Popular this season</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
              {popular.map(p => (
                <Link to={`/product/${p._id}`} key={p._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 4, backgroundColor: '#f9f9f9', marginBottom: 12 }}>
                    <img src={p.images[0] || ''} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{p.description?.substring(0, 30)}...</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>€{p.basePrice.toFixed(2)} / {p.variants?.[0]?.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default Cart;
