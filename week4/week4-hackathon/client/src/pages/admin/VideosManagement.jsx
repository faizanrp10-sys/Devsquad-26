import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Plus, X, Upload } from 'lucide-react';
import { adminService } from '../../services/api';

const VideosManagement = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [uploading, setUploading] = useState({ thumbnail: false, video: false });
  
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    releaseYear: new Date().getFullYear(),
    thumbnailUrl: '',
    videoUrl: '',
    category: 'Movies',
    isPublished: true,
    rating: 0,
    language: 'English',
    subtitle: 'English',
    director: '',
    cast: [],
    ageRating: 'PG'
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getVideos();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const response = await adminService.uploadFile(data);
      const uploadedUrl = response.data.url;
      
      setFormData(prev => ({
        ...prev,
        [type === 'thumbnail' ? 'thumbnailUrl' : 'videoUrl']: uploadedUrl
      }));
      
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      alert(error.response?.data?.message || `Failed to upload ${type}`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const openModal = (video = null) => {
    if (video) {
      setIsEditing(true);
      setCurrentVideoId(video._id);
      setFormData({
        title: video.title,
        description: video.description,
        genre: video.genre,
        duration: video.duration,
        releaseYear: video.releaseYear,
        thumbnailUrl: video.thumbnailUrl,
        videoUrl: video.videoUrl,
        category: video.category,
        isPublished: video.isPublished,
        rating: video.rating || 0,
        language: video.language || 'English',
        subtitle: video.subtitle || 'English',
        director: video.director || '',
        cast: video.cast || [],
        ageRating: video.ageRating || 'PG'
      });
    } else {
      setIsEditing(false);
      setCurrentVideoId(null);
      setFormData({
        title: '',
        description: '',
        genre: '',
        duration: '',
        releaseYear: new Date().getFullYear(),
        thumbnailUrl: '',
        videoUrl: '',
        category: 'Movies',
        isPublished: true,
        rating: 0,
        language: 'English',
        subtitle: 'English',
        director: '',
        cast: [],
        ageRating: 'PG'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await adminService.updateVideo(currentVideoId, formData);
        alert('Video updated successfully');
      } else {
        await adminService.createVideo(formData);
        alert('Video added successfully');
      }
      setIsModalOpen(false);
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      alert(error.response?.data?.message || 'Failed to save video');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await adminService.deleteVideo(id);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video');
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Video Management</h1>
        <button 
          onClick={() => openModal()}
          className="bg-brandPrimary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg"
        >
          <Plus size={20} /> Add Video
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading videos...</div>
      ) : (
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#141414] border-b border-[#262626]">
                <th className="p-4 text-gray-400 font-medium">Thumbnail</th>
                <th className="p-4 text-gray-400 font-medium">Title</th>
                <th className="p-4 text-gray-400 font-medium">Rating</th>
                <th className="p-4 text-gray-400 font-medium">Year</th>
                <th className="p-4 text-gray-400 font-medium">Category</th>
                <th className="p-4 text-gray-400 font-medium">Status</th>
                <th className="p-4 text-gray-400 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.length > 0 ? (
                videos.map(video => (
                  <tr key={video._id} className="border-b border-[#1A1A1A] hover:bg-[#141414] transition-colors text-white">
                    <td className="p-4">
                      {video.thumbnailUrl && (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="p-4 font-medium max-w-xs truncate">{video.title}</td>
                    <td className="p-4 text-gray-300">⭐ {video.rating || 'N/A'}</td>
                    <td className="p-4 text-gray-300">{video.releaseYear}</td>
                    <td className="p-4 text-gray-300">{video.category}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${video.isPublished ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                        {video.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openModal(video)}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(video._id)} 
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500 italic">No videos found. Add your first video!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center sticky top-0 bg-[#0F0F0F] z-10">
              <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Video' : 'Add New Video'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Title</label>
                  <input 
                    type="text" name="title" value={formData.title} onChange={handleInputChange} required
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Genre</label>
                  <input 
                    type="text" name="genre" value={formData.genre} onChange={handleInputChange} required
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Director</label>
                  <input 
                    type="text" name="director" value={formData.director} onChange={handleInputChange}
                    placeholder="Director name"
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Rating (0-10)</label>
                  <input 
                    type="number" name="rating" value={formData.rating} onChange={handleInputChange} min="0" max="10" step="0.1"
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Duration (e.g. 2h 30m)</label>
                  <input 
                    type="text" name="duration" value={formData.duration} onChange={handleInputChange} required
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Release Year</label>
                  <input 
                    type="number" name="releaseYear" value={formData.releaseYear} onChange={handleInputChange} required
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Language</label>
                  <select 
                    name="language" value={formData.language} onChange={handleInputChange}
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Hindi</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Subtitle</label>
                  <select 
                    name="subtitle" value={formData.subtitle} onChange={handleInputChange}
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Hindi</option>
                    <option>None</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Age Rating</label>
                  <select 
                    name="ageRating" value={formData.ageRating} onChange={handleInputChange}
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  >
                    <option>G</option>
                    <option>PG</option>
                    <option>PG-13</option>
                    <option>R</option>
                    <option>NC-17</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Category</label>
                  <select 
                    name="category" value={formData.category} onChange={handleInputChange}
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                  >
                    <option value="Movies">Movies</option>
                    <option value="Shows">Shows</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input 
                    type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleInputChange}
                    id="isPublished" className="w-5 h-5 accent-brandPrimary"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-gray-400 cursor-pointer">Published</label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleInputChange} required rows="3"
                  className="w-full bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Thumbnail URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleInputChange} required
                    className="flex-grow bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                    placeholder="Enter URL or upload file"
                  />
                  <input 
                    type="file" ref={thumbnailInputRef} className="hidden" accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'thumbnail')}
                  />
                  <button 
                    type="button" 
                    onClick={() => thumbnailInputRef.current.click()}
                    disabled={uploading.thumbnail}
                    className="bg-[#1A1A1A] text-gray-300 px-4 py-2 rounded hover:bg-[#262626] transition-colors flex items-center gap-2 border border-[#333]"
                  >
                    <Upload size={18} /> {uploading.thumbnail ? 'Uploading...' : 'Browse'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Video Content URL (Stream URL)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} required
                    className="flex-grow bg-[#141414] border border-[#1A1A1A] rounded p-3 text-white focus:border-brandPrimary outline-none transition-colors"
                    placeholder="Enter URL or upload file"
                  />
                  <input 
                    type="file" ref={videoInputRef} className="hidden" accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                  />
                  <button 
                    type="button" 
                    onClick={() => videoInputRef.current.click()}
                    disabled={uploading.video}
                    className="bg-[#1A1A1A] text-gray-300 px-4 py-2 rounded hover:bg-[#262626] transition-colors flex items-center gap-2 border border-[#333]"
                  >
                    <Upload size={18} /> {uploading.video ? 'Uploading...' : 'Browse'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-[#1A1A1A]">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading.thumbnail || uploading.video}
                  className="bg-brandPrimary text-white px-8 py-2 rounded font-medium hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  {isEditing ? 'Save Changes' : 'Create Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosManagement;
