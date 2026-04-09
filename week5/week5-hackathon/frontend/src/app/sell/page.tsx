'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '../../lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

const schema = yup.object().shape({
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  year: yup.number().typeError('Year must be a number').min(1900).max(new Date().getFullYear() + 1).required('Year is required'),
  price: yup.number().typeError('Price must be a number').min(500).required('Max Bid / Price is required'),
  bodyType: yup.string().required('Body type is required'),
  description: yup.string().required('Description is required'),
  auctionEndTime: yup.date().typeError('Invalid date').required('Auction end time is required'),
  imageUrl: yup.string().url('Must be a valid URL'),
});

const bodyTypes = ['Sedan', 'SUV', 'Sports', 'Pickup', 'Convertible', 'Hatchback', 'Coupe', 'Wagon'];

export default function SellCar() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // UI state for toggles that aren't strictly in API
  const [dealerType, setDealerType] = useState('dealer');
  const [isModified, setIsModified] = useState('stock');

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        images: data.imageUrl ? [data.imageUrl] : [],
        status: 'active'
      };
      const res = await axiosInstance.post('/cars', payload);
      setSuccess(true);
      setTimeout(() => router.push(`/auctions/${res.data._id}`), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to list car for auction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white pb-20">
      {/* Page Header */}
      <div className="bg-brand-lightest w-full py-20 pb-24 text-center border-b border-slate-200">
        <h1 className="text-5xl md:text-7xl font-bold text-brand-blue mb-4">Sell Your Car</h1>
        <p className="text-slate-600 max-w-lg mx-auto">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <div className="mt-4 text-sm text-slate-500">
           <span>Home</span> <span className="mx-2">&gt;</span> <span className="text-brand-blue font-semibold">Sell Your Car</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 mt-12 relative z-10">
        
        {success ? (
          <div className="bg-brand-lightest/30 p-12 text-center rounded-md border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
            <h2 className="text-2xl font-bold text-slate-800">Application Submitted!</h2>
            <p className="text-slate-500 mt-2">We'll respond to your application within a business day.</p>
            <p className="text-sm mt-4 text-brand-blue font-semibold animate-pulse">Redirecting...</p>
          </div>
        ) : (
          <>
            <div className="mb-10">
               <h1 className="text-4xl font-bold text-brand-dark mb-4">Tell us about your car</h1>
               <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                 Please give us some basics about yourself and car you'd like to sell . We'll also need details about the car's title status as well as 50 photos that highlight the car's exterior and interior condition.
               </p>
               <p className="text-slate-600 text-sm leading-relaxed">
                 We'll respond to your application within a business day, and we work with you to build a custom and professional listing and get the auction live.
               </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
               
               {/* Your Info Section */}
               <div className="bg-brand-lightest/40 p-8 rounded border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-brand-dark mb-6 inline-block relative">
                     Your Info
                     <div className="absolute -bottom-1 left-0 w-8 h-[3px] bg-brand-orange"></div>
                  </h3>

                  <div className="mb-6">
                     <label className="block text-sm font-semibold text-brand-dark mb-3">Dealer or Private party?</label>
                     <div className="flex space-x-4">
                        <button type="button" onClick={() => setDealerType('dealer')} className={`px-8 py-2 rounded font-semibold text-sm transition-colors border ${dealerType === 'dealer' ? 'bg-white border-brand-orange text-brand-dark shadow-sm' : 'bg-transparent border-slate-300 text-slate-500 hover:bg-white'}`}>Dealer</button>
                        <button type="button" onClick={() => setDealerType('party')} className={`px-8 py-2 rounded font-semibold text-sm transition-colors border ${dealerType === 'party' ? 'bg-white border-brand-orange text-brand-dark shadow-sm' : 'bg-transparent border-slate-300 text-slate-500 hover:bg-white'}`}>Private party</button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">First name*</label>
                        <input type="text" className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white" placeholder="John" />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Last name*</label>
                        <input type="text" className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white" placeholder="Doe" />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Email*</label>
                        <input type="email" className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white" placeholder="your@email.com" />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">phone number*</label>
                        <div className="flex border border-slate-300 rounded focus-within:border-brand-blue bg-white overflow-hidden">
                           <div className="px-3 py-2.5 bg-slate-50 border-r border-slate-300 text-sm text-slate-600 flex items-center space-x-1 cursor-pointer">
                              <span>PK (92)</span>
                              <ChevronDown size={14} />
                           </div>
                           <input type="text" className="w-full px-4 py-2.5 outline-none" placeholder="300 1234567" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Car Details Section */}
               <div className="bg-brand-lightest/40 p-8 rounded border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-brand-dark mb-6 inline-block relative">
                     Car Details
                     <div className="absolute -bottom-1 left-0 w-8 h-[3px] bg-brand-orange"></div>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">VIN*</label>
                        <input type="text" className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white" />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Year*</label>
                        <input type="number" {...register('year')} className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white" />
                        {errors.year?.message && <p className="text-red-500 text-xs mt-1">{String(errors.year.message)}</p>}
                     </div>
                     
                     <div className="relative">
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Make*</label>
                        <input {...register('make')} className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white" placeholder="Select Make" />
                        {errors.make?.message && <p className="text-red-500 text-xs mt-1">{String(errors.make.message)}</p>}
                     </div>
                     <div className="relative">
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Model*</label>
                        <input {...register('model')} className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white" placeholder="All Models" />
                        {errors.model?.message && <p className="text-red-500 text-xs mt-1">{String(errors.model.message)}</p>}
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Mileage (in miles)</label>
                        <input type="text" className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white" />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Body Type*</label>
                        <select {...register('bodyType')} className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white cursor-pointer">
                          <option value="">Select</option>
                          {bodyTypes.map(b => <option key={b} value={b.toLowerCase()}>{b}</option>)}
                        </select>
                        {errors.bodyType?.message && <p className="text-red-500 text-xs mt-1">{String(errors.bodyType.message)}</p>}
                     </div>

                     <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Noteworthy options/features (Description)</label>
                        <textarea {...register('description')} rows={4} className="w-full border border-slate-300 rounded px-4 py-3 outline-none focus:border-brand-blue bg-white"></textarea>
                        {errors.description?.message && <p className="text-red-500 text-xs mt-1">{String(errors.description.message)}</p>}
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-3">Has the car been modified?</label>
                        <div className="flex space-x-4">
                           <button type="button" onClick={() => setIsModified('stock')} className={`flex-1 py-2.5 rounded font-semibold text-sm transition-colors border ${isModified === 'stock' ? 'bg-white border-brand-orange text-brand-dark shadow-sm' : 'bg-transparent border-slate-300 text-slate-500 hover:bg-white'}`}>Completely stock</button>
                           <button type="button" onClick={() => setIsModified('modified')} className={`flex-1 py-2.5 rounded font-semibold text-sm transition-colors border ${isModified === 'modified' ? 'bg-white border-brand-orange text-brand-dark shadow-sm' : 'bg-transparent border-slate-300 text-slate-500 hover:bg-white'}`}>Modified</button>
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Max Bid (Starting Price)*</label>
                        <div className="relative flex items-center border border-slate-300 rounded focus-within:border-brand-blue bg-white overflow-hidden">
                           <span className="pl-4 text-slate-400 font-bold">$</span>
                           <input type="number" {...register('price')} className="w-full px-2 py-2.5 outline-none" />
                        </div>
                        {errors.price?.message && <p className="text-red-500 text-xs mt-1">{String(errors.price.message)}</p>}
                     </div>
                     
                     <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Auction End Time*</label>
                        <input type="datetime-local" {...register('auctionEndTime')} className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white" />
                        {errors.auctionEndTime?.message && <p className="text-red-500 text-xs mt-1">{String(errors.auctionEndTime.message)}</p>}
                     </div>

                     <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Upload Photos (URL)</label>
                        <input {...register('imageUrl')} className="w-full border border-slate-300 rounded px-4 py-2.5 outline-none focus:border-brand-blue bg-white mb-2" placeholder="https://..." />
                        <button type="button" className="bg-white border border-slate-300 text-slate-600 font-semibold px-6 py-2 rounded text-sm hover:bg-slate-50 transition-colors shadow-sm">Add Photos</button>
                     </div>
                  </div>

                  <button type="submit" disabled={loading} className="px-10 bg-brand-blue hover:bg-brand-dark text-white font-medium py-3 rounded shadow transition-colors w-fit md:w-auto min-w-[150px]">
                     {loading ? 'Submitting...' : 'Submit'}
                  </button>
               </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
