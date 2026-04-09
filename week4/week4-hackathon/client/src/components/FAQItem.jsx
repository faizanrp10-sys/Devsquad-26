import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ number, question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-brandPrimary/20 mb-4 pb-4">
      <button 
        className="w-full flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <span className="bg-[#1A1A1A] border border-[#262626] text-white px-3 py-2 rounded text-lg font-bold">
            {number}
          </span>
          <span className="text-white text-lg font-medium">{question}</span>
        </div>
        {isOpen ? <Minus className="text-white" /> : <Plus className="text-white" />}
      </button>
      {isOpen && (
        <div className="pl-16 mt-4 text-gray-400 text-sm pr-8 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
