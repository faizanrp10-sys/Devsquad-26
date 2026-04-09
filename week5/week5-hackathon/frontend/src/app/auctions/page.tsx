'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axios';
import Link from 'next/link';
import { Star, ChevronDown, Rocket } from 'lucide-react';

export default function AuctionsList() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [make, setMake] = useState('');
  const [maxPrice, setMaxPrice] = useState(100000);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCars();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [make, maxPrice]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/cars?status=active${make ? `&make=${make}` : ''}`);
      let filtered = res.data;
      if (maxPrice) {
        filtered = filtered.filter((car: any) => parseFloat(car.price) <= maxPrice);
      }
      setCars(filtered);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-20">
      {/* Page Header */}
      <div className="bg-brand-lightest w-full py-20 pb-24 text-center border-b border-slate-200">
        <h1 className="text-5xl md:text-7xl font-bold text-brand-blue mb-4">Auction</h1>
        <p className="text-slate-600 max-w-lg mx-auto">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <div className="mt-4 text-sm text-slate-500">
           <span>Home</span> <span className="mx-2">&gt;</span> <span className="text-brand-blue font-semibold">Auction</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 -mt-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: LISTINGS */}
          <div className="w-full lg:w-3/4 flex flex-col space-y-6">
            
            {/* Top Results Bar */}
            <div className="bg-brand-blue text-white rounded-md p-4 flex justify-between items-center shadow-sm">
               <span className="font-medium text-sm">Showing 1-5 of 10 Results</span>
               <div className="bg-white rounded px-4 py-2 flex items-center space-x-4 cursor-pointer text-brand-dark text-sm font-semibold">
                  <span>Sort By Newness</span>
                  <ChevronDown size={14} className="text-brand-dark" />
               </div>
            </div>

            {loading ? (
              <div className="w-full h-64 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-md shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700">No cars found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {(cars.length > 0 ? cars : [1,2,3,4,5]).map((car, idx) => (
                  <div key={car._id || idx} className="bg-white border border-slate-200 rounded-md shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow relative p-4 group">
                    
                    {/* Star Icon Top Right */}
                    <button className="absolute top-4 right-4 w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-orange hover:border-brand-orange transition-colors">
                      <Star size={14} />
                    </button>

                    {/* Image Area */}
                    <div className="w-full md:w-1/3 h-48 relative rounded overflow-hidden">
                      {/* Trending Tag */}
                      <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 flex items-center space-x-1 z-10 custom-clip-path">
                        <span>Trending</span>
                        <Rocket size={12} />
                      </div>
                      
                      <img 
                         src={car.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80'} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         alt={car.model || 'Car'}
                      />
                    </div>
                    
                    {/* Main Details */}
                    <div className="w-full md:w-1/3 flex flex-col px-6 py-2 justify-between">
                       <div>
                         <h3 className="font-bold text-xl text-brand-dark mb-1">{car.make ? `${car.make} ${car.model}` : "Kia Carnival"}</h3>
                         <div className="flex text-brand-orange space-x-1 mb-3">
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed mb-4">
                           Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis.
                         </p>
                       </div>
                       <Link href={`/auctions/${car._id || '123'}`} className="text-xs font-bold text-brand-blue hover:underline">
                         View Details
                       </Link>
                    </div>

                    {/* Bidding Info UI */}
                    <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-slate-100 pl-0 md:pl-6 pt-4 md:pt-2 flex flex-col justify-between">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-brand-dark font-bold">${car.price ? car.price.toLocaleString() : '1,079.99'}</p>
                            <p className="text-[10px] font-semibold text-slate-400">Current Bid</p>
                          </div>
                          <div>
                            <p className="text-brand-dark font-bold">{Math.floor(Math.random() * 50) + 100}</p>
                            <p className="text-[10px] font-semibold text-slate-400 w-full text-right">Total Bids</p>
                          </div>
                       </div>
                       
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex space-x-1">
                             <div className="flex flex-col items-center">
                               <div className="border border-slate-200 rounded text-xs font-bold w-7 h-7 flex items-center justify-center">31</div>
                               <span className="text-[8px] text-slate-400">Days</span>
                             </div>
                             <div className="flex flex-col items-center">
                               <div className="border border-slate-200 rounded text-xs font-bold w-7 h-7 flex items-center justify-center">20</div>
                               <span className="text-[8px] text-slate-400">Hours</span>
                             </div>
                             <div className="flex flex-col items-center">
                               <div className="border border-slate-200 rounded text-xs font-bold w-7 h-7 flex items-center justify-center">40</div>
                               <span className="text-[8px] text-slate-400">Mins</span>
                             </div>
                             <div className="flex flex-col items-center">
                               <div className="border border-slate-200 rounded text-xs font-bold w-7 h-7 flex items-center justify-center">25</div>
                               <span className="text-[8px] text-slate-400">Secs</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-brand-dark">06:00pm 03 Jan 2023</p>
                             <p className="text-[10px] text-slate-400 font-semibold w-full text-right">End Time</p>
                          </div>
                       </div>

                       <button className="w-full bg-white border-2 border-brand-blue text-brand-blue font-semibold py-2 rounded hover:bg-brand-blue hover:text-white transition-colors text-sm">
                         Submit A Bid
                       </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Pagination Placeholder */}
            <div className="flex justify-center mt-10">
               <div className="flex space-x-2 bg-white rounded shadow-sm border border-slate-100 p-2">
                 <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">&lt;</button>
                 <button className="w-8 h-8 rounded flex items-center justify-center bg-brand-blue text-white font-semibold">1</button>
                 <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-medium">2</button>
                 <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-medium">3</button>
                 <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-medium">4</button>
                 <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-medium">5</button>
                 <span className="w-8 h-8 flex items-center justify-center text-slate-400">...</span>
                 <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-medium">10</button>
                 <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">&gt;</button>
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN: FILTERS */}
          <div className="w-full lg:w-1/4 h-fit">
            <div className="bg-[#3A4588] rounded-md overflow-hidden text-white shadow-md">
              <div className="p-4 border-b border-white/10 flex items-center">
                 <div className="w-[3px] h-4 bg-brand-orange mr-3"></div>
                 <h2 className="text-lg font-semibold">Filter By</h2>
              </div>
              
              <div className="p-6 bg-brand-blue flex flex-col space-y-4">
                 <div className="relative border-b border-white/20 pb-4">
                    <input type="text" placeholder="Any Car Type" className="w-full bg-transparent border border-white/20 rounded p-3 text-sm outline-none placeholder:text-slate-300 focus:border-white/50 transition-colors" />
                 </div>
                 <div className="relative border-b border-white/20 pb-4">
                    <input type="text" placeholder="Any Color" className="w-full bg-transparent border border-white/20 rounded p-3 text-sm outline-none placeholder:text-slate-300 focus:border-white/50 transition-colors" />
                 </div>
                 <div className="relative border-b border-white/20 pb-4">
                    <input type="text" placeholder="Any Makes" value={make} onChange={(e) => setMake(e.target.value)} className="w-full bg-transparent border border-white/20 rounded p-3 text-sm outline-none placeholder:text-slate-300 focus:border-white/50 transition-colors" />
                 </div>
                 <div className="relative border-b border-white/20 pb-4">
                    <input type="text" placeholder="Any Car Model" className="w-full bg-transparent border border-white/20 rounded p-3 text-sm outline-none placeholder:text-slate-300 focus:border-white/50 transition-colors" />
                 </div>
                 <div className="relative border-b border-white/20 pb-6">
                    <input type="text" placeholder="Any Style" className="w-full bg-transparent border border-white/20 rounded p-3 text-sm outline-none placeholder:text-slate-300 focus:border-white/50 transition-colors" />
                 </div>

                 <div className="pt-2 flex flex-col space-y-6">
                    <div className="relative h-2 bg-white/20 rounded-full w-full">
                       <div className="absolute top-0 left-0 h-full w-[40%] bg-brand-orange rounded-full"></div>
                       <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-brand-orange rounded-full border-2 border-white cursor-pointer shadow"></div>
                       <div className="absolute top-1/2 -translate-y-1/2 left-[40%] w-4 h-4 bg-brand-orange rounded-full border-2 border-white cursor-pointer shadow"></div>
                    </div>
                    <button className="w-full bg-brand-orange text-brand-blue font-bold text-lg py-3 rounded hover:bg-yellow-400 transition-colors">
                       Filter
                    </button>
                    <div className="text-center text-sm font-semibold text-slate-300">
                       Price: $30,000 - $30,000
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
