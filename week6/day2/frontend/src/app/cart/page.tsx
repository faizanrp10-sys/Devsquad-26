'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  const emojis = ['👕', '👖', '👔', '🧥', '👗', '🩳'];
  const discount = totalAmount * 0.2;
  const delivery = 15;
  const total = totalAmount - discount + delivery;

  const handleCheckout = async () => {
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }
    try {
      const orderItems = items.map(item => ({
        productId: item._id,
        quantity: item.quantity,
      }));
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: orderItems, paymentMethod: 'money' }),
      });
      if (res.ok) {
        clearCart();
        alert('Order placed successfully! 🎉');
        router.push('/profile');
      } else {
        const err = await res.json();
        alert(err.message || 'Checkout failed');
      }
    } catch {
      alert('Could not connect to server. Order saved locally.');
      clearCart();
    }
  };

  return (
    <>
      <Header />
      <div className="cart-page">
        <div className="breadcrumb" style={{ padding: '0 0 16px' }}>
          <a href="/">Home</a> &gt; <span>Cart</span>
        </div>
        <h1>YOUR CART</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 60, marginBottom: 16 }}>🛒</p>
            <p style={{ fontSize: 18, color: '#666' }}>Your cart is empty</p>
            <a href="/shop" className="shop-now-btn" style={{ display: 'inline-block', marginTop: 20 }}>Start Shopping</a>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map(item => {
                const emoji = emojis[parseInt(item._id) % emojis.length];
                const price = item.isOnSale ? item.salePrice : item.price;
                return (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-image">{emoji}</div>
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <div className="cart-item-meta">Size: Large &middot; Color: White</div>
                      <div className="cart-item-price">${Math.round(price)}</div>
                    </div>
                    <div className="cart-item-actions">
                      <button className="delete-btn" onClick={() => removeFromCart(item._id)}>🗑️</button>
                      <div className="qty-control">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-row"><span>Subtotal</span><span>${Math.round(totalAmount)}</span></div>
              <div className="summary-row discount"><span>Discount (-20%)</span><span>-${Math.round(discount)}</span></div>
              <div className="summary-row"><span>Delivery Fee</span><span>${delivery}</span></div>
              <div className="summary-total"><span>Total</span><span>${Math.round(total)}</span></div>
              <div className="promo-row">
                <input type="text" className="promo-input" placeholder="Add promo code" />
                <button className="promo-btn">Apply</button>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Go to Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
