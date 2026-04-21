'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/userSlice';
import { useRouter, usePathname } from 'next/navigation';
import { Phone, Mail, Search, ChevronDown, Star, Bell, Car } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../lib/axios';
import { addNotification, markAllAsRead, clearAll, fetchNotifications, markAllAsReadServer, clearAllServer } from '../store/notificationSlice';
import { AppDispatch } from '../store/store';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    dispatch(fetchNotifications());
    
    const newSocket = io(API_URL);
    
    newSocket.on('new_bid', (data) => {
      dispatch(addNotification({
        type: 'new_bid',
        message: `New bid of $${data.amount?.toLocaleString()} on ${data.make || 'a car'} ${data.model || ''}`,
        carId: data.carId
      }));
    });

    newSocket.on('bid_success', (data) => {
      dispatch(addNotification({
        type: 'bid_success',
        message: `Success! Your bid of $${data.amount?.toLocaleString()} for ${data.make || 'the car'} ${data.model || ''} was placed`,
        carId: data.carId
      }));
    });

    newSocket.on('bid_ended', (data) => {
      dispatch(addNotification({
        type: 'bid_ended',
        message: `Auction ended for ${data.make || 'car'} ${data.model || ''}`,
        carId: data.carId
      }));
    });

    return () => { newSocket.disconnect(); };
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Car Auction', href: '/auctions' },
    { name: 'Sell Your Car', href: '/sell' },
    { name: 'About us', href: '#' },
    { name: 'Contect', href: '#' },
  ];

  return (
    <nav className="w-full z-50">
      {/* Top Utility Bar */}
      <div className="bg-primary text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 h-10 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-white/80">Call Us</span>
            <Phone size={12} />
            <span className="font-semibold">570-694-4002</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={14} />
            <span className="text-white/80">Email Id :</span>
            <span className="font-semibold">info@cardeposit.com</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
             <img src="http://localhost:3001/logo.png" alt="Car Deposit" className="h-10" />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.href ? 'text-accent border-b-2 border-accent pb-1' : 'text-text-dark hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Icons & Auth */}
          <div className="flex items-center space-x-5">
            <Link 
              href="/profile" 
              onClick={() => {
                // We want to trigger the Wishlist tab in profile
                // For now, navigating to profile is a good start
                // We could use a query param or state if needed
              }}
              className="text-text-dark hover:text-primary transition-colors"
            >
              <Star size={20} />
            </Link>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-text-dark hover:text-primary transition-colors relative"
              >
                <Bell size={20} />
              </button>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-[9px] font-bold text-white h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-border shadow-xl rounded-lg z-[60] overflow-hidden">
                  <div className="bg-primary text-white px-4 py-2 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider">Notifications</span>
                    <button 
                      onClick={() => dispatch(markAllAsReadServer())}
                      className="text-[10px] hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-text-light italic">No new notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`p-3 border-b border-border last:border-0 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                          {n.carId ? (
                            <Link href={`/auctions/${n.carId}`} onClick={() => setShowNotifications(false)}>
                                <p className="text-xs font-medium text-text-dark hover:text-primary transition-colors">{n.message}</p>
                            </Link>
                          ) : (
                            <p className="text-xs font-medium text-text-dark">{n.message}</p>
                          )}
                          <p className="text-[10px] text-text-light mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => dispatch(clearAllServer())}
                      className="w-full py-2 text-center text-[10px] font-bold text-primary hover:bg-gray-50 border-t border-border"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 text-text-dark hover:text-primary transition-colors cursor-pointer mr-2">
              <Car size={20} />
              <ChevronDown size={14} />
            </div>

            {!mounted ? (
              <div className="w-48 h-10"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  {user?.name?.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-text-body hover:text-red-500 transition-colors border-l border-border pl-4"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm">
                <Link href="/login" className="font-bold text-text-dark hover:text-primary transition-colors">Sign in</Link>
                <span className="text-text-divider">or</span>
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Register now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
