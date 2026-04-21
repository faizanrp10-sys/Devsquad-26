'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../store/store';
import { updateUser } from '../store/userSlice';
import axiosInstance from '../lib/axios';

interface CarCardProps {
  car: any;
}

export default function CarCard({ car }: CarCardProps) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const timeLeft = "10 : 20 : 47";

  const isInWishlist = user?.wishlist?.some((item: any) => 
    (typeof item === 'string' ? item : item._id) === car._id
  );

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return router.push('/login');

    try {
      if (isInWishlist) {
        await axiosInstance.delete(`/users/wishlist/${car._id}`);
        const newWishlist = user.wishlist.filter((item: any) => 
          (typeof item === 'string' ? item : item._id) !== car._id
        );
        dispatch(updateUser({ wishlist: newWishlist }));
      } else {
        await axiosInstance.post(`/users/wishlist/${car._id}`);
        const newWishlist = [...(user.wishlist || []), car._id];
        dispatch(updateUser({ wishlist: newWishlist }));
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  };

  return (
    <div className="card group hover:-translate-y-1">
      {/* Badge + Wishlist */}
      <div className="relative">
        {car.status === 'active' && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-1 rounded flex items-center space-x-1">
              <span>Trending</span>
              <span>🔥</span>
            </span>
          </div>
        )}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 transition-all hover:scale-110 active:scale-95 ${
            isInWishlist ? 'text-accent' : 'text-text-light hover:text-accent'
          }`}
        >
          <Star size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Car Name */}
        <div className="text-center pt-4 pb-2 px-4">
          <h3 className="text-base font-bold text-text-dark">{car.make} {car.model}</h3>
        </div>

        {/* Image */}
        <div className="h-44 px-4 pb-2 overflow-hidden">
          <img
            src={car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : `http://localhost:3001/${car.images[0]}`) : 'http://localhost:3001/hero_section_bg_img.jpg'}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {/* Price + Timer */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-lg font-bold text-primary">${car.price?.toLocaleString()}</p>
            <p className="text-[11px] text-text-light">Current Bid</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-text-dark tabular-nums">{timeLeft}</p>
            <p className="text-[11px] text-text-light">Waiting for Bid</p>
          </div>
        </div>

        {/* Submit Bid Button */}
        <Link
          href={`/auctions/${car._id}`}
          className="w-full block text-center bg-primary hover:bg-primary-dark text-white py-2.5 rounded-md text-sm font-semibold transition-colors"
        >
          Submit A Bid
        </Link>
      </div>
    </div>
  );
}
