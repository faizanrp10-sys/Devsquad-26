import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Dashboard from '@mui/icons-material/Dashboard';
import Inventory from '@mui/icons-material/Inventory';
import People from '@mui/icons-material/People';
import LocalMall from '@mui/icons-material/LocalMall';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Block from '@mui/icons-material/Block';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, ordersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/orders')
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, isCurrentlyBlocked) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isBlocked: !isCurrentlyBlocked });
      fetchAdminData();
    } catch (error) {
      console.error('Error toggling user status', error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <CircularProgress sx={{ color: '#4A6741' }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#2D312B]">Command Center</h1>
            <p className="text-[#6B705C]">Manage your treasury and operations</p>
          </div>
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-[#4A6741] text-white shadow-md' : 'text-[#6B705C] hover:bg-gray-50'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-[#4A6741] text-white shadow-md' : 'text-[#6B705C] hover:bg-gray-50'}`}
            >
              Users
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-[#4A6741] text-white shadow-md' : 'text-[#6B705C] hover:bg-gray-50'}`}
            >
              Orders
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `$${(analytics?.totalRevenue || 0).toFixed(2)}`, icon: <TrendingUp />, color: 'bg-green-100 text-green-700' },
                { label: 'Orders placed', value: analytics?.totalOrders || 0, icon: <LocalMall />, color: 'bg-blue-100 text-blue-700' },
                { label: 'Tea Enthusiasts', value: analytics?.totalUsers || 0, icon: <People />, color: 'bg-orange-100 text-orange-700' },
                { label: 'Tea Catalog', value: analytics?.totalProducts || 0, icon: <Inventory />, color: 'bg-purple-100 text-purple-700' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6B705C]">{stat.label}</p>
                    <p className="text-2xl font-black text-[#2D312B]">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-[#2D312B] rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">Manage Inventory</h2>
                <p className="text-white/60">Add new variations or restock existing tea collections.</p>
              </div>
              <button className="bg-white text-[#2D312B] px-8 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#D4A373] hover:text-white transition-all shadow-xl">
                Add New Product
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <TableContainer component={Paper} className="rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <Table>
              <TableHead className="bg-gray-50">
                <TableRow>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs">Name</TableCell>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs">Email</TableCell>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs">Role</TableCell>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs">Status</TableCell>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs" align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-bold text-[#2D312B]">{user.name}</TableCell>
                    <TableCell className="text-[#6B705C]">{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.isBlocked ? (
                        <span className="flex items-center text-red-500 text-xs font-bold uppercase tracking-widest">
                          <Block fontSize="inherit" className="mr-1" /> Blocked
                        </span>
                      ) : (
                        <span className="flex items-center text-green-500 text-xs font-bold uppercase tracking-widest">
                          <CheckCircle fontSize="inherit" className="mr-1" /> Active
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={user.isBlocked ? 'Unblock User' : 'Block User'}>
                        <IconButton onClick={() => handleToggleBlock(user._id, user.isBlocked)}>
                          {user.isBlocked ? <CheckCircle className="text-green-500" /> : <Block className="text-red-500" />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 'orders' && (
          <TableContainer component={Paper} className="rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <Table>
              <TableHead className="bg-gray-50">
                <TableRow>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs">Order ID</TableCell>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs">Customer</TableCell>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs">Items</TableCell>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs">Total</TableCell>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs">Status</TableCell>
                  <TableCell className="font-bold text-[#6B705C] uppercase tracking-widest text-xs" align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-mono text-xs text-[#6B705C]">{order._id.substring(18)}</TableCell>
                    <TableCell>
                      <div className="font-bold text-[#2D312B]">{order.user?.name || 'Guest'}</div>
                      <div className="text-[10px] text-[#6B705C]">{order.user?.email}</div>
                    </TableCell>
                    <TableCell className="text-[#6B705C]">{order.items.length} items</TableCell>
                    <TableCell className="font-bold text-[#4A6741]">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><Edit fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
