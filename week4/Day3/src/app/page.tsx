'use client';

import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import GamesSlider from '@/components/GamesSlider';
import FeaturedShowcase from '@/components/FeaturedShowcase';
import FreeGamesSection from '@/components/FreeGamesSection';
import TopSellersSection from '@/components/TopSellersSection';
import CatalogExplore from '@/components/CatalogExplore';
import Footer from '@/components/Footer';
import { useGameStore } from '@/store/useGameStore';

export default function Home() {
  const { games } = useGameStore();
  
  const saleGames = games.filter(g => g.discount > 0);
  const showcaseGames = games.filter(g => ['nfs-unbound', 'fifa-23', 'uncharted-4'].includes(g.id));

  return (
    <main className="min-h-screen flex flex-col bg-[#121212]">
      <Navbar />
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <HeroBanner />
        
        <GamesSlider 
          title="Game on sale" 
          games={saleGames} 
          prevClass="sales-prev" 
          nextClass="sales-next" 
        />
        
        <FeaturedShowcase games={showcaseGames} />
        
        <FreeGamesSection />
        
        <TopSellersSection />
        
        <FeaturedShowcase games={showcaseGames} />
        
        <GamesSlider 
          title="Game with Achievements" 
          games={saleGames} 
          prevClass="achievements-prev" 
          nextClass="achievements-next" 
        />
        
        <CatalogExplore />
      </div>
      <Footer />
    </main>
  );
}
