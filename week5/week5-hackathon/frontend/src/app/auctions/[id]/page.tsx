'use client';

import React, { useState, useEffect, use } from 'react';
import axiosInstance from '../../../lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../../../lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Minus, Plus, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../store/userSlice';
import { resolveCarDesign } from '../../../lib/car-utils';

export default function LiveAuctionDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  const [car, setCar] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetchData();

    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_auction', { carId: id });
    });

    newSocket.on('new_bid', (data) => {
      setBids((prev) => [data, ...prev].sort((a, b) => b.amount - a.amount));
      setCar((prev: any) => ({ ...prev, price: data.amount }));
    });

    newSocket.on('bid_error', (data) => {
      setErrorMsg(data.message);
      setTimeout(() => setErrorMsg(''), 5000);
    });

    // Optional: listen for success confirmation from server if it exists
    newSocket.on('bid_success', (data) => {
      setSuccessMsg('Bid placed successfully!');
      setTimeout(() => setSuccessMsg(''), 5000);
    });

    newSocket.on('bid_ended', () => {
      setCar((prev: any) => ({ ...prev, status: 'ended' }));
    });

    return () => { newSocket.disconnect(); };
  }, [id]);

  const fetchData = async () => {
    try {
      const carRes = await axiosInstance.get(`/cars/${id}`);
      let carData = resolveCarDesign(carRes.data);
      
      // If mock ID and not found or needed specifically
      if (id.startsWith('mock-')) {
          carData = resolveCarDesign({
              _id: id,
              price: 20000,
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac sodales vulputate dolor volutpat ac. Turpis ut neque eu adipiscing nibh nunc gravida. Ipsum at feugiat id dui elementum nibh nec suspendisse. Ut sapien metus elementum tincidunt euismod.',
              lotNumber: '379831',
              mileage: 10878,
              status: 'active'
          });
      }

      setCar(carData);
      setBidAmount(carData.price + 500);

      const bidsRes = await axiosInstance.get(`/bids/car/${id}`);
      setBids(bidsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceBid = () => {
    if (!isAuthenticated) return router.push('/login');
    if (!user?._id) {
        setErrorMsg('User information is missing. Please log in again.');
        return;
    }
    if (!socket) return;
    socket.emit('place_bid', { carId: id, userId: user._id, amount: bidAmount });
    
    // Optimistic success UI feedback
    setSuccessMsg('Bid submitted successfully!');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) return router.push('/login');

    const isInWishlist = user?.wishlist?.some((item: any) => 
      (typeof item === 'string' ? item : item?._id) === id
    );

    try {
      if (isInWishlist) {
        await axiosInstance.delete(`/users/wishlist/${id}`);
        const newWishlist = user.wishlist.filter((item: any) => 
          (typeof item === 'string' ? item : item?._id) !== id
        );
        dispatch(updateUser({ wishlist: newWishlist }));
      } else {
        await axiosInstance.post(`/users/wishlist/${id}`);
        const newWishlist = [...(user.wishlist || []), id];
        dispatch(updateUser({ wishlist: newWishlist }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!car) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const images = [...(car.images || [])].map((img: string) => img.startsWith('http') ? img : `${API_URL}/${img}`);
  if (images.length === 0) images.push('https://via.placeholder.com/800x450');

  const isWinner = car.status === 'ended' && bids[0]?.userId === user?._id;
  const topBidder = bids[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Banner */}
      <div className="page-banner pt-8 pb-8">
        <h1 className="text-4xl font-bold">{car.make} {car.model}</h1>
        <div className="divider mx-auto" />
        <p className="max-w-xl mx-auto text-sm text-white/80">Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.</p>
        <div className="breadcrumb mt-4 flex justify-center">
          <Link href="/">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-white font-medium italic">Auction Detail</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center text-sm font-medium transition-all">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-center text-sm font-medium transition-all">
            {successMsg}
          </div>
        )}

        {/* Car Title Bar */}
        <div className="bg-primary text-white rounded-t-lg px-6 py-3 flex items-center justify-between">
          <h2 className="font-bold text-lg">{car.make} {car.model}</h2>
          <button 
            onClick={handleToggleWishlist}
            className={`transition-colors ${
            user?.wishlist?.some((item: any) => (typeof item === 'string' ? item : item?._id) === id)
            ? 'text-accent' 
            : 'text-white/70 hover:text-accent'
          }`}>
            <Star size={20} fill={user?.wishlist?.some((item: any) => (typeof item === 'string' ? item : item?._id) === id) ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border border-t-0">
          {/* Left: Gallery */}
          <div className="lg:col-span-8 p-6">
            {/* Main Image */}
            <div className="relative mb-6">
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider">Live</span>
              </div>
              <div className="h-[350px] md:h-[450px] bg-white rounded-lg overflow-hidden border border-border">
                <img src={images[activeImg]} alt="Car" className="w-full h-full object-contain p-4" />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`h-24 md:h-28 rounded-lg overflow-hidden border-2 transition-all bg-white p-1 ${activeImg === idx ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                >
                  <img src={img} className="w-full h-full object-contain" alt="Thumb" />
                </button>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-7 gap-1 mt-10 bg-primary/5 rounded-lg p-6 border border-primary/10">
              <div className="border-r border-primary/10 px-2 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {['31', '20', '40', '25'].map((t, i) => (
                    <span key={i} className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Time Left</p>
              </div>
              <div className="border-r border-primary/10 px-2 text-center">
                <p className="text-sm font-bold text-primary">${car.price?.toLocaleString()}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Current Bid</p>
              </div>
              <div className="border-r border-primary/10 px-2 text-center">
                <p className="text-sm font-bold text-text-dark">06:00pm</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">End Time</p>
              </div>
              <div className="border-r border-primary/10 px-2 text-center">
                <p className="text-sm font-bold text-text-dark">100</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Min. Inc.</p>
              </div>
              <div className="border-r border-primary/10 px-2 text-center">
                <p className="text-sm font-bold text-text-dark">{bids.length || 130}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Total Bids</p>
              </div>
              <div className="border-r border-primary/10 px-2 text-center">
                <p className="text-sm font-bold text-text-dark">{car.lotNumber || '379831'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Lot No.</p>
              </div>
              <div className="px-2 text-center">
                <p className="text-sm font-bold text-text-dark">{car.mileage?.toLocaleString() || '10,878K.M'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Odometer</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-primary italic border-l-4 border-accent pl-4 mb-6">Description</h3>
              <p className="text-sm text-text-body leading-relaxed mb-4">
                {car.description}
              </p>
              <p className="text-sm text-text-body leading-relaxed">
                In est eget turpis nulla leo amet arcu. Consequat viverra erat pellentesque ut non placerat placerat amet vitae. Lobortis velit senectus blandit pellentesque viverra augue dolor orci.
              </p>
            </div>
          </div>

          {/* Right: Bid Panel */}
          <div className="lg:col-span-4 border-l border-border p-6 bg-gray-50/50">
            {/* Bid Range */}
            <div className="mb-8 border border-border rounded-lg p-5 bg-white shadow-sm">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-text-dark">$20,000</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Bid Starts From</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary italic">${car.price?.toLocaleString()}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Current Bid</p>
                </div>
              </div>
              <input
                type="range"
                min={car.price - 5000}
                max={car.price + 10000}
                value={bidAmount}
                onChange={(e) => setBidAmount(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Bid Amount Control */}
            <div className="mb-8 p-5 bg-white border border-border rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-dark">{bids.length || 130}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Bid Placed</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setBidAmount(prev => Math.max(car.price, prev - 500))}
                    className="h-10 w-10 border border-border rounded flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="relative">
                    <input
                      type="text"
                      value={`$${bidAmount.toLocaleString()}`}
                      readOnly
                      className="w-28 border border-border rounded px-2 h-10 text-center text-sm font-bold text-primary italic"
                    />
                  </div>
                  <button
                    onClick={() => setBidAmount(prev => prev + 500)}
                    className="h-10 w-10 border border-border rounded flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Bid */}
            {car.status === 'active' ? (
              <button
                onClick={handlePlaceBid}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 mb-10"
              >
                Submit A Bid
              </button>
            ) : isWinner ? (
              <button
                onClick={() => router.push(`/payment/${car._id}`)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg text-sm font-bold transition-all shadow-lg mb-10"
              >
                Proceed to Payment
              </button>
            ) : (
              <div className="w-full bg-gray-100 text-text-light py-4 rounded-lg text-sm font-bold text-center mb-10 border border-border">
                Auction Closed
              </div>
            )}

            {/* Bidders List */}
            <div className="border border-border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="bg-primary text-white px-5 py-3 flex items-center">
                <h4 className="text-xs font-bold uppercase tracking-widest">Bidders List</h4>
              </div>
              <div className="divide-y divide-border">
                {(bids.length > 0 ? bids.slice(0, 5) : [
                  { amount: 18000 },
                  { amount: 16500 },
                  { amount: 16000 },
                ]).map((bid, i) => (
                  <div key={i} className="flex justify-between items-center px-5 py-3">
                    <span className="text-xs font-medium text-text-body">Bidder {i + 1}</span>
                    <span className="text-xs font-black text-primary italic">${bid.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Bidder Section */}
        {topBidder || true ? (
          <div className="mt-12 bg-white border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-primary text-white px-6 py-3 flex items-center space-x-2">
              <span className="font-bold text-xs uppercase tracking-widest">Top Bidder</span>
            </div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
                <div className="h-24 w-24 rounded-full bg-primary/10 overflow-hidden flex-shrink-0 border-4 border-white shadow-xl">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lionel"
                    alt="Top Bidder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-6 flex-1 text-center md:text-left">
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Full Name</p>
                    <p className="text-sm font-bold text-text-dark">Lionel Messi</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm font-bold text-text-dark">messi10@email.com</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Mobile Number</p>
                    <p className="text-sm font-bold text-text-dark">1234567890</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Nationality</p>
                    <p className="text-sm font-bold text-text-dark">Argentina</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">ID Type</p>
                    <p className="text-sm font-bold text-text-dark">ID Card</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
