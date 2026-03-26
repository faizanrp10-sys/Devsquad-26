import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import Person from '@mui/icons-material/Person';
import LocalShipping from '@mui/icons-material/LocalShipping';
import History from '@mui/icons-material/History';
import Info from '@mui/icons-material/Info';
import Logout from '@mui/icons-material/Logout';
import { 
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <CircularProgress sx={{ color: '#4A6741' }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* User Info Sidebar */}
          <div className="md:w-1/3 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#4A6741] flex items-center justify-center text-white text-4xl font-bold mb-6 shadow-xl">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-[#2D312B]">{user.name}</h2>
              <p className="text-[#6B705C]">{user.email}</p>
              <span className="mt-4 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                {user.role} Enthusiast
              </span>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold"
              >
                <Logout fontSize="small" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Orders Section */}
          <div className="md:w-2/3">
            <div className="flex items-center space-x-2 mb-8">
              <History className="text-[#4A6741]" />
              <h3 className="text-2xl font-bold text-[#2D312B]">Order History</h3>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
                <p className="text-[#6B705C]">No orders placed yet. Start your journey today!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50">
                    <div className="p-6 bg-gray-50 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-[#6B705C] tracking-widest">Order ID</span>
                        <span className="font-mono text-xs">{order._id}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-[#6B705C] tracking-widest">Status</span>
                        <span className={`text-xs font-bold uppercase tracking-widest ${
                          order.status === 'delivered' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                              <div>
                                <h4 className="font-bold text-sm text-[#2D312B]">{item.variantName} Tea</h4>
                                <p className="text-xs text-[#6B705C]">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-bold text-[#4A6741]">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Divider className="my-6" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B705C] text-sm">Planted on {new Date(order.createdAt).toLocaleDateString()}</span>
                        <div className="text-right">
                          <span className="text-xs text-[#6B705C] block">Total Amount</span>
                          <span className="text-xl font-bold text-[#2D312B]">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
