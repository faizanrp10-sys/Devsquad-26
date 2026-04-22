'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance, { API_URL } from '../../lib/axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateUser } from '../../store/userSlice';
import { markAsRead, clearAll, fetchNotifications, markAllAsReadServer, clearAllServer, markAsReadServer } from '../../store/notificationSlice';
import { AppDispatch } from '../../store/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Star, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('Personal Information');
  const [myCars, setMyCars] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [myWishlist, setMyWishlist] = useState<any[]>([]);
  const [allCars, setAllCars] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const carsRes = await axiosInstance.get('/cars');
      const rawCars = carsRes.data;
      setAllCars(rawCars);
      
      const myCarsRes = await axiosInstance.get('/cars/user/my-cars');
      setMyCars(myCarsRes.data);

      const bidsRes = await axiosInstance.get('/bids/user/my-bids');
      setMyBids(bidsRes.data);

      const userRes = await axiosInstance.get('/users/profile');
      setMyWishlist(userRes.data.wishlist || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromWishlist = async (carId: string) => {
    try {
      await axiosInstance.delete(`/users/wishlist/${carId}`);
      setMyWishlist(prev => prev.filter(c => c._id !== carId));
      
      // Also update Redux store
      if (user && user.wishlist) {
        const newWishlist = user.wishlist.filter((item: any) => 
          (typeof item === 'string' ? item : item?._id) !== carId
        );
        dispatch(updateUser({ wishlist: newWishlist }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEndBid = async (carId: string) => {
    try {
      await axiosInstance.patch(`/cars/${carId}`, { status: 'ended' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = ['Personal Information', 'My Cars', 'My Bids', 'Wishlist', 'Notifications'];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Banner */}
      <div className="page-banner pt-8 pb-8">
        <h1>My Profile</h1>
        <div className="divider mx-auto" />
        <p className="max-w-xl mx-auto text-sm text-white/80">Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.</p>
        <div className="breadcrumb mt-4 flex justify-center">
          <Link href="/">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-white font-medium italic">My Profile</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded transition-colors border-l-4 ${
                    activeTab === tab
                      ? 'border-accent text-primary bg-primary/5'
                      : 'border-transparent text-text-body hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            {/* Tab Title */}
            <div className="mb-6 border-b border-border pb-3">
              <h2 className="text-lg font-bold text-text-dark">{activeTab}</h2>
            </div>

            {/* PERSONAL INFORMATION */}
            {activeTab === 'Personal Information' && (
              <div className="space-y-6">
                {/* Personal Info Section */}
                <div className="border border-border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-primary text-white px-6 py-3 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-widest">Personal Information</span>
                    <button className="text-white/70 hover:text-white"><Edit size={16} /></button>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                      <div className="h-20 w-20 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-border">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 flex-1 w-full">
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Full Name</p>
                          <p className="text-sm font-medium text-text-dark">{user?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Email</p>
                          <p className="text-sm font-medium text-text-dark">{user?.email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Mobile Number</p>
                          <p className="text-sm font-medium text-text-dark">{user?.phone || '1234567890'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Nationality</p>
                          <p className="text-sm font-medium text-text-dark">India</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">ID Type</p>
                          <p className="text-sm font-medium text-text-dark">India</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">ID Number</p>
                          <p className="text-sm font-medium text-text-dark">345203</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="border border-border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-primary text-white px-6 py-3 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-widest">Password</span>
                    <button className="text-white/70 hover:text-white"><Edit size={16} /></button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Password</p>
                        <p className="text-sm font-medium text-text-dark">••••••••</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="border border-border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-primary text-white px-6 py-3 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-widest">Address</span>
                    <button className="text-white/70 hover:text-white"><Edit size={16} /></button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Country</p>
                        <p className="text-sm font-medium text-text-dark">India</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">City</p>
                        <p className="text-sm font-medium text-text-dark">India</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Address 1</p>
                        <p className="text-sm font-medium text-text-dark">India</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Address 2</p>
                        <p className="text-sm font-medium text-text-dark">{user?.name || 'Manish Sharma'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Land Line Number</p>
                        <p className="text-sm font-medium text-text-dark">345203</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">P.O Box</p>
                        <p className="text-sm font-medium text-text-dark">345203</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traffic File Information Section */}
                <div className="border border-border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-primary text-white px-6 py-3 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-widest">Traffic File Information</span>
                    <button className="text-white/70 hover:text-white"><Edit size={16} /></button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Traffic Information Type</p>
                        <p className="text-sm font-medium text-text-dark">••••••</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Plate State</p>
                        <p className="text-sm font-medium text-text-dark"></p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Traffic File Number</p>
                        <p className="text-sm font-medium text-text-dark">{user?.name || 'Manish Sharma'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Plate Code</p>
                        <p className="text-sm font-medium text-text-dark"></p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Plate Number</p>
                        <p className="text-sm font-medium text-text-dark">{user?.name || 'Manish Sharma'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Driver License Number</p>
                        <p className="text-sm font-medium text-text-dark"></p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Issue City</p>
                        <p className="text-sm font-medium text-text-dark"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* MY CARS */}
            {activeTab === 'My Cars' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCars.length > 0 ? myCars.map((car) => (
                  <div key={car._id} className="card group">
                    <div className="relative">
                      <div className="text-center pt-4 pb-2 px-4">
                        <h3 className="text-sm font-bold text-text-dark tracking-tight">{car.make} {car.model}</h3>
                      </div>
                      <div className="h-44 px-4 pb-2 overflow-hidden bg-white">
                        <img
                          src={car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : `${API_URL}/${car.images[0]}`) : `${API_URL}/hero_section_bg_img.jpg`}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between mb-3 mt-3">
                        <div>
                          <p className="text-base font-bold text-primary italic">${car.price?.toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-text-light uppercase tracking-widest">Winning Bid</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-text-dark">130</p>
                          <p className="text-[10px] font-bold text-text-light uppercase tracking-widest">Total Bids</p>
                        </div>
                      </div>
                      {car.status === 'active' ? (
                        <button
                          onClick={() => handleEndBid(car._id)}
                          className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all shadow-md"
                        >
                          End Bid
                        </button>
                      ) : (
                        <div className="w-full bg-gray-100 text-text-light py-2.5 rounded text-xs font-bold uppercase tracking-widest text-center border border-border">
                          Sold
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-16 text-center text-text-light bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold mb-2">No cars listed yet</p>
                    <Link href="/sell" className="text-primary hover:underline text-sm font-bold">Sell Your Car →</Link>
                  </div>
                )}
              </div>
            )}

            {/* MY BIDS */}
            {activeTab === 'My Bids' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBids.length > 0 ? myBids.map((bid: any, i) => {
                  const carIdMatch = bid.car?._id || bid.car || bid.carId;
                  const car = allCars.find((c: any) => String(c?._id) === String(carIdMatch)) || bid.car || {
                      make: 'Unknown', model: 'Car', price: 0, images: [], _id: carIdMatch, status: 'ended'
                  };
                  return (
                    <div key={i} className="card group">
                      <div className="relative">
                        <button className="absolute top-3 right-3 z-10 text-text-light hover:text-accent transition-colors">
                          <Star size={18} />
                        </button>
                        <div className="text-center pt-4 pb-2 px-4">
                          <h3 className="text-sm font-bold text-text-dark tracking-tight">{car.make} {car.model}</h3>
                        </div>
                        <div className="h-44 px-4 pb-2 overflow-hidden bg-white">
                          <img
                            src={car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : `${API_URL}/${car.images[0]}`) : `${API_URL}/hero_section_bg_img.jpg`}
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between mt-3 mb-2 gap-2">
                          <div className="border border-border rounded p-2 flex-1">
                            <p className="text-xs font-bold text-primary italic">${car.price?.toLocaleString()}</p>
                            <p className="text-[9px] font-bold text-text-light uppercase tracking-widest">Winning Bid</p>
                          </div>
                          <div className="border border-border rounded p-2 flex-1">
                            <p className="text-xs font-bold text-red-500 italic">${(bid.amount || 0).toLocaleString()}</p>
                            <p className="text-[9px] font-bold text-text-light uppercase tracking-widest">Your Bid</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-1">
                            {['31', '20', '40', '25'].map((t, idx) => (
                              <span key={idx} className="bg-primary text-white text-[9px] font-bold px-1 py-0.5 rounded">{t}</span>
                            ))}
                            <p className="text-[9px] font-bold text-text-light ml-1 uppercase">Left</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-text-dark">130</p>
                            <p className="text-[9px] font-bold text-text-light uppercase tracking-widest">Total</p>
                          </div>
                        </div>
                        <Link
                          href={`/auctions/${car._id}`}
                          className="w-full block bg-primary hover:bg-primary-dark text-white py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all shadow-md text-center"
                        >
                          View Auction
                        </Link>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full py-16 text-center text-text-light bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold mb-2">No bids placed yet</p>
                    <Link href="/auctions" className="text-primary hover:underline text-sm font-bold">Browse Auctions →</Link>
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST */}
            {activeTab === 'Wishlist' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myWishlist.length > 0 ? myWishlist.map((car: any, i: number) => (
                    <div key={i} className="card group">
                      <div className="relative">
                        <button 
                          onClick={() => handleRemoveFromWishlist(car._id)}
                          className="absolute top-3 right-3 z-10 text-accent transition-colors hover:scale-110 active:scale-95"
                        >
                          <Star size={18} fill="currentColor" />
                        </button>
                        <div className="text-center pt-4 pb-2 px-4">
                          <h3 className="text-sm font-bold text-text-dark tracking-tight">{car.make} {car.model}</h3>
                        </div>
                        <div className="h-44 px-4 pb-2 overflow-hidden bg-white">
                          <img
                            src={car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : `${API_URL}/${car.images[0]}`) : `${API_URL}/hero_section_bg_img.jpg`}
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between mb-3 mt-3">
                          <div>
                            <p className="text-base font-bold text-primary italic">${car.price?.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-text-light uppercase tracking-widest">Current Bid</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-text-dark tabular-nums">10 : 20 : 47</p>
                            <p className="text-[10px] font-bold text-text-light uppercase tracking-widest">Left</p>
                          </div>
                        </div>
                        <Link href={`/auctions/${car._id}`} className="block text-center w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all shadow-md">
                          Submit A Bid
                        </Link>
                      </div>
                    </div>
                )) : (
                  <div className="col-span-full py-16 text-center text-text-light bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold mb-2">Your wishlist is empty</p>
                    <Link href="/auctions" className="text-primary hover:underline text-sm font-bold">Find Cars to Add →</Link>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'Notifications' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-text-dark">Recent Notifications</h2>
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => dispatch(clearAllServer())}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((n: any) => (
                      <div 
                        key={n.id} 
                        onClick={() => dispatch(markAsReadServer(n.id))}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          !n.read 
                            ? 'bg-primary/5 border-primary/20 shadow-sm' 
                            : 'bg-white border-border hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className={`text-sm ${!n.read ? 'font-bold text-primary' : 'text-text-dark'}`}>
                              {n.message}
                            </p>
                            {n.carId && (
                              <Link 
                                href={`/auctions/${n.carId}`}
                                className="inline-block mt-3 text-[10px] font-bold text-primary hover:underline uppercase tracking-widest border border-primary/20 px-2 py-1 rounded bg-white"
                              >
                                View Auction →
                              </Link>
                            )}
                          </div>
                          <span className="text-[10px] text-text-light whitespace-nowrap ml-4">
                            {new Date(n.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {!n.read && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-accent text-[9px] font-bold text-white rounded uppercase tracking-tighter">New</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-border">
                    <p className="text-text-light italic">No notifications yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
