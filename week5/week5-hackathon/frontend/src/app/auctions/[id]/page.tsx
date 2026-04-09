'use client';

import React, { useState, useEffect, use } from 'react';
import axiosInstance from '../../../lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../../../lib/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Minus, Plus } from 'lucide-react';

export default function LiveAuctionDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const [car, setCar] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Fetch car details and initial bids
    const fetchData = async () => {
      try {
        const carRes = await axiosInstance.get(`/cars/${id}`);
        setCar(carRes.data);
        setBidAmount(carRes.data.price + 100);

        const bidsRes = await axiosInstance.get(`/bids/car/${id}`);
        setBids(bidsRes.data);

      } catch (err) {
        console.error(err);
      }
    };
    fetchData();

    // Setup Socket
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_auction', { carId: id });
    });

    newSocket.on('new_bid', (data) => {
      setBids((prev) => [data, ...prev].sort((a,b) => b.amount - a.amount));
      setCar((prev: any) => ({ ...prev, price: data.amount }));
    });

    newSocket.on('bid_error', (data) => {
      setErrorMsg(data.message);
      setTimeout(() => setErrorMsg(''), 5000);
    });

    newSocket.on('bid_ended', () => {
      setCar((prev: any) => ({ ...prev, status: 'ended' }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  const handlePlaceBid = () => {
    if (!isAuthenticated) return router.push('/login');
    if (!socket) return;
    socket.emit('place_bid', { carId: id, userId: user._id, amount: bidAmount });
  };

  if (!car) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;

  const demoImages = car.images?.length > 1 ? car.images : [
    car.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1627454820516-dc767119ff33?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550529590-7bf78afebfcc?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white pb-20">
      {/* Page Header */}
      <div className="bg-brand-lightest w-full py-20 pb-24 text-center border-b border-slate-200">
        <h1 className="text-5xl md:text-7xl font-bold text-brand-blue mb-4">{car.make ? `${car.make} ${car.model}` : "Audi Q3"}</h1>
        <p className="text-slate-600 max-w-lg mx-auto">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <div className="mt-4 text-sm text-slate-500">
           <span>Home</span> <span className="mx-2">&gt;</span> <span className="text-brand-blue font-semibold">Auction Detail</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 -mt-8 relative z-10">
        
        {/* Title Bar */}
        <div className="bg-brand-blue rounded-md p-4 flex justify-between items-center text-white mb-6 shadow-sm">
           <h2 className="text-xl font-bold">{car.make ? `${car.make} ${car.model}` : "Audi Q3"}</h2>
           <button className="text-white hover:text-brand-orange transition-colors">
              <Star size={20} />
           </button>
        </div>

        {/* Top Notification if needed */}
        {errorMsg && <div className="bg-red-50 text-red-500 p-3 rounded text-sm mb-6 text-center border border-red-100">{errorMsg}</div>}

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
           {/* Main Image */}
           <div className="lg:col-span-2 relative rounded-md overflow-hidden bg-slate-100 h-[300px] md:h-[450px]">
              <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow z-10 flex items-center space-x-1">
                 <span>Live</span>
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a9 9 0 0 0 0-6"/><path d="M4.6 15a9 9 0 0 1 0-6"/><path d="M22 17.7a13 13 0 0 0 0-11.4"/><path d="M2 17.7a13 13 0 0 1 0-11.4"/></svg>
              </div>
              <img src={demoImages[0]} alt="Main" className="w-full h-full object-cover" />
           </div>
           
           {/* Thumbnails Grid */}
           <div className="grid grid-cols-2 lg:grid-cols-2 grid-rows-3 gap-4 h-[300px] md:h-[450px]">
              {demoImages.slice(1,7).map((img: string, idx: number) => (
                 <div key={idx} className="rounded-md overflow-hidden bg-slate-100">
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                 </div>
              ))}
           </div>
        </div>

        {/* Info Strip */}
        <div className="bg-white border text-center border-slate-200 rounded flex flex-wrap md:flex-nowrap justify-between items-center px-4 py-4 mb-10 shadow-sm overflow-x-auto divide-x divide-slate-100">
           <div className="px-6 flex flex-col justify-center min-w-max">
              <div className="flex space-x-1 mb-1">
                 <div className="flex flex-col items-center">
                   <div className="border border-slate-200 bg-brand-lightest/30 rounded text-xs font-bold w-6 h-6 flex items-center justify-center">31</div>
                   <span className="text-[8px] text-slate-400 mt-1">Days</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="border border-slate-200 bg-brand-lightest/30 rounded text-xs font-bold w-6 h-6 flex items-center justify-center">20</div>
                   <span className="text-[8px] text-slate-400 mt-1">Hours</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="border border-slate-200 bg-brand-lightest/30 rounded text-xs font-bold w-6 h-6 flex items-center justify-center">40</div>
                   <span className="text-[8px] text-slate-400 mt-1">Mins</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="border border-slate-200 bg-brand-lightest/30 rounded text-xs font-bold w-6 h-6 flex items-center justify-center">25</div>
                   <span className="text-[8px] text-slate-400 mt-1">Secs</span>
                 </div>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold bg-white mt-1">Time Left</span>
           </div>

           <div className="px-6 flex flex-col items-center justify-center min-w-max text-left">
              <span className="font-bold text-brand-blue mb-1">${car.price ? car.price.toLocaleString() : '1,078.99'}</span>
              <span className="text-[10px] text-slate-400 font-semibold">Current Bid</span>
           </div>
           
           <div className="px-6 flex flex-col items-center justify-center min-w-max text-left">
              <span className="font-bold text-brand-blue mb-1">06:00pm 03 Jan 2023</span>
              <span className="text-[10px] text-slate-400 font-semibold">End Time</span>
           </div>

           <div className="px-6 flex flex-col items-center justify-center min-w-max text-left">
              <span className="font-bold text-brand-blue mb-1">100</span>
              <span className="text-[10px] text-slate-400 font-semibold">Min. Increment</span>
           </div>

           <div className="px-6 flex flex-col items-center justify-center min-w-max text-left">
              <span className="font-bold text-brand-blue mb-1">{bids.length || 130}</span>
              <span className="text-[10px] text-slate-400 font-semibold">Total Bids</span>
           </div>

           <div className="px-6 flex flex-col items-center justify-center min-w-max text-left">
              <span className="font-bold text-brand-blue mb-1">379831</span>
              <span className="text-[10px] text-slate-400 font-semibold">Lot No.</span>
           </div>

           <div className="px-6 flex flex-col items-center justify-center min-w-max text-left">
              <span className="font-bold text-brand-blue mb-1">10,878 K.M</span>
              <span className="text-[10px] text-slate-400 font-semibold">Odometer</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* LEFT CONTENT */}
           <div className="lg:col-span-2 space-y-10">
              
              <div className="bg-white">
                 <h3 className="text-brand-blue font-bold text-lg mb-2 inline-block relative">
                   Description
                   <div className="absolute -bottom-2 left-0 w-8 h-[3px] bg-brand-orange"></div>
                 </h3>
                 <div className="mt-8 text-slate-500 text-sm leading-relaxed space-y-4">
                    <p>Lorem ipsum dolor sit amet consectetur. Duis ac sodales vulputate dolor volutpat ac. Turpis ut neque eu adipiscing nibh nunc gravida. Ipsum at feugiat id dui elementum nibh nec suspendisse. Ut sapien metus elementum tincidunt euismod.</p>
                    <p>In est eget turpis nulla leo amet arcu. Consequat viverra erat pellentesque ut non placerat placerat amet vitae. Lobortis velit senectus blandit pellentesque viverra augue dolor orci. Odio leo in et in. Ac purus morbi ac vulputate amet. Ut maecenas leo venenatis aliquet a fringilla quam varius pellentesque.</p>
                 </div>
              </div>

              {/* Top Bidder */}
              <div className="rounded-md overflow-hidden bg-white shadow-sm border border-slate-100">
                 <div className="bg-brand-blue text-white px-6 py-3">
                    <h3 className="font-bold text-sm">Top Bidder</h3>
                 </div>
                 <div className="p-6 bg-brand-lightest/40 flex flex-col md:flex-row gap-6 items-center md:items-start text-sm">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Top Bidder" className="w-20 h-20 rounded-full border-2 border-white shadow-sm" />
                    
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 w-full md:mt-2">
                       <div className="flex items-center">
                          <span className="font-bold text-brand-dark w-32">Full Name</span>
                          <span className="text-slate-500">Lionel Messi</span>
                       </div>
                       <div className="flex items-center">
                          <span className="font-bold text-brand-dark w-16">Email</span>
                          <span className="text-slate-500">messi10@email.com</span>
                       </div>
                       <div className="flex items-center">
                          <span className="font-bold text-brand-dark w-32">Mobile Number</span>
                          <span className="text-slate-500">1234567890</span>
                       </div>
                       <div className="flex items-center">
                          <span className="font-bold text-brand-dark w-24">Nationality</span>
                          <span className="text-slate-500">Argentina</span>
                       </div>
                       <div className="flex items-center">
                          <span className="font-bold text-brand-dark w-32">ID Type</span>
                          <span className="text-slate-500">Pakistani</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* RIGHT CONTENT */}
           <div className="space-y-8">
              
              {/* Bid Form */}
              <div className="bg-brand-lightest/50 p-6 rounded-md shadow-sm border border-brand-lightest">
                 <div className="flex justify-between items-center text-sm font-semibold text-brand-dark mb-4">
                    <div>
                      <p>$20,000</p>
                      <p className="text-[10px] text-slate-500">Bid Starts From</p>
                    </div>
                    <div className="text-right">
                      <p>$20,000</p>
                      <p className="text-[10px] text-slate-500">Current Bid</p>
                    </div>
                 </div>
                 
                 <div className="relative mb-8 mt-2 h-2 bg-slate-200 rounded-full">
                    <div className="absolute top-0 left-0 h-full w-[30%] bg-brand-blue rounded-full"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-[30%] w-4 h-4 bg-white border-4 border-brand-blue rounded-full shadow"></div>
                 </div>

                 <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-brand-blue font-bold mb-1">130</p>
                      <p className="text-[10px] text-slate-500 font-semibold">Bid Placed</p>
                    </div>
                    <div className="flex items-center space-x-2">
                       <button 
                         onClick={() => setBidAmount(prev => Math.max(car.price, prev - 100))}
                         className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-brand-blue shadow-sm"
                       >
                         <Minus size={16} />
                       </button>
                       <input 
                         type="text" 
                         value={`$${bidAmount.toLocaleString()}`} 
                         readOnly 
                         className="w-24 px-2 py-1.5 text-center text-brand-blue font-bold border border-brand-light rounded bg-white"
                       />
                       <button 
                         onClick={() => setBidAmount(prev => prev + 100)}
                         className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-brand-blue shadow-sm"
                       >
                         <Plus size={16} />
                       </button>
                    </div>
                 </div>

                 {car.status === 'active' ? (
                   <button 
                     onClick={handlePlaceBid}
                     className="w-full bg-brand-blue hover:bg-brand-dark text-white font-bold py-3 text-sm rounded shadow-sm transition-colors"
                   >
                     Submit A Bid
                   </button>
                 ) : (
                   <button 
                     onClick={() => router.push(`/payment/${car._id}`)}
                     className="w-full bg-slate-900 border border-slate-900 text-white font-bold py-3 text-sm rounded shadow-sm hover:bg-black transition-colors"
                   >
                     Proceed to Payment
                   </button>
                 )}
              </div>

              {/* Bidders List */}
              <div className="rounded-md overflow-hidden bg-brand-lightest/20 shadow-sm border border-slate-100">
                 <div className="bg-brand-blue text-white px-6 py-4">
                    <h3 className="font-bold text-sm">Bidders List</h3>
                 </div>
                 <div className="p-4 space-y-3">
                    {bids.length > 0 ? (
                       bids.slice(0, 4).map((bid, i) => (
                         <div key={i} className="flex justify-between items-center py-2 border-b border-brand-lightest text-sm">
                           <span className="text-slate-600">{i === 0 ? 'Top Bidder' : `Bidder ${i + 1}`}</span>
                           <span className="font-bold text-brand-blue">${bid.amount.toLocaleString()}</span>
                         </div>
                       ))
                    ) : (
                       <>
                         <div className="flex justify-between items-center py-2 border-b border-brand-lightest text-sm">
                           <span className="text-slate-600">Bidder 1</span>
                           <span className="font-bold text-brand-blue">$ 18,000</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-brand-lightest text-sm">
                           <span className="text-slate-600">Bidder 2</span>
                           <span className="font-bold text-brand-blue">$ 16,500</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-brand-lightest text-sm">
                           <span className="text-slate-600">Bidder 3</span>
                           <span className="font-bold text-brand-blue">$ 16,000</span>
                         </div>
                         <div className="py-2 text-slate-400">...</div>
                       </>
                    )}
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
