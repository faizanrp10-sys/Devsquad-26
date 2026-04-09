import React, { useState, useEffect } from 'react';
import { Users, Video, CreditCard } from 'lucide-react';
import { adminService } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalVideos: 0, activeSubscriptions: 0 });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-6 rounded-xl flex items-center gap-4">
          <div className="bg-brandPrimary/20 p-4 rounded-lg">
            <Users className="text-brandPrimary" size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
          </div>
        </div>
        
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-6 rounded-xl flex items-center gap-4">
          <div className="bg-blue-500/20 p-4 rounded-lg">
            <Video className="text-blue-500" size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Videos</p>
            <h3 className="text-2xl font-bold text-white">{stats.totalVideos}</h3>
          </div>
        </div>
        
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] p-6 rounded-xl flex items-center gap-4">
          <div className="bg-green-500/20 p-4 rounded-lg">
            <CreditCard className="text-green-500" size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Active Subscriptions</p>
            <h3 className="text-2xl font-bold text-white">{stats.activeSubscriptions}</h3>
          </div>
        </div>
      </div>

      <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-6">
         <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
         <div className="text-gray-400 text-center py-10">
            No recent activity to show.
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
