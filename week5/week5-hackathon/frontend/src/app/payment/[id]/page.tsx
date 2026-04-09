'use client';

import React, { useState, useEffect, use } from 'react';
import axiosInstance from '../../../lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

export default function Payment({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const [car, setCar] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success'>('pending');
  // Delivery Flow: Ready for shipping -> In transit -> Delivered
  const [deliveryStep, setDeliveryStep] = useState(0); 

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    axiosInstance.get(`/cars/${id}`)
      .then(res => setCar(res.data))
      .catch(err => console.error(err));
  }, [id, isAuthenticated, router]);

  useEffect(() => {
    let interval: any;
    if (paymentStatus === 'success') {
      interval = setInterval(() => {
        setDeliveryStep(prev => {
          if (prev < 3) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [paymentStatus]);

  const handlePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      setDeliveryStep(1); // Ready for shipping
    }, 2000);
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
           <span>Home</span> <span className="mx-2">&gt;</span> <span className="text-brand-blue font-semibold">Make Payment</span>
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

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
           <div className="lg:col-span-2 relative rounded-md overflow-hidden bg-slate-100 h-[300px] md:h-[450px]">
              <img src={demoImages[0]} alt="Main" className="w-full h-full object-cover" />
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-2 grid-rows-3 gap-4 h-[300px] md:h-[450px]">
              {demoImages.slice(1,7).map((img: string, idx: number) => (
                 <div key={idx} className="rounded-md overflow-hidden bg-slate-100">
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                 </div>
              ))}
           </div>
        </div>

        {/* Info Strip payment */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
           
           {/* Left Block */}
           <div className="w-full md:w-2/3 bg-brand-lightest/30 border border-slate-100 p-6 rounded flex flex-wrap justify-between items-center shadow-sm text-center md:text-left">
              <div className="px-4">
                 <p className="font-bold text-brand-dark mb-1">15/03/2022</p>
                 <p className="text-[10px] text-slate-400 font-semibold">Winning Date</p>
              </div>
              <div className="px-4">
                 <p className="font-bold text-brand-dark mb-1">06:00pm</p>
                 <p className="text-[10px] text-slate-400 font-semibold">End Time</p>
              </div>
              <div className="px-4">
                 <p className="font-bold text-green-500 mb-1">${car.price ? car.price.toLocaleString() : '60,000'}</p>
                 <p className="text-[10px] text-slate-400 font-semibold">Winning Bid</p>
              </div>
              <div className="px-4">
                 <p className="font-bold text-brand-dark mb-1">379831</p>
                 <p className="text-[10px] text-slate-400 font-semibold">Lot No.</p>
              </div>
           </div>

           {/* Right Block */}
           <div className="w-full md:w-1/3 border border-slate-200 rounded p-6 shadow-sm bg-white">
              <p className="text-[10px] text-red-500 font-bold mb-4">Note: Please make your payment in next 6 Days</p>
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <p className="font-bold text-brand-orange text-lg">${car.price ? car.price.toLocaleString() : '60,000'}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Pending Amount</p>
                 </div>
                 {paymentStatus === 'pending' ? (
                   <button 
                     onClick={handlePayment}
                     className="px-6 py-2 border-2 border-brand-blue text-brand-blue font-bold rounded hover:bg-brand-blue hover:text-white transition-colors text-sm"
                   >
                     Make Payments
                   </button>
                 ) : paymentStatus === 'processing' ? (
                   <button disabled className="px-6 py-2 bg-slate-100 text-slate-400 font-bold rounded text-sm flex items-center">
                     <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin mr-2"></span>
                     Processing...
                   </button>
                 ) : (
                   <span className="px-6 py-2 bg-green-100 text-green-600 font-bold rounded text-sm">
                     Paid ✓
                   </span>
                 )}
              </div>
           </div>

        </div>

        {/* Content Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           <div className="lg:col-span-2 space-y-10">
              <div className="bg-white">
                 <h3 className="text-brand-blue font-bold text-lg mb-2 relative inline-block">
                   Description
                   <div className="absolute -bottom-2 left-0 w-8 h-[3px] bg-brand-orange"></div>
                 </h3>
                 <div className="mt-8 text-slate-500 text-sm leading-relaxed space-y-4">
                    <p>Lorem ipsum dolor sit amet consectetur. Duis ac sodales vulputate dolor volutpat ac. Turpis ut neque eu adipiscing nibh nunc gravida. Ipsum at feugiat id dui elementum nibh nec suspendisse. Ut sapien metus elementum tincidunt euismod.</p>
                    <p>In est eget turpis nulla leo amet arcu. Consequat viverra erat pellentesque ut non placerat placerat amet vitae. Lobortis velit senectus blandit pellentesque viverra augue dolor orci. Odio leo in et in. Ac purus morbi ac vulputate amet. Ut maecenas leo venenatis aliquet a fringilla quam varius pellentesque.</p>
                 </div>
              </div>

              {/* Winner */}
              <div className="rounded-md overflow-hidden bg-white shadow-sm border border-slate-100">
                 <div className="bg-brand-blue text-white px-6 py-3">
                    <h3 className="font-bold text-sm">Winner</h3>
                 </div>
                 <div className="p-6 bg-brand-lightest/40 flex flex-col md:flex-row gap-6 items-center md:items-start text-sm">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Winner" className="w-20 h-20 rounded-full border-2 border-white shadow-sm" />
                    
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 w-full md:mt-2">
                       <div className="flex items-center">
                          <span className="font-bold text-brand-dark w-24">Full Name</span>
                          <span className="text-slate-500">Manish Sharma</span>
                       </div>
                       <div className="flex items-center">
                          <span className="font-bold text-brand-dark w-16">Email</span>
                          <span className="text-slate-500">Manish Sharma</span>
                       </div>
                       <div className="flex items-center">
                          <span className="font-bold text-brand-dark w-32">Mobile Number</span>
                          <span className="text-slate-500">1234567890</span>
                       </div>
                       <div className="flex items-center">
                          <span className="font-bold text-brand-dark w-24">Nationality</span>
                          <span className="text-slate-500">India</span>
                       </div>
                       <div className="flex items-center">
                          <span className="font-bold text-brand-dark w-32">ID Type</span>
                          <span className="text-slate-500">India</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div>
              {/* Bidders List */}
              <div className="rounded-md overflow-hidden bg-brand-lightest/20 shadow-sm border border-slate-100">
                 <div className="bg-[#3A4588] text-white px-6 py-4 flex items-center">
                    <div className="w-[3px] h-4 bg-brand-orange mr-3"></div>
                    <h3 className="font-bold text-sm">Bidders List</h3>
                 </div>
                 <div className="p-4 space-y-3">
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
                 </div>
              </div>
           </div>

        </div>

        {/* Steps of Payment Block */}
        {paymentStatus === 'success' && (
          <div className="mt-20 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-12">Steps of Payment</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
               
               {/* Box 1 */}
               <div className="bg-slate-50 border border-slate-100 p-8 rounded-md shadow-sm relative">
                  <div className="flex justify-between items-center mb-8">
                     <div>
                       <p className="font-bold text-brand-dark mb-1 text-sm">15/03/2022</p>
                       <p className="text-[10px] text-slate-400 font-semibold">Winning Date</p>
                     </div>
                     <div>
                       <p className="font-bold text-brand-dark mb-1 text-sm">06:00pm</p>
                       <p className="text-[10px] text-slate-400 font-semibold">End Time</p>
                     </div>
                     <div>
                       <p className="font-bold text-green-500 mb-1 text-sm">${car.price ? car.price.toLocaleString() : '60,000'}</p>
                       <p className="text-[10px] text-slate-400 font-semibold">Winning Bid</p>
                     </div>
                     <div>
                       <p className="font-bold text-brand-dark mb-1 text-sm">379831</p>
                       <p className="text-[10px] text-slate-400 font-semibold">Lot No.</p>
                     </div>
                  </div>
               </div>

               {/* Tracker Box */}
               <div className="bg-white border border-slate-200 p-8 rounded-md shadow-sm flex flex-col justify-center relative">
                  <div className="flex justify-between text-xs text-slate-500 mb-4 font-semibold px-2">
                     <div className="text-left">
                        <p className="font-bold text-brand-dark">21/04/2022</p>
                        <p className="text-[9px]">Payment Date</p>
                     </div>
                     <div className="text-right">
                        <p className="font-bold text-brand-dark">23/04/2022</p>
                        <p className="text-[9px]">Expected Delivery Date</p>
                     </div>
                  </div>

                  <div className="relative mx-3">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full"></div>
                    <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 rounded-full transition-all duration-1000" style={{ width: `${((deliveryStep) / 3) * 100}%` }}></div>

                    <div className="relative z-10 flex justify-between">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-500 ${deliveryStep >= 1 ? 'bg-white border-green-500 outline outline-2 outline-green-500 scale-150' : 'bg-slate-300 border-white'}`}></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-500 ${deliveryStep >= 2 ? 'bg-white border-green-500 outline outline-2 outline-green-500 scale-150' : 'bg-slate-300 border-white'}`}></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-500 ${deliveryStep >= 3 ? 'bg-white border-green-500 outline outline-2 outline-green-500 scale-150' : 'bg-slate-300 border-white'}`}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-4">
                     <p className={deliveryStep >= 1 ? 'text-green-600' : ''}>Ready For Shipping</p>
                     <p className={deliveryStep >= 2 ? 'text-green-600' : ''}>In Transit</p>
                     <p className={deliveryStep >= 3 ? 'text-green-600' : ''}>Delivered</p>
                  </div>
               </div>
               
               {/* Box 3 & 4 (Simulation) */}
               {deliveryStep === 3 && (
                 <>
                   <div className="bg-slate-50 border border-slate-100 p-8 rounded-md shadow-sm relative">
                      <div className="flex justify-between items-center mb-8">
                         <div>
                           <p className="font-bold text-brand-dark mb-1 text-sm">15/03/2022</p>
                           <p className="text-[10px] text-slate-400 font-semibold">Winning Date</p>
                         </div>
                         <div>
                           <p className="font-bold text-brand-dark mb-1 text-sm">06:00pm</p>
                           <p className="text-[10px] text-slate-400 font-semibold">End Time</p>
                         </div>
                         <div>
                           <p className="font-bold text-green-500 mb-1 text-sm">${car.price ? car.price.toLocaleString() : '60,000'}</p>
                           <p className="text-[10px] text-slate-400 font-semibold">Winning Bid</p>
                         </div>
                         <div>
                           <p className="font-bold text-brand-dark mb-1 text-sm">379831</p>
                           <p className="text-[10px] text-slate-400 font-semibold">Lot No.</p>
                         </div>
                      </div>
                   </div>
                   <div className="border border-red-200 bg-red-50 p-8 rounded-md shadow-sm flex items-center justify-center">
                      <p className="text-red-500 font-bold text-2xl">Bidding has ended</p>
                   </div>
                 </>
               )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
