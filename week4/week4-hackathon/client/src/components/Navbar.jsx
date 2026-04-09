import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50   px-8 flex items-center justify-between h-[80px]">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <img src="/logo.png" alt="logo" className="w-[50px] h-[50px] object-contain"/>
          <span className="text-xl font-semibold text-white tracking-wide font-sans">StreamVibe</span>
        </Link>
      </div>

      <div className="hidden md:flex bg-[#141414] items-center bg-[#0F0F0F] rounded-full p-2 px-3 border border-[#1A1A1A]">
        <Link to="/" className="text-gray-300 hover:text-white px-4 py-2 hover:bg-[#1A1A1A] rounded-full transition-colors">Home</Link>
        <Link to="/movies-shows" className="text-gray-300 hover:text-white px-4 py-2 hover:bg-[#1A1A1A] rounded-full transition-colors">Movies & Shows</Link>
        <Link to="/support" className="text-gray-300 hover:text-white px-4 py-2 hover:bg-[#1A1A1A] rounded-full transition-colors">Support</Link>
        <Link to="/subscriptions" className="text-gray-300 hover:text-white px-4 py-2 hover:bg-[#1A1A1A] rounded-full transition-colors">Subscriptions</Link>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-gray-300 hover:text-white"><Search size={22} /></button>
        <button className="text-gray-300 hover:text-white"><Bell size={22} /></button>
        {user ? (
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Link to="/admin" className="text-brandPrimary hover:text-white font-medium">Admin Panel</Link>
            )}
            <div className="flex items-center gap-3">
               <span className="text-gray-300 text-sm hidden md:inline">{user.name}</span>
               <button onClick={handleLogout} className="bg-brandGray rounded px-4 py-2 hover:bg-opacity-80 transition text-sm">Logout</button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
             <Link to="/login" className="px-4 py-2 rounded text-white bg-brandGray hover:bg-[#222]">Login</Link>
             <Link to="/register" className="px-4 py-2 rounded bg-brandPrimary text-white hover:bg-red-700">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
