'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance, { API_URL } from '../../lib/axios';
import Link from 'next/link';
import { Star, ChevronDown, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateUser } from '../../store/userSlice';
import { useRouter } from 'next/navigation';
import { resolveCarDesign } from '../../lib/car-utils';

export default function AuctionsList() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [carType, setCarType] = useState('');
  const [color, setColor] = useState('');
  const [make, setMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [style, setStyle] = useState('');
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCars();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [make, maxPrice, carType, sortBy]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      let query = `?status=active`;
      const res = await axiosInstance.get(`/cars${query}`);
      let rawCars = res.data;

      const mapped = rawCars.map((car: any) => resolveCarDesign(car));

      // If no data, use mock data matching design
      const finalCars = mapped.length > 0 ? mapped : [0, 1, 2, 3, 4, 5].map((i) => resolveCarDesign({
        _id: `mock-${i}`,
        price: 107899.99,
        status: (i % 2 === 0) ? 'active' : 'inactive',
        description: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra...'
      }));

      setCars(finalCars);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleToggleWishlist = async (carId: string) => {
    if (!isAuthenticated) return router.push('/login');

    const isInWishlist = user?.wishlist?.some((item: any) => 
      (typeof item === 'string' ? item : item._id) === carId
    );

    try {
      if (isInWishlist) {
        await axiosInstance.delete(`/users/wishlist/${carId}`);
        const newWishlist = user.wishlist.filter((item: any) => 
          (typeof item === 'string' ? item : item._id) !== carId
        );
        dispatch(updateUser({ wishlist: newWishlist }));
      } else {
        await axiosInstance.post(`/users/wishlist/${carId}`);
        const newWishlist = [...(user.wishlist || []), carId];
        dispatch(updateUser({ wishlist: newWishlist }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Banner */}
      <div className="page-banner pt-8 pb-8">
        <h1>Auction</h1>
        <div className="divider" />
        <p>Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.</p>
        <div className="breadcrumb mt-4">
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white font-medium">Auction</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Listing */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between bg-primary/5 border border-border rounded-lg px-4 py-3 mb-6">
              <span className="text-sm text-text-body font-medium">
                Showing 1-{cars.length} of {cars.length} Results
              </span>
              <div className="flex items-center space-x-2">
                <select
                  className="bg-white border border-border rounded px-3 py-1.5 text-sm text-text-dark focus:outline-none focus:border-primary"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Sort By Newness</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Car List */}
            <div className="space-y-4">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
                ))
              ) : cars.length === 0 ? (
                <div className="py-16 text-center bg-gray-50 rounded-lg">
                  <Search size={48} className="mx-auto text-text-light mb-4" />
                  <h3 className="text-xl font-bold text-text-dark mb-2">No Vehicles Found</h3>
                  <p className="text-sm text-text-body mb-6">Try broadening your filter criteria.</p>
                  <button
                    onClick={() => { setMake(''); setMaxPrice(30000); setCarType(''); }}
                    className="bg-primary text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                cars.map((car) => (
                  <div key={car._id} className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Car Image from backend */}
                      <div className="relative w-full md:w-52 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-border">
                        {car.status === 'active' && (
                          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1 uppercase">
                            <span>Trending</span> <span className="text-[8px]">🔥</span>
                          </span>
                        )}
                        <img
                          src={car.images?.[0] ? `${API_URL}/${car.images[0]}` : 'https://via.placeholder.com/200x140'}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Car Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-bold text-primary">{car.make} {car.model}</h3>
                            <button 
                              onClick={() => handleToggleWishlist(car._id)}
                              className={`transition-colors ${
                                user?.wishlist?.some((item: any) => (typeof item === 'string' ? item : item._id) === car._id)
                                ? 'text-accent' 
                                : 'text-text-light hover:text-accent'
                              }`}
                            >
                              <Star size={18} fill={user?.wishlist?.some((item: any) => (typeof item === 'string' ? item : item._id) === car._id) ? "currentColor" : "none"} />
                            </button>
                          </div>
                          <div className="flex items-center space-x-1 my-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={14} className="text-accent fill-accent" />
                            ))}
                          </div>
                          <p className="text-xs text-text-body leading-relaxed mt-1">
                            {car.description || 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra...'} <Link href={`/auctions/${car._id}`} className="text-primary font-semibold">View Details</Link>
                          </p>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div>
                            <p className="text-base font-bold text-text-dark">${car.price?.toLocaleString()}</p>
                            <p className="text-[10px] text-text-light">Current Bid</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-dark">130</p>
                            <p className="text-[10px] text-text-light">Total Bids</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {['31', '20', '40', '25'].map((t, i) => (
                              <span key={i} className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{t}</span>
                            ))}
                            <p className="text-[10px] text-text-light ml-1">Time Left</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-dark">06:00pm 03 Jan 2023</p>
                            <p className="text-[10px] text-text-light">End Time</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Bid Button */}
                    <div className="mt-3 flex justify-end">
                      <Link
                        href={`/auctions/${car._id}`}
                        className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-2 rounded-md text-sm font-semibold transition-colors"
                      >
                        Submit A Bid
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {!loading && cars.length > 0 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center space-x-2">
                  <button className="h-9 w-9 flex items-center justify-center border border-border rounded text-text-light hover:text-primary transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="h-9 w-9 flex items-center justify-center bg-primary text-white rounded text-sm font-bold">1</button>
                  {[2, 3, 4, 5].map((n) => (
                    <button key={n} className="h-9 w-9 flex items-center justify-center border border-border rounded text-sm text-text-body hover:text-primary transition-colors">{n}</button>
                  ))}
                  <span className="text-text-light px-1">...</span>
                  <button className="h-9 w-9 flex items-center justify-center border border-border rounded text-sm text-text-body hover:text-primary transition-colors">10</button>
                  <button className="h-9 w-9 flex items-center justify-center border border-border rounded text-text-light hover:text-primary transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filter Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-primary text-white px-4 py-3">
                <h3 className="text-sm font-bold">Filter By</h3>
              </div>

              <div className="p-4 space-y-4">
                {/* Any Car Type */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Any Car Type"
                    className="w-full border border-border rounded px-3 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary pr-8"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" size={14} />
                </div>

                {/* Any Color */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Any Color"
                    className="w-full border border-border rounded px-3 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary pr-8"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" size={14} />
                </div>

                {/* Any Makes */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Any Makes"
                    className="w-full border border-border rounded px-3 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary pr-8"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" size={14} />
                </div>

                {/* Any Car Model */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Any Car Model"
                    className="w-full border border-border rounded px-3 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary pr-8"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" size={14} />
                </div>

                {/* Any Style */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Any Style"
                    className="w-full border border-border rounded px-3 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary pr-8"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" size={14} />
                </div>

                {/* Price Range */}
                <div className="pt-2">
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    defaultValue={maxPrice}
                    className="w-full accent-primary h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Filter Button */}
                <button
                  className="w-full bg-accent hover:bg-yellow-600 text-white py-2.5 rounded-md text-sm font-semibold transition-colors mt-2"
                >
                  Filter
                </button>

                <p className="text-xs text-text-light text-center">
                   Price: $30,000 - $30,000
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
