import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Close from '@mui/icons-material/Close';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { Drawer, IconButton } from '@mui/material';

const BagSidebar = ({ open, onClose }) => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const getVariant = (item) => {
    if (!item.product || !item.product.variants) return null;
    return item.product.variants.find(v => v._id === item.variantId);
  };

  const subtotal = cart.items.reduce((acc, item) => {
    const variant = getVariant(item);
    return acc + (variant ? variant.price * item.quantity : 0);
  }, 0);

  const delivery = 3.95;
  const total = subtotal + delivery;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 380 }, padding: 0 } }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e5e5' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>My Bag</h2>
          <IconButton size="small" onClick={onClose}>
            <Close style={{ fontSize: 18 }} />
          </IconButton>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
          {cart.items.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', marginTop: 40 }}>Your bag is empty</p>
          ) : (
            cart.items.map((item) => {
              const variant = getVariant(item);
              if (!variant) return null;
              return (
                <div key={`${item.product._id}-${item.variantId}`} style={{ display: 'flex', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                  {/* Thumbnail */}
                  <div style={{ width: 60, height: 60, borderRadius: 4, overflow: 'hidden', flexShrink: 0, backgroundColor: '#f5f5f5' }}>
                    <img src={item.product.images?.[0] || ''} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{item.product.name}</div>
                    <div style={{ color: '#999', fontSize: 12, marginBottom: 8 }}>{variant.name}</div>
                    <button
                      onClick={() => removeFromCart(item.product._id, item.variantId)}
                      style={{ background: 'none', border: 'none', color: '#999', fontSize: 11, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                    >
                      REMOVE
                    </button>
                  </div>

                  {/* Qty & Price */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.variantId, Math.max(1, item.quantity - 1))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 16, color: '#666' }}
                      >−</button>
                      <span style={{ fontSize: 13, fontWeight: 600, width: 16, textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.variantId, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 16, color: '#666' }}
                      >+</button>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>€{(variant.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        {cart.items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #e5e5e5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: '#666' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>€{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13 }}>
              <span style={{ color: '#666' }}>Delivery</span>
              <span style={{ fontWeight: 600 }}>€{delivery.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: 15, fontWeight: 700 }}>
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { onClose(); navigate('/cart'); }}
              style={{
                width: '100%', padding: '14px', backgroundColor: '#1a1a1a', color: '#fff',
                border: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '1px',
                cursor: 'pointer', textTransform: 'uppercase'
              }}
            >
              PURCHASE
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default BagSidebar;
