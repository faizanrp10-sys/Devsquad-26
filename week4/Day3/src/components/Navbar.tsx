import Link from 'next/link';
import { MagnifyingGlassIcon, GlobeAltIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#121212] text-sm">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 h-14 bg-[#202020] border-b border-gray-800/60">
        <div className="flex items-center h-full">
          <Link href="/" className="flex items-center justify-center w-14 h-full bg-[#121212] hover:opacity-80 transition mr-6">
            {/* Minimalist Epic Logo text as placeholder for icon */}
            <span className="font-bold text-lg tracking-tighter text-white">EPIC</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-200 hover:text-white transition text-[13px] uppercase tracking-wider relative h-full flex items-center border-t-4 border-transparent hover:border-white">
              <span className="mt-[-4px]">Store</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition text-[13px] uppercase tracking-wider h-full flex items-center border-t-4 border-transparent hover:border-white">
              <span className="mt-[-4px]">FAQ</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition text-[13px] uppercase tracking-wider h-full flex items-center border-t-4 border-transparent hover:border-white">
              <span className="mt-[-4px]">Help</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition text-[13px] uppercase tracking-wider h-full flex items-center border-t-4 border-transparent hover:border-white">
              <span className="mt-[-4px]">Unreal Engine</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center h-full">
          <button className="text-gray-400 hover:text-white transition px-4 h-full flex items-center">
            <GlobeAltIcon className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition px-4 h-full">
            <UserIcon className="w-5 h-5" />
            <span className="hidden lg:inline text-[13px] tracking-wider">SIGN IN</span>
          </button>
          <button className="bg-[#0074E4] hover:bg-[#005bb5] text-white px-6 h-full text-[13px] font-bold tracking-wider transition">
            DOWNLOAD
          </button>
        </div>
      </div>

      {/* Sub Navbar for Store */}
      <div className="flex items-center px-6 h-16 bg-[#121212] space-x-8">
        <div className="flex items-center space-x-3 bg-[#202020] rounded-full px-4 py-2.5 w-[240px] hover:bg-[#2a2a2a] transition duration-200">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Store" 
            className="bg-transparent border-none outline-none text-gray-200 w-full placeholder-gray-400 text-[13px]"
          />
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 h-full">
          <Link href="/" className="text-white transition text-[15px] h-full flex items-center relative">
            Discover
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>
          </Link>
          <Link href="/games" className="text-gray-400 hover:text-white transition text-[15px] h-full flex items-center">Browse</Link>
          <Link href="#" className="text-gray-400 hover:text-white transition text-[15px] h-full flex items-center">News</Link>
        </nav>
      </div>
    </header>
  );
}
