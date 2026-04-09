export default function CatalogExplore() {
  return (
    <section className="mb-16 mt-32">
      <div className="relative h-64 md:h-[300px] rounded-xl overflow-hidden bg-gradient-to-r from-[#18181C] to-[#0A0D14] flex items-center justify-end p-8 md:p-16">
        {/* Placeholder for the tilted covers on the left, omitted for simplicity */}
        
        <div className="z-10 max-w-sm text-left lg:mr-12">
          <h2 className="text-2xl md:text-[22px] font-normal text-white mb-4">Explore our Catalog</h2>
          <p className="text-gray-300 mb-6 text-[15px] leading-relaxed line-clamp-2 md:line-clamp-none">
            Browse by genre, features, price, and more to find your next favorite game.
          </p>
        </div>
      </div>
    </section>
  );
}
