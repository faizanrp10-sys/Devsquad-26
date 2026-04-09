'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/userSlice';
import { useRouter, usePathname } from 'next/navigation';
import { Mail, Star, Bell, Car } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const isHome = pathname === '/';
  
  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="bg-brand-blue text-slate-200 text-xs py-2 px-6 md:px-12 flex justify-between items-center font-medium">
        <div>
          <span>Call Us 570-694-4002</span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail size={14} />
          <span>Email Id : info@cardeposit.com</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`w-full py-4 px-6 md:px-12 flex items-center justify-between ${isHome ? 'absolute z-50 bg-transparent text-white' : 'bg-brand-lightest text-brand-dark'} shadow-sm md:shadow-none`}>
        <div className="flex items-center space-x-12">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-12 bg-brand-orange rounded-md flex items-center justify-center">
               <span className="text-white text-xs font-bold">CAR</span>
            </div>
            <span className={`text-2xl font-bold ${isHome ? 'text-white' : 'text-brand-dark'}`}>
              Car <span className="text-emerald-500">Deposit</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <Link href="/" className={`${pathname === '/' ? 'text-brand-orange border-b-2 border-brand-orange' : 'hover:text-brand-orange'} pb-1 transition-colors`}>Home</Link>
            <Link href="/auctions" className={`${pathname === '/auctions' ? 'text-brand-orange border-b-2 border-brand-orange' : 'hover:text-brand-orange'} pb-1 transition-colors`}>Car Auction</Link>
            <Link href="/sell" className={`${pathname === '/sell' ? 'text-brand-orange border-b-2 border-brand-orange' : 'hover:text-brand-orange'} pb-1 transition-colors`}>Sell Your Car</Link>
            <Link href="/about" className="hover:text-brand-orange pb-1 transition-colors">About us</Link>
            <Link href="/contact" className="hover:text-brand-orange pb-1 transition-colors">Contact</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <Link href="/profile/wishlist" className={`hover:text-brand-orange ${isHome ? 'text-white' : 'text-brand-dark'}`}>
                <Star size={20} />
              </Link>
              <button className={`hover:text-brand-orange relative ${isHome ? 'text-white' : 'text-brand-dark'}`}>
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">8</span>
              </button>
              <Link href="/profile" className={`hover:text-brand-orange flex items-center space-x-1 ${isHome ? 'text-white' : 'text-brand-dark'}`}>
                <Car size={20} />
              </Link>
              <button onClick={handleLogout} className="text-xs font-semibold text-red-500 hover:text-red-600 underline">Logout</button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 text-sm font-semibold">
              <Link href="/login" className="hover:text-brand-orange transition-colors">Sign in</Link>
              <span className="text-slate-400">or</span>
              <Link href="/register" className="bg-brand-button hover:bg-brand-blue text-white px-6 py-2 rounded-md transition-colors shadow-md">
                Register now
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
