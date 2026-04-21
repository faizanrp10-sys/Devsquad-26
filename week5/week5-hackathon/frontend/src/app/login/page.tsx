'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '../../lib/axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/userSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setError('');
      const res = await axiosInstance.post('/auth/login', data);
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
      }
      dispatch(loginSuccess({ user: res.data.user, token: res.data.access_token }));
      router.push('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Banner */}
      <div className="page-banner pt-8 pb-8">
        <h1>Login</h1>
        <div className="divider" />
        <p>Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.</p>
        <div className="breadcrumb mt-4">
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white font-medium">Login</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-12">
        {/* Tab Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex border border-border rounded-full overflow-hidden">
            <Link href="/register" className="px-8 py-3 text-sm font-medium text-text-body hover:bg-gray-50 transition-colors">
              Register
            </Link>
            <Link href="/login" className="px-8 py-3 text-sm font-medium bg-primary text-white">
              Login
            </Link>
          </div>
        </div>

        {/* Login Card */}
        <div className="border border-border rounded-lg p-8">
          <h2 className="text-xl font-bold text-primary text-center mb-2">Log In</h2>
          <p className="text-sm text-text-body text-center mb-8">
            New member? <Link href="/register" className="text-primary font-semibold hover:underline">Register Here</Link>
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Enter Your Email*</label>
              <input
                {...register('email')}
                type="email"
                className="w-full border border-border rounded px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary transition-colors"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Password*</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border border-border rounded px-4 py-3 text-sm text-text-dark focus:outline-none focus:border-primary transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-body"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-primary">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-primary hover:underline">Forget Password</Link>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded text-sm font-bold transition-colors"
            >
              Log in
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-primary mb-4">Or Register With</p>
            <div className="flex justify-center space-x-4">
              <button className="h-12 w-12 rounded-full border border-border flex items-center justify-center text-lg hover:bg-gray-50 transition-colors">
                G
              </button>
              <button className="h-12 w-12 rounded-full border border-border flex items-center justify-center text-lg text-blue-600 hover:bg-gray-50 transition-colors">
                f
              </button>
              <button className="h-12 w-12 rounded-full border border-border flex items-center justify-center text-lg text-blue-400 hover:bg-gray-50 transition-colors">
                𝕏
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
