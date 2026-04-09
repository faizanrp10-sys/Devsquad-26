'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/useGameStore';
import { formatPrice } from '@/utils/formatPrice';

export default function HeroBanner() {
  const { featuredGames } = useGameStore();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!featuredGames.length) return null;

  const activeGame = featuredGames[activeIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-12 h-[600px] lg:h-[450px]">
      {/* Main Hero Slider Area */}
      <div className="flex-[3] relative rounded-xl overflow-hidden cursor-pointer group">
        <Image
          src={activeGame.image}
          alt={activeGame.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8">
          <p className="text-[11px] font-bold text-gray-200 tracking-wider mb-2 uppercase">
            {activeGame.isUpcoming ? 'PRE-PURCHASE AVAILABLE' : 'OUT NOW'}
          </p>
          <h2 className="text-3xl font-bold text-white mb-2">{activeGame.title}</h2>
          <p className="text-sm text-gray-300 mb-6 max-w-md leading-relaxed">{activeGame.description}</p>
          <div className="flex items-center space-x-4">
            <button className="bg-white text-black hover:bg-gray-200 uppercase text-[11px] tracking-wider font-bold px-8 py-3.5 rounded">
              {activeGame.isUpcoming ? 'PRE-PURCHASE NOW' : 'BUY NOW'}
            </button>
            <button className="flex items-center justify-center p-3 rounded bg-white/10 hover:bg-white/20 transition text-white">
              <span className="font-bold">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnails Sidebar */}
      <div className="hidden lg:flex flex-col flex-1 gap-1.5 overflow-hidden">
        {featuredGames.slice(0, 5).map((game, index) => (
          <div
            key={game.id}
            onClick={() => setActiveIndex(index)}
            className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
              index === activeIndex ? 'bg-[#2a2a2a]' : 'hover:bg-[#202020]'
            }`}
          >
            <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden">
              <Image src={game.image} alt={game.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <h4 className={`text-sm tracking-wide ${index === activeIndex ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>
                {game.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
