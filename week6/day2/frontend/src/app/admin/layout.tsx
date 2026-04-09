'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'All Products', icon: '📦' },
  { href: '/admin/orders', label: 'Order List', icon: '📋' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">SHOP.CO</div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-categories">
          <h4>Categories</h4>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <input type="text" className="admin-search" placeholder="Search..." />
          <div className="admin-topbar-actions">
            <button className="notif-btn">🔔</button>
            <div className="admin-avatar">
              <span>👤</span>
              <span>ADMIN ▾</span>
            </div>
          </div>
        </div>
        <div className="admin-content">
          {children}
        </div>
        <div className="admin-footer">
          <span>© 2025 - SHOP.CO Dashboard</span>
          <div className="admin-footer-links">
            <a href="#">About</a><a href="#">Careers</a><a href="#">Policy</a><a href="#">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}
