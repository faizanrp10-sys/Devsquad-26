'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { user } = useAuth();
  const { totalItems } = useCart();

  return (
    <>
      <div className="top-banner">
        Sign up and get 20% off to your first order. <a href="/auth/register">Sign Up Now</a>
        <button className="close-banner">×</button>
      </div>
      <header className="shop-header">
        <Link href="/" className="logo">SHOP.CO</Link>
        <nav className="main-nav">
          <ul>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/shop?sale=true">On Sale</Link></li>
            <li><Link href="/shop?new=true">New Arrivals</Link></li>
            <li><Link href="/shop">Brands</Link></li>
          </ul>
        </nav>
        <div className="header-actions">
          <input type="text" placeholder="Search for products..." className="search-bar" />
          <Link href="/cart" className="cart-btn">
            🛒
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          {user ? (
            <Link href="/profile" className="profile-btn">👤</Link>
          ) : (
            <Link href="/auth/login" className="profile-btn">👤</Link>
          )}
        </div>
      </header>
    </>
  );
}
