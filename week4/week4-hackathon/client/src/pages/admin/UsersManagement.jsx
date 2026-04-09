import React, { useState, useEffect } from 'react';
import { Shield, ShieldOff } from 'lucide-react';
import { adminService } from '../../services/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      alert("Failed to fetch users list");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id) => {
    try {
      await adminService.toggleBlockUser(id);
      // Update local state to reflect the change immediately
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (error) {
      console.error("Failed to toggle user block status", error);
      alert(error.response?.data?.message || "Failed to toggle block status");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">User Management</h1>
      
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading users...</div>
      ) : (
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#141414] border-b border-[#262626]">
                <th className="p-4 text-gray-400 font-medium">Name</th>
                <th className="p-4 text-gray-400 font-medium">Email</th>
                <th className="p-4 text-gray-400 font-medium">Plan</th>
                <th className="p-4 text-gray-400 font-medium">Status</th>
                <th className="p-4 text-gray-400 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user._id} className="border-b border-[#1A1A1A] hover:bg-[#141414] transition-colors text-white">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.subscription?.status === 'active' ? 'Subscribed' : 'None'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isBlocked ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => toggleBlock(user._id)}
                        className={`flex items-center gap-2 ml-auto px-3 py-1 rounded text-sm font-medium transition-colors ${user.isBlocked ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                      >
                        {user.isBlocked ? <><Shield size={16}/> Unblock</> : <><ShieldOff size={16}/> Block</>}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 italic">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
