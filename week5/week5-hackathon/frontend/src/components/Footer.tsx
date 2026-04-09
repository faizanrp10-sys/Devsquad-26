import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const LinkedinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;

export default function Footer() {
  return (
    <footer className="bg-brand-blue text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1: Info */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            {/* Logo Placeholder */}
            <div className="h-8 w-12 bg-brand-orange rounded-md flex items-center justify-center">
               <span className="text-white text-xs font-bold">CAR</span>
            </div>
            <span className="text-2xl font-bold">
              Car <span className="text-emerald-400">Deposit</span>
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin turpis pretium donec orci semper. Sit suscipit lacus cras commodo in lectus sed egestas. Mattis egestas sit viverra pretium tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.
          </p>
          <div className="space-y-3">
            <h4 className="font-bold text-white">Follow Us</h4>
            <div className="flex space-x-3">
              <Link href="#" className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <FacebookIcon />
              </Link>
              <Link href="#" className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <InstagramIcon />
              </Link>
              <Link href="#" className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <LinkedinIcon />
              </Link>
              <Link href="#" className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <TwitterIcon />
              </Link>
            </div>
          </div>
        </div>

        {/* Column 2: Links 1 */}
        <div className="md:pl-8">
          <ul className="space-y-4 font-semibold">
            <li><Link href="/" className="hover:text-brand-orange transition-colors">Home</Link></li>
            <li><Link href="#" className="hover:text-brand-orange transition-colors">Help Center</Link></li>
            <li><Link href="#" className="hover:text-brand-orange transition-colors">FAQ</Link></li>
            <li><Link href="#" className="hover:text-brand-orange transition-colors">My Account</Link></li>
            <li><Link href="#" className="hover:text-brand-orange transition-colors">My Account</Link></li>
          </ul>
        </div>

        {/* Column 3: Links 2 */}
        <div>
          <ul className="space-y-4 font-semibold">
            <li><Link href="/auctions" className="hover:text-brand-orange transition-colors">Car Auction</Link></li>
            <li><Link href="#" className="hover:text-brand-orange transition-colors">Help Center</Link></li>
            <li><Link href="#" className="hover:text-brand-orange transition-colors">FAQ</Link></li>
            <li><Link href="#" className="hover:text-brand-orange transition-colors">My Account</Link></li>
            <li><Link href="#" className="hover:text-brand-orange transition-colors">My Account</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="space-y-6">
          <h4 className="font-bold text-xl mb-4">About us</h4>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-white relative top-2">
                <div className="absolute top-2 left-[3px] w-[2px] h-12 bg-white/20"></div>
              </div>
              <div>
                <span className="flex items-center space-x-2 text-sm text-slate-300"><Phone size={14} /> <span>Hot Line Number</span></span>
                <p className="font-bold">+054 211 4444</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-white relative top-2">
                <div className="absolute top-2 left-[3px] w-[2px] h-12 bg-white/20"></div>
              </div>
              <div>
                <span className="flex items-center space-x-2 text-sm text-slate-300"><Mail size={14} /> <span>Email Id :</span></span>
                <p className="font-bold hover:text-brand-orange cursor-pointer">info@cardeposit.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-white relative top-2"></div>
              <div>
                <span className="flex items-center space-x-2 text-sm text-slate-300"><MapPin size={14} /> <span>Office No 6, SKB Plaza next to</span></span>
                <p className="text-sm font-semibold tracking-wide leading-relaxed text-slate-200">
                  Bentley showroom,<br/>
                  Umm Al Sheif Street, Sheikh<br/>
                  Zayed Road, Dubai, UAE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center">
        <p className="text-sm tracking-wide text-slate-300">
          <span className="underline cursor-pointer hover:text-white">Copyright 2022</span> All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
