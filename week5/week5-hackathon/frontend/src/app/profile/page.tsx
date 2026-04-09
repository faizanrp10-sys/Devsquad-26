'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit } from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  
  const [myBids, setMyBids] = useState<any[]>([]);
  const [myCars, setMyCars] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'personal' | 'cars' | 'bids' | 'wishlist'>('personal');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    Promise.all([
      axiosInstance.get('/users/profile'),
      axiosInstance.get('/bids/user/my-bids'),
      axiosInstance.get('/cars/user/my-cars')
    ]).then(([profRes, bidsRes, carsRes]) => {
      setProfile(profRes.data);
      setMyBids(bidsRes.data);
      setMyCars(carsRes.data);
    }).catch(err => console.error(err));
  }, [isAuthenticated, router]);

  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;

  return (
    <div className="min-h-screen flex flex-col bg-white pb-20">
      {/* Page Header */}
      <div className="bg-brand-lightest w-full py-20 pb-24 text-center border-b border-slate-200">
        <h1 className="text-5xl md:text-7xl font-bold text-brand-blue mb-4">My Profile</h1>
        <p className="text-slate-600 max-w-lg mx-auto">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <div className="mt-4 text-sm text-slate-500">
           <span>Home</span> <span className="mx-2">&gt;</span> <span className="text-brand-blue font-semibold">My Profile</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 mt-12 flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
           <div className="flex flex-col space-y-4">
              <button 
                 onClick={() => setActiveTab('personal')}
                 className={`text-left px-6 py-4 rounded border transition-colors shadow-sm relative overflow-hidden ${activeTab === 'personal' ? 'bg-brand-lightest/40 border-brand-lightest text-brand-dark font-bold' : 'bg-white border-slate-100 text-slate-600 font-semibold hover:bg-slate-50'}`}
              >
                 Personal Information
                 {activeTab === 'personal' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-orange"></div>}
              </button>
              
              <button 
                 onClick={() => setActiveTab('cars')}
                 className={`text-left px-6 py-4 rounded border transition-colors shadow-sm relative overflow-hidden ${activeTab === 'cars' ? 'bg-brand-lightest/40 border-brand-lightest text-brand-dark font-bold' : 'bg-white border-slate-100 text-slate-600 font-semibold hover:bg-slate-50'}`}
              >
                 My Cars
                 {activeTab === 'cars' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-orange"></div>}
              </button>
              
              <button 
                 onClick={() => setActiveTab('bids')}
                 className={`text-left px-6 py-4 rounded border transition-colors shadow-sm relative overflow-hidden ${activeTab === 'bids' ? 'bg-brand-lightest/40 border-brand-lightest text-brand-dark font-bold' : 'bg-white border-slate-100 text-slate-600 font-semibold hover:bg-slate-50'}`}
              >
                 My Bids
                 {activeTab === 'bids' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-orange"></div>}
              </button>
              
              <button 
                 onClick={() => setActiveTab('wishlist')}
                 className={`text-left px-6 py-4 rounded border transition-colors shadow-sm relative overflow-hidden ${activeTab === 'wishlist' ? 'bg-brand-lightest/40 border-brand-lightest text-brand-dark font-bold' : 'bg-white border-slate-100 text-slate-600 font-semibold hover:bg-slate-50'}`}
              >
                 Wishlist
                 {activeTab === 'wishlist' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-orange"></div>}
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-3/4">
          
          {activeTab === 'personal' && (
             <div className="space-y-8">
                
                {/* Personal Information Block */}
                <div className="rounded overflow-hidden shadow-sm border border-slate-100 bg-brand-lightest/30">
                   <div className="bg-brand-blue text-white px-6 py-3 flex justify-between items-center">
                      <h3 className="font-semibold text-sm">Personal Information</h3>
                      <Edit size={16} className="cursor-pointer hover:text-brand-orange transition-colors" />
                   </div>
                   <div className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-sm">
                      <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white shadow-sm" />
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 w-full mt-2">
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">Full Name</span>
                            <span className="text-slate-500">{profile.name}</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">Email</span>
                            <span className="text-slate-500">{profile.email}</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">Mobile Number</span>
                            <span className="text-slate-500">1234567890</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">Nationality</span>
                            <span className="text-slate-500">India</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">ID Type</span>
                            <span className="text-slate-500">India</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">ID Number</span>
                            <span className="text-slate-500">345203</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Password Block */}
                <div className="rounded overflow-hidden shadow-sm border border-slate-100 bg-brand-lightest/30">
                   <div className="bg-brand-blue text-white px-6 py-3 flex justify-between items-center">
                      <h3 className="font-semibold text-sm">Password</h3>
                      <Edit size={16} className="cursor-pointer hover:text-brand-orange transition-colors" />
                   </div>
                   <div className="p-6 text-sm">
                      <div className="flex gap-4">
                         <span className="font-bold text-brand-dark w-24">Password</span>
                         <span className="text-slate-400">*********</span>
                      </div>
                   </div>
                </div>

                {/* Address Block */}
                <div className="rounded overflow-hidden shadow-sm border border-slate-100 bg-brand-lightest/30">
                   <div className="bg-brand-blue text-white px-6 py-3 flex justify-between items-center">
                      <h3 className="font-semibold text-sm">Address</h3>
                      <Edit size={16} className="cursor-pointer hover:text-brand-orange transition-colors" />
                   </div>
                   <div className="p-6 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">Country</span>
                            <span className="text-slate-500">India</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">City</span>
                            <span className="text-slate-500">India</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">Address 1</span>
                            <span className="text-slate-500">India</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">Address 2</span>
                            <span className="text-slate-500">Manish Sharma</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">Land Line Number</span>
                            <span className="text-slate-500">345203</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-24">P.O Box</span>
                            <span className="text-slate-500">345203</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Traffic File Information Block */}
                <div className="rounded overflow-hidden shadow-sm border border-slate-100 bg-brand-lightest/30">
                   <div className="bg-brand-blue text-white px-6 py-3 flex justify-between items-center">
                      <h3 className="font-semibold text-sm">Traffic File Information</h3>
                      <Edit size={16} className="cursor-pointer hover:text-brand-orange transition-colors" />
                   </div>
                   <div className="p-6 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-40">Traffic Information Type</span>
                            <span className="text-slate-500">******</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-40">Plate State</span>
                            <span className="text-slate-500"></span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-40">Traffic File Number</span>
                            <span className="text-slate-500">Manish Sharma</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-40">Plate Code</span>
                            <span className="text-slate-500"></span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-40">Plate Number</span>
                            <span className="text-slate-500">Manish Sharma</span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-40">Driver License Number</span>
                            <span className="text-slate-500"></span>
                         </div>
                         <div className="flex justify-between md:justify-start gap-4">
                            <span className="font-bold text-brand-dark w-40">Issue City</span>
                            <span className="text-slate-500"></span>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          )}

          {activeTab === 'cars' && (
             <div className="bg-brand-lightest/30 rounded p-6 shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-brand-dark">My Cars</h2>
                 <Link href="/sell" className="bg-brand-blue text-white font-bold px-6 py-2 rounded hover:bg-brand-dark shadow-sm transition-colors text-sm">List New Car</Link>
               </div>
               {myCars.length === 0 ? <p className="text-slate-500 text-center py-10">You haven't listed any cars.</p> : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {myCars.map(car => (
                     <div key={car._id} className="bg-white border hover:shadow-md transition-shadow border-slate-100 rounded overflow-hidden group">
                       <div className="h-48 bg-slate-200">
                          {car.images?.length ? <img src={car.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : null}
                       </div>
                       <div className="p-4">
                          <h3 className="font-bold text-brand-dark line-clamp-1 text-lg mb-2">{car.year} {car.make} {car.model}</h3>
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-brand-blue">${car.price.toLocaleString()}</p>
                            <span className="inline-block px-3 py-1 bg-brand-lightest text-brand-blue rounded text-xs font-bold uppercase">{car.status}</span>
                          </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          )}

          {activeTab === 'bids' && (
             <div className="bg-brand-lightest/30 rounded p-6 shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold text-brand-dark mb-6">My Bids</h2>
               {myBids.length === 0 ? <p className="text-slate-500 text-center py-10">You haven't placed any bids yet.</p> : (
                 <div className="space-y-4">
                   {myBids.map(bid => (
                     <div key={bid._id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded hover:shadow-sm transition-shadow">
                       <div>
                          <Link href={`/auctions/${bid.car?._id}`} className="font-bold text-lg text-brand-dark hover:text-brand-blue transition-colors">
                            {bid.car?.year} {bid.car?.make} {bid.car?.model}
                          </Link>
                          <p className="text-xs text-slate-400 mt-1">{new Date(bid.timestamp).toLocaleString()}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-semibold text-slate-400 uppercase">Your Bid</p>
                         <p className="font-black text-brand-blue text-xl">${bid.amount.toLocaleString()}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          )}

          {activeTab === 'wishlist' && (
             <div className="bg-brand-lightest/30 rounded p-6 shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold text-brand-dark mb-6">Wishlist</h2>
               {profile.wishlist?.length === 0 ? <p className="text-slate-500 text-center py-10">Your wishlist is empty.</p> : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {profile.wishlist.map((car: any) => (
                   <Link href={`/auctions/${car._id}`} key={car._id} className="bg-white border rounded overflow-hidden hover:shadow-md transition-all group">
                     <div className="h-48 bg-slate-200">
                        {car.images?.length ? <img src={car.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : null}
                     </div>
                     <div className="p-4">
                        <h3 className="font-bold text-brand-dark line-clamp-1">{car.year} {car.make} {car.model}</h3>
                     </div>
                   </Link>
                 ))}
               </div>
               )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
