import React, { useState, useEffect } from 'react';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';
import CategoryCard from '../components/CategoryCard';
import FeaturedHeaderSlider from '../components/FeaturedHeaderSlider';
import { videoService } from '../services/api';
import { contentApi } from '../services/contentApi';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '').replace(/\/$/, '');

const MoviesAndShows = () => {
  const [apiVideos, setApiVideos] = useState([]);
  const [content, setContent] = useState({
    featuredItems: [],
    categories: [],
    movies: [],
    top10: [],
    popularShowsList: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideosAndContent = async () => {
      try {
        const [videosRes, contentRes] = await Promise.all([
          videoService.getVideos(),
          contentApi.getMoviesShowsContent()
        ]);
        
        if (videosRes.data && videosRes.data.length > 0) {
           setApiVideos(videosRes.data);
        }
        if (contentRes.data) {
           setContent(contentRes.data);
        }
      } catch(error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideosAndContent();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // Normalize path
    let normalizedPath = path.startsWith('./') ? path.substring(1) : path;
    if (!normalizedPath.startsWith('/')) normalizedPath = '/' + normalizedPath;

    // If it's a backend upload, prefix with API_BASE_URL
    if (normalizedPath.startsWith('/uploads')) {
      const prefix = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      return `${prefix}${normalizedPath}`;
    }

    // Otherwise, treat as a local asset served by Vite
    return normalizedPath;
  };

  if (loading) {
     return <div className="min-h-screen bg-brandDark flex items-center justify-center text-white">Loading...</div>;
  }

  const { 
    featuredItems: apiFeaturedItems, 
    categories: apiCategories, 
    movies: apiMoviesData, 
    top10: apiTop10, 
    popularShowsList: apiPopularShows 
  } = content;

  const featuredItems = apiFeaturedItems?.length > 0 ? apiFeaturedItems : [
    {
      title: "Avengers : Endgame",
      description: "With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos's actions and undo the chaos to the universe, no matter what consequences may be in store, and no matter who they face... Avenge the fallen.",
      backdrop: "/avengers.png"
    },
    {
      title: "Stranger Things",
      description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
      backdrop: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1600&q=80"
    },
    {
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&q=80"
    }
  ];

  const categoriesList = apiCategories?.length > 0 ? apiCategories : [
    { title: "Action", images: ["/action1.png", "/action2.png", "/action3.png", "/action4.png"] },
    { title: "Adventure", images: ["/adventure1.png", "/adventure2.png", "/adventure3.png", "/adventure4.png"] },
    { title: "Comedy", images: ["/comedy1.png", "/comedy2.png", "/comedy3.png", "/comedy4.png"] },
    { title: "Drama", images: ["/Drama1.png", "/Drama2.png", "/Drama3.png", "/Drama4.png"] },
    { title: "Horror", images: ["/Horror1.png", "/Horror2.png", "/Horror3.png", "/Horror4.png"] },
    { title: "Sci-Fi", images: ["https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=80", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80", "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&q=80", "https://images.unsplash.com/photo-1588691866405-b77da1795c47?w=400&q=80"] },
    { title: "Romance", images: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80", "https://images.unsplash.com/photo-1533518463841-d62e1fc91373?w=400&q=80", "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80"] }
  ];

  const moviesData = apiMoviesData?.length > 0 ? apiMoviesData : [
    { title: "Kantara", duration: "1h 57min", views: "20K", poster: "/trendingnowmovie1.png" },
    { title: "Pushpa", duration: "1h 30min", views: "20K", poster: "/trendingnowmovie2.png" },
    { title: "Blade Runner 2049", duration: "1h 42min", views: "20K", poster: "/trendingnowmovie3.png" },
    { title: "Adipurush", duration: "2h 10min", views: "20K", poster: "/trendingnowmovie4.png" },
    { title: "Pathan", duration: "2h 20min", views: "15K", poster: "/trendingnowmovie5.png" },
  ];

  const top10List = apiTop10?.length > 0 ? apiTop10 : [
    { title: "Top Action 1", type: "top10", poster: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80" },
    { title: "Top Adventure 2", type: "top10", poster: "https://images.unsplash.com/photo-1605369572399-05d8d64a0f6e?w=400&q=80" },
    { title: "Top Comedy 3", type: "top10", poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80" },
    { title: "Top Drama 4", type: "top10", poster: "https://images.unsplash.com/photo-1533518463841-d62e1fc91373?w=400&q=80" },
    { title: "Top Horror 5", type: "top10", poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80" },
    { title: "Top Horror 5", type: "top10", poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80" },
    { title: "Top Horror 5", type: "top10", poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80" }
  ];

  const transformedApiVideos = apiVideos.map(v => ({
    id: v._id || v.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: v.title,
    duration: v.duration || "2h 00m",
    views: (v.views || 0) + " Views",
    poster: v.thumbnailUrl ? getImageUrl(v.thumbnailUrl) : "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80",
    category: v.category || 'Movies',
    videoUrl: v.videoUrl
  }));

  const apiMoviesFromVideos = transformedApiVideos.filter(v => v.category === 'Movies');
  const apiShowsFromVideos = transformedApiVideos.filter(v => v.category === 'Shows');

  // Combined lists for sliders (API items first)
  const moviesList = [...apiMoviesFromVideos, ...moviesData]; 
  const showsList = [...apiShowsFromVideos, ...apiPopularShows];

  return (
    <div className="pt-[100px] min-h-screen bg-brandDark px-8 md:px-16 max-w-[1600px] mx-auto">
      {/* Featured Header Slider */}
      <FeaturedHeaderSlider featuredItems={featuredItems.map(item => ({ ...item, backdrop: getImageUrl(item.backdrop) }))} />

      {/* Category Anchors */}
      <div className="mt-8 mb-4 inline-flex bg-[#0F0F0F] border border-[#1A1A1A] p-1 rounded-md">
        <button 
          className="px-6 py-2 rounded transition-colors bg-brandPrimary text-white shadow-lg font-medium"
          onClick={() => document.getElementById('movies-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Movies
        </button>
        <button 
          className="px-6 py-2 rounded transition-colors text-gray-400 hover:text-white font-medium ml-1"
          onClick={() => document.getElementById('shows-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Shows
        </button>
      </div>

      {/* Movies Section */}
      <div id="movies-section" className="relative mt-20 scroll-mt-24">
        <div className="inline-block bg-brandPrimary text-white px-4 py-1 rounded text-sm font-semibold tracking-widest uppercase shadow-lg mb-8">
          Movies
        </div>
        
        <div className="space-y-16 py-12 border border-[#262626] rounded-xl px-10 relative overflow-x-hidden">
          <MovieSlider title="Our Genres" className="overflow-x-hidden">
            {categoriesList.map((cat, i) => (
              <CategoryCard key={i} title={cat.title} images={cat.images.map(getImageUrl)} />
            ))}
          </MovieSlider>

          <MovieSlider title={`Popular Top 10 In Genres`} className="overflow-x-hidden">
            {top10List.map((item, i) => (
              <MovieCard key={i} id={item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} {...item} poster={getImageUrl(item.poster)} />
            ))}
          </MovieSlider>

          <MovieSlider title={`Trending Movies Now`} className="overflow-x-hidden">
            {moviesList.map((item, i) => (
              <MovieCard key={i} {...item} poster={getImageUrl(item.poster)} />
            ))}
          </MovieSlider>

          <MovieSlider title={`New Releases`} className="overflow-x-hidden">
            {moviesList.map((item, i) => (
               <MovieCard key={i} {...item} releaseDate={`14 April 2023`} title={`${item.title}`} poster={getImageUrl(item.poster)} />
            ))}
          </MovieSlider>

          <MovieSlider title={`Must - Watch Movies`} className="overflow-x-hidden">
             {moviesList.map((item, i) => (
              <MovieCard key={i} {...item} poster={getImageUrl(item.poster)} />
            ))}
          </MovieSlider>
        </div>
      </div>

      {/* Shows Section */}
      <div id="shows-section" className="relative mt-20 scroll-mt-24">
        <div className="inline-block bg-brandPrimary text-white px-4 py-1 rounded text-sm font-semibold tracking-widest uppercase shadow-lg mb-8">
          Shows
        </div>
        
        <div className="space-y-16 py-12 border border-[#262626] rounded-xl px-10 relative overflow-x-hidden">
          <MovieSlider title="Our Genres" className="overflow-x-hidden">
            {categoriesList.map((cat, i) => (
              <CategoryCard key={i} title={cat.title} images={cat.images.map(getImageUrl)} />
            ))}
          </MovieSlider>

          <MovieSlider title={`Popular Top 10 In Genres`} className="overflow-x-hidden">
            {top10List.map((item, i) => (
              <MovieCard key={i} id={item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} {...item} poster={getImageUrl(item.poster)} />
            ))}
          </MovieSlider>

          <MovieSlider title={`Trending Shows Now`} className="overflow-x-hidden">
            {showsList.map((item, i) => (
              <MovieCard key={i} {...item} poster={getImageUrl(item.poster)} />
            ))}
          </MovieSlider>

          <MovieSlider title={`New Released Shows`} className="overflow-x-hidden">
            {showsList.map((item, i) => (
               <MovieCard key={i} {...item} releaseDate={`20 March 2024`} title={`${item.title}`} poster={getImageUrl(item.poster)} />
            ))}
          </MovieSlider>

          <MovieSlider title={`Must - Watch Shows`} className="overflow-x-hidden">
             {showsList.map((item, i) => (
              <MovieCard key={i} {...item} poster={getImageUrl(item.poster)} />
            ))}
          </MovieSlider>
        </div>
      </div>
      
       {/* Footer CTA */}
      <section className="pb-16 pt-20 max-w-7xl mx-auto">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-10 flex flex-col md:flex-row justify-between items-center bg-cover bg-center mix-blend-screen"
             style={{ backgroundImage: `linear-gradient(to right, #141414 0%, rgba(20,20,20,0.8) 50%, rgba(229, 9, 20, 0.2) 100%), url("${getImageUrl('/free-trail-bgimg.png')}")` }}>
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-white mb-2">Start your free trial today!</h2>
            <p className="text-gray-400">This is a clear and concise call to action that encourages users to sign up for a free trial of StreamVibe.</p>
          </div>
          <button className="bg-brandPrimary text-white font-medium py-3 px-8 rounded hover:bg-red-700 transition shadow-lg shrink-0 whitespace-nowrap">
            Start a Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default MoviesAndShows;
