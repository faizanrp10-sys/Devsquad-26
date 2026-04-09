'use client';

import { useGameStore } from '@/store/useGameStore';
import GameCard from '@/components/GameCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CATEGORIES = ['All', 'Action', 'Sports', 'Horror', 'Shooter', 'RPG', 'Racing', 'Adventure'];

export default function GamesShowcase() {
  const { games, selectedCategory, setCategory } = useGameStore();

  const filteredGames = selectedCategory && selectedCategory !== 'All' 
    ? games.filter(g => g.category === selectedCategory)
    : games;

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-12 py-8 flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-8 items-center flex gap-4">
            Explore
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <h3 className="font-bold border-b border-gray-700 pb-2 mb-4">Filters</h3>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                      (selectedCategory === cat || (!selectedCategory && cat === 'All'))
                        ? 'bg-gray-800 text-white font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
