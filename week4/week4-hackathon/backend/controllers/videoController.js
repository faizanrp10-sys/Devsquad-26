import Video from '../models/Video.js';

// @desc    Get all videos (public/user)
// @route   GET /api/videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single video by ID
// @route   GET /api/videos/:id
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (video && video.isPublished) {
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stream video content (Protected, requires subscription)
// @route   GET /api/videos/:id/stream
export const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const user = req.user; // from protect middleware

    if (!video || !video.isPublished) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (!user.subscription || user.subscription.status !== 'active') {
      return res.status(403).json({ message: 'Active subscription required to stream videos' });
    }

    // Determine current date and compare with subscription endDate
    if (new Date() > new Date(user.subscription.endDate)) {
      user.subscription.status = 'inactive';
      await user.save();
      return res.status(403).json({ message: 'Subscription expired' });
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.json({ streamUrl: video.videoUrl, message: 'Streaming authorized' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ADMIN ROUTES ---

// @desc    Get all videos (including unpublished)
// @route   GET /api/videos/admin/all
export const getAdminVideos = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new video
// @route   POST /api/videos
export const createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update video details
// @route   PUT /api/videos/:id
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (video) {
      res.json({ message: 'Video removed' });
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
