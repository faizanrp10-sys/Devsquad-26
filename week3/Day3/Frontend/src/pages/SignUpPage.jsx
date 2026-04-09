import React from 'react';
import SignUpForm from '../components/SignUpForm';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950">
      <div className="mb-8 text-center text-white">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
          <span className="text-white text-3xl font-bold">T</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Create Account
        </h1>
        <p className="text-slate-400">
          Join us and manage your tasks effectively.
        </p>
      </div>

      <div className="card p-8 w-full max-w-md bg-slate-900/50 backdrop-blur-xl border-white/5">
        <SignUpForm />
        
        <div className="mt-8 text-center text-sm">
          <p className="text-slate-500">
            Already have an account? {' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
