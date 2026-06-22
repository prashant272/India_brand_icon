import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlogBySlug } from "../services/api.js";
import { FadeUp, AuroraBackground } from "../components/Motion.jsx";
import { ArrowLeft, User, Calendar } from "lucide-react";

export default function BlogDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetchBlogBySlug(slug);
                setBlog(res.data);
            } catch (err) {
                setError(err.message || "Failed to load the article.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center relative">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin mb-4" />
                <p className="text-sm font-bold tracking-widest uppercase animate-pulse text-indigo-300">Loading Article...</p>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4 relative">
                <h2 className="text-4xl font-black text-white mb-4">Article Not Found</h2>
                <p className="text-indigo-200/60 mb-8">{error || "The article you are looking for does not exist or has been removed."}</p>
                <button
                    onClick={() => navigate("/blogs")}
                    className="bg-indigo-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-400 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={16} /> Back to Hub
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 relative">
            <div className="max-w-4xl mx-auto  relative z-10">

                <FadeUp>
                    <button
                        onClick={() => navigate("/blogs")}
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-bold uppercase tracking-widest text-xs mb-8"
                    >
                        <ArrowLeft size={16} /> Knowledge Hub
                    </button>
                </FadeUp>

                <FadeUp delay={0.1}>
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-6 font-sans">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-white/60 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-indigo-400" />
                                {blog.author || "Admin"}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-indigo-400" />
                                {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </FadeUp>

                {blog.coverImage && (
                    <FadeUp delay={0.2}>
                        <div className="w-full h-auto max-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 mb-12 shadow-2xl">
                            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                        </div>
                    </FadeUp>
                )}

                <FadeUp delay={0.3}>
                    <div className="bg-[#020817]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
                        {/* Soft decorative glow behind the text */}
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                        <div
                            className="blog-content font-sans relative z-10"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>
                </FadeUp>

            </div>
        </div>
    );
}