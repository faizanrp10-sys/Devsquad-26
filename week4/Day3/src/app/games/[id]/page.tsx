'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useGameStore } from '@/store/useGameStore';
import { Game } from '@/data/games';
import { formatPrice } from '@/utils/formatPrice';

export default function GameDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const getGameById = useGameStore((state) => state.getGameById);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const found = getGameById(params.id);
    if (found) {
      setGame(found);
    } else {
      router.push('/games');
    }
  }, [params.id, getGameById, router]);

  if (!game) return null; // loading state

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-12 py-12">
        <h1 className="text-4xl font-bold mb-8">{game.title}</h1>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-gray-900 border border-gray-800 shadow-2xl">
              <Image src={game.image} alt={game.title} fill className="object-cover" />
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">{game.description}</p>
            
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-800/50 p-4 rounded border border-gray-800">
                <span className="text-gray-500 block mb-1">Genres</span>
                <span className="text-white hover:underline cursor-pointer">{game.category}</span>
              </div>
              <div className="bg-gray-800/50 p-4 rounded border border-gray-800">
                <span className="text-gray-500 block mb-1">Features</span>
                <span className="text-white hover:underline cursor-pointer">Single Player</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="sticky top-20 bg-[#121212] flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                {game.isFree ? (
                  <span className="text-2xl font-bold text-white">Free</span>
                ) : (
                  <>
                    {game.discount > 0 && (
                      <span className="bg-blue-600 text-white font-bold px-2 py-1 rounded">
                        -{game.discount}%
                      </span>
                    )}
                    {game.discount > 0 && (
                      <span className="text-gray-500 line-through">
                        {formatPrice(game.originalPrice)}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(game.price)}
                    </span>
                  </>
                )}
              </div>
              
              <button className="w-full bg-epic-blue hover:bg-blue-600 font-bold text-white py-4 rounded uppercase transition">
                {game.price === 0 || game.isFree ? 'Get' : 'Buy Now'}
              </button>
              
              <button className="w-full bg-transparent border border-gray-500 hover:border-white font-bold text-white py-4 rounded uppercase transition">
                Add to Cart
              </button>
              
              <div className="text-xs text-gray-500 mt-4 leading-loose border-t border-gray-800 pt-4">
                <div className="flex justify-between border-b border-gray-800 py-2">
                  <span>Developer</span>
                  <span className="text-white">Epic Partner</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 py-2">
                  <span>Publisher</span>
                  <span className="text-white">Epic Partner</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 py-2">
                  <span>Release Date</span>
                  <span className="text-white">09/15/22</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
