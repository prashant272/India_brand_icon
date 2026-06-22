import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPublishedBlogs } from "../services/api.js";
import { PageHero, FadeUp, StaggerContainer, StaggerItem, NeonCard } from "../components/Motion.jsx";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetchPublishedBlogs();
                setBlogs(res.data || []);
            } catch (err) {
                console.error("Failed to fetch blogs:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <>
            <PageHero
                badge="Knowledge Hub"
                icon="📚"
                title={<span>Insights & <span className="text-indigo-400">Perspectives</span></span>}
                subtitle="Explore our latest articles, insights, and thoughts."
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 items-center justify-center ">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
                            <p className="text-sm font-bold tracking-widest uppercase animate-pulse text-indigo-300">Loading Articles...</p>
                        </div>
                    ) : blogs.length > 0 ? (
                        <div className="space-y-20">
                            {/* Slider Section */}
                            <FadeUp>
                                <div className="mb-8">
                                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest flex items-center gap-3 font-sans">
                                        <span className="w-8 h-1 bg-indigo-500 rounded-full"></span> Featured Insights
                                    </h3>
                                </div>
                                <Swiper
                                    spaceBetween={30}
                                    slidesPerView={1}
                                    breakpoints={{
                                        640: { slidesPerView: 2 },
                                        1024: { slidesPerView: 3 },
                                        1280: { slidesPerView: 4 }
                                    }}
                                    centerInsufficientSlides={true}
                                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                                    pagination={{ clickable: true, dynamicBullets: true }}
                                    navigation={true}
                                    modules={[Autoplay, Pagination, Navigation]}
                                    className="w-full pb-16 px-4"
                                >
                                    {blogs.slice(0, 8).map((blog) => (
                                        <SwiperSlide key={`slider-${blog._id}`} className="h-auto">
                                            <NeonCard color="indigo" className="h-full !p-0">
                                                <div
                                                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                                                    className="relative h-full flex flex-col overflow-hidden cursor-pointer group"
                                                >
                                                    <div className="w-full relative overflow-hidden bg-[#020817]">
                                                        {blog.coverImage ? (
                                                            <img
                                                                src={blog.coverImage}
                                                                alt={blog.title}
                                                                className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-1000"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-52 bg-indigo-950/30 flex items-center justify-center text-4xl">📝</div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-90" />

                                                    </div>

                                                    <div className="p-6 text-left flex-1 flex flex-col">
                                                        <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-2">
                                                            {blog.author || "Admin"}
                                                        </p>
                                                        <h3 className="text-xl font-black text-white leading-tight mb-4 group-hover:text-indigo-400 transition-colors line-clamp-3 font-sans">
                                                            {blog.title}
                                                        </h3>

                                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500/60 group-hover:text-indigo-400">Read Article</span>
                                                            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </NeonCard>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </FadeUp>

                            {/* Grid Section */}
                            <div>
                                <div className="mb-8">
                                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest flex items-center gap-3 font-sans">
                                        <span className="w-8 h-1 bg-emerald-500 rounded-full"></span> All Articles
                                    </h3>
                                </div>
                                <StaggerContainer className="flex flex-wrap justify-center gap-6 sm:gap-8">
                                    {blogs.map((blog) => (
                                        <StaggerItem key={blog._id} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-[350px]">
                                            <NeonCard color="emerald" className="h-full !p-0 w-full">
                                                <div
                                                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                                                    className="relative h-full flex flex-col overflow-hidden cursor-pointer group"
                                                >
                                                    <div className="w-full relative overflow-hidden bg-[#020817]">
                                                        {blog.coverImage ? (
                                                            <img
                                                                src={blog.coverImage}
                                                                alt={blog.title}
                                                                className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-1000"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-48 bg-emerald-950/30 flex items-center justify-center text-4xl">📝</div>
                                                        )}
                                                    </div>

                                                    <div className="p-6 text-left flex-1 flex flex-col">
                                                        <p className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.3em] mb-2">
                                                            {blog.author || "Admin"}
                                                        </p>
                                                        <h3 className="text-lg font-black text-white leading-tight mb-4 group-hover:text-emerald-400 transition-colors line-clamp-3 font-sans">
                                                            {blog.title}
                                                        </h3>

                                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/60 group-hover:text-emerald-400">Read</span>
                                                            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </NeonCard>
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-indigo-100/40 font-black uppercase tracking-widest">No articles found.</p>
                        </div>
                    )}
                </div>
            </PageHero>
        </>
    );
}