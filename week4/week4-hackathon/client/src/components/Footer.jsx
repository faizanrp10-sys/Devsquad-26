import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#141414] border-t border-[#1A1A1A] pt-16 pb-8 px-8 md:px-16 mt-20 text-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
        <div>
          <h4 className="text-white font-medium mb-4">Home</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-white">Categories</Link></li>
            <li><Link to="#" className="hover:text-white">Devices</Link></li>
            <li><Link to="#" className="hover:text-white">Pricing</Link></li>
            <li><Link to="#" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Movies</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-white">Genres</Link></li>
            <li><Link to="#" className="hover:text-white">Trending</Link></li>
            <li><Link to="#" className="hover:text-white">New Release</Link></li>
            <li><Link to="#" className="hover:text-white">Popular</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Shows</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-white">Genres</Link></li>
            <li><Link to="#" className="hover:text-white">Trending</Link></li>
            <li><Link to="#" className="hover:text-white">New Release</Link></li>
            <li><Link to="#" className="hover:text-white">Popular</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Subscription</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-white">Plans</Link></li>
            <li><Link to="#" className="hover:text-white">Features</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Connect With Us</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-[#1A1A1A] rounded-lg flex items-center justify-center hover:bg-[#222]">
              <Facebook size={20} className="text-white" />
            </a>
            <a href="#" className="w-10 h-10 bg-[#1A1A1A] rounded-lg flex items-center justify-center hover:bg-[#222]">
              <Twitter size={20} className="text-white" />
            </a>
            <a href="#" className="w-10 h-10 bg-[#1A1A1A] rounded-lg flex items-center justify-center hover:bg-[#222]">
              <Linkedin size={20} className="text-white" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm border-t border-[#1A1A1A] pt-8">
        <p>@2026 streamvib. All Rights Reserved</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="#" className="hover:text-white">Terms of Use</Link>
          <Link to="#" className="hover:text-white">Privacy Policy</Link>
          <Link to="#" className="hover:text-white">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
