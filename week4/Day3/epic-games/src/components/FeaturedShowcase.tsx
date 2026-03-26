'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGameStore } from '@/store/useGameStore';
import { formatPrice } from '@/utils/formatPrice';

interface FeaturedShowcaseProps {
  games: any[];
}

export default function FeaturedShowcase({ games }: FeaturedShowcaseProps) {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link href={`/games/${game.id}`} key={game.id} className="group cursor-pointer block">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-900">
              <Image 
                src={game.image} 
                alt={game.title} 
                fill 
                className="object-cover group-hover:scale-105 transition duration-500" 
              />
            </div>
            <div className="mt-4">
              <h3 className="text-[17px] font-normal text-gray-100 group-hover:text-white transition">{game.title}</h3>
              <p className="text-[14px] text-gray-400 mt-2 mb-4 leading-relaxed line-clamp-3">{game.description}</p>
              <div className="text-[15px] font-normal text-white">{game.price === 0 ? 'Free' : formatPrice(game.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
