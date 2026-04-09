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

const GoogleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>;

const schema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup.string().required('Mobile number is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data: any) => {
    try {
      const { confirmPassword, mobile, username, ...payload } = data;
      const res = await axiosInstance.post('/auth/register', payload);
      dispatch(loginSuccess({ user: res.data.user, token: res.data.access_token }));
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white pb-20">
      {/* Page Header */}
      <div className="bg-brand-lightest w-full py-20 pb-24 text-center border-b border-slate-200">
        <h1 className="text-5xl md:text-7xl font-bold text-brand-blue mb-4">Register</h1>
        <p className="text-slate-600 max-w-lg mx-auto">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <div className="mt-4 text-sm text-slate-500">
           <span>Home</span> <span className="mx-2">&gt;</span> <span className="text-brand-blue font-semibold">Register</span>
        </div>
      </div>

      <div className="flex-grow w-full max-w-3xl mx-auto -mt-10 px-6 relative z-10 flex flex-col items-center">
        {/* Toggle Switch */}
        <div className="flex bg-white rounded-full p-1 shadow border border-slate-200 w-64 justify-between relative mb-8">
           <div className="flex-1 text-center py-2 text-sm font-semibold text-white bg-brand-blue rounded-full shadow-md z-10">
             Register
           </div>
           <Link href="/login" className="flex-1 text-center py-2 text-sm font-semibold text-slate-700 rounded-full transition-colors z-10">
             Login
           </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-10 w-full mb-20 relative">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-dark flex flex-col items-center">
              Register
              <div className="w-12 h-[2px] bg-brand-orange mt-2"></div>
            </h2>
            <p className="text-sm mt-4 text-slate-500">
              Do you already have an account? <Link href="/login" className="text-brand-blue font-semibold hover:underline">Login Here</Link>
            </p>
          </div>

          {errorMsg && <div className="bg-red-50 text-red-500 p-3 rounded text-sm mb-6 text-center border border-red-100">{errorMsg}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-brand-dark font-bold text-sm mb-4">Personal Information <div className="w-8 h-[2px] bg-brand-orange mt-1"></div></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-brand-dark mb-2">Enter Your Full Name*</label>
                  <input 
                    {...register('name')} 
                    className="w-full px-4 py-3 rounded border border-slate-300 focus:border-brand-blue outline-none transition-colors" 
                  />
                  {errors.name?.message && <p className="text-red-500 text-xs mt-1">{String(errors.name.message)}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-2">Enter Your Email*</label>
                  <input 
                    {...register('email')} 
                    className="w-full px-4 py-3 rounded border border-slate-300 focus:border-brand-blue outline-none transition-colors" 
                  />
                  {errors.email?.message && <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-2">Enter Mobile Number*</label>
                  <div className="flex border border-slate-300 rounded focus-within:border-brand-blue transition-colors">
                    <select className="bg-slate-50 px-3 py-3 border-r border-slate-300 text-sm outline-none text-slate-600 rounded-l">
                      <option>India (91)</option>
                      <option>US (1)</option>
                      <option>UK (44)</option>
                    </select>
                    <input 
                      {...register('mobile')} 
                      className="w-full px-4 py-3 rounded-r outline-none" 
                    />
                  </div>
                  {errors.mobile?.message && <p className="text-red-500 text-xs mt-1">{String(errors.mobile.message)}</p>}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-brand-dark font-bold text-sm mb-4">Account Information <div className="w-8 h-[2px] bg-brand-orange mt-1"></div></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 relative">
                  <label className="block text-xs font-semibold text-brand-dark mb-2">Username*</label>
                  <input 
                    {...register('username')} 
                    className="w-full px-4 py-3 rounded border border-slate-300 focus:border-brand-blue outline-none transition-colors" 
                  />
                  <span className="absolute right-4 top-[36px] text-xs font-semibold text-brand-blue underline cursor-pointer hover:text-brand-dark">Check Availability</span>
                  {errors.username?.message && <p className="text-red-500 text-xs mt-1">{String(errors.username.message)}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-2">Password*</label>
                  <input 
                    type="password"
                    {...register('password')} 
                    className="w-full px-4 py-3 rounded border border-slate-300 focus:border-brand-blue outline-none transition-colors" 
                  />
                  {errors.password?.message && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-2">Confirm Password*</label>
                  <input 
                    type="password"
                    {...register('confirmPassword')} 
                    className="w-full px-4 py-3 rounded border border-slate-300 focus:border-brand-blue outline-none transition-colors" 
                  />
                  {errors.confirmPassword?.message && <p className="text-red-500 text-xs mt-1">{String(errors.confirmPassword.message)}</p>}
                </div>
              </div>
            </div>

            {/* Prove You Are Human */}
            <div>
               <h3 className="text-brand-dark font-bold text-sm mb-4">Prove You Are Human</h3>
               <div className="border border-slate-200 bg-slate-50 rounded p-4 flex items-center justify-center space-x-4 max-w-sm">
                 <input type="checkbox" className="w-6 h-6 border-slate-300 cursor-pointer" />
                 <span className="text-sm font-semibold text-brand-blue">I'm not a robot</span>
               </div>
            </div>

            <div className="flex items-center space-x-2 text-sm mt-4">
              <input required type="checkbox" id="terms" className="border-slate-300 rounded cursor-pointer w-4 h-4 accent-brand-blue" />
              <label htmlFor="terms" className="text-brand-blue font-semibold text-xs cursor-pointer">I agree to the Terms & Conditions</label>
            </div>

            <button type="submit" className="w-full bg-brand-button hover:bg-brand-dark text-white font-medium py-4 rounded transition-colors shadow-sm">
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-brand-blue font-medium mb-4 text-sm">Or Login With</p>
            <div className="flex items-center justify-center space-x-6">
               <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                 <GoogleIcon />
               </button>
               <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                 <FacebookIcon />
               </button>
               <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                 <TwitterIcon />
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
