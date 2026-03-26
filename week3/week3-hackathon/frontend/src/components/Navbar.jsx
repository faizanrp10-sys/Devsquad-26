import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Search from '@mui/icons-material/Search';
import PersonOutline from '@mui/icons-material/PersonOutline';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import Menu from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';
import { Badge, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: 'TEA COLLECTIONS', path: '/collections' },
    { label: 'ACCESSORIES', path: '/collections?category=Teaware' },
    { label: 'BLOG', path: '#' },
    { label: 'CONTACT US', path: '#' },
  ];

  return (
    <nav style={{ borderBottom: '1px solid #e5e5e5', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,   color: '#1a1a1a', letterSpacing: '-0.5px' }}>
            <img src="./Logo.png" alt="" /> Brand Name
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.path}
              style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.5px', color: '#1a1a1a', textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconButton size="small">
            <Search style={{ fontSize: 20, color: '#1a1a1a' }} />
          </IconButton>

          {user ? (
            <div className="relative group">
              <IconButton size="small">
                <PersonOutline style={{ fontSize: 20, color: '#1a1a1a' }} />
              </IconButton>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-1 hidden group-hover:block border border-gray-100 z-50">
                <div className="px-4 py-2 text-xs text-gray-500 border-b">Hello, {user.name}</div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                {(user.role === 'admin' || user.role === 'superadmin') && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                )}
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <IconButton size="small">
                <PersonOutline style={{ fontSize: 20, color: '#1a1a1a' }} />
              </IconButton>
            </Link>
          )}

          <Link to="/cart">
            <IconButton size="small">
              <Badge badgeContent={cartCount} sx={{ '& .MuiBadge-badge': { backgroundColor: '#1a1a1a', color: '#fff', fontSize: 10, minWidth: 16, height: 16 } }}>
                <ShoppingBagOutlined style={{ fontSize: 20, color: '#1a1a1a' }} />
              </Badge>
            </IconButton>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <IconButton size="small" onClick={() => setMobileOpen(true)}>
              <Menu style={{ fontSize: 20, color: '#1a1a1a' }} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <div style={{ width: 280, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setMobileOpen(false)}>
              <Close />
            </IconButton>
          </div>
          <List>
            {navLinks.map(link => (
              <ListItem button key={link.label} onClick={() => { navigate(link.path); setMobileOpen(false); }}>
                <ListItemText primary={link.label} primaryTypographyProps={{ style: { fontSize: 13, fontWeight: 500, letterSpacing: '0.5px' } }} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
