'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center">
             <img src="http://localhost:3001/logo.png" alt="Car Deposit" className="h-10" />
          </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-8">
              Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin turpis pretium donec orci semper. Sit suscipit lacus cras commodo in lectus sed egestas. Mattis egestas sit viverra pretium tincidunt libero.
            </p>
            <div>
              <h4 className="text-sm font-semibold mb-4">Follow Us</h4>
              <div className="w-10 h-0.5 bg-accent mb-4" />
              <div className="flex space-x-3">
                {['f', 'in', 'in', 'tw'].map((icon, i) => (
                  <Link key={i} href="#" className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:bg-accent hover:border-accent hover:text-white transition-all text-xs font-bold">
                    {icon === 'f' ? 'f' : icon === 'tw' ? '𝕏' : icon === 'in' && i === 2 ? 'in' : '📷'}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Home Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Home</h4>
            <ul className="space-y-4">
              {['Help Center', 'FAQ', 'My Account', 'My Account'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Auction Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Car Auction</h4>
            <ul className="space-y-4">
              {['Help Center', 'FAQ', 'My Account', 'My Account'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us / Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">About us</h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-accent" />
                  </div>
                  <div className="w-px h-6 bg-white/20 mt-1" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Hot Line Number</p>
                  <p className="text-sm font-semibold">+054 211 4444</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-accent" />
                  </div>
                  <div className="w-px h-6 bg-white/20 mt-1" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Email Id :</p>
                  <a href="mailto:info@cardeposit.com" className="text-sm font-semibold text-accent hover:underline">info@cardeposit.com</a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-accent" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Office No 6, SKB Plaza next to Bentley showroom, Umm Al Sheif Street, Sheikh Zayed Road, Dubai, UAE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 text-center">
          <p className="text-sm text-white/50">
            <span className="text-accent underline">Copyright 2022</span> All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
