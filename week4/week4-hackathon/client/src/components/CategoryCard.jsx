import React from 'react';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ title, images }) => {
  return (
    <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-4 cursor-pointer hover:border-gray-500 transition-colors group">
      <div className="grid grid-cols-2 gap-2 mb-4">
        {images.map((img, i) => (
          <img key={i} src={img} alt="" className="w-full h-24 object-cover rounded-md" />
        ))}
      </div>
      <div className="flex justify-between items-center text-white font-medium">
        <span>{title}</span>
        <ArrowRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};

export default CategoryCard;
