import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Dashboard from './Dashboard';
import UsersManagement from './UsersManagement';
import VideosManagement from './VideosManagement';
import PlanManagement from './PlanManagement';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-brandDark">
      <AdminSidebar />
      <div className="flex-grow ml-64 pt-[100px] p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/videos" element={<VideosManagement />} />
          <Route path="/plans" element={<PlanManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
