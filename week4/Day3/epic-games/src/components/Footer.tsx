export default function Footer() {
  return (
    <footer className="bg-[#202020] text-gray-400 text-[13px] pt-12 pb-8 mt-16 px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-start mb-8 pb-8">
          <div className="flex space-x-6">
            <span className="hover:text-[#0074e4] cursor-pointer transition text-2xl">f</span>
            <span className="hover:text-[#0074e4] cursor-pointer transition text-2xl">t</span>
            <span className="hover:text-[#0074e4] cursor-pointer transition text-2xl">y</span>
          </div>
          <button className="text-white border border-gray-500 p-2 hover:bg-gray-700 transition">
            ^
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h4 className="text-gray-500 mb-4 font-normal">Resource</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#0074e4] cursor-pointer transition">Creator Support</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">Published On Epic Games</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">Profession</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">Company</li>
            </ul>
          </div>
          <div>
            <h4 className="text-transparent mb-4">.</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#0074e4] cursor-pointer transition">Fan Work Policy</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">User Exp Service</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">User Liscence</li>
            </ul>
          </div>
          <div>
            <h4 className="text-transparent mb-4">.</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#0074e4] cursor-pointer transition">Online Service</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">Community</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">Epic Newsroom</li>
            </ul>
          </div>
          <div>
            <h4 className="text-transparent mb-4">.</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#0074e4] cursor-pointer transition">Battle Breakers</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">Fortnite</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">Infinity Blade</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">Robo Recall</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">Shadow Complex</li>
              <li className="hover:text-[#0074e4] cursor-pointer transition">Unreal Tournament</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8 mt-8 text-[12px] text-gray-500 space-y-4">
          <p className="max-w-4xl leading-relaxed">
            © 2022, Epic Games, Inc. All rights reserved. Epic, Epic Games, Epic Games logo, Fortnite, Fortnite logo, Unreal, Unreal Engine, Unreal Engine logo, Unreal Tournament, and the Unreal Tournament logo are trademarks or registered trademarks of Epic Games, Inc. in the United States of America and elsewhere. Other brand or product names are trademarks of their respective owners. Transactions outside the United States are handled through Epic Games International, S.à r.l.
          </p>
          <div className="flex justify-between items-center pt-4">
            <div className="flex space-x-6">
              <span className="hover:text-[#0074e4] cursor-pointer transition">Terms of Service</span>
              <span className="hover:text-[#0074e4] cursor-pointer transition">Privacy Policy</span>
              <span className="hover:text-[#0074e4] cursor-pointer transition">Store Refund Policy</span>
            </div>
            {/* Minimalist placeholder for the Epic logo bottom right */}
            <div className="text-gray-400 font-bold tracking-tighter text-xl">
              EPIC
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
