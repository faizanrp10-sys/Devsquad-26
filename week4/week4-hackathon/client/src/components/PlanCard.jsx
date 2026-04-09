import React from 'react';

const PlanCard = ({ name, description, price, features }) => {
  return (
    <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-8 flex flex-col h-full">
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <p className="text-gray-400 text-sm mb-6 flex-grow">{description}</p>
      <div className="text-white mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-gray-400 text-sm">/month</span>
      </div>
      <div className="flex gap-4">
        <button className="flex-1 bg-[#141414] border border-[#262626] hover:bg-[#222] text-white py-3 rounded transition-colors font-medium">Start Free Trial</button>
        <button className="flex-1 bg-brandPrimary hover:bg-red-700 text-white py-3 rounded transition-colors font-medium">Choose Plan</button>
      </div>
    </div>
  );
};

export default PlanCard;
