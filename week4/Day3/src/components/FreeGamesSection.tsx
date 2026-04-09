'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGameStore } from '@/store/useGameStore';
import { GiftIcon } from '@heroicons/react/24/outline';

export default function FreeGamesSection() {
  const freeGames = useGameStore((state) => state.freeGames);

  return (
    <section className="mb-16 bg-[#18181C] rounded-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <GiftIcon className="w-8 h-8 text-white" />
          <h2 className="text-[22px] font-normal text-white">Free Games</h2>
        </div>
        <button className="border border-gray-400 text-gray-200 px-4 py-1.5 rounded-md text-[13px] uppercase tracking-wider hover:bg-white/10 hover:border-white transition">
          view More
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {freeGames.map((game) => (
          <Link href={`/games/${game.id}`} key={game.id} className="group cursor-pointer block">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-900 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition duration-300">
              <Image 
                src={game.image} 
                alt={game.title} 
                fill 
                className="object-cover group-hover:scale-105 transition duration-500" 
              />
              <div className={`absolute bottom-0 w-full text-center text-[13px] font-bold py-2 uppercase ${
                game.freeStartDate?.includes('Free') && !game.freeStartDate?.includes('Jul 27') ? 'bg-[#0074e4] text-white' : 'bg-black/80 text-gray-300 backdrop-blur-sm'
              }`}>
                {game.freeStartDate?.includes('Free') && !game.freeStartDate?.includes('Jul 27') ? 'FREE NOW' : 'COMING SOON'}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-[15px] font-normal text-gray-100 truncate group-hover:text-white transition">
                {game.title}
              </h3>
              <p className="text-[14px] text-gray-400 mt-1">
                {game.freeStartDate} - {game.freeEndDate}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
