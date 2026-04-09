import React, { useEffect, useState } from 'react';
import { Play, Plus, ThumbsUp, Volume2, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mediaData } from '../data/mediaData';
import { videoService } from '../services/api';

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 1. Check local mediaData first
    const localMovie = mediaData.find(item => item.id === id);
    
    if (localMovie) {
      setMovie(localMovie);
      setLoading(false);
    } else {
      // 2. If not in local data, try fetching from API
      const fetchFromApi = async () => {
        try {
          const { data } = await videoService.getVideoById(id);
          if (data) {
            setMovie({
              id: data._id,
              title: data.title,
              description: data.description || "No description available.",
              backdrop: data.thumbnailUrl || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2070",
              poster: data.thumbnailUrl || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2070",
              releasedYear: data.releaseYear || "N/A",
              languages: ["English"],
              videoUrl: data.videoUrl,
              ratings: { imdb: "N/A", streamvibe: "N/A" },
              genres: data.genre ? [data.genre] : ["Unknown"],
              director: { name: "Unknown", photo: "https://i.pravatar.cc/150?img=11", country: "N/A" },
              music: { name: "Unknown", photo: "https://i.pravatar.cc/150?img=12", country: "N/A" },
              cast: [],
              reviews: []
            });
          }
        } catch (error) {
          console.error("Error fetching movie details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchFromApi();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-[100px] min-h-screen bg-brandDark flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brandPrimary"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="pt-[100px] min-h-screen bg-brandDark flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
        <button onClick={() => navigate('/movies-shows')} className="bg-brandPrimary px-6 py-2 rounded">Go Back</button>
      </div>
    );
  }

  return (
    <div className="pt-[100px] min-h-screen bg-brandDark px-8 md:px-16 pb-16 max-w-7xl mx-auto">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2">
         <ArrowLeft size={20} /> Back
      </button>

      {/* Video Player Section */}
      <div className="w-full aspect-video bg-[#0d0d0d] rounded-2xl overflow-hidden relative mb-10 group border border-[#1A1A1A]">
        {isPlaying && movie.videoUrl ? (
          <video 
            src={movie.videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            {/* Poster Background */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${movie.backdrop})` }}></div>
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Fake Video Player Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="w-full bg-gray-600 h-1 rounded-full mb-4">
                  <div className="bg-brandPrimary w-1/3 h-full rounded-full"></div>
               </div>
               <div className="flex justify-between items-center text-white">
                 <div className="flex gap-4">
                    <Play fill="white" size={24} className="cursor-pointer hover:text-brandPrimary" onClick={() => setIsPlaying(true)} />
                    <Volume2 size={24} className="cursor-pointer hover:text-brandPrimary" />
                    <span className="text-sm">Preview Mode</span>
                 </div>
               </div>
            </div>
            
            {/* Center Title Layout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl">{movie.title}</h1>
                <p className="text-gray-200 max-w-2xl mb-8 line-clamp-2 md:line-clamp-none drop-shadow-md">
                  {movie.description}
                </p>
                <div className="flex gap-4">
                    <button 
                      onClick={() => setIsPlaying(true)}
                      className="bg-brandPrimary hover:bg-red-700 text-white font-bold py-3 px-10 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl"
                    >
                      <Play fill="white" size={20} /> Play Now
                    </button>
                    <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-lg border border-white/20 text-white transition-colors">
                      <Plus size={20} />
                    </button>
                </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Description, Cast, Reviews) */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-400 mb-4">Description</h3>
              <p className="text-white leading-relaxed">
                {movie.description}
              </p>
           </div>
           
           <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-400">Cast</h3>
                <div className="flex gap-2">
                  <button className="bg-[#1A1A1A] p-2 rounded hover:bg-[#222]"><ArrowLeft size={16}/></button>
                  <button className="bg-[#1A1A1A] p-2 rounded hover:bg-[#222]"><ArrowLeft size={16} className="rotate-180"/></button>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                {movie.cast && movie.cast.length > 0 ? (
                  movie.cast.map((actor, i) => (
                    <div key={i} className="flex-shrink-0 text-center">
                      <img src={actor.photo} alt={actor.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl mb-2" />
                      <p className="text-white text-xs font-semibold max-w-[80px] break-words">{actor.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No cast information available.</p>
                )}
              </div>
           </div>
           
           <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-8">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-gray-400">Reviews</h3>
                 <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#222]">
                   <Plus size={16} /> Add Your Review
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {movie.reviews && movie.reviews.length > 0 ? (
                   movie.reviews.map((review, i) => (
                    <div key={i} className="bg-[#141414] p-6 rounded-xl border border-[#262626]">
                        <div className="flex justify-between mb-4">
                           <div>
                             <h4 className="text-white font-bold">{review.author}</h4>
                             <span className="text-xs text-gray-500">From {review.country}</span>
                           </div>
                           <div className="flex bg-[#0F0F0F] px-2 py-1 rounded gap-1 items-center border border-[#262626]">
                              <span className="text-brandPrimary">{"★".repeat(Math.floor(review.rating))}{"☆".repeat(5-Math.floor(review.rating))}</span>
                              <span className="text-white text-sm">{review.rating}</span>
                           </div>
                        </div>
                        <p className="text-gray-400 text-sm italic">"{review.content}"</p>
                    </div>
                  ))
                 ) : (
                   <div className="text-gray-500 col-span-2 text-center py-4">No reviews yet. Be the first to review!</div>
                 )}
              </div>
           </div>
        </div>

        {/* Right Column (Metadata) */}
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-8 space-y-8 h-fit">
           <div>
              <h4 className="text-gray-400 text-sm mb-2 font-medium flex items-center gap-2">Released Year</h4>
              <p className="text-white font-semibold text-lg">{movie.releasedYear}</p>
           </div>
           <div>
              <h4 className="text-gray-400 text-sm mb-2 font-medium flex items-center gap-2">Available Languages</h4>
              <div className="flex gap-2 flex-wrap text-sm">
                 {movie.languages.map((lang, i) => (
                   <span key={i} className="bg-[#141414] border border-[#262626] px-3 py-1 rounded text-white">{lang}</span>
                 ))}
              </div>
           </div>
           <div>
              <h4 className="text-gray-400 text-sm mb-2 font-medium flex items-center gap-2">Ratings</h4>
              <div className="flex gap-4">
                 <div className="bg-[#141414] border border-[#262626] p-4 rounded-xl flex-1">
                    <p className="text-white font-bold mb-1">IMDb</p>
                    <div className="flex items-center gap-1">
                       <span className="text-brandPrimary text-xs">★★★★☆</span>
                       <span className="text-white text-sm font-medium">{movie.ratings.imdb}</span>
                    </div>
                 </div>
                 <div className="bg-[#141414] border border border-[#262626] p-4 rounded-xl flex-1">
                    <p className="text-white font-bold mb-1">Streamvibe</p>
                    <div className="flex items-center gap-1">
                       <span className="text-brandPrimary text-xs">★★★★☆</span>
                       <span className="text-white text-sm font-medium">{movie.ratings.streamvibe}</span>
                    </div>
                 </div>
              </div>
           </div>
           <div>
              <h4 className="text-gray-400 text-sm mb-2 font-medium flex items-center gap-2">Genres</h4>
              <div className="flex gap-2 flex-wrap text-sm">
                 {movie.genres.map((genre, i) => (
                   <span key={i} className="bg-[#141414] border border-[#262626] px-3 py-1 rounded text-white">{genre}</span>
                 ))}
              </div>
           </div>
           {movie.director && (
             <div>
                <h4 className="text-gray-400 text-sm mb-2 font-medium">Director</h4>
                <div className="bg-[#141414] border border-[#262626] p-3 rounded flex items-center gap-3">
                   <img src={movie.director.photo} alt={movie.director.name} className="w-12 h-12 rounded object-cover" />
                   <div>
                      <h5 className="text-white font-bold text-sm">{movie.director.name}</h5>
                      <p className="text-gray-500 text-xs">From {movie.director.country}</p>
                   </div>
                </div>
             </div>
           )}
           {movie.music && (
             <div>
                <h4 className="text-gray-400 text-sm mb-2 font-medium">Music</h4>
                <div className="bg-[#141414] border border-[#262626] p-3 rounded flex items-center gap-3">
                   <img src={movie.music.photo} alt={movie.music.name} className="w-12 h-12 rounded object-cover" />
                   <div>
                      <h5 className="text-white font-bold text-sm">{movie.music.name}</h5>
                      <p className="text-gray-500 text-xs">From {movie.music.country}</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
      
    </div>
  );
};

export default MovieDetails;
