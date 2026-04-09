'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const mockOrders = [
  { _id: '25426', status: 'delivered', totalAmount: 200, paymentMethod: 'money', pointsEarned: 20, createdAt: 'Nov 8th, 2023', items: 3 },
  { _id: '25425', status: 'processing', totalAmount: 350, paymentMethod: 'hybrid', pointsEarned: 35, createdAt: 'Nov 7th, 2023', items: 2 },
  { _id: '25424', status: 'delivered', totalAmount: 120, paymentMethod: 'points', pointsEarned: 0, createdAt: 'Nov 6th, 2023', items: 1 },
  { _id: '25423', status: 'cancelled', totalAmount: 480, paymentMethod: 'money', pointsEarned: 0, createdAt: 'Nov 5th, 2023', items: 4 },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <p style={{ fontSize: 18, marginBottom: 16 }}>Please login to view your profile</p>
          <a href="/auth/login" className="shop-now-btn" style={{ display: 'inline-block' }}>Login</a>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p style={{ color: '#666', marginTop: 4 }}>Welcome back, {user.name}!</p>
        </div>

        <div className="profile-stats">
          <div className="profile-stat points-stat">
            <span className="stat-value">⭐ {user.loyaltyPoints}</span>
            <span className="stat-label">Loyalty Points</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{mockOrders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 30 }}>
          <div style={{ background: '#f0f0f0', borderRadius: 12, padding: 20, flex: 1 }}>
            <strong>Email:</strong> {user.email}
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: 12, padding: 20, flex: 1 }}>
            <strong>Role:</strong> {user.role}
          </div>
        </div>

        <div className="orders-list">
          <h2>Order History</h2>
          {mockOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <span className="order-id">Order #{order._id}</span>
                <span className={`order-status status-${order.status}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <span>{order.createdAt}</span>
                <span>{order.items} items</span>
                <span>Paid: {order.paymentMethod}</span>
                <span><strong>${order.totalAmount}</strong></span>
                {order.pointsEarned > 0 && <span>+{order.pointsEarned} pts ⭐</span>}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => { logout(); router.push('/'); }} className="shop-now-btn" style={{ marginTop: 30, background: '#cc0000' }}>
          Logout
        </button>
      </div>
      <Footer />
    </>
  );
}
