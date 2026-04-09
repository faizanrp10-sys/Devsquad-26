import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, isAdminLogin);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen pt-[120px] flex justify-center items-center bg-brandDark px-4">
      <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Sign In</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center justify-between mt-2 mb-4">
            <label className="flex items-center text-gray-400 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                className="mr-2 accent-brandPrimary w-4 h-4 cursor-pointer align-middle"
                checked={isAdminLogin}
                onChange={(e) => setIsAdminLogin(e.target.checked)}
              />
              Admin Login ?
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-brandPrimary text-white font-medium py-3 rounded hover:bg-red-700 transition-colors mt-4"
          >
            Sign In
          </button>
        </form>
        
        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account? <Link to="/register" className="text-white hover:text-brandPrimary hover:underline">Sign up now.</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
