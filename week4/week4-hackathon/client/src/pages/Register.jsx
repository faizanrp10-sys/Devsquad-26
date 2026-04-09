import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen pt-[120px] pb-[60px] flex justify-center items-center bg-brandDark px-4">
      <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Account</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:outline-none focus:border-brandPrimary transition-colors"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:outline-none focus:border-brandPrimary transition-colors"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:outline-none focus:border-brandPrimary transition-colors"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Confirm Password</label>
            <input 
              type="password" 
              className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:outline-none focus:border-brandPrimary transition-colors"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-brandPrimary text-white font-medium py-3 rounded hover:bg-red-700 transition-colors mt-6"
          >
            Sign Up
          </button>
        </form>
        
        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account? <Link to="/login" className="text-white hover:text-brandPrimary hover:underline">Sign in.</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
