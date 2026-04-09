import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Video, CreditCard, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  return (
    <div className="w-64 bg-[#0F0F0F] border-r border-[#1A1A1A] h-full min-h-screen fixed pt-[100px] flex flex-col">
      <div className="flex-grow px-4 py-8 space-y-2">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brandPrimary text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'}`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brandPrimary text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'}`}
        >
          <Users size={20} /> User Management
        </NavLink>
        <NavLink 
          to="/admin/videos" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brandPrimary text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'}`}
        >
          <Video size={20} /> Video Management
        </NavLink>
        <NavLink 
          to="/admin/plans" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brandPrimary text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'}`}
        >
          <CreditCard size={20} /> Plan Management
        </NavLink>
      </div>
      
      <div className="p-4 border-t border-[#1A1A1A] mb-4">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A1A1A] transition-colors"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
