import React from 'react';

const DeviceCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-8 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-[#141414] p-3 rounded-lg border border-[#262626]">
          <Icon className="text-brandPrimary" size={24} />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default DeviceCard;
