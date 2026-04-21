'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import axiosInstance from '../lib/axios';
import CarCard from '../components/CarCard';
import { resolveCarDesign } from '../lib/car-utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const [liveCars, setLiveCars] = useState<any[]>([]);

  useEffect(() => {
    fetchLiveAuctions();
  }, []);

  const fetchLiveAuctions = async () => {
    try {
      const res = await axiosInstance.get('/cars?status=active');
      const mapped = res.data.map((car: any) => resolveCarDesign(car));

      setLiveCars(mapped.length > 0 ? mapped : [0, 1, 2, 3].map((i) => resolveCarDesign({
        _id: `temp-${i}`,
        price: 1079.99,
        status: 'active'
      })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden">
        {/* Background Image from Backend */}
        <img 
          src="http://localhost:3001/hero_section_bg_img.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 z-0"
        />
        
        <div className="relative max-w-7xl mx-auto px-6 w-full z-10">
          <div className="max-w-2xl">
            <span className="inline-block bg-bg-light/20 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-md mb-6 uppercase tracking-widest border border-white/10">
              Welcome to Auction
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.9] mb-6">
              Find Your <br />
              <span className="text-white">Dream Car</span>
            </h1>
            <p className="text-white/70 text-sm leading-relaxed mb-10 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus elementum cursus tincidunt sagittis elementum suspendisse velit arcu.
            </p>

            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-xl p-2 rounded-xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="relative">
                  <select className="w-full bg-white text-text-dark text-xs font-bold h-12 px-4 rounded-lg appearance-none cursor-pointer focus:ring-2 ring-primary/20 outline-none">
                    <option>Make</option>
                    <option>Audi</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" size={14} />
                </div>
                <div className="relative">
                  <select className="w-full bg-white text-text-dark text-xs font-bold h-12 px-4 rounded-lg appearance-none cursor-pointer focus:ring-2 ring-primary/20 outline-none">
                    <option>Model</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" size={14} />
                </div>
                <div className="relative">
                  <select className="w-full bg-white text-text-dark text-xs font-bold h-12 px-4 rounded-lg appearance-none cursor-pointer focus:ring-2 ring-primary/20 outline-none">
                    <option>Year</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" size={14} />
                </div>
                <div className="relative">
                  <select className="w-full bg-white text-text-dark text-xs font-bold h-12 px-4 rounded-lg appearance-none cursor-pointer focus:ring-2 ring-primary/20 outline-none">
                    <option>Price</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" size={14} />
                </div>
              </div>
              <button className="bg-accent hover:bg-yellow-600 text-white font-bold px-10 h-12 rounded-lg flex items-center justify-center space-x-2 transition-all active:scale-95 group">
                <Search size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="uppercase text-sm tracking-widest">Search</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Auction Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-primary italic tracking-tighter uppercase inline-block relative">
              Live Auction
            </h2>
            <div className="flex items-center justify-center mt-2">
               <div className="h-[2px] w-24 bg-primary/20" />
               <div className="h-3 w-3 bg-accent rotate-45 mx-2" />
               <div className="h-[2px] w-24 bg-primary/20" />
            </div>
          </div>

          <div className="mb-8 border-b border-border flex justify-start">
             <button className="text-sm font-bold text-primary border-b-2 border-primary pb-3 px-6">Live Auction</button>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {liveCars.map((car) => (
              <SwiperSlide key={car._id}>
                <CarCard car={car} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}
