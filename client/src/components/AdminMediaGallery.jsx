import { useState, useEffect } from "react";
import { fetchGalleryMedia, updateGalleryUrls, uploadGalleryPhotos, deleteGalleryPhoto } from "../services/api.js";
import { Edit2, Save, Trash2, UploadCloud, X, RefreshCw } from "lucide-react";

export default function AdminMediaGallery({ token }) {
  const [gallery, setGallery] = useState({ reels: [], videos: [], photos: [] });
  const [reelsText, setReelsText] = useState("");
  const [videosText, setVideosText] = useState("");
  const [isEditingReels, setIsEditingReels] = useState(false);
  const [isEditingVideos, setIsEditingVideos] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const loadGallery = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGalleryMedia();
      setGallery(data);
      setReelsText(data.reels.join(",\n"));
      setVideosText(data.videos.join(",\n"));
    } catch (err) {
      showMessage("Failed to load gallery", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleSaveUrls = async (type) => {
    try {
      const isReels = type === "reels";
      const payload = isReels ? { reels: reelsText } : { videos: videosText };
      
      const updated = await updateGalleryUrls(token, payload);
      setGallery(updated.gallery);
      if (isReels) {
        setReelsText(updated.gallery.reels.join(",\n"));
        setIsEditingReels(false);
      } else {
        setVideosText(updated.gallery.videos.join(",\n"));
        setIsEditingVideos(false);
      }
      showMessage(`${type} updated successfully!`);
    } catch (error) {
      showMessage(`Error updating ${type}: ${error.message}`, "error");
    }
  };

  const handleFileUpload = async (e) => {
    if (!e.target.files.length) return;
    setIsUploading(true);
    try {
      const updated = await uploadGalleryPhotos(token, e.target.files);
      setGallery(updated.gallery);
      showMessage("Photos uploaded successfully!");
    } catch (error) {
      showMessage(`Upload failed: ${error.message}`, "error");
    } finally {
      setIsUploading(false);
      e.target.value = null; // reset file input
    }
  };

  const handleDeletePhoto = async (url) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    
    try {
      const updated = await deleteGalleryPhoto(token, url);
      setGallery(updated.gallery);
      showMessage("Photo deleted");
    } catch (error) {
      showMessage(`Delete failed: ${error.message}`, "error");
    }
  };

  if (isLoading) return <div className="text-white p-8 animate-pulse flex items-center gap-2"><RefreshCw className="animate-spin" /> Loading Media...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {message.text && (
        <div className={`p-4 rounded-xl border font-medium ${message.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'}`}>
          {message.text}
        </div>
      )}

      {/* REELS SECTION */}
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl group-hover:bg-pink-500/10 transition-colors" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-6 bg-pink-500 rounded-full" /> YouTube Reels
          </h2>
          {!isEditingReels ? (
            <button onClick={() => setIsEditingReels(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-bold">
              <Edit2 size={16} /> Edit URLs
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setIsEditingReels(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm font-bold">Cancel</button>
              <button onClick={() => handleSaveUrls('reels')} className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors text-sm font-bold">
                <Save size={16} /> Save
              </button>
            </div>
          )}
        </div>

        <div className="relative z-10">
          {isEditingReels ? (
            <div>
              <label className="text-xs text-white/50 mb-2 block uppercase tracking-wider">Paste YouTube Short URLs (Comma Separated or New Line)</label>
              <textarea 
                value={reelsText}
                onChange={(e) => setReelsText(e.target.value)}
                className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors resize-none"
                placeholder="https://www.youtube.com/shorts/..., https://www.youtube.com/shorts/..."
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {gallery.reels.length === 0 ? <p className="text-white/40 italic">No reels added.</p> : gallery.reels.map((url, i) => (
                <span key={i} className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm rounded-full break-all max-w-full truncate">{url}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* VIDEOS SECTION */}
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-6 bg-red-500 rounded-full" /> YouTube Videos
          </h2>
          {!isEditingVideos ? (
            <button onClick={() => setIsEditingVideos(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-bold">
              <Edit2 size={16} /> Edit URLs
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setIsEditingVideos(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm font-bold">Cancel</button>
              <button onClick={() => handleSaveUrls('videos')} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors text-sm font-bold">
                <Save size={16} /> Save
              </button>
            </div>
          )}
        </div>

        <div className="relative z-10">
          {isEditingVideos ? (
            <div>
              <label className="text-xs text-white/50 mb-2 block uppercase tracking-wider">Paste YouTube Video URLs (Comma Separated or New Line)</label>
              <textarea 
                value={videosText}
                onChange={(e) => setVideosText(e.target.value)}
                className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                placeholder="https://www.youtube.com/watch?v=..., https://www.youtube.com/watch?v=..."
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {gallery.videos.length === 0 ? <p className="text-white/40 italic">No videos added.</p> : gallery.videos.map((url, i) => (
                <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-full break-all max-w-full truncate">{url}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PHOTOS SECTION */}
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
        
        <div className="flex items-center justify-between mb-6 relative z-10 flex-wrap gap-4">
          <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full" /> Photo Gallery
          </h2>
          
          <div>
            <input 
              type="file" 
              id="photo-upload" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label htmlFor="photo-upload" className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-bold ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isUploading ? <RefreshCw size={16} className="animate-spin" /> : <UploadCloud size={16} />} 
              {isUploading ? "Uploading..." : "Upload Photos"}
            </label>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {gallery.photos.length === 0 ? (
            <p className="text-white/40 italic col-span-full">No photos uploaded.</p>
          ) : (
            gallery.photos.map((url, i) => (
              <div key={i} className="relative group/photo aspect-square bg-black/50 rounded-xl overflow-hidden border border-white/10">
                <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDeletePhoto(url)}
                    className="p-3 bg-red-600/90 hover:bg-red-500 text-white rounded-full transform scale-50 group-hover/photo:scale-100 transition-all duration-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
