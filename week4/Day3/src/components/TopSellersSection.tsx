'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGameStore } from '@/store/useGameStore';
import { Game } from '@/data/games';
import { formatPrice } from '@/utils/formatPrice';

function GameList({ title, games }: { title: string; games: Game[] }) {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center px-2 mb-4">
        <h3 className="text-[19px] font-normal text-white">{title}</h3>
        <button className="border border-gray-400 text-gray-200 px-4 py-1.5 rounded-md text-[13px] hover:bg-white/10 hover:border-white transition">
          view more
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {games.slice(0, 5).map((game) => (
          <Link href={`/games/${game.id}`} key={game.id} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-[#202020] transition-colors cursor-pointer">
            <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
              <Image src={game.image} alt={game.title} fill className="object-cover transition duration-300 group-hover:opacity-80" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-normal text-gray-100 truncate group-hover:text-white transition">{game.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                {game.isFree ? (
                  <span className="text-[14px] font-normal text-white">Free</span>
                ) : (
                  <>
                    {game.discount > 0 && (
                      <span className="bg-[#0074e4] text-white text-[12px] px-1.5 py-0.5 rounded shadow-sm">
                        -{game.discount}%
                      </span>
                    )}
                    <span className="text-[14px] font-normal text-white">
                      {formatPrice(game.price)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function TopSellersSection() {
  const { topSellers, bestSellers, upcomingGames } = useGameStore();

  return (
    <section className="mb-20 mt-16">
      <div className="flex flex-col lg:flex-row gap-8">
        <GameList title="Top Sellers" games={topSellers} />
        <GameList title="Best Seller" games={bestSellers} />
        <GameList title="Top Upcoming game" games={upcomingGames} />
      </div>
    </section>
  );
}
