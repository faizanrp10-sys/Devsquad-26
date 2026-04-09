import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MovieSlider = ({ title, children, slidesPerView = 5 }) => {
  const [isEnd, setIsEnd] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="mb-12 group">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
        
        <div className="flex items-center gap-4 bg-[#0F0F0F] border border-[#1A1A1A] p-2 rounded-xl">
          {/* Custom Pagination Container (Progress Bar Style) */}
          <div className="flex gap-1 px-2 custom-pagination-container">
            {/* Swiper will inject bullets here, we'll style them in CSS */}
          </div>

          <div className="flex gap-2">
            <button 
              ref={prevRef}
              className={`p-3 rounded-lg border border-[#262626] transition-all bg-[#1A1A1A] ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#262626] text-white'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              ref={nextRef}
              className={`p-3 rounded-lg border border-[#262626] transition-all bg-[#1A1A1A] ${isEnd ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#262626] text-white'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        pagination={{
          clickable: true,
          el: '.custom-pagination-container',
          renderBullet: (index, className) => {
            return `<span class="${className} w-4 h-1 !bg-[#333] !rounded-full transition-all !opacity-100 [&.swiper-pagination-bullet-active]:!bg-brandPrimary [&.swiper-pagination-bullet-active]:!w-8"></span>`;
          },
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
          1536: { slidesPerView: slidesPerView },
        }}
        className="!overflow-visible"
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index} className="!h-auto">
            {child}
          </SwiperSlide>
        ))}
      </Swiper>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-pagination-container {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .swiper-pagination-bullet {
          margin: 0 !important;
        }
      `}} />
    </div>
  );
};

export default MovieSlider;
