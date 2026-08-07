import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  reels: [{ type: String }],
  videos: [{ type: String }],
  photos: [{ type: String }]
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
