'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useGameStore } from '@/store/useGameStore';
import GameCard from './GameCard';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

interface GamesSliderProps {
  title: string;
  games: any[];
  prevClass: string;
  nextClass: string;
}

export default function GamesSlider({ title, games, prevClass, nextClass }: GamesSliderProps) {
  return (
    <section className="mb-14">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[19px] font-normal cursor-pointer hover:text-white transition flex items-center group">
          {title}
          <ChevronRightIcon className="w-5 h-5 ml-0.5 text-gray-400 opacity-80 group-hover:opacity-100 transition" />
        </h2>
        <div className="flex space-x-3">
          <button className={`${prevClass} w-9 h-9 rounded-full bg-[#202020] flex items-center justify-center hover:bg-gray-700 transition`}>
            <ChevronLeftIcon className="w-5 h-5 text-gray-300" />
          </button>
          <button className={`${nextClass} w-9 h-9 rounded-full bg-[#202020] flex items-center justify-center hover:bg-gray-700 transition`}>
            <ChevronRightIcon className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{ nextEl: `.${nextClass}`, prevEl: `.${prevClass}` }}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
      >
        {games.map((game) => (
          <SwiperSlide key={game.id}>
            <GameCard game={game} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
