import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Mail from '@mui/icons-material/Mail';
import Lock from '@mui/icons-material/Lock';
import Person from '@mui/icons-material/Person';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { Alert, CircularProgress } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.role === 'admin' || userData.role === 'superadmin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error details:', err);
      const backendMessage = err.response?.data?.message;
      const status = err.response?.status;
      setError(backendMessage || `Failed to login (${status || 'Network Error'})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Abstract Background Side */}
      <div className="hidden lg:block relative overflow-hidden bg-[#4A6741]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-overlay opacity-50 transition-scale duration-[20s] hover:scale-110"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-20 text-white z-10">
          <h2 className="text-6xl font-black mb-6 leading-tight">Steeped in <br /> Perfection.</h2>
          <p className="text-xl text-white/80 max-w-md text-center">Join our community of tea connoisseurs and experience the art of slow living.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center bg-[#F8F5F2] p-8 md:p-20 relative">
        <Link to="/" className="absolute top-10 left-10 text-[#6B705C] hover:text-[#4A6741] transition-colors flex items-center font-bold">
          <ArrowBack className="mr-2" /> Back
        </Link>
        
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-[#2D312B] mb-4">Welcome Back</h1>
            <p className="text-[#6B705C]">Enter your credentials to access your account</p>
          </div>

          {successMessage && <Alert severity="success" className="mb-8 rounded-2xl">{successMessage}</Alert>}
          {error && <Alert severity="error" className="mb-8 rounded-2xl">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#2D312B] ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B705C]" fontSize="small" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#4A6741] focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#2D312B]">Password</label>
                <Link to="/forgot-password" size="small" className="text-xs text-[#6B705C] hover:text-[#4A6741] font-bold">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B705C]" fontSize="small" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#4A6741] focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#4A6741] text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#3D5535] transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-12 text-center text-[#6B705C]">
            Don't have an account? <Link to="/signup" className="text-[#4A6741] font-black hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
