import React from 'react';
import { Play, Plus, ThumbsUp, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MovieCard = ({ id = "123", title, type, duration, views, releaseDate, poster, trailerPoster }) => {
  return (
    <Link to={`/movie/${id}`} className="block relative group min-w-[250px] max-w-[250px] rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#262626] transition-transform hover:scale-105 hover:z-10 shadow-lg">
      {/* Type Badge (Top 10, etc) */}
      {type === 'top10' && (
        <div className="absolute top-2 left-2 bg-brandPrimary text-white text-xs px-2 py-1 rounded font-bold z-10">
          Top 10 In
        </div>
      )}
      
      {/* Image */}
      <img src={poster} alt={title} className="w-full h-[350px] object-cover" />
      
      {/* Overlay - visible on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <h4 className="text-white font-bold text-lg mb-2">{title}</h4>
        <div className="flex gap-2 mb-3">
          <button className="bg-white text-black rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-200">
            <Play size={16} fill="black" />
          </button>
          <button className="bg-[#262626] text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-[#333] border border-gray-600">
            <Plus size={16} />
          </button>
          <button className="bg-[#262626] text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-[#333] border border-gray-600">
            <ThumbsUp size={16} />
          </button>
          <div className="flex-grow"></div>
          <button className="bg-[#262626] text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-[#333] border border-gray-600">
            <Volume2 size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-brandLightGray flex-wrap">
          {duration && <span className="bg-[#141414] border border-[#262626] px-2 py-1 rounded">{duration}</span>}
          {views && <span className="bg-[#141414] border border-[#262626] px-2 py-1 rounded">{views} Views</span>}
          {releaseDate && <span className="bg-[#141414] border border-[#262626] px-2 py-1 rounded">Released: {releaseDate}</span>}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
