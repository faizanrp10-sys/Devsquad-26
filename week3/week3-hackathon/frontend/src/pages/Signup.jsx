import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Mail from '@mui/icons-material/Mail';
import Lock from '@mui/icons-material/Lock';
import Person from '@mui/icons-material/Person';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import { Alert, CircularProgress } from '@mui/material';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/login', { state: { message: 'Account created successfully! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Abstract Background Side */}
      <div className="hidden lg:block relative overflow-hidden bg-[#D4A373]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594631252845-29fc458631b6?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-overlay opacity-50 hover:scale-105 transition-transform duration-[15s]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-20 text-white z-10">
          <div className="bg-white/20 backdrop-blur-md p-10 rounded-3xl border border-white/30 text-center">
            <LocalFlorist sx={{ fontSize: 60, mb: 3 }} />
            <h2 className="text-5xl font-black mb-6 leading-tight">Join the Ritual.</h2>
            <p className="text-lg text-white/90 max-w-sm">Create an account to start your journey into the finest artisan teas curated from rare estates.</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center bg-[#F8F5F2] p-8 md:p-20 relative">
        <Link to="/" className="absolute top-10 left-10 text-[#6B705C] hover:text-[#4A6741] transition-colors flex items-center font-bold">
          <ArrowBack className="mr-2" /> Back
        </Link>
        
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-[#2D312B] mb-2">Create Account</h1>
            <p className="text-[#6B705C]">Start your premium tea experience today.</p>
          </div>

          {error && <Alert severity="error" className="mb-8 rounded-2xl">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D312B] ml-2">Full Name</label>
              <div className="relative">
                <Person className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B705C]" fontSize="small" />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#4A6741] focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D312B] ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B705C]" fontSize="small" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#4A6741] focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D312B] ml-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B705C]" fontSize="small" />
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#4A6741] focus:border-transparent outline-none transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D312B] ml-2">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B705C]" fontSize="small" />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#4A6741] focus:border-transparent outline-none transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#4A6741] text-white py-5 mt-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#3D5535] transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-10 text-center text-[#6B705C]">
            Already have an account? <Link to="/login" className="text-[#4A6741] font-black hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
