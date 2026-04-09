import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Layout, CheckSquare, Github } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Do not show the Navbar on login and register pages or if not authenticated
  if (!token || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between backdrop-blur-md bg-opacity-80">
      <div className="flex items-center space-x-8">
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight hidden sm:block">Taskly</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          <Link 
            to="/dashboard" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive('/dashboard') ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Layout className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link 
            to="/dashboard" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive('/tasks') ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="text-sm font-medium">My Tasks</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex flex-col items-end mr-2 text-right">
          <p className="text-xs font-bold text-white leading-none mb-1">User Name</p>
          <p className="text-[10px] text-slate-500 font-medium">Pro Account</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-sm shadow-inner uppercase">
          UN
        </div>
        <div className="h-6 w-px bg-slate-800 mx-2 hidden sm:block"></div>
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
