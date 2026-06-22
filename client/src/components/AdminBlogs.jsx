import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    fetchAdminBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
} from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Edit2, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import HtmlEditor from "./HtmlEditor.jsx";

const inputClass =
    "w-full bg-[#020817] border border-white/10 rounded-[1.2rem] px-6 py-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all";

export default function AdminBlogs({ customToken }) {
    const authContext = useAuth();
    const token = customToken || authContext.token;
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        author: "",
        isPublished: true,
    });
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [existingCoverImage, setExistingCoverImage] = useState("");

    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadBlogs();
    }, [token]);

    const loadBlogs = async () => {
        try {
            setLoading(true);
            const res = await fetchAdminBlogs(token);
            setBlogs(res.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            content: "",
            author: "Admin",
            isPublished: true,
        });
        setCoverImageFile(null);
        setExistingCoverImage("");
        setIsEditing(false);
        setCurrentId(null);
        setShowModal(false);
    };

    const handleEdit = (blog) => {
        setFormData({
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            author: blog.author,
            isPublished: blog.isPublished,
        });
        setExistingCoverImage(blog.coverImage || "");
        setCoverImageFile(null);
        setIsEditing(true);
        setCurrentId(blog._id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("slug", formData.slug);
            payload.append("content", formData.content);
            payload.append("author", formData.author);
            payload.append("isPublished", formData.isPublished);

            if (coverImageFile) {
                payload.append("coverImage", coverImageFile);
            }

            if (isEditing) {
                if (!coverImageFile) {
                    payload.append("existingCoverImage", existingCoverImage);
                }
                await updateBlog(currentId, payload, token);
            } else {
                await createBlog(payload, token);
            }

            resetForm();
            loadBlogs();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteBlog(deletingId, token);
            setDeletingId(null);
            loadBlogs();
        } catch (err) {
            alert(err.message);
        }
    };

    const generateSlug = () => {
        if (!formData.title) return;
        const slug = formData.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setFormData({ ...formData, slug });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/40">Synchronizing Blogs...</p>
        </div>
    );

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center bg-slate-900/40 p-10 rounded-[3rem] border border-white/15 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Blog <span className="text-indigo-400">Management</span></h3>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-2">Publish and manage articles</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="group relative flex items-center gap-4 bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-400 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-95"
                >
                    <Plus size={20} /> Add New Blog
                </button>
            </div>

            {error && (
                <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">⚠️</div>
                    <p className="text-xs font-bold text-red-400/60 uppercase tracking-widest">{error}</p>
                </div>
            )}

            <div className="overflow-x-auto max-h-[75vh] medical-scrollbar rounded-[2rem] border border-white/5 bg-slate-900 shadow-2xl overflow-y-auto">
                <table className="min-w-[1000px] w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="sticky top-0 z-40">
                            <th className="px-6 py-4 bg-[#020817]/95 border-b border-white/5 first:rounded-tl-[2rem]">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Cover</span>
                            </th>
                            <th className="px-6 py-4 bg-[#020817]/95 border-b border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Title & Slug</span>
                            </th>
                            <th className="px-6 py-4 bg-[#020817]/95 border-b border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Author</span>
                            </th>
                            <th className="px-6 py-4 bg-[#020817]/95 border-b border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</span>
                            </th>
                            <th className="px-6 py-4 bg-[#020817]/95 border-b border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Date</span>
                            </th>
                            <th className="px-6 py-4 sticky right-0 z-50 bg-[#020817]/95 border-b border-white/5 rounded-tr-[2rem] text-right">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Controls</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {blogs.map((blog) => (
                            <tr key={blog._id} className="group/row hover:bg-slate-800/40 transition-colors duration-300">
                                <td className="px-6 py-4">
                                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                                        {blog.coverImage ? (
                                            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={16} className="text-white/20" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="text-sm font-black text-white">{blog.title}</div>
                                        <div className="text-[10px] font-mono text-indigo-400/60 truncate max-w-[300px]">/{blog.slug}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-[11px] font-bold text-white/60 uppercase tracking-widest">{blog.author || "Admin"}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-all ${blog.isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-white/40 border-white/10"}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${blog.isPublished ? "bg-current animate-pulse" : "bg-white/20"}`} />
                                        {blog.isPublished ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 sticky right-0 z-30 bg-[#020817]/95 border-l border-white/5 rounded-br-[2rem] text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(blog._id)}
                                            className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit/Create Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 bg-[#020817]/90 flex items-start justify-center z-[9999] p-4 overflow-y-auto pt-10 lg:pt-24">
                    <div className="bg-[#020817] border border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.1)] p-8 lg:p-12 rounded-[3rem] lg:rounded-[4rem] max-w-4xl w-full relative mb-20">
                        <div className="absolute top-0 right-0 p-10">
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-red-500 hover:text-white transition-all">✕</button>
                        </div>

                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-1 w-12 bg-indigo-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Content Protocol</span>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{isEditing ? "Modify" : "Create"} <span className="text-indigo-400">Blog</span></h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400/40 ml-1 mb-2 block">Blog Title</label>
                                        <input required className={inputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} onBlur={generateSlug} placeholder="Title of the blog" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400/40 ml-1 mb-2 block">URL Slug</label>
                                        <input required className={inputClass} value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="url-friendly-slug" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400/40 ml-1 mb-2 block">Author Name</label>
                                        <input className={inputClass} value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} placeholder="Admin" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400/40 ml-1 mb-2 block">Status</label>
                                        <select
                                            className={inputClass}
                                            value={formData.isPublished ? "true" : "false"}
                                            onChange={e => setFormData({ ...formData, isPublished: e.target.value === "true" })}
                                        >
                                            <option value="true">Published</option>
                                            <option value="false">Draft</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400/40 ml-1 block">HTML Content</label>
                                <HtmlEditor
                                    value={formData.content}
                                    onChange={(val) => setFormData({ ...formData, content: val })}
                                    rows={15}
                                />
                            </div>

                            <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400/40 ml-1 mb-4 block">Cover Image</label>

                                {isEditing && existingCoverImage && !coverImageFile && (
                                    <div className="mb-8 p-6 bg-black/20 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-4">Existing Cover</p>
                                        <div className="relative w-48 h-32 rounded-2xl overflow-hidden border border-white/10 group">
                                            <img src={existingCoverImage} alt="Cover" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type="file"
                                        id="cover-upload"
                                        accept="image/*"
                                        onChange={e => setCoverImageFile(e.target.files[0])}
                                        className="hidden"
                                    />
                                    <label htmlFor="cover-upload" className="flex flex-col items-center justify-center w-full py-10 border-2 border-dashed border-white/10 rounded-[2rem] hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group">
                                        <Plus size={32} className="text-white/20 group-hover:text-indigo-400 transition-colors mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Select New Cover Image</span>
                                    </label>

                                    {coverImageFile && (
                                        <div className="mt-6 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-4">Staged for Upload</p>
                                            <div className="relative w-48 h-32 rounded-2xl overflow-hidden border border-indigo-500/20 group">
                                                <img src={URL.createObjectURL(coverImageFile)} alt="Staged" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setCoverImageFile(null)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-black text-xs">CANCEL</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
                                <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Discard</button>
                                <button type="submit" className="px-12 py-5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-400 transition-all active:scale-95">Commit Blog</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirm Modal */}
            {deletingId && createPortal(
                <div className="fixed inset-0 bg-[#020817]/95 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-[#020817] border border-red-500/20 p-12 rounded-[4rem] max-w-md w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.1)]">
                        <div className="absolute top-0 inset-x-0 h-1 bg-red-500" />
                        <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 border border-red-500/20">
                            <Trash2 size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Delete <span className="text-red-500">Blog</span></h2>
                        <p className="text-sm font-bold text-white/40 leading-relaxed italic mb-10">"Are you certain you wish to delete this blog? This action cannot be undone."</p>
                        <div className="flex flex-col gap-4">
                            <button onClick={handleDelete} className="w-full py-5 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-500/20 active:scale-95 transition-all">Confirm Deletion</button>
                            <button onClick={() => setDeletingId(null)} className="w-full py-5 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}