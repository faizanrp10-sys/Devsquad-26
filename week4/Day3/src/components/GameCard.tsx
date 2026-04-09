import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/data/games';
import { formatPrice } from '@/utils/formatPrice';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`} className="group block cursor-pointer">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-900">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-cover transition duration-300 group-hover:opacity-80"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-[15px] text-gray-200 font-normal truncate group-hover:text-white transition">{game.title}</h3>
        <div className="flex items-center space-x-2 mt-2">
          {game.isFree ? (
            <span className="text-[15px] font-normal text-white mt-1">Free</span>
          ) : (
            <div className="flex items-center gap-2">
              {game.discount > 0 && (
                <span className="bg-[#0074e4] text-white text-[13px] px-2 py-0.5 rounded shadow-sm">
                  -{game.discount}%
                </span>
              )}
              {game.discount > 0 && (
                <span className="text-[15px] text-gray-500 line-through">
                  {formatPrice(game.originalPrice)}
                </span>
              )}
              <span className="text-[15px] font-normal text-white">
                {formatPrice(game.price)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
