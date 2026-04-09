import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Play, Plus, Volume2, ThumbsUp } from 'lucide-react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedHeaderSlider = ({ featuredItems }) => {
  return (
    <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden mb-16 group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} !bg-gray-600 !w-8 !h-1 !rounded-full transition-all [&.swiper-pagination-bullet-active]:!bg-brandPrimary [&.swiper-pagination-bullet-active]:!w-12"></span>`;
          }
        }}
        navigation={{
          prevEl: '.featured-prev',
          nextEl: '.featured-next',
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {featuredItems.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full overflow-hidden">
              {/* Background with semi-transparent overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                style={{ backgroundImage: `url(${item.backdrop})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-brandDark via-brandDark/40 to-transparent"></div>
              
              {/* Content Area */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-8 text-center max-w-4xl mx-auto z-10">
                <h2 className="text-5xl font-extrabold text-white mb-4 drop-shadow-2xl">{item.title}</h2>
                <p className="text-gray-200 text-lg mb-8 leading-relaxed line-clamp-3 opacity-90 max-w-3xl">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-4">
                  <button className="bg-brandPrimary hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl">
                    <Play fill="white" size={24} /> Play Now
                  </button>
                  <div className="flex gap-3">
                    <button className="bg-[#141414]/80 backdrop-blur-md hover:bg-[#222] p-4 rounded-lg border border-[#262626] text-white transition-all hover:scale-110">
                      <Plus size={22} />
                    </button>
                    <button className="bg-[#141414]/80 backdrop-blur-md hover:bg-[#222] p-4 rounded-lg border border-[#262626] text-white transition-all hover:scale-110">
                      <ThumbsUp size={22} />
                    </button>
                    <button className="bg-[#141414]/80 backdrop-blur-md hover:bg-[#222] p-4 rounded-lg border border-[#262626] text-white transition-all hover:scale-110">
                      <Volume2 size={22} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        {/* Navigation Arrows (Absolute positioned) */}
        <button className="featured-prev absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/30 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-black/50">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button className="featured-next absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/30 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-black/50">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </Swiper>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-pagination-bullet {
          margin: 0 !important;
        }
      `}} />
    </div>
  );
};

export default FeaturedHeaderSlider;
