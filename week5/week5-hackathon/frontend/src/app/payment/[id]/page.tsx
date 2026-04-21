'use client';

import React, { useState, useEffect, use } from 'react';
import axiosInstance, { API_URL } from '../../../lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import Link from 'next/link';
import { ChevronRight, Star, CheckCircle2 } from 'lucide-react';

const SHIPPING_STEPS = [
  { status: 'ready_for_shipping', label: 'Ready For Shipping' },
  { status: 'in_transit', label: 'In Transit' },
  { status: 'delivered', label: 'Delivered' },
];

export default function Payment({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  const [car, setCar] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [shippingStatus, setShippingStatus] = useState<string>('not_paid');
  const [isProcessing, setIsProcessing] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCarDetails();
    fetchBids();

    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_auction', { carId: id });
    });

    newSocket.on('shipping_update', (data) => {
      if (data.carId === id) {
        setShippingStatus(data.status);
      }
    });

    return () => { newSocket.disconnect(); };
  }, [id, isAuthenticated, router]);

  const fetchCarDetails = async () => {
    try {
      const res = await axiosInstance.get(`/cars/${id}`);
      setCar(res.data);
      setShippingStatus(res.data.shippingStatus || 'not_paid');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBids = async () => {
    try {
      const res = await axiosInstance.get(`/bids/car/${id}`);
      setBids(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (socket) {
        socket.emit('make_payment', { carId: id });
      }
      setShippingStatus('ready_for_shipping');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!car) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const images = [...(car.images || [])].map((img: string) => img.startsWith('http') ? img : `${API_URL}/${img}`);
  if (images.length === 0) images.push(`${API_URL}/hero_section_bg_img.jpg`);

  const currentStepIndex = SHIPPING_STEPS.findIndex(s => s.status === shippingStatus);
  const isWinner = car.winner?.toString() === user?._id || (bids.length > 0 && bids[0]?.bidder === user?._id);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Banner */}
      <div className="page-banner pt-8 pb-8">
        <h1 className="text-4xl font-bold uppercase italic tracking-tighter leading-none">{car.make} {car.model}</h1>
        <div className="divider mx-auto" />
        <p className="max-w-xl mx-auto text-sm text-white/80">Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.</p>
        <div className="breadcrumb mt-4 flex justify-center">
          <Link href="/">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-white font-medium italic">Auction Detail</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Car Title Bar */}
        <div className="bg-primary text-white rounded-t-lg px-6 py-3 flex items-center justify-between">
          <h2 className="font-bold text-lg">{car.make} {car.model}</h2>
          <button className="text-white/70 hover:text-accent transition-colors">
            <Star size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border border-t-0">
          {/* Left: Images */}
          <div className="lg:col-span-8 p-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Main Image */}
              <div className="md:col-span-2 relative">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider">Live Bid</span>
                </div>
                <div className="h-[350px] md:h-[400px] bg-white rounded-lg overflow-hidden border border-border flex items-center justify-center p-4">
                  <img
                    src={images[selectedImage] || images[0]}
                    alt="Car"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              {/* Thumbnail Grid */}
              <div className="grid grid-cols-2 gap-3">
                {images.slice(0, 6).map((img: string, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedImage(idx)}
                    className={`h-[90px] md:h-[125px] rounded-lg overflow-hidden border bg-white p-1 cursor-pointer transition-all ${
                      selectedImage === idx ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-contain" alt="Thumb" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bid Info Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 rounded-lg p-6 mb-6 border border-border">
              <div>
                <p className="text-sm font-bold text-text-dark">15/03/2022</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Winning Date</p>
              </div>
              <div>
                <p className="text-sm font-bold text-text-dark">06:00pm</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">End Time</p>
              </div>
              <div>
                <p className="text-sm font-bold text-accent italic">${car.price?.toLocaleString()}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Winning Bid</p>
              </div>
              <div>
                <p className="text-sm font-bold text-text-dark">{car.lotNumber || '379831'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Lot No.</p>
              </div>
            </div>

            {/* Payment Notice */}
            {shippingStatus === 'not_paid' && (
              <div className="mb-6">
                <p className="text-sm text-text-body">
                  <span className="font-black text-red-600 mr-1">Note:</span>
                  <span className="text-red-500 font-medium">Please make your payment in next 6 Days</span>
                </p>
              </div>
            )}

            {/* Pending Amount + Make Payment */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
              <div className="border border-accent/30 bg-accent/5 rounded-lg px-6 py-3">
                <p className="text-xl font-black text-accent italic tracking-tighter">${car.price?.toLocaleString()}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-light">Pending Amount</p>
              </div>
              {shippingStatus === 'not_paid' && isWinner && (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-10 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Make Payments'}
                </button>
              )}
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-text-dark mb-4 pb-2 border-b border-border">Description</h3>
              <div className="text-sm text-text-body leading-relaxed space-y-4">
                <p>Lorem ipsum dolor sit amet consectetur. Duis ac sodales vulputate dolor volutpat ac. Turpis ut neque eu adipiscing nibh nunc gravida. Ipsum at feugiat id dui elementum nibh nec suspendisse. Ut sapien metus elementum tincidunt euismod.</p>
                <p>In est eget turpis nulla leo amet arcu. Consequat viverra erat pellentesque ut non placerat placerat amet vitae. Lobortis velit senectus blandit pellentesque viverra augue dolor orci. Odio leo in et in. Ac purus morbi ac vulputate amet. Ut maecenas leo venenatis aliquet a fringilla quam varius pellentesque.</p>
              </div>
            </div>

            {/* Shipping Progress */}
            {shippingStatus !== 'not_paid' && (
              <div className="space-y-10 mb-8">
                <div className="flex items-center justify-between px-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-light mb-1">Payment Date</p>
                    <p className="text-sm font-bold text-text-dark">21/04/2022</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-light mb-1">Expected Delivery</p>
                    <p className="text-sm font-bold text-text-dark">23/04/2022</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative px-10">
                  <div className="absolute top-5 left-10 right-10 h-0.5 bg-border" />
                  <div
                    className="absolute top-5 left-10 h-0.5 bg-green-500 transition-all duration-1000"
                    style={{ width: `${currentStepIndex >= 0 ? ((currentStepIndex) / (SHIPPING_STEPS.length - 1)) * (100) : 0}%` }}
                  />
                  <div className="relative flex items-center justify-between">
                    {SHIPPING_STEPS.map((step, idx) => {
                      const isActive = idx <= currentStepIndex;
                      return (
                        <div key={idx} className="flex flex-col items-center group">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white ${
                            isActive ? 'border-green-500 text-green-500 shadow-md' : 'border-border text-text-light'
                          }`}>
                            <CheckCircle2 size={18} />
                          </div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mt-4 text-center ${isActive ? 'text-green-600' : 'text-text-light'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Bidders List */}
          <div className="lg:col-span-4 border-l border-border p-6 bg-gray-50/50">
            <div className="border border-border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="bg-primary text-white px-5 py-3 flex items-center">
                <h4 className="text-xs font-bold uppercase tracking-widest">Bidders List</h4>
              </div>
              <div className="divide-y divide-border">
                {bids.length > 0 ? bids.map((bid: any, i: number) => (
                  <div key={i} className="flex justify-between items-center px-5 py-3">
                    <span className="text-xs font-medium text-text-body">
                      {bid.bidderName || `Bidder ${i + 1}`}
                    </span>
                    <span className="text-xs font-black text-primary italic">
                      $ {bid.amount?.toLocaleString()}
                    </span>
                  </div>
                )) : (
                  <div className="px-5 py-6 text-center text-xs text-text-light">
                    No bids yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Winner Section */}
        <div className="mt-12 bg-white border border-border rounded-lg overflow-hidden shadow-sm">
          <div className="bg-primary text-white px-6 py-3 flex items-center">
            <span className="font-bold text-xs uppercase tracking-widest">Winner</span>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
              <div className="h-24 w-24 rounded-full bg-primary/10 overflow-hidden flex-shrink-0 border-4 border-white shadow-xl">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Winner'}`}
                  alt="Winner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-6 flex-1 w-full text-center md:text-left">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-sm font-bold text-text-dark">{user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-bold text-text-dark">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Mobile Number</p>
                  <p className="text-sm font-bold text-text-dark">{user?.phone || '1234567890'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Nationality</p>
                  <p className="text-sm font-bold text-text-dark">India</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">ID Type</p>
                  <p className="text-sm font-bold text-text-dark">National ID</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
