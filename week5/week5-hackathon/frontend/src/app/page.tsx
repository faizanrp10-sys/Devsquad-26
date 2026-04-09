'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronDown, Rocket, Star } from 'lucide-react';
import axiosInstance from '../lib/axios';

export default function Home() {
  const [liveCars, setLiveCars] = useState<any[]>([]);
  
  // Search state
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    year: '',
    price: ''
  });

  useEffect(() => {
    // Fetch live auctions
    axiosInstance.get('/cars?status=active').then(res => setLiveCars(res.data)).catch(err => console.error(err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams(searchParams).toString();
    window.location.href = `/auctions?${query}`;
  };

  return (
    <div className="flex flex-col w-full -mt-[104px]">
      {/* HERO SECTION */}
      <section 
        className="relative w-full h-[700px] flex items-center justify-center bg-brand-dark bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80')" }}
      >
        <div className="absolute inset-0 bg-slate-900/60 z-0"></div>
        
        <div className="z-10 w-full px-6 md:px-12 mt-20 flex flex-col justify-center max-w-7xl mx-auto h-full">
          <div className="max-w-2xl text-left">
            <div className="inline-block bg-white/90 text-brand-blue font-bold px-4 py-2 rounded mb-6 text-sm">
               WELCOME TO AUCTION
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-wide">
              Find Your <br/> Dream Car
            </h1>
            <p className="text-sm md:text-base text-slate-300 mb-12 max-w-md leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus elementum cursus tincidunt sagittis elementum suspendisse velit arcu.
            </p>
          </div>

          {/* Search Bar Widget */}
          <form onSubmit={handleSearch} className="w-full max-w-4xl bg-white p-2 md:p-0 rounded-md md:rounded-lg flex flex-col md:flex-row shadow-2xl relative self-start">
            <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="flex flex-col px-6 py-4 justify-center relative flex-1 cursor-pointer">
                <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Make</span>
                <div className="flex justify-between items-center text-sm font-semibold text-brand-dark">
                  <span>Audi</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col px-6 py-4 justify-center relative flex-1 cursor-pointer">
                <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Model</span>
                <div className="flex justify-between items-center text-sm font-semibold text-brand-dark">
                  <span className="opacity-0">Placeholder</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>

               <div className="flex flex-col px-6 py-4 justify-center relative flex-1 cursor-pointer">
                <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Year</span>
                <div className="flex justify-between items-center text-sm font-semibold text-brand-dark">
                  <span className="opacity-0">Placeholder</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col px-6 py-4 justify-center relative flex-1 cursor-pointer">
                <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Price</span>
                <div className="flex justify-between items-center text-sm font-semibold text-brand-dark">
                  <span className="opacity-0">Placeholder</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>
            </div>
            <button type="submit" className="bg-brand-button hover:bg-brand-dark text-white font-semibold px-8 py-4 md:rounded-r-lg transition-colors flex items-center justify-center space-x-2 md:w-40">
              <Search size={18} />
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* LIVE AUCTION SECTION */}
      <section className="py-20 bg-brand-blue min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-white mb-6">Live Auction</h2>
            <div className="w-full max-w-sm flex items-center justify-center relative pt-4 pb-12">
               <div className="absolute w-full h-[1px] bg-white/30 top-1/2 left-0 -translate-y-1/2 z-0"></div>
               <div className="w-4 h-4 bg-brand-orange rotate-45 relative z-10"></div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center space-x-8 text-white text-lg border-b border-white/20 mb-12">
            <button className="pb-2 text-brand-orange border-b-2 border-brand-orange font-medium">Live Auction</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Demo list if empty (for UI checking) */}
            {(liveCars.length > 0 ? liveCars : [1,2,3,4]).map((car, idx) => (
              <div key={idx} className="bg-white rounded overflow-hidden shadow-lg flex flex-col group relative">
                
                <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 flex items-center space-x-1 z-10 w-fit custom-clip-path">
                   <span>Trending</span>
                   <Rocket size={12} />
                </div>

                <div className="absolute top-2 right-2 w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-brand-orange hover:border-brand-orange cursor-pointer transition-colors z-10">
                  <Star size={14} />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                   <h3 className="text-center font-bold text-lg text-brand-dark mb-4 mt-2">
                     {car.make ? `${car.make} ${car.model}` : "Mazda MX - 5"}
                   </h3>
                   
                   <div className="h-32 relative mb-6">
                     <img 
                       src={car.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80'} 
                       className="w-full h-full object-contain"
                       alt="Car"
                     />
                   </div>

                   <div className="flex justify-between items-center px-2 py-3 border-t border-b border-slate-100 text-sm">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-brand-dark">${car.price ? car.price.toLocaleString() : '1,079.99'}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Current Bid</span>
                      </div>
                      <div className="h-6 w-px bg-slate-200"></div>
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-brand-dark">10 : 20 : 47</span>
                        <span className="text-[10px] text-slate-500 font-medium">Waiting for Bid</span>
                      </div>
                   </div>
                   
                   <button className="w-full mt-4 bg-brand-blue hover:bg-brand-dark text-white font-medium py-3 rounded text-sm transition-colors">
                     Submit A Bid
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
