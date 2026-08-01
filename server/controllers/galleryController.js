import Gallery from "../models/Gallery.js";

// Helper to get or create the single gallery doc
const getOrCreateGallery = async () => {
  let gallery = await Gallery.findOne();
  if (!gallery) {
    gallery = await Gallery.create({ reels: [], videos: [], photos: [] });
  }
  return gallery;
};

export const getGallery = async (req, res) => {
  try {
    const gallery = await getOrCreateGallery();
    res.json(gallery);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({ message: "Server error fetching gallery" });
  }
};

export const updateUrls = async (req, res) => {
  try {
    const { reels, videos } = req.body;
    const gallery = await getOrCreateGallery();
    
    if (reels !== undefined) {
      // Handle comma-separated string from frontend or array
      const reelsArray = Array.isArray(reels) 
        ? reels 
        : reels.split(',').map(s => s.trim()).filter(Boolean);
      gallery.reels = reelsArray;
    }
    
    if (videos !== undefined) {
      const videosArray = Array.isArray(videos) 
        ? videos 
        : videos.split(',').map(s => s.trim()).filter(Boolean);
      gallery.videos = videosArray;
    }
    
    await gallery.save();
    res.json({ message: "URLs updated successfully", gallery });
  } catch (error) {
    console.error("Error updating URLs:", error);
    res.status(500).json({ message: "Server error updating URLs" });
  }
};

export const uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const newPhotoUrls = req.files.map(file => file.location || file.url || file.path); // depending on how multer S3 saves it, imageUploadMiddleware saves to file.location
    
    const gallery = await getOrCreateGallery();
    gallery.photos = [...gallery.photos, ...newPhotoUrls];
    await gallery.save();

    res.json({ message: "Photos uploaded successfully", gallery });
  } catch (error) {
    console.error("Error uploading photos:", error);
    res.status(500).json({ message: "Server error uploading photos" });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "URL is required to delete" });

    const gallery = await getOrCreateGallery();
    gallery.photos = gallery.photos.filter(photoUrl => photoUrl !== url);
    await gallery.save();

    res.json({ message: "Photo deleted successfully", gallery });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ message: "Server error deleting photo" });
  }
};
