import React from 'react';
import { Play } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[80vh] flex items-end pb-20 justify-center items-end">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: 'url("/hero-img.png")' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>
      
      {/* Content */}
      <div className="relative top-40 z-10 text-center max-w-4xl px-4 flex flex-col items-center ">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">The Best Streaming Experience</h1>
        <p className="text-gray-400 text-sm md:text-base mb-8 max-w-3xl leading-relaxed">
          StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With StreamVibe, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more. You can also create your own watchlists, so you can easily find the content you want to watch.
        </p>
        <button className="bg-brandPrimary hover:bg-red-700 text-white font-medium py-3 px-8 rounded flex items-center gap-2 transition-colors">
          <Play fill="white" size={20} /> Start Watching Now
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
